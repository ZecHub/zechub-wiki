"use client";

import { useCallback, useEffect, useState } from "react";
import { VisualizerCanvas } from "../VisualizerCanvas";
import { PayWithZcashContent, slides } from "./PayWithZcashContent";

const SLIDES = slides.map((s) => ({ id: s.id, title: s.title }));

interface PayWithZcashVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const PayWithZcashVisualizer = ({
  onComplete,
  autoStart = false,
}: PayWithZcashVisualizerProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);

  const goToNext = useCallback(() => {
    setCurrentStage((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentStage((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const restart = useCallback(() => {
    setCurrentStage(0);
    setIsPlaying(false);
  }, []);

  const handleSlideChange = useCallback((index: number) => {
    setCurrentStage(index);
  }, []);

  useEffect(() => {
    if (autoStart) {
      setIsPlaying(true);
    }
  }, [autoStart]);

  // Completion logic
  useEffect(() => {
    if (currentStage === SLIDES.length - 1 && isPlaying && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 5000); // 5 seconds on last slide

      return () => clearTimeout(timer);
    }
  }, [currentStage, isPlaying, onComplete]);

  return (
    <VisualizerCanvas
      title="Pay With Zcash"
      description="Explore how Zcash payments can be integrated into applications"
      currentStep={currentStage}
      totalSteps={SLIDES.length}
      isPlaying={isPlaying}
      onPrevious={goToPrevious}
      onNext={goToNext}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onRestart={restart}
    >
      <PayWithZcashContent
        currentSlide={currentStage}
        onSlideChange={handleSlideChange}
        isPlaying={isPlaying}
      />
    </VisualizerCanvas>
  );
};
