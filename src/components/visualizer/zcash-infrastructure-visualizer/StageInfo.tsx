import React from 'react';
import { motion } from 'framer-motion';
import { Stage } from './types';
import { STAGES } from './data';

interface StageInfoProps {
  stage: Stage;
}

export const StageInfo: React.FC<StageInfoProps> = ({ stage }) => {
  return (
    <motion.div
      key={stage.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="text-center mb-16 px-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="inline-block px-6 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/30 mb-4"
      >
        <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wide">
          Stage {stage.id + 1} of {STAGES.length}
        </span>
      </motion.div>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
        {stage.title}
      </h2>
      <p className="text-slate-300 max-w-3xl mx-auto text-lg leading-relaxed">
        {stage.description}
      </p>
    </motion.div>
  );
};