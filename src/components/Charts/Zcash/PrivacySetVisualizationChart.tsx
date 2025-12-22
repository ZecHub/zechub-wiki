// "use client";

import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { RefObject, useEffect, useState } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartHeader from "../ChartHeader";
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

type YearlyTotals = Record<string, { sapling: number; orchard: number }>;

function PrivacySetVisualizationChart({
  chartRef,
}: PrivacySetVisualizationChartProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<YearlyTotals>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"bubble" | "linear">("linear");
  const [targetPool, setTargetPool] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mouseEnter, setMouseEnter] = useState(false);
  const fontSize = useResponsiveFontSize();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(DATA_URL.txsummaryUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw: TransactionSummaryDatum[] = await res.json();

        const totals: YearlyTotals = {};
        for (const { height, sapling, orchard } of raw) {
          const year =
            HEIGHT_YEAR_MAP.find((r) => height >= r.start && height <= r.end)
              ?.year || "Unknown";
          if (!totals[year]) totals[year] = { sapling: 0, orchard: 0 };
          totals[year].sapling += sapling;
          totals[year].orchard += orchard;
        }

        setData(totals);

        // Prepare data for linear chart
        const years = Object.keys(totals).sort();
        let saplingSum = 0;
        let orchardSum = 0;

        const formatted = years.map((year) => {
          saplingSum += totals[year].sapling;
          orchardSum += totals[year].orchard;
          return {
            year,
            sapling: saplingSum,
            orchard: orchardSum,
          };
        });

        setChartData(formatted);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const years = Object.keys(data).sort();

  const getCumulative = (pool: "sapling" | "orchard"): [string, number][] => {
    let sum = 0;
    return years.map((y) => {
      sum += data[y]?.[pool] || 0;
      return [y, sum];
    });
  };

  const formatVal = (v: number) =>
    v >= 1e6
      ? `${(v / 1e6).toFixed(1)}M`
      : v >= 1e3
      ? `${(v / 1e3).toFixed(1)}k`
      : `${v}`;

  const saplingData = getCumulative("sapling");
  const orchardData = getCumulative("orchard");

  const maxRadius = 180;
  const minRadius = 30;

  const sapStep = (maxRadius - minRadius) / Math.max(1, saplingData.length - 1);
  const orcStep = (maxRadius - minRadius) / Math.max(1, orchardData.length - 1);

  const renderCluster = (
    pool: "sapling" | "orchard",
    data: [string, number][],
    cx: number,
    color: string,
    step: number
  ) =>
    data.map(([year, value], index) => {
      const id = `${pool}-${year}`;
      const isHovered = hoveredId === id;
      const r = minRadius + step * index;
      const fillOpacity = isHovered ? 0.35 : 0.2;
      const strokeWidth = isHovered ? 3 : 2;

      return (
        <g
          key={id}
          transform={`translate(${cx}, 300)`}
          style={{ cursor: "pointer" }}
          onMouseEnter={() => {
            setHoveredId(id);
            setMouseEnter(true);
            setTargetPool(pool);
          }}
          onMouseLeave={() => {
            setHoveredId(null);
            setMouseEnter(false);
            setTargetPool("");
          }}
          pointerEvents="visibleStroke"
        >
          <circle
            r={r}
            fill={color}
            stroke={color}
            fillOpacity={fillOpacity}
            strokeWidth={
              mouseEnter && targetPool === "sapling" ? 3 : strokeWidth
            }
            className="transition-all duration-150"
          />
          <text
            x1={0}
            y={-r - 10}
            textAnchor="middle"
            fontSize={12}
            fill="#0f172a"
            className="dark:fill-slate-100 hover:text-sm"
          >
            {year}
          </text>
          <text
            x={0}
            y={r + 20}
            textAnchor="middle"
            fontSize={12}
            fill="#475569"
            className="dark:fill-slate-300 hover:text-sm"
          >
            {formatVal(value)}
          </text>
        </g>
      );
    });

  return (
    <ErrorBoundary fallback="Failed to load privacy set chart">
      <div className="flex items-center justify-between mb-4">
        <div>
          <ChartHeader title="Shielded Outputs by Year" />
          <p className="dark:text-slate-400 mt-[-20] mb-4 text-sm font-light">
            Total number of fully shielded outputs collected in each pool over
            time
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("linear")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "linear"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            Linear
          </button>
          <button
            onClick={() => setViewMode("bubble")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "bubble"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            Bubble
          </button>
        </div>
      </div>

      <ChartContainer ref={chartRef} loading={loading}>
        {viewMode === "linear" ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis dataKey="year" tick={{ fontSize, fill: "#94a3b8" }} />
            <YAxis
              tickFormatter={(v) =>
                v >= 1_000_000_000_000
                  ? `${(v / 1_000_000_000_000).toFixed(1)}T`
                  : v >= 1_000_000_000
                  ? `${(v / 1_000_000_000).toFixed(1)}B`
                  : v >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(1)}M`
                  : v >= 1_000
                  ? `${(v / 1_000).toFixed(1)}K`
                  : v
              }
              tick={{ fontSize, fill: "#94a3b8" }}
              width={60}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;

                return (
                  <div className="rounded-md px-3 py-2 shadow-md border text-sm bg-slate-800 border-slate-700 text-slate-100">
                    <p className="font-semibold mb-1">
                      {payload[0].payload.year}
                    </p>
                    {payload.map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between gap-4"
                        style={{ color: entry.color }}
                      >
                        <span>{entry.name}</span>
                        <span className="text-slate-50">
                          {typeof entry.value === "number"
                            ? entry.value.toLocaleString()
                            : entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                );
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
                      style={{ background: "hsl(var(--chart-2))" }}
                    />
                    <p>Sapling Pool</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 inline-block rounded-sm"
                      style={{ background: "hsl(var(--chart-3))" }}
                    />
                    <p>Orchard Pool</p>
                  </div>
                </div>
              )}
            />
            <Line
              type="monotone"
              dataKey="sapling"
              name="Sapling Pool"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="orchard"
              name="Orchard Pool"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        ) : (
          <div className="relative w-full">
            <div className="w-full max-w-[1200px] mx-auto px-4">
              <svg
                viewBox="0 0 1000 600"
                preserveAspectRatio="xMidYMid slice"
                className="w-full h-[480]"
                role="img"
              >
                {renderCluster(
                  "sapling",
                  saplingData,
                  0.3 * 1000,
                  "hsl(var(--chart-2))",
                  sapStep
                )}
                {renderCluster(
                  "orchard",
                  orchardData,
                  0.7 * 1000,
                  "hsl(var(--chart-3))",
                  orcStep
                )}
              </svg>

              <div className="flex justify-center gap-6 md:mt-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 inline-block rounded-sm"
                    style={{ background: "hsl(var(--chart-2))" }}
                  />
                  <p>Sapling Pool</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 inline-block rounded-sm"
                    style={{ background: "hsl(var(--chart-3))" }}
                  />
                  <p>Orchard Pool</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </ChartContainer>
    </ErrorBoundary>
  );
}

export default PrivacySetVisualizationChart;
