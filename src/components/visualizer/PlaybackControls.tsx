import { Button } from "@/components/UI/button";
import { cn } from "@/lib/util";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

interface ControlsProps {
  currentStage: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRestart: () => void;
  stages: any[];
}

export const PlaybackControls = (props: ControlsProps) => {
  const isFirstStage = props.currentStage === 0;
  const isLastStage = props.currentStage === props.stages.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-2"
    >
      {/* Restart */}
      <Button variant={"ghost"} size={"icon"} onClick={props.onRestart}>
        <RotateCcw className="w-4 h-4" />
      </Button>

      {/* Previous */}
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={props.onPrevious}
        disabled={isFirstStage}
        className={cn(
          `text-muted-foreground hover:text-foreground`,
          isFirstStage && "opacity-50 cursor-not-allowed"
        )}
        aria-label="Previous stage"
      >
        <SkipBack className="w-4 h-4" />
      </Button>

      {/* Play/Pause */}
      <Button
        variant={"default"}
        size={"icon"}
        onClick={props.isPlaying ? props.onPause : props.onPlay}
        className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90"
        aria-label={props.isPlaying ? "Pause" : "Play"}
      >
        {props.isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>

      {/* Next */}
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={props.onNext}
        disabled={isLastStage}
        className={cn(
          `text-muted-foreground hover:text-foreground`,
          isLastStage && "opacity-50 cursor-not-allowed"
        )}
        aria-label="Next stage"
      >
        <SkipForward className="w-4 h-4" />
      </Button>

      {/* Stage counter */}
      <div className="ml-4 text-sm text-muted-foreground font-mono">
        {props.currentStage + 1} / {props.stages.length}
      </div>
    </motion.div>
  );
};
