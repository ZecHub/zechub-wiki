import Client from "./ClientPage";
import { genMetadata, getBanner } from "@/lib/helpers";
import { getDictionary } from "@/lib/getDictionary";
import { Metadata } from "next";
import { parseCommunityProjects } from "@/lib/parseCommunityProjects";
import { attachImages } from "@/lib/communityProjectImages";
import { buildAlternates } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";

type Dictionary = {
  pages?: {
    zcashCommunity?: {
      communityProjects?: {
        title?: string;
        description?: string;
      };
    };
  };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale).catch(() => ({}))) as Dictionary;
  const cp = dict.pages?.zcashCommunity?.communityProjects;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  const title = cp?.title
    ? `${cp.title} | ZecHub`
    : "Zcash Community Projects & Initiatives | ZecHub";

  const description =
    cp?.description ??
    "Discover open-source community projects, educational initiatives, apps, and tools built by the global Zcash community.";

  return genMetadata({
    title,
    description,
    url: `https://zechub.wiki${localePrefix}/zcash-community/community-projects`,
    image: getBanner("zcash-community") || "/content-banners/bannercommunity.jpg",
    locale,
    alternates: buildAlternates("/zcash-community/community-projects", locale, [locale]),
  });
}

async function getMarkdown() {
  const res = await fetch(
    "https://raw.githubusercontent.com/ZecHub/zechub/main/site/Zcash_Community/Community_Projects.md",
    { next: { revalidate: 3600 } }
  );
  return res.text();
}

export default async function Page() {
  const md = await getMarkdown();
  const projects = attachImages(parseCommunityProjects(md));

  return <Client projects={projects} />;
}
