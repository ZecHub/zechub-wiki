import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
type Props = {
  topData: {
    name: string;
    amount: number;
    fill: string;
  }[];
};

export function TopGranteesChart(props: Props) {
  return (
    <Card className="border-border/30 bg-slate-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          Top 15 Grantees by Funding
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart data={props.topData} layout="vertical" margin={{ left: 1 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 15%, 20%)" />
            <XAxis
              type="number"
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
              tickFormatter={(v) => `$${(v / 1e3).toFixed(0)}K`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
              width={110}
            />
            <Tooltip
              cursor={{ fill: "hsl(215, 20%, 25%)" }}
              contentStyle={{
                backgroundColor: "hsl(230, 20%, 12%)",
                border: "1px solid hsl(230, 15%, 20%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              itemStyle={{ color: "hsl(210, 40%, 96%)" }}
              formatter={(v) => [`$${v?.toLocaleString()}`, "Total Funding"]}
            />
            <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
              {props.topData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
