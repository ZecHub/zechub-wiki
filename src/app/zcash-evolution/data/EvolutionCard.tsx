import { cn } from "@/lib/util";
import { Blocks, Calendar, ChevronDown } from "lucide-react";
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

            <h3
              className="text-base md:text-lg font-bold"
              style={{ color: `hsl(${props.upgrade.eraColor})` }}
            >
              {props.upgrade.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {props.upgrade.subtitle}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground shrink-0 transition-transform mt-1 hover:cursor-pointer",
              expanded && "rotate-180",
            )}
          />
        </div>
        <div className="flex flex-wrap gap-3 mt-3 text-sm to-muted-foreground text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {props.upgrade.date}
          </span>
          {props.upgrade.blockHeight !== null && (
            <span className="flex items-center gap-1 font-mono">
              <Blocks className="h-3 w-3" />#
              {props.upgrade.blockHeight.toLocaleString()}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold  text-slate-700 dark:text-slate-200 mt-3 leading-relaxed">
          {props.upgrade.description}
        </p>
        {expanded && (
          <div className="mt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Key Features
            </h4>

            <ul className="space-y-1.5">
              {props.upgrade.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: `hsl(${props.upgrade.eraColor})`,
                    }}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </button>
    </div>
  );
}
