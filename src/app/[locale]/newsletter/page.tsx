import NewsLetter from "@/components/NewsLetter/NewsLetter";
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
    title: "ZecHub Shielded Newsletter | ZecHub",
    description:
      "Get Zcash ecosystem news and network stats delivered as encrypted memos to your Unified Address.",
    url: `https://zechub.wiki${localePrefix}/newsletter`,
    image: getBanner("zcash-community") || "/content-banners/bannercommunity.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/newsletter", locale),
  });
}

export default function page() {
  return(
    <NewsLetter />
  )
}