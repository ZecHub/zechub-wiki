"use client";

import { motion } from "framer-motion";
import { Link2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { VisualizerCanvas } from "../VisualizerCanvas";
import {
  AttackSimulatorStage,
  BftLayerStage,
  CrosslinkReferenceStage,
  OverviewStage,
  PowLayerStage,
  ProblemStage,
  STAGES,
  StakingStage,
  TrailingFinalityStage,
} from "./CrosslinkProtocolContent";

const STAGE_INTERVAL = 10000; // 10 seconds per stage
interface CrosslinkProtocolVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

const renderStageContent = (stageId: string) => {
  switch (stageId) {
    case "overview":
      return <OverviewStage />;
    case "the-problem":
      return <ProblemStage />;
    case "pow-layer":
      return <PowLayerStage />;
    case "bft-layer":
      return <BftLayerStage />;
    case "crosslink-ref":
      return <CrosslinkReferenceStage />;
    case "trailing-finality":
      return <TrailingFinalityStage />;
    case "staking":
      return <StakingStage />;
    case "attack-simulator":
      return <AttackSimulatorStage />;
    default:
      return null;
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
    <VisualizerCanvas
      title={"Crosslink Protocol Visualizer"}
      description="How Zcash combines Proof-of-Work with BFT finality, step by step"
      currentStep={currentStage}
      totalSteps={STAGES.length}
      isPlaying={isPlaying}
      onPrevious={goToPrevious}
      onNext={goToNext}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onRestart={restart}
      iconHeader={
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Link2 className="w-10 h-10 text-emerald-400" />
        </motion.div>
      }
    >
      <div className="container mx-auto px-4 py-8 md:py-13 mt-8">
        {renderStageContent(stage.id)}
      </div>
    </VisualizerCanvas>
  );
};

export default CrosslinkProtocolVisualizer;
