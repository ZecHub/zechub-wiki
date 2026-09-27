"use client";

import { Construction } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { VisualizerCanvas } from "../VisualizerCanvas";
import { ZecHubBountiesContent, slides } from "./ZecHubBountiesContent";
import "./index.css";

const SLIDES = slides.map((s) => ({ id: s.id, title: s.title }));
interface ContributionVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const ContributionVisualizer = ({
  onComplete,
  autoStart = false,
}: ContributionVisualizerProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);

  const goToNext = useCallback(() => {
    setCurrentStage((prev) => {
      if (prev < SLIDES.length - 1) {
        return prev + 1;
      }
      // Stop playing when reaching the end
      setIsPlaying(false);
      return prev;
    });
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentStage((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const restart = useCallback(() => {
    setCurrentStage(0);
    setIsPlaying(false);
  }, []);

  const handleSlideChange = useCallback((index: number) => {
    if (index >= SLIDES.length) {
      setIsPlaying(false);
      setCurrentStage(SLIDES.length - 1);
    } else {
      setCurrentStage(index);
    }
  }, []);

  // Auto-start when autoStart prop is true
  useEffect(() => {
    if (autoStart) {
      setIsPlaying(true);
    }
  }, [autoStart]);

  // Completion logic - triggers when on last slide and playing stops
  useEffect(() => {
    if (currentStage === SLIDES.length - 1 && !isPlaying && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 5000); // 5 seconds on last slide

      return () => clearTimeout(timer);
    }
  }, [currentStage, isPlaying, onComplete]);

  return (
    <VisualizerCanvas
      title="Zcash Mining"
      description="Understanding Zcash's mining and zero-knowledge proof technology"
      currentStep={currentStage}
      totalSteps={SLIDES.length}
      isPlaying={isPlaying}
      onPrevious={goToPrevious}
      onNext={goToNext}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onRestart={restart}
      iconHeader={<Construction className="w-10 h-10 text-yellow-400" />}
    >
      <div className="container mx-auto p-8 mt-12">
        <ZecHubBountiesContent
          currentSlide={currentStage}
          onSlideChange={handleSlideChange}
          isPlaying={isPlaying}
        />
      </div>
    </VisualizerCanvas>
  );
};
