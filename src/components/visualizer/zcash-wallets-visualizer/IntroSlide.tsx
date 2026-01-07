import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const IntroSlide: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full px-8">
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="mb-8"
    >
      <Shield className="w-32 h-32 text-yellow-400" />
    </motion.div>
    
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent"
    >
      Zcash Wallets
    </motion.h1>
    
    <motion.p
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="text-2xl text-slate-300 text-center max-w-3xl mb-8"
    >
      Providing Shielded Functionality
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="grid md:grid-cols-2 gap-6 max-w-4xl"
    >
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
        <div className="w-16 h-16 mx-auto mb-3">
          <img 
            src="/wallets/zashi.png" 
            alt="Zashi logo"
            className="w-full h-full object-contain"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 text-center">Zashi</h3>
        <p className="text-slate-300 text-center text-sm">Tor privacy + Near DEX swaps</p>
      </div>
      
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
        <div className="w-16 h-16 mx-auto mb-3">
          <img 
            src="/wallets/ywallet.png" 
            alt="Ywallet logo"
            className="w-full h-full object-contain"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 text-center">Ywallet</h3>
        <p className="text-slate-300 text-center text-sm">Multiple accounts + Pool transfer</p>
      </div>
    </motion.div>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="text-slate-400 text-center mt-8 text-lg"
    >
      Wallets have different features to suit your needs
    </motion.p>
  </div>
);

export default IntroSlide;