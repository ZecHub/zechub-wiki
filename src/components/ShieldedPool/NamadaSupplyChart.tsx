import React, { useEffect, useState } from "react";
import { Line } from "recharts";

export interface NamadaSupplyChartProps {
  dataUrl: string;
  assetId: string;
}

export default function NamadaSupplyChart({ dataUrl, assetId }: NamadaSupplyChartProps) {
  const [series, setSeries] = useState<{ timestamp: string; supply: number }[]>([]);

  useEffect(() => {
    fetch(dataUrl)
      .then(r => r.json())
      .then((raw: any[]) => {
        const data = raw
          .map(day => {
            const row = day.Total_Supply.find((a: any) => a.id === assetId);
            if (!row?.totalSupply) return null;
            return {
              timestamp: day.Date,
              supply: parseFloat(row.totalSupply),
            };
          })
          .filter((x): x is { timestamp: string; supply: number } => !!x);
        setSeries(data);
      })
      .catch(console.error);
  }, [dataUrl, assetId]);

  if (!series.length) return <p className="text-center p-8">No data for {assetId}</p>;

  return (
    <div style={{ width: "100%", height: 400 }}>
      <Line
        data={series}
        dataKey="supply"
        xAxis={{ dataKey: "timestamp" }}
        yAxis={{}}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      />
    </div>
  );
}
