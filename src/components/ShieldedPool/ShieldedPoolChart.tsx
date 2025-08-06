"use client";
import React, { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { AreaClosed, Line, Bar } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { GridRows, GridColumns } from "@visx/grid";
import { scaleTime, scaleLinear } from "@visx/scale";
import { withTooltip, Tooltip, defaultStyles } from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import { localPoint } from "@visx/event";
import { LinearGradient } from "@visx/gradient";
import { max, extent, bisector } from "@visx/vendor/d3-array";
import { timeFormat } from "@visx/vendor/d3-time-format";
import styled from "styled-components";
import { formatNumber } from "@/lib/helpers";

type ShieldedAmountDatum = {
  close: string;
  supply: number;
  Date: string;
  Hashrate: any;
};

interface ShieldedPoolChartProps {
  dataUrl: string;
  color: string;
}

async function fetchShieldedSupplyData(url: string): Promise<ShieldedAmountDatum[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

export const background = "#1984c7";
export const background2 = "rgb(34, 211, 238)";
export const accentColor = "#edffea";
export const accentColorDark = "rgb(107, 114, 128)";

const tooltipStyles = {
  ...defaultStyles,
  background,
  border: "1px solid white",
  color: "white",
};

const formatDate = timeFormat("%b %d, '%y");
const getDate = (d: ShieldedAmountDatum): Date => new Date(d.close ?? d.Date);
const getShieldedValue = (d: ShieldedAmountDatum): number =>
  d.supply ?? parseFloat(String(d.Hashrate).replace(/,/g, ""));
const bisectDate = bisector<ShieldedAmountDatum, Date>((d) => getDate(d)).left;

const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 500;

export type AreaProps = {
  providedWidth?: number;
  providedHeight?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const AnimatedArea = styled(AreaClosed<ShieldedAmountDatum>)`
  animation: fadeIn 1s ease-out forwards;
  @keyframes fadeIn {
    from { opacity: 0; transform: scaleY(0); transform-origin: bottom; }
    to { opacity: 1; transform: scaleY(1); }
  }
`;

const ShieldedPoolChart = withTooltip<
  AreaProps & ShieldedPoolChartProps,
  ShieldedAmountDatum
>(
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
    const [chartData, setChartData] = useState<ShieldedAmountDatum[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [selectedYear, setSelectedYear] = useState("");

    useEffect(() => {
      setIsLoading(true);
      fetchShieldedSupplyData(dataUrl)
        .then(setChartData)
        .catch(setError)
        .finally(() => setIsLoading(false));
    }, [dataUrl]);

    const years = useMemo(
      () => Array.from(new Set(chartData.map((d) => getDate(d).getFullYear().toString()))),
      [chartData]
    );

    const filteredData = useMemo(
      () =>
        selectedYear
          ? chartData.filter((d) => getDate(d).getFullYear().toString() === selectedYear)
          : chartData,
      [chartData, selectedYear]
    );

    const sortedData = useMemo(
      () =>
        filteredData
          .slice()
          .sort((a, b) => getDate(a).getTime() - getDate(b).getTime()),
      [filteredData]
    );

    const filledData = useMemo(() => {
      if (sortedData.length === 0) return [];
      const start = getDate(sortedData[0]);
      const end = getDate(sortedData[sortedData.length - 1]);
      const map = new Map<string, number>();
      sortedData.forEach((d) => {
        const iso = getDate(d).toISOString().slice(0, 10);
        map.set(iso, getShieldedValue(d));
      });
      const result: ShieldedAmountDatum[] = [];
      let last = 0;
      for (
        let dt = new Date(start);
        dt <= end;
        dt.setDate(dt.getDate() + 1)
      ) {
        const iso = dt.toISOString().slice(0, 10);
        if (map.has(iso)) last = map.get(iso)!;
        result.push({ close: iso, supply: last, Date: iso, Hashrate: null });
      }
      return result;
    }, [sortedData]);

    const yMax = useMemo(() => max(filledData, getShieldedValue) || 0, [filledData]);

    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(providedWidth);
    const [height, setHeight] = useState(providedHeight);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    useEffect(() => {
      let timeoutId: NodeJS.Timeout;
      const handleResize = () => {
        if (ref.current) {
          const w = ref.current.clientWidth || providedWidth;
          const h = ref.current.clientHeight || providedHeight;
          if (w !== width) setWidth(w);
          if (h !== height) {
            setHeight(h > 24 && h <= providedHeight ? h : providedHeight);
          }
        }
      };
      const resizeHandler = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(handleResize, 200);
      };
      window.addEventListener("resize", resizeHandler);
      handleResize();
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("resize", resizeHandler);
      };
    }, [providedWidth, providedHeight, width, height]);

    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(filledData, getDate) as [Date, Date],
        }),
      [filledData, innerWidth, margin.left]
    );

    const shieldedValueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [0, yMax + innerHeight / 3],
          nice: true,
        }),
      [innerHeight, margin.top, yMax]
    );

    const handleTooltip = useCallback(
      (
        event:
          | React.TouchEvent<SVGRectElement>
          | React.MouseEvent<SVGRectElement>
      ) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(filledData, x0, 1);
        const d0 = filledData[index - 1];
        const d1 = filledData[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d =
            x0.valueOf() - getDate(d0).valueOf() >
            getDate(d1).valueOf() - x0.valueOf()
              ? d1
              : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: shieldedValueScale(getShieldedValue(d)),
        });
      },
      [showTooltip, shieldedValueScale, dateScale, filledData]
    );

    if (filledData.length === 0 || isLoading) {
      return (
        <div ref={ref} style={{ width: "100%", minWidth: "100%" }}>
          <p>
            <i>Loading historic shielded pool data...</i>
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div ref={ref} style={{ width: "100%", minWidth: "100%" }}>
          <p>
            <i>Error loading historic shielding data: {error.message}</i>
          </p>
        </div>
      );
    }

    return (
      <div ref={ref} style={{ width: "100%", minWidth: "100%", minHeight: 500 }}>
        <div className="flex flex-row gap-4 mb-4">
          <label htmlFor="year" className="font-medium dark:text-slate-300 text-slate-700 px-3 py-2">
            Select Year:
          </label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="dark:bg-gray-800 dark:text-gray-200 outline-none focus:outline-none focus:border-slate-300 active:border-slate-300 border-solid border-slate-300"
          >
            <option value="">All</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <svg width={width} height={height}>
          <rect x={0} y={0} width={width} height={height} fill={color} rx={14} />
          <LinearGradient id="area-background-gradient" from={background} to={background2} />
          <LinearGradient id="area-gradient" from={accentColor} to={accentColor} toOpacity={0.1} />
          <GridRows left={margin.left} scale={shieldedValueScale} width={innerWidth} strokeDasharray="1,3" stroke={accentColor} strokeOpacity={0.25} />
          <GridColumns top={margin.top} scale={dateScale} height={innerHeight} strokeDasharray="1,3" stroke={accentColor} strokeOpacity={0.25} />
          <AnimatedArea
            data={filledData}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => shieldedValueScale(getShieldedValue(d)) ?? 0}
            yScale={shieldedValueScale}
            strokeWidth={1}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
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
                strokeDasharray="5,2"
                pointerEvents="none"
              />
              <circle cx={tooltipLeft} cy={tooltipTop + 1} r={4} fill="black" fillOpacity={0.25} stroke="black" strokeOpacity={0.25} strokeWidth={2} pointerEvents="none" />
              <circle cx={tooltipLeft} cy={tooltipTop} r={4} fill={accentColorDark} stroke="white" strokeWidth={2} pointerEvents="none" />
            </g>
          )}
        </svg>
        {tooltipData && (
          <Tooltip top={tooltipTop - 12} left={tooltipLeft + 12} style={tooltipStyles}>
            {formatNumber(getShieldedValue(tooltipData))}
          </Tooltip>
        )}
        {tooltipData && (
          <Tooltip top={innerHeight + margin.top - 14} left={tooltipLeft} style={{ ...defaultStyles, minWidth: 72, textAlign: "center", transform: "translateX(-50%)" }}>
            {formatDate(getDate(tooltipData))}
          </Tooltip>
        )}
      </div>
    );
  }
);

export default ShieldedPoolChart;
