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
      className="px-4"
    >
      <div className="max-w-3xl mx-auto grid grid-cols-3 gap-3">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 backdrop-blur-sm"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 text-slate-900" />
              </div>
              <div className="text-center">
                <p className="text-slate-200 font-medium text-sm">
                  {item.title}
                </p>
                <p className="text-slate-400 text-xs">
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