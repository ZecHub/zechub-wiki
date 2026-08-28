import Client from "./ClientPage";
import { genMetadata, getBanner } from "@/lib/helpers";
import { getDictionary } from "@/lib/getDictionary";
import { Metadata } from "next";
import { buildAlternates } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";

type Dictionary = {
  pages?: {
    usingZcash?: {
      blockchainExplorers?: {
        title?: string;
        description?: string;
      };
    };
  };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale).catch(() => ({}))) as Dictionary;
  const be = dict.pages?.usingZcash?.blockchainExplorers;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  const title = be?.title
    ? `${be.title} | ZecHub`
    : "Zcash Blockchain Explorers | ZecHub";

  const description =
    be?.description ??
    "Discover block explorers for analyzing Zcash transparent transactions, shielded pool statistics, network hash rate, and difficulty.";

  return genMetadata({
    title,
    description,
    url: `https://zechub.wiki${localePrefix}/using-zcash/blockchain-explorers`,
    image: getBanner("using-zcash") || "/content-banners/usingzcash.png",
    locale,
    alternates: buildAlternates("/using-zcash/blockchain-explorers", locale, [locale]),
  });
}

export default function Page() {
  return <Client />;
}
