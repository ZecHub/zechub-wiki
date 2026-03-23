import { i18n, type Locale } from '@/i18n/config';

type Dictionary = Record<string, unknown>;

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('../../dictionaries/en.json').then((m) => (m && m.default) || m),
  es: () => import('../../dictionaries/es.json').then((m) => (m && m.default) || m),
  de: () => import('../../dictionaries/de.json').then((m) => (m && m.default) || m),
  fr: () => import('../../dictionaries/fr.json').then((m) => (m && m.default) || m),
  ja: () => import('../../dictionaries/ja.json').then((m) => (m && m.default) || m),
  ru: () => import('../../dictionaries/ru.json').then((m) => (m && m.default) || m),
  zh: () => import('../../dictionaries/zh.json').then((m) => (m && m.default) || m),
};

export const getDictionary = async (locale: Locale = i18n.defaultLocale): Promise<Dictionary> => {
  const loader = dictionaries[locale] ?? dictionaries[i18n.defaultLocale];
  try {
    return await loader();
  } catch (err) {
    console.error(`Failed to load dictionary for locale '${locale}', falling back to '${i18n.defaultLocale}':`, err);
    try {
      return await dictionaries[i18n.defaultLocale]();
    } catch (err2) {
      console.error('Failed to load default dictionary:', err2);
      return {};
    }
  }
};