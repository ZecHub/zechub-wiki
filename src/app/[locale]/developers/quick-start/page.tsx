import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { getDictionary } from "@/lib/getDictionary";
import QuickStartClient from "./QuickStartClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale).catch(() => ({}))) as Record<string, any>;
  const qs = dict?.pages?.developersQuickStart;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  const title =
    qs?.heroTitleLine1 && qs?.heroTitleLine2
      ? `${qs.heroTitleLine1} ${qs.heroTitleLine2} | ZecHub`
      : "Zcash Developer Quick Start | ZecHub";

  const description =
    qs?.heroSubtitle ??
    "Get up and running with Zcash development. Step-by-step installation and configuration guides for Zebrad, Zakura, Zaino, and Zingolib.";

  return genMetadata({
    title,
    description,
    url: `https://zechub.wiki${localePrefix}/developers/quick-start`,
    image: getBanner("developers") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/developers/quick-start", locale),
  });
}

export default function QuickStartPage() {
  return <QuickStartClient />;
}
