import { motion } from "framer-motion";
import {
  ArrowRight,
  Blocks,
  Database,
  Layers,
  Link2,
  Shield,
} from "lucide-react";

export const BlockchainIntroContent = () => {
  const blocks = [
    { id: 1, hash: "0x8a3f...", prevHash: "0x0000..." },
    { id: 2, hash: "0x4b2e...", prevHash: "0x8a3f..." },
    { id: 3, hash: "0x7c1d...", prevHash: "0x4b2e..." },
    { id: 4, hash: "0x9f5a...", prevHash: "0x7c1d..." },
  ];

  return (
    <div className="space-y-8">
      {/* Animated chain of blocks */}
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
        {blocks.map((block, index) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex items-center"
          >
            <div className="relative">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 hsl(var(--primary) / 0)",
                    "0 0 20px hsl(var(--primary) / 0.3)",
                    "0 0 0 hsl(var(--primary) / 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
                className="w-20 h-24 md:w-28 md:h-32 bg-card border border-border rounded-lg p-2 md:p-3 flex flex-col justify-between"
              >
                <div className="flex items-center gap-1">
                  <Blocks className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">
                    Block {block.id}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] md:text-[10px] text-muted-foreground font-mono truncate">
                    {block.hash}
                  </p>
                  <div className="flex items-center gap-1">
                    <Link2 className="w-2 h-2 md:w-3 md:h-3 text-muted-foreground" />
                    <p className="text-[8px] md:text-[10px] text-muted-foreground font-mono truncate">
                      {block.prevHash}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            {index < blocks.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 + 0.1 }}
                className="mx-1 md:mx-2"
              >
                <ArrowRight className="w-4 h-4 md:w-6 md:h-6 text-primary" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Properties */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            icon: Database,
            title: "Decentralized",
            desc: "No single point of control",
          },
          {
            icon: Shield,
            title: "Immutable",
            desc: "Cannot be altered once written",
          },
          {
            icon: Layers,
            title: "Append-Only",
            desc: "New blocks added, never removed",
          },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.1 }}
            className="bg-card border border-border rounded-lg p-4 text-center"
          >
            <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold text-foreground">{item.title}</h4>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
