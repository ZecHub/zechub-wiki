import PoolMigrationViewer from "./PoolMigrationViewer";
import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "ZEC Pool Migration Field Guide (PDF) | ZecHub",
    description:
      "Read ZecHub's field guide to moving ZEC between shielded pools: Sprout to Sapling to Ironwood, and Sapling to Ironwood.",
    url: `https://zechub.wiki${localePrefix}/research/zec-pool-migration/view`,
    image: getBanner("zcash-tech") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/research/zec-pool-migration/view", locale),
  });
}

export const dynamic = "force-dynamic";

export default function Page() {
  return <PoolMigrationViewer />;
}
