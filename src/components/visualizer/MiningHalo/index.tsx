"use client";

import { motion } from "framer-motion";
import { useCallback, useState, useEffect } from "react";
import { PlaybackControls } from "../PlaybackControls";
import { StageContent, STAGES } from "./MiningHaloContent";
import { Pickaxe, Zap } from "lucide-react";

const STAGE_INTERVAL = 10000; // 10 seconds per stage

interface MiningHaloVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const MiningHaloVisualizer = ({ 
  onComplete, 
  autoStart = false 
}: MiningHaloVisualizerProps) => {
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
  }, [isPlaying, currentStage, goToNext]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-6 px-4 text-center border-b border-border mt-12"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center"
          >
            <Pickaxe className="w-5 h-5 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">
            Zcash Mining & Halo 2
          </h1>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Zap className="w-6 h-6 text-purple-400" />
          </motion.div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Understanding Zcash's mining and zero-knowledge proof technology
        </p>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-13 mt-8">
        <StageContent stage={stage} isAnimating={isAnimating} />
      </main>

      {/* Controls Footer */}
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