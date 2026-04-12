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

export function CategoryChart(props: Props) {
  // Pre-calculate percentages (for tooltip consistency, even though not displayed)
  const total = props.catData.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercent = props.catData.map((item) => ({
    ...item,
    percent: total > 0 ? item.value / total : 0,
  }));

  return (
    <Card className="border-border/30 dark:bg-slate-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Grants by Category</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-8">
        <ResponsiveContainer width="100%" height={420}>
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <Pie
              data={dataWithPercent}
              cx="50%"          
              cy="50%"          
              innerRadius={75}
              outerRadius={135}
              paddingAngle={3}
              dataKey="value"
              
            >
              {dataWithPercent.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(230, 20%, 12%)",
                border: "1px solid hsl(230, 15%, 20%)",
                borderRadius: "8px",
                fontSize: "13px",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{ color: "hsl(210, 40%, 96%)" }}
              formatter={(value, name, item) => {
                const safeValue = value ?? 0;
                const totalUSD = item?.payload?.totalUSD ?? 0;
                const percent = item?.payload?.percent ?? 0;
                return [
                  `${safeValue} grants — $${(totalUSD / 1e3).toFixed(0)}K (${(percent * 100).toFixed(0)}%)`,
                  name,
                ];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
