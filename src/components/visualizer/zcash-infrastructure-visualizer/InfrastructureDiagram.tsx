import React from 'react';
import { motion } from 'framer-motion';
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
    <div className="relative max-w-7xl mx-auto px-4">
      {/* Layer 1: Full Nodes */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm uppercase tracking-wider text-slate-400 font-semibold backdrop-blur-sm">
            Layer 1: Full Nodes
          </span>
        </div>
        <div className="max-w-md mx-auto">
          <ComponentBox 
            id="zebra" 
            component={COMPONENTS.zebra}
            highlighted={isHighlighted('zebra')}
          />
        </div>
      </motion.div>

      {/* Connection Layer 1 to 2 */}
      <div className="relative h-20 mb-12">
        <ConnectionLine 
          highlighted={hasActiveConnection('zebra', 'layer2')}
          vertical={true}
        />
      </div>

      {/* Layer 2: Indexers & Servers */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm uppercase tracking-wider text-slate-400 font-semibold backdrop-blur-sm">
            Layer 2: Indexers & Light Wallet Servers
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <ComponentBox 
            id="zaino" 
            component={COMPONENTS.zaino}
            highlighted={isHighlighted('zaino')}
          />
          <ComponentBox 
            id="lightwalletd" 
            component={COMPONENTS.lightwalletd}
            highlighted={isHighlighted('lightwalletd')}
          />
        </div>
      </motion.div>

      {/* Connection Layer 2 to 3 */}
      <div className="relative h-20 mb-12">
        <div className="grid grid-cols-2 max-w-5xl mx-auto gap-8">
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
      </div>

      {/* Layer 3: Wallets */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm uppercase tracking-wider text-slate-400 font-semibold backdrop-blur-sm">
            Layer 3: Wallet Applications
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <ComponentBox 
            id="mobile" 
            component={COMPONENTS.mobile}
            highlighted={isHighlighted('mobile')}
          />
          <ComponentBox 
            id="desktop" 
            component={COMPONENTS.desktop}
            highlighted={isHighlighted('desktop')}
          />
          <ComponentBox 
            id="web" 
            component={COMPONENTS.web}
            highlighted={isHighlighted('web')}
          />
        </div>
      </motion.div>
    </div>
  );
};