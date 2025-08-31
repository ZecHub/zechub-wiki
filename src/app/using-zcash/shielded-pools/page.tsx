import MdxContainer from "@/components/MdxContainer";
import SideMenu from "@/components/SideMenu/SideMenu";
import {
  getFileContent,
  getFileContentCached,
  getRoot,
  getRootCached,
} from "@/lib/authAndFetch";
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

  // const markdown = await getFileContent(url);
  const markdown = await getFileContentCached(url);

  const content = markdown ? markdown : "No Data or Wrong file";
  const urlRoot = `/site/using-zcash`;
  // const roots = await getRoot(urlRoot);
  const roots = await getRootCached(urlRoot);

  return (
    <MdxContainer
      hasSideMenu={true}
      sideMenu={<SideMenu folder={urlRoot} roots={roots} />}
      roots={roots}
      heroImage={{ src: imgUrl }}
    >
      <MdxComponent source={content} slug={"shielded-pools"} />
    </MdxContainer>
  );
}
