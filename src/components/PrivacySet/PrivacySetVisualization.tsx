"use client";

import React, { useEffect, useState } from "react";
import { scaleLinear } from "@visx/scale";

// Constants
const DATA_URL =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/transaction_summary.json";
const HEIGHT_YEAR_MAP = [
  { start: 0, end: 1933300, year: "2022" },
  { start: 1933301, end: 2352180, year: "2023" },
  { start: 2352181, end: 2771014, year: "2024" },
  { start: 2771015, end: Infinity, year: "2025" },
];

type TransactionSummaryDatum = {
  height: number;
  sapling: number;
  orchard: number;
};

const PrivacySetVisualization: React.FC = () => {
  // State
  const [mapData, setMapData] = useState< Map<string, { sapling: number; orchard: number }> >(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch & aggregate
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw: TransactionSummaryDatum[] = await res.json();
        const agg = new Map<string, { sapling: number; orchard: number }>();
        raw.forEach(({ height, sapling, orchard }) => {
          const year = HEIGHT_YEAR_MAP.find(r => height >= r.start && height <= r.end)?.year || "Unknown";
          if (!agg.has(year)) agg.set(year, { sapling: 0, orchard: 0 });
          const entry = agg.get(year)!;
          entry.sapling += sapling;
          entry.orchard += orchard;
        });
        setMapData(agg);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-center p-8">Loading privacy set...</div>;
  if (error)   return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  // Prepare sorted data
  const entries = Array.from(mapData.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const saplingVals = entries.map(([, v]) => v.sapling);
  const orchardVals = entries.map(([, v]) => v.orchard);
  const totalSapling = saplingVals.reduce((s, x) => s + x, 0);
  const totalOrchard = orchardVals.reduce((s, x) => s + x, 0);

  // Radius scales (sqrt compression)
  const minRadius = 20;
  const maxRadius = 240;
  const saplingScale = scaleLinear({
    domain: [Math.sqrt(Math.min(...saplingVals)), Math.sqrt(Math.max(...saplingVals))],
    range: [minRadius, maxRadius],
  });
  const orchardScale = scaleLinear({
    domain: [Math.sqrt(Math.min(...orchardVals)), Math.sqrt(Math.max(...orchardVals))],
    range: [minRadius, maxRadius],
  });
  const totalScale = scaleLinear({
    domain: [0, Math.sqrt(Math.max(totalSapling, totalOrchard))],
    range: [minRadius, maxRadius],
  });

  const humanize = (v: number) =>
    v >= 1e6 ? `${(v/1e6).toFixed(1)}M` : v >= 1e3 ? `${(v/1e3).toFixed(1)}k` : `${v}`;

  // Render concentric cluster (largest first)
  const renderCluster = (
    data: Array<[string, number]>,
    scaleFn: (x: number) => number,
    cx: number,
    color: string
  ) => {
    const sorted = [...data].sort((a, b) => b[1] - a[1]);
    return sorted.map(([year, val]) => {
      const r = scaleFn(Math.sqrt(val));
      return (
        <g key={year} transform={`translate(${cx}, 300)`}>
          <circle cx={0} cy={0} r={r} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={2} />
          <text x={0} y={-r - 8} textAnchor="middle" fill={color} fontSize={14} fontWeight="bold">
            {year}
          </text>
          <text x={0} y={r + 16} textAnchor="middle" fill={color} fontSize={12}>
            {humanize(val)}
          </text>
        </g>
      );
    });
  };

  const saplingData = entries.map(([y, v]) => [y, v.sapling] as [string, number]);
  const orchardData = entries.map(([y, v]) => [y, v.orchard] as [string, number]);
  const saplingX = 500; // shifted right to clear title
  const orchardX = 950; // shifted right accordingly

  return (
    <div style={{ position: 'relative', background: '#f8f4e8', padding: 20, borderRadius: 8 }}>
      <svg width={1200} height={500} style={{ margin: '0 auto', display: 'block' }}>
        {/* Title + Subtitle */}
        <text x={60} y={40} fill="#d4a017" fontSize={32} fontWeight="bold">
          Zcash shielded transactions
        </text>
        <text x={60} y={72} fill="#333" fontSize={16}>
          Privacy set based on Orchard & Sapling shielded transactions
        </text>

        {/* Total rings behind clusters */}
        <circle
          cx={saplingX} cy={300}
          r={totalScale(Math.sqrt(totalSapling))}
          fill="none" stroke="#d4a017" strokeOpacity={0.4} strokeWidth={4}
        />
        <circle
          cx={orchardX} cy={300}
          r={totalScale(Math.sqrt(totalOrchard))}
          fill="none" stroke="#111" strokeOpacity={0.4} strokeWidth={4}
        />

        {/* Clusters */}
        {renderCluster(saplingData, saplingScale, saplingX, '#d4a017')}
        {renderCluster(orchardData, orchardScale, orchardX, '#111')}

        {/* Legend bottom-right */}
        <g transform="translate(1100, 440)">
          <rect x={0} y={0} width={16} height={16} fill="#d4a017" />
          <text x={24} y={12} fill="#333" fontSize={14}>
            Sapling (total: {humanize(totalSapling)})
          </text>
          <rect x={0} y={24} width={16} height={16} fill="#111" />
          <text x={24} y={36} fill="#333" fontSize={14}>
            Orchard (total: {humanize(totalOrchard)})
          </text>
        </g>
      </svg>
    </div>
  );
};

export default PrivacySetVisualization;
