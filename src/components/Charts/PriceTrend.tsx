"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import ChartHeader from "./ChartHeader";
import ChartContainer from "./Zcash/ChartContainer";

type Point = [number, number];
type Range = 7 | 30;
type PricePoint = { timestamp: number; date: string; price: number };

function formatPrice(value: number) {
  return value >= 100 ? `$${value.toFixed(0)}` : `$${value.toFixed(2)}`;
}

function formatDate(value: number, withYear = false) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "2-digit" } : {}),
  });
}

function PriceTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: number; payload?: PricePoint }>; label?: number }) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  const timestamp = point?.timestamp ?? label ?? 0;
  const value = point?.price ?? payload[0]?.value ?? 0;
  return (
    <div className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 shadow-md">
      <p className="mb-1 font-semibold">{formatDate(timestamp, true)}</p>
      <div className="flex justify-between gap-4 text-brand-soft">
        <span>ZEC price</span>
        <span className="font-semibold text-white">{formatPrice(Number(value))} USD</span>
      </div>
    </div>
  );
}

export default function PriceTrend({ compact = false, background = false }: { compact?: boolean; background?: boolean }) {
  const [range, setRange] = useState<Range>(7);
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetch(`/api/prices/history?days=${range}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("price history unavailable"))))
      .then((data) => {
        const next = Array.isArray(data?.prices)
          ? data.prices.filter((p: unknown): p is Point => Array.isArray(p) && p.length >= 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]))
          : [];
        if (!next.length) throw new Error("empty price history");
        setPoints(next);
      })
      .catch((reason: unknown) => {
        if ((reason as Error)?.name !== "AbortError") setError(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [range]);

  const data = useMemo<PricePoint[]>(() => points.map(([timestamp, price]) => ({
    timestamp,
    date: formatDate(timestamp, range === 30),
    price,
  })), [points, range]);
  const latest = data.at(-1)?.price ?? 0;
  const first = data[0]?.price ?? 0;
  const change = first ? ((latest - first) / first) * 100 : 0;
  const positive = change >= 0;

  const chart = (
    <AreaChart data={data} margin={{ top: 12, right: 18, left: 8, bottom: compact ? 8 : 22 }}>
      <defs>
        <linearGradient id="zecPriceGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#147DF6" stopOpacity={0.6} />
          <stop offset="95%" stopColor="#147DF6" stopOpacity={0.06} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
      <XAxis dataKey="timestamp" type="number" domain={["dataMin", "dataMax"]} tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(value) => formatDate(value, range === 30)} tickCount={compact ? 4 : 7} angle={compact ? 0 : -35} textAnchor={compact ? "middle" : "end"} height={compact ? 28 : 55} />
      <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={formatPrice} width={64} domain={["auto", "auto"]} />
      <Tooltip content={<PriceTooltip />} labelFormatter={(value) => Number(value)} />
      <Area type="monotone" dataKey="price" name="ZEC Price" stroke="#147DF6" fill="url(#zecPriceGradient)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#147DF6", stroke: "#fff", strokeWidth: 2 }} />
    </AreaChart>
  );

  if (background) {
    if (loading || error || !data.length) return null;
    return (
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-72 opacity-[0.08] dark:opacity-[0.12]" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">{chart}</ResponsiveContainer>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white dark:via-slate-950/60 dark:to-slate-950" />
      </div>
    );
  }

  if (compact) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/50 md:p-6" aria-labelledby="price-trend-title">
        <ChartHeader title="ZEC Price Trend" />
        <div className="mb-3 flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold tabular-nums">{latest ? formatPrice(latest) : "Loading…"}</span>
          {data.length ? <span className={positive ? "text-emerald-500" : "text-rose-500"}>{positive ? "+" : ""}{change.toFixed(2)}%</span> : null}
        </div>
        <div className="h-56">{loading ? <div className="h-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" /> : error ? <p className="pt-12 text-center text-sm text-slate-500">Price trend unavailable.</p> : <ResponsiveContainer width="100%" height="100%">{chart}</ResponsiveContainer>}</div>
      </section>
    );
  }

  return (
    <section aria-labelledby="price-trend-title">
      <ChartHeader title="ZEC Price Trend" />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 px-4 sm:px-8">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Current price</p>
          <p className="text-2xl font-semibold tabular-nums">{latest ? formatPrice(latest) : "Loading…"}</p>
          {data.length ? <p className={`mt-1 flex items-center gap-1 text-sm font-medium ${positive ? "text-emerald-600" : "text-rose-600"}`}>{positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}{positive ? "+" : ""}{change.toFixed(2)}% over {range} days</p> : null}
        </div>
        <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800" role="group" aria-label="Price trend range">
          {[7, 30].map((days) => <button key={days} type="button" onClick={() => setRange(days as Range)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${range === days ? "bg-white text-brand shadow-sm dark:bg-slate-700" : "text-slate-500"}`} aria-pressed={range === days}>{days}D</button>)}
        </div>
      </div>
      <ChartContainer loading={loading}>
        {error ? <div className="flex h-full items-center justify-center text-sm text-slate-500">Price trend is temporarily unavailable.</div> : chart}
      </ChartContainer>
      <p className="mt-3 px-4 text-xs text-slate-500 dark:text-slate-400 sm:px-8">X-axis: date · Y-axis: ZEC price in USD · Hover the chart for exact coordinates.</p>
    </section>
  );
}
