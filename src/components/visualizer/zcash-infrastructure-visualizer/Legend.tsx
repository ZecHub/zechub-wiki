import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Server, Database, Smartphone } from 'lucide-react';

export const Legend: React.FC = () => {
  const items = [
    {
      icon: Server,
      gradient: 'from-yellow-400 to-amber-500',
      title: 'Full Node Layer',
      description: 'Zebra nodes validate all transactions and maintain the complete blockchain'
    },
    {
      icon: Database,
      gradient: 'from-emerald-400 to-green-500',
      title: 'Indexer & Server Layer',
      description: 'Zaino and Lightwalletd process data and serve it efficiently to light clients'
    },
    {
      icon: Smartphone,
      gradient: 'from-purple-400 to-pink-500',
      title: 'Wallet Application Layer',
      description: 'Mobile, desktop, and web wallets provide user-friendly interfaces'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12 p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl backdrop-blur-xl border border-slate-700/50 max-w-2xl mx-auto relative overflow-hidden"
    >
      {/* Background animated gradient */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl"
      />
      
      <div className="relative z-10">
        <h4 className="font-bold text-lg mb-4 text-yellow-400 flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Layers className="w-5 h-5" />
          </motion.div>
          How The Stack Works
        </h4>
        
        <div className="space-y-3">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + index * 0.08 }}
                whileHover={{ x: 6, scale: 1.01 }}
                className="flex items-start gap-3 group cursor-pointer p-2.5 rounded-lg hover:bg-slate-800/30 transition-all"
              >
                <motion.div 
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    scale: 1.1 
                  }}
                  transition={{ duration: 0.5 }}
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex-shrink-0 flex items-center justify-center shadow-lg relative`}
                >
                  <Icon className="w-4 h-4 text-slate-900" />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    className={`absolute inset-0 rounded-lg bg-gradient-to-br ${item.gradient} opacity-30`}
                  />
                </motion.div>
                
                <div className="flex-1">
                  <p className="text-slate-200 font-medium text-sm mb-0.5 group-hover:text-yellow-400 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1, x: 2 }}
                  className="text-slate-500 group-hover:text-yellow-400 transition-colors text-sm"
                >
                  →
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};