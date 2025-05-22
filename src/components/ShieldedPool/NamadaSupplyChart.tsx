import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export interface SeriesPoint {
  x: string[];
  y: any;
}

interface Props {
  data: SeriesPoint;
  width: number;
  height: number;
}

const margin = { top: 20, right: 20, bottom: 50, left: 60 };

export default function NamadaSupplyChart({ data, width, height }: Props) {
  console.log("NamadaSupplyChart data", data);
  const options: ApexOptions = {
    legend: {
      show: false, // Hide legend
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"], // Define line colors
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line", // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: "straight", // Define the line style (straight, smooth, or step)
      width: [2, 2], // Line width for each dataset
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
      },
    },
    xaxis: {
      type: "category", // Category-based x-axis
      categories: data?.x || [],
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Adjust font size for y-axis labels
          colors: ["#6B7280"], // Color of the labels
        },
        formatter: (value: number) => {
          return value.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
        }, // Format y-axis labels
      },
      title: {
        text: "", // Remove y-axis title
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [data?.y || []];
  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartEight" className="w-full">
        <Chart options={options} series={series} type="area" height={500} />
      </div>
    </div>
  );
}
