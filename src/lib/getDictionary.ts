import { i18n, type Locale } from '@/i18n/config';

const dictionaries = {
  en: () => import('../../dictionaries/en.json').then((module) => (module && module.default) || module),
  es: () => import('../../dictionaries/es.json').then((module) => (module && module.default) || module),
  de: () => import('../../dictionaries/de.json').then((module) => (module && module.default) || module),
  fr: () => import('../../dictionaries/fr.json').then((module) => (module && module.default) || module),
  ja: () => import('../../dictionaries/ja.json').then((module) => (module && module.default) || module),
  ru: () => import('../../dictionaries/ru.json').then((module) => (module && module.default) || module),
  zh: () => import('../../dictionaries/zh.json').then((module) => (module && module.default) || module),
};

export const getDictionary = async (locale: Locale = i18n.defaultLocale) => {
  const loader = dictionaries[locale] || dictionaries[i18n.defaultLocale];
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
