import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import SPEDNMap from "@/components/Map/SpednMap";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Zcash Merchant & Global Map | ZecHub",
    description:
      "Find physical merchants, retail stores, and services that accept Zcash (ZEC) payments globally.",
    url: `https://zechub.wiki${localePrefix}/map`,
    image: getBanner("using-zcash") || "/content-banners/usingzcash.png",
    locale,
    alternates: buildAlternatesAllLocales("/map", locale),
  });
}

export default function Page() {
  return <SPEDNMap />;
}
