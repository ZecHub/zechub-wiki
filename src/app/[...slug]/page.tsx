import MdxContainer from "@/components/MdxContainer";
import SideMenu from "@/components/SideMenu/SideMenu";
import { getFileContent, getRoot } from "@/lib/authAndFetch";
import { genMetadata, getBanner, getDynamicRoute } from "@/lib/helpers";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { serialize } from 'next-mdx-remote/serialize';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const param = await Promise.resolve(params);
  const slug = param.slug;
  const word = slug[0];
  const firstLetter = word.charAt(0);

  const firstLetterCap = firstLetter.toUpperCase();
  const remainingLetters = word.slice(1);
  const capitalizedWord = firstLetterCap + remainingLetters;

  return genMetadata({
    title: slug ? `${capitalizedWord} | Zechub` : "Zechub",
    url: "https://zechub.wiki/donation",
  });
}

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
  const url = getDynamicRoute(slug);

  console.log({url });
  const markdown = await getFileContent(url);
  const content = markdown ? markdown : "No Data or Wrong file";


  if (markdown) {
    const urlRoot = `/site/${slug[0]}`;
    const roots = await getRoot(urlRoot);
    const imgUrl = getBanner(slug[0]);

    console.log({ slug, url, urlRoot, roots, imgUrl });

    return (
      <MdxContainer
        hasSideMenu={!!roots && roots.length > 0}
        sideMenu={roots ? <SideMenu folder={slug[0]} roots={roots} /> : null}
        roots={roots ?? []}
        heroImage={{ src: imgUrl }}
      >
        <MdxComponent source={content} slug={slug[1]} />
      </MdxContainer>
    );
  }

  /* <main>
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
          className={`flex flex-col space-y-5 container m-auto ${
            roots && roots.length > 0
              ? "md:flex-row md:space-x-5"
              : "md:flex-col"
          } h-auto pt-5 px-2`}
        >
          {roots && roots.length > 0 && (
            <div className="w-auto md:w-2/5  relative">
              <SideMenu folder={slug[0]} roots={roots} />
            </div>
          )}
          <section className="h-auto w-full border-t-2 md:border-l-2 p-3">
            <MdxComponent source={content} slug={slug[1]} />
          </section>
        </div>
      </main> */

  return notFound();
}