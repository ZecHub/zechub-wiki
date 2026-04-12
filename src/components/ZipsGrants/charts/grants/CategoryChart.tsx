import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Payload } from "recharts/types/component/DefaultTooltipContent";

type Props = {
  catData: {
    name: string;
    value: number;
    totalUSD: number;
    fill: string;
  }[];
};

export function CategoryChart(props: Props) {
  return (
    <Card className="border-border/30 dark:bg-slate-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Grants by Category</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-8">
        <ResponsiveContainer width="100%" height={420}>
          <PieChart
            margin={{ top: 20, right: 160, bottom: 20, left: 20 }} // space for legend
          >
            <Pie
              data={props.catData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
              // No labels or labelLine — legend handles everything
            >
              {props.catData.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.fill} />
              ))}
            </Pie>

            {/* Clean vertical legend on the right */}
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="rect"
              iconSize={14}
              formatter={(value: string, entry: any) => {
                const percent = (entry.payload?.percent ?? 0) * 100;
                return [`${value} ${percent.toFixed(0)}%`];
              }}
              wrapperStyle={{
                fontSize: "13px",
                fontWeight: 600,
                lineHeight: "1.4",
                paddingLeft: "12px",
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(230, 20%, 12%)",
                border: "1px solid hsl(230, 15%, 20%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              itemStyle={{ color: "hsl(210, 40%, 96%)" }}
              formatter={(value, name, item) => {
                const safeValue = value ?? 0;
                const totalUSD = item?.payload?.totalUSD ?? 0;
                return [
                  `${safeValue} grants — $${(totalUSD / 1e3).toFixed(0)}K`,
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
