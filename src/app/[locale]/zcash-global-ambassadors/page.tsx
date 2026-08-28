import { genMetadata, getBanner } from "@/lib/helpers";
import { Metadata } from "next";
import { buildAlternates } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import GlobalAmbassadorsClient from "./GlobalAmbassadorsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Zcash Global Ambassadors Program | ZecHub",
    description:
      "Meet the global ambassadors promoting Zcash adoption, organizing local meetups, and translating educational resources worldwide.",
    url: `https://zechub.wiki${localePrefix}/zcash-global-ambassadors`,
    image: getBanner("zcash-community") || "/content-banners/bannercommunity.jpg",
    locale,
    alternates: buildAlternates("/zcash-global-ambassadors", locale, [locale]),
  });
}

export default function Page() {
  return <GlobalAmbassadorsClient />;
}
