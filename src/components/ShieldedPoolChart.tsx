"use client";
import React, { useMemo, useCallback, useState, useLayoutEffect, useEffect, useRef } from 'react';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
import { withTooltip, Tooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { max, extent, bisector } from '@visx/vendor/d3-array';
import { timeFormat } from '@visx/vendor/d3-time-format';

type ShieldedAmountDatum = {
  close: string;
  supply: number;
};

interface ShieldedPoolChartProps {
  data: {
    sprout?: ShieldedAmountDatum[];
    sapling?: ShieldedAmountDatum[];
    orchard?: ShieldedAmountDatum[];
  };
}

const fetchShieldedSupplyData = async (url: string): Promise<Array<ShieldedAmountDatum>> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
};

export const background = '#1984c7';
export const background2 = 'rgb(34, 211, 238)';
export const accentColor = '#edffea';
export const accentColorDark = 'rgb(107, 114, 128)';
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};

const formatDate = timeFormat("%b %d, '%y");

const getDate = (d: ShieldedAmountDatum): Date => new Date(d.close);
const getShieldedValue = (d: ShieldedAmountDatum): number => d.supply;
const bisectDate = bisector<ShieldedAmountDatum, Date>((d) => new Date(d.close)).left;

const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 500;

export type AreaProps = {
  providedWidth?: number;
  providedHeight?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const ShieldedPoolChart = withTooltip<AreaProps & ShieldedPoolChartProps, ShieldedAmountDatum>(
  ({
    data,
    providedWidth = DEFAULT_WIDTH,
    providedHeight = DEFAULT_HEIGHT,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: AreaProps & WithTooltipProvidedProps<ShieldedAmountDatum> & ShieldedPoolChartProps) => {
    
    const combinedData = useMemo(() => {
      const dates = new Set<string>();
      data.sprout?.forEach((d) => dates.add(d.close));
      data.sapling?.forEach((d) => dates.add(d.close));
      data.orchard?.forEach((d) => dates.add(d.close));
      
      const sortedDates = Array.from(dates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      return sortedDates.map((date) => ({
        close: date,
        sprout: data.sprout?.find((d) => d.close === date)?.supply ?? 0,
        sapling: data.sapling?.find((d) => d.close === date)?.supply ?? 0,
        orchard: data.orchard?.find((d) => d.close === date)?.supply ?? 0,
      }));
    }, [data]);

    const yMax = useMemo(() => max(combinedData, (d) => Math.max(d.sprout, d.sapling, d.orchard)) || 0, [combinedData]);

    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(providedWidth);
    const [height, setHeight] = useState(providedHeight);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    useLayoutEffect(() => {
      if (ref.current) {
        setWidth(ref.current.clientWidth || providedWidth);
        setHeight(ref.current.clientHeight || providedHeight);
      }
    });

    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(combinedData, (d) => new Date(d.close)) as [Date, Date],
        }),
      [combinedData, innerWidth, margin.left],
    );

    const shieldedValueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [0, yMax + innerHeight / 3],
          nice: true,
        }),
      [margin.top, innerHeight, yMax],
    );

    const handleTooltip = useCallback(
      (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(combinedData as ShieldedAmountDatum[], x0, 1);
        const d0 = combinedData[index - 1];
        const d1 = combinedData[index];
        let d = d0;
        if (d1 && new Date(d1.close)) {
          d = x0.valueOf() - new Date(d0.close).valueOf() > new Date(d1.close).valueOf() - x0.valueOf() ? d1 : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: shieldedValueScale(Math.max(d.sprout, d.sapling, d.orchard)),
        });
      },
      [showTooltip, shieldedValueScale, dateScale, combinedData],
    );

    return (
      <div ref={ref} style={{ width: '100%', minWidth: '100%', minHeight: '500px' }}>
        <svg width={width} height={height}>
          <rect
            aria-label="background"
            role="background"
            x={0}
            y={0}
            width={width}
            height={height}
            fill="white"
            rx={14}
          />
          <GridRows
            left={margin.left}
            scale={shieldedValueScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0.25}
            pointerEvents="none"
            aria-label="Rows of chart"
          />
          <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0.25}
            pointerEvents="none"
            aria-label="Columns of chart"
          />
          {data.sprout && (
            <AreaClosed<ShieldedAmountDatum>
              data={combinedData}
              x={(d) => dateScale(new Date(d.close)) ?? 0}
              y={(d) => shieldedValueScale(d.sprout) ?? 0}
              yScale={shieldedValueScale}
              strokeWidth={1}
              stroke="#A020F0"
              fill="#A020F0"
              curve={curveMonotoneX}
              aria-label="Sprout pool area"
            />
          )}
          {data.sapling && (
            <AreaClosed<ShieldedAmountDatum>
              data={combinedData}
              x={(d) => dateScale(new Date(d.close)) ?? 0}
              y={(d) => shieldedValueScale(d.sapling) ?? 0}
              yScale={shieldedValueScale}
              strokeWidth={1}
              stroke="#FFA500"
              fill="#FFA500"
              curve={curveMonotoneX}
              aria-label="Sapling pool area"
            />
          )}
          {data.orchard && (
            <AreaClosed<ShieldedAmountDatum>
              data={combinedData}
              x={(d) => dateScale(new Date(d.close)) ?? 0}
              y={(d) => shieldedValueScale(d.orchard) ?? 0}
              yScale={shieldedValueScale}
              strokeWidth={1}
              stroke="#32CD32"
              fill="#32CD32"
              curve={curveMonotoneX}
              aria-label="Orchard pool area"
            />
          )}
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
            aria-label="Shielded pooling over time"
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
                aria-label="Line for tooltip of mouse on x axis"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.25}
                stroke="black"
                strokeOpacity={0.25}
                strokeWidth={2}
                pointerEvents="none"
                aria-label="Point showing shielding on the y-axis for this point on the x-axis"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
                aria-label="Accent color for point showing shielding on the y-axis for this point on the x-axis"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 12}
              left={tooltipLeft + 12}
              style={tooltipStyles}
              aria-label="Tooltip for shielded value at this point in time"
            >
              {`Sprout: ${tooltipData.sprout.toLocaleString()} ZEC`}
              <br />
              {`Sapling: ${tooltipData.sapling.toLocaleString()} ZEC`}
              <br />
              {`Orchard: ${tooltipData.orchard.toLocaleString()} ZEC`}
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin.top - 14}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: 'center',
                transform: 'translateX(-50%)',
              }}
            >
              {formatDate(new Date(tooltipData.close))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  },
);

export default ShieldedPoolChart;
