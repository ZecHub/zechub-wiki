"use client";

import React, { useEffect, useState } from "react";

/**
 * PrivacySetVisualization
 * Rings radiate from center in year order (2022→2025), hover to highlight
 */

type TransactionSummaryDatum = {
  height: number;
  sapling: number;
  orchard: number;
};

// Map block heights to years
const HEIGHT_YEAR_MAP = [
  // Approximate blocks per year (~418k)
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
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/transaction_summary.json";

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
          const year =
            HEIGHT_YEAR_MAP.find(
              (r) => height >= r.start && height <= r.end
            )?.year || "Unknown";
          if (!agg.has(year)) agg.set(year, { sapling: 0, orchard: 0 });
          const e = agg.get(year)!;
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

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  // Chronological order
  // Full sapling years: 2018–2025
  const saplingYears = ["2018","2019","2020","2021","2022","2023","2024","2025"];
  // Orchard only from 2022 onward
  const orchardYears = ["2022","2023","2024","2025"];  // full range
  const entries = years.map((y) => [y, yearly.get(y) ?? { sapling: 0, orchard: 0 }] as [string, { sapling: number; orchard: number }]);

  // Build data arrays per specific year sequences
  // raw per-year counts
  const saplingData: [string, number][] = saplingYears.map(y => [y, yearly.get(y)?.sapling || 0]);
  const orchardData: [string, number][] = orchardYears.map(y => [y, yearly.get(y)?.orchard || 0]);

  // cumulative sums so each ring grows continuously
  const cumSaplingData: [string, number][] = [];
  saplingData.forEach(([y, v], i) => {
    const prev = i > 0 ? cumSaplingData[i - 1][1] : 0;
    cumSaplingData.push([y, prev + v]);
  });

  const cumOrchardData: [string, number][] = [];
  orchardData.forEach(([y, v], i) => {
    const prev = i > 0 ? cumOrchardData[i - 1][1] : 0;
    cumOrchardData.push([y, prev + v]);
  });

  // now use cumSaplingData and cumOrchardData for rendering & totals
  const totalSapling = cumSaplingData[cumSaplingData.length - 1][1];
  const totalOrchard = cumOrchardData[cumOrchardData.length - 1][1];
  const orchardData: [string, number][] = orchardYears.map(y => [y, yearly.get(y)?.orchard || 0]);(([y, v]) => [y, v.sapling] as [string, number]);
  const orchardData = entries.map(([y, v]) => [y, v.orchard] as [string, number]);
  const totalSapling = saplingData.reduce((sum, [,v]) => sum + v, 0);
  const totalOrchard = orchardData.reduce((sum, [,v]) => sum + v, 0);((sum, [,v]) => sum+v, 0);
  const totalOrchard = orchardData.reduce((sum, [,v]) => sum+v, 0);

  // Radii by chronological index
  const minR = 20;
  // Steps are scaled by number of rings per cluster
  const maxR = 200;
  const stepSap = (maxR - minR) / (saplingYears.length - 1);
  const stepOrch = (maxR - minR) / (orchardYears.length - 1); // smaller inner radius
  const maxR = 200; // larger outer radius
  const step = (maxR - minR) / (years.length - 1);

  const humanize = (v: number) =>
    v >= 1e6 ? `${(v/1e6).toFixed(1)}M` : v >= 1e3 ? `${(v/1e3).toFixed(1)}k` : `${v}`;

  // Render one cluster
  const renderCluster = (
    data: Array<[string, number]>,
    cx: number,
    color: string,
    type: string,
    step: number
  ) =>
    data.map(([year, val], idx) => {
      const id = `${type}-${year}`;
      const hovered = hoveredId === id;
      const r = minR + idx * (type === 'sapling' ? stepSap : stepOrch);
      const dy = hovered ? -10 : 0;
      const opacity = hovered ? 0.4 : 0.2;
      const strokeWidth = hovered ? 3 : 2;

      return (
        <g
          key={id}
          transform={`translate(${cx},${350 + dy})`}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHoveredId(id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <circle
            cx={0}
            cy={0}
            r={r}
            fill={color}
            fillOpacity={opacity}
            stroke={color}
            strokeWidth={strokeWidth}
            pointerEvents="visibleStroke"
          />
          {/* Year label */}
          <text
            x={0}
            y={-r - 10 - idx * 2}
            textAnchor="middle"
            fill="#333"
            fontSize={14}
            fontWeight="bold"
          >
            {year}
          </text>
          {/* Value label */}
          <text
            x={0}
            y={r + 20 + idx * 2}
            textAnchor="middle"
            fill="#333"
            fontSize={12}
          >
            {humanize(val)}
          </text>
        </g>
      );
    });

export default PrivacySetVisualization;
