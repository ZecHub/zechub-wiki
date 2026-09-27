"use client";

import { Columns3CogIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { VisualizerCanvas } from "../VisualizerCanvas";
import { ZkavClubContent, slides } from "./ZkavClubContent";

const SLIDES = slides.map((s) => ({ id: s.id, title: s.title }));

interface ZkavClubVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const ZkavClubVisualizer = ({
  onComplete,
  autoStart = false,
}: ZkavClubVisualizerProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);

  const goToNext = useCallback(() => {
    setCurrentStage((prev) => {
      if (prev < SLIDES.length - 1) {
        return prev + 1;
      }
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

  useEffect(() => {
    if (autoStart) {
      setIsPlaying(true);
    }
  }, [autoStart]);

  useEffect(() => {
    if (currentStage === SLIDES.length - 1 && !isPlaying && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentStage, isPlaying, onComplete]);

  return (
    <VisualizerCanvas
      title="ZKAV Club"
      description="Bringing audiovisual around Privacy"
      currentStep={currentStage}
      totalSteps={SLIDES.length}
      isPlaying={isPlaying}
      onPrevious={goToPrevious}
      onNext={goToNext}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onRestart={restart}
      iconHeader={<Columns3CogIcon className="w-10 h-10 text-yellow-400" />}
    >
      <div className="container mx-auto p-8 ">
        <ZkavClubContent
          currentSlide={currentStage}
          onSlideChange={handleSlideChange}
          isPlaying={isPlaying}
        />
      </div>
    </VisualizerCanvas>
  );
};
