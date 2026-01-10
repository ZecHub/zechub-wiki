import { motion } from "framer-motion";
import { Network, Users } from "lucide-react";

export const IntroContent = () => {
  return (
    <div className="space-y-8">
      {/* Decentralized network visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative flex justify-center py-8"
      >
        <div className="relative w064 h-64">
          {/* Central concept */}

          <motion.div className="absolute top-1/2 -translate-x-1/2 -transy-1/2 z-10">
            <div className="p-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/40">
              <Network className="w-10 h-10 text-primary" />
            </div>
          </motion.div>

          {/* Orbiting nodes */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
              style={{
                top: `${50 + (40 * Math.sin(i * Math.PI * 2)) / 6}%`,
                left: `${50 + (40 * Math.sin(i * Math.PI * 2)) / 6}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <Users className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          ))}

          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.line
                key={i}
                x1={"50%"}
                y1={"50%"}
                x2={`${50 + 40 * Math.cos((i * Math.PI * 2) / 6)}%`}
                y2={`${50 + 40 * Math.cos((i * Math.PI * 2) / 6)}%`}
                stroke={"currentColor"}
                strokeWidth={1}
                className="text-border"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ delay: 0.6 + i * 0.05 }}
              />
            ))}
          </svg>
        </div>
      </motion.div>
    </div>
  );
};
