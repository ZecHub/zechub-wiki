// context/LanguageContext.tsx

"use client";

import {
  createContext, useContext, useState,
  useEffect, useCallback, useMemo, ReactNode,
} from 'react';
import { useLocale } from 'next-intl';
import { getDictionary } from '@/lib/getDictionary';

export interface Language {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export const LANGUAGES: Language[] = [
  { code: 'en',  label: 'English',    nativeLabel: 'English',    flag: '🇺🇸' },
  { code: 'es',  label: 'Spanish',    nativeLabel: 'Español',    flag: '🇪🇸' },
  { code: 'fr',  label: 'French',     nativeLabel: 'Français',   flag: '🇫🇷' },
  { code: 'de',  label: 'German',     nativeLabel: 'Deutsch',    flag: '🇩🇪' },
  { code: 'it',  label: 'Italian',    nativeLabel: 'Italiano',   flag: '🇮🇹' },
  { code: 'pt',  label: 'Portuguese', nativeLabel: 'Português',  flag: '🇧🇷' },
  { code: 'ar',  label: 'Arabic',     nativeLabel: 'العربية',    flag: '🇸🇦', dir: 'rtl' },
  { code: 'zh',  label: 'Chinese',    nativeLabel: '中文',        flag: '🇨🇳' },
  { code: 'hi',  label: 'Hindi',      nativeLabel: 'हिन्दी',      flag: '🇮🇳' },
  { code: 'ru',  label: 'Russian',    nativeLabel: 'Русский',    flag: '🇷🇺' },
  { code: 'ja',  label: 'Japanese',   nativeLabel: '日本語',      flag: '🇯🇵' },
  { code: 'ko',  label: 'Korean',     nativeLabel: '한국어',      flag: '🇰🇷' },
  { code: 'tr',  label: 'Turkish',    nativeLabel: 'Türkçe',     flag: '🇹🇷' },
  { code: 'uk',  label: 'Ukrainian',  nativeLabel: 'Українська', flag: '🇺🇦' },
  { code: 'sw',  label: 'Swahili',    nativeLabel: 'Kiswahili',  flag: '🇰🇪' },
  { code: 'yo',  label: 'Yorùbá',     nativeLabel: 'Yorùbá',     flag: '🇳🇬' },
  { code: 'ig',  label: 'Igbo',       nativeLabel: 'Igbo',       flag: '🇳🇬' },
  { code: 'ak',  label: 'Twi (Akan)', nativeLabel: 'Twi',        flag: '🇬🇭' },
  { code: 'ee',  label: 'Ewe',        nativeLabel: 'Eʋegbe',     flag: '🇬🇭' },
];

export type Locale = string;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  currentLanguage: Language;
  t: Record<string, any>;
}

/** In-memory English dictionary; merged under every locale so partial locale files keep full keys. */
let enDictionarySingleton: Record<string, any> | null = null;

function deepMerge(base: unknown, override: unknown): any {
  if (override === undefined || override === null) {
    return base;
  }
  if (Array.isArray(override)) {
    return override;
  }
  if (typeof override !== 'object') {
    return override;
  }
  const b =
    base !== undefined &&
    base !== null &&
    typeof base === 'object' &&
    !Array.isArray(base)
      ? (base as Record<string, unknown>)
      : {};
  const o = override as Record<string, unknown>;
  const out: Record<string, unknown> = { ...b };
  for (const key of Object.keys(o)) {
    const bv = b[key];
    const ov = o[key];
    if (
      ov !== undefined &&
      ov !== null &&
      typeof ov === 'object' &&
      !Array.isArray(ov)
    ) {
      out[key] = deepMerge(bv, ov);
    } else if (ov !== undefined) {
      out[key] = ov;
    }
  }
  return out;
}

async function loadDictionaryForLocale(locale: Locale): Promise<Record<string, any>> {
  if (!enDictionarySingleton) {
    enDictionarySingleton = ((await getDictionary('en')) || {}) as Record<string, any>;
  }
  if (locale === 'en') {
    return enDictionarySingleton;
  }
  const localized = ((await getDictionary(locale)) || {}) as Record<string, any>;
  return deepMerge(enDictionarySingleton, localized);
}

// ── Context ───────────────────────────────────────────────────────────────────

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLocale,
  initialDictionary,
}: {
  children: ReactNode;
  initialLocale?: Locale;
  initialDictionary?: Record<string, any>;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? 'en');
  const [dictionary, setDictionary] = useState<Record<string, any>>(
    initialDictionary ?? {},
  );

  // The URL is the SOLE source of truth for the locale: every language ships a
  // curated next-intl route, so a visit to /it/... shows Italian chrome (menu,
  // dictionary) immediately. We deliberately do NOT persist or restore a locale
  // in localStorage — doing so could flip chrome/dictionary to a previously
  // chosen language while the routed content stays in the URL's locale (a
  // permanent mixed-language page), and opening one shared /fr/... link should
  // not overwrite a reader's context. Keep chrome, <html lang>, and dir in sync
  // with the route only.
  const urlLocale = useLocale();
  useEffect(() => {
    if (urlLocale && urlLocale !== locale && LANGUAGES.some((l) => l.code === urlLocale)) {
      setLocaleState(urlLocale as Locale);
      document.documentElement.lang = urlLocale;
      const lang = LANGUAGES.find((l) => l.code === urlLocale);
      document.documentElement.dir = lang?.dir ?? 'ltr';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlLocale]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const dict = await loadDictionaryForLocale(locale);
        if (!cancelled) setDictionary(dict || {});
      } catch {
        if (!cancelled) setDictionary(enDictionarySingleton || {});
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  // Immediate chrome feedback when the switcher is clicked, before the route
  // navigation completes; the urlLocale effect above reconciles idempotently.
  const setLocale = useCallback((code: Locale) => {
    setLocaleState(code);
    document.documentElement.lang = code;
    const lang = LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
    document.documentElement.dir = lang.dir ?? 'ltr';
  }, []);

  const currentLanguage = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  const contextValue = useMemo(
    () => ({ locale, setLocale, currentLanguage, t: dictionary }),
    [locale, setLocale, currentLanguage, dictionary],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within <LanguageProvider>');
  return ctx;
}
