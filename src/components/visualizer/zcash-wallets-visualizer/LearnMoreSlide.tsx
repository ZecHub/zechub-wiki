import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const LearnMoreSlide: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full px-8">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="text-center"
    >
      <div className="text-8xl mb-8">📚</div>
      
      <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
        Learn More
      </h2>
      
      <p className="text-2xl text-slate-300 mb-8 max-w-2xl">
        Explore comprehensive wallet comparisons, features, and guides
      </p>

      <motion.a
        href="https://zechub.wiki/wallets"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 text-slate-900 px-12 py-6 rounded-2xl text-2xl font-bold shadow-lg hover:shadow-2xl transition-all"
      >
        Visit zechub.wiki/wallets
        <ExternalLink className="w-8 h-8" />
      </motion.a>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 grid grid-cols-3 gap-8 max-w-3xl"
      >
        <div className="text-center">
          <div className="text-4xl font-bold text-yellow-400 mb-2">20+</div>
          <div className="text-slate-400">Wallets</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-emerald-400 mb-2">3</div>
          <div className="text-slate-400">Privacy Pools</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-cyan-400 mb-2">100%</div>
          <div className="text-slate-400">Open Source</div>
        </div>
      </motion.div>
    </motion.div>
  </div>
);

export default LearnMoreSlide;