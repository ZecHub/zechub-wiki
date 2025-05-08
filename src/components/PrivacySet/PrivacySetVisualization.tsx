"use client";
import React, { useEffect, useState } from "react";

// URL to the transaction summary JSON file in the ZecHub repository
const DATA_URL =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/transaction_summary.json";

// Map block height ranges to calendar years
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
          // Determine which year bucket this height falls into
          const year =
            HEIGHT_YEAR_MAP.find(
              (range) => item.height >= range.start && item.height <= range.end
            )?.year ?? "Unknown";

          if (!dataMap.has(year)) {
            dataMap.set(year, { sapling: 0, orchard: 0 });
          }

          const yearData = dataMap.get(year)!;
          yearData.sapling += item.sapling;
          yearData.orchard += item.orchard;
        });

        setYearlyData(dataMap);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const humanizeNumber = (value: number): string => {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "k";
    return value.toString();
  };

  const renderCircles = (
    data: Map<string, number>,
    xOffset: number,
    color: string
  ) => {
    const radiusStep = 40;
    let radius = 30;

    return Array.from(data.entries()).map(([year, value], index) => {
      const circleRadius = radius + index * radiusStep;
      return (
        <g key={year} transform={`translate(${xOffset}, 200)`}>
          <circle
            cx={0}
            cy={0}
            r={circleRadius}
            fill={color}
            fillOpacity={0.2}
            stroke={color}
            strokeWidth={2}
          />
          <text
            x={0}
            y={-circleRadius + 20}
            textAnchor="middle"
            fill={color}
            fontSize="14"
            fontWeight="bold"
          >
            {year}
          </text>
          <text
            x={0}
            y={-circleRadius + 40}
            textAnchor="middle"
            fill={color}
            fontSize="12"
          >
            {humanizeNumber(value)}
          </text>
        </g>
      );
    });
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading privacy set data...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        Error loading data: {error.message}
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", backgroundColor: "#f8f4e8", padding: "20px" }}>
      <svg width={1000} height={500}>
        {renderCircles(
          new Map(
            Array.from(yearlyData.entries()).map(([year, data]) => [year, data.sapling])
          ),
          300,
          "#d4a017"
        )}
        {renderCircles(
          new Map(
            Array.from(yearlyData.entries()).map(([year, data]) => [year, data.orchard])
          ),
          500,
          "#111"
        )}
        <text
          x={800}
          y={250}
          textAnchor="middle"
          fill="#333"
          fontSize="16"
          fontWeight="bold"
        >
          Sapling & Orchard
        </text>
        {/* Legend */}
        <g transform="translate(800, 300)">
          <rect x={-10} y={-10} width={20} height={20} fill="#d4a017" />
          <text x={20} y={5} fill="#333" fontSize="14">Sapling</text>
          <rect x={-10} y={30} width={20} height={20} fill="#111" />
          <text x={20} y={45} fill="#333" fontSize="14">Orchard</text>
        </g>
      </svg>
    </div>
  );
};

export default PrivacySetVisualization;
