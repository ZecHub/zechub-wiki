import MdxContainer from "@/components/MdxContainer";
import SideMenu from "@/components/SideMenu/SideMenu";
import { getFileContentCached, getRootCached } from "@/lib/authAndFetch";
import { genMetadata, getBanner, getDynamicRoute } from "@/lib/helpers";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

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

  return genMetadata({
    title,
    url: `https://zechub.wiki/${slug.join("/")}`,
  });
}

const MdxComponent = dynamic(
  () => import("@/components/MdxComponents/MdxComponent"),
  { loading: () => <span className="text-center text-3xl">Loading...</span> }
);

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
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

  // 🔥 Stronger error handling — never shows the 404 in console
  let markdown: any = null;
  let roots: any[] = [];

  try {
    const [md, rootsRaw] = await Promise.all([
      getFileContentCached(url).catch(() => null),
      getRootCached(urlRoot).catch(() => []),
    ]);
    markdown = md;
    roots = Array.isArray(rootsRaw) ? rootsRaw : [];
  } catch (err) {
    // Silently ignore any remaining GitHub 404s
    markdown = null;
    roots = [];
  }

  const imgUrl = getBanner(slug[0]) || "";

  // === CATEGORY PAGES (Tutorials, Guides, etc.) ===
  if (!markdown) {
    return (
      <MdxContainer
        hasSideMenu={roots.length > 0}
        sideMenu={roots.length > 0 ? <SideMenu folder={slug[0]} roots={roots} /> : null}
        roots={roots}
        heroImage={{ src: imgUrl }}
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

  // === ARTICLE PAGES ===
  return (
    <MdxContainer
      hasSideMenu={roots.length > 0}
      sideMenu={roots.length > 0 ? <SideMenu folder={slug[0]} roots={roots} /> : null}
      roots={roots}
      heroImage={{ src: imgUrl }}
    >
      <MdxComponent source={String(markdown)} slug={slug[1] ?? ""} />
    </MdxContainer>
  );
}

export const revalidate = 60;