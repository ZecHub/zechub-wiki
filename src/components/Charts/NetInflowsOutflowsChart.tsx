import { Chart } from "chart.js/auto";
import { useEffect, useRef, useState } from "react";

interface NetInflowsOutflowsChartProps {
  dataUrl: string;
  color: string;
}

type InflowOutflow = {
  date: string;
  netOrchardFlow: string;
  netSaplingFlow: string;
};


async function fetchData(url: string): Promise<InflowOutflow[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

export default function NetInflowsOutflowsChart(
  props: NetInflowsOutflowsChartProps
) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  const [dataFlow, setDataFlow] = useState<InflowOutflow[]>([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    fetchData(props.dataUrl)
      .then((data) => {
        setIsLoading(false);
        console.log({ data });
        setDataFlow(data);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
        setError(true);
      });
  }, [props.dataUrl]);

  useEffect(() => {
    if (isLoading || !chartRef.current) return;

    const chartObj = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: dataFlow.map((itm) => itm.date),
        datasets: [
          {
            label: "Net Sapling Flow",
            data: dataFlow.map((itm) => parseFloat(itm.netSaplingFlow)),
            backgroundColor: dataFlow.map((itm) =>
              parseFloat(itm.netSaplingFlow) < 0
                ? "rgba(75, 192, 192, 0.2)" 
                : "rgba(255, 99, 132, 0.2)" 
            ),
            borderColor: dataFlow.map((itm) =>
              parseFloat(itm.netSaplingFlow) < 0
                ? "rgba(75, 192, 192, 1)" 
                : "rgba(255, 99, 132, 1)" 
            ),
            borderWidth: 1.5,
          },
          {
            label: "Net Orchard Flow",
            data: dataFlow.map((itm) => parseFloat(itm.netOrchardFlow)),
            backgroundColor: dataFlow.map((itm) =>
              parseFloat(itm.netOrchardFlow) < 0
                ? "rgba(75, 192, 192, 0.2)" 
                : "rgba(54, 162, 235, 0.2)" 
            ),
            borderColor: dataFlow.map((itm) =>
              parseFloat(itm.netOrchardFlow) < 0
                ? "rgba(75, 192, 192, 1)" 
                : "rgba(54, 162, 235, 1)" 
            ),
            borderWidth: 1.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 2,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      chartObj.destroy();
    };
  }, [isLoading, dataFlow]);

  return (
    <div className="flex items-center justify-center w-full h-[400px]">
      {isLoading && <p className="p-1">Loading data...</p>}
      {error && (
        <p className="p-1 text-red-400">
          Chart can not be rendered at the moment
        </p>
      )}
      <canvas
        width={"100%"}
        height={"400px"}
        role="img"
        id="netInflowsOutflowsChart"
        aria-label="Net inflows and outflows chart"
        ref={chartRef}
      ></canvas>
    </div>
  );
}
