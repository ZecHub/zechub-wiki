"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { VisualizerCanvas } from "../VisualizerCanvas";
import {
  BindingSignatureStage,
  BuilderStage,
  OutputDescriptionStage,
  OverviewStage,
  PedersenStage,
  SpendDescriptionStage,
  STAGES,
  TheNoteStage,
  ZkProofStage,
} from "./BuildShieldedTransactionContent";

const STAGE_INTERVAL = 14000; // 14 seconds per stage

interface BuildShieldedTransactionVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

const renderStageContent = (stageId: string) => {
  switch (stageId) {
    case "overview":
      return <OverviewStage />;
    case "the-note":
      return <TheNoteStage />;
    case "spend-description":
      return <SpendDescriptionStage />;
    case "output-description":
      return <OutputDescriptionStage />;
    case "pedersen":
      return <PedersenStage />;
    case "zk-proof":
      return <ZkProofStage />;
    case "binding-signature":
      return <BindingSignatureStage />;
    case "builder":
      return <BuilderStage />;
    default:
      return null;
  }
};

export const BuildShieldedTransactionVisualizer = ({
  onComplete,
  autoStart = false,
}: BuildShieldedTransactionVisualizerProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [isAnimating, setIsAnimating] = useState(true);

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
      title="Shielded Transaction Visualizer"
      description="Build and understand a Zcash shielded transaction — step by step"
      currentStep={currentStage}
      totalSteps={STAGES.length}
      isPlaying={isPlaying}
      onPrevious={goToPrevious}
      onNext={goToNext}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onRestart={restart}
      iconHeader={<Shield className="w-10 h-10 text-emerald-400" />}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      ></motion.div>

      <div className="w-full max-w-6xl mx-auto md:py-12 space-y-8 relative top-40">
        {renderStageContent(stage.id)}
      </div>
    </VisualizerCanvas>
  );
};

export default BuildShieldedTransactionVisualizer;
