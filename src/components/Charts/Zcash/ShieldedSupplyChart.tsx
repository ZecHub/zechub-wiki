import { CardContent } from "@/components/ui/shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { getSupplyData } from "@/lib/chart/helpers";
import { ShieldedTxCount, SupplyData } from "@/lib/chart/types";
import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
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

type ShieldedSupplyChartProps = {};
export default function ShieldedSupplyChart(props: ShieldedSupplyChartProps) {
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("all");
    const fontSize = useResponsiveFontSize(); // optional: pass min/max

  const [cumulativeCheck, setCumulativeCheck] = useState(true);
  const [filterSpamCheck, setFilterSpamCheck] = useState(false);
  const [circulation, setCirculation] = useState<number | null>(null);
  const [shieldedSupplyData, setShieldedSupplyData] = useState<SupplyData[]>(
    []
  );
  const [orchardSupplyData, setOrchardSupplyData] = useState<SupplyData[]>([]);
  const [saplingSupplyData, setSaplingSupplyData] = useState<SupplyData[]>([]);
  const [sproutSupplyData, setSproutSupplyData] = useState<SupplyData[]>([]);
  const [shieldedTxCount, setShieldedTxCount] = useState<
    ShieldedTxCount[] | null
  >([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [defaultSupply, sproutSupply, saplingSupply, orchardSupply] =
          await Promise.all([
            getSupplyData(DATA_URL.defaultUrl, controller.signal),
            getSupplyData(DATA_URL.sproutUrl, controller.signal),
            getSupplyData(DATA_URL.saplingUrl, controller.signal),
            getSupplyData(DATA_URL.orchardUrl, controller.signal),
          ]);

        if (sproutSupply) {
          setSproutSupplyData(sproutSupply);
        }
        if (shieldedTxCount) {
          setShieldedTxCount(shieldedTxCount);
        }
        if (saplingSupply) {
          setSaplingSupplyData(saplingSupplyData);
        }
        if (orchardSupply) {
          setOrchardSupplyData(orchardSupplyData);
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchAllData();

    return () => {
      controller.abort();
    };
  }, []);

  const getAvailableYears = () => {
    const allData = [
      ...shieldedSupplyData,
      ...orchardSupplyData,
      ...saplingSupplyData,
      ...sproutSupplyData,
    ];

    const years = [
      ...new Set(
        allData.map((item) => {
          const year = extractYear(item.close);
          return year;
        })
      ),
    ].sort();

    return ["all", ...years];
  };

  const extractYear = (date: string) => {
    const [, , year] = date.split("/");
    return year;
  };

  const filterDataByYear = (data: any[], year: string) => {
    if (year === "all") return data;

    return data.filter(
      (item) => parseInt(extractYear(item.close)) === parseInt(year)
    );
  };

  const calculateTotalSupply = (year: string) => {
    const allData = [
      ...shieldedSupplyData,
      ...orchardSupplyData,
      ...saplingSupplyData,
      ...sproutSupplyData,
    ];

    const filteredData = filterDataByYear(allData, year);

    const totalSum = filteredData.reduce((sum, item) => sum + item.supply, 0);
    return totalSum;
  };

  const combinedPoolData = [
    ...filterDataByYear(shieldedSupplyData, selectedYear).map((item) => ({
      ...item,
      sprout: 0,
      sapling: 0,
      orchard: 0,
    })),
    ...filterDataByYear(sproutSupplyData, selectedYear).map((item) => ({
      ...item,
      sprout: item.supply,
      sapling: 0,
      orchard: 0,
    })),
    ...filterDataByYear(saplingSupplyData, selectedYear).map((item) => ({
      ...item,
      sprout: 0,
      sapling: item.supply,
      orchard: 0,
    })),
    ...filterDataByYear(orchardSupplyData, selectedYear).map((item) => ({
      ...item,
      sprout: 0,
      sapling: 0,
      orchard: item.supply,
    })),
  ].sort((a, b) => new Date(a.close).getTime() - new Date(b.close).getTime());

  console.log({ combinedPoolData });

  return (
    <div className="space-y-6">
      <div className="flex mt-12">
        <h3 className="text-lg font-semibold mb-4 flex-1">
          Shielded Supply Overview
        </h3>
        <CardContent className="flex items-center flex-col lg:flex-row gap-4">
          <div className="flex justify-center items-center gap-2">
            <label className="text-sm font-medium">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAvailableYears().map((year) => (
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
              {calculateTotalSupply(selectedYear).toLocaleString()} ZEC
            </div>
          </div>
        </CardContent>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <AreaChart data={combinedPoolData}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis dataKey="close" tick={{ fontSize, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize, fill: "#94a3b8" }} />
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
