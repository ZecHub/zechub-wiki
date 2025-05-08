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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const rawData: TransactionSummaryDatum[] = await response.json();

        const dataMap = new Map<string, { sapling: number; orchard: number }>();
        rawData.forEach((item) => {
          const year =
            HEIGHT_YEAR_MAP.find(
              (r) => item.height >= r.start && item.height <= r.end
            )?.year ?? "Unknown";
          if (!dataMap.has(year)) dataMap.set(year, { sapling: 0, orchard: 0 });
          const y = dataMap.get(year)!;
          y.sapling += item.sapling;
          y.orchard += item.orchard;
        });

        setYearlyData(dataMap);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error.message}</div>;

  // Sort by year ascending
  const entries = Array.from(yearlyData.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const saplingValues = entries.map(([, d]) => d.sapling);
  const orchardValues = entries.map(([, d]) => d.orchard);

  const minRadius = 30;
  const maxRadius = 120;
  const saplingScale = scaleLinear({
    domain: [Math.min(...saplingValues), Math.max(...saplingValues)],
    range: [minRadius, maxRadius],
  });
  const orchardScale = scaleLinear({
    domain: [Math.min(...orchardValues), Math.max(...orchardValues)],
    range: [minRadius, maxRadius],
  });

  const humanize = (v: number) =>
    v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` :
    v >= 1_000 ? `${(v / 1_000).toFixed(1)}k` : `${v}`;

  // Totals
  const totalSapling = saplingValues.reduce((s, v) => s + v, 0);
  const totalOrchard = orchardValues.reduce((s, v) => s + v, 0);

  // Render a series of rings along a horizontal line
  const renderRings = (
    data: Array<[string, number]>,
    scale: (n: number) => number,
    xOffset: number,
    color: string
  ) => {
    const xStep = maxRadius + 20;
    return data.map(([year, val], i) => {
      const r = scale(val);
      const cx = xOffset + i * xStep;
      return (
        <g key={year} transform={`translate(${cx}, 300)`}>
          <circle cx={0} cy={0} r={r} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={2} />
          <text x={0} y={-r + 20} textAnchor="middle" fill={color} fontSize={14} fontWeight="bold">
            {year}
          </text>
          <text x={0} y={-r + 40} textAnchor="middle" fill={color} fontSize={12}>
            {humanize(val)}
          </text>
        </g>
      );
    });
  };

  const saplingData = entries.map(([y, d]) => [y, d.sapling] as [string, number]);
  const orchardData = entries.map(([y, d]) => [y, d.orchard] as [string, number]);

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#f8f4e8', padding: '40px' }}>
      <svg width={1100} height={500}>
        {/* Title & subtitle */}
        <text x={50} y={40} fill="#d4a017" fontSize={28} fontWeight="bold">
          Zcash shielded transactions
        </text>
        <text x={50} y={70} fill="#333" fontSize={16}>
          Privacy set based on number of Orchard & Sapling transactions with shielded outputs
        </text>

        {/* Sapling first */}
        {renderRings(saplingData, saplingScale, 150, '#d4a017')}
        {/* Orchard first */}
        {renderRings(orchardData, orchardScale, 150, '#111')}

        {/* Legend */}
        <g transform="translate(800, 420)">
          <rect x={-12} y={-20} width={24} height={24} fill="#d4a017" />
          <text x={30} y={-2} fill="#333" fontSize={14}>
            Sapling ({humanize(totalSapling)})
          </text>
          <rect x={-12} y={10} width={24} height={24} fill="#111" />
          <text x={30} y={28} fill="#333" fontSize={14}>
            Orchard ({humanize(totalOrchard)})
          </text>
        </g>
      </svg>
    </div>
  );
};

export default PrivacySetVisualization;
