import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { ZcashInfrastructureVisualizer } from "@/components/visualizer/zcash-infrastructure-visualizer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Zcash Infrastructure & Node Visualizer | ZecHub",
    description:
      "Explore the architecture of the Zcash network, full nodes (zcashd, Zebra), lightwalletd servers, wallet clients, and mining nodes.",
    url: `https://zechub.wiki${localePrefix}/zcash-infrastructure-visualizer`,
    image: getBanner("zcash-tech") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/zcash-infrastructure-visualizer", locale),
  });
}

export default function ZcashInfrastructureVisualizerPage() {
  return (
    <div className="min-h-[600px] w-full max-w-4xl m-auto">
      <ZcashInfrastructureVisualizer />
    </div>
  );
}
