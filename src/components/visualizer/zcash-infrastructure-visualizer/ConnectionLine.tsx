import React from 'react';
import { motion } from 'framer-motion';

interface ConnectionLineProps {
  highlighted: boolean;
  vertical?: boolean;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({ highlighted, vertical = true }) => {
  return (
    <svg className="w-full h-full" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      <defs>
        <linearGradient id={`gradient-${vertical ? 'v' : 'h'}`} x1="0%" y1="0%" x2={vertical ? "0%" : "100%"} y2={vertical ? "100%" : "0%"}>
          <stop offset="0%" stopColor="#fbbf24" stopOpacity={highlighted ? "0.9" : "0.2"} />
          <stop offset="50%" stopColor="#10b981" stopOpacity={highlighted ? "0.9" : "0.2"} />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity={highlighted ? "0.9" : "0.2"} />
        </linearGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <motion.line
        x1={vertical ? "50%" : "0%"}
        y1={vertical ? "0%" : "50%"}
        x2={vertical ? "50%" : "100%"}
        y2={vertical ? "100%" : "50%"}
        stroke={`url(#gradient-${vertical ? 'v' : 'h'})`}
        strokeWidth={highlighted ? "4" : "2"}
        strokeDasharray={highlighted ? "0" : "10 5"}
        filter={highlighted ? "url(#glow)" : "none"}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1,
          opacity: 1,
          strokeWidth: highlighted ? 4 : 2
        }}
        transition={{ 
          pathLength: { duration: 1.5, ease: "easeInOut" },
          strokeWidth: { duration: 0.3 }
        }}
      />
      
      {highlighted && (
        <>
          {/* Main moving particle */}
          <motion.circle
            r="5"
            fill="#fbbf24"
            filter="url(#glow)"
            initial={{ 
              cx: vertical ? "50%" : "0%",
              cy: vertical ? "0%" : "50%"
            }}
            animate={{ 
              cx: vertical ? "50%" : "100%",
              cy: vertical ? "100%" : "50%"
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Secondary particles */}
          <motion.circle
            r="3"
            fill="#10b981"
            opacity="0.6"
            initial={{ 
              cx: vertical ? "50%" : "0%",
              cy: vertical ? "0%" : "50%"
            }}
            animate={{ 
              cx: vertical ? "50%" : "100%",
              cy: vertical ? "100%" : "50%"
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              ease: "linear",
              delay: 0.5
            }}
          />
          
          <motion.circle
            r="3"
            fill="#06b6d4"
            opacity="0.6"
            initial={{ 
              cx: vertical ? "50%" : "0%",
              cy: vertical ? "0%" : "50%"
            }}
            animate={{ 
              cx: vertical ? "50%" : "100%",
              cy: vertical ? "100%" : "50%"
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "linear",
              delay: 1
            }}
          />
          
          {/* Pulsing effect at endpoints */}
          <motion.circle
            cx={vertical ? "50%" : "0%"}
            cy={vertical ? "0%" : "50%"}
            r="8"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </>
      )}
    </svg>
  );
};