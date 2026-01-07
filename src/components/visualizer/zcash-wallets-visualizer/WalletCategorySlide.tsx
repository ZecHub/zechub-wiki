import React from 'react';
import { motion } from 'framer-motion';
import { WalletCategorySlideProps } from './types';
import WalletCard from './WalletCard';

const WalletCategorySlide: React.FC<WalletCategorySlideProps> = ({ 
  title, 
  subtitle, 
  icon, 
  wallets 
}) => (
  <div className="flex flex-col h-full px-8 py-12">
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 mb-8"
    >
      {icon}
      <div>
        <h2 className="text-5xl font-bold text-white">{title}</h2>
        <p className="text-slate-300 text-lg mt-2">{subtitle}</p>
      </div>
    </motion.div>

    <div className="grid md:grid-cols-3 gap-6 flex-1">
      {wallets.map((wallet, idx) => (
        <WalletCard key={wallet.name} wallet={wallet} index={idx} />
      ))}
    </div>
  </div>
);

export default WalletCategorySlide;