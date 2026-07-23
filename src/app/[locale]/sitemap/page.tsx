import React from "react";
import SitemapComp from "@/components/Sitemap/Sitemap";
import { Metadata } from "next";
import { genMetadata } from "@/lib/helpers";
import { getMenuTitlesCached } from "@/lib/authAndFetch";

export const metadata: Metadata = genMetadata({
  title: "Sitemap | ZecHub",
  url: "https://zechub.wiki/sitemap",
});

const ZcashProject = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale = "en" } = await params;
  // Localized sitemap link titles from the content-repo manifest (client comp).
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
