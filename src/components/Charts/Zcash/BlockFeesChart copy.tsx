import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { getBlockFeesData } from "@/lib/chart/helpers";
import { BlockFees } from "@/lib/chart/types";
import * as dateFns from "date-fns";
import { RefObject, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartContainer from "./ChartContainer";
import ChartHeader from "../ChartHeader";

type BlockFeesChartProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

export default function BlockFeesChart(props: BlockFeesChartProps) {
  const [blockFees, setBlockFees] = useState<BlockFees[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({
    fees: true,
    txCount: true,
  });
  const fontSize = useResponsiveFontSize();

  const toggleSeries = (key: string) => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [blockFeesData] = await Promise.all([
          getBlockFeesData(DATA_URL.blockFeesUrl, controller.signal),
        ]);

        if (blockFeesData) {
          setBlockFees(blockFeesData);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    return () => {
      controller.abort();
    };
  }, []);

  // Extract available years from the data
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    blockFees.forEach((d) => {
      if (d.Date) {
        try {
          const year = dateFns.format(new Date(d.Date), "yyyy");
          years.add(year);
        } catch (err) {
          console.error("Error parsing date:", d.Date);
        }
      }
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a)); // Sort descending
  }, [blockFees]);

  const parsedData = useMemo(() => {
    let filtered = blockFees;

    // Filter by year if a specific year is selected
    if (selectedYear !== "all") {
      filtered = blockFees.filter((d) => {
        if (!d.Date) return false;
        try {
          const year = dateFns.format(new Date(d.Date), "yyyy");
          return year === selectedYear;
        } catch (err) {
          return false;
        }
      });
    }

    return filtered.map((d) => ({
      block: d.Block,
      fees: parseFloat(d.Fees),
      date: d.Date,
      // txCount: d.TxCount,
    }));
  }, [blockFees, selectedYear]);

  return (
    <ErrorBoundary fallback={"Failed to load Block Fees Chart"}>
      <div className="flex items-center justify-between mb-4">
        <ChartHeader title="Block Fees" />

        {/* Year Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="year-filter"
            className="text-sm text-slate-600 dark:text-slate-300"
          >
            Filter by Year:
          </label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ChartContainer ref={props.chartRef} loading={loading}>
        <AreaChart data={parsedData}>
          <defs>
            <linearGradient id="blockFeesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--chart-4))"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--chart-4))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis dataKey="block" tick={{ fontSize, fill: "#94a3b8" }} />
          <YAxis
            yAxisId="fees"
            hide={!visibleSeries.fees}
            tickFormatter={(v) =>
              v >= 1_000_000
                ? `${v / 1_000_000}M`
                : v >= 1_000
                  ? `${v / 1_000}K`
                  : v
            }
            tick={{ fontSize, fill: "#94a3b8" }}
            width={60}
          />
          <YAxis
            yAxisId="txCount"
            orientation="right"
            hide={!visibleSeries.txCount}
            tickFormatter={(v) =>
              v >= 1_000_000
                ? `${v / 1_000_000}M`
                : v >= 1_000
                  ? `${v / 1_000}K`
                  : v
            }
            tick={{ fontSize, fill: "#94a3b8" }}
            width={60}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;

              const { date, block } = payload[0].payload;

              return (
                <div className="rounded-md px-3 py-2 shadow-md border text-sm bg-slate-800 border-slate-700 text-slate-100">
                  <p className="font-semibold">{block}</p>
                  <p className="text-xs text-slate-400 mb-2">{date}</p>

                  {payload.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between gap-4"
                      style={{ color: entry.color }}
                    >
                      <span>{entry.name}</span>
                      <span className="text-slate-50">
                        {entry.name === "Fees"
                          ? `${entry.value} ZEC`
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
                {[
                  {
                    key: "fees",
                    label: "Block Fees",
                    color: "hsl(var(--chart-4))",
                  },
                  {
                    key: "txCount",
                    label: "Tx Count",
                    color: "hsl(var(--chart-2))",
                  },
                ].map(({ key, label, color }) => (
                  <button
                    key={key}
                    onClick={() => toggleSeries(key)}
                    className="flex items-center gap-2 cursor-pointer select-none transition-opacity"
                    style={{ opacity: visibleSeries[key] ? 1 : 0.35 }}
                  >
                    <span
                      className="w-3 h-3 inline-block rounded-sm"
                      style={{ background: color }}
                    />
                    <p>{label}</p>
                  </button>
                ))}
              </div>
            )}
          />
          {visibleSeries.fees && (
            <Area
              yAxisId="fees"
              type="monotone"
              dataKey="fees"
              name="Fees"
              stroke="hsl(var(--chart-4))"
              fillOpacity={1}
              fill="url(#blockFeesGradient)"
              strokeWidth={2}
            />
          )}
          {visibleSeries.txCount && (
            <Line
              yAxisId="txCount"
              type="monotone"
              dataKey="txCount"
              name="Tx Count"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
            />
          )}
        </AreaChart>
      </ChartContainer>
    </ErrorBoundary>
  );
}
