import React, { RefObject, useState } from "react";
import ChartFooter from "../../ChartFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../Tabs";
import { CardContent } from "@/components/UI/shadcn/card";
import TransparentSupplyChart from "./TransparentSupplyChart";

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

const CardContentTxn = (props: ZcashChartProps) => {
  const [activeTab, setActiveTab] = useState("supply");

  const tabLabels = ["Supply"];
  return (
    <CardContent>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {({ activeTab, setActiveTab }: any) => (
          <>
            <TabsList>
              {tabLabels.map((label) => (
                <TabsTrigger
                  key={label}
                  value={label.toLowerCase()}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="supply" activeTab={activeTab}>
              <TransparentSupplyChart chartRef={props.divChartRef} />
            </TabsContent>
            
            <ChartFooter
              imgLabel={activeTab}
              handleSaveToPng={props.handleSaveToPng}
              lastUpdatedDate={activeTab}
            />
          </>
        )}
      </Tabs>
    </CardContent>
  );
};

export default CardContentTxn;
