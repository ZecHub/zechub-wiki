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

// Define types for data
type ShieldedAmountDatum = {
  Date: string;
  Hashrate: string;
};

interface ShieldedPoolChartProps {
  dataUrl: string;
  color: string;
}

// Fetch data function
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

// Date format from data
const formatDate = timeFormat("%b %d, '%y");

// Function to extract Date from data
const getDate = (d: ShieldedAmountDatum): Date => new Date(d.Date);

// Function to extract and convert hashrate value from data
const getShieldedValue = (d: ShieldedAmountDatum): number => {
  const hashrate = d.Hashrate ? parseFloat(d.Hashrate.replace(/,/g, '')) : 0;
  return hashrate;
};

// Bisector for date
const bisectDate = bisector<ShieldedAmountDatum, Date>((d) => new Date(d.Date)).left;

const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 500;

export type AreaProps = {
  providedWidth?: number;
  providedHeight?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

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
    
    const [chartData, setChartData] = useState([] as Array<ShieldedAmountDatum>);
    const yMax = useMemo(() => max(chartData, getShieldedValue) || 0, [chartData]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      setIsLoading(true);
      fetchShieldedSupplyData(dataUrl)
        .then((data) => setChartData(data))
        .catch((error) => setError(error))
        .finally(() => setIsLoading(false));
    }, [dataUrl]);

    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(providedWidth);
    const [height, setHeight] = useState(providedHeight);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    useLayoutEffect(() => {
      if (ref.current) {
        setWidth(ref?.current?.clientWidth || providedWidth);
        setHeight(ref?.current?.clientHeight || providedHeight);
      }
    });

    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(chartData, getDate) as [Date, Date],
        }),
      [chartData, innerWidth, margin.left],
    );

    const shieldedValueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [0, (max(chartData, getShieldedValue) || 0) + innerHeight / 3],
          nice: true,
        }),
      [margin.top, innerHeight, chartData],
    );

    const handleTooltip = useCallback(
      (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(chartData, x0, 1);
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

    const formatNumber = (number: number) => {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(number);
    };

    if (chartData.length === 0 || isLoading) {
      return (
        <div ref={ref} style={{ width: '100%', minWidth: '100%' }}>
          <p><i>Loading historic shielded pool data...</i></p>
        </div>
      );
    }

    if (error) {
      return (
        <div ref={ref} style={{ width: '100%', minWidth: '100%' }}>
          <p><i>Error loading historic shielding data: {error.message}</i></p>
        </div>
      );
    }

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
            fill={color}
            rx={14}
          />
          <LinearGradient id="area-background-gradient" from={background} to={background2} />
          <LinearGradient id="area-gradient" from={accentColor} to={accentColor} toOpacity={0.1} />
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
          <AreaClosed<ShieldedAmountDatum>
            data={chartData}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => shieldedValueScale(getShieldedValue(d)) ?? 0}
            yScale={shieldedValueScale}
            strokeWidth={1}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
            curve={curveMonotoneX}
            aria-label="Closed area showing shielded pool value over time"
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
            aria-label="Hover overlay"
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
                aria-label="Line showing x axis"
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
          <text
            x={width - 60}
            y={height - 10}
            textAnchor="end"
            fontSize={14}
            fill={accentColor}
            opacity={0.8}
            aria-label="Watermark"
          >
            ZECHUB DASHBOARD
          </text>
          <image
            x={width - 60}
            y={height - 50}
            width="40"
            height="40"
            href=""
            opacity={0.8}
            aria-label="Watermark logo"
          />
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
              {formatNumber(getShieldedValue(tooltipData))}
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
              {formatDate(getDate(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  },
);

export default ShieldedPoolChart;
