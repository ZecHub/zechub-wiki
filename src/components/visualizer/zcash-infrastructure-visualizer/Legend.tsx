import React from 'react';
import { motion } from 'framer-motion';
import { Server, Database, Smartphone } from 'lucide-react';

export const Legend: React.FC = () => {
  const items = [
    {
      icon: Server,
      gradient: 'from-yellow-400 to-amber-500',
      title: 'Full Nodes',
      description: 'Validate & store blockchain'
    },
    {
      icon: Database,
      gradient: 'from-emerald-400 to-green-500',
      title: 'Indexers',
      description: 'Process & serve data'
    },
    {
      icon: Smartphone,
      gradient: 'from-purple-400 to-pink-500',
      title: 'Wallets',
      description: 'User interfaces'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-2 sm:px-4"
    >
      <div className="max-w-2xl mx-auto grid grid-cols-3 gap-2 sm:gap-2.5 md:gap-3">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center gap-1.5 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-800/40 border border-slate-700/30 backdrop-blur-sm"
            >
              <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md sm:rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-slate-900" />
              </div>
              <div className="text-center">
                <p className="text-slate-200 font-medium text-xs sm:text-sm">
                  {item.title}
                </p>
                <p className="text-slate-400 text-[10px] sm:text-xs">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};