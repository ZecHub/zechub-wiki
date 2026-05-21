// context/LanguageContext.tsx

"use client";

import {
  createContext, useContext, useState,
  useEffect, useCallback, useRef, useMemo, ReactNode,
} from 'react';
import { getDictionary } from '@/lib/getDictionary';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Language, LANGUAGES } from '@/i18n/config';

export type Locale = string;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  currentLanguage: Language;
  t: Record<string, any>;
}

const STORAGE_KEY = 'zechub_language';
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

// let googleTranslateScriptPromise: Promise<void> | null = null;

// function killGoogleTranslateBanner() {
//   const banner = document.querySelector<HTMLElement>('.goog-te-banner-frame');
//   if (banner) banner.style.setProperty('display', 'none', 'important');
//   document.body.style.setProperty('top', '0', 'important');
//   document.body.style.setProperty('position', 'static', 'important');
// }

// function initGoogleTranslate() {
//   if (!window.google?.translate?.TranslateElement || getGTSelect()) {
//     return;
//   }

//   new window.google.translate.TranslateElement(
//     {
//       pageLanguage: 'en',
//       includedLanguages: GOOGLE_TRANSLATE_INCLUDED_LANGUAGES,
//       layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
//       autoDisplay: false,
//     },
//     'google_translate_element'
//   );

//   setTimeout(killGoogleTranslateBanner, 500);
//   setTimeout(killGoogleTranslateBanner, 1500);
// }

// function ensureGoogleTranslateScript(): Promise<void> {
//   if (typeof window === 'undefined') {
//     return Promise.resolve();
//   }

//   if (getGTSelect()) {
//     return Promise.resolve();
//   }

//   if (window.google?.translate?.TranslateElement) {
//     initGoogleTranslate();
//     return Promise.resolve();
//   }

//   if (googleTranslateScriptPromise) {
//     return googleTranslateScriptPromise;
//   }

//   googleTranslateScriptPromise = new Promise((resolve, reject) => {
//     window.googleTranslateElementInit = () => {
//       initGoogleTranslate();
//       resolve();
//     };

//     const existing = document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID);
//     if (existing) {
//       resolve();
//       return;
//     }

//     const script = document.createElement('script');
//     script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
//     script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
//     script.async = true;
//     script.onerror = () => reject(new Error('Failed to load Google Translate'));
//     document.body.appendChild(script);
//   });

//   return googleTranslateScriptPromise;
// }

// function applyGoogleTranslate(googleCode: string): boolean {
//   const select = getGTSelect();
//   if (!select) return false;
//   select.value = googleCode;
//   select.dispatchEvent(new Event('change'));
//   return true;
// }

// function scheduleGoogleTranslate(googleCode: string, maxAttempts = 25): () => void {
//   let cancelled = false;
//   let interval: ReturnType<typeof setInterval> | null = null;

//   ensureGoogleTranslateScript().then(() => {
//     if (cancelled) return;

//     let attempts = 0;
//     const tryApply = () => {
//       attempts++;
//       const applied = applyGoogleTranslate(googleCode);

//       if (applied || attempts > maxAttempts) {
//         if (interval) clearInterval(interval);
//         interval = null;
//       }
//     };

//     tryApply();
//     if (!getGTSelect()) {
//       interval = setInterval(tryApply, 200);
//     }
//   }).catch((error) => {
//     console.error(error);
//   });

//   return () => {
//     cancelled = true;
//     if (interval) clearInterval(interval);
//   };
// }

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

export function LanguageProvider({ children, params }: { children: ReactNode, params: { locale: string } }) {
  const [locale, setLocaleState] = useState<Locale>(params.locale);
  const [dictionary, setDictionary] = useState<Record<string, any>>({});
  const router = useRouter();
  const pathname = usePathname();

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

    // return scheduleGoogleTranslate(savedLang.googleCode, 50);
  }, []);

  const setLocale = useCallback((code: Locale) => {
    userSelectedRef.current = true;

    setLocaleState(code);
    localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.lang = code;

    const lang = LANGUAGES.find(l => l.code === code);
    document.documentElement.dir = lang?.dir ?? 'ltr';

    // if (code === 'en') {
    //   const widgetReady = resetGoogleTranslateToEnglish();
    //   if (!widgetReady) {
    //     clearGTCookies();
    //   }
    //   return;
    // }

    router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        {pathname, params},
        {locale: code}
      );

    // if (lang) {
    //   scheduleGoogleTranslate(lang.googleCode);
    // }
  }, [pathname, params, router]);

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
