import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
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
import ChartContainer from "../ChartContainer";
import ChartHeader from "../../ChartHeader";
import { getTotalSupplyData } from "@/lib/chart/helpers";
import { totalSupply } from "@/lib/chart/types";

type TotalSupplyChartProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

export default function TotalSupplyChart(props: TotalSupplyChartProps) {
  const [totalSupply, setTotalSupply] = useState<totalSupply[]>([]);
  const [loading, setLoading] = useState(false);
  const fontSize = useResponsiveFontSize(); // optional: pass min/max

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [totalSupplyData] = await Promise.all([
          getTotalSupplyData(DATA_URL.totalSupplyUrl, controller.signal),
        ]);

        if (totalSupplyData) {
          setTotalSupply(totalSupplyData);
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
    return totalSupply.map((d) => ({
      date: dateFns.format(
        dateFns.parse(d.close, "MM/dd/yyyy", new Date()),
        "MMM yyyy"
      ),
      "Total Supply": parseFloat(d.supply),
    }));
  }, [totalSupply]);

  return (
    <ErrorBoundary fallback={"Failed to load Total Supply Chart"}>
      <ChartHeader title="Total Supply" />
      <ChartContainer ref={props.chartRef} loading={loading}>
        <AreaChart data={parsedData}>
          <defs>
            <linearGradient id="diffGradient" x1="0" y1="0" x2="0" y2="1">
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
          <XAxis dataKey="date" tick={{ fontSize, fill: "#94a3b8" }} />
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
                  <p>Total Supply</p>
                </div>
              </div>
            )}
          />
          <Area
            type="monotone"
            dataKey="Total Supply"
            stroke="hsl(var(--chart-4))"
            fillOpacity={1}
            fill="url(#diffGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </ErrorBoundary>
  );
}