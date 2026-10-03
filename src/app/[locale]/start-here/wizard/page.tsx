import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import StartHereWizard from "./StartHereWizard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Start Here Wizard | ZecHub",
    description:
      "New to Zcash? Answer two quick questions and get a short, ordered reading path through the ZecHub wiki — buy ZEC, use it privately, accept payments, or run a node.",
    url: `https://zechub.wiki${localePrefix}/start-here/wizard`,
    image: getBanner("start-here") || "/content-banners/bannerstarthere.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/start-here/wizard", locale),
  });
}

export default function Page() {
  return <StartHereWizard />;
}
