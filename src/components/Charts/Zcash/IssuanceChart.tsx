import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useIssuanceData } from "@/hooks/useIssuanceData";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { RefObject, useState } from "react";
import ChartHeader from "../ChartHeader";
import ChartContainer from "./ChartContainer";

type IssuanceChartProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

export default function IssuanceChart(props: IssuanceChartProps) {
  const { data, loading } = useIssuanceData(DATA_URL.issuanceUrl);
  const fontSize = useResponsiveFontSize();

  // Toggle visibility for each series
  const [issuanceVisible, setIssuanceVisible] = useState(true);
  const [inflationVisible, setInflationVisible] = useState(true);

  // Custom tooltip for better data display
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {label}
          </p>
          {payload.map((entry: any, index: number) => {
            return (
              <p
                key={index}
                className="text-sm flex items-center gap-2"
                style={{ color: entry.color }}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="font-medium">
                  {entry.dataKey === "issuance" ? "Issuance" : "Inflation"}:
                </span>
                <span className="font-semibold">
                  {entry.value.toLocaleString()}
                </span>
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <ErrorBoundary fallback={"Failed to load Issuance Chart"}>
      <ChartHeader title="ZEC Issuance vs. Inflation Rate" />

      <ChartContainer ref={props.chartRef} loading={loading}>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="inflationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6b6b" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#ff6b6b" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />

          <XAxis dataKey="date" tick={{ fontSize, fill: "#94a3b8" }} />

          <YAxis
            yAxisId="left"
            tick={{ fontSize, fill: "#94a3b8" }}
            width={60}
            label={{ value: "Issuance", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize, fill: "#94a3b8" }}
            width={60}
            label={{ value: "Inflation (%)", angle: 90, position: "insideRight" }}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Clickable Legend */}
          <Legend
            verticalAlign="bottom"
            align="center"
            content={() => (
              <div className="flex justify-center gap-8 text-sm mt-4">
                <button
                  onClick={() => setIssuanceVisible(!issuanceVisible)}
                  className={`flex items-center gap-2 cursor-pointer transition-colors ${
                    issuanceVisible ? "" : "opacity-40 line-through"
                  }`}
                >
                  <span
                    className="inline-block w-3 h-3 rounded-sm"
                    style={{ background: "hsl(var(--chart-1))" }}
                  />
                  <span className="font-medium">Issuance</span>
                </button>

                <button
                  onClick={() => setInflationVisible(!inflationVisible)}
                  className={`flex items-center gap-2 cursor-pointer transition-colors ${
                    inflationVisible ? "" : "opacity-40 line-through"
                  }`}
                >
                  <span
                    className="inline-block w-3 h-3 rounded-sm"
                    style={{ background: "hsl(var(--chart-3))" }}
                  />
                  <span className="font-medium">Inflation</span>
                </button>
              </div>
            )}
          />

          <Bar
            yAxisId="left"
            dataKey="issuance"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
            hide={!issuanceVisible}
          />

          <Area
            yAxisId="right"
            type="monotone"
            dataKey="inflation"
            stroke="hsl(var(--chart-5))"
            fill="url(#inflationGradient)"
            fillOpacity={1}
            strokeWidth={2}
            hide={!inflationVisible}
          />
        </ComposedChart>
      </ChartContainer>
    </ErrorBoundary>
  );
}