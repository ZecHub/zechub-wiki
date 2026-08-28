import Client from "./ClientPage";
import { genMetadata, getBanner } from "@/lib/helpers";
import { getDictionary } from "@/lib/getDictionary";
import { Metadata } from "next";
import { buildAlternates } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale).catch(() => ({}))) as Record<string, any>;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  const title = dict.pages?.dex?.centralizedTitle
    ? `${dict.pages.dex.centralizedTitle} | ZecHub`
    : "Centralized Instant Swaps for Zcash | ZecHub";

  const description =
    dict.pages?.dex?.centralizedDesc ??
    "Compare non-custodial and instant swap services for exchanging cryptocurrencies to and from Zcash (ZEC) without order books.";

  return genMetadata({
    title,
    description,
    url: `https://zechub.wiki${localePrefix}/using-zcash/centralizedswaps`,
    image: getBanner("using-zcash") || "/content-banners/usingzcash.png",
    locale,
    alternates: buildAlternates("/using-zcash/centralizedswaps", locale, [locale]),
  });
}

export default function Page() {
  return <Client />;
}
