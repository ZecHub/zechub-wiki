"use client";

import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

interface Point {
  date: string;
  supply: number;
}

interface NamadaSupplyChartProps {
  dataUrl: string;
  assetId: string;
}

/**
 * Fetches the full Namada supply JSON, extracts the time series
 * for the given assetId, and renders a simple line chart.
 */
const NamadaSupplyChart: React.FC<NamadaSupplyChartProps> = ({ dataUrl, assetId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(dataUrl)
      .then((r) => r.json())
      .then((arr: any[]) => {
        // arr = [ { Date: "...", "Total Supply": [ {id, totalSupply}, ... ] }, ... ]
        const pts: Point[] = arr.map(entry => {
          const found = (entry["Total Supply"] as any[]).find(o => o.id === assetId);
          return {
            date: entry.Date,
            supply: Number(found?.totalSupply || 0)
          };
        });
        setPoints(pts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [dataUrl, assetId]);

  useEffect(() => {
    if (!canvasRef.current || points.length === 0) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: points.map(p => p.date),
        datasets: [{
          label: assetId + " Supply",
          data: points.map(p => p.supply),
          fill: false,
          borderColor: "#FFA500",
          tension: 0.2,
          pointRadius: 2
        }]
      },
      options: {
        scales: {
          x: { display: true, title: { display: true, text: "Date" } },
          y: { display: true, title: { display: true, text: "Supply" } }
        },
        plugins: {
          legend: { display: false },
          tooltip: { mode: "index", intersect: false }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });

    return () => {
      chart.destroy();
    };
  }, [points, assetId]);

  if (loading) return <p>Loading chart…</p>;
  if (points.length === 0) return <p>No data for {assetId}</p>;

  return (
    <div style={{ height: 300 }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default NamadaSupplyChart;
