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
  // Pre-calculate percentages (fixes the 0% bug)
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
      <CardContent className="px-6 py-10">
        <ResponsiveContainer width="100%" height={560}>
          <PieChart margin={{ top: 20, right: 40, bottom: 220, left: 40 }}>
            <Pie
              data={dataWithPercent}
              cx="50%"                    
              cy="42%"                   
              innerRadius={72}
              outerRadius={125}
              paddingAngle={4}
              dataKey="value"
            >
              {dataWithPercent.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>

            {/* Bottom legend – centered, wraps nicely, full names visible */}
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              iconType="rect"
              iconSize={14}
              content={({ payload }) => (
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mt-8 px-4">
                  {payload?.map((entry: any, index: number) => {
                    const percent = Math.round((entry.payload?.percent ?? 0) * 100);
                    return (
                      <div key={index} className="flex items-center gap-3 min-w-[180px]">
                        <div
                          className="w-4 h-4 rounded flex-shrink-0"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {entry.value}
                        </span>
                        <span className="ml-auto font-mono text-xs text-gray-500 dark:text-gray-400">
                          {percent}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(230, 20%, 12%)",
                border: "1px solid hsl(230, 15%, 20%)",
                borderRadius: "8px",
                fontSize: "12.5px",
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
