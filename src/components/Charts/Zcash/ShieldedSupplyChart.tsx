import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
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
import { RefObject, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartContainer from "./ChartContainer";

const POOLS = ["sprout", "sapling", "orchard"];
const POOL_OPTIONS = [
  { label: "All Pools", value: "all" },
  { label: "Sprout", value: "sprout" },
  { label: "Sapling", value: "sapling" },
  { label: "Orchard", value: "orchard" },
];
type PoolKey = "all" | "sprout" | "sapling" | "orchard";

type ShieldedSupplyChartProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

export default function ShieldedSupplyChart(props: ShieldedSupplyChartProps) {
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedPool, setSelectedPool] = useState<PoolKey>("all");

  const fontSize = useResponsiveFontSize();

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

  const extractYear = (date: string) => date.split("/")[2];

  const getAvailableYears = (poolKey: PoolKey) => {
    const dataByPool = {
      sprout: sproutSupplyData,
      sapling: saplingSupplyData,
      orchard: orchardSupplyData,
    };

    const data =
      poolKey == "all"
        ? [...sproutSupplyData, ...saplingSupplyData, ...orchardSupplyData]
        : dataByPool[poolKey];

    const years = [...new Set(data.map((d) => extractYear(d.close)))].sort();

    return ["all", ...years];
  };

  const filterByYear = (data: SupplyData[]) =>
    selectedYear === "all"
      ? data
      : data.filter((d) => extractYear(d.close) === selectedYear);

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
  const poolDataMap = {
    sprout: filterByYear(sproutSupplyData),
    sapling: filterByYear(saplingSupplyData),
    orchard: filterByYear(orchardSupplyData),
  };

  const latest = combinedPoolData[combinedPoolData.length - 1];

  const latestTotals = {
    sprout: latest?.sprout || 0,
    sapling: latest?.sapling || 0,
    orchard: latest?.orchard || 0,
  };

  const calculateTotalShielded = () =>
    latestTotals.orchard + latestTotals.sapling + latestTotals.sprout;
  const poolData =
    selectedPool === "all" ? combinedPoolData : poolDataMap[selectedPool];

  return (
    <ErrorBoundary fallback={"Failed to load Shielded Supply Chart"}>
      <div className="space-y-6">
        <div className="flex mt-12 flex-wrap gap-4 items-center">
          <h3 className="text-lg font-semibold flex-1">
            {/* Shielded Supply Overview */}
            {selectedPool === "all"
              ? "Shielded Supply Overview"
              : `${capitalize(selectedPool)} Pool Supply`}
            <span className="text-sm">
              {selectedYear !== "all" ? ` - ${selectedYear}` : ""}
            </span>
          </h3>

          {/*  Year Dropdown */}
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-28 dark:border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAvailableYears(selectedPool).map((year) => (
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

          {/*  Pool Dropdown */}
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium">Pool</label>
            <Select
              value={selectedPool}
              onValueChange={(v) => setSelectedPool(v as PoolKey)}
            >
              <SelectTrigger className="w-36 dark:border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POOL_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="hover:cursor-pointer bg-slate-50 dark:bg-slate-800"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm">
            {selectedPool === "all" ? (
              <>
                <span className="font-medium">Total Shielded:</span>{" "}
                {calculateTotalShielded().toLocaleString()} ZEC
              </>
            ) : (
              <span className="ml-1">
                {selectedPool.charAt(0).toUpperCase() + selectedPool.slice(1)}:{" "}
                {latestTotals[
                  selectedPool as keyof typeof latestTotals
                ]?.toLocaleString?.() ?? "0"}{" "}
                ZEC
              </span>
            )}
          </div>
        </div>

        {/*  Chart Container */}
        <ChartContainer ref={props.chartRef} loading={loading}>
          <AreaChart data={poolData} key={`${selectedYear}-${selectedPool}`}>
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

              <linearGradient id="saplingGradient" x1="0" y1="0" x2="0" y2="1">
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

              <linearGradient id="orchardGradient" x1="0" y1="0" x2="0" y2="1">
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
              formatter={(value: any) => [
                `${Number(value).toLocaleString()} ZEC`,
              ]}
            />

            {selectedPool === "all" ? (
              <>
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
              </>
            ) : (
              <Area
                type="monotone"
                dataKey="supply"
                stroke={`hsl(var(--chart-${
                  selectedPool === "sprout"
                    ? 1
                    : selectedPool === "sapling"
                    ? 2
                    : 3
                }))`}
                fill={`url(#${selectedPool}Gradient)`}
                name={`${
                  selectedPool[0].toUpperCase() + selectedPool.slice(1)
                } Pool`}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </div>
    </ErrorBoundary>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
