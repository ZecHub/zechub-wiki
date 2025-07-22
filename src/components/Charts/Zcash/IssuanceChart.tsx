import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useIssuanceData } from "@/hooks/useIssuanceData";

type IssuanceChartProps = {
  url: string;
};

// Parse data and preload
export default function IssuanceChart(props: IssuanceChartProps) {
  const data = useIssuanceData(props.url);

  return (
    <div className="w-full h-[500px]">
      <h3 className="text-lg font-semibold mb-4">
        ZEC Issuance vs. Inflation Rate
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12 }}
            width={60}
            label={{ value: "Issuance", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            width={60}
            label={{
              value: "Inflation (%)",
              angle: 90,
              position: "insideRight",
            }}
          />
          <Tooltip
            formatter={(value: any) =>
              typeof value === "number" ? value.toLocaleString() : value
            }
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="issuance"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="inflation"
            stroke="hsl(var(--chart-5))"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
