import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { getDictionary } from "@/lib/getDictionary";
import GovernanceHowtoClient from "./GovernanceHowtoClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale).catch(() => ({}))) as Record<string, any>;
  const g = dict?.pages?.governanceHowto;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  const title = g?.pageTitle
    ? `${g.pageTitle} | ZecHub`
    : "ZecHub DAO Governance How-To Guide | ZecHub";

  const description =
    g?.pageSubtitle ??
    "A comprehensive step-by-step guide to participating in ZecHub DAO governance, creating proposals, and voting.";

  return genMetadata({
    title,
    description,
    url: `https://zechub.wiki${localePrefix}/governance-howto`,
    image: getBanner("governance") || "/content-banners/bannerorgs.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/governance-howto", locale),
  });
}

export default function GovernanceGuide() {
  return <GovernanceHowtoClient />;
}
