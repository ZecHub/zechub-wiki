import { Milestone } from "../../types/grants";

interface Props {
  milestone: Milestone;
}

export function MilestoneItem(props: Props) {
  const milestone = props.milestone;

  return (
    <div className="border rounded p-2 text-sm dark:bg-gray-700">
      <div className="flex justify-evenly">
        <span>Milestone {milestone.numericOrder}</span>
        {milestone.amountUSD && (
          <span>Amount: ${milestone.amountUSD.toLocaleString()}</span>
        )}

        {milestone.paidOutDate && <span>Paid: {milestone.paidOutDate}</span>}
      </div>
    </div>
  );
}
