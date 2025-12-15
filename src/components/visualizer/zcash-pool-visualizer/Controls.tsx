import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";
import { Button } from "@/components/UI/button";
import { STAGES } from "./types";
import { cn } from "@/lib/util";

interface ControlsProps {
  currentStage: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRestart: () => void;
}

export const Controls = (props: ControlsProps) => {
    const isFirstStage = props.currentStage === 0;
    const isLastStage = props.currentStage === STAGES.length - 1;

  return (
    <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}}
    className="flex items-center justify-center gap-2">
      
      {/* Restart */}
      <Button variant={'ghost'} size={'icon'} onClick={props.onRestart}>
        <RotateCcw className="w-4 h-4"/>
      </Button>
  
      {/* Previous */}
      <Button variant={'ghost'} size={'icon'} onClick={props.onPrevious} disabled={isFirstStage}
      className={cn(
        `text-muted-foreground hover:text-foreground`, isFirstStage && 'opacity-50 cursor-not-allowed'
      )}
      aria-label="Previous stage">
        <SkipBack className="w-4 h-4"/>
      </Button>
    </motion.div>
  );
};
