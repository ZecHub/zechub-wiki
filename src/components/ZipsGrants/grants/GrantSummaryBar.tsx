import { Grant } from "../../types/grants";

interface Props {
  grant: Grant;
}

export function GrantSummaryBar(props: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm dark:text-slate-300 mb-3 line-clamp-2">
        {props.grant.project}
      </p>
      <div className="flex justify-between dark:text-slate-300 text-sm mb-2">
        <span>
          {props.grant.summary.completedMilestones} /{" "}
          {props.grant.summary.totalMilestones} Milestones
        </span>
        <span>{props.grant.summary.completedPercent}%</span>
      </div>

      <div className="h-1 bg-gray-200 rounded">
        <div
          className="h-1 bg-green-500 rounded"
          style={{ width: `${props.grant.summary.completedPercent}%` }}
        />
      </div>

      <div className="text-sm dark:text-primary text-gray-700 mt-2">
        Total Awarded: ${props.grant.summary.totalAmountUSD.toLocaleString()}
      </div>
    </div>
  );
}
