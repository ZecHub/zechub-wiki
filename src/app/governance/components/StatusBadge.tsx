import { cn } from "@/lib/util";
import { getVariant, StatusVariant } from "../lib/helpers";

const variantStyles: Record<StatusVariant, string> = {
  active: "bg-success/15 text-success border-success/30",
  final: "bg-primary/15 text-primary border-primary/30",
  draft: "bg-muted text-muted-foreground border-border",
  withdrawn: "bg-destructive/15 text-destructive border-destructive/30",
  funded: "bg-primary/15 text-primary border-primary/30",
  "in-progress": "bg-info/15 text-info border-info/30",
  completed: "bg-success/15 text-success border-success/30",
  proposed: "bg-warning/15 text-warning border-warning/30",
  default: "bg-muted text-muted-foreground border-border",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}
export function StatusBadge(props: StatusBadgeProps) {
  const variant = getVariant(props.status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        variantStyles[variant],
        props.className,
      )}
    >
      {props.status}
    </span>
  );
}
