import { HashFunctionVisualizer } from "@/components/visualizer/hash-function-visualizer";
import { genMetadata, getBanner } from "@/lib/helpers";
import { Metadata } from "next";
import { getDictionary } from "@/lib/getDictionary";
import { buildAlternates } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";

type Dictionary = {
  pages?: {
    visualizer?: {
      hashFunction?: {
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
  const hf = dict.pages?.visualizer?.hashFunction;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  const title = hf?.title
    ? `${hf.title} | ZecHub`
    : "Hash Function Visualizer | ZecHub";

  const description =
    hf?.description ??
    "Interactive cryptographic hash function visualizer demonstrating how inputs map to deterministic fixed-size hash digests.";

  return genMetadata({
    title,
    description,
    url: `https://zechub.wiki${localePrefix}/visualizer/hash-function`,
    image: getBanner("zcash-tech") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternates("/visualizer/hash-function", locale, [locale]),
  });
}

export default function HashFunctionContent() {
  return <HashFunctionVisualizer />;
}
