"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/Table";
import { ChevronDown, Landmark, Coins } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import SheetTreasuryTab from "@/components/Charts/SheetTreasuryTab";

// ─── DAO Treasury (existing) ──────────────────────────────────────────────────

interface Balance {
  denom: string;
  ticker: string;
  amount: string;
}

interface TreasuryData {
  dao_address: string;
  name: string;
  timestamp: string;
  treasury: {
    juno_native_balances: Balance[];
    osmosis_native_balances: Balance[];
    juno_cw20_balances: any[];
    osmosis_cw20_balances: any[];
  };
}

const DEFAULT_COINS = [
  { ticker: "JUNO", display: "JUNO", icon: "/Logo/juno.png" },
  { ticker: "ATOM", display: "ATOM", icon: "/Logo/atom.png" },
  { ticker: "OSMO", display: "OSMO", icon: "/Logo/osmo.png" },
  { ticker: "PENUMBRA", display: "UM", icon: "/Logo/um.png" },
  {
    ticker: "TNAM1Q9GR66CVU4HRZM0SD5KMLNJJE82GS3XLFG3V6NU7",
    display: "NAM",
    icon: "/Logo/namada.png",
  },
];

const PIE_COLORS = ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#a855f7"];

function DaoTreasuryTab() {
  const [data, setData] = useState<TreasuryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [legendOpen, setLegendOpen] = useState(false);
  const [junoOpen, setJunoOpen] = useState(false);
  const [osmoOpen, setOsmoOpen] = useState(false);

  useEffect(() => {
    fetch("/data/juno/ZecHub_Treasury.json")
      .then((r) => r.json())
      .then((json: TreasuryData) => {
        setData(json);
        setSelectedAssets(new Set(DEFAULT_COINS.map((c) => c.ticker)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatAmount = (amt: string) =>
    (parseFloat(amt) / 1_000_000).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });

  const displayName = (ticker: string) => {
    if (ticker === "TNAM1Q9GR66CVU4HRZM0SD5KMLNJJE82GS3XLFG3V6NU7")
      return "NAM";
    if (ticker === "PENUMBRA") return "UM";
    return ticker;
  };

  const allTickers = useMemo(() => {
    if (!data) return [];
    const tickers = new Set<string>();
    data.treasury.juno_native_balances.forEach((b) => tickers.add(b.ticker));
    data.treasury.osmosis_native_balances.forEach((b) => tickers.add(b.ticker));
    return Array.from(tickers).sort();
  }, [data]);

  const pieData = useMemo(() => {
    if (!data || selectedAssets.size === 0) return [];
    const totals: Record<string, number> = {};
    [
      ...data.treasury.juno_native_balances,
      ...data.treasury.osmosis_native_balances,
    ]
      .filter((b) => selectedAssets.has(b.ticker))
      .forEach((b) => {
        const name = displayName(b.ticker);
        totals[name] = (totals[name] || 0) + parseFloat(b.amount);
      });
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data, selectedAssets]);

  const sortedJuno = useMemo(
    () =>
      data
        ? [...data.treasury.juno_native_balances].sort(
            (a, b) => parseFloat(b.amount) - parseFloat(a.amount),
          )
        : [],
    [data],
  );
  const sortedOsmosis = useMemo(
    () =>
      data
        ? [...data.treasury.osmosis_native_balances].sort(
            (a, b) => parseFloat(b.amount) - parseFloat(a.amount),
          )
        : [],
    [data],
  );

  const toggleAsset = (ticker: string) => {
    const s = new Set(selectedAssets);
    s.has(ticker) ? s.delete(ticker) : s.add(ticker);
    setSelectedAssets(s);
  };

  if (loading)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading DAO treasury…
      </div>
    );
  if (!data)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load treasury data.
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Top coins */}
      <Card className="border-slate-300/50 dark:border-slate-600/40 shadow-none">
        <CardHeader>
          <CardTitle>
            ZecHub DAO Treasury ·{" "}
            {new Date(data.timestamp).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-8 flex-wrap">
            {DEFAULT_COINS.map((coin) => (
              <div
                key={coin.ticker}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-11 h-11 rounded-full overflow-hidden border border-border shadow-sm">
                  <img
                    src={coin.icon}
                    alt={coin.display}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs font-medium">{coin.display}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Default coins — graphs below are filterable
          </p>
        </CardContent>
      </Card>

      {/* Asset filter */}
      <Card className="overflow-hidden border-slate-300/50 dark:border-slate-600/40 shadow-none">
        <div
          className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setLegendOpen(!legendOpen)}
        >
          <CardTitle className="text-base">
            Asset Filter ({selectedAssets.size} selected)
          </CardTitle>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${legendOpen ? "rotate-180" : ""}`}
          />
        </div>
        {legendOpen && (
          <CardContent className="pt-0 pb-6">
            <div className="flex flex-wrap gap-2">
              {allTickers.map((ticker) => (
                <div
                  key={ticker}
                  onClick={() => toggleAsset(ticker)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer border transition-all select-none ${
                    selectedAssets.has(ticker)
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 border-border"
                  }`}
                >
                  {displayName(ticker)}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4 text-xs">
              <button
                onClick={() =>
                  setSelectedAssets(new Set(DEFAULT_COINS.map((c) => c.ticker)))
                }
                className="px-3 py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setSelectedAssets(new Set(allTickers))}
                className="px-3 py-1 rounded bg-muted hover:bg-muted/80 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedAssets(new Set())}
                className="px-3 py-1 rounded bg-muted hover:bg-muted/80 transition-colors"
              >
                Clear
              </button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Chain balances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          {
            label: "Juno Chain Balances",
            open: junoOpen,
            toggle: () => setJunoOpen(!junoOpen),
            rows: sortedJuno,
          },
          {
            label: "Osmosis Chain Balances (IBC)",
            open: osmoOpen,
            toggle: () => setOsmoOpen(!osmoOpen),
            rows: sortedOsmosis,
          },
        ].map(({ label, open, toggle, rows }) => (
          <Card
            key={label}
            className="overflow-hidden border-slate-300/50 dark:border-slate-600/40 shadow-none"
          >
            <div
              className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={toggle}
            >
              <CardTitle className="text-base">{label}</CardTitle>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </div>
            {open && (
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Denom</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((b, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {b.ticker}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground break-all">
                          {b.denom}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatAmount(b.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Donut chart */}
      <Card className="border-slate-300/50 dark:border-slate-600/40 shadow-none">
        <CardHeader>
          <CardTitle>Selected Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={130}
                dataKey="value"
                nameKey="name"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => (v ? formatAmount(v.toString()) : "0")}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {pieData.map((item, i) => {
              const total = pieData.reduce((s, d) => s + d.value, 0);
              const pct = ((item.value / total) * 100).toFixed(1);
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-muted/40 px-4 py-3 rounded-xl"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                    }}
                  />
                  <div className="flex-1 text-sm font-medium">{item.name}</div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {pct}% · {formatAmount(item.value.toString())}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Combined Treasury with segment control ───────────────────────────────────

type Segment = "dao" | "zec";

export default function TreasuryTab() {
  const [active, setActive] = useState<Segment>("dao");

  const segments: {
    key: Segment;
    label: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      key: "dao",
      label: "DAO Treasury",
      icon: <Coins className="w-4 h-4" />,
      description: "On-chain balances across Juno & Osmosis",
    },
    {
      key: "zec",
      label: "ZEC Treasury",
      icon: <Landmark className="w-4 h-4" />,
      description: "ZEC holdings, FPF allocation & grant payouts",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Segment switcher */}
      <div className="grid grid-cols-1 imd:grid-cols-2 gap-3">
        {segments.map((seg) => (
          <button
            key={seg.key}
            onClick={() => setActive(seg.key)}
            className={`group relative flex flex-col items-start gap-1 rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${
              active === seg.key
                ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30 shadow-sm"
                : "border-slate-200 dark:border-slate-700 bg-card hover:border-purple-300 dark:hover:border-purple-700 hover:bg-muted/40"
            }`}
          >
            {/* Active indicator bar */}
            <div
              className={`absolute top-0 left-2 h-0.5 rounded-t-2xl bg-purple-500 transition-all duration-300 ${
                active === seg.key ? "w-[95%]" : "w-0 group-hover:w-1/2"
              }`}
            />
            <div
              className={`flex items-center gap-2 font-semibold text-sm ${
                active === seg.key
                  ? "text-purple-700 dark:text-purple-300"
                  : "text-foreground"
              }`}
            >
              <span
                className={
                  active === seg.key
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-muted-foreground"
                }
              >
                {seg.icon}
              </span>
              {seg.label}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {seg.description}
            </p>
          </button>
        ))}
      </div>

      {/* Divider with label */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground px-2">
          {active === "dao" ? "DAO Treasury" : "ZEC Treasury"}
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Content */}
      <div>
        {active === "dao" && <DaoTreasuryTab />}
        {active === "zec" && <SheetTreasuryTab />}
      </div>
    </div>
  );
}
