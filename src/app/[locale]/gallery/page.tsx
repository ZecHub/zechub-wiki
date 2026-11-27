import Gallery from "@/components/Gallery/Gallery";
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
    title: "Zcash Wallpapers & Infographics | ZecHub",
    description:
      "Zcash wallpapers and infographics from ZecHub, free to view and download.",
    url: `https://zechub.wiki${localePrefix}/gallery`,
    image: getBanner("zcash-community") || "/content-banners/bannercommunity.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/gallery", locale),
  });
}

export default function page() {
  return(
    <Gallery />
  )
}