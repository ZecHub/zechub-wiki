"use client";

import { motion } from "framer-motion";
import { useCallback, useState, useEffect } from "react";
import { PlaybackControls } from "../PlaybackControls";
import { Link2 } from "lucide-react";
import {
  STAGES,
  OverviewStage,
  ProblemStage,
  PowLayerStage,
  BftLayerStage,
  CrosslinkReferenceStage,
  TrailingFinalityStage,
  StakingStage,
  AttackSimulatorStage,
} from "./CrosslinkProtocolContent";

const ZecIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="zec-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F4B728" />
        <stop offset="100%" stopColor="#D69412" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#zec-grad)" />
    <path
      d="M20 18 H44 V24 L26 42 H44 V48 H20 V42 L38 24 H20 Z"
      fill="#1a1a1a"
    />
  </svg>
);

const STAGE_INTERVAL = 10000; // 10 seconds per stage

interface CrosslinkProtocolVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

const renderStageContent = (stageId: string) => {
  switch (stageId) {
    case "overview":           return <OverviewStage />;
    case "the-problem":        return <ProblemStage />;
    case "pow-layer":          return <PowLayerStage />;
    case "bft-layer":          return <BftLayerStage />;
    case "crosslink-ref":      return <CrosslinkReferenceStage />;
    case "trailing-finality":  return <TrailingFinalityStage />;
    case "staking":            return <StakingStage />;
    case "attack-simulator":   return <AttackSimulatorStage />;
    default:                   return null;
  }
};

export const CrosslinkProtocolVisualizer = ({
  onComplete,
  autoStart = false,
}: CrosslinkProtocolVisualizerProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [, setIsAnimating] = useState(true);

  const stage = STAGES[currentStage];

  const goToNext = useCallback(() => {
    setCurrentStage((prev) => {
      if (prev < STAGES.length - 1) {
        setIsAnimating(true);
        return prev + 1;
      } else {
        setIsPlaying(false);
        return prev;
      }
    });
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentStage((prev) => {
      if (prev > 0) {
        setIsAnimating(true);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const restart = useCallback(() => {
    setCurrentStage(0);
    setIsAnimating(true);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (autoStart) {
      setIsPlaying(true);
    }
  }, [autoStart]);

  useEffect(() => {
    if (currentStage === STAGES.length - 1 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, STAGE_INTERVAL);
      return () => clearTimeout(timer);
    }
  }, [currentStage, onComplete]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      goToNext();
    }, STAGE_INTERVAL);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStage, goToNext]);

  return (
    <div className="flex flex-col min-h-screen">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-6 px-4 text-center border-b border-border mt-12"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Link2 className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">
            Crosslink Protocol Visualizer
          </h1>
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <ZecIcon className="w-7 h-7" />
          </motion.div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          How Zcash combines Proof-of-Work with BFT finality, step by step
        </p>
      </motion.header>

      <main className="container mx-auto px-4 py-8 md:py-13 mt-8">
        {renderStageContent(stage.id)}
      </main>

      <footer className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border/50 py-6">
        <PlaybackControls
          stages={STAGES}
          currentStage={currentStage}
          isPlaying={isPlaying}
          onRestart={restart}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      </footer>
    </div>
  );
};

export default CrosslinkProtocolVisualizer;
