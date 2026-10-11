import { useEffect, useState } from "react";
import { ExportButton } from "./ExportButton";
import SupplyDataLastUpdated from "./LastUpdated";
import {
  getCommitUrlForTab,
  getLastUpdatedDate,
  getLatestDataDateForTab,
} from "@/lib/chart/helpers";

type ChartFooterProps = {
  lastUpdatedDate: string;
  handleSaveToPng: any;
  imgLabel: string;
};

const ChartFooter = (props: ChartFooterProps) => {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      try {
        // Prefer the latest date actually present in the data files for this tab.
        // This updates whenever the local (or remote) JSON is refreshed.
        const dataDate = await getLatestDataDateForTab(
          props.lastUpdatedDate,
          controller.signal,
        );
        if (dataDate) {
          const d = new Date(dataDate);
          if (!isNaN(d.getTime())) {
            setLastUpdated(d);
            return;
          }
        }

        // Fallback: GitHub commit date of the corresponding data file
        const commitDate = await getLastUpdatedDate(
          getCommitUrlForTab(props.lastUpdatedDate),
          controller.signal,
        );
        if (commitDate && commitDate !== "N/A") {
          setLastUpdated(new Date(commitDate));
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
