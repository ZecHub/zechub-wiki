import dynamic from "next/dynamic";
import Image from "next/image";
import { getFileContent, getRoot } from "@/lib/authAndFetch";
import { getBanner } from "@/lib/helpers";
import SideMenu from "@/components/SideMenu/SideMenu";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";

const imgUrl = getBanner(`using-zcash`);

export const metadata: Metadata = genMetadata({
  title: "Shielded pools",
  url: "https://zechub.wiki/using-zcash/shielded-pools",
  image: imgUrl,
});

const MdxComponent = dynamic(() => import("@/components/MdxComponents/MdxComponent"), {
  loading: () => <span className="text-center text-3xl">Loading...</span>,
});

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;
  const url = `/site/Using_Zcash/Shielded_Pools.md`;

  const markdown = await getFileContent(url);

  const content = markdown ? markdown : "No Data or Wrong file";
  const urlRoot = `/site/using-zcash`;
  const roots = await getRoot(urlRoot);


  return (
    <main>
      <div className="flex justify-center w-full  mb-5 bg-transparent rounded pb-4">
        <Image
          className="w-full mb-5 object-cover "
          alt="wiki-banner"
          width={800}
          height={50}
          src={imgUrl != undefined ? imgUrl : "/wiki-banner.avif"}
        />
      </div>

      <div
        id="content"
        className={`flex shielded-pools flex-col space-y-5 ${
          roots && roots.length > 0 ? "md:flex-row md:space-x-5" : "md:flex-col"
        } h-auto w-full md:p-5`}
      >
        {roots && roots.length > 0 && (
          <div className="w-auto md:w-2/5  relative">
            <SideMenu folder={urlRoot} roots={roots} />
          </div>
        )}

        <section className="h-auto w-full border-t-2 md:border-l-2 px-3">
          <div>
            <MdxComponent source={content} slug={"shielded-pools"} />
          </div>
        </section>
      </div>
    </main>
  );
}
