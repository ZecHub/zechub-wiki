import React from "react";
import SitemapComp from "@/components/Sitemap/Sitemap";
import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { getMenuTitlesCached } from "@/lib/authAndFetch";
import { buildAlternates } from "@/lib/localeCoverage";
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
    title: "Complete ZecHub Wiki Sitemap | ZecHub",
    description:
      "Browse the complete hierarchy of guides, tutorials, research, developer documentation, and ecosystem resources on ZecHub.",
    url: `https://zechub.wiki${localePrefix}/sitemap`,
    image: getBanner("start-here") || "/content-banners/bannerstart.png",
    locale,
    alternates: buildAlternates("/sitemap", locale, [locale]),
  });
}

const ZcashProject = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale = "en" } = await params;
  const [titles, enTitles] = await Promise.all([
    getMenuTitlesCached(locale),
    getMenuTitlesCached("en"),
  ]);
  return (
    <main>
      <SitemapComp titles={titles} enTitles={enTitles} />
    </main>
  );
};

export default ZcashProject;
