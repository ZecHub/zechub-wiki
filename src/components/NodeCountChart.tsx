"use client";

import * as dateFns from "date-fns";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { fetchShieldedSupplyData } from "@/lib/chart/helpers";
import { Spinner } from "flowbite-react";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(n);

type NodeCountAmountDatum = {
  Date: string; // ISO date
  NodeCount: number; // parsed integer
};

type NodeCountChartProps = {
  dataUrl?: string;
  color?: string;
};

const NodeCountChart = (props: NodeCountChartProps) => {
  const [chartData, setChartData] = useState<NodeCountAmountDatum[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fontSize = useResponsiveFontSize(); // optional: pass min/max

  useEffect(() => {
    setIsLoading(true);

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
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex mt-12">
            <h3 className="text-lg font-semibold mb-4 flex-1">Node Count</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
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
                tickFormatter={(str) =>
                  dateFns.format(new Date(str), "MMM yyyy")
                }
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

              {/* Area */}
              <Area
                type="monotone"
                dataKey="NodeCount"
                stroke="#3b82f6"
                fill="url(#nodeGradient)"
                strokeWidth={2}
                dot={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}
      {
        // Render error message if error loading data
        error && (
          <div style={{ width: "100%", minWidth: "100%" }}>
            <p>
              <i>Error loading historic shielding data</i>
            </p>
          </div>
        )
      }
    </div>
  );
};

export default NodeCountChart;
