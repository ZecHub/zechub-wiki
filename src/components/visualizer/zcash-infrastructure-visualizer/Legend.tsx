import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Server, Database, Smartphone } from 'lucide-react';

export const Legend: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mt-20 p-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-3xl backdrop-blur-xl border border-slate-700/50 max-w-3xl mx-auto"
    >
      <h4 className="font-bold text-xl mb-6 text-yellow-400 flex items-center gap-2">
        <Layers className="w-6 h-6" />
        How The Stack Works
      </h4>
      <div className="space-y-4">
        <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex-shrink-0 flex items-center justify-center shadow-lg">
            <Server className="w-4 h-4 text-slate-900" />
          </div>
          <div>
            <p className="text-slate-200 font-medium">Full Node Layer</p>
            <p className="text-slate-400 text-sm">Zebra nodes validate all transactions and maintain the complete blockchain</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex-shrink-0 flex items-center justify-center shadow-lg">
            <Database className="w-4 h-4 text-slate-900" />
          </div>
          <div>
            <p className="text-slate-200 font-medium">Indexer & Server Layer</p>
            <p className="text-slate-400 text-sm">Zaino and Lightwalletd process data and serve it efficiently to light clients</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex-shrink-0 flex items-center justify-center shadow-lg">
            <Smartphone className="w-4 h-4 text-slate-900" />
          </div>
          <div>
            <p className="text-slate-200 font-medium">Wallet Application Layer</p>
            <p className="text-slate-400 text-sm">Mobile, desktop, and web wallets provide user-friendly interfaces for private transactions</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};