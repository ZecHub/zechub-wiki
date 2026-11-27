"use client";

import { useEffect, useRef, useState } from "react";

// Wraps a markdown table. When it is wider than the screen, an end-edge fade and a short
// hint tell readers that more columns are hidden; both disappear once they reach the end.
export default function ScrollableTable({ children }: { children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = () => {
      const remaining = el.scrollWidth - el.clientWidth - Math.abs(el.scrollLeft);
      setMore(remaining > 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);
    if (el.firstElementChild) ro?.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", update);
      ro?.disconnect();
    };
  }, []);

  return (
    <div className="my-6">
      <div className="relative">
        <div ref={box} className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
          {children}
        </div>
        {more && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-px end-px w-10 rounded-e-xl bg-gradient-to-l from-slate-100 to-transparent rtl:bg-gradient-to-r dark:from-slate-900"
          />
        )}
      </div>
      {more && (
        <p className="m-0 mt-2 text-xs text-slate-500 dark:text-slate-400">
          Swipe sideways to see more columns{" "}
          <span aria-hidden="true" className="inline-block rtl:-scale-x-100">→</span>
        </p>
      )}
    </div>
  );
}
