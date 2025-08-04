import { Spinner } from "flowbite-react";
import { forwardRef, ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

interface ChartContainerProps {
  children: ReactElement;
  loading: boolean;
}

const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  (props, ref) => {
    return (
      <div style={{ width: "100%", height: '480px'}}>
        {props.loading ? (
          <div className="flex justify-center items-center w-full h-full">
            <Spinner />
          </div>
        ) : (
          <ResponsiveContainer ref={ref}  width="100%" height="100%">
            {props.children}
          </ResponsiveContainer>
        )}

        {/*
        {!props.loading && (
        <div className="absolute bottom-28 right-4 text-xs shadow-sm text-slate-500 pointer-events-none select-none z-10">
          <text opacity={0.8} aria-label="Watermark">
            ZECHUB DASHBOARD
          </text>
        </div>
            )} */}
      </div>
    );
  }
);

ChartContainer.displayName = "ChartContatiner";
export default ChartContainer;
