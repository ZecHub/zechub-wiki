'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

function Header() {
 
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const particles = useMemo(() => {
   
    return Array.from({ length: 20 }, () => ({
      x: `${Math.random() * 100}%`,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8 px-4 text-center border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl relative overflow-hidden"
    >
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted &&
          particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
              initial={{
                x: p.x,
                y: -10,
                opacity: 0,
              }}
              animate={{
                y: '110%',
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: 'linear',
              }}
            />
          ))}
      </div>

      <div className="relative z-10 flex items-center justify-center gap-4 mb-3">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.6)] relative"
        >
          <span className="text-2xl font-bold text-slate-900">Z</span>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-2xl border-2 border-yellow-300/30"
          />
        </motion.div>

        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Zcash Infrastructure Stack
          </h1>
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -right-8 top-0"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </motion.div>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-slate-400 text-lg"
      >
        Interactive guide to Zcash&apos;s architecture and components
      </motion.p>
    </motion.header>
  );
}

export default function Page() {
  return <Header />;
}
