import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { getNetworkSolpsData } from "@/lib/chart/helpers";
import { NetworkSolps } from "@/lib/chart/types";
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

type NetworkSolpsChartProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

export default function NetworkSolpsChart(props: NetworkSolpsChartProps) {
  const [networkSolps, setNetworkSolps] = useState<NetworkSolps[]>([]);
  const [loading, setLoading] = useState(false);
  const fontSize = useResponsiveFontSize(); // optional: pass min/max

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [networkSolpsData] = await Promise.all([
          getNetworkSolpsData(DATA_URL.networkSolpsUrl, controller.signal),
        ]);

        if (networkSolpsData) {
          setNetworkSolps(networkSolpsData);
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
    return networkSolps.map((d) => ({
      date: dateFns.format(
        dateFns.parse(d.Date, "MM/dd/yyyy", new Date()),
        "MMM yyyy"
      ),
      networkSolps: parseFloat(d.Networksolps),
    }));
  }, [networkSolps]);

  return (
    <ErrorBoundary fallback={"Failed to load Network Solps Chart"}>
      <ChartHeader title="Network Solps" />
      <ChartContainer ref={props.chartRef} loading={loading}>
        <AreaChart data={parsedData}>
          <defs>
            <linearGradient id="netSolpsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--chart-17))"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--chart-17))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis dataKey="date" tick={{ fontSize, fill: "#94a3b8" }} />
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
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;

              const { date, block } = payload[0].payload;

              return (
                <div className="rounded-md px-3 py-2 shadow-md border text-sm bg-slate-800 border-slate-700 text-slate-100">
                  <p className="font-semibold">{date}</p>

                  {payload.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between gap-4"
                      style={{ color: entry.color }}
                    >
                      <span>{entry.name}</span>
                      <span className="text-slate-50">{entry.value}</span>
                    </div>
                  ))}
                </div>
              );
            }}
            formatter={(value: any) =>
              typeof value === "number" ? value.toLocaleString() : value
            }
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
                  <p>Network Solps</p>
                </div>
              </div>
            )}
          />
          <Area
            type="monotone"
            dataKey="networkSolps"
            name="Network Solps"
            stroke="hsl(var(--chart-17))"
            fillOpacity={1}
            fill="url(#netSolpsGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </ErrorBoundary>
  );
}
