export type Locale = string;

export const i18n = {
  defaultLocale: 'en' as Locale,
  locales: ['en', 'es', 'fr', 'de', 'pt', 'ar', 'zh', 'hi', 'ru', 'ja', 'ko', 'tr', 'uk', 'sw', 'yo', 'ig', 'ak', 'ee'] as Locale[],
} as const;