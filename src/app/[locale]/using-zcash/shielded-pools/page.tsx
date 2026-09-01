import MdxContainer from "@/components/MdxContainer";
import SideMenu from "@/components/SideMenu/SideMenu";
import { getLocalizedFileContentCached, getRootCached, getMenuTitlesCached } from "@/lib/authAndFetch";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { normalizeMdx } from "@/lib/normalizeMdx";
import { Metadata } from "next";
import DynamicComponent from "next/dynamic";
import { serialize } from "next-mdx-remote/serialize";

const MdxComponent = DynamicComponent(
  () => import("@/components/MdxRenderer"),
  {
    loading: () => <span className="text-center text-3xl">Loading...</span>,
  }
);

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

  const mdxSource = await serialize(normalizeMdx(String(content)), {});

  return (
    <MdxContainer
      hasSideMenu={true}
      sideMenu={<SideMenu folder={urlRoot} roots={roots} titles={menuTitles} enTitles={enMenuTitles} />}
      roots={roots}
      heroImage={{ src: getBanner(`using-zcash`) }}
    >
      <MdxComponent source={mdxSource} />
    </MdxContainer>
  );
}

export const dynamic = "force-dynamic";
