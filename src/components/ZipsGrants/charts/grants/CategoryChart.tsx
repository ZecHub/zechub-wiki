import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";

type Props = {
  catData: {
    name: string;
    value: number;
    totalUSD: number;
    fill: string;
  }[];
};

export function CategoryChart(props: Props) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const total = props.catData.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercent = props.catData.map((item) => ({
    ...item,
    percent: total > 0 ? item.value / total : 0,
  }));

  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
    } = props;

    const offset = 18;
    const newOuterRadius = outerRadius + 12;

    const xOffset = offset * Math.cos(-midAngle * Math.PI / 180);
    const yOffset = offset * Math.sin(-midAngle * Math.PI / 180);

    return (
      <g>
        <Sector
          cx={cx + xOffset}
          cy={cy + yOffset}
          innerRadius={innerRadius}
          outerRadius={newOuterRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(undefined);

  const PieWithActive = Pie as any;

  return (
    <Card className="border-border/30 dark:bg-slate-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Grants by Category</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-8">
        <ResponsiveContainer width="100%" height={460}>
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <PieWithActive
              data={dataWithPercent}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={135}
              paddingAngle={3}
              dataKey="value"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {dataWithPercent.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </PieWithActive>

            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(230, 20%, 12%)",
                border: "1px solid hsl(230, 15%, 20%)",
                borderRadius: "8px",
                fontSize: "13px",
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
