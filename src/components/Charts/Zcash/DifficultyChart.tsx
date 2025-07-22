import { Difficulty } from "@/lib/chart/types";
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

type DifficultyChartProps = {
  difficulty: Difficulty[];
};
export default function DifficultyChart(props: DifficultyChartProps) {
  return (
    <div className="space-y-6">
      <div className="flex mt-12">
        <h3 className="text-lg font-semibold mb-4 flex-1">Mining Difficulty</h3>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={props.difficulty}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Difficulty"
            stroke="hsl(var(--chart-4))"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
