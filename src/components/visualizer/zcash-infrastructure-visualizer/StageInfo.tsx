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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-center mb-8 px-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-block px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 mb-3 relative overflow-hidden"
        >
          <motion.div
            animate={{ x: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent"
          />
          <span className="relative z-10 text-yellow-400 font-semibold text-xs uppercase tracking-wide">
            Stage {stage.id + 1} of {STAGES.length}
          </span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent"
        >
          {stage.title}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-300 max-w-2xl mx-auto text-base leading-relaxed"
        >
          {stage.description}
        </motion.p>

        {/* Visual progress indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex justify-center gap-1.5 mt-4"
        >
          {STAGES.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.03 }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === stage.id 
                  ? 'w-6 bg-gradient-to-r from-yellow-400 to-amber-500' 
                  : index < stage.id
                  ? 'w-1.5 bg-yellow-400/50'
                  : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};