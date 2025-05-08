"use client";

import React, { useEffect, useState } from "react";
import { scaleLinear } from "@visx/scale";

/**
 * PrivacySetVisualization
 * Interactive rings that highlight & lift on hover
 */

type TransactionSummaryDatum = {
  height: number;
  sapling: number;
  orchard: number;
};

const DATA_URL =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/transaction_summary.json";
const HEIGHT_YEAR_MAP = [
  { start: 0, end: 1933300, year: "2022" },
  { start: 1933301, end: 2352180, year: "2023" },
  { start: 2352181, end: 2771014, year: "2024" },
  { start: 2771015, end: Infinity, year: "2025" },
];

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

  const entries = Array.from(yearly.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  const saplingVals = entries.map(([, v]) => v.sapling);
  const orchardVals = entries.map(([, v]) => v.orchard);
  const totalSapling = saplingVals.reduce((a, b) => a + b, 0);
  const totalOrchard = orchardVals.reduce((a, b) => a + b, 0);

  const minRadius = 30;
  const maxRadius = 150;
  const saplingScale = scaleLinear({
    domain: [
      Math.sqrt(Math.min(...saplingVals)),
      Math.sqrt(Math.max(...saplingVals)),
    ],
    range: [minRadius, maxRadius],
  });
  const orchardScale = scaleLinear({
    domain: [
      Math.sqrt(Math.min(...orchardVals)),
      Math.sqrt(Math.max(...orchardVals)),
    ],
    range: [minRadius, maxRadius],
  });
  const totalScale = scaleLinear({
    domain: [0, Math.sqrt(Math.max(totalSapling, totalOrchard))],
    range: [minRadius, maxRadius],
  });

  const humanize = (v: number) =>
    v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(1)}k` : `${v}`;

  // Render rings in chronological order (2022→2025)
  const renderCluster = (
    data: Array<[string, number]>,
    scaleFn: (n: number) => number,
    cx: number,
    color: string,
    type: string
  ) => {
    return data.map(([year, val], idx) => {
      const id = `${type}-${year}`;
      const r = scaleFn(Math.sqrt(val));
      // On hover, lift ring by 10px
      const isHovered = hoveredId === id;
      const cy = 350 + (isHovered ? -10 : 0);
      const fillOpac = isHovered ? 0.4 : 0.2;
      const strokeW = isHovered ? 3 : 2;
      // Stagger labels to avoid overlap
      const yearLabelY = -r - 10 - idx * 18;
      const valueLabelY = r + 20 + idx * 18;
      return (
        <g
          key={id}
          transform={`translate(${cx},${cy})`}
          style={{ cursor: "pointer" }}
          onMouseEnter={() => setHoveredId(id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <circle
            cx={0}
            cy={0}
            r={r}
            fill={color}
            fillOpacity={fillOpac}
            stroke={color}
            strokeWidth={strokeW}
          />
          <text
            x={0}
            y={yearLabelY}
            textAnchor="middle"
            fill={color}
            fontSize={14}
            fontWeight="bold"
          >
            {year}
          </text>
          <text
            x={0}
            y={valueLabelY}
            textAnchor="middle"
            fill={color}
            fontSize={12}
          >
            {humanize(val)}
          </text>
        </g>
      );
    });
  };

  const yearOrder = ["2022","2023","2024","2025"];
  const saplingData: [string, number][] = yearOrder.map(y => [y, yearly.get(y)?.sapling || 0]);
  const orchardData: [string, number][] = yearOrder.map(y => [y, yearly.get(y)?.orchard || 0]);
  const saplingX = 300;
  const orchardX = 900;

  return (
    <div
      style={{
        background: "#f8f4e8",
        padding: 20,
        borderRadius: 8,
        overflow: "visible",
      }}
    >
      <svg
        width={1200}
        height={650}
        style={{ display: "block", margin: "0 auto" }}
      >
        {/* Title */}
        <text x={60} y={50}
          fill="#d4a017"
          fontSize={28}
          fontWeight="bold"
        >
          Zcash shielded transactions
        </text>
        <text x={60} y={80} fill="#333" fontSize={14}>
          Privacy set based on Orchard & Sapling shielded transactions
        </text>

        {/* Total rings */}
        <circle
          cx={saplingX}
          cy={350}
          r={totalScale(Math.sqrt(totalSapling))}
          fill="none"
          stroke="#d4a017"
          strokeOpacity={0.4}
          strokeWidth={4}
        />
        <circle
          cx={orchardX}
          cy={350}
          r={totalScale(Math.sqrt(totalOrchard))}
          fill="none"
          stroke="#111"
          strokeOpacity={0.4}
          strokeWidth={4}
        />

        {/* Interactive clusters */}
        {renderCluster(saplingData, saplingScale, saplingX, "#d4a017", "sapling")}
        {renderCluster(orchardData, orchardScale, orchardX, "#111", "orchard")}

        {/* Legend bottom-right */}
        <g transform="translate(1040,600)">
          <rect x={0} y={0} width={16} height={16} fill="#d4a017" />
          <text x={24} y={12} fill="#333" fontSize={12}>
            Sapling (total: {humanize(totalSapling)})
          </text>
          <rect x={0} y={24} width={16} height={16} fill="#111" />
          <text x={24} y={36} fill="#333" fontSize={12}>
            Orchard (total: {humanize(totalOrchard)})
          </text>
        </g>
      </svg>
    </div>
  );
};

export default PrivacySetVisualization;
