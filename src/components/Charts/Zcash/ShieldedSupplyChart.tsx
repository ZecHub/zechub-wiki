import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
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
import { SupplyData } from "@/lib/chart/types";
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
  // const [cumulativeCheck, setCumulativeCheck] = useState(true);
  // const [filterSpamCheck, setFilterSpamCheck] = useState(false);
  // const [circulation, setCirculation] = useState<number | null>(null);
  const [shieldedSupplyData, setShieldedSupplyData] = useState<SupplyData[]>(
    []
  );
  const [orchardSupplyData, setOrchardSupplyData] = useState<SupplyData[]>([]);
  const [saplingSupplyData, setSaplingSupplyData] = useState<SupplyData[]>([]);
  const [sproutSupplyData, setSproutSupplyData] = useState<SupplyData[]>([]);

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
        if (defaultSupply) {
          console.log({ defaultSupply });
          setShieldedSupplyData(defaultSupply);
        }

        if (saplingSupply) {
          setSaplingSupplyData(saplingSupply);
        }
        if (orchardSupply) {
          setOrchardSupplyData(orchardSupply);
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
      // ...shieldedSupplyData,
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

  const normalizePools = () => {
    const allDates = new Set([
      ...sproutSupplyData.map((d) => d.close),
      ...saplingSupplyData.map((d) => d.close),
      ...orchardSupplyData.map((d) => d.close),
    ]);

    const dateArray = Array.from(allDates).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const dataMap: Record<string, any> = {};

    for (const date of dateArray) {
      dataMap[date] = { close: date, sprout: 0, sapling: 0, orchard: 0 };
    }

    for (const d of sproutSupplyData) {
      if (dataMap[d.close]) dataMap[d.close].sprout = d.supply;
    }

    for (const d of saplingSupplyData) {
      if (dataMap[d.close]) dataMap[d.close].sapling = d.supply;
    }

    for (const d of orchardSupplyData) {
      if (dataMap[d.close]) dataMap[d.close].orchard = d.supply;
    }

    return Object.values(dataMap).filter((d) =>
      selectedYear === "all" ? true : extractYear(d.close) === selectedYear
    );
  };

  const combinedPoolData = normalizePools();

  const latest = combinedPoolData[combinedPoolData.length - 1];

  const latestTotals = {
    sprout: latest?.sprout || 0,
    sapling: latest?.sapling || 0,
    orchard: latest?.orchard || 0,
  };

  const calculateTotalShielded = () => {
    return latestTotals.orchard + latestTotals.sapling + latestTotals.sprout;
  };

  return (
    <ErrorBoundary fallback={"Failed to load Shielded Supply Chart"}>
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
              <label className="text-sm font-medium">Total Shielded</label>
              <div className="w-fit">
                {calculateTotalShielded().toLocaleString()} ZEC
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
              <defs>
                <linearGradient id="sproutGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.05}
                  />
                </linearGradient>

                <linearGradient
                  id="saplingGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.05}
                  />
                </linearGradient>

                <linearGradient
                  id="orchardGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-3))"
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-3))"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="close" tick={{ fontSize, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize, fill: "#94a3b8" }} />
              <Tooltip
                formatter={(value: any, name: any) => [
                  Number(value).toLocaleString() + " ZEC",
                  name,
                ]}
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ marginTop: 20 }}
                content={() => (
                  <div className="flex justify-center gap-6 text-sm mt-2 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 inline-block rounded-sm"
                        style={{ background: "hsl(var(--chart-1))" }}
                      />
                      Sprout Pool — {latestTotals.sprout.toLocaleString()} ZEC
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 inline-block rounded-sm"
                        style={{ background: "hsl(var(--chart-2))" }}
                      />
                      Sapling Pool — {latestTotals.sapling.toLocaleString()} ZEC
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 inline-block rounded-sm"
                        style={{ background: "hsl(var(--chart-3))" }}
                      />
                      Orchard Pool — {latestTotals.orchard.toLocaleString()} ZEC
                    </div>
                  </div>
                )}
              />

              <Area
                type="monotone"
                dataKey="sprout"
                stackId="1"
                stroke="hsl(var(--chart-1))"
                fill="url(#sproutGradient)"
                name="Sprout Pool"
              />
              <Area
                type="monotone"
                dataKey="sapling"
                stackId="1"
                stroke="hsl(var(--chart-2))"
                fill="url(#saplingGradient)"
                name="Sapling Pool"
              />
              <Area
                type="monotone"
                dataKey="orchard"
                stackId="1"
                stroke="hsl(var(--chart-3))"
                fill="url(#orchardGradient)"
                name="Orchard Pool"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </ErrorBoundary>
  );
}
