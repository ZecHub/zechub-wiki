import DefaultSelect from "@/components/DefaultSelect";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useLanguage } from "@/context/LanguageContext";
import { useInMobile } from "@/hooks/useInMobile";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { getMiningPoolsDominance } from "@/lib/chart/helpers";
import { MiningPoolDominanceResponse } from "@/lib/chart/types";
import * as dateFns from "date-fns";
import { RefObject, useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import ChartContainer from "./ChartContainer";

type MiningPoolsDominanceChartProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

type MiningRange = "1w" | "1m" | "3m" | "6m" | "1y" | "all";

const RANGE_OPTIONS: MiningRange[] = ["1w", "1m", "3m", "6m", "1y", "all"];
const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

export default function MiningPoolsDominanceChart(
  props: MiningPoolsDominanceChartProps
) {
  const { t } = useLanguage();
  const miningT = t?.pages?.dashboard?.charts?.miningPoolsChart;
  const fontSize = useResponsiveFontSize();
  const isMobile = useInMobile();
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<MiningRange>("3m");
  const [dominance, setDominance] = useState<MiningPoolDominanceResponse | null>(
    null
  );

  useEffect(() => {
    const controller = new AbortController();

    const fetchDominance = async () => {
      setLoading(true);
      try {
        const data = await getMiningPoolsDominance(
          DATA_URL.miningPoolsDominanceUrl,
          range,
          controller.signal
        );
        setDominance(data);
      } catch (err) {
        console.error("Error fetching mining pools dominance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDominance();
    return () => controller.abort();
  }, [range]);

  const { chartData, seriesKeys } = useMemo(() => {
    const buckets = [...(dominance?.buckets ?? [])].sort(
      (a, b) => a.timestamp - b.timestamp
    );
    if (!buckets.length) return { chartData: [], seriesKeys: [] as string[] };

    const totalsByPool = new Map<string, number>();
    for (const bucket of buckets) {
      for (const pool of bucket.pools) {
        const name = pool.pool_name ?? "Unknown";
        totalsByPool.set(name, (totalsByPool.get(name) ?? 0) + pool.block_count);
      }
    }

    const topPoolLimit = isMobile ? 3 : 5;
    const topPools = [...totalsByPool.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, topPoolLimit)
      .map(([name]) => name);

    const rows = buckets.map((bucket) => {
      const date = new Date(bucket.timestamp * 1000);
      const row: Record<string, number | string> = {
        dateKey: dateFns.format(date, "yyyy-MM-dd"),
      };
      let topTotal = 0;

      for (const poolName of topPools) {
        const share =
          bucket.pools.find((pool) => (pool.pool_name ?? "Unknown") === poolName)
            ?.share_percentage ?? 0;
        row[poolName] = Number(share.toFixed(2));
        topTotal += share;
      }

      row.Other = Number(Math.max(0, 100 - topTotal).toFixed(2));
      return row;
    });

    return { chartData: rows, seriesKeys: [...topPools, "Other"] };
  }, [dominance, isMobile]);

  const xTickFormatter = (value: string) => {
    const date = new Date(`${value}T00:00:00Z`);
    if (range === "1w") return dateFns.format(date, "MMM d");
    if (range === "1m") return dateFns.format(date, "MMM d");
    if (range === "all") return dateFns.format(date, "yyyy");
    return isMobile ? dateFns.format(date, "MMM yy") : dateFns.format(date, "MMM yyyy");
  };

  return (
    <ErrorBoundary fallback={miningT?.loadError || "Failed to load Mining Pools"}>
      <div className="space-y-3 mt-12 mb-6">
        <h3 className="md:text-lg text-md font-semibold">
          {miningT?.title || "Mining Pool Dominance"}
        </h3>
        <div className="w-full flex justify-end pr-5">
          <div className="inline-flex items-center gap-2 rounded-md">
          <label className="text-sm font-medium">
            {miningT?.rangeLabel || "Range"}
          </label>
          <DefaultSelect
            value={range}
            onChange={(v) => setRange(v as MiningRange)}
            options={RANGE_OPTIONS}
            className="w-20 sm:w-24 dark:border-slate-700"
            renderOption={(option) => option}
            ariaLabel={miningT?.rangeAriaLabel || "Select mining range"}
          />
          </div>
        </div>
      </div>
      <ChartContainer ref={props.chartRef} loading={loading}>
        <AreaChart
          data={chartData}
          margin={{ top: 12, right: 10, left: 10, bottom: isMobile ? 58 : 34 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis
            dataKey="dateKey"
            type="category"
            allowDuplicatedCategory={false}
            tickFormatter={(value) => xTickFormatter(String(value))}
            tick={{ fontSize, fill: "#94a3b8" }}
            tickCount={isMobile ? 4 : 6}
            minTickGap={isMobile ? 24 : 36}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(v) => `${Math.round(Number(v))}%`}
            allowDecimals={false}
            tick={{ fontSize, fill: "#94a3b8" }}
            width={56}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              `${Number(value).toFixed(2)}%`,
              name,
            ]}
            labelFormatter={(value) =>
              dateFns.format(new Date(`${String(value)}T00:00:00Z`), "PPP")
            }
            itemSorter={(item) => -Number(item.value)}
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              color: "#f1f5f9",
              borderRadius: 8,
            }}
          />
          {seriesKeys.map((key, idx) => (
            <Area
              key={key}
              type="linear"
              dataKey={key}
              stackId="dominance"
              stroke={COLORS[idx % COLORS.length]}
              fill={COLORS[idx % COLORS.length]}
              fillOpacity={0.78}
              name={key}
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
          ))}
        </AreaChart>
      </ChartContainer>
      {!loading && chartData.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-slate-600 dark:text-slate-300">
          {seriesKeys.map((key, idx) => (
            <div key={key} className="flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <span>{key}</span>
            </div>
          ))}
        </div>
      )}
      {!loading && !chartData.length && (
        <p className="text-sm text-slate-500 mt-2">
          {miningT?.noData || "No mining pool data available."}
        </p>
      )}
    </ErrorBoundary>
  );
}
