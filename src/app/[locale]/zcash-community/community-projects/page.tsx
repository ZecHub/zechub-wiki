import Client from "./ClientPage";
import { genMetadata, getBanner } from "@/lib/helpers";
import { getDictionary } from "@/lib/getDictionary";
import { Metadata } from "next";
import { parseCommunityProjects } from "@/lib/parseCommunityProjects";
import { attachImages } from "@/lib/communityProjectImages";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { getFileContentCached } from "@/lib/authAndFetch";

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
    alternates: buildAlternatesAllLocales("/zcash-community/community-projects", locale),
  });
}

// Read through the repo's cached, rate-limit-degrading reader instead of a raw
// fetch. A raw fetch here had no status check (a GitHub 404/429/500 body was
// parsed as content, silently emptying the list) and no error handling (a
// network or rate-limit failure threw, 500ing the page for every visitor). The
// cached reader returns the content, or null on failure, so an upstream outage
// degrades to an empty list rather than a crash — matching the payment-
// processors and wallets pages.
async function getMarkdown(): Promise<string> {
  const md = await getFileContentCached(
    "site/Zcash_Community/Community_Projects.md",
  ).catch(() => null);
  return md ?? "";
}

export default async function Page() {
  const md = await getMarkdown();
  const projects = attachImages(parseCommunityProjects(md));

  return <Client projects={projects} />;
}
