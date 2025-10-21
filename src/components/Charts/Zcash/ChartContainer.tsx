import { Spinner } from "flowbite-react";
import { forwardRef, ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

interface ChartContainerProps {
  children: ReactElement;
  loading: boolean;
  title?: string;
  height? : string;
}

const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  (props, ref) => {
    return (
      <div style={{ width: "100%", height: props.height || "480px" }}>
        {props.loading ? (
          <div className="flex justify-center items-center w-full h-full">
            <Spinner />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" ref={ref}>
            {props.children}
          </ResponsiveContainer>
        )}

        {/* {!props.loading && <ChartWatermark label="ZECHUB DASHBOARD" />} */}
      </div>
    );
  }
);

ChartContainer.displayName = "ChartContatiner";
export default ChartContainer;
