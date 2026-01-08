import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight, Shield, Zap, Lock } from 'lucide-react';

interface Exchange {
  name: string;
  description: string;
  logo: string;
  url: string;
  features: string[];
}

const EXCHANGES: Exchange[] = [
  {
    name: 'Near Intents',
    description: 'Fast exchange with NEAR support. Swap directly into shielded ZEC with minimal fees.',
    logo: '/exchanges/near-intents.png',
    url: 'https://near.org',
    features: ['Direct to Shielded ZEC', 'Low Fees', 'Fast Swaps']
  },
  {
    name: 'Maya Protocol',
    description: 'Native cross-chain trading without bridges or wrapped tokens. Complete asset control.',
    logo: '/exchanges/maya.png',
    url: 'https://www.mayaprotocol.com',
    features: ['No Bridges', 'Industry Low Fees', 'On-Chain Trading']
  },
  {
    name: 'Firo DEX',
    description: 'Trustless decentralized swaps using atomic swaps with FiroDEX.',
    logo: '/exchanges/firo.png',
    url: 'https://firo.org',
    features: ['Atomic Swaps', 'Trustless', 'Privacy Focused']
  },
  {
    name: 'LeoDEX',
    description: 'Crosschain swapping interface for Maya Protocol, Thorchain, ChainFlip and Rango.',
    logo: '/exchanges/leodex.png',
    url: 'https://leodex.io',
    features: ['Multi-Protocol', 'BTC/ETH/DASH', 'Crosschain']
  },
  {
    name: 'Bison Wallet',
    description: 'Trade crypto peer-to-peer. No trading fees. No KYC.',
    logo: '/exchanges/bison.png',
    url: 'https://bisonwallet.com',
    features: ['P2P Trading', 'No Fees', 'No KYC']
  },
  {
    name: 'THORSwap',
    description: 'Cross-chain DEX powered by THORChain, enabling native swaps without wrapped tokens.',
    logo: '/exchanges/thorswap.png',
    url: 'https://thorswap.finance',
    features: ['THORChain', 'Native Swaps', 'Multi-Asset']
  },
  {
    name: 'Router Protocol',
    description: 'Cross-chain liquidity transport layer for seamless asset transfer between blockchains.',
    logo: '/exchanges/routerProtocol.png',
    url: 'https://routerprotocol.com',
    features: ['Liquidity Layer', 'Multi-Chain', 'Asset Bridge']
  }
];

const SLIDES = [
  {
    title: 'Permissionless Access to ZEC',
    content: 'Zcash can be purchased on Centralised Exchanges, but to ensure permissionless, censorship-resistant access to ZEC, use a DEX.',
    icon: Shield,
    color: 'from-emerald-400 to-cyan-400'
  },
  {
    title: 'Direct to Shielded ZEC',
    content: 'Swap from multiple assets directly to Zcash with minimal fees using Near Intents or Maya Protocol - both support swapping directly into shielded ZEC.',
    icon: Lock,
    color: 'from-yellow-400 to-amber-400'
  },
  {
    title: 'Wallet Integrations',
    content: 'Access DEX platforms through wallet integrations with Zashi, Edge Wallet & Unstoppable Wallet for seamless trading.',
    icon: Zap,
    color: 'from-cyan-400 to-blue-400'
  }
];

const ZcashExchangesVisualizer = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentExchangeSet, setCurrentExchangeSet] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const exchangesPerSlide = 3;
  const totalExchangeSets = Math.ceil(EXCHANGES.length / exchangesPerSlide);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      if (currentSlide < SLIDES.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else if (currentExchangeSet < totalExchangeSets - 1) {
        setCurrentExchangeSet(prev => prev + 1);
      } else {
        setCurrentSlide(0);
        setCurrentExchangeSet(0);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide, currentExchangeSet, isPaused, totalExchangeSets]);

  const currentExchanges = EXCHANGES.slice(
    currentExchangeSet * exchangesPerSlide,
    (currentExchangeSet + 1) * exchangesPerSlide
  );

  const showingSlides = currentSlide < SLIDES.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-12 pb-8 px-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Zcash DEX Exchanges
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Trade Zcash on decentralized exchanges for permissionless, censorship-resistant access
          </p>
        </motion.div>

        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center px-4 pb-16">
          <AnimatePresence mode="wait">
            {showingSlides ? (
              <motion.div
                key={`slide-${currentSlide}`}
                initial={{ opacity: 0, scale: 0.9, rotateY: -90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-4xl"
              >
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-2 border-slate-700/50 rounded-3xl p-12 shadow-2xl">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="inline-block mb-6"
                    >
                      <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${SLIDES[currentSlide].color} flex items-center justify-center shadow-lg`}>
                        {React.createElement(SLIDES[currentSlide].icon, {
                          className: "w-12 h-12 text-slate-900"
                        })}
                      </div>
                    </motion.div>
                    
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl md:text-5xl font-bold mb-6 text-white"
                    >
                      {SLIDES[currentSlide].title}
                    </motion.h2>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl text-slate-300 leading-relaxed"
                    >
                      {SLIDES[currentSlide].content}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`exchanges-${currentExchangeSet}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-7xl"
              >
                <div className="grid md:grid-cols-3 gap-8 px-4">
                  {currentExchanges.map((exchange, index) => (
                    <motion.div
                      key={exchange.name}
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.15, duration: 0.5 }}
                      whileHover={{ scale: 1.05, y: -10 }}
                      className="group"
                    >
                      <a
                        href={exchange.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full"
                      >
                        <div className="h-full bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-2 border-slate-700/50 rounded-2xl p-8 hover:border-yellow-400/50 transition-all duration-300 shadow-xl group-hover:shadow-2xl group-hover:shadow-yellow-400/20">
                          <div className="text-center">
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                              className="mb-4 flex justify-center"
                            >
                              <img 
                                src={exchange.logo} 
                                alt={`${exchange.name} logo`}
                                className="w-20 h-20 object-contain"
                              />
                            </motion.div>
                            
                            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors flex items-center justify-center gap-2">
                              {exchange.name}
                              <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                            
                            <p className="text-slate-300 mb-4 leading-relaxed">
                              {exchange.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 justify-center">
                              {exchange.features.map((feature) => (
                                <span
                                  key={feature}
                                  className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300 border border-slate-600/50"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                            
                            <div className="mt-4 text-yellow-400 font-medium flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                              Visit Exchange
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </a>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress indicators */}
        <div className="pb-8 px-4">
          <div className="flex justify-center gap-2 mb-4">
            {[...Array(SLIDES.length + totalExchangeSets)].map((_, index) => {
              const isSlide = index < SLIDES.length;
              const isActive = isSlide
                ? index === currentSlide && showingSlides
                : index - SLIDES.length === currentExchangeSet && !showingSlides;
              
              return (
                <motion.button
                  key={index}
                  onClick={() => {
                    setIsPaused(true);
                    if (isSlide) {
                      setCurrentSlide(index);
                    } else {
                      setCurrentSlide(SLIDES.length);
                      setCurrentExchangeSet(index - SLIDES.length);
                    }
                    setTimeout(() => setIsPaused(false), 100);
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`h-2 rounded-full transition-all ${
                    isActive
                      ? 'w-12 bg-gradient-to-r from-yellow-400 to-amber-400'
                      : 'w-2 bg-slate-600'
                  }`}
                  aria-label={`Go to ${isSlide ? 'slide' : 'exchange set'} ${isSlide ? index + 1 : index - SLIDES.length + 1}`}
                />
              );
            })}
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              {isPaused ? 'Resume' : 'Pause'} Auto-Play
            </button>
          </div>
          
          <p className="text-center text-slate-500 text-sm mt-4">
            Visit <a href="https://zechub.wiki/dex" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline">zechub.wiki/dex</a> for complete list
          </p>
        </div>
      </div>
    </div>
  );
};

export default ZcashExchangesVisualizer;