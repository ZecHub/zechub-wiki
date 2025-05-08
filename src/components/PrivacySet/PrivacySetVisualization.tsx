"use client";

import React, { useEffect, useState } from "react";
import { scaleLinear } from "@visx/scale";

// Transaction summary source URL
const DATA_URL =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/transaction_summary.json";

// Map block heights to years
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
  const [dataMap, setDataMap] = useState<Map<string, { sapling: number; orchard: number }>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error(`HTTP status ${res.status}`);
        const raw: TransactionSummaryDatum[] = await res.json();
        const map = new Map<string, { sapling: number; orchard: number }>();
        raw.forEach(({ height, sapling, orchard }) => {
          const year =
            HEIGHT_YEAR_MAP.find(r => height >= r.start && height <= r.end)?.year ?? "Unknown";
          if (!map.has(year)) map.set(year, { sapling: 0, orchard: 0 });
          const entry = map.get(year)!;
          entry.sapling += sapling;
          entry.orchard += orchard;
        });
        setDataMap(map);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-center p-8">Loading privacy set...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  // Sort data by year ascending
  const entries = Array.from(dataMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  const saplingVals = entries.map(([, v]) => v.sapling);
  const orchardVals = entries.map(([, v]) => v.orchard);
  const totalSapling = saplingVals.reduce((a, b) => a + b, 0);
  const totalOrchard = orchardVals.reduce((a, b) => a + b, 0);

  const minR = 40;
  const maxR = 160;
  // Use sqrt scale to compress range but clamp minimum radius for readability
  const saplingScale = scaleLinear({
    domain: [Math.sqrt(Math.min(...saplingVals)), Math.sqrt(Math.max(...saplingVals))],
    range: [minR, maxR],
  });
  const orchardScale = scaleLinear({
    domain: [Math.sqrt(Math.min(...orchardVals)), Math.sqrt(Math.max(...orchardVals))],
    range: [minR, maxR],
  });
  // Scale for totals
  const totalScale = scaleLinear({
    domain: [0, Math.sqrt(Math.max(totalSapling, totalOrchard))],
    range: [minR, maxR],
  });

  const humanize = (v: number) =>
    v >= 1e6
      ? `${(v / 1e6).toFixed(1)}M`
      : v >= 1e3
      ? `${(v / 1e3).toFixed(1)}k`
      : `${v}`;

  // Render concentric cluster
  const renderCluster = (
    data: Array<[string, number]>,
    scaleFn: (x: number) => number,
    cx: number,
    color: string
  ) =>
    [...data]
      .reverse()
      .map(([year, val]) => {
        const rRaw = scaleFn(Math.sqrt(val));
        const r = Math.max(rRaw, minR);
        return (
          <g key={year} transform={`translate(${cx}, 300)`}>
            <circle cx={0} cy={0} r={r} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={2} />
            <text x={0} y={-r - 10} textAnchor="middle" fill={color} fontSize={16} fontWeight="bold">
              {year}
            </text>
            <text x={0} y={r + 20} textAnchor="middle" fill={color} fontSize={14}>
              {humanize(val)}
            </text>
          </g>
        );
      });

  const saplingData = entries.map(([y, v]) => [y, v.sapling] as [string, number]);
  const orchardData = entries.map(([y, v]) => [y, v.orchard] as [string, number]);

  const saplingX = 350;
  const orchardX = 800;

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#f8f4e8', padding: '20px' }}>
      <svg width={1100} height={500}>
        {/* Title */}
        <text x={50} y={40} fill="#d4a017" fontSize={28} fontWeight="bold">
          Zcash shielded transactions
        </text>
        <text x={50} y={70} fill="#333" fontSize={16}>
          Privacy set based on number of Orchard &amp; Sapling shielded transactions
        </text>

        {/* Total rings behind clusters */}
        <circle
          cx={saplingX}
          cy={300}
          r={Math.max(totalScale(Math.sqrt(totalSapling)), minR)}
          fill="none"
          stroke="#d4a017"
          strokeOpacity={0.5}
          strokeWidth={4}
        />
        <circle
          cx={orchardX}
          cy={300}
          r={Math.max(totalScale(Math.sqrt(totalOrchard)), minR)}
          fill="none"
          stroke="#111"
          strokeOpacity={0.5}
          strokeWidth={4}
        />

        {/* Clusters */}
        {renderCluster(saplingData, saplingScale, saplingX, '#d4a017')}
        {renderCluster(orchardData, orchardScale, orchardX, '#111')}

        {/* Legend */}
        <g transform="translate(900,430)">
          <rect x={-12} y={-20} width={24} height={24} fill="#d4a017" />
          <text x={30} y={-2} fill="#333" fontSize={14}>
            Sapling (total: {humanize(totalSapling)})
          </text>
          <rect x={-12} y={10} width={24} height={24} fill="#111" />
          <text x={30} y={28} fill="#333" fontSize={14}>
            Orchard (total: {humanize(totalOrchard)})
          </text>
        </g>
      </svg>
    </div>
  );
};

export default PrivacySetVisualization;
