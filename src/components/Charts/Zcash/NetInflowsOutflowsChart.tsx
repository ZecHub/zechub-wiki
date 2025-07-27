import { DATA_URL } from "@/lib/chart/data-url";
import { getNetInOutflowData } from "@/lib/chart/helpers";
import { NetInOutflow } from "@/lib/chart/types";
import { Chart } from "chart.js/auto";
import { Spinner } from "flowbite-react";
import { useEffect, useRef, useState } from "react";

interface NetInflowsOutflowsChartProps {
  color?: string;
}

export default function NetInflowsOutflowsChart(
  props: NetInflowsOutflowsChartProps
) {
  const [loading, setLoading] = useState(false);
  const [dataFlow, setDataFlow] = useState<NetInOutflow[]>([]);
  const [error, setError] = useState(false);
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [netInOutflow] = await Promise.all([
          getNetInOutflowData(
            DATA_URL.netInflowsOutflowsUrl,
            controller.signal
          ),
        ]);

        setDataFlow(netInOutflow);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    return () => {
      controller.abort();
    };
  }, []);

  const parseData = dataFlow.map((itm) => ({
    date: itm["Date"],
    netSaplingFlow: itm["Net Sapling Flow"],
    netOrchardFlow: itm["Net Orchard Flow"],
  }));

  useEffect(() => {
    if (loading || !chartRef.current) return;

    const chartObj = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: parseData.map((itm) => itm.date),
        datasets: [
          {
            label: "Net Sapling Flow",
            data: parseData.map((itm) => parseFloat(itm.netSaplingFlow)),
            backgroundColor: parseData.map((itm) =>
              parseFloat(itm.netSaplingFlow) < 0
                ? "rgba(255, 99, 132, 0.2)"
                : "rgba(75, 192, 192, 0.2)"
            ),
            borderColor: parseData.map((itm) =>
              parseFloat(itm.netSaplingFlow) < 0
                ? "rgba(255, 99, 132, 1)"
                : "rgba(34, 139, 34, 1)"
            ),
            borderWidth: 1.5,
          },
          {
            label: "Net Orchard Flow",
            data: parseData.map((itm) => parseFloat(itm.netOrchardFlow)),
            backgroundColor: parseData.map((itm) =>
              parseFloat(itm.netOrchardFlow) < 0
                ? "rgba(255, 99, 132, 0.2)"
                : "rgba(75, 192, 192, 0.2)"
            ),
            borderColor: parseData.map((itm) =>
              parseFloat(itm.netOrchardFlow) < 0
                ? "rgba(255, 99, 132, 1)"
                : "rgba(75, 192, 192, 1)"
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
      // clear when unmounted
      chartObj.destroy();
    };
  }, [loading, parseData]);

  return (
    <div className="space-y-6">
      <div className="flex mt-12">
        <h3 className="text-lg font-semibold mb-4 flex-1">
          Net Sapling & Orchard Flow
        </h3>
      </div>
      <div className="flex items-center justify-center">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <canvas
            width={"100%"}
            height={"400px"}
            role="img"
            id="netInflowsOutflowsChart"
            aria-label="Net inflows and outflows chart"
            ref={chartRef}
          ></canvas>
        )}
        
        {error && (
          <p className="flex justify-center items-center p-1 text-red-400">
            Chart can not be rendered at the moment
          </p>
        )}
      </div>
    </div>
  );
}
