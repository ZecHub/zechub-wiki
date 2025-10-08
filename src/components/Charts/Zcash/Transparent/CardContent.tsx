import React, { RefObject, useState } from "react";
import ChartFooter from "../../ChartFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../Tabs";
import DifficultyChart from "../DifficultyChart";
import IssuanceChart from "../IssuanceChart";
import LockboxChart from "../LockboxChart";
import NetInflowsOutflowsChart from "../NetInflowsOutflowsChart";
import PrivacySetVisualizationChart from "../PrivacySetVisualizationChart";
import ShieldedSupplyChart from "../ShieldedSupplyChart";
import TransactionsSummaryChart from "../TransactionSummaryChart";
import { CardContent } from "@/components/UI/shadcn/card";
import NodeCountChart from "../NodeCountChart";
import TransparentSupplyChart from "./TransparentSupplyChart";

type ZcashChartProps = {
  lastUpdated: Date;
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
              lastUpdatedDate={props.lastUpdated}
            />
          </>
        )}
      </Tabs>
    </CardContent>
  );
};

export default CardContentTxn;
