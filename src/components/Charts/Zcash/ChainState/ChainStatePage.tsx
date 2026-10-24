"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DATA_URL = "/data/zcash/chain-state/results.json";

type Day = {
  day: number;
  start: number;
  end: number;
  expiry: { total: number; zero: number; nonzero: number; pre_overwinter: number; zero_fraction: number };
  counts: { blocks: number; txs: number };
  shielded: { sapling_spends: number; sapling_outputs: number; orchard_actions: number; ironwood_actions: number; sprout_joinsplits: number; sprout_vpub_old?: number; sprout_vpub_new?: number; sapling_value_balance?: number; orchard_value_balance?: number; ironwood_value_balance?: number };
  types: { v1: number; v2: number; v3: number; v4: number; v5: number; v6: number; other: number; coinbase: number; user: number; fully_shielded: number; mixed: number; transparent_only: number };
  addresses: { unique_receivers: number; total_receiving_outputs: number };
  anchors?: { sapling: number; orchard: number; ironwood: number };
  trees?: { sapling: number; orchard: number; ironwood: number; sprout: number };
  blocks: { blocks: number; total_txs: number; avg_txs_per_block: number; max_txs_per_block: number; total_tx_bytes?: number };
  locktime: { nonzero: number; zero: number; high_sequence: number };
  spends: { indexer_populated: boolean; probed: number; outpoint_hits: number; sapling_nullifier_hits: number; orchard_nullifier_hits: number; ironwood_nullifier_hits: number; sprout_nullifier_hits: number };
};

type Results = {
  expiry: Day["expiry"] & { delta_histogram: Record<string, number> };
  counts: Day["counts"];
  shielded: Day["shielded"];
  types: Day["types"];
  addresses: Day["addresses"];
  blocks: Day["blocks"];
  locktime: Day["locktime"];
  spends: Day["spends"];
  per_day: Day[];
};

const CHARTS = [
  { id: "txs", label: "Transactions", keys: ["txs"], group: "counts" },
  { id: "shielded", label: "Shielded actions", keys: ["sapling_spends", "sapling_outputs", "orchard", "ironwood", "sprout"], group: "shielded" },
  { id: "value", label: "Value balances", keys: ["sprout_vpub_old", "sprout_vpub_new", "sapling_vb", "orchard_vb", "ironwood_vb"], group: "shielded" },
  { id: "bytes", label: "Tx bytes", keys: ["tx_bytes"], group: "blocks" },
  { id: "anchors", label: "Anchors cited", keys: ["sapling_anchors", "orchard_anchors", "ironwood_anchors"], group: "shielded" },
  { id: "trees", label: "Tree size", keys: ["sapling_tree", "orchard_tree", "ironwood_tree", "sprout_tree"], group: "shielded" },
  { id: "nullifiers", label: "Nullifier set", keys: ["sapling_nf_set", "orchard_nf_set", "ironwood_nf_set", "sprout_nf_set"], group: "shielded" },
  { id: "unspent", label: "Unspent notes", keys: ["sapling_unspent", "orchard_unspent", "ironwood_unspent"], group: "shielded" },
  { id: "types", label: "Tx type mix", keys: ["fully_shielded", "mixed", "transparent_only"], group: "types" },
  { id: "coinbase", label: "Coinbase vs user", keys: ["coinbase", "user"], group: "types" },
  { id: "versions", label: "Version mix", keys: ["v1", "v2", "v3", "v4", "v5", "v6", "other"], group: "types" },
  { id: "addresses", label: "Addresses", keys: ["unique_receivers", "receiving_outputs"], group: "addresses" },
  { id: "blocks", label: "Block fullness", keys: ["avg_txs", "max_txs"], group: "counts" },
  { id: "expiry", label: "Expiry", keys: ["zero_expiry", "nonzero_expiry", "pre_overwinter"], group: "expiry" },
  { id: "expiry_delta", label: "Expiry delta (top 30 + other)", keys: [], group: "expiry" },
  { id: "locktime", label: "Locktime / sequence", keys: ["nonzero_lock", "zero_lock", "high_seq"], group: "locktime" },
  { id: "spends", label: "Spends (indexer)", keys: ["transparent_spends", "sapling_spends_idx", "orchard_spends", "ironwood_spends", "sprout_spends"], group: "spends" },
];

const INFO: Record<string, { title: string; body: string }> = {
  txs: {
    title: "Transactions",
    body: "Number of transactions in each day window (576 blocks pre-Blossom, 1,152 Blossom–NU7, 3,456 post-NU7). Spikes usually mean a burst of activity. The baseline is normal network usage.",
  },
  shielded: {
    title: "Shielded actions",
    body: "Sprout JoinSplits, Sapling spends/outputs, Orchard actions, and Ironwood actions per window. Sprout is almost entirely pre-Sapling. Ironwood rises after NU6.3.",
  },
  value: {
    title: "Value balances",
    body: "Net value moving into or out of each shielded pool per window, in ZEC. Positive means value entered the pool; negative means it left. Sprout uses vpub_old (left) and vpub_new (entered).",
  },
  types: {
    title: "Transaction type mix",
    body: "Fully shielded (no transparent inputs or outputs), mixed (shielded + transparent), and transparent-only. A higher fully-shielded share means more private activity. Transparent-only is public.",
  },
  versions: {
    title: "Version mix",
    body: "Transaction format versions. v4 is Sapling-era, v5 is Orchard, v6 is Ironwood (NU6.3+). v1–v3 are legacy. “Other” is anything outside 1–6 (should be near zero after the v6 fix).",
  },
  addresses: {
    title: "Addresses",
    body: "Unique transparent receivers and total receiving outputs per window. This only sees transparent activity. Shielded recipients are not visible.",
  },
  blocks: {
    title: "Block fullness",
    body: "Average and max transactions per block in the window. Higher values mean fuller blocks. A max far above the average points to occasional congestion.",
  },
  expiry: {
    title: "Expiry",
    body: "Transactions with expiry height 0 (no expiry) vs nonzero. Expiry 0 is a fingerprint: the transaction never expires. A high zero fraction means many transactions were built without an expiry.",
  },
  expiry_delta: {
    title: "Expiry delta",
    body: "How far ahead of the block the expiry was set (expiry − height). Small deltas are short-lived transactions. The “other” bar groups the long tail. Large deltas or expiry 0 are more distinctive.",
  },
  locktime: {
    title: "Locktime / sequence",
    body: "Nonzero locktime means the transaction is not valid until a height or time. High sequence (>0) is set on most inputs; zero sequence is the unusual case. This is mostly structural metadata.",
  },
  spends: {
    title: "Spends (indexer)",
    body: "Reverse lookups of spent outpoints and nullifiers, only available if the indexer was populated when the scan ran. Hits mean the spend was found in the index. Zeros mean the indexer was off or the range had no matches.",
  },
  anchors: {
    title: "Anchors cited",
    body: "How many times each pool's note commitment tree root was referenced as an anchor in a transaction. A higher count means more transactions are spending from that pool's past state.",
  },
};

const COLORS: Record<string, string> = {
  txs: "#3b82f6",
  sapling_spends: "#8b5cf6",
  sapling_outputs: "#a78bfa",
  orchard: "#10b981",
  ironwood: "#f97316",
  sprout: "#ef4444",
  sprout_vpub_old: "#ef4444",
  sprout_vpub_new: "#f87171",
  sapling_vb: "#8b5cf6",
  orchard_vb: "#22d3ee",
  ironwood_vb: "#fb923c",
  tx_bytes: "#94a3b8",
  sapling_anchors: "#8b5cf6",
  orchard_anchors: "#22d3ee",
  ironwood_anchors: "#fb923c",
  sapling_tree: "#8b5cf6",
  orchard_tree: "#22d3ee",
  ironwood_tree: "#fb923c",
  sprout_tree: "#ef4444",
  sapling_nf_set: "#8b5cf6",
  orchard_nf_set: "#22d3ee",
  ironwood_nf_set: "#fb923c",
  sprout_nf_set: "#ef4444",
  sapling_unspent: "#8b5cf6",
  orchard_unspent: "#22d3ee",
  ironwood_unspent: "#fb923c",
  fully_shielded: "#22c55e",
  mixed: "#eab308",
  transparent_only: "#64748b",
  v1: "#94a3b8",
  v2: "#64748b",
  v3: "#06b6d4",
  v4: "#3b82f6",
  v5: "#10b981",
  v6: "#f97316",
  coinbase: "#fbbf24",
  user: "#60a5fa",
  unique_receivers: "#06b6d4",
  receiving_outputs: "#8b5cf6",
  avg_txs: "#10b981",
  max_txs: "#ef4444",
  zero_expiry: "#64748b",
  nonzero_expiry: "#3b82f6",
  pre_overwinter: "#94a3b8",
  nonzero_lock: "#eab308",
  zero_lock: "#64748b",
  high_seq: "#f97316",
  transparent_spends: "#3b82f6",
  sapling_spends_idx: "#8b5cf6",
  orchard_spends: "#10b981",
  ironwood_spends: "#f97316",
  sprout_spends: "#ef4444",
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 text-sm">
      <div className="text-gray-900 dark:text-white font-medium mb-1">{label}</div>
      {payload.map((entry: any, i: number) => (
        <div key={i} style={{ color: entry.color }} className="text-sm">
          {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
        </div>
      ))}
    </div>
  );
}

function n(v: number | undefined | null): number { return v ?? 0; }

function Stat({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className="rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="text-xl font-semibold mt-1" style={{ color: accent }}>{value}</div>
    </div>
  );
}

export default function ChainStatePage() {
  const [data, setData] = useState<Results | null>(null);
  const [chartId, setChartId] = useState(CHARTS[0].id);
  const [infoOpen, setInfoOpen] = useState(false);
  const [logScale, setLogScale] = useState(false);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [zoomStart, setZoomStart] = useState<number>(0);
  const [zoomEnd, setZoomEnd] = useState<number>(0);
  const [dragging, setDragging] = useState<"start" | "end" | "mid" | null>(null);
  const [dragOrigin, setDragOrigin] = useState<{ x: number; start: number; end: number } | null>(null);

  useEffect(() => {
    fetch(DATA_URL)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (data?.per_day?.length) {
      setZoomStart(data.per_day[0].start);
      setZoomEnd(data.per_day[data.per_day.length - 1].end);
    }
  }, [data]);

  if (!data) return <div className="p-4 text-slate-300">Loading chain stats…</div>;

  const days = data.per_day || [];
  const rangeStart = days.length ? days[0].start : 0;
  const rangeEnd = days.length ? days[days.length - 1].end : 0;

  const fullSeries = (data.per_day || []).map((d) => ({
    start: d.start,
    sapling_spends: n(d.shielded?.sapling_spends),
    orchard_actions: n(d.shielded?.orchard_actions),
    ironwood_actions: n(d.shielded?.ironwood_actions),
    sprout_joinsplits: n(d.shielded?.sprout_joinsplits),
    sapling_spends_idx: n(d.spends?.sapling_nullifier_hits),
    orchard_spends: n(d.spends?.orchard_nullifier_hits),
    ironwood_spends: n(d.spends?.ironwood_nullifier_hits),
    sprout_spends: n(d.spends?.sprout_nullifier_hits),
  }));
  console.log("early orchard", fullSeries.filter(d => d.start >= 1688064 && d.start < 1700000).slice(0, 3));
  let sapC = 0, orchC = 0, ironC = 0, sproutC = 0;
  const cumul = new Map<number, { sap: number; orch: number; iron: number; sprout: number }>();
  for (const d of fullSeries) {
    sapC += d.sapling_spends_idx;
    orchC += d.orchard_spends;
    ironC += d.ironwood_spends;
    sproutC += d.sprout_spends;
    cumul.set(d.start, { sap: sapC, orch: orchC, iron: ironC, sprout: sproutC });
  }
  console.log("cumul early", [...cumul.entries()].filter(([k]) => k >= 1688064 && k < 1700000).slice(0, 3));
  console.log("before", fullSeries.filter(d => d.start < 1688064 && d.orchard_spends > 0).slice(-3));
  const filtered = days.filter((d) => d.end >= zoomStart && d.start <= zoomEnd);

  const rawSeries = filtered.map((d) => ({
    day: d.start,
    txs: n(d.counts?.txs),
    sapling_spends: n(d.shielded?.sapling_spends),
    sapling_outputs: n(d.shielded?.sapling_outputs),
    orchard: n(d.shielded?.orchard_actions),
    ironwood: n(d.shielded?.ironwood_actions),
    sprout: n(d.shielded?.sprout_joinsplits),
    sprout_vpub_old: n(d.shielded?.sprout_vpub_old) / 1e8,
    sprout_vpub_new: -n(d.shielded?.sprout_vpub_new) / 1e8,
    sapling_vb: -n(d.shielded?.sapling_value_balance) / 1e8,
    orchard_vb: -n(d.shielded?.orchard_value_balance) / 1e8,
    ironwood_vb: -n(d.shielded?.ironwood_value_balance) / 1e8,
    tx_bytes: n(d.blocks?.total_tx_bytes),
    sapling_anchors: n(d.anchors?.sapling),
    orchard_anchors: n(d.anchors?.orchard),
    ironwood_anchors: n(d.anchors?.ironwood),
    sapling_tree: n(d.trees?.sapling),
    orchard_tree: n(d.trees?.orchard),
    ironwood_tree: n(d.trees?.ironwood),
    sprout_tree: n(d.trees?.sprout),
    fully_shielded: n(d.types?.fully_shielded),
    mixed: n(d.types?.mixed),
    transparent_only: n(d.types?.transparent_only),
    v1: n(d.types?.v1),
    v2: n(d.types?.v2),
    v3: n(d.types?.v3),
    v4: n(d.types?.v4),
    v5: n(d.types?.v5),
    v6: n(d.types?.v6),
    other: n(d.types?.other),
    coinbase: n(d.types?.coinbase),
    user: n(d.types?.user),
    unique_receivers: n(d.addresses?.unique_receivers),
    receiving_outputs: n(d.addresses?.total_receiving_outputs),
    avg_txs: n(d.blocks?.avg_txs_per_block),
    max_txs: n(d.blocks?.max_txs_per_block),
    nonzero_lock: n(d.locktime?.nonzero),
    zero_lock: n(d.locktime?.zero),
    high_seq: n(d.locktime?.high_sequence),
    zero_expiry: n(d.expiry?.zero),
    nonzero_expiry: n(d.expiry?.nonzero),
    pre_overwinter: n(d.expiry?.pre_overwinter),
    transparent_spends: n(d.spends?.outpoint_hits),
    sapling_spends_idx: n(d.spends?.sapling_nullifier_hits),
    orchard_spends: n(d.spends?.orchard_nullifier_hits),
    ironwood_spends: n(d.spends?.ironwood_nullifier_hits),
    sprout_spends: n(d.spends?.sprout_nullifier_hits),
  }));
  let sapNf = 0, orchNf = 0, ironNf = 0, sproutNf = 0;
  const withSets = rawSeries.map((row, i) => {
    const c = cumul.get(filtered[i]?.start) || { sap: 0, orch: 0, iron: 0, sprout: 0 };
    return {
      ...row,
      sapling_nf_set: c.sap,
      orchard_nf_set: c.orch,
      ironwood_nf_set: c.iron,
      sprout_nf_set: c.sprout,
      sapling_unspent: Math.max(0, (row.sapling_tree || 0) - c.sap),
      orchard_unspent: Math.max(0, (row.orchard_tree || 0) - c.orch),
      ironwood_unspent: Math.max(0, (row.ironwood_tree || 0) - c.iron),
    };
  });
  const series = logScale
    ? withSets.map((row) => {
        const out: Record<string, number> = { day: row.day };
        for (const [k, v] of Object.entries(row)) {
          if (k === "day") continue;
          out[k] = Math.max(v as number, 0.1);
        }
        return out;
      })
    : withSets;

  const expiryEntries = Object.entries(data.expiry.delta_histogram || {})
    .map(([delta, count]) => ({ delta: Number(delta), count }))
    .sort((a, b) => b.count - a.count);
  const expiryTop = expiryEntries.slice(0, 30);
  const expiryRest = expiryEntries.slice(30).reduce((sum, e) => sum + e.count, 0);
  const expiryChart = expiryRest > 0 ? [...expiryTop, { delta: "other", count: expiryRest }] : expiryTop;

  const active = CHARTS.find((c) => c.id === chartId) || CHARTS[0];

  return (
    <div className="p-4 w-full text-slate-900 dark:text-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chain State</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Blocks {rangeStart.toLocaleString()} – {rangeEnd.toLocaleString()}
            <span className="mx-2">·</span>
            per-day windows (576 / 1,152 / 3,456 blocks)
          </p>
        </div>
        <a
          href="https://github.com/ZecHub/zechub-wiki/blob/main/public/data/zcash/chain-state/results.json"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-slate-200"
          title="View source JSON"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{active.label}</h2>
          {INFO[chartId] && (
            <div className="relative">
              <button
                onClick={() => setInfoOpen((v) => !v)}
                className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center"
              >
                i
              </button>
              {infoOpen && (
                <div className="absolute left-0 top-7 z-20 w-72 p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shadow-lg text-sm">
                  <div className="font-medium text-slate-900 dark:text-slate-200 mb-1">{INFO[chartId].title}</div>
                  <div className="text-slate-600 dark:text-slate-400">{INFO[chartId].body}</div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={logScale}
              onChange={(e) => setLogScale(e.target.checked)}
              className="rounded"
            />
            Log
          </label>
          <select
            value={chartId}
            onChange={(e) => setChartId(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm text-slate-900 dark:text-slate-100"
          >
            {CHARTS.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-[340px] md:h-[450px] w-full mb-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartId === "expiry_delta" ? (
            <BarChart data={expiryChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" />
              <XAxis dataKey="delta" stroke="#64748b" fontSize={12} />
              <YAxis scale={logScale ? "log" : "auto"} domain={logScale ? [0.1, "auto"] : undefined} stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          ) : (
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} angle={-45} textAnchor="end" height={60} />
              <YAxis scale={logScale ? "log" : "auto"} domain={logScale ? [0.1, "auto"] : undefined} stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend onClick={(e) => {
                const key = e.dataKey as string;
                setHidden((prev) => {
                  const next = new Set(prev);
                  if (next.has(key)) next.delete(key); else next.add(key);
                  return next;
                });
              }} formatter={(value) => (
                <span style={{ color: hidden.has(value as string) ? "#64748b" : undefined, textDecoration: hidden.has(value as string) ? "line-through" : undefined }}>{value}</span>
              )} />
              {active.keys.map((k) => (
                <Line key={k} type="monotone" dataKey={k} stroke={COLORS[k] || "#3b82f6"} dot={false} strokeWidth={2} hide={hidden.has(k)} />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {chartId !== "expiry_delta" && rangeEnd > rangeStart && (
        <div className="mb-4 px-2">
          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>{zoomStart.toLocaleString()}</span>
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-1">
                {[
                  { label: "Day", blocks: 1152 },
                  { label: "Week", blocks: 8064 },
                  { label: "Month", blocks: 34560 },
                  { label: "Year", blocks: 420480 },
                ].map((b) => (
                  <button
                    key={b.label}
                    onClick={() => {
                      const mid = Math.round((rangeStart + rangeEnd) / 2);
                      const half = Math.floor(b.blocks / 2);
                      setZoomStart(Math.max(rangeStart, mid - half));
                      setZoomEnd(Math.min(rangeEnd, mid + half));
                    }}
                    className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200"
                  >
                    {b.label}
                  </button>
                ))}
                <button
                  onClick={() => { setZoomStart(rangeStart); setZoomEnd(rangeEnd); }}
                  className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200"
                >
                  Full
                </button>
              </div>
              <div className="flex gap-1">
                {[
                  { label: "Sprout", height: 0 },
                  { label: "Sapling", height: 419200 },
                  { label: "Orchard", height: 1687104 },
                  { label: "Ironwood", height: 3428143 },
                ].map((u) => (
                  <button
                    key={u.label}
                    onClick={() => {
                      setZoomStart(Math.max(rangeStart, u.height));
                      setZoomEnd(rangeEnd);
                    }}
                    className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
            <span>{zoomEnd.toLocaleString()}</span>
          </div>
          <div
            className="relative h-10 select-none touch-none"
            onPointerMove={(e) => {
              if (!dragging || !dragOrigin) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const dx = e.clientX - dragOrigin.x;
              const range = rangeEnd - rangeStart;
              const delta = Math.round((dx / rect.width) * range);
              if (dragging === "mid") {
                const width = dragOrigin.end - dragOrigin.start;
                let ns = dragOrigin.start + delta;
                let ne = dragOrigin.end + delta;
                if (ns < rangeStart) { ns = rangeStart; ne = rangeStart + width; }
                if (ne > rangeEnd) { ne = rangeEnd; ns = rangeEnd - width; }
                setZoomStart(ns);
                setZoomEnd(ne);
              } else if (dragging === "start") {
                setZoomStart(Math.max(rangeStart, Math.min(dragOrigin.start + delta, zoomEnd - 1)));
              } else if (dragging === "end") {
                setZoomEnd(Math.min(rangeEnd, Math.max(dragOrigin.end + delta, zoomStart + 1)));
              }
            }}
            onPointerUp={() => { setDragging(null); setDragOrigin(null); }}
            onPointerLeave={() => { setDragging(null); setDragOrigin(null); }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 h-1 w-full bg-slate-600 rounded" />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-blue-500 rounded"
              style={{
                left: `calc(${((zoomStart - rangeStart) / (rangeEnd - rangeStart)) * 100}% - 14px)`,
                right: `calc(${100 - ((zoomEnd - rangeStart) / (rangeEnd - rangeStart)) * 100}% - 14px)`,
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-slate-800 border-2 border-blue-400 rounded-full flex items-center justify-center cursor-grab text-sm text-blue-400 shadow"
              style={{
                left: `${(((zoomStart + zoomEnd) / 2 - rangeStart) / (rangeEnd - rangeStart)) * 100}%`,
                zIndex: 10,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                setDragging("mid");
                setDragOrigin({ x: e.clientX, start: zoomStart, end: zoomEnd });
              }}
            >
              🛡️
            </div>
            {zoomEnd - zoomStart > 2000 && (
              <>
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-ew-resize hover:scale-110 transition-transform"
                  style={{ left: `calc(${((zoomStart - rangeStart) / (rangeEnd - rangeStart)) * 100}% - 22px)`, zIndex: 11 }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setDragging("start");
                    setDragOrigin({ x: e.clientX, start: zoomStart, end: zoomEnd });
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-ew-resize hover:scale-110 transition-transform"
                  style={{ left: `calc(${((zoomEnd - rangeStart) / (rangeEnd - rangeStart)) * 100}% + 6px)`, zIndex: 11 }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setDragging("end");
                    setDragOrigin({ x: e.clientX, start: zoomStart, end: zoomEnd });
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-slate-100">Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {active.group === "counts" && (
          <>
            <Stat label="Blocks" value={data.counts.blocks.toLocaleString()} accent="#60a5fa" />
            <Stat label="Txs" value={data.counts.txs.toLocaleString()} accent="#60a5fa" />
            <Stat label="Avg txs/block" value={data.blocks.avg_txs_per_block.toFixed(2)} accent="#4ade80" />
            <Stat label="Max txs/block" value={data.blocks.max_txs_per_block.toLocaleString()} accent="#f87171" />
            <Stat label="Total tx bytes" value={n(data.blocks.total_tx_bytes).toLocaleString()} accent="#94a3b8" />
          </>
        )}
        {active.group === "expiry" && (
          <>
            <Stat label="Zero expiry" value={data.expiry.zero.toLocaleString()} accent="#94a3b8" />
            <Stat label="Nonzero expiry" value={data.expiry.nonzero.toLocaleString()} accent="#3b82f6" />
            <Stat label="Pre-Overwinter" value={data.expiry.pre_overwinter.toLocaleString()} accent="#64748b" />
            <Stat label="Zero fraction" value={data.expiry.zero_fraction.toFixed(4)} accent="#94a3b8" />
          </>
        )}
        {active.group === "shielded" && (
          <>
            <Stat label="Sapling spends" value={data.shielded.sapling_spends.toLocaleString()} accent="#a78bfa" />
            <Stat label="Sapling outputs" value={data.shielded.sapling_outputs.toLocaleString()} accent="#c4b5fd" />
            <Stat label="Orchard actions" value={data.shielded.orchard_actions.toLocaleString()} accent="#22d3ee" />
            <Stat label="Ironwood actions" value={data.shielded.ironwood_actions.toLocaleString()} accent="#fb923c" />
            <Stat label="Sprout JoinSplits" value={n(data.shielded.sprout_joinsplits).toLocaleString()} accent="#c084fc" />
            <Stat label="Sprout vpub_old" value={(n(data.shielded.sprout_vpub_old) / 1e8).toLocaleString(undefined, { maximumFractionDigits: 2 })} accent="#ef4444" />
            <Stat label="Sprout vpub_new" value={(n(data.shielded.sprout_vpub_new) / 1e8).toLocaleString(undefined, { maximumFractionDigits: 2 })} accent="#f87171" />
            <Stat label="Sapling value balance" value={(-n(data.shielded.sapling_value_balance) / 1e8).toLocaleString(undefined, { maximumFractionDigits: 2 })} accent="#8b5cf6" />
            <Stat label="Orchard value balance" value={(-n(data.shielded.orchard_value_balance) / 1e8).toLocaleString(undefined, { maximumFractionDigits: 2 })} accent="#22d3ee" />
            <Stat label="Ironwood value balance" value={(-n(data.shielded.ironwood_value_balance) / 1e8).toLocaleString(undefined, { maximumFractionDigits: 2 })} accent="#fb923c" />
          </>
        )}
        {active.group === "types" && (
          <>
            <Stat label="v1" value={data.types.v1.toLocaleString()} accent="#94a3b8" />
            <Stat label="v2" value={data.types.v2.toLocaleString()} accent="#64748b" />
            <Stat label="v3" value={data.types.v3.toLocaleString()} accent="#06b6d4" />
            <Stat label="v4" value={data.types.v4.toLocaleString()} accent="#60a5fa" />
            <Stat label="v5" value={data.types.v5.toLocaleString()} accent="#34d399" />
            <Stat label="v6" value={data.types.v6.toLocaleString()} accent="#fb923c" />
            <Stat label="Other versions" value={data.types.other.toLocaleString()} accent="#fb923c" />
            <Stat label="Coinbase" value={data.types.coinbase.toLocaleString()} accent="#fbbf24" />
            <Stat label="User txs" value={data.types.user.toLocaleString()} accent="#60a5fa" />
            <Stat label="Fully shielded" value={data.types.fully_shielded.toLocaleString()} accent="#4ade80" />
            <Stat label="Mixed" value={data.types.mixed.toLocaleString()} accent="#facc15" />
            <Stat label="Transparent-only" value={data.types.transparent_only.toLocaleString()} accent="#94a3b8" />
          </>
        )}
        {active.group === "addresses" && (
          <>
            <Stat label="Unique receivers" value={data.addresses.unique_receivers.toLocaleString()} accent="#22d3ee" />
            <Stat label="Receiving outputs" value={data.addresses.total_receiving_outputs.toLocaleString()} accent="#a78bfa" />
          </>
        )}
        {active.group === "locktime" && (
          <>
            <Stat label="Nonzero locktime" value={data.locktime.nonzero.toLocaleString()} accent="#facc15" />
            <Stat label="Zero locktime" value={data.locktime.zero.toLocaleString()} accent="#94a3b8" />
            <Stat label="High sequence" value={data.locktime.high_sequence.toLocaleString()} accent="#fb923c" />
          </>
        )}
        {active.group === "spends" && (
          <>
            <Stat label="Indexer populated" value={String(data.spends.indexer_populated)} accent={data.spends.indexer_populated ? "#4ade80" : "#f87171"} />
            <Stat label="Probed" value={data.spends.probed.toLocaleString()} accent="#94a3b8" />
            <Stat label="Transparent spends" value={data.spends.outpoint_hits.toLocaleString()} accent="#60a5fa" />
            <Stat label="Sapling spends" value={data.spends.sapling_nullifier_hits.toLocaleString()} accent="#8b5cf6" />
            <Stat label="Orchard spends" value={data.spends.orchard_nullifier_hits.toLocaleString()} accent="#10b981" />
            <Stat label="Ironwood spends" value={data.spends.ironwood_nullifier_hits.toLocaleString()} accent="#f97316" />
            <Stat label="Sprout spends" value={n(data.spends.sprout_nullifier_hits).toLocaleString()} accent="#ef4444" />
          </>
        )}
      </div>
    </div>
  );
}
