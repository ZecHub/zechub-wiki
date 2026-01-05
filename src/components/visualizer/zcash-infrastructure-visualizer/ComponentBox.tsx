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
        opacity: highlighted ? 1 : 0.35,
        scale: highlighted ? 1 : 0.95,
      }}
      whileHover={{ 
        scale: 1.05,
        opacity: 1
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={`
        relative p-6 rounded-2xl border-2 cursor-pointer
        bg-gradient-to-br ${component.color}
        ${highlighted ? component.glowColor : ''}
        ${highlighted ? 'border-white/40' : 'border-white/10'}
        backdrop-blur-sm transition-all duration-500
        group-hover:border-white/60
        overflow-hidden
      `}>
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900/30 rounded-lg backdrop-blur-sm">
                <Icon className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="font-bold text-xl text-gray-900">{component.name}</h3>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-900/60 group-hover:text-gray-900 transition-colors" />
          </div>
          <p className="text-sm text-gray-900/90 leading-relaxed">
            {component.description}
          </p>
        </div>
        
        {/* Active indicator */}
        <AnimatePresence>
          {highlighted && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-yellow-400 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.a>
  );
};