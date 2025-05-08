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

  // Prepare scales
  const entries = Array.from(yearlyData.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const saplingValues = entries.map(([, d]) => d.sapling);
  const orchardValues = entries.map(([, d]) => d.orchard);
  const minR = 50, maxR = 200;
  const saplingScale = scaleLinear({ domain: [Math.min(...saplingValues), Math.max(...saplingValues)], range: [minR, maxR] });
  const orchardScale = scaleLinear({ domain: [Math.min(...orchardValues), Math.max(...orchardValues)], range: [minR, maxR] });

  const humanize = (v: number) => v >= 1e6 ? (v/1e6).toFixed(1)+'M' : v >= 1e3 ? (v/1e3).toFixed(1)+'k' : v.toString();
  const totalSapling = saplingValues.reduce((a,b) => a+b, 0);
  const totalOrchard = orchardValues.reduce((a,b) => a+b, 0);

  const renderCircles = (
    data: Array<[string, number]>,
    scale: (value: number) => number,
    xStart: number,
    color: string
  ) => {
    const xStep = maxRadius + 50; // horizontal spacing
    return data.map(([year, value], index) => {
      const r = scale(value);
      const x = xStart + index * xStep;
      return (
        <g key={year} transform={`translate(${x}, 300)`}>
          <circle cx={0} cy={0} r={r} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={3} />
          <text
            x={0}
            y={-r + 30}
            textAnchor="middle"
            fill={color}
            fontSize="16"
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
            {humanize(val)}
          </text>
        </g>
      );
    });
  };

export default PrivacySetVisualization;
