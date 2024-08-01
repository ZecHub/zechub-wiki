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

/**
 * Type of values from the shielded pool over time. Each datum is amount 
 * shielded at a given date.
 */
type ShieldedAmountDatum = {
  close: string;
  supply: number;
  Date: string;
  Hashrate: any
};

interface ShieldedPoolChartProps {
  dataUrl: string;
  color: string;
}

/**
 * Loads the historic shielded pool data from a public json file in Github repo
 * @returns Promise of shielded pool data
 */
async function fetchShieldedSupplyData(url: string): Promise<Array<ShieldedAmountDatum>> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}

// Color scheme for chart and tooltip
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

/** Date format from data, i.e. "01/01/1970" */
const formatDate = timeFormat("%b %d, '%y");

/**
 * Native `Date` object from datum
 * @param d datum for measurement of shielded amount
 * @returns Date object
 */
const getDate = (d: ShieldedAmountDatum): Date => new Date(d.close ?? d.Date);

/**
 * Returns the shielded amount from datum
 * @param d 
 * @returns number
 */
const getShieldedValue = (d: ShieldedAmountDatum): number => {
  return parseFloat(d.Hashrate.replace(/,/g, ''));
};

/** Bisector for date */
const bisectorDate = bisector<ShieldedAmountDatum, Date>((d) => new Date(d.close ?? d.Date)).left;

/**
 * Default width for the chart. It will render 1000px wide, although if this 
 * happens that means there an error with the `userRef` hook below.
 */
const DEFAULT_WIDTH = 1000;

/* Default height for the chart. It will render 500px tall. */
const DEFAULT_HEIGHT = 500;

/**
 * Props to override default layout, all of which are optional. By default, the
 * visualization will take up the entire width  of the parent container, and the
 * height will be 500px.
 */
export type AreaProps = {
  providedWidth?: number;
  providedHeight?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

/**
 * Area line chart for shielded pool over time
 * @param props can be used to override height, width, and margin
 * 
 * Inspired by example from visx documentation: https://visx.dev/examples/gallery?group=Area&show=AreaClosed
 * 
 * @returns Area chart for shielded pool over time
 * 
 */
const ShieldedPoolChart = withTooltip<AreaProps & ShieldedPoolChartProps, ShieldedAmountDatum>(
  ({
    dataUrl,
    color,
    providedWidth = DEFAULT_WIDTH,
    providedHeight = DEFAULT_HEIGHT,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: AreaProps & WithTooltipProvidedProps<ShieldedAmountDatum> & ShieldedPoolChartProps) => {
    
    /* State for chart data loaded from server */
    const [chartData, setChartData] = useState([] as Array<ShieldedAmountDatum>);

    const yMax = useMemo(() => max(chartData, getShieldedValue) || 0, [chartData]);

    /* Loading state for chart data in progress */
    const [isLoading, setIsLoading] = useState(false);

    /* Error state for chart data */
    const [error, setError] = useState<Error | null>(null);

    // Fetch data whenever dataUrl changes
    useEffect(() => {
      setIsLoading(true);
      fetchShieldedSupplyData(dataUrl)
        .then((data) => setChartData(data))
        .catch((error) => setError(error))
        .finally(() => setIsLoading(false));
    }, [dataUrl]);

    /**
     * Reference to child, which will fill all space available horizontally
     */
    const ref = useRef<HTMLDivElement>(null);

    // State for width and height so that they update as browser size changes
    const [width, setWidth] = useState(providedWidth);
    const [height, setHeight] = useState(providedHeight);

    // Compute inner height and width based upon margin
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Update width and height on resize
    useLayoutEffect(() => {
      if (ref.current) {
        setWidth(ref?.current?.clientWidth || providedWidth);
        setHeight(ref?.current?.clientHeight || providedHeight);
      }
    });

    /**
     * Scale for date on x-axis
     */
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(chartData, getDate) as [Date, Date],
        }),
      [chartData, innerWidth, margin.left],
    );

    /**
     * Scale for shielded amount on y-axis
     */
    const shieldedValueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [0, (max(chartData, getShieldedValue) || 0) + innerHeight / 3],
          nice: true,
        }),
      [margin.top, innerHeight, chartData],
    );

    /**
     * Handle tooltip behavior on hover. The user should see the date and 
     * shielded value corresponding to the point hovered over.
     */
    const handleTooltip = useCallback(
      (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectorDate(chartData, x0, 1);
        const d0 = chartData[index - 1];
        const d1 = chartData[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: shieldedValueScale(getShieldedValue(d)),
        });
      },
      [showTooltip, shieldedValueScale, dateScale, chartData],
    );

    // Function to format number with commas
    const formatNumber = (number: number) => {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(number);
    };

    // Render loading message when loading
    if (chartData.length === 0 || isLoading) {
      return (
        <div ref={ref} style={{ height: DEFAULT_HEIGHT }}>
          <p>Loading...</p>
        </div>
      );
    }

    // Render error message when error
    if (error) {
      return (
        <div ref={ref} style={{ height: DEFAULT_HEIGHT }}>
          <p>There was an error loading data.</p>
        </div>
      );
    }

    return (
      <div ref={ref} style={{ height: DEFAULT_HEIGHT }}>
        <svg width={width} height={height}>
          <rect x={0} y={0} width={width} height={height} fill="url(#gradient)" rx={14} />
          <LinearGradient id="gradient" from={background} to={background2} />
          <GridRows
            left={margin.left}
            scale={shieldedValueScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColorDark}
            strokeOpacity={0.2}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={accentColorDark}
            strokeOpacity={0.2}
            pointerEvents="none"
          />
          <AreaClosed<ShieldedAmountDatum>
            data={chartData}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => shieldedValueScale(getShieldedValue(d)) ?? 0}
            yScale={shieldedValueScale}
            strokeWidth={1}
            stroke="url(#gradient)"
            fill="url(#gradient)"
            curve={curveMonotoneX}
          />
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
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds key={Math.random()} top={tooltipTop - 12} left={tooltipLeft + 12} style={tooltipStyles}>
              {`Date: ${formatDate(getDate(tooltipData))}`}
              <br />
              {`Hashrate: ${formatNumber(getShieldedValue(tooltipData))}`}
            </TooltipWithBounds>
          </div>
        )}
      </div>
    );
  },
);

export default ShieldedPoolChart;
