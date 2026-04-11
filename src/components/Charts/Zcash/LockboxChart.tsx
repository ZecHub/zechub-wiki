import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { getLockboxData } from "@/lib/chart/helpers";
import { LockBox } from "@/lib/chart/types";
import { RefObject, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartHeader from "../ChartHeader";
import ChartContainer from "./ChartContainer";

type LockboxChartProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

export default function LockboxChart(props: LockboxChartProps) {
  const [loading, setLoading] = useState(false);
  const [lockboxData, setLockboxData] = useState<LockBox[]>([]);
  const [processedData, setProcessedData] = useState<LockBox[]>([]);
  const [copied, setCopied] = useState(false);
  const fontSize = useResponsiveFontSize();

  // Toggle visibility for each series
  const [lockboxVisible, setLockboxVisible] = useState(true);
  const [coinholdersVisible, setCoinholdersVisible] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [rawData] = await Promise.all([
          getLockboxData(DATA_URL.lockboxUrl, controller.signal),
        ]);

        if (rawData) {
          setLockboxData(rawData);

          const sorted = [...rawData].sort(
            (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime(),
          );

          const cleanedData = Array.from(
            new Map(sorted.map((item) => [item.Date, item])).values(),
          );

          const MAX_POINTS = 1200;
          const step = Math.max(1, Math.floor(cleanedData.length / MAX_POINTS));
          const sampled = cleanedData.filter((_, index) => index % step === 0);

          setProcessedData(sampled);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    return () => controller.abort();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-sm flex items-center gap-2"
              style={{ color: entry.color }}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium">
                {entry.dataKey === "lockbox" ? "Lockbox" : "Coinholders Fund"}:
              </span>
              <span className="font-semibold">
                {entry.value.toLocaleString()}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const latestData = processedData[processedData.length - 1];
  const lockboxTotal = latestData?.lockbox || 0;
  const coinholdersTotal = latestData?.coinholders_fund || 0;
  const grandTotal = lockboxTotal + coinholdersTotal;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(
        "t3ev37Q2uL1sfTsiJQJiWJoFzQpDhmnUwYo",
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  return (
    <ErrorBoundary fallback={"Failed to load Lockbox Chart"}>
      <ChartHeader title="Lockbox Activity" />

      {/* Coinholder Fund Address */}
      <div
        onClick={handleCopyAddress}
        className="px-4 py-2 mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Coinholder Fund Address:
            </p>
            <p className="text-sm font-mono text-slate-700 dark:text-slate-300 break-all">
              t3ev37Q2uL1sfTsiJQJiWJoFzQpDhmnUwYo
            </p>
          </div>
          <div className="ml-3 flex-shrink-0">
            {copied ? (
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      <ChartContainer ref={props.chartRef} loading={loading}>
        <AreaChart data={processedData}>
          <defs>
            <linearGradient id="lockboxGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="coinholderGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            strokeOpacity={0.15}
            stroke="#cbd5e1"
          />

          <XAxis
            dataKey="Date"
            tick={{
              fontSize: fontSize * 0.75,
              fill: "#64748b",
              fontWeight: 500,
            }}
            interval={Math.max(1, Math.floor(processedData.length / 10))}
            angle={-45}
            textAnchor="end"
            height={70}
          />

          <YAxis
            tick={{ fontSize, fill: "#64748b", fontWeight: 500 }}
            tickFormatter={(v) => v.toLocaleString()}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Clickable Legend */}
          <Legend
            content={
              <div className="flex justify-center gap-8 text-sm mt-4">
                {/* Lockbox legend item */}
                <button
                  onClick={() => setLockboxVisible(!lockboxVisible)}
                  className={`flex items-center gap-2 cursor-pointer transition-colors ${
                    lockboxVisible ? "" : "opacity-40 line-through"
                  }`}
                >
                  <span className="inline-block w-3 h-3 rounded-full bg-[#3b82f6]" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Lockbox
                  </span>
                </button>

                {/* Coinholders Fund legend item */}
                <button
                  onClick={() => setCoinholdersVisible(!coinholdersVisible)}
                  className={`flex items-center gap-2 cursor-pointer transition-colors ${
                    coinholdersVisible ? "" : "opacity-40 line-through"
                  }`}
                >
                  <span className="inline-block w-3 h-3 rounded-full bg-[#ef4444]" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Coinholders Fund
                  </span>
                </button>
              </div>
            }
          />

          <Area
            type="monotone"
            dataKey="lockbox"
            stroke="#3b82f6"
            fill="url(#lockboxGradient)"
            strokeWidth={2}
            hide={!lockboxVisible}
            name="Lockbox"
          />
          <Area
            type="monotone"
            dataKey="coinholders_fund"
            stroke="#ef4444"
            fill="url(#coinholderGradient)"
            strokeWidth={2}
            hide={!coinholdersVisible}
            name="Coinholders Fund"
          />
        </AreaChart>
      </ChartContainer>

      {/* Totals Section */}
      <div className="grid grid-cols-1 imd:grid-cols-3 gap-4 mt-8">
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            Lockbox Total
          </p>
          <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mt-1">
            {lockboxTotal.toLocaleString()}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-4">
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">
            Coinholders Fund Total
          </p>
          <p className="text-2xl font-semibold text-red-700 dark:text-red-300 mt-1">
            {coinholdersTotal.toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Grand Total
          </p>
          <p className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mt-1">
            {grandTotal.toLocaleString()}
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
}
