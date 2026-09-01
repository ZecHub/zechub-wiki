import { ZcashKeyVisualizer } from "@/components/visualizer/zcash-key-visualizer";
import { genMetadata, getBanner } from "@/lib/helpers";
import { Metadata } from "next";
import { getDictionary } from "@/lib/getDictionary";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";

type Dictionary = {
  pages?: {
    visualizer?: {
      zcashKey?: {
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
  const dict = (await getDictionary(locale).catch(() => ({}))) as Dictionary;
  const zk = dict.pages?.visualizer?.zcashKey;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  const title = zk?.title
    ? `${zk.title} | ZecHub`
    : "Zcash Key Derivation Visualizer | ZecHub";

  const description =
    zk?.description ??
    "Interactive visualization of Zcash unified addresses, spending keys, viewing keys, and key derivation hierarchy.";

  return genMetadata({
    title,
    description,
    url: `https://zechub.wiki${localePrefix}/visualizer/zcash-key`,
    image: getBanner("zcash-tech") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/visualizer/zcash-key", locale),
  });
}

export default function ZcashKeyVisualizerPage() {
  return <ZcashKeyVisualizer />;
}
