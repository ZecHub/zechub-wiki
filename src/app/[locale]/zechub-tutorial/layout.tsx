import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
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
    title: "Zcash Video Tutorials | ZecHub",
    description:
      "Practical video guides for Zcash wallets, privacy, payments, development and the wider Zcash ecosystem.",
    url: `https://zechub.wiki${localePrefix}/zechub-tutorial`,
    image: getBanner("tutorials") || "/content-banners/bannertutorials.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/zechub-tutorial", locale),
  });
}

export default function ZecHubTutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
