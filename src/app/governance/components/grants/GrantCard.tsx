import { useState } from "react";
import { Grant } from "../../types/grants";
import { GrantHeader } from "./GrantHeader";
import { GrantSummaryBar } from "./GrantSummaryBar";
import { MilestoneList } from "./MilestoneList";

interface Props {
  grant: Grant;
  index: number;
}

export function GrantCard(props: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-slate-200 dark:bg-slate-800 rounded-lg border border-border p-5 hover:border-primary/40 hover:glow-zcash transition-all animate-fade-in"
      style={{ animationDelay: `${props.index * 50}ms` }}
    >
      <GrantHeader grant={props.grant} />
      <div className={`${expanded && 'mb3'} my-2`}>
        <GrantSummaryBar grant={props.grant} />
      </div>
      {expanded && <MilestoneList milestones={props.grant.milestones} />}

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 text-sm font-medium text-slate-300 hover:underline"
      >
        {expanded ? "Hide milestones" : "View milestone"}
      </button>
    </div>
  );
}
