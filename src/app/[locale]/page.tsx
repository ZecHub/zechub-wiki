import { Metadata } from "next";
import { getDictionary } from "@/lib/getDictionary";
import { genMetadata } from "@/lib/helpers";
import { buildAlternates } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import HomeClient from "./HomeClient";

// The homepage renders for every locale (localized homepages are verified to
// serve for all locales), so it gets the same full reciprocal-hreflang set the
// sitemap gives "/": one alternate per locale + x-default. Canonical + OG are
// locale-aware.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as {
    meta?: { title?: string; description?: string };
  };
  const alternates = buildAlternates("/", locale, [...routing.locales]);
  return genMetadata({
    title: dict?.meta?.title ?? "ZecHub Wiki",
    description: dict?.meta?.description,
    url:
      locale && locale !== routing.defaultLocale
        ? `https://zechub.wiki/${locale}`
        : "https://zechub.wiki",
    locale,
    alternates,
  });
}

export default function Home() {
  return <HomeClient />;
}
