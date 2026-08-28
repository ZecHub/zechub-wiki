import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternates } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { ZcashUpgradEvolution } from "./ZcashUpgradEvolution";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Zcash Evolution & Network Upgrades | ZecHub",
    description:
      "Interactive timeline of Zcash network upgrades, from Sprout and Overwinter to Sapling, Blossom, Heartwood, Canopy, NU5, and future privacy milestones.",
    url: `https://zechub.wiki${localePrefix}/zcash-evolution`,
    image: getBanner("zcash-tech") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternates("/zcash-evolution", locale, [locale]),
  });
}

export default function ZcashEvolution() {
  return <ZcashUpgradEvolution />;
}
