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
  const fontSize = useResponsiveFontSize(); // optional: pass min/max

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

  const parsedData = useMemo(() => {
    return blockFees.map((d) => ({
      block: d.Block,
      fees: parseFloat(d.Fees),
    }));
  }, [blockFees]);

  console.log(parsedData);

  return (
    <ErrorBoundary fallback={"Failed to load Block Fees Chart"}>
      <ChartHeader title="Block Fees" />
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

              return (
                <div
                  className="rounded-md px-3 py-2 shadow-md border text-sm"
                  style={{
                    backgroundColor: "#1e293b", // dark bg
                    borderColor: "#334155",
                    color: "#f1f5f9", // default text
                  }}
                >
                  <p className="text-slate-100 font-semibold mb-2">{label}</p>
                  {payload.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between gap-4"
                      style={{ color: entry.color }}
                    >
                      <span>{entry.name}</span>
                      <span className="text-slate-50">{entry.value} ZEC</span>
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
                    style={{ background: "#3b82f6" }}
                  />
                  <p>Block Fees</p>
                </div>
              </div>
            )}
          />
          <Area
            type="monotone"
            dataKey="fees"
            stroke="hsl(var(--chart-4))"
            fillOpacity={1}
            fill="url(#blockFeesGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </ErrorBoundary>
  );
}
