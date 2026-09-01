import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { ConsensusVisualizer } from "@/components/visualizer/consensus-visualizer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Zcash Consensus Visualizer | ZecHub",
    description:
      "Interactive visualizer demonstrating how distributed Zcash nodes achieve consensus on the blockchain state.",
    url: `https://zechub.wiki${localePrefix}/visualizer/consensus`,
    image: getBanner("zcash-tech") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/visualizer/consensus", locale),
  });
}

export default function ConsensusVisualizerPage() {
  return <ConsensusVisualizer />;
}
