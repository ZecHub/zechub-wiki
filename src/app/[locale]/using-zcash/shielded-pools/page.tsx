import WikiPage from "../../[...slug]/page";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Zcash Shielded Pools (Sprout, Sapling, Orchard) | ZecHub",
    description:
      "Learn about the evolution of Zcash shielded pools: Sprout, Sapling, and Orchard, their zero-knowledge cryptography, and how privacy is maintained.",
    url: `https://zechub.wiki${localePrefix}/using-zcash/shielded-pools`,
    image: getBanner("using-zcash") || "/content-banners/usingzcash.png",
    locale,
    alternates: buildAlternatesAllLocales("/using-zcash/shielded-pools", locale),
  });
}

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  // Rendered by the shared wiki page so it gets the same layout and patterns as the other guides;
  // this file only keeps the page-specific SEO metadata above.
  const { locale } = await props.params;
  return (
    <WikiPage
      params={Promise.resolve({ locale: locale || "en", slug: ["using-zcash", "shielded-pools"] })}
    />
  );
}

export const dynamic = "force-dynamic";
