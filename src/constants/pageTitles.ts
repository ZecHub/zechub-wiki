// Locale-keyed curated page titles for the left side-menu and sitemap.
//
// Adding a new curated locale requires NO code changes here beyond one line:
// import its `pageTitles.<locale>.ts` map and register it under its locale key.
// Consumers resolve `pageTitles[locale]?.[item] ?? getName(item)`, so any
// locale absent from this map transparently falls back to the English label.
import { pageTitlesIt } from "@/constants/pageTitles.it";
import { pageTitlesHi } from "@/constants/pageTitles.hi";
import { pageTitlesRu } from "@/constants/pageTitles.ru";
import { pageTitlesJa } from "@/constants/pageTitles.ja";
import { pageTitlesKo } from "@/constants/pageTitles.ko";
import { pageTitlesTr } from "@/constants/pageTitles.tr";
import { pageTitlesUk } from "@/constants/pageTitles.uk";

export const pageTitles: Record<string, Record<string, string>> = {
  it: pageTitlesIt,
  hi: pageTitlesHi,
  ru: pageTitlesRu,
  ja: pageTitlesJa,
  ko: pageTitlesKo,
  tr: pageTitlesTr,
  uk: pageTitlesUk,
};
