import dynamic from "next/dynamic";
import { genMetadata, getBanner } from "@/lib/helpers";
import { Metadata } from "next";
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
    title: "Explore Zcash Ecosystem Directory | ZecHub",
    description:
      "Explore the interactive directory of Zcash projects, wallets, tools, community resources, and privacy technologies.",
    url: `https://zechub.wiki${localePrefix}/explore`,
    image: getBanner("start-here") || "/content-banners/bannerstart.png",
    locale,
    alternates: buildAlternatesAllLocales("/explore", locale),
  });
}

const Explorer = dynamic(() => import("@/components/Explorer/Explorer"));

const Explore = async () => {
  return (
    <main className="">
      <Explorer />
    </main>
  );
};

export default Explore;
