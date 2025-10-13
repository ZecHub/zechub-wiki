import { useEffect, useState } from "react";
import { ExportButton } from "./ExportButton";
import SupplyDataLastUpdated from "./LastUpdated";
import { getCommitUrlForTab, getLastUpdatedDate } from "@/lib/chart/helpers";


type ChartFooterProps = {
  lastUpdatedDate: string;
  handleSaveToPng: any;
  imgLabel: string;
};

const ChartFooter = (props: ChartFooterProps) => {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  useEffect(() => {
    console.log('props' , props.lastUpdatedDate)
      const controller = new AbortController();
  
      const fetchAllData = async () => {
        try {
          const [lastUpdated] = await Promise.all([
            getLastUpdatedDate(getCommitUrlForTab(props.lastUpdatedDate), controller.signal),
          ]);
  
          if (lastUpdated) {
            setLastUpdated(new Date(lastUpdated));
          }
        } catch (err) {
          console.error("Error fetching dashboard data:", err);
        }
      };
  
      fetchAllData();
  
      return () => {
        controller.abort();
      };
    }, [props.lastUpdatedDate]);
  return (
    <>
      {lastUpdated && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 48,
          }}
        >
          <SupplyDataLastUpdated lastUpdated={lastUpdated} />

          <ExportButton
            handleSaveToPng={props.handleSaveToPng}
            imgLabel={props.imgLabel}
          />
        </div>
      )}
    </>
  );
};

export default ChartFooter;
