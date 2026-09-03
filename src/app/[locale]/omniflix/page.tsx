import { genMetadata, getBanner } from "@/lib/helpers";
import { Metadata } from "next";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import OmniflixClient from "./OmniflixClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "OmniFlix Media Hub & Educational Videos | ZecHub",
    description:
      "Watch decentralized video podcasts, ecosystem interviews, and interactive media about Zcash on OmniFlix.",
    url: `https://zechub.wiki${localePrefix}/omniflix`,
    image: getBanner("tutorials") || "/content-banners/bannertutorials.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/omniflix", locale),
  });
}

export default function Page() {
  return <OmniflixClient />;
}
