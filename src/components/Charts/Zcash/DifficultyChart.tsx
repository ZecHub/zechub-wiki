import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useLanguage } from "@/context/LanguageContext";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { getDifficultyData } from "@/lib/chart/helpers";
import { Difficulty } from "@/lib/chart/types";
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

type DifficultyChartProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

export default function DifficultyChart(props: DifficultyChartProps) {
  const { t } = useLanguage();
  const difficultyT = t?.pages?.dashboard?.charts?.difficultyChart;
  const [difficulty, setDifficulty] = useState<Difficulty[]>([]);
  const [loading, setLoading] = useState(false);
  const fontSize = useResponsiveFontSize(); // optional: pass min/max

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [difficultyData] = await Promise.all([
          getDifficultyData(DATA_URL.difficultyUrl, controller.signal),
        ]);

        if (difficultyData) {
          setDifficulty(difficultyData);
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
    return difficulty.map((d) => ({
      date: dateFns.format(
        dateFns.parse(d.Date, "MM/dd/yyyy", new Date()),
        "MMM yyyy",
      ),
      difficulty: parseFloat(d.Difficulty),
    }));
  }, [difficulty]);

  const formatVal = (v: number) =>
    v >= 1e6
      ? `${(v / 1e6).toFixed(1)}M`
      : v >= 1e3
        ? `${(v / 1e3).toFixed(1)}k`
        : `${v}`;

  return (
    <ErrorBoundary
      fallback={difficultyT?.loadError || "Failed to load Difficulty Chart"}
    >
      <ChartHeader
        title={difficultyT?.title || "Mining Difficulty Over Time"}
      />
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
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;

              const { date } = payload[0].payload;

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
                      <span className="text-slate-50">
                        {formatVal(entry.value)}
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
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 inline-block rounded-sm"
                    style={{ background: "#3b82f6" }}
                  />
                  <p>{difficultyT?.legend || "Difficulty"}</p>
                </div>
              </div>
            )}
          />
          <Area
            type="monotone"
            dataKey="difficulty"
            stroke="hsl(var(--chart-4))"
            fillOpacity={1}
            fill="url(#diffGradient)"
            strokeWidth={2}
            name={difficultyT?.seriesName || "Difficulty"}
          />
        </AreaChart>
      </ChartContainer>
    </ErrorBoundary>
  );
}
