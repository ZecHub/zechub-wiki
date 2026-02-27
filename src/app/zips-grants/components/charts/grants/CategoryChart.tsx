import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type Props = {
  catData: {
    name: string;
    value: number;
    totalUSD: number;
    fill: string;
  }[];
};

/* Chart 1: Category Donut */
export function CategoryChart(props: Props) {
  return (
    <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Grants by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={props.catData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent! * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {props.catData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(230, 20%, 12%)",
                border: "1px solid hsl(230, 15%, 20%)",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "hsl(210, 40%, 96%)" }}
              formatter={(value: number, name: string, props: any) => [
                `${value} grants — $${(props.payload.totalUSD / 1e3).toFixed(0)}K`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
