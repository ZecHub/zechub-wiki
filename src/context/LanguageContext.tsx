// context/LanguageContext.tsx

"use client";

import {
  createContext, useContext, useState,
  useEffect, useCallback, useRef, useMemo, ReactNode,
} from 'react';
import { useLocale } from 'next-intl';
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
  { code: 'it',  label: 'Italian',    nativeLabel: 'Italiano',   flag: '🇮🇹', googleCode: 'it'    },
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
// Locales served by curated next-intl content (translations/<locale>/site/...).
// Google Translate must NOT run for these — the page is already in the target
// language, so the widget would re-translate curated text and corrupt proper
// nouns (e.g. "Paradigm" -> "Paradigma"). GT stays only as a fallback for
// locales WITHOUT curated content.
const CURATED_LOCALES = new Set<string>(['it']);
const GOOGLE_TRANSLATE_SCRIPT_ID = 'google-translate-script';
const GOOGLE_TRANSLATE_INCLUDED_LANGUAGES = LANGUAGES.map((l) => l.googleCode).join(',');

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
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

// ── Google Translate helpers ──────────────────────────────────────────────────

function getGTSelect(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>('.goog-te-combo');
}

let googleTranslateScriptPromise: Promise<void> | null = null;

function killGoogleTranslateBanner() {
  const banner = document.querySelector<HTMLElement>('.goog-te-banner-frame');
  if (banner) banner.style.setProperty('display', 'none', 'important');
  document.body.style.setProperty('top', '0', 'important');
  document.body.style.setProperty('position', 'static', 'important');
}

function initGoogleTranslate() {
  if (!window.google?.translate?.TranslateElement || getGTSelect()) {
    return;
  }

  new window.google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages: GOOGLE_TRANSLATE_INCLUDED_LANGUAGES,
      layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
      autoDisplay: false,
    },
    'google_translate_element'
  );

  setTimeout(killGoogleTranslateBanner, 500);
  setTimeout(killGoogleTranslateBanner, 1500);
}

function ensureGoogleTranslateScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (getGTSelect()) {
    return Promise.resolve();
  }

  if (window.google?.translate?.TranslateElement) {
    initGoogleTranslate();
    return Promise.resolve();
  }

  if (googleTranslateScriptPromise) {
    return googleTranslateScriptPromise;
  }

  googleTranslateScriptPromise = new Promise((resolve, reject) => {
    window.googleTranslateElementInit = () => {
      initGoogleTranslate();
      resolve();
    };

    const existing = document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => reject(new Error('Failed to load Google Translate'));
    document.body.appendChild(script);
  });

  return googleTranslateScriptPromise;
}

function applyGoogleTranslate(googleCode: string): boolean {
  const select = getGTSelect();
  if (!select) return false;
  select.value = googleCode;
  select.dispatchEvent(new Event('change'));
  return true;
}

function forceGoogleTranslate(googleCode: string): boolean {
  const select = getGTSelect();
  if (!select) return false;

  select.value = '';
  select.dispatchEvent(new Event('change'));

  window.setTimeout(() => {
    select.value = googleCode;
    select.dispatchEvent(new Event('change'));
  }, 50);

  return true;
}

function scheduleGoogleTranslate(googleCode: string, maxAttempts = 25): () => void {
  let cancelled = false;
  let interval: ReturnType<typeof setInterval> | null = null;

  ensureGoogleTranslateScript().then(() => {
    if (cancelled) return;

    let attempts = 0;
    const tryApply = () => {
      attempts++;
      const applied = applyGoogleTranslate(googleCode);

      if (applied || attempts > maxAttempts) {
        if (interval) clearInterval(interval);
        interval = null;
      }
    };

    tryApply();
    if (!getGTSelect()) {
      interval = setInterval(tryApply, 200);
    }
  }).catch((error) => {
    console.error(error);
  });

  return () => {
    cancelled = true;
    if (interval) clearInterval(interval);
  };
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

function clearGTCookies() {
  const hostname = window.location.hostname;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname}`;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// ── Context ───────────────────────────────────────────────────────────────────

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [dictionary, setDictionary] = useState<Record<string, any>>({});

  const restoredRef = useRef(false);

  const userSelectedRef = useRef(false);
  const currentLanguageRef = useRef<Language>(LANGUAGES[0]);

  // Keep the UI-chrome locale in sync with the URL for curated locales: a fresh
  // visit to /it/... should show Italian chrome (menu, dictionary) immediately,
  // not English-until-you-touch-the-switcher. Unprefixed (en) URLs are left
  // alone so Google-Translate-only locales (es, fr, ...) keep their state.
  const urlLocale = useLocale();
  useEffect(() => {
    if (CURATED_LOCALES.has(urlLocale) && urlLocale !== locale) {
      setLocaleState(urlLocale as Locale);
      localStorage.setItem(STORAGE_KEY, urlLocale);
      document.documentElement.lang = urlLocale;
      const lang = LANGUAGES.find((l) => l.code === urlLocale);
      if (lang) currentLanguageRef.current = lang;
      clearGTCookies();
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

    // Curated locales serve their own content — don't invoke Google Translate,
    // and clear any stale googtrans cookie so a prior GT session can't
    // re-translate the curated page on load.
    if (CURATED_LOCALES.has(saved)) {
      clearGTCookies();
      return;
    }

    return scheduleGoogleTranslate(savedLang.googleCode, 50);
  }, []);

  const setLocale = useCallback((code: Locale) => {
    userSelectedRef.current = true;

    setLocaleState(code);
    localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.lang = code;

    const lang = LANGUAGES.find(l => l.code === code);
    document.documentElement.dir = lang?.dir ?? 'ltr';

    if (code === 'en') {
      currentLanguageRef.current = LANGUAGES[0];
      const widgetReady = resetGoogleTranslateToEnglish();
      if (!widgetReady) {
        clearGTCookies();
      }
      return;
    }

    // Curated locale: show the served (curated) content as-is; ensure Google
    // Translate is reset to the original so it never re-translates our text.
    if (lang && CURATED_LOCALES.has(code)) {
      currentLanguageRef.current = lang;
      const widgetReady = resetGoogleTranslateToEnglish();
      if (!widgetReady) {
        clearGTCookies();
      }
      return;
    }

    if (lang) {
      currentLanguageRef.current = lang;
      scheduleGoogleTranslate(lang.googleCode, 25);
    }
  }, []);

  const currentLanguage = LANGUAGES.find(l => l.code === locale) ?? LANGUAGES[0];

  useEffect(() => {
    currentLanguageRef.current = currentLanguage;
  }, [currentLanguage]);

  useEffect(() => {
    const handleMdxReady = () => {
      const lang = currentLanguageRef.current;
      if (lang.code === 'en' || CURATED_LOCALES.has(lang.code)) return;

      scheduleGoogleTranslate(lang.googleCode);
    };

    window.addEventListener('zechub:mdx-ready', handleMdxReady);
    return () => window.removeEventListener('zechub:mdx-ready', handleMdxReady);
  }, []);

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
