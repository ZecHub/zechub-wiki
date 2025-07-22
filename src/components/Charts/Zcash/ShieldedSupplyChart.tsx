import { CardContent } from "@/components/ui/shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Difficulty } from "@/lib/chart/types";
import { Spinner } from "flowbite-react";
import { Dispatch, SetStateAction } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ShieldedSupplyChartProps = {
  difficulty: Difficulty[];
  selectedYear: string;
  setSelectedYear: Dispatch<SetStateAction<string>>;
  getAvailableYears: () => string[];
  calculateTotalSupply: (year: string) => any;
  loading: boolean;
  combinedPoolData: any[];
};
export default function ShieldedSupplyChart(props: ShieldedSupplyChartProps) {
  return (
    <div className="space-y-6">
      <div className="flex mt-12">
        <h3 className="text-lg font-semibold mb-4 flex-1">
          Shielded Supply Overview
        </h3>
        <CardContent className="flex items-center flex-col lg:flex-row gap-4">
          <div className="flex justify-center items-center gap-2">
            <label className="text-sm font-medium">Year</label>
            <Select
              value={props.selectedYear}
              onValueChange={props.setSelectedYear}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {props.getAvailableYears().map((year) => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    className="hover:cursor-pointer bg-slate-50 dark:bg-slate-800"
                  >
                    {year === "all" ? "All" : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center items-center gap-2">
            <label className="text-sm font-medium">Total Supply</label>
            <div className="w-fit">
              {props.calculateTotalSupply(props.selectedYear).toLocaleString()}{" "}
              ZEC
            </div>
          </div>
        </CardContent>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        {props.loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <AreaChart data={props.combinedPoolData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="close" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="sprout"
              stackId="1"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
              name="Sprout Pool"
            />
            <Area
              type="monotone"
              dataKey="sapling"
              stackId="1"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
              name="Sapling Pool"
            />
            <Area
              type="monotone"
              dataKey="orchard"
              stackId="1"
              stroke="hsl(var(--chart-3))"
              fill="hsl(var(--chart-3))"
              name="Orchard Pool"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
