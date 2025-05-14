// src/components/ShieldedPool/NamadaSupplyChart.tsx

import React, { useMemo } from "react";
import { Group } from "@visx/group";
// import { AxisBottom, AxisLeft } from "@visx/axis";
import { AreaClosed, Line } from "@visx/shape";
import { GridRows, GridColumns } from "@visx/grid";
import { curveMonotoneX } from "@visx/curve";
import { scaleTime, scaleLinear } from "@visx/scale";
import { extent, max } from "d3-array";

export interface SeriesPoint {
  timestamp: string;
  supply: number;
}

interface Props {
  data: SeriesPoint[];
  width: number;
  height: number;
}

const margin = { top: 20, right: 20, bottom: 50, left: 60 };

export default function NamadaSupplyChart({ data, width, height }: Props) {
  // parse dates once
  const points = useMemo(
    () =>
      data.map(d => ({
        date: new Date(d.timestamp),
        supply: d.supply,
      })),
    [data]
  );

  if (!points.length) {
    return <div className="p-8 text-center">No data to display</div>;
  }

  // Scales
  const xScale = scaleTime<Date>({
    domain: extent(points, p => p.date) as [Date, Date],
    range: [margin.left, width - margin.right],
  });
  const yScale = scaleLinear<number>({
    domain: [0, max(points, p => p.supply) || 0],
    range: [height - margin.bottom, margin.top],
    nice: true,
  });

  return (
    <svg width={width} height={height}>
      <GridRows
        scale={yScale}
        width={width - margin.left - margin.right}
        left={margin.left}
      />
      <GridColumns
        scale={xScale}
        height={height - margin.top - margin.bottom}
        top={margin.top}
      />

      <Group>
        <AreaClosed<{ date: Date; supply: number }>
          data={points}
          x={d => xScale(d.date)!}
          y={d => yScale(d.supply)!}
          yScale={yScale}
          strokeWidth={0}
          fill="rgba(0,122,255,0.3)"
          curve={curveMonotoneX}
        />
        <Line<{ date: Date; supply: number }>
          data={points}
          x={d => xScale(d.date)!}
          y={d => yScale(d.supply)!}
          stroke="#007AFF"
          strokeWidth={2}
          curve={curveMonotoneX}
        />
      </Group>

      <AxisBottom
        top={height - margin.bottom}
        scale={xScale}
        label="Date"
      />
      <AxisLeft
        left={margin.left}
        scale={yScale}
        label="Supply"
      />
    </svg>
  );
}
