import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type TransactionSummaryDatum = {
  height: number;
  sapling: number;
  orchard: number;
};

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

type YearlyTotals = Record<string, { sapling: number; orchard: number }>;

const DATA_URL = {
  txsummaryUrl: "/data/zcash/transaction_summary.json",
};

function PrivacySetVisualizationChart() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<YearlyTotals>({});
  const [viewMode, setViewMode] = useState<"linear" | "circular">("linear");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [targetPool, setTargetPool] = useState("");
  const chartRef = useRef<HTMLDivElement>(null);

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

  // Prepare data for linear chart
  const linearChartData = years.map((year) => {
    const saplingCumulative = saplingData.find(([y]) => y === year)?.[1] || 0;
    const orchardCumulative = orchardData.find(([y]) => y === year)?.[1] || 0;
    return {
      year,
      sapling: saplingCumulative,
      orchard: orchardCumulative,
    };
  });

  // Circular chart rendering
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
            setTargetPool(pool);
          }}
          onMouseLeave={() => {
            setHoveredId(null);
            setTargetPool("");
          }}
          pointerEvents="visibleStroke"
        >
          <circle
            r={r}
            fill={color}
            stroke={color}
            fillOpacity={fillOpacity}
            strokeWidth={targetPool === pool ? 3 : strokeWidth}
            className="transition-all duration-150"
          />
          <text
            x={0}
            y={-r - 10}
            textAnchor="middle"
            fontSize={12}
            fill="#0f172a"
            className="dark:fill-slate-100"
          >
            {year}
          </text>
          <text
            x={0}
            y={r + 20}
            textAnchor="middle"
            fontSize={12}
            fill="#475569"
            className="dark:fill-slate-300"
          >
            {formatVal(value)}
          </text>
        </g>
      );
    });

  if (loading) {
    return (
      <div className="w-full min-h-[480px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[480px] flex items-center justify-center">
        <p className="text-red-500">Error loading data: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-wrap mt-12 mb-6 items-center justify-between">
        <h3 className="md:text-lg text-md font-semibold">
          Shielded Outputs by Year
        </h3>
        <button
          onClick={() => setViewMode(viewMode === "linear" ? "circular" : "linear")}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors text-sm font-medium"
        >
          Switch to {viewMode === "linear" ? "Circular" : "Linear"} View
        </button>
      </div>

      <p className="text-slate-600 dark:text-slate-400 text-sm font-light mb-8">
        Cumulative count of fully shielded outputs in each pool over time
      </p>

      {/* Chart Container */}
      <div ref={chartRef} className="w-full" style={{ minHeight: "480px" }}>
        {viewMode === "linear" ? (
          <ResponsiveContainer width="100%" height={480}>
            <LineChart
              data={linearChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="year"
                tick={{ fill: "#64748b" }}
                label={{ value: "Year", position: "insideBottom", offset: -10 }}
              />
              <YAxis
                tick={{ fill: "#64748b" }}
                tickFormatter={formatVal}
                label={{
                  value: "Cumulative Transaction Count",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              <Tooltip
                formatter={(value: number) => [formatVal(value), ""]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="sapling"
                stroke="hsl(142, 76%, 36%)"
                strokeWidth={2}
                name="Sapling Pool"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="orchard"
                stroke="hsl(262, 83%, 58%)"
                strokeWidth={2}
                name="Orchard Pool"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="relative w-full">
            <div className="w-full max-w-[1200px] mx-auto px-4">
              <svg
                viewBox="0 0 1000 600"
                preserveAspectRatio="xMidYMid meet"
                className="w-full"
                style={{ height: "480px" }}
                role="img"
              >
                {renderCluster(
                  "sapling",
                  saplingData,
                  0.3 * 1000,
                  "hsl(142, 76%, 36%)",
                  sapStep
                )}
                {renderCluster(
                  "orchard",
                  orchardData,
                  0.7 * 1000,
                  "hsl(262, 83%, 58%)",
                  orcStep
                )}
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 inline-block rounded-sm"
            style={{ background: "hsl(142, 76%, 36%)" }}
          />
          <p>Sapling Pool</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 inline-block rounded-sm"
            style={{ background: "hsl(262, 83%, 58%)" }}
          />
          <p>Orchard Pool</p>
        </div>
      </div>
    </div>
  );
}

export default PrivacySetVisualizationChart;