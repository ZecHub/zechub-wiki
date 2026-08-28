import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternates } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { getDictionary } from "@/lib/getDictionary";
import ZKSNARKProofVisualizer from "@/components/visualizer/zk-SNARK-proof/ZK-SNARKProofVisualizer";

type VisualizerDictionary = {
  pages?: {
    visualizer?: {
      zksnark?: {
        title?: string;
        description?: string;
      };
    };
  };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale).catch(() => ({}))) as VisualizerDictionary;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  const title =
    dict.pages?.visualizer?.zksnark?.title
      ? `${dict.pages.visualizer.zksnark.title} | ZecHub`
      : "zk-SNARK Proof Visualizer | ZecHub";

  const description =
    dict.pages?.visualizer?.zksnark?.description ??
    "Interactive visualization of Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge (zk-SNARKs) in Zcash.";

  return genMetadata({
    title,
    description,
    url: `https://zechub.wiki${localePrefix}/zksnark-proof-visualizer`,
    image: getBanner("zcash-tech") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternates("/zksnark-proof-visualizer", locale, [locale]),
  });
}

export default function ZKSNARKProofVisualizerPage() {
  return <ZKSNARKProofVisualizer />;
}
