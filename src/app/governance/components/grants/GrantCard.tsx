import { useState } from "react";
import { Grant } from "../../types/grants";
import { GrantHeader } from "./GrantHeader";
import { GrantSummaryBar } from "./GrantSummaryBar";
import { MilestoneList } from "./MilestoneList";
import { ExternalLink } from "lucide-react";

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
      <GrantHeader grant={props.grant} index={props.index} />
      <div className={`${expanded && "mb3"} my-2`}>
        <GrantSummaryBar grant={props.grant} />
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 text-sm font-medium dark:text-slate-300 text-slate-500 dark:hover:bg-primary/5 bg-slate-300 dark:bg-inherit  border border-slate-400 dark:border-primary/50 p-2 rounded-md"
      >
        {expanded ? "Hide milestones" : "View milestone"}
      </button>
      {expanded && <MilestoneList milestones={props.grant.milestones} />}
    </div>
  );
}
