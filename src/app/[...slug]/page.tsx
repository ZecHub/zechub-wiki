import MdxContainer from "@/components/MdxContainer";
import SideMenu from "@/components/SideMenu/SideMenu";
import { getFileContentCached, getRootCached } from "@/lib/authAndFetch";
import { genMetadata, getBanner, getDynamicRoute } from "@/lib/helpers";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';   // ← NEW: enables GitHub-style tables

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
  let markdown: any = null;
  let roots: any[] = [];
  try {
    const [md, rootsRaw] = await Promise.all([
      getFileContentCached(url).catch(() => null),
      getRootCached(urlRoot).catch(() => []),
    ]);
    markdown = md;
    roots = Array.isArray(rootsRaw) ? rootsRaw : [];
  } catch {
    markdown = null;
    roots = [];
  }

  const imgUrl = getBanner(slug[0]) || "";
  const imgUrlDark = getBanner(`${slug[0]}-dark`) || imgUrl;

  if (!markdown) {
    return (
      <MdxContainer
        hasSideMenu={roots.length > 0}
        sideMenu={roots.length > 0 ? <SideMenu folder={slug[0]} roots={roots} /> : null}
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

  // ← UPDATED: Now supports tables everywhere
  const serializedSource = await serialize(String(markdown || ""), {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  });

  return (
    <MdxContainer
      hasSideMenu={roots.length > 0}
      sideMenu={roots.length > 0 ? <SideMenu folder={slug[0]} roots={roots} /> : null}
      roots={roots}
      heroImage={{ src: imgUrl, darkSrc: imgUrlDark }}
    >
      <Suspense fallback={<span className="text-center text-3xl">Loading...</span>}>
        <LazyMdxComponent source={serializedSource} />
      </Suspense>
    </MdxContainer>
  );
}

export const dynamic = "force-dynamic";