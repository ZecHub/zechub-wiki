"use client";

import { useCallback, useEffect, useState } from "react";
import "../index.css";
import { VisualizerCanvas } from "../VisualizerCanvas";
import { StageContent } from "./StageContent";
import { stages } from "./types";

const WELCOME_STAGE_INTERVAL = 1000; // 4 seconds for welcome stage
const OTHER_STAGES_INTERVAL = 10000; // 10 seconds for other stages

interface BlockchainFoundationVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}
export const BlockchainFoundationVisualizer = ({
  onComplete,
  autoStart = false,
}: BlockchainFoundationVisualizerProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [isAnimating, setIsAnimating] = useState(true);

  const stage = stages[currentStage];

  const goToNext = useCallback(() => {
    if (currentStage < stages.length - 1) {
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
    if (currentStage === stages.length - 1 && onComplete) {
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
      title="Blockchain Foundation Visualizer"
      description=" Interactive guide to Blockchain Technology (Foundation)"
      currentStep={currentStage}
      totalSteps={stages.length}
      isPlaying={isPlaying}
      onPrevious={goToPrevious}
      onNext={goToNext}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onRestart={restart}
    >
      <StageContent stage={stage} />
    </VisualizerCanvas>
  );
};
