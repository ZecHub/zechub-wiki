import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Component } from './types';

interface ComponentBoxProps {
  id: string;
  component: Component;
  highlighted: boolean;
}

export const ComponentBox: React.FC<ComponentBoxProps> = ({ id, component, highlighted }) => {
  const Icon = component.icon;
  
  return (
    <motion.a
      href={component.docs}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block group"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: highlighted ? 1 : 0.4,
        scale: highlighted ? 1 : 0.95,
      }}
      whileHover={{ 
        scale: 1.03,
        opacity: 1
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className={`
        relative p-4 rounded-xl border-2 cursor-pointer
        bg-gradient-to-br ${component.color}
        ${highlighted ? component.glowColor : ''}
        ${highlighted ? 'border-white/40' : 'border-white/10'}
        backdrop-blur-sm transition-all duration-500
        group-hover:border-white/60
        overflow-hidden
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
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <motion.div 
                animate={{ 
                  rotate: highlighted ? [0, 5, -5, 0] : 0,
                  scale: highlighted ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="p-1.5 bg-gray-900/30 rounded-md backdrop-blur-sm relative"
              >
                <Icon className="w-5 h-5 text-gray-900" />
                {highlighted && (
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 bg-yellow-400/30 rounded-md"
                  />
                )}
              </motion.div>
              <h3 className="font-bold text-lg text-gray-900">{component.name}</h3>
            </div>
            <motion.div
              animate={{ x: [0, 2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ExternalLink className="w-4 h-4 text-gray-900/60 group-hover:text-gray-900 transition-colors" />
            </motion.div>
          </div>
          <p className="text-xs text-gray-900/90 leading-relaxed">
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
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center z-20"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2.5 h-2.5 bg-yellow-400 rounded-full"
                />
              </motion.div>
              
              {/* Energy particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 80 - 40,
                    y: Math.random() * 80 - 40,
                    opacity: 0 
                  }}
                  animate={{ 
                    x: [null, Math.random() * 160 - 80],
                    y: [null, Math.random() * 160 - 80],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: "easeOut"
                  }}
                  className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-400 rounded-full"
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
            className="absolute top-0 right-0 w-12 h-12 pointer-events-none"
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