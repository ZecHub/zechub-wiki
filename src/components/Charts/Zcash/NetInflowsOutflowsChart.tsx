"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { formatNumberShort, getNetInOutflowData } from "@/lib/chart/helpers";
import { NetInOutflow } from "@/lib/chart/types";
import * as dateFns from "date-fns";
import { RefObject, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartHeader from "../ChartHeader";
import ChartContainer from "./ChartContainer";

interface NetInflowsOutflowsChartProps {
  color?: string;
  chartRef: RefObject<HTMLDivElement | null>;
}

export default function NetInflowsOutflowsChart(
  props: NetInflowsOutflowsChartProps
) {
  const [loading, setLoading] = useState(false);
  const [dataFlow, setDataFlow] = useState<NetInOutflow[]>([]);
  const [error, setError] = useState(false);

  const fontSize = useResponsiveFontSize();

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [netInOutflow] = await Promise.all([
          getNetInOutflowData(
            DATA_URL.netInflowsOutflowsUrl,
            controller.signal
          ),
        ]);

        setDataFlow(netInOutflow);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    return () => controller.abort();
  }, []);

  const parsedData = dataFlow.map((item) => ({
    date: item.Date,
    netSaplingFlow: -parseFloat(item["Net Sapling Flow"]),
    netOrchardFlow: -parseFloat(item["Net Orchard Flow"]),
  }));

  console.log(parsedData);

  return (
    <ErrorBoundary fallback={"Failed to load Net Inflows"}>
      <ChartHeader title="Net Sapling & Orchard Flow" />
      <ChartContainer ref={props.chartRef} loading={loading}>
        <BarChart
          data={parsedData}
          margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="saplingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="orchardGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />

          <XAxis
            dataKey="date"
            tickFormatter={(date) => dateFns.format(new Date(date), "MMM yyyy")}
            tick={{ fontSize, fill: "#94a3b8" }}
          />
          <YAxis
            tickFormatter={(v) => formatNumberShort(v)}
            tick={{ fontSize, fill: "#94a3b8" }}
          />

          <Tooltip
            formatter={(value: any, name: any) => [
              typeof value === "number"
                ? `${value.toLocaleString()} ZEC`
                : value,
              name === "netSaplingFlow"
                ? "Net Sapling Flow"
                : name === "netOrchardFlow"
                ? "Net Orchard Flow"
                : name,
            ]}
            labelFormatter={(label) => dateFns.format(new Date(label), "PPP")}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              fontSize: "0.875rem",
            }}
            labelStyle={{ color: "#64748b" }}
            itemStyle={{ color: "#0f172a" }}
            cursor={{ fill: "#3b82f6", fillOpacity: 0.1 }}
          />

          <Legend
            align="center"
            content={() => (
              <div className="pt-5 flex justify-center gap-6 text-sm mt-2 text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 inline-block rounded-sm"
                    style={{
                      background: "#ec4899",
                    }}
                  />
                  <p>Net Orchard Flow</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 inline-block rounded-sm"
                    style={{
                      background: "#3b82f6",
                    }}
                  />
                  <p>Net Sapling Flow</p>
                </div>
              </div>
            )}
          />
          <Bar
            dataKey="netSaplingFlow"
            name="Net Sapling Flow"
            fill="url(#saplingGradient)"
            stroke="#3b82f6"
            strokeWidth={1.5}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="netOrchardFlow"
            name="Net Orchard Flow"
            fill="url(#orchardGradient)"
            stroke="#ec4899"
            strokeWidth={1.5}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </ErrorBoundary>
  );
}
