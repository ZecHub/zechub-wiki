
import { cn } from "@/lib/util";
import { useState } from "react";
import { NetworkUpgrade } from "./networkUpgrade";

interface EvolutinCardProps {
  upgrade: NetworkUpgrade;
  index: number;
}

export function EvolutinCard(props: EvolutinCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isCurrent = props.upgrade.status === "current";
  const isFuture = props.upgrade.status === "future";

  return (
    <div className="relative flex gap-4 md:gap-8">
      <div className="flex flex-col items-center shrink-0">
        <div
          className={cn(
            "w-4 h-4 rounded-full border-2 z-10 shrink-0",
            isCurrent && "animate-pulse w-5 h-5",
            isFuture && "border-dashed",
          )}
          style={{
            borderColor: `hsl(${props.upgrade.eraColor})`,
            backgroundColor: isFuture
              ? "transparent"
              : `hsl(${props.upgrade.eraColor})`,
          }}
        />
        <div
          className={cn(
            "w-0.5 flex-1 min-h-8",
            isFuture &&
              "border-1-2 border-dashed border-muted-foreground/30 w-0",
          )}
          style={
            !isFuture
              ? { backgroundColor: `hsl(${props.upgrade.eraColor}/0.3)` }
              : undefined
          }
        />
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "flex-1 mb-6 rounded-lg border bg-card p-5 text-left transition-all hover:border-primary/40",
          isCurrent && "glow-zcash border-primary/50",
          isFuture && "border-dashed border-muted-foreground/30 bg-card/50",
          "animate-fade-in",
        )}
        style={{
          animationDelay: `${props.index * 80}ms`,
          borderColor: isCurrent
            ? undefined
            : expanded
              ? `hsl(${props.upgrade.eraColor}/ 0.5)`
              : undefined,
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {isCurrent && (
              <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-primary mb-1">
                ● You Are Here
              </span>
            )}
            {isFuture && (
                <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    Coming Soon
                </span>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
