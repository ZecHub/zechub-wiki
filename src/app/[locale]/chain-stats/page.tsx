import ChainStatePage from "@/components/Charts/Zcash/ChainState/ChainStatePage";
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
    title: "Zcash Chain State Explorer | ZecHub",
    description:
      "Daily charts of Zcash on-chain activity: transactions, shielded actions, pool value balances, note tree and nullifier set growth, transaction types, block fullness and expiry heights.",
    url: `https://zechub.wiki${localePrefix}/chain-stats`,
    image: getBanner("zcash-tech") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/chain-stats", locale),
  });
}

export default function Page() {
  return <ChainStatePage />;
}