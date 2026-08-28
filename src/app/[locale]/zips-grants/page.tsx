import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternates } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { ZipAndGrantsGovernance } from "./ZipAndGrantsGovernance";
import { loadZips } from "@/lib/zips/load-zips.server";

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
    title: "ZIPs & Grants Governance Tracker | ZecHub",
    description:
      "Explore Zcash Improvement Proposals (ZIPs), Zcash Community Grants (ZCG), funding status, and decentralized ecosystem governance.",
    url: `https://zechub.wiki${localePrefix}/zips-grants`,
    image: getBanner("zcash-organizations") || "/content-banners/bannerorgs.jpg",
    locale,
    alternates: buildAlternates("/zips-grants", locale, [locale]),
  });
}

export default async function GovernancePage() {
  const { zips, lastSyncedAt, source } = await loadZips();
  return (
    <div className="mx-auto max-w-7xl min-h-screen bg-background">
      <ZipAndGrantsGovernance zipsData={{ zips, lastSyncedAt, source }} />
    </div>
  );
}
