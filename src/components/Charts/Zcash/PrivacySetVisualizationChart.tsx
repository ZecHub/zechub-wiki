// "use client";

import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { DATA_URL } from "@/lib/chart/data-url";
import { RefObject, useEffect, useState } from "react";
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
  const [targetPool, setTargetPool] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mouseEnter, setMouseEnter] = useState(false);

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
      <div className="space-y-6 mt-12">
        <h3 className="text-lg font-semibold">Shielded Outputs by Year</h3>
        <text fill="#334155" className="dark:text-slate-300 font-light">
          Total number of fully shielded outputs collected in each pool over
          time
        </text>

        <ChartContainer ref={chartRef} loading={loading}>
          <div className="relative w-full">
            <div className="w-full max-w-[1200px] mx-auto px-4">
              {/* Chart */}
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

              {/* Legend */}
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
        </ChartContainer>

        
      </div>
    </ErrorBoundary>
  );
}

export default PrivacySetVisualizationChart;
