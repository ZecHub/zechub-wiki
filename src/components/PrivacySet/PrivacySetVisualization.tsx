"use client";
import React, { useEffect, useState } from "react";
import { scaleLinear } from "@visx/scale";

type ProtocolData = {
  year: string;
  count: number;
  protocol: "sapling" | "orchard";
};

type YearlyData = {
  year: string;
  sapling: number;
  orchard: number;
};

interface PrivacySetVisualizationProps {
  chartData: { sapling: number; orchard: number; timestamp: string }[];
}

const PrivacySetVisualization: React.FC<PrivacySetVisualizationProps> = ({ chartData }) => {
  const [yearlyData, setYearlyData] = useState<Map<string, { sapling: number; orchard: number }>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalSapling, setTotalSapling] = useState(0);
  const [totalOrchard, setTotalOrchard] = useState(0);
  

  useEffect(() => {
    try {
      setIsLoading(true);
      const dataMap = new Map<string, { sapling: number; orchard: number }>();

      chartData.forEach((item) => {
        const year = new Date(item.timestamp).getFullYear().toString();
        console.log(`Processing year: ${year}`);

        if (!dataMap.has(year)) {
          dataMap.set(year, { sapling: 0, orchard: 0 });
        }

        const yearData = dataMap.get(year)!;
        yearData.sapling += item.sapling;
        yearData.orchard += item.orchard;
      });

      console.log("Processed Yearly Data:", Array.from(dataMap.entries()));

      setYearlyData(dataMap);

      let saplingSum = 0;
      let orchardSum = 0;

      dataMap.forEach((data) => {
        saplingSum += data.sapling;
        orchardSum += data.orchard;
      });

      setTotalSapling(saplingSum);
      setTotalOrchard(orchardSum);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [chartData]);

  const humanizeNumber = (value: number) => {
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1) + 'M';
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(1) + 'k';
    }
    return value.toString();
  };

  const renderCircles = (data: Map<string, number>, xOffset: number, color: string) => {
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
    return <div className="text-center p-8 text-red-500">Error loading data: {error.message}</div>;
  }

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#f8f4e8', padding: '20px' }}>
      <svg width={1000} height={500}>
        {renderCircles(new Map(Array.from(yearlyData.entries()).map(([year, data]) => [year, data.sapling])), 300, "#d4a017")}
        {renderCircles(new Map(Array.from(yearlyData.entries()).map(([year, data]) => [year, data.orchard])), 500, "#111")}
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