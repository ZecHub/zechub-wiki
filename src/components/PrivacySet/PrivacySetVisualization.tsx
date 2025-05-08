"use client";

import React, { useEffect, useState } from "react";
import { scaleLinear } from "@visx/scale";

// Transaction summary source URL
const DATA_URL =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/transaction_summary.json";

// Block height to year mapping
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

        // Aggregate per year
        const dataMap = new Map<string, { sapling: number; orchard: number }>();
        rawData.forEach(item => {
          const year =
            HEIGHT_YEAR_MAP.find(r => item.height >= r.start && item.height <= r.end)?.year ?? "Unknown";
          if (!dataMap.has(year)) dataMap.set(year, { sapling: 0, orchard: 0 });
          const y = dataMap.get(year)!;
          y.sapling += item.sapling;
          y.orchard += item.orchard;
        });

        setYearlyData(dataMap);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return <div className="text-center p-8">Loading privacy set data...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error loading data: {error.message}</div>;

  // Prepare scales for radii
  const entries = Array.from(yearlyData.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const saplingValues = entries.map(([, d]) => d.sapling);
  const orchardValues = entries.map(([, d]) => d.orchard);
  const minRadius = 50;
  const maxRadius = 200;

  const saplingScale = scaleLinear({
    domain: [Math.min(...saplingValues), Math.max(...saplingValues)],
    range: [minRadius, maxRadius],
  });
  const orchardScale = scaleLinear({
    domain: [Math.min(...orchardValues), Math.max(...orchardValues)],
    range: [minRadius, maxRadius],
  });

  // Totals for legend
  const totalSapling = saplingValues.reduce((sum, v) => sum + v, 0);
  const totalOrchard = orchardValues.reduce((sum, v) => sum + v, 0);

  const humanizeNumber = (value: number) => {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(1) + 'k';
    return value.toString();
  };

  const renderCircles = (
    data: Array<[string, number]>,
    scale: (value: number) => number,
    xOffset: number,
    color: string
  ) => data.map(([year, value]) => {
    const r = scale(value);
    return (
      <g key={year} transform={`translate(${xOffset}, 300)`}>
        <circle cx={0} cy={0} r={r} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={3} />
        <text
          x={0}
          y={-r + 30}
          textAnchor="middle"
          fill={color}
          fontSize="18"
          fontWeight="bold"
        >
          {year}
        </text>
        <text
          x={0}
          y={-r + 55}
          textAnchor="middle"
          fill={color}
          fontSize="14"
        >
          {humanizeNumber(value)}
        </text>
      </g>
    );
  });

  const saplingData = entries.map(([y, d]) => [y, d.sapling] as [string, number]);
  const orchardData = entries.map(([y, d]) => [y, d.orchard] as [string, number]);

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#f8f4e8', padding: '40px' }}>
      <svg width={1100} height={600}>
        {/* All rings radiating from a common center */}
        {renderCircles(saplingData, saplingScale, 550, '#d4a017')}
        {renderCircles(orchardData, orchardScale, 550, '#111')}

        {/* Legend at bottom right with totals */}
        <g transform="translate(880, 520)">
          <rect x={-15} y={-30} width={25} height={25} fill="#d4a017" />
          <text x={30} y={-12} fill="#333" fontSize="16">
            Sapling ({humanizeNumber(totalSapling)})
          </text>
          <rect x={-15} y={5} width={25} height={25} fill="#111" />
          <text x={30} y={27} fill="#333" fontSize="16">
            Orchard ({humanizeNumber(totalOrchard)})
          </text>
        </g>

        {/* Title and subtitle */}
        <g transform="translate(650, 100)">
          <text x={0} y={0} fill="#d4a017" fontSize="32" fontWeight="bold">
            Zcash shielded transactions
          </text>
          <text x={0} y={36} fill="#333" fontSize="18">
            Privacy set based on number of orchard & sapling transactions
          </text>
          <text x={0} y={60} fill="#333" fontSize="18">
            with shielded outputs
          </text>
        </g>
      </svg>
    </div>
  );
};

export default PrivacySetVisualization;
