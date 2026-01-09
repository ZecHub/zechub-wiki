import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stage } from './types';
import { STAGES } from './data';

interface StageInfoProps {
  stage: Stage;
}

export const StageInfo: React.FC<StageInfoProps> = ({ stage }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-center mb-3 sm:mb-4 md:mb-5 px-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 mb-1.5 sm:mb-2"
        >
          <span className="text-yellow-400 font-semibold text-[10px] sm:text-xs uppercase tracking-wide">
            Stage {stage.id + 1} of {STAGES.length}
          </span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-1.5 md:mb-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent"
        >
          {stage.title}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-300 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed"
        >
          {stage.description}
        </motion.p>

        {/* Compact progress indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex justify-center gap-1 mt-2 sm:mt-2.5 md:mt-3"
        >
          {STAGES.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.02 }}
              className={`h-0.5 sm:h-1 rounded-full transition-all duration-500 ${
                index === stage.id 
                  ? 'w-4 sm:w-6 bg-gradient-to-r from-yellow-400 to-amber-500' 
                  : index < stage.id
                  ? 'w-0.5 sm:w-1 bg-yellow-400/50'
                  : 'w-0.5 sm:w-1 bg-slate-700'
              }`}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};