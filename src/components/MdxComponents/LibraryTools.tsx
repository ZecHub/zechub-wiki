'use client';

import { Search } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Filter box and letter index for the Zcash Library glossary. The glossary itself stays plain markdown
// (one heading per letter, one table per letter); this component only hides rows that do not match and
// the letters left with no rows, so the page works the same with scripts off.

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";

type Stats = { shown: number; total: number; byLetter: Record<string, number> };

export default function LibraryTools({ letters = "" }: { letters?: string }) {
  const list = useMemo(
    () => String(letters).split(",").map((s) => s.trim().toLowerCase()).filter(Boolean),
    [letters],
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);

  const apply = useCallback((q: string) => {
    const parent = rootRef.current?.parentElement;
    if (!parent) return;
    const needle = q.trim().toLowerCase();
    const kids = Array.from(parent.children) as HTMLElement[];
    const byLetter: Record<string, number> = {};
    let shown = 0;
    let total = 0;
    kids.forEach((el, i) => {
      if (el.tagName !== "H2" || !/^[a-z]$/.test(el.id)) return;
      const body = kids[i + 1];
      const hasTable = !!body && !!body.querySelector("table");
      const rows = hasTable ? (Array.from(body.querySelectorAll("tbody tr")) as HTMLElement[]) : [];
      let visible = 0;
      rows.forEach((r) => {
        const hit = !needle || (r.textContent || "").toLowerCase().includes(needle);
        r.style.display = hit ? "" : "none";
        if (hit) visible++;
      });
      total += rows.length;
      shown += visible;
      byLetter[el.id] = visible;
      const hide = !!needle && visible === 0;
      el.style.display = hide ? "none" : "";
      if (hasTable) body.style.display = hide ? "none" : "";
    });
    setStats({ shown, total, byLetter });
  }, []);

  useEffect(() => {
    apply(query);
  }, [query, apply]);

  const filtering = query.trim() !== "";
  const status = !stats
    ? ""
    : !filtering
      ? `${stats.total} terms`
      : stats.shown > 0
        ? `${stats.shown} of ${stats.total} terms`
        : `No terms match "${query.trim()}".`;

  return (
    <div ref={rootRef} className="not-prose my-6">
      <label htmlFor="library-filter" className="sr-only">
        Filter terms and definitions
      </label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />
        <input
          id="library-filter"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter terms and definitions"
          autoComplete="off"
          className={`w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-base text-slate-900 placeholder:text-slate-400 dark:border-white/15 dark:bg-white/5 dark:text-white ${focusRing}`}
        />
      </div>
      <p aria-live="polite" className="m-0 mt-2 min-h-[1.25rem] text-sm text-slate-500 dark:text-slate-400">
        {status}
      </p>
      <nav aria-label="Jump to a letter" className="mt-3">
        <ul className="m-0 flex list-none flex-nowrap gap-1.5 overflow-x-auto p-0 pb-1 [scrollbar-width:none] imd:flex-wrap imd:overflow-visible imd:pb-0 [&::-webkit-scrollbar]:hidden">
          {list.map((l) => {
            const empty = filtering && stats ? !stats.byLetter[l] : false;
            return (
              <li key={l} className="m-0 shrink-0 p-0">
                <a
                  href={`#${l}`}
                  aria-disabled={empty || undefined}
                  tabIndex={empty ? -1 : undefined}
                  aria-label={`Terms starting with ${l.toUpperCase()}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-md border font-mono text-sm font-semibold no-underline transition-colors ${focusRing} ${
                    empty
                      ? "pointer-events-none border-slate-200 text-slate-300 dark:border-white/10 dark:text-slate-600"
                      : "border-slate-200 text-slate-700 hover:border-brand hover:text-brand dark:border-white/15 dark:text-slate-200 dark:hover:text-brand-soft"
                  }`}
                >
                  {l.toUpperCase()}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
