import { Button } from "@/components/UI/shadcn/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/UI/shadcn/card";
import {
    BarChart3,
    CheckCircle,
    Coins,
    DollarSign,
    TrendingUp,
    Upload,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

type Props = {
  timeData: {
    month: string;
    amount: number;
  }[];
};

export function USDDisbursedOverTimeChart(props: Props) {
  return (
    <Card className="border-border/30 bg-slate-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          USD Disbursed Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={props.timeData}>
            <defs>
              <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(47, 100%, 55%)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(47, 100%, 55%)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 15%, 20%)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
            />
            <YAxis
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
              tickFormatter={(v) => `$${(v / 1e3).toFixed(0)}K`}
            />

            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(47, 100%, 55%)"
              fill="url(#gradArea)"
              strokeWidth={2}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(230, 20%, 12%)",
                border: "1px solid hsl(230, 15%, 20%)",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "hsl(210, 40%, 96%)" }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, "Amount"]}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
