"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ShieldAlert, ShieldCheck } from "lucide-react";

type Item = { id: string; source: string; kind: "advisory" | "release"; title: string; date: string; url: string };

const TILE =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand dark:text-brand-soft";

function fmt(d: string) {
  try {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return d;
  }
}

// Live list of the latest security advisories and security-related releases (zebra, zcashd, librustzcash).
export default function SecurityFeed() {
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/security-updates")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((j) => !cancelled && setItems(Array.isArray(j.items) ? j.items : []))
      .catch(() => !cancelled && setItems([]));
    return () => {
      cancelled = true;
    };
  }, []);

  if (items === null) {
    return (
      <div className="not-prose my-6 space-y-3" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[68px] animate-pulse rounded-xl border border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-white/[0.03]" />
        ))}
      </div>
    );
  }
  if (!items.length) {
    return (
      <p className="not-prose my-6 text-sm text-slate-600 dark:text-slate-400">
        Live updates are unavailable right now. Use the official sources below.
      </p>
    );
  }
  return (
    <div className="not-prose my-6 space-y-3">
      {items.map((i) => (
        <a
          key={i.id}
          href={i.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 no-underline transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40"
        >
          <span className={TILE}>
            {i.kind === "advisory" ? <ShieldAlert aria-hidden="true" className="h-6 w-6" /> : <ShieldCheck aria-hidden="true" className="h-6 w-6" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold leading-tight text-slate-900 dark:text-white">{i.title}</span>
            <span className="mt-0.5 block text-sm text-slate-600 dark:text-slate-400">
              {i.source} · {i.kind === "advisory" ? "Security advisory" : "Release"} · {fmt(i.date)}
            </span>
          </span>
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-brand dark:text-brand-soft" />
        </a>
      ))}
    </div>
  );
}
