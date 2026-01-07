import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { ControlsProps } from './types';

const Controls: React.FC<ControlsProps> = ({ 
  currentSlide, 
  progress, 
  isPlaying, 
  onPrev, 
  onNext, 
  onPlayPause, 
  onReset, 
  onGoToSlide 
}) => (
  <div className="bg-slate-900/80 backdrop-blur-md border-t border-slate-700/50 p-6">
    <div className="container mx-auto">
      <div className="mb-4">
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((idx) => (
            <button
              key={idx}
              onClick={() => onGoToSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === idx
                  ? 'bg-gradient-to-r from-yellow-400 to-emerald-400 w-8'
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onPrev}
            className="p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={onPlayPause}
            className="p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <button
            onClick={onNext}
            className="p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={onReset}
            className="p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            aria-label="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="text-slate-400 font-mono">
          {currentSlide + 1} / 5
        </div>
      </div>
    </div>
  </div>
);

export default Controls;