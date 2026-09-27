"use client";

import { Key } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { VisualizerCanvas } from "../VisualizerCanvas";
import { StageContent } from "./StageContent";
import "./index.css";
import { STAGES } from "./types";

const WELCOME_STAGE_INTERVAL = 1000; // 4 seconds for welcome stage
const OTHER_STAGES_INTERVAL = 10000; // 10 seconds for other stages
interface ZcashKeyVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}
export const ZcashKeyVisualizer = ({
  onComplete,
  autoStart = false,
}: ZcashKeyVisualizerProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [isAnimating, setIsAnimating] = useState(true);

  const stage = STAGES[currentStage];

  const goToNext = useCallback(() => {
    if (currentStage < STAGES.length - 1) {
      setCurrentStage((prev) => prev + 1);
      setIsAnimating(true);
    } else {
      setIsPlaying(false);
    }
  }, [currentStage]);

  const goToPrevious = useCallback(() => {
    if (currentStage > 0) {
      setCurrentStage((prev) => prev - 1);
      setIsAnimating(true);
    }
  }, [currentStage]);

  const goToStage = useCallback((stageIndex: number) => {
    setCurrentStage(stageIndex);
    setIsAnimating(true);
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

  // Completion logic
  useEffect(() => {
    if (currentStage === STAGES.length - 1 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, OTHER_STAGES_INTERVAL);

      return () => clearTimeout(timer);
    }
  }, [currentStage, onComplete]);
  // Auto-play logic with different intervals
  useEffect(() => {
    if (!isPlaying) return;

    // Use faster interval for welcome stage (stage 0), slower for others
    const interval =
      currentStage === 0 ? WELCOME_STAGE_INTERVAL : OTHER_STAGES_INTERVAL;

    const timer = setTimeout(() => {
      goToNext();
    }, interval);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStage, goToNext]);

  return (
    <VisualizerCanvas
      title="Zcash Key Visualizer"
      description="Interactive guide to Zcash privacy technology"
      currentStep={currentStage}
      totalSteps={STAGES.length}
      isPlaying={isPlaying}
      onPrevious={goToPrevious}
      onNext={goToNext}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onRestart={restart}
      iconHeader={<Key className="w-10 h-10 text-emerald-400" />}
    >
      <div className="container mx-auto px-4 py-8 md:py-13 mt-8">
        <StageContent stage={stage} isAnimating={isAnimating} />
      </div>
    </VisualizerCanvas>
  );
};
