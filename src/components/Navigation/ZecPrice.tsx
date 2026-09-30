"use client";
import { useEffect, useState } from "react";

type Price = { usd: number; change: number | null };

const URL = "/api/prices/simple?ids=zcash&vs_currencies=usd&include_24hr_change=true";

// Small ZEC/USD readout for the header. Neutral text colour for the price so it
// never fights the theme; the 24h change uses the 600/400 shades of green and
// red, which keep their contrast on both light and dark backgrounds.
export default function ZecPrice() {
  const [price, setPrice] = useState<Price | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(URL);
        if (!res.ok) return;
        const json = await res.json();
        const z = json?.zcash;
        if (!cancelled && typeof z?.usd === "number") {
          setPrice({
            usd: z.usd,
            change: typeof z.usd_24h_change === "number" ? z.usd_24h_change : null,
          });
        }
      } catch {
        // keep the last value (or nothing) if the feed is unavailable
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (!price) return null;

  const up = (price.change ?? 0) >= 0;
  return (
    <div
      className="hidden items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 md:flex"
      title="ZEC price in USD (24h change)"
    >
      <span className="font-medium text-slate-500 dark:text-slate-400">ZEC</span>
      <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">
        ${price.usd.toLocaleString("en-US", { maximumFractionDigits: 2 })}
      </span>
      {price.change !== null ? (
        <span
          className={`tabular-nums ${
            up
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-red-700 dark:text-red-400"
          }`}
        >
          {up ? "+" : ""}
          {price.change.toFixed(1)}%
        </span>
      ) : null}
    </div>
  );
}
