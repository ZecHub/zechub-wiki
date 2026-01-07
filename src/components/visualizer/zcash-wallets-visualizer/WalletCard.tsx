import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Wallet } from './types';

interface WalletCardProps {
  wallet: Wallet;
  index: number;
}

const WalletCard: React.FC<WalletCardProps> = ({ wallet, index }) => (
  <motion.a
    href={wallet.link}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="group relative"
  >
    <div className={`bg-gradient-to-br ${wallet.color} p-1 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
      <div className="bg-slate-900 rounded-xl p-6 h-full">
        <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <img 
            src={wallet.logo} 
            alt={`${wallet.name} logo`}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23334155"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="40" fill="%2394a3b8"%3E' + wallet.name[0] + '%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>
        <h3 className="text-2xl font-bold text-white text-center mb-4">{wallet.name}</h3>
        <div className="space-y-2">
          {wallet.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-emerald-400" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm font-semibold">Visit Website</span>
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>
    </div>
  </motion.a>
);

export default WalletCard;