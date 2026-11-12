"use client";

import { useCallback, useEffect, useState } from "react";
import { VisualizerCanvas } from "../VisualizerCanvas";
import { StageContent } from "./StageContent";
import "./index.css";
import { STAGES } from "./types";

const WELCOME_STAGE_INTERVAL = 1000; // 4 seconds for welcome stage
const OTHER_STAGES_INTERVAL = 10000; // 10 seconds for other stages
interface HashFunctionVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}
export const HashFunctionVisualizer = ({
  onComplete,
  autoStart = false,
}: HashFunctionVisualizerProps) => {
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
      title="Cryptographic Fingerprints Visualizer"
      description="Explore cryptography of Zcash privacy technology"
      currentStep={currentStage}
      totalSteps={STAGES.length}
      isPlaying={isPlaying}
      onPrevious={goToPrevious}
      onNext={goToNext}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onRestart={restart}
    >
      <StageContent stage={stage} isAnimating={isAnimating} />
    </VisualizerCanvas>
  );
};
