import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

type SupplyDataPoint = {
  supply: number;
  close: string; // date
};

export default function TotalSupplyChart() {
  const [data, setData] = useState<SupplyDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/zcash/total_supply.json")
      .then((res) => res.json())
      .then((json: SupplyDataPoint[]) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load total supply data", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading Total Supply data…</div>;
  if (!data.length) return <div>No Total Supply data available.</div>;

  const latest = data[data.length - 1].supply;

  const series = [
    {
      name: "Total Supply",
      data: data.map((d) => ({
        x: new Date(d.close).getTime(),
        y: d.supply,
      })),
    },
  ];

  const options = {
    chart: {
      id: "total-supply-chart",
      type: "line" as const,
      height: 350,
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      labels: {
        formatter: (v: number) => v.toLocaleString(),
      },
      title: {
        text: "ZEC",
      },
    },
    tooltip: {
      y: {
        formatter: (v: number) => v.toLocaleString(),
      },
    },
    title: {
      text: "Zcash Total Supply",
      align: "left",
    },
  };

  return (
    <div>
      <div className="mb-4 text-xl font-bold">
        Total Chain Supply: {latest.toLocaleString()} ZEC
      </div>

      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
}
