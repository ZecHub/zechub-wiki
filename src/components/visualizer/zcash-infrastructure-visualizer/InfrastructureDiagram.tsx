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
  
  // Determine which layers to show based on highlighted components
  const showLayer1 = stage.highlight.includes('zebra');
  const showLayer2 = stage.highlight.some(h => h === 'zaino' || h === 'lightwalletd');
  const showLayer3 = stage.highlight.some(h => h === 'mobile' || h === 'desktop' || h === 'web');
  
  const hasActiveConnection = (from: string, to: string) => {
    if (stage.highlight.length === 0) return false;
    return isHighlighted(from) && stage.highlight.some(h => 
      (to === 'layer2' && (h === 'zaino' || h === 'lightwalletd')) ||
      (to === 'layer3' && (h === 'mobile' || h === 'desktop' || h === 'web'))
    );
  };

  // Welcome stage - show overview
  if (stage.id === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center py-12"
      >
        <div className="text-center max-w-2xl">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-6 mx-auto w-32 h-32 rounded-3xl bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center shadow-[0_0_60px_rgba(251,191,36,0.6)]"
          >
            <span className="text-6xl font-bold text-slate-900">Z</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-300 text-lg leading-relaxed"
          >
            Click <span className="text-yellow-400 font-semibold">Next</span> or <span className="text-yellow-400 font-semibold">Play</span> to explore the infrastructure
          </motion.p>
        </div>
      </motion.div>
    );
  }

  // Last stage - show complete ecosystem
  if (stage.id === 7) {
    return (
      <div className="relative max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Layer 1 */}
          <div className="col-span-3 flex justify-center">
            <div className="w-72">
              <ComponentBox 
                id="zebra" 
                component={COMPONENTS.zebra}
                highlighted={true}
              />
            </div>
          </div>
          
          {/* Connection */}
          <div className="col-span-3 h-8 relative">
            <ConnectionLine highlighted={true} vertical={true} />
          </div>
          
          {/* Layer 2 */}
          <div className="col-span-3 grid grid-cols-2 gap-4">
            <ComponentBox 
              id="zaino" 
              component={COMPONENTS.zaino}
              highlighted={true}
            />
            <ComponentBox 
              id="lightwalletd" 
              component={COMPONENTS.lightwalletd}
              highlighted={true}
            />
          </div>
          
          {/* Connection */}
          <div className="col-span-3 h-8 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative"><ConnectionLine highlighted={true} vertical={true} /></div>
              <div className="relative"><ConnectionLine highlighted={true} vertical={true} /></div>
            </div>
          </div>
          
          {/* Layer 3 */}
          <ComponentBox 
            id="mobile" 
            component={COMPONENTS.mobile}
            highlighted={true}
          />
          <ComponentBox 
            id="desktop" 
            component={COMPONENTS.desktop}
            highlighted={true}
          />
          <ComponentBox 
            id="web" 
            component={COMPONENTS.web}
            highlighted={true}
          />
        </div>
      </div>
    );
  }

  // Individual stages - show only relevant layers
  return (
    <div className="relative max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full"
        >
          {/* Single layer view */}
          {!showLayer2 && !showLayer3 && showLayer1 && (
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <ComponentBox 
                  id="zebra" 
                  component={COMPONENTS.zebra}
                  highlighted={true}
                />
              </div>
            </div>
          )}

          {/* Two layer view (Layer 1 + 2) */}
          {showLayer2 && !showLayer3 && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <ComponentBox 
                    id="zebra" 
                    component={COMPONENTS.zebra}
                    highlighted={isHighlighted('zebra')}
                  />
                </div>
              </div>
              
              <div className="h-12 relative">
                <ConnectionLine highlighted={hasActiveConnection('zebra', 'layer2')} vertical={true} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
            </div>
          )}

          {/* Three layer view (all layers) */}
          {showLayer3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              
              <div className="h-12 relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative"><ConnectionLine highlighted={hasActiveConnection('zaino', 'layer3')} vertical={true} /></div>
                  <div className="relative"><ConnectionLine highlighted={hasActiveConnection('lightwalletd', 'layer3')} vertical={true} /></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
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
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};