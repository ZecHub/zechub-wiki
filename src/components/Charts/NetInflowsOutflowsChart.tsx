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

/**
 * Loads the historic shielded transaction data from a public json file in Github repo
 */
async function fetchData(url: string): Promise<InflowOutflow[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}

/**
 * Parses number strings, removing commas and trimming whitespace
 */
function cleanNumber(str: string): number {
  return parseFloat(str.replace(/,/g, "").trim());
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

  const parseData = dataFlow.map((itm) => ({
    date: itm["date"] || itm["Date"],
    netSaplingFlow: itm["netSaplingFlow"] || itm["Net Sapling Flow"],
    netOrchardFlow: itm["netOrchardFlow"] || itm["Net Orchard Flow"],
  }));

  useEffect(() => {
    if (isLoading || !chartRef.current || parseData.length === 0) return;

    const chartObj = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: parseData.map((itm) => itm.date),
        datasets: [
          {
            label: "Net Sapling Flow",
            data: parseData.map((itm) => cleanNumber(itm.netSaplingFlow)),
            backgroundColor: parseData.map((itm) =>
              cleanNumber(itm.netSaplingFlow) < 0
                ? "rgba(75, 192, 192, 0.2)" // green
                : "rgba(255, 99, 132, 0.2)" // red
            ),
            borderColor: parseData.map((itm) =>
              cleanNumber(itm.netSaplingFlow) < 0
                ? "rgba(75, 192, 192, 1)" // green
                : "rgba(255, 99, 132, 1)" // red
            ),
            borderWidth: 1.5,
          },
          {
            label: "Net Orchard Flow",
            data: parseData.map((itm) => cleanNumber(itm.netOrchardFlow)),
            backgroundColor: parseData.map((itm) =>
              cleanNumber(itm.netOrchardFlow) < 0
                ? "rgba(75, 192, 192, 0.2)" // green
                : "rgba(54, 162, 235, 0.2)" // blue
            ),
            borderColor: parseData.map((itm) =>
              cleanNumber(itm.netOrchardFlow) < 0
                ? "rgba(75, 192, 192, 1)" // green
                : "rgba(54, 162, 235, 1)" // blue
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
  }, [isLoading, parseData]);

  return (
    <div className="flex items-center justify-center w-full h-[450px]">
      {isLoading && <p className="p-1">Loading data...</p>}
      {error && (
        <p className="p-1 text-red-400">
          Chart cannot be rendered at the moment
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
