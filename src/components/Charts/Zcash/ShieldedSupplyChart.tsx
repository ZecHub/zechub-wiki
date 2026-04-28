import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import {
  formatNumberShort,
  getColorForPool,
  getSupplyData,
  PoolType,
} from "@/lib/chart/helpers";
import { SupplyData } from "@/lib/chart/types";
import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartHeader from "../ChartHeader";
import ChartContainer from "./ChartContainer";
import { useInMobile } from "@/hooks/useInMobile";
import DefaultSelect from "@/components/DefaultSelect";

type PoolKey = "all" | PoolType;

type ShieldedSupplyChartProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

export default function ShieldedSupplyChart(props: ShieldedSupplyChartProps) {
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedPool, setSelectedPool] = useState<PoolKey>("all");
  const fontSize = useResponsiveFontSize();
  const isMobile = useInMobile();

  const [orchardSupplyData, setOrchardSupplyData] = useState<SupplyData[]>([]);
  const [saplingSupplyData, setSaplingSupplyData] = useState<SupplyData[]>([]);
  const [sproutSupplyData, setSproutSupplyData] = useState<SupplyData[]>([]);

  const [sproutVisible, setSproutVisible] = useState(true);
  const [saplingVisible, setSaplingVisible] = useState(true);
  const [orchardVisible, setOrchardVisible] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [sprout, sapling, orchard] = await Promise.all([
          getSupplyData(DATA_URL.sproutUrl, controller.signal),
          getSupplyData(DATA_URL.saplingUrl, controller.signal),
          getSupplyData(DATA_URL.orchardUrl, controller.signal),
        ]);
        if (sprout) setSproutSupplyData(sprout);
        if (sapling) setSaplingSupplyData(sapling);
        if (orchard) setOrchardSupplyData(orchard);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
    return () => controller.abort();
  }, []);

  const extractYear = useCallback((dateStr: string) => {
    return new Date(dateStr).getFullYear().toString();
  }, []);

  const normalizePools = useCallback(() => {
    const normalizeDate = (dateStr: string) => {
      const [month, day, year] = dateStr.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };
    const sprout = sproutSupplyData.map((d) => ({ ...d, close: normalizeDate(d.close) }));
    const sapling = saplingSupplyData.map((d) => ({ ...d, close: normalizeDate(d.close) }));
    const orchard = orchardSupplyData.map((d) => ({ ...d, close: normalizeDate(d.close) }));
    const allDates = new Set([
      ...sprout.map((d) => d.close),
      ...sapling.map((d) => d.close),
      ...orchard.map((d) => d.close),
    ]);
    const dateArray = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const dataMap: Record<string, any> = {};
    for (const date of dateArray) {
      dataMap[date] = { close: date, sprout: 0, sapling: 0, orchard: 0 };
    }
    for (const d of sprout) if (dataMap[d.close]) dataMap[d.close].sprout = d.supply;
    for (const d of sapling) if (dataMap[d.close]) dataMap[d.close].sapling = d.supply;
    for (const d of orchard) if (dataMap[d.close]) dataMap[d.close].orchard = d.supply;
    return Object.values(dataMap).filter((d: any) =>
      selectedYear === "all" ? true : extractYear(d.close) === selectedYear
    );
  }, [sproutSupplyData, saplingSupplyData, orchardSupplyData, selectedYear, extractYear]);

  const combinedPoolData = useMemo(() => normalizePools(), [normalizePools]);

  const poolData = useMemo(() => {
    if (selectedPool === "all") return combinedPoolData;
    const map = {
      sprout: sproutSupplyData,
      sapling: saplingSupplyData,
      orchard: orchardSupplyData,
    };
    return map[selectedPool].filter((d) =>
      selectedYear === "all" ? true : extractYear(d.close) === selectedYear
    );
  }, [selectedPool, combinedPoolData, sproutSupplyData, saplingSupplyData, orchardSupplyData, selectedYear, extractYear]);

  const getAvailableYears = useCallback((poolKey: PoolKey) => {
    const dataByPool = { sprout: sproutSupplyData, sapling: saplingSupplyData, orchard: orchardSupplyData };
    const data = poolKey === "all"
      ? [...sproutSupplyData, ...saplingSupplyData, ...orchardSupplyData]
      : dataByPool[poolKey];
    const years = [...new Set(data.map((d) => extractYear(d.close)))].sort();
    return ["all", ...years];
  }, [sproutSupplyData, saplingSupplyData, orchardSupplyData, extractYear]);

  const latest = combinedPoolData[combinedPoolData.length - 1] || {};
  const latestTotals = {
    sprout: latest.sprout || 0,
    sapling: latest.sapling || 0,
    orchard: latest.orchard || 0,
  };
  const calculateTotalShielded = () =>
    latestTotals.orchard + latestTotals.sapling + latestTotals.sprout;

  const legendContent = useMemo(() => (
    <div className="flex justify-center gap-8 text-sm mt-4 flex-wrap">
      {selectedPool === "all" ? (
        <>
          <button onClick={() => setSproutVisible(!sproutVisible)} className={`flex items-center gap-2 cursor-pointer transition-colors ${sproutVisible ? "" : "opacity-40 line-through"}`}>
            <span className="inline-block w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]" />
            <span className="font-medium">Sprout</span>
          </button>
          <button onClick={() => setSaplingVisible(!saplingVisible)} className={`flex items-center gap-2 cursor-pointer transition-colors ${saplingVisible ? "" : "opacity-40 line-through"}`}>
            <span className="inline-block w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]" />
            <span className="font-medium">Sapling</span>
          </button>
          <button onClick={() => setOrchardVisible(!orchardVisible)} className={`flex items-center gap-2 cursor-pointer transition-colors ${orchardVisible ? "" : "opacity-40 line-through"}`}>
            <span className="inline-block w-3 h-3 rounded-full bg-[hsl(var(--chart-3))]" />
            <span className="font-medium">Orchard</span>
          </button>
        </>
      ) : (
        <button className="flex items-center gap-2 cursor-pointer">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: `hsl(var(--chart-${selectedPool === "sprout" ? 1 : selectedPool === "sapling" ? 2 : 3}))` }} />
          <span className="font-medium">{selectedPool.charAt(0).toUpperCase() + selectedPool.slice(1)} Pool</span>
        </button>
      )}
    </div>
  ), [selectedPool, sproutVisible, saplingVisible, orchardVisible]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-md px-3 py-2 shadow-md border text-sm" style={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f1f5f9" }}>
        <p className="text-slate-100 font-semibold mb-2">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <div key={idx} className="flex justify-between gap-4" style={{ color: entry.color }}>
            <span>{entry.name}</span>
            <span className="text-slate-50">{entry.value?.toLocaleString()} ZEC</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ErrorBoundary fallback={"Failed to load Shielded Supply Chart"}>
      <ChartHeader
        title={
          selectedPool === "all"
            ? "Shielded Supply Overview"
            : `${selectedPool.charAt(0).toUpperCase() + selectedPool.slice(1)} Pool Supply`
        }
      />

      {/* MOBILE-FRIENDLY TOP BAR */}
      <div className="px-4 sm:px-8 mt-3 mb-6">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between gap-5 sm:gap-0">
          
          {/* Pool selector - centered on mobile */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium whitespace-nowrap">Pool:</label>
            <DefaultSelect
              value={selectedPool}
              onChange={setSelectedPool}
              options={["all", "sprout", "sapling", "orchard"]}
              className="w-44"
              renderOption={(val) =>
                val === "all"
                  ? "All Pools"
                  : val.charAt(0).toUpperCase() + val.slice(1)
              }
            />
          </div>

          {/* Year selector - centered on mobile */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium whitespace-nowrap">Year</label>
            <DefaultSelect
              value={selectedYear}
              onChange={setSelectedYear}
              options={getAvailableYears(selectedPool).map((year) => year.toString())}
              className="w-35"
              renderOption={(year) => (year === "all" ? "All" : year)}
            />
          </div>

          {/* Total Shielded label - centered on mobile */}
          <div className="text-sm font-medium whitespace-nowrap text-center">
            Total Shielded: {calculateTotalShielded().toLocaleString()} ZEC
          </div>
        </div>
      </div>

      <ChartContainer ref={props.chartRef} loading={loading}>
        <AreaChart data={poolData}>
          <defs>
            <linearGradient id="sproutGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.6} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="saplingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.6} />
              <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="orchardGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.6} />
              <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis
            dataKey="close"
            tick={{ fontSize: fontSize * 0.75, fill: "#94a3b8" }}
            interval={Math.max(1, Math.floor(poolData.length / 10))}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis tick={{ fontSize, fill: "#94a3b8" }} tickFormatter={(val: any) => formatNumberShort(val)} />
          <Tooltip content={CustomTooltip} />
          <Legend content={legendContent} />
          {selectedPool === "all" ? (
            <>
              <Area type="monotone" dataKey="sprout" stroke={getColorForPool("sprout")} fill="url(#sproutGradient)" name="Sprout Pool" hide={!sproutVisible} />
              <Area type="monotone" dataKey="sapling" stroke={getColorForPool("sapling")} fill="url(#saplingGradient)" name="Sapling Pool" hide={!saplingVisible} dot={false} connectNulls={true} />
              <Area type="monotone" dataKey="orchard" stroke={getColorForPool("orchard")} fill="url(#orchardGradient)" name="Orchard Pool" hide={!orchardVisible} />
            </>
          ) : (
            <Area
              type="monotone"
              dataKey="supply"
              stroke={`hsl(var(--chart-${selectedPool === "sprout" ? 1 : selectedPool === "sapling" ? 2 : 3}))`}
              fill={`url(#${selectedPool}Gradient)`}
              name={`${selectedPool.charAt(0).toUpperCase() + selectedPool.slice(1)} Pool`}
            />
          )}
        </AreaChart>
      </ChartContainer>
    </ErrorBoundary>
  );
}
