import MdxContainer from "@/components/MdxContainer";
import SideMenu from "@/components/SideMenu/SideMenu";
import { getLocalizedFileContentCached, getRootCached, getMenuTitlesCached } from "@/lib/authAndFetch";
import { genMetadata, getBanner } from "@/lib/helpers";
import { normalizeMdx } from "@/lib/normalizeMdx";
import { Metadata } from "next";
import DynamicComponent from "next/dynamic";
import { serialize } from 'next-mdx-remote/serialize';

const MdxComponent = DynamicComponent(
  () => import("@/components/MdxRenderer"),
  {
    loading: () => <span className="text-center text-3xl">Loading...</span>,
  }
);

export const metadata: Metadata = genMetadata({
  title: "Shielded pools",
  url: "https://zechub.wiki/using-zcash/shielded-pools",
  image: getBanner(`using-zcash`),
});

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

  // ← This fixes the MDXRemote error
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
