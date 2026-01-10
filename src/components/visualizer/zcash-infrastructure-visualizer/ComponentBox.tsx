import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Component } from './types';

interface ComponentBoxProps {
  id: string;
  component: Component;
  highlighted: boolean;
  compact?: boolean;
}

export const ComponentBox: React.FC<ComponentBoxProps> = ({ id, component, highlighted, compact = false }) => {
  const Icon = component.icon;
  
  if (!highlighted) return null;
  
  return (
    <motion.a
      href={component.docs}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block group mx-auto"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1,
        scale: 1,
      }}
      whileHover={{ 
        scale: 1.03,
        opacity: 1
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
            <div className={`
        relative rounded-lg border-2 cursor-pointer
        bg-gradient-to-br ${component.color}
        ${highlighted ? component.glowColor : ''}
        ${highlighted ? 'border-white/40' : 'border-white/10'}
        backdrop-blur-sm transition-all duration-500
        group-hover:border-white/60
        overflow-hidden w-full
        ${highlighted ? 'max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl' : 'max-w-sm'}
        ${compact 
          ? 'p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl' 
          : 'p-2 sm:p-3 md:p-4 lg:p-5 rounded-lg sm:rounded-xl'
        }
      `}>
                {/* Animated background glow effect */}
          <motion.div 
          animate={{ 
            scale: highlighted ? [1, 1.2, 1] : 1,
            opacity: highlighted ? [0.1, 0.2, 0.1] : 0
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
        />
        
        {/* Hover shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" 
          style={{ transition: 'transform 1s ease' }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          <div className={`flex items-start justify-between ${compact ? 'mb-0.5 sm:mb-1' : 'mb-1 sm:mb-1.5 md:mb-2'}`}>
            <div className={`flex items-center ${compact ? 'gap-1 sm:gap-1.5' : 'gap-1.5 sm:gap-2'}`}>
              <motion.div 
                animate={{ 
                  rotate: highlighted ? [0, 5, -5, 0] : 0,
                  scale: highlighted ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className={`bg-gray-900/30 rounded-md backdrop-blur-sm relative ${
                  compact ? 'p-0.5 sm:p-1' : 'p-1 sm:p-1.5'
                }`}
              >
                <Icon className={compact 
                  ? 'w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-gray-900' 
                  : 'w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-900'
                } />
                {highlighted && (
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 bg-yellow-400/30 rounded-md"
                  />
                )}
              </motion.div>
              <h3 className={`font-bold text-gray-900 ${
                compact 
                  ? 'text-[10px] sm:text-xs md:text-sm' 
                  : 'text-sm sm:text-base md:text-lg'
              }`}>
                {component.name}
              </h3>
            </div>
            <motion.div
              animate={{ x: [0, 2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ExternalLink className={`text-gray-900/60 group-hover:text-gray-900 transition-colors ${
                compact 
                  ? 'w-2.5 h-2.5 sm:w-3 sm:h-3' 
                  : 'w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4'
              }`} />
            </motion.div>
          </div>
          <p className={`text-gray-900/90 leading-relaxed ${
            compact 
              ? 'text-[8px] sm:text-[9px] md:text-[10px]' 
              : 'text-[10px] sm:text-xs md:text-xs'
          }`}>
            {component.description}
          </p>
        </div>
        
        {/* Active indicator */}
        <AnimatePresence>
          {highlighted && (
            <>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`absolute bg-white rounded-full shadow-lg flex items-center justify-center z-20 ${
                  compact 
                    ? '-top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4' 
                    : '-top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-4 h-4 sm:w-5 sm:h-5'
                }`}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`bg-yellow-400 rounded-full ${
                    compact 
                      ? 'w-1.5 h-1.5 sm:w-2 sm:h-2' 
                      : 'w-2 h-2 sm:w-2.5 sm:h-2.5'
                  }`}
                />
              </motion.div>
              
              {/* Energy particles - fewer in compact mode */}
              {[...Array(compact ? 2 : 3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * (compact ? 40 : 80) - (compact ? 20 : 40),
                    y: Math.random() * (compact ? 40 : 80) - (compact ? 20 : 40),
                    opacity: 0 
                  }}
                  animate={{ 
                    x: [null, Math.random() * (compact ? 80 : 160) - (compact ? 40 : 80)],
                    y: [null, Math.random() * (compact ? 80 : 160) - (compact ? 40 : 80)],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: "easeOut"
                  }}
                  className={`absolute top-1/2 left-1/2 bg-yellow-400 rounded-full ${
                    compact ? 'w-0.5 h-0.5' : 'w-1 h-1'
                  }`}
                />
              ))}
            </>
          )}
        </AnimatePresence>
        
        {/* Corner accent */}
        {highlighted && (
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8 }}
            className={`absolute top-0 right-0 pointer-events-none ${
              compact 
                ? 'w-6 h-6 sm:w-8 sm:h-8' 
                : 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12'
            }`}
          >
            <svg viewBox="0 0 50 50" className="w-full h-full">
              <motion.path
                d="M 50 0 L 50 50 L 0 50"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
              />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.a>
  );
};