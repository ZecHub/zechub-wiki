import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { ZcashPoolVisualizer } from "@/components/visualizer/zcash-pool-visualizer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Zcash Value Pools Visualizer | ZecHub",
    description:
      "Interactive breakdown of Zcash shielded and transparent value pools: Sprout, Sapling, and Orchard supply distributions and migration flows.",
    url: `https://zechub.wiki${localePrefix}/zcash-pool-visualizer`,
    image: getBanner("zcash-tech") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/zcash-pool-visualizer", locale),
  });
}

export default function ZcashPoolVisualizerPage() {
  return (
    <div className="min-h-[600px] w-full max-w-4xl m-auto">
      <ZcashPoolVisualizer />
    </div>
  );
}
