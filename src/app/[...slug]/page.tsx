import dynamic from "next/dynamic";
import Image from "next/image";
import { getFileContent, getRoot } from "@/lib/authAndFetch";
import {
  getDynamicRoute,
  getBanner,
  genMetadata,
} from "@/lib/helpers";
import { Metadata } from "next";
import SideMenu from "@/components/SideMenu/SideMenu";

export const metadata: Metadata = genMetadata({
  title: "Donate now",
  url: "https://zechub.wiki/donation",
});

const MdxComponent = dynamic(() => import("@/components/MdxComponents/MdxComponent"), {
  loading: () => <span className="text-center text-3xl">Loading...</span>,
});

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;
  const url = getDynamicRoute(slug);
  const markdown = await getFileContent(url);
  const content = markdown ? markdown : "No Data or Wrong file";
  const urlRoot = `/site/${slug[0]}`;
  const roots = await getRoot(urlRoot);

  const imgUrl = getBanner(slug[0]);

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
        className={`flex flex-col space-y-5 ${
          roots && roots.length > 0 ? "md:flex-row md:space-x-5" : "md:flex-col"
        } h-auto w-full p-5`}
      >
        {roots && roots.length > 0 && (
          <div className="w-auto md:w-2/5  relative">
            <SideMenu folder={slug[0]} roots={roots} />
          </div>
        )}
        <section className="h-auto w-full border-t-4 md:border-l-4 p-3">
          <div>
            <MdxComponent source={content} slug={slug[1]} />
          </div>
        </section>
      </div>
    </main>
  );
}
