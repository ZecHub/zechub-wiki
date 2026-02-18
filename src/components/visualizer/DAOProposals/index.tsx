"use client";

import { useCallback, useState, useEffect } from "react";
import { PlaybackControls } from "../PlaybackControls";
import { StageContent, STAGES } from "./DAOProposalContent";

const STAGE_INTERVAL = 10000; // 10 seconds per stage

interface DAOProposalVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const DAOProposalVisualizer = ({
  onComplete,
  autoStart = false,
}: DAOProposalVisualizerProps) => {
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
  }, [isPlaying, goToNext, currentStage]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="container mx-auto px-4 py-8 md:py-13 mt-8 flex-1">
        <StageContent stage={stage} isAnimating={isAnimating} />
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