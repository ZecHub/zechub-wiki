import MdxContainer from "@/components/MdxContainer";
import SideMenu from "@/components/SideMenu/SideMenu";
import { getLocalizedFileContentCached, getRootCached, getMenuTitlesCached } from "@/lib/authAndFetch";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { normalizeMdx } from "@/lib/normalizeMdx";
import { rehypeJsxYouTubeFacade } from "@/lib/rehypeJsxYouTubeFacade";
import { stripFrontmatter } from "@/lib/stripFrontmatter";
import { Metadata } from "next";
import { Suspense } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import MdxComponents from "@/components/MdxComponents/MdxComponent";
import MdxReady from "@/components/MdxReady";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Zcash Shielded Pools (Sprout, Sapling, Orchard) | ZecHub",
    description:
      "Learn about the evolution of Zcash shielded pools: Sprout, Sapling, and Orchard, their zero-knowledge cryptography, and how privacy is maintained.",
    url: `https://zechub.wiki${localePrefix}/using-zcash/shielded-pools`,
    image: getBanner("using-zcash") || "/content-banners/usingzcash.png",
    locale,
    alternates: buildAlternatesAllLocales("/using-zcash/shielded-pools", locale),
  });
}

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const url = `/site/Using_Zcash/Shielded_Pools.md`;
  const urlRoot = `/site/using-zcash`;
  const [markdown, roots, menuTitles, enMenuTitles] = await Promise.all([
    getLocalizedFileContentCached(url, locale || "en"),
    getRootCached(urlRoot),
    getMenuTitlesCached(locale || "en"),
    getMenuTitlesCached("en"),
  ]);
  const content = markdown ? markdown : "No Data or Wrong file";

  // Render MDX on the server (next-mdx-remote/rsc), the same way the [...slug]
  // content route does since the CSP was switched to enforcing. The previous
  // client-side <MDXRemote> (next-mdx-remote) evaluated the compiled source with
  // Reflect.construct(Function, …), which the enforcing script-src blocks (no
  // 'unsafe-eval' in production), so this bespoke page still rendered "couldn't
  // load" after the catch-all route was migrated. MDX options are unchanged, so
  // the page renders exactly as before — only the evaluation moves server-side.
  const mdxSource = normalizeMdx(stripFrontmatter(String(content)));

  return (
    <MdxContainer
      hasSideMenu={true}
      sideMenu={<SideMenu folder={urlRoot} roots={roots} titles={menuTitles} enTitles={enMenuTitles} />}
      roots={roots}
      heroImage={{ src: getBanner(`using-zcash`) }}
    >
      <Suspense
        fallback={<span className="text-center text-3xl">Loading...</span>}
      >
        <MDXRemote
          source={mdxSource}
          components={MdxComponents}
          options={{
            blockJS: true,
            mdxOptions: { rehypePlugins: [rehypeJsxYouTubeFacade] },
          }}
        />
        <MdxReady />
      </Suspense>
    </MdxContainer>
  );
}

export const dynamic = "force-dynamic";
