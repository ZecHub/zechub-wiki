import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import WalletBackupRestoreMatrix from "./WalletBackupRestoreMatrix";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Zcash Wallet Backup and Restore Matrix | ZecHub",
    description:
      "A practical cross-wallet guide: what you must back up to recover funds in Zodl (formerly Zashi), Zingo, Zkool, Cake Wallet, Keystone, Ledger, Zallet, ZECD, zcashd, and watch-only setups — what a seed phrase restores, what it does not, and how to test a restore safely.",
    url: `https://zechub.wiki${localePrefix}/guides/wallet-backup-restore-matrix`,
    image: getBanner("guides") || "/content-banners/bannerguides.jpg",
    locale,
    alternates: buildAlternatesAllLocales(
      "/guides/wallet-backup-restore-matrix",
      locale,
    ),
  });
}

export default function Page() {
  return <WalletBackupRestoreMatrix />;
}
