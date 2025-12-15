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

export const Controls = () => {
  return (
    <div>
      
    </div>
  );
};
