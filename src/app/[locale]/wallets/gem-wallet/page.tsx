import { Metadata } from "next";
import { genMetadata } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import GemWallet from "./GemWallet";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Gem Wallet | ZecHub",
    description:
      "Gem Wallet is an open-source, self-custodial multi-coin mobile wallet (iOS, Android, APK) with Zcash (ZEC) support. Transparent ZEC addresses only; shielded transactions are not currently supported.",
    url: `https://zechub.wiki${localePrefix}/wallets/gem-wallet`,
    image: "/content-images/GemWallet-4f8a2c1d9e.webp",
    locale,
    alternates: buildAlternatesAllLocales("/wallets/gem-wallet", locale),
  });
}

export default function Page() {
  return <GemWallet />;
}
