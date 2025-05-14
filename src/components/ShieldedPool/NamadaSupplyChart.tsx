import React, { useMemo } from "react";
import { Group } from "@visx/group";
import { AreaClosed, LinePath } from "@visx/shape";
import { GridRows, GridColumns } from "@visx/grid";
import { curveMonotoneX } from "@visx/curve";
import { scaleLinear } from "@visx/scale";
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
  // 1) Convert to numeric x/y once
  const points = useMemo(
    () =>
      data.map(d => ({
        x: new Date(d.timestamp).valueOf(),
        y: d.supply,
      })),
    [data]
  );

  if (!points.length) {
    return <div className="p-8 text-center">No data to display</div>;
  }

  // 2) Compute extents/limits
  const [minX, maxX] = extent(points, p => p.x) as [number, number];
  const maxY = max(points, p => p.y) || 0;

  // 3) Build linear scales for both axes
  const xScale = scaleLinear<number>({
    domain: [minX, maxX],
    range: [margin.left, width - margin.right],
    nice: true,
  });
  const yScale = scaleLinear<number>({
    domain: [0, maxY],
    range: [height - margin.bottom, margin.top],
    nice: true,
  });

  return (
    <svg width={width} height={height}>
      {/* background grid */}
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
        {/* filled area under the curve */}
        <AreaClosed<{ x: number; y: number }>
          data={points}
          x={d => xScale(d.x)!}
          y={d => yScale(d.y)!}
          yScale={yScale}
          strokeWidth={0}
          fill="rgba(0,122,255,0.3)"
          curve={curveMonotoneX}
        />
        {/* line over the area */}
        <LinePath<{ x: number; y: number }>
          data={points}
          x={d => xScale(d.x)!}
          y={d => yScale(d.y)!}
          stroke="#007AFF"
          strokeWidth={2}
          curve={curveMonotoneX}
        />
      </Group>
    </svg>
  );
}
