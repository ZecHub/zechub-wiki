import DefaultSelect from "@/components/DefaultSelect";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useInMobile } from "@/hooks/useInMobile";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { formatNumberShort, getTotalSupplyData } from "@/lib/chart/helpers";
import { totalSupply } from "@/lib/chart/types";
import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartHeader from "../../ChartHeader";
import ChartContainer from "../ChartContainer";

type Network = "mainnet" | "testnet";

type TotalSupplyChartProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

export default function TotalSupplyChart(props: TotalSupplyChartProps) {
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("all");
  const [totalSupplyData, setTotalSupplyData] = useState<totalSupply[]>([]);
  const [network, setNetwork] = useState<Network>("mainnet");
  const fontSize = useResponsiveFontSize();
  const isMobile = useInMobile();

  useEffect(() => {
    const controller = new AbortController();
    const fetchSupplyData = async () => {
      setLoading(true);
      try {
        const mainUrl = DATA_URL.totalSupplyUrl;
        const url =
          network === "mainnet"
            ? mainUrl
            : mainUrl.replace("/zcash/", "/zcash/testnet/");
        const supply = await getTotalSupplyData(url, controller.signal);
        setTotalSupplyData(supply || []);
      } catch (err) {
        console.error("Error fetching total supply data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSupplyData();
    return () => controller.abort();
  }, [network]);

  const extractYear = useCallback((dateStr: string) => {
    const parsed = new Date(dateStr);
    return parsed.getFullYear().toString();
  }, []);

  const getAvailableYears = useCallback(() => {
    const validData = totalSupplyData.filter(
      (d) => d && d.close && !isNaN(new Date(d.close).getTime())
    );
    if (validData.length === 0) return ["all"];
    const years = [...new Set(validData.map((d) => extractYear(d.close)))].sort();
    return ["all", ...years];
  }, [totalSupplyData, extractYear]);

  const filteredData = useMemo(() => {
    return selectedYear === "all"
      ? totalSupplyData
      : totalSupplyData.filter((d) => extractYear(d.close) === selectedYear);
  }, [totalSupplyData, selectedYear, extractYear]);

  const latestSupply = filteredData[filteredData.length - 1]?.supply || 0;

  const chartTitle = `${network === "testnet" ? "Testnet " : ""}Total Supply Overview`;

  return (
    <ErrorBoundary fallback={"Failed to load Total Supply Chart"}>
      <ChartHeader title={chartTitle}>
        <div className="flex flex-wrap gap-16 items-center">
          <div className="relative flex rounded-full bg-slate-800/60 p-0.5 text-xs font-medium">
            <div
              className={`absolute top-0.5 bottom-0.5 rounded-full transition-all duration-200 shadow-sm ${
                network === "mainnet"
                  ? "bg-emerald-700 left-0.5 right-[calc(50%+2px)]"
                  : "bg-amber-700 left-[calc(50%+2px)] right-0.5"
              }`}
            />
            <button
              onClick={() => setNetwork("mainnet")}
              className={`relative z-10 px-3 py-0.5 rounded-full transition-colors ${
                network === "mainnet" ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Mainnet
            </button>
            <button
              onClick={() => setNetwork("testnet")}
              className={`relative z-10 px-3 py-0.5 rounded-full transition-colors ${
                network === "testnet" ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Testnet
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium">Year</label>
            <DefaultSelect
              value={selectedYear}
              onChange={setSelectedYear}
              options={getAvailableYears().map((year) => year.toString())}
              className="w-28 dark:border-slate-700"
              optionClassName="hover:cursor-pointer bg-slate-50 dark:bg-slate-800"
              renderOption={(year) => (year === "all" ? "All" : year)}
            />
          </div>
          <div className="text-sm">
            <span className="font-medium">Total Supply:</span>{" "}
            {latestSupply.toLocaleString()} ZEC
          </div>
        </div>
      </ChartHeader>

      <ChartContainer ref={props.chartRef} loading={loading}>
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="totalSupplyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.6} />
              <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="close"
            tick={{ fontSize: fontSize * 0.75, fill: "#94a3b8" }}
            interval={Math.max(1, Math.floor(filteredData.length / 10))}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis
            tick={{ fontSize, fill: "#94a3b8" }}
            tickFormatter={(val) => formatNumberShort(val)}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div
                  className="rounded-md px-3 py-2 shadow-md border text-sm"
                  style={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    color: "#f1f5f9",
                  }}
                >
                  <p className="text-slate-100 font-semibold mb-2">{label}</p>
                  <div
                    className="flex justify-between gap-4"
                    style={{ color: "hsl(var(--chart-4))" }}
                  >
                    <span>Total Supply</span>
                    <span className="text-slate-50">
                      {payload[0]?.value?.toLocaleString()} ZEC
                    </span>
                  </div>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="supply"
            stroke="hsl(var(--chart-4))"
            fill="url(#totalSupplyGradient)"
            name="Total Supply"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </ErrorBoundary>
  );
}
