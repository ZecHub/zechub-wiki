import { VisualizerHub } from "@/components/visualizer/VisualizerHub";
import { genMetadata, getBanner } from "@/lib/helpers";
import { Metadata } from "next";
import { getDictionary } from "@/lib/getDictionary";
import { buildAlternates } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";

type VisualizerDictionary = {
  pages?: {
    visualizer?: {
      title?: string;
      description?: string;
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

  const title = dict.pages?.visualizer?.title
    ? `${dict.pages.visualizer.title} | ZecHub`
    : "Interactive Zcash Visualizers & Tools | ZecHub";

  const description =
    dict.pages?.visualizer?.description ??
    "Interactive cryptographic and blockchain visualizers for Zcash: zk-SNARKs, key derivation, consensus, hash functions, and shielded pools.";

  return genMetadata({
    title,
    description,
    url: `https://zechub.wiki${localePrefix}/visualizer`,
    image: getBanner("zcash-tech") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternates("/visualizer", locale, [locale]),
  });
}

export default function VisualizerPage() {
  return (
    <div className="min-h-screen w-full">
      <VisualizerHub />
    </div>
  );
}
