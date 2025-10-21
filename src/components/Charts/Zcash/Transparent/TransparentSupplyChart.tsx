import DefaultSelect from "@/components/DefaultSelect";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/shadcn/select";
import { useInMobile } from "@/hooks/useInMobile";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { formatNumberShort, getSupplyData } from "@/lib/chart/helpers";
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
import ChartHeader from "../../ChartHeader";
import ChartContainer from "../ChartContainer";

type TransparentSupplyChartProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

export default function TransparentSupplyChart(
  props: TransparentSupplyChartProps
) {
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("all");
  const [supplyData, setSupplyData] = useState<SupplyData[]>([]);

  const fontSize = useResponsiveFontSize();
  const isMobile = useInMobile();

  useEffect(() => {
    const controller = new AbortController();

    const fetchSupplyData = async () => {
      setLoading(true);

      try {
        const supply = await getSupplyData(
          DATA_URL.transparentSupplyUrl,
          controller.signal
        );
        setSupplyData(supply || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Error fetching supply data:", err);
      }
    };

    setTimeout(() => {
      fetchSupplyData();
    }, 2000);

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const years = getAvailableYears();
    if (!years.includes(selectedYear)) {
      setSelectedYear("all");
    }
  }, [selectedYear, supplyData]);

  const extractYear = (dateStr: string) => {
    const parsed = new Date(dateStr);
    return parsed.getFullYear().toString();
  };

  const getAvailableYears = () => {
    // Filter out invalid dates and ensure we have data
    const validData = supplyData.filter(
      (d) => d && d.close && !isNaN(new Date(d.close).getTime())
    );

    if (validData.length === 0) {
      return ["all"];
    }

    const years = [
      ...new Set(validData.map((d) => extractYear(d.close))),
    ].sort();
    return ["all", ...years];
  };

  // Filter data by selected year
  const filteredData =
    selectedYear === "all"
      ? supplyData
      : supplyData.filter((d) => extractYear(d.close) === selectedYear);

  // Get latest supply from filtered data
  const latestSupply = filteredData[filteredData.length - 1]?.supply || 0;

  return (
    <ErrorBoundary fallback={"Failed to load Shielded Supply Chart"}>
      <ChartHeader title="Transparent Supply Overview">
        <div className="flex flex-wrap gap-16 items-center">
          {/*  Year Dropdown */}
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
            <span className="font-medium">Total Transparent:</span>{" "}
            {latestSupply.toLocaleString()} ZEC
          </div>
        </div>
      </ChartHeader>

      <ChartContainer ref={props.chartRef} loading={loading}>
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="supplyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--chart-7))"
                stopOpacity={0.6}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--chart-7))"
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis
            dataKey="close"
            tick={{ fontSize, fill: "#94a3b8" }}
            interval={isMobile ? 10 : "preserveStartEnd"}
            minTickGap={isMobile ? 10 : 30}
            tickCount={isMobile ? 4 : 8}
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
                    style={{ color: "hsl(var(--chart-7))" }}
                  >
                    <span>Supply</span>
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
            stroke="hsl(var(--chart-7))"
            fill="url(#supplyGradient)"
            name="Transparent Supply"
          />
        </AreaChart>
      </ChartContainer>
    </ErrorBoundary>
  );
}
