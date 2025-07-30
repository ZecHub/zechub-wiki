import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { getDifficultyData } from "@/lib/chart/helpers";
import { Difficulty } from "@/lib/chart/types";
import * as dateFns from "date-fns";
import { Spinner } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DifficultyChartProps = {};

export default function DifficultyChart(props: DifficultyChartProps) {
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
        "MMM yyyy"
      ),
      difficulty: parseFloat(d.Difficulty),
    }));
  }, [difficulty]);

  return (
    <ErrorBoundary fallback={"Failed to load Difficulty Chart"}>
      <div className="space-y-6">
        <div className="flex mt-12">
          <h3 className="text-lg font-semibold mb-4 flex-1">
            Mining Difficulty Over Time
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          {loading ? (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          ) : (
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
              <Legend />
              <Area
                type="monotone"
                dataKey="difficulty"
                stroke="hsl(var(--chart-4))"
                fillOpacity={1}
                fill="url(#diffGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </ErrorBoundary>
  );
}
