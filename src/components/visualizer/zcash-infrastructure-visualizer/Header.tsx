"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-4 px-4 text-center border-slate-700/50  backdrop-blur-xl relative overflow-hidden"
    >
      {/* Reduced particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: -10,
              opacity: 0,
            }}
            animate={{
              y: "110%",
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center gap-3">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.5)] relative"
        >
          <span className="text-xl font-bold text-slate-900">Z</span>
        </motion.div>

        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Zcash Infrastructure Stack
          </h1>
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -right-6 top-0"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};
