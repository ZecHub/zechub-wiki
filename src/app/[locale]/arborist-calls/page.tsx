import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import ArboristCallsPage from "./ArboristCallsPage";
import { buildArboristArchive } from "@/lib/arboristArchive";
import { fetchLiveArboristRecordings } from "@/lib/arboristLive";

// New calls show up within an hour of being published on YouTube, without a deploy.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Zcash Arborist Calls & Protocol Dev Meetings | ZecHub",
    description:
      "Summaries, video archives, and agenda notes from bi-weekly Zcash Arborist calls with core protocol engineers and developers.",
    url: `https://zechub.wiki${localePrefix}/arborist-calls`,
    image: getBanner("zcash-tech") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/arborist-calls", locale),
  });
}

export default async function Page() {
  const entries = buildArboristArchive(await fetchLiveArboristRecordings());
  return <ArboristCallsPage entries={entries} />;
}
