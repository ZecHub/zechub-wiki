"use client";

import * as dateFns from "date-fns";
import { RefObject, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { fetchShieldedSupplyData } from "@/lib/chart/helpers";
import { formatNumber } from "@/lib/helpers";
import { ErrorBoundary } from "../../ErrorBoundary/ErrorBoundary";
import ChartHeader from "../ChartHeader";
import ChartContainer from "./ChartContainer";

type NodeCountAmountDatum = {
  Date: string; // ISO date
  NodeCount: number; // parsed integer
};

type NodeCountChartProps = {
  color?: string;
  chartRef: RefObject<HTMLDivElement | null>;
};

const NodeCountChart = (props: NodeCountChartProps) => {
  const [chartData, setChartData] = useState<NodeCountAmountDatum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fontSize = useResponsiveFontSize(); // optional: pass min/max

  useEffect(() => {
    setLoading(true);

    fetchShieldedSupplyData(DATA_URL.nodecountUrl)
      .then((data) => {
        const parsed = data.map((item: any) => {
          const key = Object.keys(item).find((k) => k !== "Date") as string;
          return {
            Date: item.Date,
            NodeCount: parseInt(item[key]?.replace(/,/g, ""), 10),
          };
        });

        setChartData(parsed);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ErrorBoundary fallback={"Failed to load Node Count Chart"}>
      <ChartHeader title="Node Count" />
      <ChartContainer ref={props.chartRef} loading={loading}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="nodeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />

          {/* Axes */}
          <XAxis
            dataKey="Date"
            tickFormatter={(str) => dateFns.format(new Date(str), "MMM yyyy")}
            stroke="#94a3b8"
            tick={{ fontSize, fill: "#94a3b8" }}
            interval={"preserveStartEnd"}
          />
          <YAxis
            tickFormatter={formatNumber}
            stroke="#94a3b8"
            tick={{ fontSize, fill: "#94a3b8" }}
          />

          {/* Tooltip */}
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white dark:bg-slate-800 p-2 rounded shadow text-sm border border-slate-200 dark:border-slate-600">
                    <p className="text-gray-600 dark:text-gray-300">
                      {dateFns.format(new Date(label!), "PPP")}
                    </p>
                    <p className="font-semibold text-blue-600 dark:text-blue-300">
                      {formatNumber(payload[0].value as number)} nodes
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />

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
                    style={{ background: "#3b82f6" }}
                  />
                  <p>Node Count</p>
                </div>
              </div>
            )}
          />

          {/* Area */}
          <Area
            type="monotone"
            dataKey="NodeCount"
            stroke="#3b82f6"
            fill="url(#nodeGradient)"
            strokeWidth={2}
            dot={({ index, cx, cy }) => (
              <circle
                cx={cx}
                cy={cy}
                key={`node-dot-${index}`}
                r={4}
                fill="#3b82f6"
                stroke="white"
                strokeWidth={1.5}
              />
            )}
          />
        </AreaChart>
      </ChartContainer>
    </ErrorBoundary>
  );
};

export default NodeCountChart;
