import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { MODULE_PARAM, visualizerQuery } from "@/lib/visualizerRouting";
import { visualizerCardCopy, type VisualizerCopyDictionary } from "./visualizerCardCopy";
import { findVisualizerModule } from "./visualizerModules";

const HUB_TITLE = "Interactive Zcash Visualizers & Tools | ZecHub";
const HUB_DESCRIPTION =
  "Interactive cryptographic and blockchain visualizers for Zcash: zk-SNARKs, key derivation, consensus, hash functions, and shielded pools.";

export type VisualizerMetadataDictionary = VisualizerCopyDictionary & {
  pages?: {
    visualizer?: {
      title?: string;
      description?: string;
    };
  };
};

export type VisualizerSearchParams = Record<
  string,
  string | string[] | undefined
>;

function firstSearchParam(
  searchParams: VisualizerSearchParams | undefined,
  key: string,
): string | undefined {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export function buildVisualizerMetadata({
  dictionary,
  locale,
  searchParams,
}: {
  dictionary: VisualizerMetadataDictionary;
  locale: string;
  searchParams?: VisualizerSearchParams;
}): Metadata {
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";
  const selectedModule = findVisualizerModule(
    firstSearchParam(searchParams, MODULE_PARAM),
  );

  const title = selectedModule
    ? `${visualizerCardCopy(dictionary, selectedModule).title} | ZecHub Visualizer`
    : dictionary.pages?.visualizer?.title
      ? `${dictionary.pages.visualizer.title} | ZecHub`
      : HUB_TITLE;

  const description = selectedModule
    ? visualizerCardCopy(dictionary, selectedModule).description
    : dictionary.pages?.visualizer?.description ?? HUB_DESCRIPTION;

  const query = selectedModule
    ? visualizerQuery({ module: selectedModule.id })
    : "";

  return genMetadata({
    title,
    description,
    url: `https://zechub.wiki${localePrefix}/visualizer${query}`,
    image: getBanner("zcash-tech") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/visualizer", locale),
  });
}
