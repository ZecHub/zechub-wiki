import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import VisualIdentityPage from "./VisualIdentityPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "ZecHub Visual Identity & Media Guidelines | ZecHub",
    description:
      "Explore official brand guidelines, vector logos, graphics, and typography for ZecHub and Zcash community materials.",
    url: `https://zechub.wiki${localePrefix}/visual-identity`,
    image: getBanner("zcash-organizations") || "/content-banners/bannerorgs.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/visual-identity", locale),
  });
}

export default function Page() {
  return <VisualIdentityPage />;
}
