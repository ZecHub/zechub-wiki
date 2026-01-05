'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8 px-4 text-center border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl"
    >
      <div className="flex items-center justify-center gap-4 mb-3">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.4)]"
        >
          <span className="text-2xl font-bold text-slate-900">Z</span>
        </motion.div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
          Zcash Infrastructure Stack
        </h1>
      </div>
      <p className="text-slate-400 text-lg">Interactive guide to Zcash's architecture and components</p>
    </motion.header>
  );
};