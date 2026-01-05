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
          <stop offset="0%" stopColor="#fbbf24" stopOpacity={highlighted ? "0.8" : "0.15"} />
          <stop offset="50%" stopColor="#10b981" stopOpacity={highlighted ? "0.8" : "0.15"} />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity={highlighted ? "0.8" : "0.15"} />
        </linearGradient>
      </defs>
      <motion.line
        x1={vertical ? "50%" : "0%"}
        y1={vertical ? "0%" : "50%"}
        x2={vertical ? "50%" : "100%"}
        y2={vertical ? "100%" : "50%"}
        stroke={`url(#gradient-${vertical ? 'v' : 'h'})`}
        strokeWidth={highlighted ? "4" : "2"}
        strokeDasharray={highlighted ? "0" : "10 5"}
        initial={{ pathLength: 0 }}
        animate={{ 
          pathLength: 1,
          strokeWidth: highlighted ? 4 : 2
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {highlighted && (
        <motion.circle
          r="4"
          fill="#fbbf24"
          initial={{ 
            offsetDistance: "0%",
            cx: vertical ? "50%" : "0%",
            cy: vertical ? "0%" : "50%"
          }}
          animate={{ 
            offsetDistance: "100%",
            cx: vertical ? "50%" : "100%",
            cy: vertical ? "100%" : "50%"
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={vertical ? "M 0 0 L 0 100" : "M 0 0 L 100 0"}
          />
        </motion.circle>
      )}
    </svg>
  );
};