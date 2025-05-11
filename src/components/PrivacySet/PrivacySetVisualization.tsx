"use client";

import React, { useEffect, useState } from "react";

/**
 * PrivacySetVisualization
 * Rings radiate chronologically from center (earliest year) to outer (latest),
 * with hover highlighting via stroke events.
 */

type TransactionSummaryDatum = {
  height: number;
  sapling: number;
  orchard: number;
};

// Define year boundaries by block height
const HEIGHT_YEAR_MAP = [
  { start: 0, end: 257775, year: "2018" },
  { start: 257776, end: 676656, year: "2019" },
  { start: 676657, end: 1095537, year: "2020" },
  { start: 1095538, end: 1514418, year: "2021" },
  { start: 1514419, end: 1933299, year: "2022" },
  { start: 1933300, end: 2352180, year: "2023" },
  { start: 2352181, end: 2771014, year: "2024" },
  { start: 2771015, end: Infinity, year: "2025" },
];

const DATA_URL =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/zcash/transaction_summary.json";

const PrivacySetVisualization: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yearly, setYearly] = useState<
    Map<string, { sapling: number; orchard: number }>
  >(new Map());
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw: TransactionSummaryDatum[] = await res.json();
        const agg = new Map<string, { sapling: number; orchard: number }>();
        raw.forEach(({ height, sapling, orchard }) => {
          const yr =
            HEIGHT_YEAR_MAP.find((r) => height >= r.start && height <= r.end)
              ?.year || "Unknown";
          if (!agg.has(yr)) agg.set(yr, { sapling: 0, orchard: 0 });
          const e = agg.get(yr)!;
          e.sapling += sapling;
          e.orchard += orchard;
        });
        setYearly(agg);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return <div className="text-center p-8">Loading privacy set...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  // Year sequences
  const saplingYears = [
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
  ];
  const orchardYears = ["2022", "2023", "2024", "2025"];

  // Raw counts
  const rawSap: [string, number][] = saplingYears.map((y) => [
    y,
    yearly.get(y)?.sapling || 0,
  ]);
  const rawOrch: [string, number][] = orchardYears.map((y) => [
    y,
    yearly.get(y)?.orchard || 0,
  ]);

  // Cumulative sums
  const cumSap: [string, number][] = [];
  rawSap.forEach(([y, v], i) => {
    const prev = i > 0 ? cumSap[i - 1][1] : 0;
    cumSap.push([y, prev + v]);
  });
  const cumOrch: [string, number][] = [];
  rawOrch.forEach(([y, v], i) => {
    const prev = i > 0 ? cumOrch[i - 1][1] : 0;
    cumOrch.push([y, prev + v]);
  });

  // Totals
  const totalSap = cumSap[cumSap.length - 1][1];
  const totalOrc = cumOrch[cumOrch.length - 1][1];

  // Radii
  const minR = 20;
  const maxR = 200;
  const stepSap = (maxR - minR) / (saplingYears.length - 1);
  const stepOrc = (maxR - minR) / (orchardYears.length - 1);

  const humanize = (v: number) =>
    v >= 1e6
      ? `${(v / 1e6).toFixed(1)}M`
      : v >= 1e3
      ? `${(v / 1e3).toFixed(1)}k`
      : `${v}`;

  // Draw cluster
  const renderCluster = (
    data: [string, number][],
    cx: number,
    color: string,
    type: string,
    step: number
  ) =>
    data.map(([year, val], idx) => {
      const id = `${type}-${year}`;
      const hov = hoveredId === id;
      const r = minR + idx * step;
      const dy = hov ? -10 : 0;
      const op = hov ? 0.4 : 0.2;
      const sw = hov ? 3 : 2;
      return (
        <g
          key={id}
          transform={`translate(${cx},${350 + dy})`}
          style={{ cursor: "pointer" }}
          onMouseEnter={() => setHoveredId(id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <circle
            r={r}
            fill={color}
            fillOpacity={op}
            stroke={color}
            strokeWidth={sw}
            pointerEvents="visibleStroke"
          />
          <text
            x={0}
            y={-r - 10}
            textAnchor="middle"
            fill="#333"
            fontSize={14}
            fontWeight="bold"
          >
            {year}
          </text>
          <text x={0} y={r + 20} textAnchor="middle" fill="#333" fontSize={12}>
            {humanize(val)}
          </text>
        </g>
      );
    });

  const sapX = 300,
    orcX = 900;

  return (
    <div className="bg-[#f8f4e8] dark:bg-slate-900 overflow-x-scroll" style={{ padding: 20, borderRadius: 8 }}>
      <svg
        width={1200}
        height={650}
        style={{ margin: "0 auto", display: "block" }}
      >
        {/* Title */}
        <text x={60} y={50} fill="#d4a017" fontSize={28} fontWeight="bold">
          Zcash shielded transactions
        </text>
        <text x={60} y={80} fill="#333" fontSize={14}>
          Privacy set based on Orchard & Sapling shielded transactions
        </text>

        {/* Background outlines */}
        <circle
          cx={sapX}
          cy={350}
          r={maxR + 10}
          fill="none"
          stroke="#d4a017"
          strokeOpacity={0.4}
          strokeWidth={4}
        />
        <circle
          cx={orcX}
          cy={350}
          r={maxR + 10}
          fill="none"
          stroke="#111"
          strokeOpacity={0.4}
          strokeWidth={4}
        />

        {/* Clusters */}
        {renderCluster(cumSap, sapX, "#d4a017", "sapling", stepSap)}
        {renderCluster(cumOrch, orcX, "#111", "orchard", stepOrc)}

        {/* Legend */}
        <g transform="translate(1040,600)">
          <rect width={16} height={16} fill="#d4a017" />
          <text x={24} y={12} fill="#333" fontSize={12}>
            Sapling (total: {humanize(totalSap)})
          </text>
          <rect y={24} width={16} height={16} fill="#111" />
          <text x={24} y={36} fill="#333" fontSize={12}>
            Orchard (total: {humanize(totalOrc)})
          </text>
        </g>
      </svg>
    </div>
  );
};

export default PrivacySetVisualization;
