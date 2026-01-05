'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { STAGES } from './data';

interface ControlsProps {
  currentStage: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRestart: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  currentStage,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onRestart
}) => {
  const isFirstStage = currentStage === 0;
  const isLastStage = currentStage === STAGES.length - 1;

  return (
    <div className="flex items-center justify-center gap-3">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRestart}
        className="p-3 rounded-xl hover:bg-slate-800 transition-all border border-slate-700/50 hover:border-slate-600"
        aria-label="Restart"
      >
        <RotateCcw className="w-5 h-5 text-slate-400" />
      </motion.button>

      <motion.button
        whileHover={{ scale: isFirstStage ? 1 : 1.1 }}
        whileTap={{ scale: isFirstStage ? 1 : 0.95 }}
        onClick={onPrevious}
        disabled={isFirstStage}
        className={`p-3 rounded-xl transition-all border border-slate-700/50 ${
          isFirstStage 
            ? 'opacity-30 cursor-not-allowed' 
            : 'hover:bg-slate-800 hover:border-slate-600'
        }`}
        aria-label="Previous"
      >
        <SkipBack className="w-5 h-5 text-slate-400" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isPlaying ? onPause : onPlay}
        className="p-5 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-900 shadow-[0_0_40px_rgba(251,191,36,0.4)] hover:shadow-[0_0_60px_rgba(251,191,36,0.6)] transition-all"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
      </motion.button>

      <motion.button
        whileHover={{ scale: isLastStage ? 1 : 1.1 }}
        whileTap={{ scale: isLastStage ? 1 : 0.95 }}
        onClick={onNext}
        disabled={isLastStage}
        className={`p-3 rounded-xl transition-all border border-slate-700/50 ${
          isLastStage 
            ? 'opacity-30 cursor-not-allowed' 
            : 'hover:bg-slate-800 hover:border-slate-600'
        }`}
        aria-label="Next"
      >
        <SkipForward className="w-5 h-5 text-slate-400" />
      </motion.button>

      <div className="ml-4 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
        <span className="text-sm text-slate-300 font-mono font-medium">
          {currentStage + 1} / {STAGES.length}
        </span>
      </div>
    </div>
  );
};