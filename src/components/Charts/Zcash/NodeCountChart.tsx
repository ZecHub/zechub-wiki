import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { getNodeCountData } from "@/lib/chart/helpers";
import { NodeCountData } from "@/lib/chart/types";
import { RefObject, useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartHeader from "../ChartHeader";
import ChartContainer from "./ChartContainer";

type NodeCountChartProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

const SERIES = [
  { key: "nodecount", label: "Total", color: "#2563eb" },
  { key: "zebra", label: "Zebra", color: "#16a34a" },
  { key: "zcashd", label: "zcashd", color: "#dc2626" },
  { key: "other", label: "Other", color: "#a855f7" },
] as const;

type SeriesKey = (typeof SERIES)[number]["key"];

/** Row with the numeric fields parsed, so recharts plots numbers not strings. */
type ParsedRow = {
  Date: string;
  nodecount: number;
  zebra?: number;
  zcashd?: number;
  other?: number;
};

function parseCount(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * The census rows are weekly and ISO-prefixed (`11/17/2024`), which `new Date`
 * reads as month/day/year. Sort on that, not on the string, so `10/01` lands
 * after `09/28` instead of after `01/10`.
 */
function rowTime(date: string): number {
  const parts = date.split("/").map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return 0;
  const [month, day, year] = parts;
  return Date.UTC(year, month - 1, day);
}

export default function NodeCountChart(props: NodeCountChartProps) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const fontSize = useResponsiveFontSize();
  const [hidden, setHidden] = useState<Record<SeriesKey, boolean>>({
    nodecount: false,
    zebra: false,
    zcashd: false,
    other: false,
  });

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      try {
        const raw = await getNodeCountData(DATA_URL.nodecountUrl, controller.signal);

        const cleaned = raw
          .filter((row) => row && typeof row.Date === "string" && row.Date.length > 0)
          .map((row: NodeCountData) => ({
            Date: row.Date,
            nodecount: parseCount(row.nodecount) ?? 0,
            zebra: parseCount(row.zebra),
            zcashd: parseCount(row.zcashd),
            other: parseCount(row.other),
          }))
          .sort((a, b) => rowTime(a.Date) - rowTime(b.Date));

        // A re-run of the same week must not draw two points on one date.
        const deduped = Array.from(
          new Map(cleaned.map((row) => [row.Date, row])).values(),
        );

        const MAX_POINTS = 1200;
        const step = Math.max(1, Math.floor(deduped.length / MAX_POINTS));
        setRows(deduped.filter((_, index) => index % step === 0));
      } catch (err) {
        console.error("Error fetching node count data:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  // Only offer a breakdown series once the crawler has actually recorded one.
  // Older rows have no breakdown, and a legend entry that never plots is worse
  // than no entry.
  const breakdownAvailable = useMemo(
    () =>
      (["zebra", "zcashd", "other"] as const).some((key) =>
        rows.some((row) => row[key] !== undefined),
      ),
    [rows],
  );

  const visibleSeries = useMemo(
    () => SERIES.filter((s) => s.key === "nodecount" || breakdownAvailable),
    [breakdownAvailable],
  );

  const latest = rows[rows.length - 1];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{label}</p>
        {payload.map((entry: any) => (
          <p
            key={entry.dataKey}
            className="text-sm flex items-center gap-2"
            style={{ color: entry.color }}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium">{entry.name}:</span>
            <span className="font-semibold">{entry.value?.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  };

  return (
    <ErrorBoundary fallback={"Failed to load Node Count chart"}>
      <ChartHeader title="Node Count" />

      <p className="px-4 mb-6 text-xs text-slate-500 dark:text-slate-400">
        Reachable mainnet nodes that answered a handshake from the crawler, by
        implementation. Nodes behind NAT, firewalled, or refusing the crawler&apos;s
        address are not counted — this is a floor, not the network size.
      </p>

      <ChartContainer ref={props.chartRef} loading={loading}>
        <LineChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} stroke="#cbd5e1" />
          <XAxis
            dataKey="Date"
            tick={{ fontSize: fontSize * 0.75, fill: "#64748b", fontWeight: 500 }}
            interval={Math.max(1, Math.floor(rows.length / 10))}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis
            tick={{ fontSize, fill: "#64748b", fontWeight: 500 }}
            tickFormatter={(v) => v.toLocaleString()}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            content={
              <div className="flex flex-wrap justify-center gap-6 text-sm mt-4">
                {visibleSeries.map((series) => (
                  <button
                    key={series.key}
                    onClick={() =>
                      setHidden((prev) => ({ ...prev, [series.key]: !prev[series.key] }))
                    }
                    className={`flex items-center gap-2 cursor-pointer transition-colors ${
                      hidden[series.key] ? "opacity-40 line-through" : ""
                    }`}
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: series.color }}
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {series.label}
                    </span>
                  </button>
                ))}
              </div>
            }
          />
          {visibleSeries.map((series) => (
            <Line
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.label}
              stroke={series.color}
              strokeWidth={2}
              dot={false}
              hide={hidden[series.key]}
              // Break the line where a series was not recorded rather than
              // drawing it through the axis at zero.
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ChartContainer>

      {latest && (
        <div className="grid grid-cols-2 imd:grid-cols-4 gap-4 mt-8">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total</p>
            <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mt-1">
              {latest.nodecount.toLocaleString()}
            </p>
          </div>
          {breakdownAvailable &&
            (["zebra", "zcashd", "other"] as const).map((key) => (
              <div
                key={key}
                className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4"
              >
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium capitalize">
                  {key}
                </p>
                <p className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  {latest[key]?.toLocaleString() ?? "—"}
                </p>
              </div>
            ))}
        </div>
      )}

      {latest && (
        <p className="px-4 mt-3 text-xs text-slate-400 dark:text-slate-500">
          Latest census: {latest.Date}
        </p>
      )}
    </ErrorBoundary>
  );
}