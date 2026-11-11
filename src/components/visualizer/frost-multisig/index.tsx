"use client";

import { Signature } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { VisualizerCanvas } from "../VisualizerCanvas";
import { StageContent, STAGES } from "./FrostMultisigContent";

const STAGE_INTERVAL = 12000; // 12 seconds per stage (interactive stages need breathing room)

interface FrostMultisigVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const FrostMultisigVisualizer = ({
  onComplete,
  autoStart = false,
}: FrostMultisigVisualizerProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [isAnimating, setIsAnimating] = useState(true);

  // Interactive state shared between the DKG and signing stages.
  const [n, setNState] = useState(5);
  const [t, setTState] = useState(3);
  const [signers, setSigners] = useState<number[]>([]);

  const setN = useCallback((value: number) => {
    setNState(value);
    // Threshold can never exceed participant count.
    setTState((prevT) => Math.min(prevT, value));
    // Drop any selected signers that no longer exist.
    setSigners((prev) => prev.filter((i) => i < value));
  }, []);

  const setT = useCallback((value: number) => {
    setTState(value);
  }, []);

  const toggleSigner = useCallback((i: number) => {
    setSigners((prev) =>
      prev.includes(i) ? prev.filter((s) => s !== i) : [...prev, i],
    );
  }, []);

  const interactive = { n, t, setN, setT, signers, toggleSigner };

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

  // Completion logic
  useEffect(() => {
    if (currentStage === STAGES.length - 1 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, STAGE_INTERVAL);

      return () => clearTimeout(timer);
    }
  }, [currentStage, onComplete]);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      goToNext();
    }, STAGE_INTERVAL);

    return () => clearTimeout(timer);
  }, [isPlaying, goToNext, currentStage]);

  return (
    <VisualizerCanvas
      title="FROST Threshold Signatures"
      description="Secure multisig without a single point of failure"
      currentStep={currentStage}
      totalSteps={STAGES.length}
      isPlaying={isPlaying}
      onPrevious={goToPrevious}
      onNext={goToNext}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onRestart={restart}
      iconHeader={<Signature className="w-10 h-10 text-yellow-400" />}
    >
      <div className="container mx-auto p-8 mt-12">
        <StageContent
          stage={stage}
          isAnimating={isAnimating}
          interactive={interactive}
        />
      </div>
    </VisualizerCanvas>
  );
};

export default FrostMultisigVisualizer;
