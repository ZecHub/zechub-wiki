'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/UI/Table';
import { ChevronDown } from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

// Raw GitHub links from YOUR repo
const DEFAULT_COINS = [
  { ticker: 'JUNO',     display: 'JUNO',     icon: 'https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/Logo/juno.png' },
  { ticker: 'ATOM',     display: 'ATOM',     icon: 'https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/Logo/atom.png' },
  { ticker: 'OSMO',     display: 'OSMO',     icon: 'https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/Logo/osmo.png' },
  { ticker: 'PENUMBRA', display: 'UM',       icon: 'https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/Logo/um.png' },
  { ticker: 'TNAM1Q9GR66CVU4HRZM0SD5KMLNJJE82GS3XLFG3V6NU7', display: 'NAM', icon: 'https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/Logo/namada.png' },
];

export default function TreasuryTab() {
  const [data, setData] = useState<TreasuryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [legendOpen, setLegendOpen] = useState(false);
  const [junoOpen, setJunoOpen] = useState(false);
  const [osmoOpen, setOsmoOpen] = useState(false);

  useEffect(() => {
    fetch('/data/juno/ZecHub_Treasury.json')
      .then((res) => res.json())
      .then((json: TreasuryData) => {
        setData(json);
        if (selectedAssets.size === 0) {
          setSelectedAssets(new Set(DEFAULT_COINS.map(c => c.ticker)));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatAmount = (amt: string) =>
    (parseFloat(amt) / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 });

  const displayName = (ticker: string) => {
    if (ticker === 'TNAM1Q9GR66CVU4HRZM0SD5KMLNJJE82GS3XLFG3V6NU7') return 'NAM';
    if (ticker === 'PENUMBRA') return 'UM';
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
    [...data.treasury.juno_native_balances, ...data.treasury.osmosis_native_balances]
      .filter((b) => selectedAssets.has(b.ticker))
      .forEach((b) => {
        const name = displayName(b.ticker);
        totals[name] = (totals[name] || 0) + parseFloat(b.amount);
      });
    return Object.entries(totals).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [data, selectedAssets]);

  const sortedJuno = useMemo(() => data ? [...data.treasury.juno_native_balances].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)) : [], [data]);
  const sortedOsmosis = useMemo(() => data ? [...data.treasury.osmosis_native_balances].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)) : [], [data]);

  const toggleAsset = (ticker: string) => {
    const newSet = new Set(selectedAssets);
    newSet.has(ticker) ? newSet.delete(ticker) : newSet.add(ticker);
    setSelectedAssets(newSet);
  };

  const selectAll = () => setSelectedAssets(new Set(allTickers));
  const clearAll = () => setSelectedAssets(new Set());
  const resetDefaults = () => setSelectedAssets(new Set(DEFAULT_COINS.map(c => c.ticker)));

  if (loading) return <div className="p-8 text-center">Loading Treasury data...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load treasury data.</div>;

  return (
    <div className="space-y-8 p-4">
      {/* Top Icons */}
      <Card>
        <CardHeader>
          <CardTitle>ZecHub DAO Treasury • {new Date(data.timestamp).toLocaleDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-8 flex-wrap">
            {DEFAULT_COINS.map((coin) => (
              <div key={coin.ticker} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-border shadow-sm">
                  <img src={coin.icon} alt={coin.display} className="w-full h-full object-contain" />
                </div>
                <span className="mt-2 text-xs font-medium text-foreground">{coin.display}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Default coins (graphs below are filterable)
          </p>
        </CardContent>
      </Card>

      {/* Collapsible Legend */}
      <Card className="overflow-hidden">
        <div
          className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/50"
          onClick={() => setLegendOpen(!legendOpen)}
        >
          <CardTitle className="text-lg">Asset Filter for Graphs ({selectedAssets.size} selected)</CardTitle>
          <ChevronDown className={`w-5 h-5 transition-transform ${legendOpen ? 'rotate-180' : ''}`} />
        </div>

        {legendOpen && (
          <CardContent className="pt-0 pb-6">
            <div className="flex flex-wrap gap-2">
              {allTickers.map((ticker) => (
                <div
                  key={ticker}
                  onClick={() => toggleAsset(ticker)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full cursor-pointer transition-all border select-none ${
                    selectedAssets.has(ticker)
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 border-border'
                  }`}
                >
                  {displayName(ticker)}
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4 text-xs">
              <button onClick={resetDefaults} className="px-3 py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary">Reset to Defaults</button>
              <button onClick={selectAll} className="px-3 py-1 rounded bg-muted hover:bg-muted/80">Select All</button>
              <button onClick={clearAll} className="px-3 py-1 rounded bg-muted hover:bg-muted/80">Clear All</button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Collapsible Juno */}
      <Card className="overflow-hidden">
        <div
          className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/50"
          onClick={() => setJunoOpen(!junoOpen)}
        >
          <CardTitle className="text-lg">Juno Chain Balances</CardTitle>
          <ChevronDown className={`w-5 h-5 transition-transform ${junoOpen ? 'rotate-180' : ''}`} />
        </div>
        {junoOpen && (
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Asset</TableHead><TableHead>Denom</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
              <TableBody>
                {sortedJuno.map((b, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{b.ticker}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground break-all">{b.denom}</TableCell>
                    <TableCell className="text-right font-mono">{formatAmount(b.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

      {/* Collapsible Osmosis */}
      <Card className="overflow-hidden">
        <div
          className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/50"
          onClick={() => setOsmoOpen(!osmoOpen)}
        >
          <CardTitle className="text-lg">Osmosis Chain Balances (IBC)</CardTitle>
          <ChevronDown className={`w-5 h-5 transition-transform ${osmoOpen ? 'rotate-180' : ''}`} />
        </div>
        {osmoOpen && (
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Asset</TableHead><TableHead>Denom</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
              <TableBody>
                {sortedOsmosis.map((b, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{b.ticker}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground break-all">{b.denom}</TableCell>
                    <TableCell className="text-right font-mono">{formatAmount(b.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

      {/* Donut Pie + Spaced Legend/List Below */}
      <Card>
        <CardHeader><CardTitle>Selected Asset Allocation</CardTitle></CardHeader>
        <CardContent>
          {/* Donut Chart */}
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={160}
                dataKey="value"
                nameKey="name"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7'][i % 5]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatAmount(v.toString())} />
            </PieChart>
          </ResponsiveContainer>

          {/* Spaced-out legend list below the donut */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pieData.map((item, i) => {
              const total = pieData.reduce((sum, d) => sum + d.value, 0);
              const percent = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={i} className="flex items-center gap-3 bg-muted/50 px-5 py-4 rounded-xl">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7'][i % 5] }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                  </div>
                  <div className="text-right font-mono text-sm text-muted-foreground">
                    {percent}% — {formatAmount(item.value.toString())}
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
