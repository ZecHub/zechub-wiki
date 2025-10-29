"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import RangeSlider from "@/components/RangeSlider";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { fetchTransactionData } from "@/lib/chart/helpers";
import { ShieldedTransactionDatum } from "@/lib/chart/types";
import { RefObject, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
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

const BLOCKS_PERIOD = 8064;
const ORCHARD_ACTIVATION = 1687104;
const MIN_GAP_BTW_SLIDER = 100;

interface TransactionsSummaryChartProps {
  chartRef: RefObject<HTMLDivElement | null>;
}
export default function TransactionsSummaryChart(
  props: TransactionsSummaryChartProps
) {
  const [chartData, setChartData] = useState<ShieldedTransactionDatum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [pool, setPool] = useState<"default" | "orchard" | "sapling">(
    "default"
  );
  const [cumulative, setCumulative] = useState(true);
  const [filter, setFilter] = useState(true);

  const [startHeight, setStartHeight] = useState(0);
  const [endHeight, setEndHeight] = useState(Infinity);
  const [minHeight, setMinHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(Infinity);

  const fontSize = useResponsiveFontSize();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetchTransactionData(DATA_URL.txsummaryUrl)
      .then((data) => {
        setChartData(data);
        const heights = data.map((d) => d.height);

        setMinHeight(Math.min(...heights));
        setMaxHeight(Math.max(...heights));
        setEndHeight(Math.max(...heights));
      })
      .catch(setError)
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const processData = () => {
    let saplingSum = 0;
    let saplingFilterSum = 0;
    let orchardSum = 0;
    let orchardFilterSum = 0;

    const cumData = chartData.map((d) => {
      saplingSum += d.sapling;
      saplingFilterSum += d.sapling_filter;
      orchardSum += d.orchard;
      orchardFilterSum += d.orchard_filter;

      return {
        height: d.height,
        sapling: saplingSum,
        sapling_filter: saplingFilterSum,
        orchard: orchardSum || null,
        orchard_filter: orchardFilterSum || null,
      };
    });

    const last = cumData[cumData.length - 1];

    let filteredData: any[] = [];

    if (cumulative) {
      filteredData = cumData.filter(
        (d) =>
          (d.height >= startHeight &&
            d.height <= endHeight &&
            d.height % BLOCKS_PERIOD === 0) ||
          d.height === last.height
      );
    } else {
      saplingSum = 0;
      saplingFilterSum = 0;
      orchardSum = 0;
      orchardFilterSum = 0;

      chartData.forEach((d) => {
        saplingSum += d.sapling;
        saplingFilterSum += d.sapling_filter;
        orchardSum += d.orchard;
        orchardFilterSum += d.orchard_filter;

        if (
          (d.height >= startHeight &&
            d.height <= endHeight &&
            d.height % BLOCKS_PERIOD === 0) ||
          d.height === last.height
        ) {
          filteredData.push({
            height: d.height,
            sapling: saplingSum,
            sapling_filter: saplingSum - saplingFilterSum,
            orchard: orchardSum || null,
            orchard_filter:
              orchardFilterSum > 0 ? orchardSum - orchardFilterSum : null,
          });

          saplingSum = 0;
          saplingFilterSum = 0;
          orchardSum = 0;
          orchardFilterSum = 0;
        }
      });
    }

    if (pool === "orchard") {
      filteredData = filteredData.filter((d) => d.height >= ORCHARD_ACTIVATION);
    }

    return filteredData;
  };

  const chartDataset = processData();

  const handleStartChange = (val: number) => {
    // Prevent start from meeting or exceeding end
    if (val >= endHeight - MIN_GAP_BTW_SLIDER) {
      setStartHeight(endHeight - MIN_GAP_BTW_SLIDER); // or a safe MIN_GAP
    } else {
      setStartHeight(val);
    }
  };

  const handleEndChange = (val: number) => {
    // Prevent end from meeting or being lower than start
    if (val <= startHeight + MIN_GAP_BTW_SLIDER) {
      setEndHeight(startHeight + MIN_GAP_BTW_SLIDER); // or a safe MIN_GAP
    } else {
      setEndHeight(val);
    }
  };

  return (
    <ErrorBoundary fallback={"Failed to load Transaction Summary Chart"}>
      <ChartHeader title="Transactions Summary">
        {/* Toggle Controls */}
        <div className="flex items-center justify-between gap-6 md:mt-0 mt-4 space-x-8">
          <div className="md:flex flex-1 justify-center items-center gap-4">
            {/* Cumulative View Toggle */}
            <div className="relative group">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={cumulative}
                  onChange={() => setCumulative(!cumulative)}
                  className="accent-sky-600 dark:accent-cyan-400"
                />
                Cumulative
                <div className="relative">
                  <div
                    className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap
                     bg-slate-700 text-white text-xs rounded px-2 py-1
                     opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    Accumulate totals over time
                  </div>
                </div>
              </label>
            </div>

            {/* Filter Spam Toggle */}
            <div className="relative group">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={filter}
                  onChange={() => setFilter(!filter)}
                  className="accent-sky-600 dark:accent-cyan-400"
                />
                Filter Spam
                <div className="relative">
                  <div
                    className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap
                     bg-slate-700 text-white text-xs rounded px-2 py-1
                     opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    Hide known spam transactions
                  </div>
                </div>
              </label>
            </div>
          </div>
          {/* Sliders */}
          <div className="flex justify-center items-center space-x-12">
            <RangeSlider
              value={startHeight}
              onChange={handleStartChange}
              min={minHeight}
              max={maxHeight}
              label="Start Height"
            />

            <RangeSlider
              value={endHeight}
              onChange={handleEndChange}
              min={minHeight}
              max={maxHeight}
              label="End Height"
            />
          </div>
        </div>
      </ChartHeader>

      <ChartContainer ref={props.chartRef} loading={loading}>
        {cumulative ? (
          <AreaChart data={chartDataset}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis
              dataKey="height"
              tick={{ fontSize, fill: "#94a3b8" }}
              tickFormatter={(v) => `#${v}`}
            />
            <YAxis tick={{ fontSize, fill: "#94a3b8" }} />
            <Tooltip />

            <Legend
              verticalAlign="bottom"
              align="center"
              content={({ payload }) => (
                <div className="flex justify-center gap-6 mt-6 text-sm text-slate-600 dark:text-slate-300">
                  {payload?.map((entry, index) => (
                    <div
                      key={`item-${index}`}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="w-3 h-3 inline-block rounded-sm"
                        style={{ background: entry.color }}
                      />
                      <p style={{ color: entry.color }}>{entry.value}</p>
                    </div>
                  ))}
                </div>
              )}
            />

            {(pool === "default" || pool === "sapling") && (
              <>
                {filter && (
                  <Area
                    type="monotone"
                    dataKey="sapling_filter"
                    name="Sapling Filter"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="sapling"
                  name="Sapling"
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.3}
                />
              </>
            )}
            {(pool === "default" || pool === "orchard") && (
              <>
                {filter && (
                  <Area
                    type="monotone"
                    dataKey="orchard_filter"
                    name="Orchard Filter"
                    stroke="#f87171"
                    fill="#f87171"
                    fillOpacity={0.2}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="orchard"
                  name="Orchard"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                />
              </>
            )}
          </AreaChart>
        ) : (
          <BarChart data={chartDataset}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis
              dataKey="height"
              tick={{ fontSize, fill: "#94a3b8" }}
              tickFormatter={(v) => `#${v}`}
            />
            <YAxis tick={{ fontSize, fill: "#94a3b8" }} />
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              align="center"
              content={({ payload }) => (
                <div className="flex justify-center gap-6 mt-6 text-sm text-slate-600 dark:text-slate-300">
                  {payload?.map((entry, index) => (
                    <div
                      key={`item-${index}`}
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

            {(pool === "default" || pool === "sapling") && (
              <>
                {filter && (
                  <Bar
                    dataKey="sapling_filter"
                    name="Sapling Filter"
                    fill="#60a5fa"
                    stackId="stack"
                  />
                )}
                <Bar
                  dataKey="sapling"
                  name="Sapling"
                  fill="#3b82f6"
                  stackId="stack"
                />
              </>
            )}
            {(pool === "default" || pool === "orchard") && (
              <>
                {filter && (
                  <Bar
                    dataKey="orchard_filter"
                    name="Orchard Filter"
                    fill="#fb7185"
                    stackId="stack"
                  />
                )}
                <Bar
                  dataKey="orchard"
                  name="Orchard"
                  fill="#f43f5e"
                  stackId="stack"
                />
              </>
            )}
          </BarChart>
        )}
      </ChartContainer>
    </ErrorBoundary>
  );
}
