import MdxContainer from "@/components/MdxContainer";
import SideMenu from "@/components/SideMenu/SideMenu";
import { getFileContentCached, getRootCached } from "@/lib/authAndFetch";
import { genMetadata, getBanner } from "@/lib/helpers";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const imgUrl = getBanner(`using-zcash`);

export const metadata: Metadata = genMetadata({
  title: "Shielded pools",
  url: "https://zechub.wiki/using-zcash/shielded-pools",
  image: imgUrl,
});

const MdxComponent = dynamic(
  () => import("@/components/MdxComponents/MdxComponent"),
  {
    loading: () => <span className="text-center text-3xl">Loading...</span>,
  }
);

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  const url = `/site/Using_Zcash/Shielded_Pools.md`;

  const urlRoot = `/site/using-zcash`;
  const [markdown, roots] = await Promise.all([
    getFileContentCached(url),
    getRootCached(urlRoot),
  ]);

  const content = markdown ? markdown : "No Data or Wrong file";

  return (
    <MdxContainer
      hasSideMenu={true}
      sideMenu={<SideMenu folder={urlRoot} roots={roots} />}
      roots={roots}
      heroImage={{ src: imgUrl }}
    >
      <MdxComponent source={String(content)} slug={"shielded-pools"} />
    </MdxContainer>
  );
}
