// Key fixes for production stability:

import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { DATA_URL } from "@/lib/chart/data-url";
import { RefObject, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import ChartHeader from "../../ChartHeader";
import ChartContainer from "../ChartContainer";

type ZcashData = {
  Dates: string;
  Transactions: string;
  Transparent_Transfer_TXs: string;
  Sapling_Transfer_TXs: string;
  Orchard_Transfer_TXs: string;
  Total_Transfer_TXs: string;
  Total_Transparent_TXs: string;
  Coinbase_percent: string;
  Total_Sapling_TXs: string;
  Net_Sapling_Flow: string;
  Total_Orchard_TXs: string;
  Net_Orchard_Flow: string;
  Total_Shielded_Supply: string;
  Total_Lockbox_Supply: string;
  Zebra_Nodes: string;
  Zcashd_Nodes: string;
  Total_Node_Count: string;
  Closing_Price: string;
  Shielded_Market_Cap: string;
  Shielded_Transaction_Percentage: string;
};

type ShieldedStatsProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

function ShieldedStats({ chartRef }: ShieldedStatsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "transactions" | "price" | "nodes" | "shielded" | "comparison"
  >("transactions");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(DATA_URL.zcashShieldedStatsUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw: ZcashData[] = await res.json();

        const processedData = raw.map((item) => ({
          date: item.Dates,
          transactions: parseInt(item.Transactions) || 0,
          transparentTxs: parseInt(item.Total_Transparent_TXs) || 0,
          saplingTxs: parseInt(item.Sapling_Transfer_TXs) || 0,
          orchardTxs: parseInt(item.Orchard_Transfer_TXs) || 0,
          totalTransferTxs: parseInt(item.Total_Transfer_TXs) || 0,
          totalTransparentTxs: parseInt(item.Total_Transparent_TXs) || 0,
          totalSaplingTxs: parseInt(item.Total_Sapling_TXs) || 0,
          totalOrchardTxs: parseInt(item.Total_Orchard_TXs) || 0,
          netSaplingFlow: parseFloat(item.Net_Sapling_Flow) || 0,
          netOrchardFlow: parseFloat(item.Net_Orchard_Flow) || 0,
          totalShieldedSupply: parseFloat(item.Total_Shielded_Supply) || 0,
          totalLockboxSupply: parseFloat(item.Total_Lockbox_Supply) || 0,
          zebraNodes: parseInt(item.Zebra_Nodes) || 0,
          zcashdNodes: parseInt(item.Zcashd_Nodes) || 0,
          totalNodes: parseInt(item.Total_Node_Count) || 0,
          closingPrice: parseFloat(item.Closing_Price) || 0,
          shieldedMarketCap: parseFloat(item.Shielded_Market_Cap) || 0,
          shieldedPercentage:
            parseFloat(item.Shielded_Transaction_Percentage) || 0,
        }));

        setChartData(processedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatValue = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toFixed(2)}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${
                typeof entry.value === "number"
                  ? formatValue(entry.value)
                  : entry.value
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // FIX 1: Use consistent height prop (string "100%")
  const renderTransactionChart = () => (
    <div className="w-full" style={{ height: "450px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#64748b" fontSize={12} tickFormatter={formatValue} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="transparentTxs"
            name="Transparent TXs"
            fill="hsl(var(--chart-1))"
            opacity={0.8}
          />
          <Bar
            dataKey="saplingTxs"
            name="Sapling TXs"
            fill="hsl(var(--chart-2))"
            opacity={0.8}
          />
          <Bar
            dataKey="orchardTxs"
            name="Orchard TXs"
            fill="hsl(var(--chart-3))"
            opacity={0.8}
          />
          <Line
            type="monotone"
            dataKey="shieldedPercentage"
            name="Shielded %"
            stroke="hsl(var(--chart-5))"
            strokeWidth={2}
            yAxisId="right"
            dot={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );

  const renderPriceChart = () => (
    <div className="w-full" style={{ height: "450px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="closingPrice"
            name="Closing Price"
            stroke="hsl(var(--chart-1))"
            strokeWidth={3}
            dot={false}
          />
          <Area
            dataKey="shieldedMarketCap"
            name="Shielded Market Cap"
            fill="hsl(var(--chart-2))"
            stroke="hsl(var(--chart-2))"
            fillOpacity={0.3}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );

  const renderNodeChart = () => (
    <div className="w-full" style={{ height: "450px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="zcashdNodes"
            name="Zcashd Nodes"
            fill="hsl(var(--chart-1))"
            opacity={0.8}
          />
          <Bar
            dataKey="zebraNodes"
            name="Zebra Nodes"
            fill="hsl(var(--chart-2))"
            opacity={0.8}
          />
          <Line
            type="monotone"
            dataKey="totalNodes"
            name="Total Nodes"
            stroke="hsl(var(--chart-5))"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );

  const renderShieldedChart = () => (
    <div className="w-full" style={{ height: "450px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            yAxisId="left"
            stroke="#64748b"
            fontSize={12}
            tickFormatter={formatValue}
            orientation="left"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#64748b"
            fontSize={12}
            tickFormatter={formatValue}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            yAxisId="left"
            dataKey="totalShieldedSupply"
            name="Total Shielded Supply"
            fill="hsl(var(--chart-2))"
            stroke="hsl(var(--chart-2))"
            fillOpacity={0.3}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="totalLockboxSupply"
            name="Total Lockbox Supply"
            stroke="hsl(var(--chart-5))"
            strokeWidth={2}
            dot={false}
          />
          <Area
            yAxisId="right"
            dataKey="totalTransferTxs"
            name="Total Transfer TXs"
            fill="hsl(var(--chart-1))"
            stroke="hsl(var(--chart-1))"
            fillOpacity={0.4}
          />
          <Area
            yAxisId="right"
            dataKey="totalTransparentTxs"
            name="Total Transparent TXs"
            fill="hsl(var(--chart-6))"
            stroke="hsl(var(--chart-6))"
            fillOpacity={0.4}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="totalSaplingTxs"
            name="Total Sapling TXs"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="totalOrchardTxs"
            name="Total Orchard TXs"
            stroke="hsl(var(--chart-4))"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );

  const latestData = chartData[chartData.length - 1] || {};
  const previousData = chartData[chartData.length - 2] || {};

  const calculateChange = (current: number, previous: number) => {
    return previous ? ((current - previous) / previous) * 100 : 0;
  };

  return (
    <ErrorBoundary fallback="Failed to load Zcash dashboard">
      <ChartHeader title="Zcash Network Analytics"></ChartHeader>
      <p className="dark:text-slate-400 mt-[-20] mb-2 text-sm font-light self-start">
        Comprehensive overview of Zcash network metrics and performance
        indicators
      </p>

      <ChartContainer ref={chartRef} loading={loading} height="auto">
        <div className="w-full">
          {/* FIX 2: Use consistent grid with min-width to prevent collapse */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Price",
                value: formatCurrency(latestData.closingPrice || 0),
                change: calculateChange(
                  latestData.closingPrice || 0,
                  previousData.closingPrice || 0
                ),
              },
              {
                label: "Total Transactions",
                value: formatValue(latestData.transactions || 0),
                change: calculateChange(
                  latestData.transactions || 0,
                  previousData.transactions || 0
                ),
              },
              {
                label: "Shielded TX %",
                value: `${((latestData.shieldedPercentage || 0) * 100).toFixed(
                  1
                )}%`,
                change: calculateChange(
                  latestData.shieldedPercentage || 0,
                  previousData.shieldedPercentage || 0
                ),
              },
              {
                label: "Total Nodes",
                value: latestData.totalNodes || 0,
                change: calculateChange(
                  latestData.totalNodes || 0,
                  previousData.totalNodes || 0
                ),
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 min-w-0"
              >
                <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {stat.label}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {stat.value}
                </div>
                <div
                  className={`text-sm ${
                    stat.change > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>

          {/* FIX 3: Use grid instead of flex-wrap for consistent layout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {[
              { key: "transactions", label: "Transactions" },
              { key: "price", label: "Price & Market Cap" },
              { key: "nodes", label: "Network Nodes" },
              { key: "shielded", label: "Shielded Metrics" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* FIX 4: Fixed height container for chart area */}
          <div className="bg-white dark:bg-gray-900 p-2 md:p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            {activeTab === "transactions" && renderTransactionChart()}
            {activeTab === "price" && renderPriceChart()}
            {activeTab === "nodes" && renderNodeChart()}
            {activeTab === "shielded" && renderShieldedChart()}
          </div>
        </div>
      </ChartContainer>
    </ErrorBoundary>
  );
}

export default ShieldedStats;
