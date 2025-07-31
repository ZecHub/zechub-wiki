"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import RangeSlider from "@/components/RangeSlider";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BLOCKS_PERIOD = 8064;
const ORCHARD_ACTIVATION = 1687104;

type ShieldedTransactionDatum = {
  height: number;
  sapling: number;
  sapling_filter: number;
  orchard: number;
  orchard_filter: number;
};

async function fetchTransactionData(
  url: string
): Promise<Array<ShieldedTransactionDatum>> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}

export default function TransactionsSummaryChart() {
  const [chartData, setChartData] = useState<ShieldedTransactionDatum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [pool, setPool] = useState<"default" | "orchard" | "sapling">(
    "default"
  );
  const [cumulative, setCumulative] = useState(true);
  const [filter, setFilter] = useState(true);

  const [startHeight, setStartHeight] = useState(0);
  const [endHeight, setEndHeight] = useState(Infinity);
  const [minHeight, setMinHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(Infinity);

  const fontSize = useResponsiveFontSize();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetchTransactionData(DATA_URL.txsummaryUrl)
      .then((data) => {
        setChartData(data);
        const heights = data.map((d) => d.height);
        setMinHeight(Math.min(...heights));
        setMaxHeight(Math.max(...heights));
        setEndHeight(Math.max(...heights));
      })
      .catch(setError)
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const processData = () => {
    let saplingSum = 0;
    let saplingFilterSum = 0;
    let orchardSum = 0;
    let orchardFilterSum = 0;

    const cumData = chartData.map((d) => {
      saplingSum += d.sapling;
      saplingFilterSum += d.sapling_filter;
      orchardSum += d.orchard;
      orchardFilterSum += d.orchard_filter;

      return {
        height: d.height,
        sapling: saplingSum,
        sapling_filter: saplingFilterSum,
        orchard: orchardSum || null,
        orchard_filter: orchardFilterSum || null,
      };
    });

    const last = cumData[cumData.length - 1];

    let filteredData: any[] = [];

    if (cumulative) {
      filteredData = cumData.filter(
        (d) =>
          (d.height >= startHeight &&
            d.height <= endHeight &&
            d.height % BLOCKS_PERIOD === 0) ||
          d.height === last.height
      );
    } else {
      saplingSum = 0;
      saplingFilterSum = 0;
      orchardSum = 0;
      orchardFilterSum = 0;

      chartData.forEach((d) => {
        saplingSum += d.sapling;
        saplingFilterSum += d.sapling_filter;
        orchardSum += d.orchard;
        orchardFilterSum += d.orchard_filter;

        if (
          (d.height >= startHeight &&
            d.height <= endHeight &&
            d.height % BLOCKS_PERIOD === 0) ||
          d.height === last.height
        ) {
          filteredData.push({
            height: d.height,
            sapling: saplingSum,
            sapling_filter: saplingSum - saplingFilterSum,
            orchard: orchardSum || null,
            orchard_filter:
              orchardFilterSum > 0 ? orchardSum - orchardFilterSum : null,
          });

          saplingSum = 0;
          saplingFilterSum = 0;
          orchardSum = 0;
          orchardFilterSum = 0;
        }
      });
    }

    if (pool === "orchard") {
      filteredData = filteredData.filter((d) => d.height >= ORCHARD_ACTIVATION);
    }

    return filteredData;
  };

  const chartDataset = processData();

  return (
    <ErrorBoundary fallback={"Failed to load Transaction Summary Chart"}>
      <div className="space-y-6">
        <div className="flex mt-12 ">
          <h3 className="text-lg font-semibold mb-4 flex-1">
            Transactions Summary
          </h3>
          {/* Sliders */}
          <div className="flex justify-center items-center space-x-48 ">
            <RangeSlider
              value={startHeight}
              onChange={setStartHeight}
              min={minHeight}
              max={maxHeight}
              label="Start Height"
            />

            <RangeSlider
              value={endHeight}
              onChange={setEndHeight}
              min={minHeight}
              max={maxHeight}
              label="End Height"
            />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          {loading ? (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          ) : cumulative ? (
            <AreaChart data={chartDataset}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis
                dataKey="height"
                tick={{ fontSize, fill: "#94a3b8" }}
                tickFormatter={(v) => `#${v}`}
              />
              <YAxis tick={{ fontSize, fill: "#94a3b8" }} />
              <Tooltip />
              <Legend />
              {(pool === "default" || pool === "sapling") && (
                <>
                  {filter && (
                    <Area
                      type="monotone"
                      dataKey="sapling_filter"
                      name="Sapling Filter"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="sapling"
                    name="Sapling"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.3}
                  />
                </>
              )}
              {(pool === "default" || pool === "orchard") && (
                <>
                  {filter && (
                    <Area
                      type="monotone"
                      dataKey="orchard_filter"
                      name="Orchard Filter"
                      stroke="#f87171"
                      fill="#f87171"
                      fillOpacity={0.2}
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="orchard"
                    name="Orchard"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                  />
                </>
              )}
            </AreaChart>
          ) : (
            <BarChart data={chartDataset}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis
                dataKey="height"
                tick={{ fontSize, fill: "#94a3b8" }}
                tickFormatter={(v) => `#${v}`}
              />
              <YAxis tick={{ fontSize, fill: "#94a3b8" }} />
              <Tooltip />
              <Legend />
              {(pool === "default" || pool === "sapling") && (
                <>
                  {filter && (
                    <Bar
                      dataKey="sapling_filter"
                      name="Sapling Filter"
                      fill="#60a5fa"
                      stackId="stack"
                    />
                  )}
                  <Bar
                    dataKey="sapling"
                    name="Sapling"
                    fill="#3b82f6"
                    stackId="stack"
                  />
                </>
              )}
              {(pool === "default" || pool === "orchard") && (
                <>
                  {filter && (
                    <Bar
                      dataKey="orchard_filter"
                      name="Orchard Filter"
                      fill="#fb7185"
                      stackId="stack"
                    />
                  )}
                  <Bar
                    dataKey="orchard"
                    name="Orchard"
                    fill="#f43f5e"
                    stackId="stack"
                  />
                </>
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </ErrorBoundary>
  );
}
