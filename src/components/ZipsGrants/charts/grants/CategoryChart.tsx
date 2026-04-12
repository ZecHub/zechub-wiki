import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type Props = {
  catData: {
    name: string;
    value: number;
    totalUSD: number;
    fill: string;
  }[];
};

export function CategoryChart(props: Props) {
  // Pre-calculate percentages — this fixes the 0% bug forever
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
      <CardContent className="px-8 py-10">
        <ResponsiveContainer width="100%" height={460}>
          <PieChart margin={{ top: 10, right: 240, bottom: 10, left: 10 }}>
            <Pie
              data={dataWithPercent}
              cx="42%"                   
              cy="50%"
              innerRadius={68}
              outerRadius={118}
              paddingAngle={4}
              dataKey="value"
            >
              {dataWithPercent.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>

            {/* Clean custom legend on the right */}
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              content={({ payload }) => (
                <ul className="text-[13px] font-medium space-y-3 pl-4">
                  {payload?.map((entry: any, index: number) => {
                    const percent = Math.round((entry.payload?.percent ?? 0) * 100);
                    return (
                      <li key={index} className="flex items-center gap-2.5">
                        <div
                          className="w-3.5 h-3.5 rounded flex-shrink-0"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {entry.value}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 font-mono text-xs ml-auto">
                          {percent}%
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
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
