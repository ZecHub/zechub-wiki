import { useEffect, useState, useMemo, RefObject } from "react";
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
import { DATA_URL } from "@/lib/chart/data-url";

type ZcashDashboardProps = {
  chartRef: RefObject<HTMLDivElement | null>;
};

// Types
type ZcashRawData = {
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

type ProcessedData = {
  date: string;
  transactions: number;
  transparentTxs: number;
  saplingTxs: number;
  orchardTxs: number;
  totalTransferTxs: number;
  totalTransparentTxs: number;
  totalSaplingTxs: number;
  totalOrchardTxs: number;
  netSaplingFlow: number;
  netOrchardFlow: number;
  totalShieldedSupply: number;
  totalLockboxSupply: number;
  zebraNodes: number;
  zcashdNodes: number;
  totalNodes: number;
  closingPrice: number;
  shieldedMarketCap: number;
  shieldedPercentage: number;
};

type TabKey = "transactions" | "price" | "nodes" | "shielded";

// Utility Functions
const formatValue = (value: number): string => {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(0);
};

const formatCurrency = (value: number): string => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toFixed(2)}`;
};

const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

const calculateChange = (current: number, previous: number): number => {
  return previous ? ((current - previous) / previous) * 100 : 0;
};

const parseNumber = (value: string): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

const parseInt10 = (value: string): number => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
};

// Components
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-900 dark:text-white mb-2">
        {label}
      </p>
      {payload.map((entry: any, index: number) => {
        const formattedValue = entry.name.includes("%")
          ? formatPercentage(entry.value)
          : formatValue(entry.value);

        return (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${formattedValue}`}
          </p>
        );
      })}
    </div>
  );
};

const StatCard = ({
  label,
  value,
  change,
}: {
  label: string;
  value: string | number;
  change: number;
}) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1 truncate">
      {value}
    </div>
    <div
      className={`text-sm font-medium ${
        change >= 0 ? "text-green-600" : "text-red-600"
      }`}
    >
      {change >= 0 ? "+" : ""}
      {change.toFixed(1)}%
    </div>
  </div>
);

const TabButton = ({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
      active
        ? "bg-blue-600 text-white shadow-md"
        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`}
  >
    {label}
  </button>
);

const ChartWrapper = ({ children }: { children: React.ReactElement }) => (
  <div className="w-full h-[450px]">
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  </div>
);

// Main Component
export default function ZcashDashboard({ chartRef }: ZcashDashboardProps) {
  const [data, setData] = useState<ProcessedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("transactions");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(DATA_URL.zcashShieldedStatsUrl);
        if (!response.ok)
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const rawData: ZcashRawData[] = await response.json();

        const processed = rawData.map((item) => ({
          date: item.Dates,
          transactions: parseInt10(item.Transactions),
          transparentTxs: parseInt10(item.Total_Transparent_TXs),
          saplingTxs: parseInt10(item.Sapling_Transfer_TXs),
          orchardTxs: parseInt10(item.Orchard_Transfer_TXs),
          totalTransferTxs: parseInt10(item.Total_Transfer_TXs),
          totalTransparentTxs: parseInt10(item.Total_Transparent_TXs),
          totalSaplingTxs: parseInt10(item.Total_Sapling_TXs),
          totalOrchardTxs: parseInt10(item.Total_Orchard_TXs),
          netSaplingFlow: parseNumber(item.Net_Sapling_Flow),
          netOrchardFlow: parseNumber(item.Net_Orchard_Flow),
          totalShieldedSupply: parseNumber(item.Total_Shielded_Supply),
          totalLockboxSupply: parseNumber(item.Total_Lockbox_Supply),
          zebraNodes: parseInt10(item.Zebra_Nodes),
          zcashdNodes: parseInt10(item.Zcashd_Nodes),
          totalNodes: parseInt10(item.Total_Node_Count),
          closingPrice: parseNumber(item.Closing_Price),
          shieldedMarketCap: parseNumber(item.Shielded_Market_Cap),
          shieldedPercentage: parseNumber(item.Shielded_Transaction_Percentage),
        }));

        setData(processed);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    if (data.length < 2) return [];

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];

    return [
      {
        label: "Price",
        value: formatCurrency(latest.closingPrice),
        change: calculateChange(latest.closingPrice, previous.closingPrice),
      },
      {
        label: "Total Transactions",
        value: formatValue(latest.transactions),
        change: calculateChange(latest.transactions, previous.transactions),
      },
      {
        label: "Shielded TX %",
        value: formatPercentage(latest.shieldedPercentage),
        change: calculateChange(
          latest.shieldedPercentage,
          previous.shieldedPercentage
        ),
      },
      {
        label: "Total Nodes",
        value: latest.totalNodes.toFixed(0),
        change: calculateChange(latest.totalNodes, previous.totalNodes),
      },
    ];
  }, [data]);

  const commonAxisProps = {
    stroke: "#64748b",
    fontSize: 12,
  };

  const commonXAxisProps = {
    ...commonAxisProps,
    dataKey: "date",
    angle: -45,
    textAnchor: "end" as const,
    height: 80,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-600 dark:text-gray-400">
          Loading Zcash data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div ref={chartRef} className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Zcash Network Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive overview of Zcash network metrics and performance
          indicators
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "transactions" as TabKey, label: "Transactions" },
          { key: "price" as TabKey, label: "Price & Market Cap" },
          { key: "nodes" as TabKey, label: "Network Nodes" },
          { key: "shielded" as TabKey, label: "Shielded Metrics" },
        ].map((tab) => (
          <TabButton
            key={tab.key}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            label={tab.label}
          />
        ))}
      </div>

      {/* Chart Container */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        {activeTab === "transactions" && (
          <ChartWrapper>
            <ComposedChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-slate-700"
              />
              <XAxis {...commonXAxisProps} />
              <YAxis {...commonAxisProps} tickFormatter={formatValue} />
              <YAxis
                yAxisId="right"
                orientation="right"
                {...commonAxisProps}
                tickFormatter={formatPercentage}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="transparentTxs"
                name="Transparent"
                fill="#3b82f6"
                opacity={0.8}
              />
              <Bar
                dataKey="saplingTxs"
                name="Sapling"
                fill="#10b981"
                opacity={0.8}
              />
              <Bar
                dataKey="orchardTxs"
                name="Orchard"
                fill="#8b5cf6"
                opacity={0.8}
              />
              <Line
                type="monotone"
                dataKey="shieldedPercentage"
                name="Shielded %"
                stroke="#f59e0b"
                strokeWidth={3}
                yAxisId="right"
                dot={false}
              />
            </ComposedChart>
          </ChartWrapper>
        )}

        {activeTab === "price" && (
          <ChartWrapper>
            <ComposedChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-slate-700"
              />
              <XAxis {...commonXAxisProps} />
              <YAxis
                yAxisId="left"
                {...commonAxisProps}
                tickFormatter={formatCurrency}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                {...commonAxisProps}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                yAxisId="left" // Add this
                dataKey="shieldedMarketCap"
                name="Shielded Market Cap"
                fill="#3b82f6"
                stroke="#3b82f6"
                fillOpacity={0.2}
              />
              <Line
                yAxisId="right" // Add this
                type="monotone"
                dataKey="closingPrice"
                name="Closing Price"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
              />
            </ComposedChart>
          </ChartWrapper>
        )}

        {activeTab === "nodes" && (
          <ChartWrapper>
            <ComposedChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-slate-700"
              />
              <XAxis {...commonXAxisProps} />
              <YAxis {...commonAxisProps} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="zcashdNodes"
                name="Zcashd Nodes"
                fill="#3b82f6"
                opacity={0.8}
              />
              <Bar
                dataKey="zebraNodes"
                name="Zebra Nodes"
                fill="#10b981"
                opacity={0.8}
              />
              <Line
                type="monotone"
                dataKey="totalNodes"
                name="Total Nodes"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={false}
              />
            </ComposedChart>
          </ChartWrapper>
        )}

        {activeTab === "shielded" && (
          <ChartWrapper>
            <ComposedChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-slate-700"
              />
              <XAxis {...commonXAxisProps} />
              <YAxis
                yAxisId="left"
                {...commonAxisProps}
                tickFormatter={formatValue}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                {...commonAxisProps}
                tickFormatter={formatValue}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                yAxisId="left"
                dataKey="totalShieldedSupply"
                name="Shielded Supply"
                fill="#3b82f6"
                stroke="#3b82f6"
                fillOpacity={0.2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalLockboxSupply"
                name="Lockbox Supply"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalSaplingTxs"
                name="Sapling TXs"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalOrchardTxs"
                name="Orchard TXs"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ChartWrapper>
        )}
      </div>
    </div>
  );
}
