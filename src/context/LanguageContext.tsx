// context/LanguageContext.tsx

"use client";

import {
  createContext, useContext, useState,
  useEffect, useCallback, useRef, useMemo, ReactNode,
} from 'react';
import { getDictionary } from '@/lib/getDictionary';

export interface Language {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
  googleCode: string;
  dir?: 'ltr' | 'rtl';
}

export const LANGUAGES: Language[] = [
  { code: 'en',  label: 'English',    nativeLabel: 'English',    flag: '🇺🇸', googleCode: 'en'    },
  { code: 'es',  label: 'Spanish',    nativeLabel: 'Español',    flag: '🇪🇸', googleCode: 'es'    },
  { code: 'fr',  label: 'French',     nativeLabel: 'Français',   flag: '🇫🇷', googleCode: 'fr'    },
  { code: 'de',  label: 'German',     nativeLabel: 'Deutsch',    flag: '🇩🇪', googleCode: 'de'    },
  { code: 'pt',  label: 'Portuguese', nativeLabel: 'Português',  flag: '🇧🇷', googleCode: 'pt'    },
  { code: 'ar',  label: 'Arabic',     nativeLabel: 'العربية',    flag: '🇸🇦', googleCode: 'ar',   dir: 'rtl' },
  { code: 'zh',  label: 'Chinese',    nativeLabel: '中文',        flag: '🇨🇳', googleCode: 'zh-CN' },
  { code: 'hi',  label: 'Hindi',      nativeLabel: 'हिन्दी',      flag: '🇮🇳', googleCode: 'hi'    },
  { code: 'ru',  label: 'Russian',    nativeLabel: 'Русский',    flag: '🇷🇺', googleCode: 'ru'    },
  { code: 'ja',  label: 'Japanese',   nativeLabel: '日本語',      flag: '🇯🇵', googleCode: 'ja'    },
  { code: 'ko',  label: 'Korean',     nativeLabel: '한국어',      flag: '🇰🇷', googleCode: 'ko'    },
  { code: 'tr',  label: 'Turkish',    nativeLabel: 'Türkçe',     flag: '🇹🇷', googleCode: 'tr'    },
  { code: 'uk',  label: 'Ukrainian',  nativeLabel: 'Українська', flag: '🇺🇦', googleCode: 'uk'    },
  { code: 'sw',  label: 'Swahili',    nativeLabel: 'Kiswahili',  flag: '🇰🇪', googleCode: 'sw'    },
  { code: 'yo',  label: 'Yorùbá',     nativeLabel: 'Yorùbá',     flag: '🇳🇬', googleCode: 'yo'    },
  { code: 'ig',  label: 'Igbo',       nativeLabel: 'Igbo',       flag: '🇳🇬', googleCode: 'ig'    },
  { code: 'ak',  label: 'Twi (Akan)', nativeLabel: 'Twi',        flag: '🇬🇭', googleCode: 'ak'    },
  { code: 'ee',  label: 'Ewe',        nativeLabel: 'Eʋegbe',     flag: '🇬🇭', googleCode: 'ee'    },
];

export type Locale = string;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  currentLanguage: Language;
  t: Record<string, any>;
}

const STORAGE_KEY = 'zechub_language';

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

// ── Google Translate helpers ──────────────────────────────────────────────────

function getGTSelect(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>('.goog-te-combo');
}

function applyGoogleTranslate(googleCode: string): boolean {
  const select = getGTSelect();
  if (!select) return false;
  select.value = googleCode;
  select.dispatchEvent(new Event('change'));
  return true;
}

function resetGoogleTranslateToEnglish(): boolean {
  const select = getGTSelect();
  if (!select) return false;
  for (const val of ['', 'en']) {
    select.value = val;
    select.dispatchEvent(new Event('change'));
  }
  return true;
}

function clearGTCookiesAndReload() {
  const hostname = window.location.hostname;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname}`;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  window.location.reload();
}

// ── Context ───────────────────────────────────────────────────────────────────

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [dictionary, setDictionary] = useState<Record<string, any>>({});

  const restoredRef = useRef(false);

  const userSelectedRef = useRef(false);

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

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const saved = localStorage.getItem(STORAGE_KEY) || 'en';

    if (saved === 'en') return;

    const savedLang = LANGUAGES.find(l => l.code === saved);
    if (!savedLang) {
      localStorage.setItem(STORAGE_KEY, 'en');
      return;
    }

    setLocaleState(saved);

    let attempts = 0;
    const iv = setInterval(() => {
      if (userSelectedRef.current) {
        clearInterval(iv);
        return;
      }

      attempts++;
      const applied = applyGoogleTranslate(savedLang.googleCode);

      if (applied || attempts > 50) {
        clearInterval(iv);
      }
    }, 200);

    return () => clearInterval(iv);
  }, []);

  const setLocale = useCallback((code: Locale) => {
    userSelectedRef.current = true;

    setLocaleState(code);
    localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.lang = code;

    const lang = LANGUAGES.find(l => l.code === code);
    document.documentElement.dir = lang?.dir ?? 'ltr';

    if (code === 'en') {
      const widgetReady = resetGoogleTranslateToEnglish();
      if (!widgetReady) {
        let attempts = 0;
        const iv = setInterval(() => {
          attempts++;
          const ok = resetGoogleTranslateToEnglish();
          if (ok || attempts > 10) {
            clearInterval(iv);
            if (!ok) clearGTCookiesAndReload();
          }
        }, 200);
      }
      return;
    }

    if (lang) {
      if (!applyGoogleTranslate(lang.googleCode)) {
        let attempts = 0;
        const iv = setInterval(() => {
          attempts++;
          if (applyGoogleTranslate(lang.googleCode) || attempts > 25) clearInterval(iv);
        }, 200);
      }
    }
  }, []);

  const currentLanguage = LANGUAGES.find(l => l.code === locale) ?? LANGUAGES[0];

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