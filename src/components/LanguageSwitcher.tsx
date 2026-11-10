"use client";

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopLabelRef = useRef<HTMLSpanElement>(null);
  const mobileFlagRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const lang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];
    // The closed button shows just the language name; the flags live in the list.
    const text = lang.nativeLabel;
    if (desktopLabelRef.current) {
      desktopLabelRef.current.textContent = text;
    }
    if (mobileFlagRef.current) {
      mobileFlagRef.current.textContent = lang.code.toUpperCase();
    }
  }, [locale]);

  // ── Outside-click handler ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  const handleSelect = (code: string) => {
    setLocale(code);
    setIsOpen(false);
    // Every language ships curated content and a next-intl route, so always
    // navigate to the locale-prefixed path (English is served unprefixed at the
    // root) — the server then renders the curated page for that locale.
    router.replace(pathname, { locale: code as (typeof routing.locales)[number] });
  };

  return (
    <div className="relative notranslate" ref={containerRef} translate="no">
      <button
        type="button"
        key={locale}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 font-[family-name:var(--font-heading)] rounded-lg border border-slate-300 px-2 py-1.5 min-[1180px]:gap-2 min-[1180px]:px-3 text-slate-700 transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:border-slate-700 dark:text-slate-200 cursor-pointer"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
        <span
          ref={desktopLabelRef}
          className="hidden min-[1180px]:inline text-sm font-medium"
          suppressHydrationWarning
        />
        <span
          ref={mobileFlagRef}
          className="min-[1180px]:hidden text-xs font-semibold"
          suppressHydrationWarning
        />
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Language options"
          className="absolute right-0 z-50 mt-2 font-[family-name:var(--font-heading)] max-h-80 w-64 overflow-y-auto overflow-x-hidden rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-xl shadow-black/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="option"
              aria-selected={lang.code === locale}
              onClick={() => handleSelect(lang.code)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-slate-200/70 dark:hover:bg-slate-800 ${
                lang.code === locale
                  ? 'font-semibold text-brand'
                  : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span>{lang.nativeLabel}</span>
              {lang.nativeLabel !== lang.label && (
                <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
                  {lang.label}
                </span>
              )}
              {lang.code === locale && (
                <Check
                  className={`${lang.nativeLabel !== lang.label ? 'ml-1' : 'ml-auto'} h-4 w-4 shrink-0`}
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
