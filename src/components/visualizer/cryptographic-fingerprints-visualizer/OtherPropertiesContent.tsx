import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const OtherPropertiesContent = () => {
    const properties = [
    {
      title: 'Avalanche Effect',
      desc: 'A tiny change in input creates a completely different hash',
      example: { input1: '"Hello"', hash1: 'a591a6d4...', input2: '"hello"', hash2: '2cf24dba...' },
      color: 'primary',
    },
    {
      title: 'Deterministic',
      desc: 'Same input always produces the exact same output',
      color: 'emerald-500',
    },
    {
      title: 'Fast Computation',
      desc: 'Easy to compute hash for any input, enabling real-time verification',
      color: 'warning',
    },
    {
      title: 'Fixed Output Size',
      desc: 'Whether input is 1 byte or 1TB, output is always 256 bits',
      color: 'pool-sapling',
    },
  ];

    return (
      <div className="space-y-6">
        {/* Avalanche effect demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <h4 className="font-semibold text-foreground mb-4">
            Avalanche Effect Demo
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-4 flex-wrap">
              <code className="px-3 py-2 rounded bg-muted text-sm font-mono">
                "Zcash"
              </code>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <code className="px-3 py-2 rounded bg-primary/10 text-xs font-mono text-primary">
                9b4e8f2a7c1d3e5b...
              </code>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <code className="px-3 py-2 rounded bg-muted text-sm font-mono">
                "Zcas<span className="text-destructive font-bold">H</span>"
              </code>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <code className="px-3 py-2 rounded bg-destructive/10 text-xs font-mono text-destructive">
                2f7a1c9e4b8d6a3f...
              </code>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              One letter change → Completely different hash
            </p>
          </div>
        </motion.div>
      </div>
    );
}
