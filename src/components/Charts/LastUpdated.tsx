import { formatDate } from "@/lib/chart/helpers";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";

const SupplyDataLastUpdated = (args: { lastUpdated: Date }) => {
  return (
    <ErrorBoundary fallback={"Failed to load Zcash Metrics"}>
      <p className="dark:text-slate-500  font-light text-sm text-slate-400">
        Last updated: {formatDate(args.lastUpdated.toString())}
      </p>
    </ErrorBoundary>
  );
};

export default SupplyDataLastUpdated;
