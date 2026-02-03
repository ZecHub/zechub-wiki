"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { VisualizerFooter } from "../Footer";
import { StageContent } from "./StageContent";
import "./index.css";
import { STAGES } from "./types";

const WELCOME_STAGE_INTERVAL = 10000; // 4 seconds for welcome stage
const OTHER_STAGES_INTERVAL = 10000; // 8 seconds for other stages
interface ConsensusVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}
export const ConsensusVisualizer = ({ onComplete, autoStart = false }: ConsensusVisualizerProps) => {
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
    <div className="flex flex-col ">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-6 px-4 text-center border-b  border-slate-200 dark:border-slate-600 mt-12"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full gradient-gold hidden imd:flex items-center justify-center"
          >
            <span className="text-xl font-bold text-primary-foreground">Z</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">
            Zcash Decentralized Consensus
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Interactive guide to Zcash privacy technology
        </p>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-13 mt-8">
        <StageContent stage={stage} isAnimating={isAnimating} />
      </main>

      {/* Controls Footer */}
      <VisualizerFooter
        stages={STAGES}
        currentStage={currentStage}
        isPlaying={isPlaying}
        onRestart={restart}
        onPrevious={goToPrevious}
        goToNext={goToNext}
        goToPrevious={goToPrevious}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </div>
  );
};
