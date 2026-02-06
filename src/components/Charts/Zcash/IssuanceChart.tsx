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
import { RefObject } from "react";
import ChartHeader from "../ChartHeader";
import ChartContainer from "./ChartContainer";

type IssuanceChartProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

export default function IssuanceChart(props: IssuanceChartProps) {
  const { data, loading } = useIssuanceData(DATA_URL.issuanceUrl);
  const fontSize = useResponsiveFontSize(); // optional: pass min/max

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
              <stop
                offset="0%"
                stopColor="#ff6b6b" // vivid red
                stopOpacity={0.9}
              />
              <stop
                offset="100%"
                stopColor="#ff6b6b" // vivid red
                stopOpacity={0.3}
              />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis dataKey="date" tick={{ fontSize, fill: "#94a3b8" }} />
          <YAxis
            yAxisId="left"
            tick={{ fontSize, fill: "#94a3b8" }}
            width={60}
            label={{
              value: "Issuance",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize, fill: "#94a3b8" }}
            width={60}
            label={{
              value: "Inflation (%)",
              angle: 90,
              position: "insideRight",
            }}
          />
          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="bottom"
            align="center"
            content={() => (
              <div
                style={{ paddingTop: 20 }}
                className="flex justify-center gap-6 text-sm text-slate-600 dark:text-slate-300"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 inline-block rounded-sm"
                    style={{ background: "hsl(var(--chart-1))" }}
                  />
                  <p>Issuance</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 inline-block rounded-sm"
                    style={{ background: "hsl(var(--chart-3))" }}
                  />
                  <p>Inflation</p>
                </div>
              </div>
            )}
          />

          <Bar
            yAxisId="left"
            dataKey="issuance"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
          />

          <Area
            yAxisId="right"
            type="monotone"
            dataKey="inflation"
            stroke="hsl(var(--chart-5))"
            fill="url(#inflationGradient)"
            fillOpacity={1} // max fill visibility
            strokeWidth={2}
          />
        </ComposedChart>
      </ChartContainer>
    </ErrorBoundary>
  );
}
