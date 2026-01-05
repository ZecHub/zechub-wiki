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
      {/* Restart button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: -180 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRestart}
        className="p-3 rounded-xl hover:bg-slate-800 transition-all border border-slate-700/50 hover:border-yellow-400/50 relative group"
        aria-label="Restart"
      >
        <RotateCcw className="w-5 h-5 text-slate-400 group-hover:text-yellow-400 transition-colors" />
        <motion.div
          className="absolute inset-0 rounded-xl bg-yellow-400/10"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
        />
      </motion.button>

      {/* Previous button */}
      <motion.button
        whileHover={{ scale: isFirstStage ? 1 : 1.1, x: isFirstStage ? 0 : -3 }}
        whileTap={{ scale: isFirstStage ? 1 : 0.95 }}
        onClick={onPrevious}
        disabled={isFirstStage}
        className={`p-3 rounded-xl transition-all border border-slate-700/50 relative group ${
          isFirstStage 
            ? 'opacity-30 cursor-not-allowed' 
            : 'hover:bg-slate-800 hover:border-emerald-400/50'
        }`}
        aria-label="Previous"
      >
        <SkipBack className={`w-5 h-5 ${isFirstStage ? 'text-slate-600' : 'text-slate-400 group-hover:text-emerald-400'} transition-colors`} />
        {!isFirstStage && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-emerald-400/10"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
          />
        )}
      </motion.button>

      {/* Play/Pause button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isPlaying ? onPause : onPlay}
        className="p-5 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-slate-900 shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:shadow-[0_0_60px_rgba(251,191,36,0.7)] transition-all relative overflow-hidden group"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-yellow-300 rounded-2xl"
        />
        {isPlaying ? (
          <Pause className="w-6 h-6 relative z-10" />
        ) : (
          <Play className="w-6 h-6 relative z-10 ml-1" />
        )}
      </motion.button>

      {/* Next button */}
      <motion.button
        whileHover={{ scale: isLastStage ? 1 : 1.1, x: isLastStage ? 0 : 3 }}
        whileTap={{ scale: isLastStage ? 1 : 0.95 }}
        onClick={onNext}
        disabled={isLastStage}
        className={`p-3 rounded-xl transition-all border border-slate-700/50 relative group ${
          isLastStage 
            ? 'opacity-30 cursor-not-allowed' 
            : 'hover:bg-slate-800 hover:border-cyan-400/50'
        }`}
        aria-label="Next"
      >
        <SkipForward className={`w-5 h-5 ${isLastStage ? 'text-slate-600' : 'text-slate-400 group-hover:text-cyan-400'} transition-colors`} />
        {!isLastStage && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-cyan-400/10"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
          />
        )}
      </motion.button>

      {/* Stage counter */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="ml-4 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden"
      >
        <motion.div
          animate={{ x: ['0%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent"
        />
        <span className="text-sm text-slate-300 font-mono font-medium relative z-10">
          {currentStage + 1} / {STAGES.length}
        </span>
      </motion.div>
    </div>
  );
};