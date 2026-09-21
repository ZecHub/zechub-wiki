import { Metadata } from "next";
import { genMetadata } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import FreedomWallet from "./FreedomWallet";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Freedom Wallet | ZecHub",
    description:
      "Freedom Wallet is a self-custodial multi-asset wallet for iPhone, Android, and desktop, with Zcash support on mobile (shielded addresses).",
    url: `https://zechub.wiki${localePrefix}/wallets/freedom-wallet`,
    locale,
    alternates: buildAlternatesAllLocales("/wallets/freedom-wallet", locale),
  });
}

export default function Page() {
  return <FreedomWallet />;
}
