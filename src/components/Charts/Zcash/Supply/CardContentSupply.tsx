import React, { RefObject, useState } from "react";
import { CardContent } from "@/components/UI/shadcn/card";
import TotalSupplyChart from "./TotalSupplyChart";

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
    <CardContent>
       <TotalSupplyChart chartRef={props.divChartRef} />
    </CardContent>
  );
};

export default CardContentSupply;
