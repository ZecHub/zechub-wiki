import MdxContainer from "@/components/MdxContainer";
import ResearchIndexGrid from "@/components/Research/ResearchIndexGrid";
import SideMenu from "@/components/SideMenu/SideMenu";
import {
  getFileContentCached,
  getLocalizedFileContentCached,
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
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const LazyMdxComponent = React.lazy(() => import("@/components/MdxRenderer"));

function extractFirstContentImage(
  content: string,
  filePath: string,
): string | null {
  const matches =
    content.match(/!\[[^\]]*\]\(([^)]+?)\)|<img[^>]+src=["']([^"']+)["']/g) ||
    [];
  for (const m of matches) {
    const single = m.match(
      /!\[[^\]]*\]\(([^)]+?)\)|<img[^>]+src=["']([^"']+)["']/,
    );
    if (!single) continue;
    const src = single[1] || single[2];
    if (src && !/shields\.io|badge|edit/i.test(src)) {
      if (src.startsWith("http")) return src;
      const dir = filePath.substring(0, filePath.lastIndexOf("/"));
      return `https://raw.githubusercontent.com/ZecHub/zechub/main/${dir}/${src}`;
    }
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[]; locale: string }>;
}): Promise<Metadata> {
  const { slug = [] } = await params;
  if (slug.length === 0) {
    return genMetadata({ title: "Zechub", url: "https://zechub.wiki" });
  }
  const folder = slug[0] || "";
  const capitalized =
    folder.charAt(0).toUpperCase() + folder.slice(1).replace(/[-/]/g, " "); // ← FIXED
  const title =
    slug.length > 1 && slug[1]
      ? `Zechub - ${capitalized} | ${slug[1].replace(/-/g, " ")}`
      : `Zechub - ${capitalized}`;
  return genMetadata({ title, url: `https://zechub.wiki/${slug.join("/")}` });
}

export default async function Page(props: {
  params: Promise<{ slug: string[]; locale: string }>;
}) {
  headers();
  let slug: string[] = [];
  let locale = "en";
  try {
    const resolved = await props.params;
    slug = resolved.slug || [];
    locale = resolved.locale || "en";
  } catch {
    return notFound();
  }
  if (slug.length === 0) return notFound();
  if (slug[0] === ".well-known") return null;

  const url = getDynamicRoute(slug);
  const urlRoot = `/site/${slug[0]}`;

  const isResearchIndex = slug.length === 1 && slug[0] === "research";
  const isResearchSeries =
    slug.length === 2 &&
    slug[0] === "research" &&
    slug[1] === "zcash-foundations-series";
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
        seriesArticles = await getAllMarkdownRecursively(
          "site/Research/zcash-foundations-series",
        );
      } catch {}

      const nonSeriesRoots = topLevel.filter(
        (p: string) => !p.includes("zcash-foundations-series"),
      );

      const indexDynamicCovers: Record<string, { src: string; alt: string }> =
        {};
      await Promise.all(
        nonSeriesRoots.map(async (filePath: string) => {
          try {
            const content = await getFileContentCached(filePath);
            if (!content) return;
            const imgSrc = extractFirstContentImage(content, filePath);
            if (imgSrc) {
              const wikiSlug = transformGithubFilePathToWikiLink(
                filePath.replace(/\.md$/i, ""),
              );
              indexDynamicCovers[wikiSlug] = {
                src: imgSrc,
                alt: "Article thumbnail",
              };
            }
          } catch {}
        }),
      );

      roots = [...topLevel, ...seriesArticles];

      return (
        <MdxContainer
          hasSideMenu={false}
          sideMenu={null}
          roots={roots}
          heroImage={{
            src: getBanner(slug[0]) || "",
            darkSrc: getBanner(`${slug[0]}-dark`) || getBanner(slug[0]) || "",
          }}
        >
          {/* === Series Section (On Top) === */}
          <div className="px-2 pb-10">
            <div className="mb-5 px-1">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Series
              </h2>
              <p className="mt-1.5 text-[15px] text-muted-foreground">
                Deep dives into core Zcash concepts
              </p>
            </div>

            <div className="max-w-2xl">
              <a
                href="/research/zcash-foundations-series"
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-background transition-all active:scale-[0.985] sm:hover:border-slate-300 sm:hover:shadow-lg dark:border-slate-700 dark:sm:hover:border-slate-600"
              >
                <div
                  className="relative w-full shrink-0 overflow-hidden
                                bg-gradient-to-br from-zinc-700 to-zinc-500
                                border-b border-zinc-700
                                flex items-center justify-center
                                aspect-[16/9] sm:aspect-[2.2/1] lg:aspect-[2.5/1]"
                >
                  <div className="text-center px-6">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                      <span className="text-5xl">📚</span>
                    </div>
                    <p className="text-2xl font-semibold text-white tracking-tight">
                      Zcash Foundations Series
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-2">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Core Series
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    Zcash Foundations Series
                  </h3>

                  <p className="mt-3 text-[15px] text-muted-foreground">
                    Foundational articles on shielded transactions, privacy
                    models, and protocol design.
                  </p>

                  <div className="mt-auto pt-5 text-sm font-medium text-muted-foreground group-active:text-foreground transition-colors">
                    Explore the series →
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* === Research Articles Section === */}
          <div className="px-2 pb-12">
            <div className="mb-5 px-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Research Articles
              </h2>
              <p className="mt-1.5 text-[15px] text-muted-foreground">
                Articles and notes from the ZecHub community.
              </p>
            </div>

            <ResearchIndexGrid
              roots={nonSeriesRoots}
              dynamicCovers={indexDynamicCovers}
              showHeader={false}
            />
          </div>
        </MdxContainer>
      );
    } else if (isResearchSeries) {
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
        } catch {
          return [];
        }
      };
      const articlePaths = await collectArticles(basePath);
      await Promise.all(
        articlePaths.map(async (filePath) => {
          try {
            const content = await getFileContentCached(filePath);
            if (!content) return;
            const imgSrc = extractFirstContentImage(content, filePath);
            if (imgSrc) {
              const wikiSlug = transformGithubFilePathToWikiLink(
                filePath.replace(/\.md$/i, ""),
              );
              dynamicCovers[wikiSlug] = {
                src: imgSrc,
                alt: "Article thumbnail",
              };
            }
          } catch {}
        }),
      );
      roots = articlePaths;
      markdown = null;

      return (
        <MdxContainer
          hasSideMenu={false}
          sideMenu={null}
          roots={roots}
          heroImage={{
            src: getBanner(slug[0]) || "",
            darkSrc: getBanner(`${slug[0]}-dark`) || getBanner(slug[0]) || "",
          }}
        >
          <div className="px-2 pb-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">📚</span>
                <h1 className="text-2xl imd:text-4xl font-bold">
                  Zcash Foundations Series
                </h1>
              </div>
              <p className="max-w-3xl text-base text-muted-foreground">
                A collection of foundational articles covering Zcash shielded
                transactions, privacy models, protocol design, and core concepts
                that power the network.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-muted px-3 py-1">
                  Shielded Transactions
                </span>
                <span className="rounded-full bg-muted px-3 py-1">
                  Privacy Models
                </span>
                <span className="rounded-full bg-muted px-3 py-1">
                  Protocol Design
                </span>
                <span className="rounded-full bg-muted px-3 py-1">
                  Zero Knowledge
                </span>
              </div>
            </div>
          </div>

          <ResearchIndexGrid
            roots={roots}
            dynamicCovers={dynamicCovers}
            showHeader={false}
          />
        </MdxContainer>
      );
    } else {
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

      const md = await getLocalizedFileContentCached(contentUrl, locale).catch(
        () => null,
      );
      markdown = md;
    }
  } catch (e) {
    console.error("Failed to fetch and parse .md file: ", e);
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
        if (
          src.startsWith("http") ||
          src.startsWith("/") ||
          src.startsWith("#")
        )
          return match;
        return `![${alt}](https://raw.githubusercontent.com/ZecHub/zechub/main/${articleDir}/${src})`;
      },
    );
    processedMarkdown = processedMarkdown.replace(
      /([^\n])\n?<details>/g,
      "$1\n\n<details>",
    );
    processedMarkdown = processedMarkdown.replace(
      /<details>\s*<summary>\s*Answer\s*<\/summary>/gi,
      "\n\n<details>\n<summary>Answer</summary>\n\n",
    );
    processedMarkdown = processedMarkdown.replace(
      /<\/details>([^\n])/g,
      "</details>\n\n$1",
    );
  }

  const imgUrl = getBanner(slug[0]) || "";
  const imgUrlDark = getBanner(`${slug[0]}-dark`) || imgUrl;
  const showSideMenu = slug[0] !== "research" && roots.length > 0;
  const slugToTitle = (segment: string) =>
    segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const researchSegment = slug.length > 1 ? slug[slug.length - 1] : "";
  const researchBreadcrumbLabel = researchSegment
    ? slugToTitle(researchSegment)
    : "";
  const canonicalWikiUrl = `https://zechub.wiki/${slug.join("/")}`;

  if (!markdown) {
    return (
      <MdxContainer
        hasSideMenu={showSideMenu}
        sideMenu={
          showSideMenu ? <SideMenu folder={slug[0]} roots={roots} /> : null
        }
        roots={roots}
        heroImage={{ src: imgUrl, darkSrc: imgUrlDark }}
      >
        <div className="px-6 py-12 text-center">
          <h1 className="text-5xl font-bold mb-6 capitalize">
            {slug[0].replace(/-/g, " ")}
          </h1>
          <p className="text-xl text-muted-foreground">
            Browse the articles using the sidebar on the left 👈
          </p>
        </div>
      </MdxContainer>
    );
  }

  const serializedSource = await serialize(normalizeMdx(processedMarkdown), {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypeRaw,
          {
            passThrough: [
              "mdxJsxFlowElement",
              "mdxFlowExpression",
              "mdxJsxTextElement",
              "mdxTextExpression",
            ],
          },
        ],
      ],
    },
  });

  return (
    <MdxContainer
      hasSideMenu={showSideMenu}
      sideMenu={
        showSideMenu ? <SideMenu folder={slug[0]} roots={roots} /> : null
      }
      roots={roots}
      heroImage={{ src: imgUrl, darkSrc: imgUrlDark }}
      layoutVariant={isResearchArticle ? "research" : "default"}
      researchMeta={
        isResearchArticle
          ? {
              breadcrumbLabel: researchBreadcrumbLabel,
              shareUrl: canonicalWikiUrl,
              pageTitle: researchBreadcrumbLabel,
            }
          : undefined
      }
    >
      <Suspense
        fallback={<span className="text-center text-3xl">Loading...</span>}
      >
        <LazyMdxComponent source={serializedSource} />
      </Suspense>
    </MdxContainer>
  );
}

export const dynamic = "force-dynamic";