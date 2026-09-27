"use client";

import { BriefcaseBusiness } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { VisualizerCanvas } from "../VisualizerCanvas";
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
    <VisualizerCanvas
      title="ZecHub DAO Proposals"
      description="Explore the process and tools used to executing proposals"
      currentStep={currentStage}
      totalSteps={STAGES.length}
      isPlaying={isPlaying}
      onPrevious={goToPrevious}
      onNext={goToNext}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onRestart={restart}
      iconHeader={<BriefcaseBusiness className="w-10 h-10 text-yellow-400" />}
    >
      <div className="container mx-auto p-8 mt-24">
        <StageContent stage={stage} isAnimating={isAnimating} />
      </div>
    </VisualizerCanvas>
  );
};
