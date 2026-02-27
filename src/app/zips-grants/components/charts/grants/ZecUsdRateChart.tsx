import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  rateData: {
    date: string;
    rate: number;
    project: string;
    amount: number;
  }[];
};

export function ZecUsdRateChart(props: Props) {
  return (
    <Card className="border-border/30 bg-slate-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          ZEC/USD Rate at Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={props.rateData}>
            <defs>
              <linearGradient id="gradLine" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(170, 80%, 45%)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(170, 80%, 45%)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 15%, 20%)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
            />
            <YAxis
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(230, 20%, 12%)",
                border: "1px solid hsl(230, 15%, 20%)",
                borderRadius: "4px",
                fontSize: "12px",
              }}
              itemStyle={{ color: "hsl(210, 40%, 96%)" }}
              formatter={(v, _, props) => [
                `$${v} — ${props.payload.project}`,
                "ZEC/USD",
              ]}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="hsl(170, 80%, 45%)"
              strokeWidth={1}
              dot={{ fill: "hsl(170, 80%, 45%)", r: 2 }}
              activeDot={{ r: 3, fill: "hsl(47, 100%, 55%)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
