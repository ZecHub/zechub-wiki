import { motion } from "framer-motion";
import { cn } from "@/lib/util";
import { POOL_THEMES, ShieldedPoolId } from "./types";

interface PoolBadgeProps {
  pool: ShieldedPoolId;
  status?: string;
  dimmed?: boolean;
  pulse?: boolean;
  className?: string;
}

export const PoolBadge = ({
  pool,
  status,
  dimmed = false,
  pulse = false,
  className,
}: PoolBadgeProps) => {
  const theme = POOL_THEMES[pool];
  const Icon = theme.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 transition-opacity",
        theme.border,
        theme.bg,
        dimmed && "opacity-50",
        className
      )}
    >
      <motion.div
        animate={pulse ? { scale: [1, 1.12, 1] } : undefined}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className={cn("rounded-lg p-2", theme.bg, theme.text)}
      >
        <Icon className="w-5 h-5" />
      </motion.div>
      <div className="min-w-0">
        <p className={cn("font-semibold leading-tight", theme.text)}>
          {theme.name}
        </p>
        {status && (
          <p className="text-xs text-muted-foreground leading-tight">
            {status}
          </p>
        )}
      </div>
    </div>
  );
};
