import { motion } from "framer-motion";
import { STAGES } from "./types";
import { cn } from "@/lib/util";

interface ProgressIndicatorProps {
  currentStage: number;
  onStageClick: (stage: number) => void;
}

export const ProgressIndicator = ({
  currentStage,
  onStageClick,
}: ProgressIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {STAGES.map((stage, index) => (
        <button
          key={stage.id}
          onClick={() => onStageClick(index)}
          className="group relative flex flex-col items-center"
          aria-label={`Go to stage ${index + 1}: ${stage.title}`}
        >
          {/* Connector line */}
          {index > 0 && (
            <div className="absolute right-full top-1/2 w-2 h-0.5 -translate-y-1/2">
              <motion.div
                className={cn(
                  "h-full",
                  index <= currentStage ? "bg-primary" : "bg-muted"
                )}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              />
            </div>
          )}

          {/* Stage dot */}
          <motion.div
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300 cursor-pointer",
              index === currentStage
                ? "bg-primary scale-125 ring-4 ring-primary/20"
                : index < currentStage
                ? "bg-primary/60"
                : "bg-muted hover:bg-muted-foreground/30"
            )}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />

          {/* Stage tooltip on hover */}
          <div
            className={cn(
              "absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              "text-xs text-muted-foreground bg-card px-2 py-1 rounded border border-border",
              "pointer-events-none z-10"
            )}
          >
            {stage.title}
          </div>
        </button>
      ))}
    </div>
  );
};
