import { ExternalLink } from "lucide-react";
import { Grant } from "../../types/grants";
import { StatusBadge } from "../StatusBadge";

interface Props {
  grant: Grant;
  index: number;
}
export function GrantHeader(props: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="text-sm font-semibold text-foreground leading-tight">
          {props.grant.grantee}
        </h3>
        <div className="flex justify-between flex-row gap-4">
          <StatusBadge status={props.grant.status} />
          <a
            href={props.grant.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground dark:hover:text-slate-400 hover:text-slate-700" />
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] px-2 py-0.5 rounded dark:bg-slate-700 bg-secondary text-secondary-foreground">
          {props.grant.category}
        </span>
        {/* <span className="text-[10px] text-muted-foreground">
          {props.grant.date}
        </span> */}
      </div>
    </div>
  );
}
