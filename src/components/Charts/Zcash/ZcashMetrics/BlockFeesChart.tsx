import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { useInMobile } from "@/hooks/useInMobile";
import { formatNumberShort } from "@/lib/chart/helpers";
import DefaultSelect from "@/components/DefaultSelect";
import { RefObject, useEffect, useState } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartHeader from "../../ChartHeader";
import ChartContainer from "../ChartContainer";

type BlockFeesChartProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

type BlockFeesData = {
  block: number;
  fees: number;
  blockStr: string;
};

export default function BlockFeesChart(props: BlockFeesChartProps) {
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("all");
  const [blockFeesData, setBlockFeesData] = useState<BlockFeesData[]>([]);
  const [zecPrice, setZecPrice] = useState<number | null>(null);

  const fontSize = useResponsiveFontSize();
  const isMobile = useInMobile();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch block fees data
        const feesResponse = await fetch('/data/zcash/blockFeesZEC.json', {
          signal: controller.signal,
        });
        const feesJson = await feesResponse.json();

        // Transform data
        const transformed: BlockFeesData[] = feesJson.map((item: any) => ({
          block: parseInt(item.Block),
          fees: parseFloat(item.Fees),
          blockStr: item.Block,
        }));

        setBlockFeesData(transformed);

        // Fetch ZEC price for USD conversion
        try {
          const priceResponse = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=zcash&vs_currencies=usd',
            { signal: controller.signal }
          );
          const priceData = await priceResponse.json();
          setZecPrice(priceData.zcash?.usd || null);
        } catch (priceError) {
          console.warn('Could not fetch ZEC price:', priceError);
        }

        setLoading(false);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error("Error fetching block fees data:", err);
        }
        setLoading(false);
      }
    };

    setTimeout(() => {
      fetchData();
    }, 2000);

    return () => {
      controller.abort();
    };
  }, []);

  // Extract year from block number (approximate)
  // Zcash launched Oct 2016, ~75 seconds per block
  const extractYear = (blockNum: number) => {
    const genesisDate = new Date('2016-10-28');
    const blockTime = 75; // seconds per block
    const blockDate = new Date(genesisDate.getTime() + blockNum * blockTime * 1000);
    return blockDate.getFullYear().toString();
  };

  const getAvailableYears = () => {
    const years = [...new Set(blockFeesData.map((d) => extractYear(d.block)))].sort();
    return ["all", ...years];
  };

  const filterByYear = (data: BlockFeesData[]) =>
    selectedYear === "all"
      ? data
      : data.filter((d) => extractYear(d.block) === selectedYear);

  const filteredData = filterByYear(blockFeesData);

  // Calculate stats
  const avgFees = filteredData.length > 0
    ? filteredData.reduce((sum, item) => sum + item.fees, 0) / filteredData.length
    : 0;

  const maxFees = filteredData.length > 0
    ? Math.max(...filteredData.map(item => item.fees))
    : 0;

  const totalFees = filteredData.reduce((sum, item) => sum + item.fees, 0);

  // Downsample for performance
  const THROTTLE = 10;
  const downsampleData = (data: BlockFeesData[], interval: number, keepLast = 50) => {
    const cutoff = Math.max(0, data.length - keepLast);
    const head = data.slice(0, cutoff).filter((_, i) => i % interval === 0);
    const tail = data.slice(cutoff);
    return [...head, ...tail];
  };

  const renderedData = selectedYear === "all" 
    ? downsampleData(filteredData, THROTTLE)
    : filteredData;

  return (
    <ErrorBoundary fallback={"Failed to load Block Fees Chart"}>
      <ChartHeader title="Block Fees Over Time">
        <div className="flex sm:gap-20 justify-between gap-4 py-4 md:py-0 items-center">
          {/* Year Dropdown */}
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium">Year</label>
            <DefaultSelect
              value={selectedYear}
              onChange={setSelectedYear}
              options={getAvailableYears()}
              className="w-28 dark:border-slate-700"
              optionClassName="hover:cursor-pointer bg-slate-50 dark:bg-slate-800"
              renderOption={(year) => (year === "all" ? "All" : year)}
            />
          </div>

          {/* Stats Display */}
          <div className="md:flex hidden text-sm">
            <span className="font-medium">Avg Fees:</span>{" "}
            {avgFees.toFixed(6)} ZEC
            {zecPrice && ` (≈ $${(avgFees * zecPrice).toFixed(2)})`}
          </div>

          {zecPrice && (
            <div className="md:flex hidden text-sm text-slate-600 dark:text-slate-400">
              1 ZEC ≈ ${zecPrice.toFixed(2)} USD
            </div>
          )}
        </div>

        {/* Mobile stats */}
        <div className="flex md:hidden text-sm">
          <span className="font-medium">Avg Fees:</span>{" "}
          {avgFees.toFixed(6)} ZEC
          {zecPrice && ` (≈ $${(avgFees * zecPrice).toFixed(2)})`}
        </div>
      </ChartHeader>

      {/* Chart Container */}
      <ChartContainer ref={props.chartRef} loading={loading}>
        <LineChart data={renderedData} key={selectedYear}>
          <defs>
            <linearGradient id="feesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--chart-1))"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--chart-1))"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          
          <XAxis
            dataKey="block"
            tick={{ fontSize, fill: "#94a3b8" }}
            tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
            interval={isMobile ? 20 : "preserveStartEnd"}
            minTickGap={isMobile ? 10 : 30}
          />
          
          <YAxis
            tick={{ fontSize, fill: "#94a3b8" }}
            tickFormatter={(val) => val.toFixed(4)}
            label={{ 
              value: 'Fees (ZEC)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize, fill: "#94a3b8" }
            }}
          />
          
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;

              const fees = payload[0].value as number;
              const parsedBlock = label != null ? parseInt(String(label)) : NaN;
              
              return (
                <div
                  className="rounded-md px-3 py-2 shadow-md border text-sm"
                  style={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    color: "#f1f5f9",
                  }}
                >
                  <p className="text-slate-100 font-semibold mb-2">
                    Block: {Number.isNaN(parsedBlock) ? String(label ?? "Unknown") : parsedBlock.toLocaleString()}
                  </p>
                  <div className="flex justify-between gap-4">
                    <span style={{ color: payload[0].color }}>Fees</span>
                    <span className="text-slate-50">
                      {fees.toFixed(7)} ZEC
                    </span>
                  </div>
                  {zecPrice && (
                    <div className="flex justify-between gap-4 text-green-400">
                      <span>USD Value</span>
                      <span className="text-slate-50">
                        ${(fees * zecPrice).toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              );
            }}
          />

          <Line
            type="monotone"
            dataKey="fees"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            name="Block Fees"
            dot={false}
            isAnimationActive={true}
            animationDuration={800}
          />

          <Legend
            align="center"
            content={() => (
              <div className="pt-5 flex justify-center gap-6 text-sm mt-2 text-slate-600 dark:text-slate-300 flex-wrap">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 inline-block rounded-sm"
                    style={{ background: "hsl(var(--chart-1))" }}
                  />
                  <p>Block Fees — {filteredData.length.toLocaleString()} samples</p>
                </div>
                <div className="flex items-center gap-2">
                  <p>
                    <span className="font-medium">Total:</span> {totalFees.toFixed(4)} ZEC
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p>
                    <span className="font-medium">Max:</span> {maxFees.toFixed(7)} ZEC
                  </p>
                </div>
              </div>
            )}
          />
        </LineChart>
      </ChartContainer>
    </ErrorBoundary>
  );
}