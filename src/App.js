import "./App.css";
import orchard from "./Json/orchard.json";
import sapling from "./Json/sapling.json";
import sprout from "./Json/sprout.json";
import { dates } from "./Json/dates";
import { formNewArray } from "./helpers/formNewArray";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

function App() {
  // console.log(dates);

  //Call function to form new array to extract the data for the specified dates
  const newArray = formNewArray(dates, orchard, sapling, sprout);
  console.log(newArray);


  const totalDuration = 7000;
  const delayBetweenPoints = totalDuration / newArray[0].data.length;
  const previousY = (ctx) =>
    ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(100)
      : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1].getProps(["y"], true).y;


  return (
    <div className="App">
      <div className="line__chart">
        <Line
          options={{
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  stepSize: 1,
                  color: "black"
                },
              },
              y: {
                grid: {
                  display: false,
                },
                min: 0,
                max: 1400000,
                beginAtZero: true,
                ticks: {
                  color: "black"
                }
              },
            },
            responsive: true,
            elements: {
              point: {
                radius: 0,
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "bottom",
                align: "end",
                labels: {
                  boxHeight: 1,
                  boxWidth: 35,
                  color: "black",
                  padding: 50,
                },
              },
            },
            animation: {
              x: {
                type: "number",
                easing: "linear",
                duration: delayBetweenPoints,
                from: NaN, // the point is initially skipped
                delay(ctx) {
                  if (ctx.type !== "data" || ctx.xStarted) {
                    return 0;
                  }
                  ctx.xStarted = true;
                  return ctx.index * delayBetweenPoints;
                },
              },
              y: {
                type: "number",
                easing: "linear",
                duration: delayBetweenPoints,
                from: previousY,
                delay(ctx) {
                  if (ctx.type !== "data" || ctx.xStarted) {
                    return 0;
                  }
                  ctx.xStarted = true;
                  return ctx.index * delayBetweenPoints;
                },
              },
            },
          }}
          data={{
            labels: dates.map((x, i) => {
              if (i % 24 === 8 || i === dates.length - 1 || i === 0) {
                return x.slice(-4);
              } else {
                return "";
              }
            }),
            datasets: [
              {
                data: newArray[0].data.map((value) => value.supply),
                label: "orchard",
                borderColor: "#32cd32",
                borderWidth: 3,
                fill: false,
                lineTension: 0.3,
              },
              {
                data: newArray[2].data.map((value) => value.supply),
                label: "sapling",
                fill: false,
                borderWidth: 3,
                borderColor: "#ffa700",
                lineTension: 0.3,
              },
              {
                data: newArray[1].data.map((value) => value.supply),
                label: "sprout",
                fill: false,
                borderColor: "#6e0397",
                borderWidth: 3,
                lineTension: 0.3,
              },
            ],
          }}
        />
      </div>
    </div>
  );
}

export default App;
