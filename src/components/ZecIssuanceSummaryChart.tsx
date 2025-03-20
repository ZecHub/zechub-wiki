import Chart from "chart.js/auto";
import { useEffect, useRef, useState } from "react";

// Summary of blocks by period, 8064 is roughly a week

interface ZecInsuranceChartProps {
  dataUrl: string;
  pool: String;
  cumulative: boolean;
  filter: boolean;
}

/**
 * Type of values from the shielded transaction over time. Each datum is
 * transaction amount at a given Date.
 */
type ZecIssuanceDatum = {
  Date: string;
  "ZEC Issuance": number;
  "ZEC Supply": number;
  "Current Inflation (%)": number;
};

/**
 * Loads the historic shielded transaction data from a public json file in Github repo
 * @returns Promise of shielded transaction data
 */
async function fetchTransactionData(
  url: string
): Promise<Array<ZecIssuanceDatum>> {
  const response = await fetch(url);

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const resJson = await response.json();
  return resJson;
}

const ZecInsuranceChartProps: React.FC<ZecInsuranceChartProps> = ({
  dataUrl,
  pool,
  cumulative,
  filter,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  /* State for chart data loaded from server */
  const [chartData, setChartData] = useState([] as Array<ZecIssuanceDatum>);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /* State for custom timeframe */
  const [startDate, setStartDate] = useState("2019-01-01");
  const [endDate, setEndDate] = useState("2031-07-02");

  /* State as min and max block date to define boundaries */

  useEffect(() => {
    setIsLoading(true);

    fetchTransactionData(dataUrl)
      .then((data) => {
        setChartData(data);
      })
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  }, [dataUrl]);

  useEffect(() => {
    if (isLoading || !chartRef.current) return;

    let issuanceSum = 0;

    const chartDataSum = chartData.map((d) => {
      issuanceSum += d["ZEC Issuance"];

      return {
        Date: d.Date,
        "ZEC Issuance": d["ZEC Issuance"],
        "ZEC Supply": d["ZEC Supply"],
        "Current Inflation (%)": d["Current Inflation (%)"],
      } as ZecIssuanceDatum;
    });
    let chartDataPeriod = chartDataSum.filter((d) => {
      const newStartDate = new Date(startDate);
      newStartDate.setHours(0);
      const newEndDate = new Date(endDate);
      newEndDate.setHours(0);
      const date = new Date(d.Date);
      return date >= newStartDate && date <= newEndDate;
    });

    const zecIssuanceChartData = {
      label: "ZEC Issuance",
      data: chartDataPeriod.map((d) => d["ZEC Issuance"]),
      backgroundColor: "rgba(255, 99, 132, 0.4)",
      borderColor: "rgba(255, 99, 132, 1)",
      fill: "origin",
      radius: 1,
    };

    const chartSets = [];
    chartSets.push(zecIssuanceChartData);

    const chartInstance = new Chart(chartRef.current, {
      // type: cumulative ? "line" : "bar",
      type: "line",
      data: {
        labels: chartDataPeriod.map((d) =>
          new Date(d.Date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          })
        ),
        datasets: chartSets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (context: any) {
                return `${context.dataset.label}: ${context.raw}`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: cumulative ? false : true,
          },
          y: {
            stacked: cumulative ? false : true,
            // beginAtZero: true,
          },
        },
      },
    });

    // Cleanup the chart on unmount
    return () => {
      chartInstance.destroy();
    };
  }, [chartData, pool, cumulative, filter, isLoading, startDate, endDate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "600px",
        width: "100%",
        marginTop: "32px",
      }}
    >
      {isLoading ? (
        <p>Loading ...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          <div className="flex gap-2 flex-col items-center my-8">
            <div className="flex gap-4 justify-center items-center mt-4">
              <label
                htmlFor="rangeStartDate"
                className="font-medium text-slate-500"
              >
                Start Date ({startDate}):
              </label>
              <input
                type="date"
                id="rangeStartDate"
                name="rangeStartDate"
                className="dark:accent-[#22d3ee] accent-[#1984c7]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min="2019-01-01"
                max="2031-07-02"
              />
              <label
                htmlFor="rangeEndDate"
                className="font-medium text-slate-500"
              >
                End Date ({endDate}):
              </label>
              <input
                type="date"
                id="rangeEndDate"
                name="rangeEndDate"
                className="dark:accent-[#22d3ee] accent-[#1984c7]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min="2019-01-01"
                max="2031-07-02"
              />
            </div>
          </div>
          <canvas ref={chartRef} />
        </>
      )}
    </div>
  );
};

export default ZecInsuranceChartProps;
