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
  const pages = (dict.pages ?? {}) as Record<string, any>;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  const title = pages.dex?.custodial
    ? `${pages.dex.custodial} | ZecHub`
    : "Custodial Exchanges Supporting Zcash | ZecHub";

  const description =
    pages.dex?.custodialDesc ??
    "Directory of centralized and custodial cryptocurrency exchanges that support Zcash (ZEC) trading pairs and deposits.";

  return genMetadata({
    title,
    description,
    url: `https://zechub.wiki${localePrefix}/using-zcash/custodial-exchanges`,
    image: getBanner("using-zcash") || "/content-banners/usingzcash.png",
    locale,
    alternates: buildAlternates("/using-zcash/custodial-exchanges", locale, [locale]),
  });
}

export default function Page() {
  return <Client />;
}
