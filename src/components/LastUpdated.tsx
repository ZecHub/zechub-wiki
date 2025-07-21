import { formatDate } from "@/lib/chart/helpers";

const SupplyDataLastUpdated = (args: { lastUpdated: Date }) => {
  return (
    <p className="dark:text-slate-500 mt-8 font-light text-sm text-slate-400">
      Last updated: {formatDate(args.lastUpdated.toString())}
    </p>
  );
};

export default SupplyDataLastUpdated;
