import { CHART_COLORS } from "@/app/zips-grants/lib/chart-colors";
import { formatCurrencyToUSD } from "@/lib/helpers";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Props = {
  data: { name: string; value: number }[];
};

const RADIAN = Math.PI / 180;

function renderPercentageLabel({
  cx,
  cy,
  midAnggle,
  innerRadius,
  outerRadius,
  percent,
}: any) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAnggle * RADIAN);
  const y = cy + radius * Math.sin(-midAnggle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline={"center"}
      className="text-sm font-semibold"
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
}

export function GrantStatusChart(props: Props) {


  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Grant Status Distribution
        </h3>
        <p className="text-sm text-slate-500 mb-4">Active va close grants</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={props.data}
            dataKey={"value"}
            nameKey={"name"}
            outerRadius={110}
            innerRadius={70}
            paddingAngle={3}
            label={renderPercentageLabel}
            isAnimationActive
          >
            {props.data.map((e, i) => {
              return <Cell key={i} fill={CHART_COLORS.financial[e.name]} />;
            })}
          </Pie>
          <Tooltip formatter={(val: number) => `${formatCurrencyToUSD(val)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
