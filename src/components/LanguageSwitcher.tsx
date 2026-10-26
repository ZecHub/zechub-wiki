"use client";

import {
  useState, useRef, useEffect, useLayoutEffect, useId, useMemo,
  type KeyboardEvent, type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import { Globe, Search, X } from 'lucide-react';
import { useLanguage, LANGUAGES, type Language } from '@/context/LanguageContext';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

// Fold case and accents so "francais" finds "Français" and "ελληνικα" finds
// "Ελληνικά".
const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

const byEnglishName = (a: Language, b: Language) => a.label.localeCompare(b.label, 'en');

// The visitor's own languages, from the browser settings, mapped to the codes
// we ship ("pt-BR" -> "pt"), in the browser's order of preference.
function browserLocales(): string[] {
  if (typeof navigator === 'undefined') return [];
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];
  const out: string[] = [];
  for (const tag of prefs) {
    const base = (tag || '').toLowerCase().split('-')[0];
    if (base && !out.includes(base) && LANGUAGES.some((l) => l.code === base)) out.push(base);
  }
  return out;
}

// ZecHub accent (#F4B728): the current language gets a filled badge, and
// hover/focus tint the row and outline the badge. Colour is never the only
// cue: the current row is also bold, checked and aria-selected.
function CodeBadge({ code, current = false }: { code: string; current?: boolean }) {
  return (
    <span
      aria-hidden="true"
      data-current-badge={current ? '' : undefined}
      className={`inline-flex items-center justify-center w-8 h-6 shrink-0 rounded-md border text-[11px] font-semibold tracking-wide transition-colors ${
        current
          ? 'border-[#F4B728] bg-[#F4B728] text-slate-900'
          : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/40 group-hover:border-[#F4B728] group-focus-visible:border-[#F4B728]'
      }`}
    >
      {code.toUpperCase()}
    </span>
  );
}

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { locale, setLocale, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Phones (below the site's `imd` breakpoint, 725px; its `sm` is 300px) get a bottom sheet rendered into <body>: inside the sticky header a
  // `fixed` element is positioned against the header (its backdrop filter
  // makes it the containing block), which clipped the sheet off-screen.
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    // Same boundary as Tailwind's imd (min-width: 725px), so fractional
    // widths (zoom) can never match neither.
    const mq = window.matchMedia?.('(min-width: 725px)');
    if (!mq) return;
    const update = () => setIsPhone(!mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  // Phone sheet: fixed height, so the search field at its top stays put while
  // results shrink, and kept above the on-screen keyboard. Mobile browsers do
  // not shrink the layout viewport for the keyboard, so bottom: 0 would sit
  // behind it; the visual viewport says how much of the screen is left.
  const [sheetBox, setSheetBox] = useState<CSSProperties | undefined>();
  useEffect(() => {
    const vv = window.visualViewport;
    if (!isOpen || !isPhone || !vv) return;
    const update = () => {
      const keyboard = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      const height = Math.round(vv.height * 0.85);
      // Same box: keep the old object, so panning does not re-render the list.
      setSheetBox((prev) => (prev?.bottom === keyboard && prev?.height === height ? prev : { bottom: keyboard, height }));
    };
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      setSheetBox(undefined);
    };
  }, [isOpen, isPhone]);

  // The phone sheet is modal: the page behind it does not scroll.
  useEffect(() => {
    if (!isOpen || !isPhone) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [isOpen, isPhone]);
  const inPicker = (node: Node | null) =>
    Boolean(node && (containerRef.current?.contains(node) || panelRef.current?.contains(node)));
  const restoreFocusRef = useRef(false);
  const desktopLabelRef = useRef<HTMLSpanElement>(null);
  const mobileLabelRef = useRef<HTMLSpanElement>(null);
  const listboxId = useId();
  const suggestedId = useId();
  const allId = useId();

  const common = (t as { common?: Record<string, string> } | undefined)?.common;
  const L = {
    title: common?.language ?? 'Language',
    search: common?.languageSearch ?? 'Search languages',
    suggested: common?.languageSuggested ?? 'Suggested',
    all: common?.languageAll ?? 'All languages',
    none: common?.languageNone ?? 'No language found',
    close: common?.close ?? 'Close',
  };


  // Trigger text is written after hydration (as before), so the server and
  // client renders never disagree about the locale.
  useLayoutEffect(() => {
    const lang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];
    if (desktopLabelRef.current) {
      desktopLabelRef.current.textContent = lang.nativeLabel;
    }
    if (mobileLabelRef.current) {
      mobileLabelRef.current.textContent = lang.code.toUpperCase();
    }
  }, [locale]);

  // Suggested = the current language, then the browser's languages. Read
  // during render: the panel only renders after a click, never on the server,
  // and computing it here (not in an effect) keeps the focused option mounted.
  const suggestedCodes = isOpen
    ? [locale, ...browserLocales()].filter((c, i, a) => a.indexOf(c) === i)
    : [];

  const q = fold(query.trim());
  const sorted = useMemo(() => [...LANGUAGES].sort(byEnglishName), []);
  const results = q
    ? sorted.filter((l) => fold(l.nativeLabel).includes(q) || fold(l.label).includes(q) || l.code === q)
    : null;
  const suggested = suggestedCodes
    .map((c) => LANGUAGES.find((l) => l.code === c))
    .filter((l): l is Language => Boolean(l));
  const rest = sorted.filter((l) => !suggestedCodes.includes(l.code));

  const options = () =>
    Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);

  useLayoutEffect(() => {
    if (isOpen) {
      // On touch screens focusing the field would open the keyboard over the
      // list; there the current language gets focus instead.
      const coarse = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
      if (coarse) options().find((o) => o.getAttribute('aria-selected') === 'true')?.focus();
      else searchRef.current?.focus();
    } else if (restoreFocusRef.current) {
      // Locale changes remount the keyed trigger, so restore focus after commit.
      triggerRef.current?.focus();
      restoreFocusRef.current = false;
    }
  }, [isOpen, locale]);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (!inPicker(e.target as Node)) {
        restoreFocusRef.current = false;
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const close = (restore: boolean) => {
    restoreFocusRef.current = restore;
    setIsOpen(false);
    setQuery('');
  };

  const handleSelect = (code: string) => {
    restoreFocusRef.current = true;
    setLocale(code);
    setIsOpen(false);
    setQuery('');
    // usePathname() drops the query string; read it at click time so page
    // state carried in it (?module=, dashboard tabs) survives the switch. The
    // router keeps the hash itself.
    router.replace(`${pathname}${window.location.search}`, {
      locale: code as (typeof routing.locales)[number],
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Enter and Escape that commit or cancel an IME composition (Japanese,
    // Chinese, Korean input) belong to the input method, not to the picker.
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (isOpen && event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close(true);
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
    // The phone sheet is modal: Tab cycles inside it (close button, search
    // field, current language) instead of leaving to the dimmed page.
    if (event.key === 'Tab' && isPhone && panelRef.current) {
      const stops = [
        ...panelRef.current.querySelectorAll<HTMLElement>('button:not([tabindex="-1"]), input'),
      ];
      const selected = options().find((o) => o.getAttribute('aria-selected') === 'true');
      if (selected) stops.push(selected);
      const at = stops.indexOf(document.activeElement as HTMLElement);
      event.preventDefault();
      const next = at < 0 ? 0 : (at + (event.shiftKey ? -1 : 1) + stops.length) % stops.length;
      stops[next]?.focus();
      return;
    }
    const list = options();
    const inSearch = document.activeElement === searchRef.current;
    if (inSearch && event.key === 'Enter') {
      event.preventDefault();
      if (!q) return;
      const first = list[0]?.dataset.code;
      if (first) handleSelect(first);
      return;
    }
    if (!isArrowKey && (inSearch || (event.key !== 'Home' && event.key !== 'End'))) return;
    event.preventDefault();
    event.stopPropagation();
    const i = list.findIndex((o) => o === document.activeElement);
    let next: number;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = list.length - 1;
    else if (i < 0) next = event.key === 'ArrowDown' ? 0 : list.length - 1;
    else if (event.key === 'ArrowUp' && i === 0) { searchRef.current?.focus(); return; }
    else next = Math.max(0, Math.min(list.length - 1, i + (event.key === 'ArrowDown' ? 1 : -1)));
    list[next]?.focus();
  };

  const renderOption = (lang: Language) => (
    <button
      key={lang.code}
      type="button"
      tabIndex={-1}
      role="option"
      data-code={lang.code}
      aria-selected={lang.code === locale}
      onClick={() => handleSelect(lang.code)}
      className={`group w-full text-start px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-[#F4B728]/10 focus-visible:bg-[#F4B728]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F4B728] transition-colors cursor-pointer ${
        lang.code === locale ? 'bg-[#F4B728]/20 hover:bg-[#F4B728]/25' : ''
      }`}
    >
      <CodeBadge code={lang.code} current={lang.code === locale} />
      <span className="flex flex-col min-w-0">
        <span lang={lang.code} className={`text-sm leading-tight truncate ${lang.code === locale ? 'font-semibold' : 'font-medium'}`}>
          {lang.nativeLabel}
        </span>
        {lang.nativeLabel !== lang.label && (
          <span lang="en" className="text-xs leading-tight text-slate-500 dark:text-slate-400 truncate">
            {lang.label}
          </span>
        )}
      </span>
      {lang.code === locale && (
        <svg className="ms-auto w-4 h-4 text-amber-600 dark:text-[#F4B728] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );

  // Two columns on wider screens, filled top to bottom (column-major), so
  // ArrowDown, which follows the DOM order, also moves down on screen.
  const grid = (langs: Language[], extra = '') => (
    <div
      role="presentation"
      style={{ '--rows': Math.ceil(langs.length / 2) } as CSSProperties}
      className={`grid imd:grid-cols-2 imd:grid-flow-col imd:[grid-template-rows:repeat(var(--rows),auto)] gap-0.5 ${extra}`}
    >
      {langs.map(renderOption)}
    </div>
  );

  const heading = (id: string, text: string) => (
    <div id={id} className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {text}
    </div>
  );

  const panelBody = (
    <>
          {/* Mobile: dimmed backdrop behind the bottom sheet. */}
          <div className="fixed inset-0 z-[290] bg-black/40 imd:hidden" aria-hidden="true" onClick={() => close(false)} />
          <div
            ref={panelRef}
            role="dialog"
            aria-label={L.title}
            aria-modal={isPhone || undefined}
            // A press on a non-focusable spot (heading, padding, scrollbar)
            // would move focus to <body> and close the panel through onBlur;
            // only the search field takes focus from a press.
            onMouseDown={(e) => {
              if (e.target === searchRef.current) return;
              // Leave presses on the list's scrollbar alone (Firefox cannot
              // drag a scrollbar whose mousedown was cancelled); either side, for RTL.
              const list = listRef.current;
              if (e.target === list && list && (e.nativeEvent.offsetX >= list.clientWidth || e.nativeEvent.offsetX < 0)) return;
              e.preventDefault();
            }}
            style={isPhone ? sheetBox : undefined}
            className="fixed inset-x-0 bottom-0 z-[300] h-[85dvh] rounded-t-2xl imd:h-auto imd:absolute imd:inset-x-auto imd:bottom-auto imd:end-0 imd:mt-2 imd:w-[30rem] imd:max-h-[75vh] imd:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-2xl flex flex-col"
          >
            {/* Phone sheet header (rendered only there, so it never adds a Tab stop on desktop). */}
            {isPhone && (
            <div className="flex items-center justify-between px-4 pt-3">
              <span className="text-base font-semibold">{L.title}</span>
              <button type="button" onClick={() => close(true)} aria-label={L.close} className="p-2 -me-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            )}
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <label className="relative block">
                <span className="sr-only">{L.search}</span>
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={L.search}
                  aria-controls={listboxId}
                  autoComplete="off"
                  className="w-full ps-9 pe-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-base imd:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </label>
            </div>
            {/* Always mounted, so screen readers announce when the text appears. */}
            <p aria-live="polite" className="sr-only">{results && !results.length ? L.none : ''}</p>
            <div ref={listRef} id={listboxId} role="listbox" aria-label="Language options" className="overflow-y-auto overscroll-contain px-2 pb-3">
              {results ? (
                results.length ? (
                  grid(results, "pt-2")
                ) : (
                  <p className="px-3 py-6 text-sm text-center text-slate-500">{L.none}</p>
                )
              ) : (
                <>
                  {suggested.length > 0 && (
                    <div role="group" aria-labelledby={suggestedId}>
                      {heading(suggestedId, L.suggested)}
                      {grid(suggested)}
                    </div>
                  )}
                  <div role="group" aria-labelledby={allId} className={suggested.length ? 'mt-1 border-t border-slate-200 dark:border-slate-700' : ''}>
                    {heading(allId, L.all)}
                    {grid(rest)}
                  </div>
                </>
              )}
            </div>
          </div>
    </>
  );

  return (
    <div
      className="relative notranslate"
      ref={containerRef}
      translate="no"
      onKeyDown={handleKeyDown}
      onBlur={(event) => {
        if (!inPicker(event.relatedTarget as Node | null)) { setIsOpen(false); setQuery(''); }
      }}
    >
      <button
        type="button"
        key={locale}
        ref={triggerRef}
        tabIndex={isOpen ? -1 : 0}
        // Safari does not focus buttons on press: without this the search field
        // blurs (closing the panel) and the click then opens it again.
        onMouseDown={(e) => { if (isOpen) e.preventDefault(); }}
        onClick={() => (isOpen ? close(true) : setIsOpen(true))}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-[#F4B728] hover:bg-[#F4B728]/10 focus-visible:ring-2 focus-visible:ring-[#F4B728] transition-all cursor-pointer"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Globe className="w-4 h-4" />
        <span ref={desktopLabelRef} className="hidden sm:inline text-sm font-medium" suppressHydrationWarning />
        <span ref={mobileLabelRef} className="sm:hidden text-xs font-semibold" suppressHydrationWarning />
        <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (isPhone ? createPortal(
        // React events bubble through the portal to the wrapper's key handler.
        <div className="notranslate" translate="no">{panelBody}</div>,
        document.body,
      ) : panelBody)}
    </div>
  );
}