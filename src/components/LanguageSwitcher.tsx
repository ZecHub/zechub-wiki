"use client";

import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale, currentLanguage } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const displayLanguage = mounted ? currentLanguage : LANGUAGES[0];

  // ── Outside-click handler ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleSelect = (code: string) => {
    setLocale(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline text-sm font-medium">
          {displayLanguage.flag} {displayLanguage.nativeLabel}
        </span>
        <span className="sm:hidden text-sm">
          {displayLanguage.flag}
        </span>
        <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Language options"
          className="absolute right-0 mt-2 w-52 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={lang.code === locale}
              onClick={() => handleSelect(lang.code)}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm cursor-pointer ${
                lang.code === locale ? 'bg-slate-200 dark:bg-slate-700 font-semibold' : ''
              }`}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span>{lang.nativeLabel}</span>
              {lang.code !== lang.nativeLabel.toLowerCase() && (
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