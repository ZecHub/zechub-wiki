import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export const SaplingKeyContent = () => {
    const keyHierarchy = [
      {
        name: "Spending Key (sk)",
        desc: "Master secret for spending",
        level: 0,
      },
      { name: "Expanded Spending Key", desc: "ask, nsk, ovk", level: 1 },
      { name: "Full Viewing Key (fvk)", desc: "ak, nk, ovk", level: 2 },
      {
        name: "Incoming Viewing Key (ivk)",
        desc: "View incoming transactions",
        level: 3,
      },
      {
        name: "Diversified Address",
        desc: "zs1... (unlimited per key)",
        level: 4,
      },
    ];

    return (
      <div className="space-y-8">
        {/* Key hierarchy visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-pool-sapling/10 border border-pool-sapling/30"
        >
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-pool-sapling" />
            Sapling Key Derivation
          </h4>

          <div className="space-y-2">
            {keyHierarchy.map((key, index) => (
              <motion.div
                key={key.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                style={{ marginLeft: `${key.level * 16}px` }}
                className={`p-3 rounded-lg bg-pool-sapling/${
                  index * 10
                } border border-border`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground text-sm">
                    {key.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {key.desc}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="p-4 rounded-lg dark:bg-card dark:border bg-card/10 border/20 border-border">
            <h5 className="font-medium text-foreground mb-2">Address Format</h5>
            <code className="px-2 py-1 rounded dark:bg-muted bg-muted/20 text-sm font-mono">
              zs1...
            </code>
            <p className="text-sm text-muted-foreground mt-2">
              78 characters, Bech32 encoding
            </p>
          </div>
          <div className="p-4 rounded-lg dark:bg-card dark:border bg-card/10 border/20 border-border">
            <h5 className="font-medium text-foreground mb-2">Key Feature</h5>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Diversified addresses</strong>{" "}
              — Generate unlimited unique addresses from one key
            </p>
          </div>
        </motion.div>
      </div>
    );
}
