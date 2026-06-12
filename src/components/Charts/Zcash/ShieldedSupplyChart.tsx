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
  Line,
} from "recharts";
import ChartHeader from "../ChartHeader";
import ChartContainer from "./ChartContainer";
import { useInMobile } from "@/hooks/useInMobile";
import DefaultSelect from "@/components/DefaultSelect";

type PoolKey = "all" | PoolType;
type Network = "mainnet" | "testnet";
type ShieldedSupplyChartProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

export default function ShieldedSupplyChart(props: ShieldedSupplyChartProps) {
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedPool, setSelectedPool] = useState<PoolKey>("all");
  const [network, setNetwork] = useState<Network>("mainnet");
  const fontSize = useResponsiveFontSize();
  const isMobile = useInMobile();
  const [orchardSupplyData, setOrchardSupplyData] = useState<SupplyData[]>([]);
  const [saplingSupplyData, setSaplingSupplyData] = useState<SupplyData[]>([]);
  const [sproutSupplyData, setSproutSupplyData] = useState<SupplyData[]>([]);
  const [sproutVisible, setSproutVisible] = useState(true);
  const [saplingVisible, setSaplingVisible] = useState(true);
  const [orchardVisible, setOrchardVisible] = useState(true);
  const [totalVisible, setTotalVisible] = useState(false);

  const getPoolUrl = (pool: "sprout" | "sapling" | "orchard") => {
    const mainUrl =
      pool === "sprout"
        ? DATA_URL.sproutUrl
        : pool === "sapling"
        ? DATA_URL.saplingUrl
        : DATA_URL.orchardUrl;
    if (network === "mainnet") return mainUrl;
    return mainUrl.replace("/zcash/", "/zcash/testnet/");
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const sproutUrl = getPoolUrl("sprout");
        const saplingUrl = getPoolUrl("sapling");
        const orchardUrl = getPoolUrl("orchard");
        const [sprout, sapling, orchard] = await Promise.all([
          getSupplyData(sproutUrl, controller.signal),
          getSupplyData(saplingUrl, controller.signal),
          getSupplyData(orchardUrl, controller.signal),
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
  }, [network]);

  useEffect(() => {
    setSelectedYear("all");
  }, [network]);

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
      dataMap[date] = { close: date, sprout: 0, sapling: 0, orchard: 0, total: 0 };
    }

    for (const d of sprout) if (dataMap[d.close]) dataMap[d.close].sprout = d.supply ?? 0;
    for (const d of sapling) if (dataMap[d.close]) dataMap[d.close].sapling = d.supply ?? 0;
    for (const d of orchard) if (dataMap[d.close]) dataMap[d.close].orchard = d.supply ?? 0;

    // Forward fill (carry forward last known value)
    let lastSprout = 0;
    let lastSapling = 0;
    let lastOrchard = 0;

    for (const date of dateArray) {
      if (dataMap[date].sprout) lastSprout = dataMap[date].sprout;
      else dataMap[date].sprout = lastSprout;

      if (dataMap[date].sapling) lastSapling = dataMap[date].sapling;
      else dataMap[date].sapling = lastSapling;

      if (dataMap[date].orchard) lastOrchard = dataMap[date].orchard;
      else dataMap[date].orchard = lastOrchard;

      dataMap[date].total =
        (dataMap[date].sprout || 0) +
        (dataMap[date].sapling || 0) +
        (dataMap[date].orchard || 0);
    }

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
  const latestTotals: Record<"sprout" | "sapling" | "orchard", number> = {
    sprout: latest.sprout || 0,
    sapling: latest.sapling || 0,
    orchard: latest.orchard || 0,
  };

  const calculateTotalShielded = () =>
    latestTotals.orchard + latestTotals.sapling + latestTotals.sprout;

  const getCurrentDisplay = () => {
    if (selectedPool !== "all") {
      const poolName = selectedPool.charAt(0).toUpperCase() + selectedPool.slice(1);
      return { label: `${poolName} Shielded`, value: latestTotals[selectedPool] };
    }
    if (totalVisible) {
      return { label: "Total Shielded", value: calculateTotalShielded() };
    }
    const visible: ("sprout" | "sapling" | "orchard")[] = [];
    if (sproutVisible) visible.push("sprout");
    if (saplingVisible) visible.push("sapling");
    if (orchardVisible) visible.push("orchard");
    const count = visible.length;
    if (count === 3 || count === 0) {
      return { label: "Total Shielded", value: calculateTotalShielded() };
    }
    if (count === 1) {
      const pool = visible[0];
      const name = pool.charAt(0).toUpperCase() + pool.slice(1);
      return { label: `${name} Shielded`, value: latestTotals[pool] };
    }
    const sorted = [...visible].sort();
    const name = sorted.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" and ");
    const value = sorted.reduce((sum, p) => sum + latestTotals[p], 0);
    return { label: `${name} Shielded`, value };
  };

  const display = getCurrentDisplay();

  const toggleSprout = () => {
    const newValue = !sproutVisible;
    setSproutVisible(newValue);
    if (newValue) setTotalVisible(false);
  };
  const toggleSapling = () => {
    const newValue = !saplingVisible;
    setSaplingVisible(newValue);
    if (newValue) setTotalVisible(false);
  };
  const toggleOrchard = () => {
    const newValue = !orchardVisible;
    setOrchardVisible(newValue);
    if (newValue) setTotalVisible(false);
  };
  const toggleTotal = () => {
    const newValue = !totalVisible;
    setTotalVisible(newValue);
    if (newValue) {
      setSproutVisible(false);
      setSaplingVisible(false);
      setOrchardVisible(false);
    }
  };

  const legendContent = useMemo(() => (
    <div className="flex justify-center gap-8 text-sm mt-4 flex-wrap">
      {selectedPool === "all" ? (
        <>
          <button onClick={toggleSprout} className={`flex items-center gap-2 cursor-pointer transition-colors ${sproutVisible ? "" : "opacity-40 line-through"}`}>
            <span className="inline-block w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]" />
            <span className="font-medium">Sprout</span>
          </button>
          <button onClick={toggleSapling} className={`flex items-center gap-2 cursor-pointer transition-colors ${saplingVisible ? "" : "opacity-40 line-through"}`}>
            <span className="inline-block w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]" />
            <span className="font-medium">Sapling</span>
          </button>
          <button onClick={toggleOrchard} className={`flex items-center gap-2 cursor-pointer transition-colors ${orchardVisible ? "" : "opacity-40 line-through"}`}>
            <span className="inline-block w-3 h-3 rounded-full bg-[hsl(var(--chart-3))]" />
            <span className="font-medium">Orchard</span>
          </button>
          <button onClick={toggleTotal} className={`flex items-center gap-2 cursor-pointer transition-colors ${totalVisible ? "" : "opacity-40 line-through"}`} style={{ color: totalVisible ? "#06B6D4" : undefined }}>
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: "#06B6D4" }} />
            <span className="font-medium">Total Shielded</span>
          </button>
        </>
      ) : (
        <button className="flex items-center gap-2 cursor-pointer">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: `hsl(var(--chart-${selectedPool === "sprout" ? 1 : selectedPool === "sapling" ? 2 : 3}))` }} />
          <span className="font-medium">{selectedPool.charAt(0).toUpperCase() + selectedPool.slice(1)} Pool</span>
        </button>
      )}
    </div>
  ), [selectedPool, sproutVisible, saplingVisible, orchardVisible, totalVisible]);

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

  const chartTitle =
    (network === "testnet" ? "Testnet " : "") +
    (selectedPool === "all" ? "Shielded Supply Overview" : `${selectedPool.charAt(0).toUpperCase() + selectedPool.slice(1)} Pool Supply`);

  return (
    <ErrorBoundary fallback={"Failed to load Shielded Supply Chart"}>
      <ChartHeader title={chartTitle} />
      <div className="px-4 sm:px-8 mt-4 mb-6">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
          {/* IMPROVED NETWORK TOGGLE */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-400 whitespace-nowrap">Network</label>
            <div className="relative inline-flex bg-slate-800/80 rounded-full p-0.5 text-xs font-medium border border-slate-700">
              <div
                className={`absolute top-0.5 bottom-0.5 rounded-full transition-all duration-200 shadow-sm ${
                  network === "mainnet"
                    ? "bg-emerald-700 left-0.5 right-[calc(50%+2px)]"
                    : "bg-amber-700 left-[calc(50%+2px)] right-0.5"
                }`}
              />
              <button
                onClick={() => setNetwork("mainnet")}
                className={`relative z-10 px-3 py-0.5 rounded-full transition-colors ${network === "mainnet" ? "text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                Mainnet
              </button>
              <button
                onClick={() => setNetwork("testnet")}
                className={`relative z-10 px-3 py-0.5 rounded-full transition-colors ${network === "testnet" ? "text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                Testnet
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
            <label className="text-sm font-medium whitespace-nowrap">Pool:</label>
            <DefaultSelect
              value={selectedPool}
              onChange={setSelectedPool}
              options={["all", "sprout", "sapling", "orchard"]}
              className="w-44"
              renderOption={(val) => (val === "all" ? "All Pools" : val.charAt(0).toUpperCase() + val.slice(1))}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
            <label className="text-sm font-medium whitespace-nowrap">Year</label>
            <DefaultSelect
              value={selectedYear}
              onChange={setSelectedYear}
              options={getAvailableYears(selectedPool).map((year) => year.toString())}
              className="w-28"
              renderOption={(year) => (year === "all" ? "All" : year)}
            />
          </div>

          <div className="text-sm font-medium whitespace-nowrap text-center w-full md:w-auto">
            {display.label}: {display.value.toLocaleString()} ZEC
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
            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.08} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis dataKey="close" tick={{ fontSize: fontSize * 0.75, fill: "#94a3b8" }} interval={Math.max(1, Math.floor(poolData.length / 10))} angle={-45} textAnchor="end" height={70} />
          <YAxis tick={{ fontSize, fill: "#94a3b8" }} tickFormatter={(val: any) => formatNumberShort(val)} />
          <Tooltip content={CustomTooltip} />
          <Legend content={legendContent} />

          {selectedPool === "all" ? (
            totalVisible ? (
              <>
                <Area type="monotone" dataKey="total" stroke="#06B6D4" fill="url(#totalGradient)" name="Total Shielded" strokeWidth={2} />
                <Line type="monotone" dataKey="total" stroke="#06B6D4" strokeWidth={3.5} dot={false} strokeLinejoin="round" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px #06B6D4) drop-shadow(0 0 16px #06B6D440)' }} />
              </>
            ) : (
              <>
                <Area type="monotone" dataKey="sprout" stroke={getColorForPool("sprout")} fill="url(#sproutGradient)" name="Sprout Pool" hide={!sproutVisible} />
                <Area type="monotone" dataKey="sapling" stroke={getColorForPool("sapling")} fill="url(#saplingGradient)" name="Sapling Pool" hide={!saplingVisible} dot={false} connectNulls={true} />
                <Area type="monotone" dataKey="orchard" stroke={getColorForPool("orchard")} fill="url(#orchardGradient)" name="Orchard Pool" hide={!orchardVisible} />
              </>
            )
          ) : (
            <Area type="monotone" dataKey="supply" stroke={`hsl(var(--chart-${selectedPool === "sprout" ? 1 : selectedPool === "sapling" ? 2 : 3}))`} fill={`url(#${selectedPool}Gradient)`} name={`${selectedPool.charAt(0).toUpperCase() + selectedPool.slice(1)} Pool`} />
          )}
        </AreaChart>
      </ChartContainer>
    </ErrorBoundary>
  );
}