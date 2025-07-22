import { NetInOutflow } from "@/lib/chart/types";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type NetFlowChartProps = {
  netInOutflowData: NetInOutflow[];
};
export default function NetFlowChart(props: NetFlowChartProps) {
  return (
    <div className="space-y-6">
      <div className="flex mt-12">
        <h3 className="text-lg font-semibold mb-4 flex-1">
          Net Sapling & Orchard Flow
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={props.netInOutflowData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Net Sapling Flow"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="Net Orchard Flow"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
