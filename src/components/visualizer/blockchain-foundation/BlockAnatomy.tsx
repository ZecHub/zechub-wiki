import { motion } from "framer-motion";
import { FileText, Hash, Layers } from "lucide-react";

export const BlockAnatomy = () => {
  const headerFields = [
    { name: 'Version', value: '4', color: 'text-pool-transparent' },
    { name: 'Previous Hash', value: '0x7c1d...9f8a', color: 'text-pool-sapling' },
    { name: 'Merkle Root', value: '0xa2b3...c4d5', color: 'text-pool-orchard' },
    { name: 'Timestamp', value: '1699234567', color: 'text-primary' },
    { name: 'Difficulty', value: '0x1c0d3fa3', color: 'text-muted-foreground' },
    { name: 'Nonce', value: '2147483647', color: 'text-destructive' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Block structure */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Header section */}
        <div className="bg-primary/10 border-b border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Block Header</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {headerFields.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-background/50 rounded p-2"
              >
                <p className="text-xs text-muted-foreground">{field.name}</p>
                <p className={`text-xs font-mono ${field.color}`}>
                  {field.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Body section */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-pool-sapling" />
            <h3 className="font-bold text-foreground">Transaction List</h3>
          </div>
          <div className="space-y-2">
            {["Tx #1 (Coinbase)", "Tx #2", "Tx #3", "Tx #4"].map(
              (tx, index) => (
                <motion.div
                  key={tx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      index === 0 ? "bg-primary" : "bg-muted-foreground"
                    }`}
                  />
                  <span className="text-foreground font-mono text-xs">
                    {tx}
                  </span>
                </motion.div>
              )
            )}
          </div>
        </div>
      </motion.div>

      {/* Merkle tree visualization */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="flex-1 bg-card border border-border rounded-xl p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-pool-orchard" />
          <h3 className="font-bold text-foreground">Merkle Tree</h3>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {/* Root */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 hsl(var(--pool-orchard) / 0)",
                "0 0 15px hsl(var(--pool-orchard) / 0.5)",
                "0 0 0 hsl(var(--pool-orchard) / 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-pool-orchard/20 border border-pool-orchard rounded-lg px-4 py-2"
          >
            <p className="text-xs font-mono text-pool-orchard">Merkle Root</p>
          </motion.div>


        </div>
      </motion.div>
    </div>
  );
};
