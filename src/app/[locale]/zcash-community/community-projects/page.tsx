import Client from "./ClientPage";
import { genMetadata } from "@/lib/helpers";
import { getDictionary } from "@/lib/getDictionary";
import { Metadata } from "next";
import { parseCommunityProjects } from "@/lib/parseCommunityProjects";
import { attachImages } from "@/lib/communityProjectImages";

type Dictionary = {
  pages?: {
    zcashCommunity?: {
      communityProjects?: {
        title?: string;
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
  const dict = (await getDictionary(locale)) as Dictionary;
  return genMetadata({
    title:
      dict.pages?.zcashCommunity?.communityProjects?.title ??
      "Community Projects",
    url: "https://zechub.wiki/zcash-community/community-projects",
  }) as Metadata;
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