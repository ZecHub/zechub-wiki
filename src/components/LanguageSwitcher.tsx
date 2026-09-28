"use client";

import { useState, useRef, useEffect, useLayoutEffect, useId, type KeyboardEvent } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const restoreFocusRef = useRef(false);
  const listboxId = useId();
  const desktopLabelRef = useRef<HTMLSpanElement>(null);
  const mobileFlagRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const lang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];
    const text = `${lang.flag} ${lang.nativeLabel}`;
    if (desktopLabelRef.current) {
      desktopLabelRef.current.textContent = text;
    }
    if (mobileFlagRef.current) {
      mobileFlagRef.current.textContent = lang.flag;
    }
  }, [locale]);

  useLayoutEffect(() => {
    if (isOpen) {
      const selectedIndex = Math.max(0, LANGUAGES.findIndex((lang) => lang.code === locale));
      optionRefs.current[selectedIndex]?.focus();
    } else if (restoreFocusRef.current) {
      // Locale changes remount the keyed trigger, so restore focus after commit.
      triggerRef.current?.focus();
      restoreFocusRef.current = false;
    }
  }, [isOpen, locale]);

  // ── Outside-click handler ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        restoreFocusRef.current = false;
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isOpen && event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      restoreFocusRef.current = true;
      setIsOpen(false);
      return;
    }

    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const isArrowKey = event.key === 'ArrowDown' || event.key === 'ArrowUp';
    if (!isOpen) {
      if (isArrowKey) {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    if (!isArrowKey && event.key !== 'Home' && event.key !== 'End') return;

    event.preventDefault();
    event.stopPropagation();
    const currentIndex = optionRefs.current.findIndex((option) => option === document.activeElement);
    const selectedIndex = Math.max(0, LANGUAGES.findIndex((lang) => lang.code === locale));
    let nextIndex = currentIndex < 0 ? selectedIndex : currentIndex;
    if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = LANGUAGES.length - 1;
    else if (currentIndex >= 0) {
      nextIndex = Math.max(0, Math.min(LANGUAGES.length - 1, currentIndex + (event.key === 'ArrowDown' ? 1 : -1)));
    }
    optionRefs.current[nextIndex]?.focus();
  };

  const handleSelect = (code: string) => {
    restoreFocusRef.current = true;
    setLocale(code);
    setIsOpen(false);
    // Every language ships curated content and a next-intl route, so always
    // navigate to the locale-prefixed path (English is served unprefixed at the
    // root) — the server then renders the curated page for that locale.
    router.replace(pathname, { locale: code as (typeof routing.locales)[number] });
  };

  return (
    <div
      className="relative notranslate"
      ref={containerRef}
      translate="no"
      onKeyDown={handleKeyDown}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <button
        type="button"
        key={locale}
        ref={triggerRef}
        tabIndex={isOpen ? -1 : 0}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-amber-500 transition-all cursor-pointer"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
      >
        <Globe className="w-4 h-4" />
        <span
          ref={desktopLabelRef}
          className="hidden sm:inline text-sm font-medium"
          suppressHydrationWarning
        />
        <span
          ref={mobileFlagRef}
          className="sm:hidden text-sm"
          suppressHydrationWarning
        />
        <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Language options"
          className="absolute right-0 mt-2 w-52 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto"
        >
          {LANGUAGES.map((lang, index) => (
            <button
              key={lang.code}
              type="button"
              ref={(option) => { optionRefs.current[index] = option; }}
              tabIndex={-1}
              role="option"
              aria-selected={lang.code === locale}
              onClick={() => handleSelect(lang.code)}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:bg-slate-200 dark:focus-visible:bg-slate-700 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500 transition-colors text-sm cursor-pointer ${
                lang.code === locale ? 'bg-slate-200 dark:bg-slate-700 font-semibold' : ''
              }`}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span>{lang.nativeLabel}</span>
              {lang.nativeLabel !== lang.label && (
                <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
                  {lang.label}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
