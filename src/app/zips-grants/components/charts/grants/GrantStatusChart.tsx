import { Pie, Legend, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type Props = {
  data: { name: string; value: string }[];
};

export function GrantStatusChart(props: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Grant Status Distribution</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={props.data}
            dataKey={"value"}
            nameKey={"name"}
            outerRadius={100}
          />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
