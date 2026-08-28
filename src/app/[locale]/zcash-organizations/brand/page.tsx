import React from "react";
import BrandComp from "@/components/Brand/Brand";
import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
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
    title: "Zcash & ZecHub Brand Assets & Media Kit | ZecHub",
    description:
      "Official brand identity, logos, vector icons, color palettes, and media guidelines for Zcash and ZecHub.",
    url: `https://zechub.wiki${localePrefix}/zcash-organizations/brand`,
    image: getBanner("zcash-organizations") || "/content-banners/bannerorgs.jpg",
    locale,
    alternates: buildAlternates("/zcash-organizations/brand", locale, [locale]),
  });
}

const ZcashProject = () => {
  return (
    <main className="container mx-auto">
      <BrandComp />
    </main>
  );
};

export default ZcashProject;
