"use client";

import { motion } from "framer-motion";
import { Building } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { VisualizerCanvas } from "../VisualizerCanvas";
import { STAGES } from "./data";
import { InfrastructureDiagram } from "./InfrastructureDiagram";
import { Legend } from "./Legend";
import { StageInfo } from "./StageInfo";

const WELCOME_STAGE_INTERVAL = 1000; // 1 second for welcome/first stage
const OTHER_STAGES_INTERVAL = 10000; // 10 seconds for other stages

interface ZcashInfrastructureVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const ZcashInfrastructureVisualizer = ({
  onComplete,
  autoStart = false,
}: ZcashInfrastructureVisualizerProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setMounted(true);
    audioContextRef.current = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
  }, []);

  const stage = STAGES[currentStage];

  const playTransitionSound = useCallback(
    (frequency: number = 440) => {
      if (isMuted || !audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    },
    [isMuted],
  );

  const playHighlightSound = useCallback(() => {
    if (isMuted || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "triangle";

    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }, [isMuted]);

  const goToNext = useCallback(() => {
    if (currentStage < STAGES.length - 1) {
      setCurrentStage((prev) => prev + 1);
      playTransitionSound(523.25);
      playHighlightSound();
    } else {
      setIsPlaying(false);
      playTransitionSound(659.25);
    }
  }, [currentStage, playTransitionSound, playHighlightSound]);

  const goToPrevious = useCallback(() => {
    if (currentStage > 0) {
      setCurrentStage((prev) => prev - 1);
      playTransitionSound(392);
      playHighlightSound();
    }
  }, [currentStage, playTransitionSound, playHighlightSound]);

  const restart = useCallback(() => {
    setCurrentStage(0);
    setIsPlaying(false);
    playTransitionSound(261.63);
  }, [playTransitionSound]);

  // Auto-start when autoStart prop changes
  useEffect(() => {
    if (autoStart) {
      setIsPlaying(true);
    }
  }, [autoStart]);

  // Auto-play through stages
  useEffect(() => {
    if (!isPlaying) return;

    const interval =
      currentStage === 0 ? WELCOME_STAGE_INTERVAL : OTHER_STAGES_INTERVAL;
    const timer = setTimeout(goToNext, interval);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStage, goToNext]);

  // Completion logic - trigger when reaching last stage
  useEffect(() => {
    if (currentStage === STAGES.length - 1 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, OTHER_STAGES_INTERVAL); // Wait for the last stage to display

      return () => clearTimeout(timer);
    }
  }, [currentStage, onComplete]);

  if (!mounted) {
    return null;
  }

  return (
    <VisualizerCanvas
      title="Zcash Infrastructure Stack"
      description="Interactive guide to Zcash privacy technology"
      currentStep={currentStage}
      totalSteps={STAGES.length}
      isPlaying={isPlaying}
      onPrevious={goToPrevious}
      onNext={goToNext}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onRestart={restart}
      iconHeader={<Building className="w-10 h-10 text-emerald-400" />}
    >
      <div className="flex flex-col bg-background text-foreground dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white relative">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-yellow-400/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-emerald-400/10 rounded-full blur-3xl"
          />
        </div>
      </div>
      <main className="flex flex-col justify-center relative z-10 container m-auto px-2 sm:px-4 py-6 sm:py-8 md:py-13 mt-6 sm:mt-8 min-h-137.5 gap-12 p-8">
        <StageInfo stage={stage} />

        <InfrastructureDiagram stage={stage} />
      </main>

      {currentStage === STAGES.length - 1 && (
        <div className="mt-4">
          <Legend />
        </div>
      )}
    </VisualizerCanvas>
  );
};
