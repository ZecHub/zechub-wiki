"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { getNetInOutflowData } from "@/lib/chart/helpers";
import { NetInOutflow } from "@/lib/chart/types";
import { formatNumber } from "@/lib/helpers";
import * as dateFns from "date-fns";
import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface NetInflowsOutflowsChartProps {
  color?: string;
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
    netSaplingFlow: parseFloat(item["Net Sapling Flow"]),
    netOrchardFlow: parseFloat(item["Net Orchard Flow"]),
  }));

  return (
    <ErrorBoundary fallback={"Failed to load Net Inflows"}>
      <div className="space-y-6">
        <div className="flex mt-12">
          <h3 className="text-lg font-semibold mb-4 flex-1">
            Net Sapling & Orchard Flow
          </h3>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner />
          </div>
        ) : error ? (
          <p className="flex justify-center items-center text-red-500 text-center">
            Chart cannot be rendered at the moment
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={parsedData}
              margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
            >
              {/* Gradients */}
              <defs>
                <linearGradient
                  id="saplingGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient
                  id="orchardGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />

              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  dateFns.format(new Date(date), "MMM yyyy")
                }
                tick={{ fontSize, fill: "#94a3b8" }}
              />
              <YAxis
                tickFormatter={(v) => formatNumber(v)}
                tick={{ fontSize, fill: "#94a3b8" }}
              />

              <Tooltip
                formatter={(value: any, name: string) => [
                  typeof value === "number"
                    ? `${value.toLocaleString()} ZEC`
                    : value,
                  name === "netSaplingFlow"
                    ? "Net Sapling Flow"
                    : "Net Orchard Flow",
                ]}
                labelFormatter={(label) =>
                  dateFns.format(new Date(label), "PPP")
                }
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  fontSize: "0.875rem",
                }}
                labelStyle={{ color: "#64748b" }}
                itemStyle={{ color: "#0f172a" }}
                cursor={{ fill: "#3b82f6", fillOpacity: 0.1 }}
              />

              <Legend />

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
          </ResponsiveContainer>
        )}
      </div>
    </ErrorBoundary>
  );
}
