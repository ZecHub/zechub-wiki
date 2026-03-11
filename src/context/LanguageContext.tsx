"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { i18n, type Locale } from '@/i18n/config';
import { getDictionary } from '@/lib/getDictionary';

type Dictionary = Record<string, any>;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(i18n.defaultLocale);
  const [dictionary, setDictionary] = useState<Dictionary>({});

  useEffect(() => {
    // Load saved locale from localStorage
    const saved = localStorage.getItem('preferredLocale') as Locale;
    if (saved && i18n.locales.includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    // Load dictionary when locale changes
    let cancelled = false;
    (async () => {
      try {
        const dict = await getDictionary(locale);
        if (!cancelled) setDictionary(dict || {});
      } catch (err) {
        console.error('Error loading dictionary for', locale, err);
        if (!cancelled) setDictionary({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('preferredLocale', newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: dictionary }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
