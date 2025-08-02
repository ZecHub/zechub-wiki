// "use client";

import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { RefObject, useEffect, useState } from "react";
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
import ChartContainer from "./ChartContainer";

type TransactionSummaryDatum = {
  height: number;
  sapling: number;
  orchard: number;
};

// Define year boundaries by block height
const HEIGHT_YEAR_MAP = [
  { start: 0, end: 257775, year: "2018" },
  { start: 257776, end: 676656, year: "2019" },
  { start: 676657, end: 1095537, year: "2020" },
  { start: 1095538, end: 1514418, year: "2021" },
  { start: 1514419, end: 1933299, year: "2022" },
  { start: 1933300, end: 2352180, year: "2023" },
  { start: 2352181, end: 2771014, year: "2024" },
  { start: 2771015, end: Infinity, year: "2025" },
];

type PrivacySetVisualizationChartProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

type Props = {
  chartRef: RefObject<HTMLDivElement | null>;
};

function PrivacySetVisualizationChart({ chartRef }: Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fontSize = useResponsiveFontSize();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(DATA_URL.txsummaryUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw: TransactionSummaryDatum[] = await res.json();

        const yearlyMap = new Map<
          string,
          { sapling: number; orchard: number }
        >();

        raw.forEach(({ height, sapling, orchard }) => {
          const year =
            HEIGHT_YEAR_MAP.find((r) => height >= r.start && height <= r.end)
              ?.year || "Unknown";
          if (!yearlyMap.has(year)) {
            yearlyMap.set(year, { sapling: 0, orchard: 0 });
          }
          const entry = yearlyMap.get(year)!;
          entry.sapling += sapling;
          entry.orchard += orchard;
        });

        const yearlyData = Array.from(yearlyMap.entries())
          .map(([year, counts]) => ({
            year,
            sapling: counts.sapling,
            orchard: counts.orchard,
          }))
          .sort((a, b) => a.year.localeCompare(b.year));

        setData(yearlyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ErrorBoundary fallback="Failed to load privacy set chart">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mt-12 mb-4">
          Shielded Transactions by Year
        </h3>

        <ChartContainer ref={chartRef} loading={false}>
          {loading ? (
            <div className="h-[400px] flex items-center justify-center bg-white dark:bg-slate-900 rounded-md animate-pulse border border-dashed border-slate-300 dark:border-slate-700">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Preparing chart data...
              </div>
            </div>
          ) : error ? (
            <div className="h-[400px] flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/10 rounded-md border border-red-200 dark:border-red-800 text-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 mb-3 text-red-400 dark:text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Something went wrong
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {error}
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="year" tick={{ fontSize, fill: "#94a3b8" }} />
                <YAxis
                  tick={{ fontSize, fill: "#94a3b8" }}
                  tickFormatter={(v) =>
                    v >= 1_000_000
                      ? `${Math.round(v / 1_000_000)}M`
                      : v >= 1_000
                      ? `${Math.round(v / 1_000)}k`
                      : v
                  }
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;

                    return (
                      <div
                        className="rounded-md px-3 py-2 shadow-sm border text-sm"
                        style={{
                          backgroundColor: "#1e293b", // slate-800
                          borderColor: "#334155", // slate-700
                          color: "#f1f5f9", // slate-100
                        }}
                      >
                        <p style={{ color: "#38bdf8", marginBottom: "4px" }}>
                          Year: {label}
                        </p>
                        {payload.map((entry, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "1.5rem",
                              color: entry.color,
                            }}
                          >
                            <span>{entry.name}</span>
                            <span style={{ color: "#f8fafc" }}>
                              {entry.value?.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                  cursor={{ fill: "transparent" }}
                />

                <Legend
                  verticalAlign="bottom"
                  align="center"
                  content={({ payload }) => (
                    <div className="flex justify-center gap-6 mt-6 text-sm text-slate-600 dark:text-slate-300">
                      {payload?.map((entry, index) => (
                        <div
                          key={`legend-${index}`}
                          className="flex items-center gap-2"
                        >
                          <span
                            className="w-3 h-3 inline-block rounded-sm"
                            style={{ background: entry.color }}
                          />
                          <p>{entry.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                />
                <Bar
                  dataKey="sapling"
                  name="Sapling"
                  fill="hsl(var(--chart-2))"
                  stackId="tx"
                />
                <Bar
                  dataKey="orchard"
                  name="Orchard"
                  fill="hsl(var(--chart-3))"
                  stackId="tx"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </div>
    </ErrorBoundary>
  );
}

export default PrivacySetVisualizationChart;
