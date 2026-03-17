"use client";

import { useState } from 'react';
import { i18n, type Locale } from '@/i18n/config';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const languages: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
};

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useLanguage();

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline text-sm font-medium">
          {languages[locale]}
        </span>
        <span className="sm:hidden text-sm font-medium">
          {locale.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-lg z-50 overflow-hidden">
            {i18n.locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLanguageChange(loc)}
                className={`w-full text-left px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
                  loc === locale ? 'bg-slate-200 dark:bg-slate-700 font-semibold' : ''
                }`}
              >
                {languages[loc]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
