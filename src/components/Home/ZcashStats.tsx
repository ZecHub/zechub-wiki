"use client";
import { useEffect, useRef, useState } from "react";

type Stats = { circulation: number; shielded: number; blocks: number };

const MAX_SUPPLY = 21_000_000;
const ENDPOINT = "/api/blockchain-data"; // same-origin proxy, cached ~1 min

// Counts from the previous value up to `target` (easeOutCubic). With "reduce
// motion" on, or before the strip is on screen, it just shows the number.
function useCountUp(target: number, active: boolean, ms = 1400) {
  const [value, setValue] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = target;
      setValue(target);
      return;
    }
    const start = performance.now();
    const origin = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / ms, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = origin + (target - origin) * eased;
      from.current = v;
      setValue(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, ms]);
  return value;
}

const fmt = (n: number) =>
  Math.round(n).toLocaleString("en-US", { maximumFractionDigits: 0 });

// Three live numbers about the chain. If the feed is unavailable the whole
// strip is hidden, so the home never shows broken or stale-looking values.
export default function ZcashStats({ className = "" }: { className?: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [visible, setVisible] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(ENDPOINT);
        if (!res.ok) return;
        const d = (await res.json())?.data;
        if (
          !cancelled &&
          typeof d?.circulation === "number" &&
          typeof d?.shielded_value_zec === "number" &&
          typeof d?.blocks === "number"
        ) {
          setStats({
            circulation: d.circulation,
            shielded: d.shielded_value_zec,
            blocks: d.blocks,
          });
        }
      } catch {
        // keep the last value, or nothing
      }
    };
    load();
    const id = setInterval(load, 5 * 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Start the animation the first time the strip scrolls into view.
  useEffect(() => {
    const el = box.current;
    if (!el || visible) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stats, visible]);

  const circulation = useCountUp(stats?.circulation ?? 0, visible && !!stats);
  const shielded = useCountUp(stats?.shielded ?? 0, visible && !!stats);
  const blocks = useCountUp(stats?.blocks ?? 0, visible && !!stats);

  if (!stats) return null;

  const supplyPct = Math.min((stats.circulation / MAX_SUPPLY) * 100, 100);
  const shieldedPct = (stats.shielded / stats.circulation) * 100;

  const label =
    "font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300";
  const value =
    "mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50 md:text-3xl";
  const sub = "mt-1 text-sm text-slate-600 dark:text-slate-300";

  return (
    <div
      ref={box}
      className={`grid grid-cols-1 divide-y divide-slate-200 dark:divide-slate-700/60 md:grid-cols-3 md:divide-x md:divide-y-0 ${className}`}
    >
      <div className="p-6">
        <p className={label}>Circulating supply</p>
        <p className={value}>
          {fmt(circulation)}{" "}
          <span className="text-base font-medium text-slate-600 dark:text-slate-300">
            ZEC
          </span>
        </p>
        <div
          className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
          role="img"
          aria-label={`${supplyPct.toFixed(1)}% of the 21 million maximum supply`}
        >
          <div
            className="h-full rounded-full bg-[#1984c7] transition-[width] duration-[1400ms] ease-out motion-reduce:transition-none"
            style={{ width: visible ? `${supplyPct}%` : "0%" }}
          />
        </div>
        <p className={sub}>{supplyPct.toFixed(1)}% of the 21M maximum</p>
      </div>

      <div className="p-6">
        <p className={label}>Shielded supply</p>
        <p className={value}>
          {fmt(shielded)}{" "}
          <span className="text-base font-medium text-slate-600 dark:text-slate-300">
            ZEC
          </span>
        </p>
        <p className={sub}>{shieldedPct.toFixed(1)}% of circulating supply</p>
      </div>

      <div className="p-6">
        <p className={`${label} flex items-center gap-2`}>
          Block height
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
        </p>
        <p className={value}>{fmt(blocks)}</p>
        <p className={sub}>Latest block on the Zcash mainnet</p>
      </div>
    </div>
  );
}
