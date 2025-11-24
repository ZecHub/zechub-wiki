import React, { RefObject, useState } from "react";
import { CardContent } from "@/components/UI/shadcn/card";
import TotalSupplyChart from "./TotalSupplyChart";
import ChartFooter from "../../ChartFooter";

type ZcashChartProps = {
  divChartRef: RefObject<HTMLDivElement | null>;
  handleSaveToPng: (
    poolType: string,
    poolData: Record<
      string,
      {
        timestamp: string;
        supply: number;
      } | null
    >,
    toolType: string
  ) => Promise<void>;
};

const CardContentSupply = (props: ZcashChartProps) => {
  return (
    <div>
      <CardContent>
        <TotalSupplyChart chartRef={props.divChartRef} />
        <ChartFooter
          imgLabel={"activeTab"}
          handleSaveToPng={props.handleSaveToPng}
          lastUpdatedDate={"total supply"}
        />
      </CardContent>
    </div>
  );
};

export default CardContentSupply;
