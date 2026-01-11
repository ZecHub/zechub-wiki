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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const param = await Promise.resolve(params);
  const slug: any = param.slug;
  const word = slug[0];
  const firstLetter = word.charAt(0);

  const firstLetterCap = firstLetter.toUpperCase();
  const remainingLetters = word.slice(1).replace(/-/g, " ");
  const capitalizedWord = firstLetterCap + remainingLetters;

  return genMetadata({
    title: slug
      ? `Zechub - ${capitalizedWord} | ${slug[1].replace(/-/g, " ")}`
      : "Zechub",
    url: `https://zechub.wiki/${slug.join("/")}`,
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
  const { slug } = await props.params;
  const url = getDynamicRoute(slug);
  const urlRoot = `/site/${slug[0]}`;

  const [markdown, roots] = await Promise.all([
    getFileContentCached(url),
    getRootCached(urlRoot),
  ]);

  const content = markdown ? markdown : "No Data or Wrong file";
  if (slug[0] === ".well-known") return null;

  // console.log(url);
  // console.log(content);

  if (markdown) {
    const imgUrl = getBanner(slug[0]);

    return (
      <MdxContainer
        hasSideMenu={!!roots && roots.length > 0}
        sideMenu={roots ? <SideMenu folder={slug[0]} roots={roots} /> : null}
        roots={roots ?? []}
        heroImage={{ src: imgUrl }}
      >
        <MdxComponent source={String(content)} slug={slug[1]} />
      </MdxContainer>
    );
  }

  return notFound();
}

// ✅ Enable ISR
export const revalidate = 60; // Rebuild every 60s (tune as needed)
