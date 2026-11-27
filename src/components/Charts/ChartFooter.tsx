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
  const tab = props.lastUpdatedDate;
  const [lastUpdated, setLastUpdated] = useState<{ tab: string; date: Date } | null>(null);
  const displayedDate = lastUpdated?.tab === tab ? lastUpdated.date : null;

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const loadDate = async () => {
      const dataDate = await getLatestDataDateForTab(tab, signal);
      if (signal.aborted) return;

      const commitUrl = getCommitUrlForTab(tab);
      const value =
        dataDate ?? (commitUrl ? await getLastUpdatedDate(commitUrl, signal) : null);
      const date = value ? new Date(value) : null;
      if (!signal.aborted) {
        setLastUpdated(date && Number.isFinite(date.getTime()) ? { tab, date } : null);
      }
    };

    void loadDate();
    return () => controller.abort();
  }, [tab]);

  return (
    <div className="mt-12 flex items-center justify-between">
      <div>
        {displayedDate && <SupplyDataLastUpdated lastUpdated={displayedDate} />}
      </div>
      <ExportButton
        handleSaveToPng={props.handleSaveToPng}
        imgLabel={props.imgLabel}
      />
    </div>
  );
};

export default ChartFooter;
