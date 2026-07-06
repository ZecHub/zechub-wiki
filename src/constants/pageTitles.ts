// Locale-keyed curated page titles (auto-registered).
import { pageTitlesIt } from "@/constants/pageTitles.it";
import { pageTitlesFr } from "@/constants/pageTitles.fr";
import { pageTitlesEs } from "@/constants/pageTitles.es";
import { pageTitlesDe } from "@/constants/pageTitles.de";
import { pageTitlesPt } from "@/constants/pageTitles.pt";
import { pageTitlesAr } from "@/constants/pageTitles.ar";
import { pageTitlesZh } from "@/constants/pageTitles.zh";
import { pageTitlesHi } from "@/constants/pageTitles.hi";
import { pageTitlesRu } from "@/constants/pageTitles.ru";
import { pageTitlesJa } from "@/constants/pageTitles.ja";
import { pageTitlesKo } from "@/constants/pageTitles.ko";
import { pageTitlesTr } from "@/constants/pageTitles.tr";
import { pageTitlesUk } from "@/constants/pageTitles.uk";

export const pageTitles: Record<string, Record<string, string>> = {
  it: pageTitlesIt,
  fr: pageTitlesFr,
  es: pageTitlesEs,
  de: pageTitlesDe,
  pt: pageTitlesPt,
  ar: pageTitlesAr,
  zh: pageTitlesZh,
  hi: pageTitlesHi,
  ru: pageTitlesRu,
  ja: pageTitlesJa,
  ko: pageTitlesKo,
  tr: pageTitlesTr,
  uk: pageTitlesUk,
};
