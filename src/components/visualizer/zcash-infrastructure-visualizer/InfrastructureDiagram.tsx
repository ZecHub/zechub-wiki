import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stage } from './types';
import { COMPONENTS } from './data';
import { ComponentBox } from './ComponentBox';
import { ConnectionLine } from './ConnectionLine';

interface InfrastructureDiagramProps {
  stage: Stage;
}

export const InfrastructureDiagram: React.FC<InfrastructureDiagramProps> = ({ stage }) => {
  const isHighlighted = (componentId: string) => stage.highlight.includes(componentId);
  
  const hasActiveConnection = (from: string, to: string) => {
    if (stage.highlight.length === 0) return false;
    return isHighlighted(from) && stage.highlight.some(h => 
      (to === 'layer2' && (h === 'zaino' || h === 'lightwalletd')) ||
      (to === 'layer3' && (h === 'mobile' || h === 'desktop' || h === 'web'))
    );
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 pb-24">
      {/* Layer 1: Full Nodes */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="text-center mb-4">
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-block px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/50 text-xs uppercase tracking-wider text-slate-300 font-semibold backdrop-blur-sm shadow-lg"
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Layer 1: Full Nodes
            </motion.span>
          </motion.span>
        </div>
        <motion.div 
          className="max-w-md mx-auto"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <ComponentBox 
            id="zebra" 
            component={COMPONENTS.zebra}
            highlighted={isHighlighted('zebra')}
          />
        </motion.div>
      </motion.div>

      {/* Connection Layer 1 to 2 */}
      <AnimatePresence>
        {stage.highlight.length > 0 && (
          <motion.div 
            className="relative h-12 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ConnectionLine 
              highlighted={hasActiveConnection('zebra', 'layer2')}
              vertical={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 2: Indexers & Servers */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="text-center mb-4">
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="inline-block px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/50 text-xs uppercase tracking-wider text-slate-300 font-semibold backdrop-blur-sm shadow-lg"
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              Layer 2: Indexers & Light Wallet Servers
            </motion.span>
          </motion.span>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <ComponentBox 
              id="zaino" 
              component={COMPONENTS.zaino}
              highlighted={isHighlighted('zaino')}
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <ComponentBox 
              id="lightwalletd" 
              component={COMPONENTS.lightwalletd}
              highlighted={isHighlighted('lightwalletd')}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Connection Layer 2 to 3 */}
      <AnimatePresence>
        {stage.highlight.some(h => h === 'mobile' || h === 'desktop' || h === 'web') && (
          <motion.div 
            className="relative h-12 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-2 max-w-5xl mx-auto gap-6">
              <div className="relative">
                <ConnectionLine 
                  highlighted={hasActiveConnection('zaino', 'layer3')}
                  vertical={true}
                />
              </div>
              <div className="relative">
                <ConnectionLine 
                  highlighted={hasActiveConnection('lightwalletd', 'layer3')}
                  vertical={true}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 3: Wallets */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="text-center mb-4">
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="inline-block px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/50 text-xs uppercase tracking-wider text-slate-300 font-semibold backdrop-blur-sm shadow-lg"
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              Layer 3: Wallet Applications
            </motion.span>
          </motion.span>
        </div>
        <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {['mobile', 'desktop', 'web'].map((id, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.08 }}
              whileHover={{ scale: 1.02 }}
            >
              <ComponentBox 
                id={id} 
                component={COMPONENTS[id]}
                highlighted={isHighlighted(id)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};