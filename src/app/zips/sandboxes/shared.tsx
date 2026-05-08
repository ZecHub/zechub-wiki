"use client";

import type { ReactNode } from "react";

// ---------- Disclaimer ----------
export function SandboxDisclaim({ children }: { children?: ReactNode }) {
  return (
    <div
      className="flex gap-3 items-start mb-6 rounded-md border-l-[3px] px-4 py-3 text-[13px] leading-relaxed
        border border-amber-300/60 dark:border-amber-500/30
        border-l-amber-400 dark:border-l-amber-400
        bg-amber-50/80 dark:bg-amber-500/5
        text-amber-900 dark:text-amber-200"
    >
      <span className="shrink-0 text-base leading-none text-amber-600 dark:text-amber-400">⚠</span>
      <p>
        <strong className="font-semibold">Educational sandbox — not a prediction.</strong>{" "}
        {children ??
          "Sandboxes show simplified models with documented assumptions. They explore 'what-if' scenarios for proposed changes; they are not forecasts of mainnet behaviour."}
      </p>
    </div>
  );
}

// ---------- Peer-review notice ----------
export function PeerReviewNotice({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex gap-3 items-start mb-6 rounded-md px-4 py-3 text-[13px] leading-relaxed
        border border-purple-300/60 dark:border-purple-500/30
        bg-purple-50/70 dark:bg-purple-500/5
        text-purple-900 dark:text-purple-200"
    >
      <span className="shrink-0 text-base leading-none text-purple-600 dark:text-purple-400">◇</span>
      <p>
        <strong className="font-semibold">Pending peer review.</strong> {children}
      </p>
    </div>
  );
}

// ---------- Baseline strip ----------
export interface BaselineItem {
  value: string;
  caption: string;
}

export function BaselineStrip({ items, label = "TODAY'S MAINNET" }: { items: BaselineItem[]; label?: string }) {
  return (
    <div
      className="flex flex-wrap items-center gap-x-7 gap-y-3 mb-6 px-5 py-3.5 rounded-md
        border border-zinc-200 dark:border-zinc-700
        bg-white dark:bg-zinc-900/60"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      {items.map((it, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">{it.value}</span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{it.caption}</span>
        </div>
      ))}
    </div>
  );
}

// ---------- Sandbox Card ----------
export function SbCard({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 p-5 ${className}`}
    >
      {title && (
        <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold text-zinc-500 dark:text-zinc-400 mb-3">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export function BodyText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[13.5px] leading-relaxed text-zinc-600 dark:text-zinc-300 ${className}`}>
      {children}
    </p>
  );
}

// ---------- Slider ----------
export interface SliderProps {
  label: ReactNode;
  help?: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  format?: (v: number) => string;
  minLabel?: string;
  maxLabel?: string;
}

export function Slider({
  label,
  help,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  format,
  minLabel,
  maxLabel,
}: SliderProps) {
  const display = format ? format(value) : value.toLocaleString();
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[12.5px] font-medium text-zinc-900 dark:text-zinc-100 inline-flex items-center gap-1.5">
          {label}
          {help && (
            <span
              title={help}
              className="text-[10px] w-3.5 h-3.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 inline-flex items-center justify-center cursor-help font-semibold"
            >
              ?
            </span>
          )}
        </span>
        <span className="font-mono text-[12.5px] font-semibold text-[#1984c7] dark:text-[#3fa3e0]">
          {display}
          {unit && <span className="ml-0.5 text-zinc-500 dark:text-zinc-400 font-medium">{unit}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full h-1 rounded bg-zinc-200 dark:bg-zinc-700 appearance-none outline-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-[#1984c7] dark:[&::-webkit-slider-thumb]:bg-[#3fa3e0]
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow
          [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:bg-[#1984c7] dark:[&::-moz-range-thumb]:bg-[#3fa3e0]"
      />
      <div className="flex justify-between font-mono text-[10px] text-zinc-500 dark:text-zinc-500 mt-1">
        <span>{minLabel ?? min.toLocaleString()}</span>
        <span>{maxLabel ?? max.toLocaleString()}</span>
      </div>
    </div>
  );
}

// ---------- Toggle switch ----------
export function Toggle({
  label,
  help,
  value,
  onChange,
}: {
  label: ReactNode;
  help?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-3 last:mb-0">
      <span className="text-[12.5px] font-medium text-zinc-900 dark:text-zinc-100 inline-flex items-center gap-1.5">
        {label}
        {help && (
          <span
            title={help}
            className="text-[10px] w-3.5 h-3.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 inline-flex items-center justify-center cursor-help font-semibold"
          >
            ?
          </span>
        )}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-colors ${
          value ? "bg-[#1984c7] dark:bg-[#3fa3e0]" : "bg-zinc-300 dark:bg-zinc-600"
        }`}
      >
        <span
          className={`absolute top-0.5 ${value ? "left-[18px]" : "left-0.5"} w-4 h-4 rounded-full bg-white shadow transition-all`}
        />
      </button>
    </div>
  );
}

// ---------- Scenario picker ----------
export interface ScenarioOption<T extends string = string> {
  id: T;
  label: string;
  description: string;
}
export function ScenarioPicker<T extends string>({
  options,
  value,
  onChange,
}: {
  options: ScenarioOption<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-2">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`text-left p-3 rounded-md border transition-colors ${
              active
                ? "border-[#1984c7] bg-[#1984c7]/5 dark:border-[#3fa3e0] dark:bg-[#3fa3e0]/10"
                : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 bg-white dark:bg-zinc-900/40"
            }`}
          >
            <div className={`text-[13px] font-semibold mb-0.5 ${active ? "text-[#1984c7] dark:text-[#3fa3e0]" : "text-zinc-900 dark:text-zinc-100"}`}>
              {o.label}
            </div>
            <div className="text-[11.5px] leading-snug text-zinc-600 dark:text-zinc-400">
              {o.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ---------- Chart Card ----------
export interface DeltaProps {
  text: string;
  kind?: "good" | "warn" | "neutral";
}
export function ChartCard({
  caption,
  title,
  now,
  delta,
  children,
}: {
  caption: string;
  title: string;
  now?: string;
  delta?: DeltaProps;
  children: ReactNode;
}) {
  const deltaColors: Record<NonNullable<DeltaProps["kind"]>, string> = {
    good: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    warn: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    neutral: "bg-zinc-100 text-zinc-600 dark:bg-zinc-700/40 dark:text-zinc-300",
  };
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 p-5">
      <div className="flex justify-between items-baseline mb-3 gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] font-semibold text-zinc-500 dark:text-zinc-400">
            {caption}
          </span>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</span>
        </div>
        {(now || delta) && (
          <div className="font-mono text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 shrink-0 text-right">
            {now}
            {delta && (
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded ml-1.5 font-medium ${deltaColors[delta.kind ?? "neutral"]}`}
              >
                {delta.text}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

// ---------- Assumptions panel ----------
export function Assumptions({ items }: { items: ReactNode[] }) {
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-700 bg-amber-50/40 dark:bg-zinc-800/40 px-5 py-4">
      <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold text-zinc-900 dark:text-zinc-100 mb-2.5 inline-flex items-center gap-2">
        <span className="text-[#F4B728]">◆</span>
        Model assumptions
        <span className="font-sans text-[9px] font-medium tracking-normal normal-case text-zinc-500 dark:text-zinc-400">
          all charts above use these
        </span>
      </h3>
      <ul className="space-y-1.5 text-[12.5px] leading-snug text-zinc-600 dark:text-zinc-300">
        {items.map((item, i) => (
          <li key={i} className="pl-4 relative">
            <span className="absolute left-0 text-zinc-400 dark:text-zinc-500 font-mono">→</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Layout ----------
export function SandboxLayout({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="grid gap-7 lg:grid-cols-[320px_1fr]">
      <div className="flex flex-col gap-5">{left}</div>
      <div className="flex flex-col gap-5">{right}</div>
    </div>
  );
}

// ---------- Formatters ----------
export function fmtBytes(b: number): string {
  if (b >= 1e12) return (b / 1e12).toFixed(2) + " TB";
  if (b >= 1e9) return (b / 1e9).toFixed(2) + " GB";
  if (b >= 1e6) return (b / 1e6).toFixed(2) + " MB";
  if (b >= 1e3) return (b / 1e3).toFixed(1) + " KB";
  return Math.round(b) + " B";
}
export function fmtZats(z: number): string {
  if (z === 0) return "0 zats";
  if (z >= 1e8) return (z / 1e8).toFixed(3) + " ZEC";
  if (z >= 1e5) return (z / 1e5).toFixed(3) + " mZEC";
  return z.toLocaleString() + " zats";
}
export function fmtZec(z: number, dp = 2): string {
  if (Math.abs(z) >= 1e6) return (z / 1e6).toFixed(dp) + "M ZEC";
  if (Math.abs(z) >= 1e3) return (z / 1e3).toFixed(dp) + "k ZEC";
  return z.toFixed(dp) + " ZEC";
}
export function fmtPct(p: number, dp = 2): string {
  return p.toFixed(dp) + "%";
}

// ---------- Chart primitives (SVG, theme-aware via CSS vars) ----------
export function CompareBars({
  todayValue,
  newValue,
  fmt,
  todayLabel = "TODAY",
  newLabel = "PROPOSAL",
}: {
  todayValue: number;
  newValue: number;
  fmt: (n: number) => string;
  todayLabel?: string;
  newLabel?: string;
}) {
  const W = 600;
  const H = 160;
  const pad = { l: 50, r: 20, t: 20, b: 30 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;
  const max = Math.max(todayValue, newValue, 1) * 1.15;
  const todayBarH = (todayValue / max) * ch;
  const newBarH = (newValue / max) * ch;
  const barW = cw * 0.28;
  const gap = cw * 0.18;
  const x1 = pad.l + cw * 0.18;
  const x2 = x1 + barW + gap;

  return (
    <svg viewBox="0 0 600 160" preserveAspectRatio="none" className="w-full h-40 block">
      <line
        x1={pad.l}
        y1={pad.t + ch}
        x2={W - pad.r}
        y2={pad.t + ch}
        className="stroke-zinc-200 dark:stroke-zinc-700"
        strokeWidth={1}
      />
      <rect
        x={x1}
        y={pad.t + ch - todayBarH}
        width={barW}
        height={todayBarH}
        rx={3}
        className="fill-zinc-400/50 dark:fill-zinc-500/40"
      />
      <rect
        x={x2}
        y={pad.t + ch - newBarH}
        width={barW}
        height={newBarH}
        rx={3}
        className="fill-[#1984c7]/85 dark:fill-[#3fa3e0]/85"
      />
      <text
        x={x1 + barW / 2}
        y={pad.t + ch + 18}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={10}
        className="fill-zinc-500 dark:fill-zinc-400"
      >
        {todayLabel}
      </text>
      <text
        x={x2 + barW / 2}
        y={pad.t + ch + 18}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={10}
        fontWeight={600}
        className="fill-[#1984c7] dark:fill-[#3fa3e0]"
      >
        {newLabel}
      </text>
      <text
        x={x1 + barW / 2}
        y={pad.t + ch - todayBarH - 6}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={11}
        fontWeight={600}
        className="fill-zinc-600 dark:fill-zinc-300"
      >
        {fmt(todayValue)}
      </text>
      <text
        x={x2 + barW / 2}
        y={pad.t + ch - newBarH - 6}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={11}
        fontWeight={600}
        className="fill-[#1984c7] dark:fill-[#3fa3e0]"
      >
        {fmt(newValue)}
      </text>
    </svg>
  );
}

// Stacked bar — for ZIP 230 size breakdown
export interface StackSegment {
  label: string;
  value: number;
  color: string; // tailwind classname for fill
}
export function StackedCompare({
  segments,
  baseline,
  fmt,
  labels,
}: {
  segments: StackSegment[];
  baseline: number;
  fmt: (n: number) => string;
  labels: [string, string];
}) {
  const W = 600;
  const H = 160;
  const pad = { l: 50, r: 20, t: 20, b: 30 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;
  const total = segments.reduce((a, b) => a + b.value, 0);
  const max = Math.max(baseline, total, 1) * 1.15;
  const barW = cw * 0.28;
  const gap = cw * 0.18;
  const x1 = pad.l + cw * 0.18;
  const x2 = x1 + barW + gap;

  const baselineH = (baseline / max) * ch;

  // stack segments top-down
  let acc = 0;
  return (
    <svg viewBox="0 0 600 160" preserveAspectRatio="none" className="w-full h-40 block">
      <line
        x1={pad.l}
        y1={pad.t + ch}
        x2={W - pad.r}
        y2={pad.t + ch}
        className="stroke-zinc-200 dark:stroke-zinc-700"
        strokeWidth={1}
      />
      <rect
        x={x1}
        y={pad.t + ch - baselineH}
        width={barW}
        height={baselineH}
        rx={3}
        className="fill-zinc-400/50 dark:fill-zinc-500/40"
      />
      {segments.map((s, i) => {
        const h = (s.value / max) * ch;
        const y = pad.t + ch - (acc + s.value) / max * ch;
        const rect = (
          <rect
            key={i}
            x={x2}
            y={y}
            width={barW}
            height={h}
            className={s.color}
          />
        );
        acc += s.value;
        return rect;
      })}
      <text
        x={x1 + barW / 2}
        y={pad.t + ch + 18}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={10}
        className="fill-zinc-500 dark:fill-zinc-400"
      >
        {labels[0]}
      </text>
      <text
        x={x2 + barW / 2}
        y={pad.t + ch + 18}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={10}
        fontWeight={600}
        className="fill-[#1984c7] dark:fill-[#3fa3e0]"
      >
        {labels[1]}
      </text>
      <text
        x={x1 + barW / 2}
        y={pad.t + ch - baselineH - 6}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={11}
        fontWeight={600}
        className="fill-zinc-600 dark:fill-zinc-300"
      >
        {fmt(baseline)}
      </text>
      <text
        x={x2 + barW / 2}
        y={pad.t + ch - (total / max) * ch - 6}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={11}
        fontWeight={600}
        className="fill-[#1984c7] dark:fill-[#3fa3e0]"
      >
        {fmt(total)}
      </text>
    </svg>
  );
}

// Line/area chart for time series — overlay multiple series
export interface Series {
  values: number[];
  color: string; // tailwind className for stroke
  fill?: string; // tailwind className for fill (area)
  dashed?: boolean;
  label?: string;
}
export function LineChart({
  series,
  xLabel,
  yLabel,
  domain,
}: {
  series: Series[];
  xLabel?: [string, string];
  yLabel?: (v: number) => string;
  domain?: { min?: number; max?: number };
}) {
  const W = 600;
  const H = 160;
  const pad = { l: 55, r: 20, t: 16, b: 28 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;

  const allVals = series.flatMap((s) => s.values);
  const minV = domain?.min ?? Math.min(...allVals, 0);
  const maxV = domain?.max ?? Math.max(...allVals, 1);
  const rng = Math.max(maxV - minV, 1e-9);

  function pointsFor(s: Series): string {
    return s.values
      .map((v, i) => {
        const x = pad.l + (i / (s.values.length - 1)) * cw;
        const y = pad.t + ch - ((v - minV) / rng) * ch;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }
  function areaFor(s: Series): string {
    const pts = s.values.map((v, i) => {
      const x = pad.l + (i / (s.values.length - 1)) * cw;
      const y = pad.t + ch - ((v - minV) / rng) * ch;
      return [x, y] as const;
    });
    if (!pts.length) return "";
    const head = `M ${pts[0][0]},${pad.t + ch}`;
    const lines = pts.map(([x, y]) => `L ${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const tail = `L ${pts[pts.length - 1][0].toFixed(1)},${pad.t + ch} Z`;
    return `${head} ${lines} ${tail}`;
  }

  // Y gridlines (3 ticks)
  const ticks = [0, 0.5, 1].map((t) => {
    const v = minV + rng * t;
    const y = pad.t + ch - t * ch;
    return { y, v };
  });

  return (
    <svg viewBox="0 0 600 160" preserveAspectRatio="none" className="w-full h-40 block">
      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={pad.l}
            x2={W - pad.r}
            y1={t.y}
            y2={t.y}
            className="stroke-zinc-100 dark:stroke-zinc-800"
            strokeWidth={1}
          />
          {yLabel && (
            <text
              x={pad.l - 6}
              y={t.y + 3}
              textAnchor="end"
              fontFamily="JetBrains Mono, monospace"
              fontSize={9}
              className="fill-zinc-400 dark:fill-zinc-500"
            >
              {yLabel(t.v)}
            </text>
          )}
        </g>
      ))}
      {series.map((s, i) => (
        <g key={i}>
          {s.fill && <path d={areaFor(s)} className={s.fill} />}
          <polyline
            points={pointsFor(s)}
            fill="none"
            className={s.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeDasharray={s.dashed ? "4 4" : undefined}
          />
        </g>
      ))}
      {xLabel && (
        <>
          <text
            x={pad.l}
            y={pad.t + ch + 18}
            textAnchor="start"
            fontFamily="JetBrains Mono, monospace"
            fontSize={9}
            className="fill-zinc-400 dark:fill-zinc-500"
          >
            {xLabel[0]}
          </text>
          <text
            x={W - pad.r}
            y={pad.t + ch + 18}
            textAnchor="end"
            fontFamily="JetBrains Mono, monospace"
            fontSize={9}
            className="fill-zinc-400 dark:fill-zinc-500"
          >
            {xLabel[1]}
          </text>
        </>
      )}
    </svg>
  );
}

// Legend for line charts
export function Legend({ items }: { items: { label: string; color: string; dashed?: boolean }[] }) {
  return (
    <div className="flex gap-4 flex-wrap mt-2 text-[11px] text-zinc-600 dark:text-zinc-400">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <svg width="22" height="6" viewBox="0 0 22 6">
            <line
              x1="0"
              y1="3"
              x2="22"
              y2="3"
              className={it.color}
              strokeWidth={2}
              strokeDasharray={it.dashed ? "3 3" : undefined}
            />
          </svg>
          {it.label}
        </span>
      ))}
    </div>
  );
}
