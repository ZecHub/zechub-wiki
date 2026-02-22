import { Milestone } from "../../types/grants";

interface Props {
  milestone: Milestone;
}

export function MilestoneItem(props: Props) {
  const milestone = props.milestone;

  return (
    <div className="border rounded p-3 text-sm dark:bg-gray-700">
      <div className="flex justify-between">
        <span>Milestone {milestone.number}</span>
        <span>{milestone.status}</span>
      </div>

      {milestone.amountUSD && (
        <div>Amount: ${milestone.amountUSD.toLocaleString()}</div>
      )}

      {milestone.paidOutDate && <div>Paid: {milestone.paidOutDate}</div>}
    </div>
  );
}
