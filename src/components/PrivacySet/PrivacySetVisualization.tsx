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
  const [yearlyData, setYearlyData] = useState<
    Map<string, { sapling: number; orchard: number }>
  >(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error(`HTTP status ${res.status}`);
        const raw: TransactionSummaryDatum[] = await res.json();
        const map = new Map<string, { sapling: number; orchard: number }>();
        raw.forEach(({ height, sapling, orchard }) => {
          const year =
            HEIGHT_YEAR_MAP.find(r => height >= r.start && height <= r.end)?.year ?? "Unknown";
          if (!map.has(year)) map.set(year, { sapling: 0, orchard: 0 });
          const y = map.get(year)!;
          y.sapling += sapling;
          y.orchard += orchard;
        });
        setYearlyData(map);
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error.message}</div>;

  // Prepare data sorted by year
  const entries = Array.from(yearlyData.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const saplingVals = entries.map(([, d]) => d.sapling);
  const orchardVals = entries.map(([, d]) => d.orchard);

  // Scales for per-year rings
  const minR = 30;
  const maxR = 120;
  const saplingScale = scaleLinear({
    domain: [
      Math.sqrt(Math.min(...saplingVals)),
      Math.sqrt(Math.max(...saplingVals))
    ],
    range: [minR, maxR],
  });
  const orchardScale = scaleLinear({
    domain: [Math.min(...orchardVals), Math.max(...orchardVals)],
    range: [minR, maxR],
  });({
    domain: [
      Math.sqrt(Math.min(...orchardVals)),
      Math.sqrt(Math.max(...orchardVals))
    ],
    range: [minR, maxR],
  });
  const orchardScale = scaleLinear({
    domain: [Math.min(...orchardVals), Math.max(...orchardVals)],
    range: [minR, maxR],
  });

  // Totals
  const totalSapling = saplingVals.reduce((a, b) => a + b, 0);
  const totalOrchard = orchardVals.reduce((a, b) => a + b, 0);

  // Scale for total circles (same range)
  const totalScale = scaleLinear({
    domain: [0, Math.max(totalSapling, totalOrchard)],
    range: [minR, maxR],
  });

  // Format numbers
  const humanize = (v: number) =>
    v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(1)}k` : `${v}`;

  // Render concentric rings for a pool at center x, drawing outermost first
  const renderCluster = (
    data: Array<[string, number]>,
    scale: (n: number) => number,
    cx: number,
    color: string
  ) =>
    [...data]
      .reverse()
      .map(([year, val]) => {
        // Ensure minimum radius for legibility
        const rawR = scale(val);
        const r = Math.max(rawR, 50); // clamp to 50px minimum radius
        return (
          <g key={year} transform={`translate(${cx}, 300)`}>
            <circle
              cx={0}
              cy={0}
              r={r}
              fill={color}
              fillOpacity={0.2}
              stroke={color}
              strokeWidth={2}
            />
            <text
              x={0}
              y={-r - 10}
              textAnchor="middle"
              fill={color}
              fontSize={16}
              fontWeight="bold"
            >
              {year}
            </text>
            <text
              x={0}
              y={r + 20}
              textAnchor="middle"
              fill={color}
              fontSize={14}
            >
              {humanize(val)}
            </text>
          </g>
        );
      }));
        return (
          <g key={year} transform={`translate(${cx}, 300)`}>
            <circle
              cx={0}
              cy={0}
              r={r}
              fill={color}
              fillOpacity={0.2}
              stroke={color}
              strokeWidth={2}
            />
            <text
              x={0}
              y={-r - 10}
              textAnchor="middle"
              fill={color}
              fontSize={16}
              fontWeight="bold"
            >
              {year}
            </text>
            <text
              x={0}
              y={r + 20}
              textAnchor="middle"
              fill={color}
              fontSize={14}
            >
              {humanize(val)}
            </text>
          </g>
        );
      });

  const saplingData: [string, number][] = entries.map(([y, d]) => [y, d.sapling]);
  const orchardData: [string, number][] = entries.map(([y, d]) => [y, d.orchard]);

  // Cluster centers
  const saplingX = 350;
  const orchardX = 800;

  return (
    <div
      style={{
        textAlign: 'center',
        backgroundColor: '#f8f4e8',
        padding: 40,
      }}
    >
      <svg width={1100} height={500}>
        {/* Title */}
        <text x={50} y={40} fill="#d4a017" fontSize={28} fontWeight="bold">
          Zcash shielded transactions
        </text>
        <text x={50} y={70} fill="#333" fontSize={16}>
          Privacy set based on number of Orchard &amp; Sapling shielded transactions
        </text>

        {/* Total circles behind each cluster */}
        <circle
          cx={saplingX}
          cy={300}
          r={totalScale(totalSapling)}
          fill="none"
          stroke="#d4a017"
          strokeOpacity={0.5}
          strokeWidth={4}
        />
        <circle
          cx={orchardX}
          cy={300}
          r={totalScale(totalOrchard)}
          fill="none"
          stroke="#111"
          strokeOpacity={0.5}
          strokeWidth={4}
        />

        {/* Concentric clusters */}
        {renderCluster(saplingData, saplingScale, saplingX, '#d4a017')}
        {renderCluster(orchardData, orchardScale, orchardX, '#111')}

        {/* Legend */}
        <g transform="translate(900,420)">
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
