"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Palette } from "lucide-react";

export const COLOR_THEME_KEY = "zechub-color-theme";

// Swatches: [light page, accent, dark surface]. Keep in sync with the
// [data-color-theme] blocks in globals.css.
const THEMES = [
  { id: "default", name: "Default", swatch: ["#fff9f9", "#147DF6", "#06192F"] },
  { id: "ocean", name: "Ocean", swatch: ["#f0f8fc", "#0082a8", "#02101a"] },
  { id: "sunset", name: "Sunset", swatch: ["#fcf6f2", "#cc5a3a", "#1a0e0a"] },
  { id: "forest", name: "Forest", swatch: ["#f3f8f3", "#3a7a40", "#0a110a"] },
  { id: "ledger", name: "Ledger", swatch: ["#f6f7fa", "#e8b245", "#0e0f14"] },
] as const;

function applyTheme(id: string) {
  const root = document.documentElement;
  if (id === "default") root.removeAttribute("data-color-theme");
  else root.setAttribute("data-color-theme", id);
}

export default function ColorThemePicker() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("default");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COLOR_THEME_KEY);
      if (saved && THEMES.some((t) => t.id === saved)) setCurrent(saved);
    } catch {
      /* storage unavailable: stay on default */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  const choose = (id: string) => {
    setCurrent(id);
    applyTheme(id);
    try {
      localStorage.setItem(COLOR_THEME_KEY, id);
    } catch {
      /* ignore */
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Color theme"
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Color theme"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-nav-foreground transition-colors hover:bg-nav-hover-bg hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <Palette aria-hidden="true" className="h-4 w-4" />
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label="Color theme"
          className="absolute right-0 top-full z-50 mt-2 w-[min(19rem,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-slate-50 shadow-xl dark:border-white/10 dark:bg-slate-900"
        >
          <p className="border-b border-slate-200 px-4 py-3 font-[family-name:var(--font-heading)] text-sm font-medium text-slate-900 dark:border-white/10 dark:text-slate-100">
            Color theme
          </p>
          <div className="grid grid-cols-2 gap-2 p-3">
            {THEMES.map((t) => {
              const active = current === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => choose(t.id)}
                  aria-pressed={active}
                  className={`rounded-lg border p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    active
                      ? "border-brand bg-brand/10"
                      : "border-slate-200 hover:border-brand/60 dark:border-white/10"
                  }`}
                >
                  <span className="flex h-8 overflow-hidden rounded-md border border-slate-300 dark:border-white/15">
                    {t.swatch.map((c) => (
                      <span key={c} className="flex-1" style={{ background: c }} />
                    ))}
                  </span>
                  <span className="mt-1.5 flex items-center justify-between text-sm text-slate-800 dark:text-slate-100">
                    {t.name}
                    {active ? (
                      <Check aria-hidden="true" className="h-4 w-4 text-brand" />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
