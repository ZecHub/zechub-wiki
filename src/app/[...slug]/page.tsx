import MdxContainer from "@/components/MdxContainer";
import ResearchIndexGrid from "@/components/Research/ResearchIndexGrid";
import SideMenu from "@/components/SideMenu/SideMenu";
import {
  getFileContentCached,
  getRootCached,
  getAllMarkdownRecursively,
  getSiteFolders,
} from "@/lib/authAndFetch";
import {
  genMetadata,
  getBanner,
  getDynamicRoute,
  transformUri,
  transformGithubFilePathToWikiLink,
} from "@/lib/helpers";
import { normalizeMdx } from "@/lib/normalizeMdx";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
const LazyMdxComponent = React.lazy(() =>
  import("@/components/MdxRenderer")
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await params;
  if (slug.length === 0) {
    return genMetadata({ title: "Zechub", url: "https://zechub.wiki" });
  }
  const folder = slug[0] || "";
  const capitalized = folder.charAt(0).toUpperCase() + folder.slice(1).replace(/-/g, " ");
  const title = slug.length > 1 && slug[1]
    ? `Zechub - ${capitalized} | ${slug[1].replace(/-/g, " ")}`
    : `Zechub - ${capitalized}`;
  return genMetadata({ title, url: `https://zechub.wiki/${slug.join("/")}` });
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  headers();
  let slug: string[] = [];
  try {
    const resolved = await props.params;
    slug = resolved.slug || [];
  } catch {
    return notFound();
  }
  if (slug.length === 0) return notFound();
  if (slug[0] === ".well-known") return null;

  const url = getDynamicRoute(slug);
  const urlRoot = `/site/${slug[0]}`;

  const isResearchIndex = slug.length === 1 && slug[0] === "research";
  const isResearchSeries = slug.length === 2 && slug[0] === "research" && slug[1] === "zcash-foundations-series";
  const isResearchArticle = slug[0] === "research" && slug.length > 1;

  let contentUrl = url;
  let markdown: any = null;
  let roots: any[] = [];
  let dynamicCovers: Record<string, { src: string; alt: string }> = {};

  try {
    if (isResearchIndex) {
      const topLevel = await getRootCached(urlRoot).catch(() => []);
      let seriesArticles: string[] = [];
      try {
        seriesArticles = await getAllMarkdownRecursively("site/Research/zcash-foundations-series");
      } catch {}
      roots = [...topLevel, ...seriesArticles];
      markdown = null;
    }
    else if (isResearchSeries) {
      const seriesName = slug[1];
      const basePath = `site/Research/${seriesName}`;
      const collectArticles = async (path: string): Promise<string[]> => {
        try {
          const items = await getSiteFolders(path).catch(() => []);
          let mds: string[] = [];
          for (const item of items) {
            if (item.endsWith(".md")) mds.push(item);
            else if (!item.includes(".") && !item.endsWith(".md")) {
              const sub = await collectArticles(item);
              mds = mds.concat(sub);
            }
          }
          return mds;
        } catch { return []; }
      };
      const articlePaths = await collectArticles(basePath);
      await Promise.all(
        articlePaths.map(async (filePath) => {
          try {
            const content = await getFileContentCached(filePath);
            if (!content) return;
            const imgMatch = content.match(
              /!\[[^\]]*\]\(([^)]+?)\)|<img[^>]+src=["']([^"']+)["']/
            );
            if (imgMatch) {
              let imgSrc = imgMatch[1] || imgMatch[2];
              if (imgSrc && !imgSrc.startsWith("http")) {
                const dir = filePath.substring(0, filePath.lastIndexOf("/"));
                imgSrc = `https://raw.githubusercontent.com/ZecHub/zechub/main/${dir}/${imgSrc}`;
              }
              const wikiSlug = transformGithubFilePathToWikiLink(filePath.replace(/\.md$/i, ""));
              dynamicCovers[wikiSlug] = { src: imgSrc, alt: "Article thumbnail" };
            }
          } catch {}
        })
      );
      roots = articlePaths;
      markdown = null;
    }
    else {
      const rootsRaw = await getRootCached(urlRoot).catch(() => []);
      roots = Array.isArray(rootsRaw) ? rootsRaw : [];

      if (isResearchArticle && !isResearchSeries) {
        const lastSegment = slug[slug.length - 1];
        const norm = (s: string) => s.toLowerCase().replace(/[-_ ]/g, "");
        const target = norm(lastSegment);

        const match = roots.find((r: string) => {
          if (typeof r !== "string" || !r.endsWith(".md")) return false;
          const base = r.split("/").pop()!.replace(/\.md$/i, "");
          return norm(base) === target;
        });

        if (match) {
          contentUrl = match;
        } else {
          const subPath = slug.slice(1).join("/");
          contentUrl = `site/Research/${subPath}.md`;
        }
      }

      const md = await getFileContentCached(contentUrl).catch(() => null);
      markdown = md;
    }
  } catch (e) {
    console.error('Failed to fetch and parse .md file: ', e);
    markdown = null;
    roots = [];
  }

  // Preprocessing
  let processedMarkdown = String(markdown || "");
  if (isResearchArticle && processedMarkdown) {
    const articleDir = `site/Research/${slug.slice(1, -1).join("/")}`;
    processedMarkdown = processedMarkdown.replace(
      /!\[([^\]]*)\]\(([^)]+?)\)/g,
      (match, alt, src) => {
        if (src.startsWith("http") || src.startsWith("/") || src.startsWith("#")) return match;
        return `![${alt}](https://raw.githubusercontent.com/ZecHub/zechub/main/${articleDir}/${src})`;
      }
    );
    processedMarkdown = processedMarkdown.replace(
      /([^\n])\n?<details>/g,
      '$1\n\n<details>'
    );
    processedMarkdown = processedMarkdown.replace(
      /<details>\s*<summary>\s*Answer\s*<\/summary>/gi,
      '\n\n<details>\n<summary>Answer</summary>\n\n'
    );
    processedMarkdown = processedMarkdown.replace(
      /<\/details>([^\n])/g,
      '</details>\n\n$1'
    );
  }

  const imgUrl = getBanner(slug[0]) || "";
  const imgUrlDark = getBanner(`${slug[0]}-dark`) || imgUrl;
  const showSideMenu = slug[0] !== "research" && roots.length > 0;
  const slugToTitle = (segment: string) =>
    segment.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const researchSegment = slug.length > 1 ? slug[slug.length - 1] : "";
  const researchBreadcrumbLabel = researchSegment ? slugToTitle(researchSegment) : "";
  const canonicalWikiUrl = `https://zechub.wiki/${slug.join("/")}`;

  if (isResearchIndex) {
    return (
      <MdxContainer hasSideMenu={showSideMenu} sideMenu={showSideMenu ? <SideMenu folder={slug[0]} roots={roots} /> : null} roots={roots} heroImage={{ src: imgUrl, darkSrc: imgUrlDark }}>
        <ResearchIndexGrid roots={roots.filter(r => !r.includes("zcash-foundations-series"))} />
        <div className="px-2 pb-12">
          <h2 className="mb-6 text-3xl font-bold">Series</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <a href="/research/zcash-foundations-series" className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-background transition-shadow hover:shadow-md dark:border-slate-600">
              <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted flex items-center justify-center">
                <div className="text-center"><div className="text-4xl mb-2">📚</div><p className="text-lg font-semibold">Zcash Foundations Series</p></div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Research Series</p>
                <h3 className="mt-1 text-lg font-bold text-foreground group-hover:underline">Zcash Foundations Series</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">Foundational articles on Zcash shielded transactions, privacy, and protocol design.</p>
              </div>
            </a>
          </div>
        </div>
      </MdxContainer>
    );
  }

  if (isResearchSeries) {
    return (
      <MdxContainer hasSideMenu={false} sideMenu={null} roots={roots} heroImage={{ src: imgUrl, darkSrc: imgUrlDark }}>
        <div className="px-2 pb-8">
          <h1 className="text-4xl font-bold mb-2">Zcash Foundations Series</h1>
          <p className="text-muted-foreground mb-8">Articles in this series</p>
        </div>
        <ResearchIndexGrid roots={roots} dynamicCovers={dynamicCovers} />
      </MdxContainer>
    );
  }

  if (!markdown) {
    return (
      <MdxContainer hasSideMenu={showSideMenu} sideMenu={showSideMenu ? <SideMenu folder={slug[0]} roots={roots} /> : null} roots={roots} heroImage={{ src: imgUrl, darkSrc: imgUrlDark }}>
        <div className="px-6 py-12 text-center">
          <h1 className="text-5xl font-bold mb-6 capitalize">{slug[0].replace(/-/g, " ")}</h1>
          <p className="text-xl text-muted-foreground">Browse the articles using the sidebar on the left 👈</p>
        </div>
      </MdxContainer>
    );
  }

  const serializedSource = await serialize(normalizeMdx(processedMarkdown), {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypeRaw, { passThrough: ['mdxJsxFlowElement', 'mdxFlowExpression', 'mdxJsxTextElement', 'mdxTextExpression'] }]],
    },
  });

  return (
    <MdxContainer
      hasSideMenu={showSideMenu}
      sideMenu={showSideMenu ? <SideMenu folder={slug[0]} roots={roots} /> : null}
      roots={roots}
      heroImage={{ src: imgUrl, darkSrc: imgUrlDark }}
      layoutVariant={isResearchArticle ? "research" : "default"}
      researchMeta={isResearchArticle ? { breadcrumbLabel: researchBreadcrumbLabel, shareUrl: canonicalWikiUrl, pageTitle: researchBreadcrumbLabel } : undefined}
    >
      <Suspense fallback={<span className="text-center text-3xl">Loading...</span>}>
        <LazyMdxComponent source={serializedSource} />
      </Suspense>
    </MdxContainer>
  );
}

export const dynamic = "force-dynamic";
