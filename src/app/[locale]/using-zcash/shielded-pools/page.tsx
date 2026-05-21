import MdxContainer from "@/components/MdxContainer";
import SideMenu from "@/components/SideMenu/SideMenu";
import { getFileContent, getFileContentCached, getMarkdownFiles, getRootCached } from "@/lib/authAndFetch";
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

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const url = `/site/Using_Zcash/Shielded_Pools.md`;
  const urlRoot = `/site/using-zcash`;
  const [markdown, roots] = await Promise.all([
    getFileContent(url, locale),
    getMarkdownFiles(urlRoot),
  ]);
  const content = markdown ? markdown : "No Data or Wrong file";

  // ← This fixes the MDXRemote error
  const mdxSource = await serialize(normalizeMdx(String(content)), {});

  return (
    <MdxContainer
      hasSideMenu={true}
      sideMenu={<SideMenu folder={urlRoot} roots={roots} />}
      roots={roots}
      heroImage={{ src: getBanner(`using-zcash`) }}
    >
      <MdxComponent source={mdxSource} />
    </MdxContainer>
  );
}

export const dynamic = "force-dynamic";
