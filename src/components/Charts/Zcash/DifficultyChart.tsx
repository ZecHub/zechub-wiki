import { Difficulty } from "@/lib/chart/types";
import * as dateFns from "date-fns";
import { useMemo } from "react";
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

type DifficultyChartProps = {
  difficulty: Difficulty[];
};

export default function DifficultyChart({ difficulty }: DifficultyChartProps) {
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
    <div className="space-y-6">
      <div className="flex mt-12">
        <h3 className="text-lg font-semibold mb-4 flex-1">
          Mining Difficulty Over Time
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={400}>
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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(v) =>
              v >= 1_000_000
                ? `${v / 1_000_000}M`
                : v >= 1_000
                ? `${v / 1_000}K`
                : v
            }
            tick={{ fontSize: 12 }}
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
      </ResponsiveContainer>
    </div>
  );
}
