import { genMetadata, getBanner } from "@/lib/helpers";
import { Metadata } from "next";
import { buildAlternates } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { getDictionary } from "@/lib/getDictionary";
import DexClient from "./DexClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale).catch(() => ({}))) as Record<string, any>;
  const pages = (dict.pages ?? {}) as Record<string, any>;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  const title = pages.dex?.dex
    ? `${pages.dex.dex} | ZecHub`
    : "Decentralized Exchanges (DEXs) Supporting Zcash | ZecHub";

  const description =
    pages.dex?.dexDesc ??
    "Discover non-custodial and decentralized exchanges (DEXs), atomic swap protocols, and cross-chain bridges for Zcash (ZEC).";

  return genMetadata({
    title,
    description,
    url: `https://zechub.wiki${localePrefix}/dex`,
    image: getBanner("using-zcash") || "/content-banners/usingzcash.png",
    locale,
    alternates: buildAlternates("/dex", locale, [locale]),
  });
}

const DecentralisedExchanges = () => <DexClient />;

export default DecentralisedExchanges;
