// Locale-keyed curated page titles for the left side-menu and sitemap.
//
// Adding a new curated locale requires NO code changes here beyond one line:
// import its `pageTitles.<locale>.ts` map and register it under its locale key.
// Consumers resolve `pageTitles[locale]?.[item] ?? getName(item)`, so any
// locale absent from this map transparently falls back to the English label.
import { pageTitlesIt } from "@/constants/pageTitles.it";
import { pageTitlesZh } from "@/constants/pageTitles.zh";

export const pageTitles: Record<string, Record<string, string>> = {
  it: pageTitlesIt,
  zh: pageTitlesZh,
};
