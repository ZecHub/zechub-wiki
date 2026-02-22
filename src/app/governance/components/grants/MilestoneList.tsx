import { Grant } from "../../types/grants";
import { MilestoneItem } from "./MilestoneItem.";

interface Props {
  milestones: Grant["milestones"];
}

export function MilestoneList(props: Props) {
  return (
    <div className="mt-4 space-y-3">
      {props.milestones.map((m) => (
        <MilestoneItem key={m.number} milestone={m} />
      ))}
    </div>
  );
}
