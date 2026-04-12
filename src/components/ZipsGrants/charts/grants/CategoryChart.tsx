import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
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
  // Custom label that pushes text further out + proper alignment
  const renderCustomizedLabel = (entry: any) => {
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
      name,
      fill, // this gives the nice colored text that matches each slice
    } = entry;

    const radius = outerRadius + 35; // ← this is the key fix (more space)
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text
        x={x}
        y={y}
        fill={fill}
        textAnchor={x > cx ? "start" : "end"} // prevents cutoff on edges
        dominantBaseline="central"
        fontSize="10px"
        fontWeight={700}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="border-border/30 dark:bg-slate-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Grants by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}> 
          <PieChart>
            <Pie
              data={props.catData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={115}           
              paddingAngle={3}
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={true}            
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
