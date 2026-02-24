import { Grant } from "../../types/grants";
import { StatusBadge } from "../StatusBadge";

interface Props {
  grant: Grant;
}
export function GrantHeader(props: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="text-sm font-semibold text-foreground leading-tight">
          {props.grant.grantee}
        </h3>
        <StatusBadge status={props.grant.status} />
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
