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
        <StatusBadge status={props.grant.summary.overallStatus} />
      </div>

      <p className="text-xs mb-3">
        <span className="text-gray-500">
          Category:{" "}
          <span className="text-gray-400">{props.grant.category}</span>
        </span>
      </p>
    </div>
  );
}
