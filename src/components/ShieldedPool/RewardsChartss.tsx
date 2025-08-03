// components/RewardCharts.tsx
"use client";

import { useState, useEffect } from "react";
import "chartjs-adapter-date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format, parse, parseISO } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface RewardData {
  Date: string;
  Staked_Ratio: string;
  Annual_Staking_Rewards_Ratio: string;
  Inflation_Rate: string;
}

interface RewardChartProps {
  DataUrlOptions: {
    namadaRewardUrl: string;
  };
}

const RewardCharts = ({ DataUrlOptions }: RewardChartProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [namadaRewards, setNamadaRewards] = useState<RewardData[]>([]);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">(
    "90d"
  );

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(DataUrlOptions.namadaRewardUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: RewardData[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }

        setNamadaRewards(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load reward data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();

    // Optional: Set up polling for live data
    const interval = setInterval(fetchRewards, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [DataUrlOptions.namadaRewardUrl]);

  // Filter data based on time range
  // Filter data based on time range
  const filteredData = (() => {
    if (timeRange === "all") return namadaRewards;

    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return namadaRewards.filter((item) => {
      const itemDate = parse(item.Date, "MM/dd/yyyy", new Date());
      return itemDate >= cutoffDate;
    });
  })();

  // Process data for chart
  const chartData = {
    labels: filteredData.map((item) =>
      parse(item.Date, "MM/dd/yyyy", new Date())
    ),
    datasets: [
      {
        label: "Staked Ratio (%)",
        data: filteredData.map((item) => parseFloat(item.Staked_Ratio) * 100),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y",
        tension: 0.1,
      },
      {
        label: "Annual Staking Rewards (%)",
        data: filteredData.map(
          (item) => parseFloat(item.Annual_Staking_Rewards_Ratio) * 100
        ),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        yAxisID: "y",
      },
      {
        label: "Inflation Rate (%)",
        data: filteredData.map((item) => parseFloat(item.Inflation_Rate) * 100),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        yAxisID: "y1",
      },
    ],
  };

  // Define allowed Chart.js time units
  type TimeUnit =
    | false
    | "millisecond"
    | "second"
    | "minute"
    | "hour"
    | "day"
    | "week"
    | "month"
    | "quarter"
    | "year"
    | undefined;
  const getTimeUnit = (range: typeof timeRange): TimeUnit => {
    if (range === "7d" || range === "30d" || range === "90d") return "day";
    if (range === "all") return "month";
    return "day";
  };

  const options : any = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time" as const,
        time: {
          parser: "MM/dd/yyyy",
          tooltipFormat: "MMM dd, yyyy",
          unit: timeRange === "7d" ? "day" : "month",
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Staked Ratio & Rewards (%)",
        },
        min: 30,
        max: 50,
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Inflation Rate (%)",
        },
        min: 0,
        max: 20,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Staking Economics Dashboard",
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            label += context.parsed.y.toFixed(2) + "%";
            return label;
          },
          afterLabel: function (context: any) {
            const date = format(new Date(context.label), "PP");
            return `Date: ${date}`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
        <p>Error loading reward data:</p>
        <p className="font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (namadaRewards.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-700">
        No reward data available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      <div className="w-full" style={{ height: "600px", position: "relative" }}>
        <Line
          data={chartData}
          options={options}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Current Staked Ratio</h3>
          <p className="text-2xl font-bold">
            {(
              parseFloat(
                namadaRewards[namadaRewards.length - 1]?.Staked_Ratio || "0"
              ) * 100
            ).toFixed(2)}
            %
          </p>
          <p className="text-sm text-gray-500">
            {format(
              parse(
                namadaRewards[namadaRewards.length - 1]?.Date || "",
                "MM/dd/yyyy",
                new Date()
              ),
              "PP"
            )}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">
            Current Annual Rewards
          </h3>
          <p className="text-2xl font-bold">
            {parseFloat(
              namadaRewards[namadaRewards.length - 1]
                ?.Annual_Staking_Rewards_Ratio || "0"
            ) * 100}
            %
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">Current Inflation</h3>
          <p className="text-2xl font-bold">
            {(
              parseFloat(
                namadaRewards[namadaRewards.length - 1]?.Inflation_Rate || "0"
              ) * 100
            ).toFixed(6)}
            %
          </p>
        </div>
      </div>
    </div>
  );
};

export default RewardCharts;
