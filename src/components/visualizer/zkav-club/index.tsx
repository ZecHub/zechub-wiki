"use client";

import { useCallback, useState, useEffect } from "react";
import { PlaybackControls } from "../PlaybackControls";
import { ZkavClubContent, slides } from "./ZkavClubContent";

const SLIDES = slides.map((s) => ({ id: s.id, title: s.title }));

interface ZkavClubVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const ZkavClubVisualizer = ({
  onComplete,
  autoStart = false
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
    <div className="flex flex-col min-h-screen">
      <main className="container mx-auto px-4 py-8 md:py-13 mt-12">
        <ZkavClubContent
          currentSlide={currentStage}
          onSlideChange={handleSlideChange}
          isPlaying={isPlaying}
        />
      </main>

      <footer className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border/50 py-6">
        <PlaybackControls
          currentStage={currentStage}
          isPlaying={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onNext={goToNext}
          onPrevious={goToPrevious}
          onRestart={restart}
          stages={SLIDES}
        />
      </footer>
    </div>
  );
};
