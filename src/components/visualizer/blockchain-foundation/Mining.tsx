import { motion } from "framer-motion";
import { ArrowRight, Pickaxe } from "lucide-react";

export const Mining = () => {
  return (
    <div className="space-y-6">
      {/* Hash puzzle visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Pickaxe className="w-5 h-5 text-primary" />
          Finding a Valid Hash (Proof of Work)
        </h3>

        <div className="space-y-8">
          {/* Input */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-8">
            <div className="flex-1 w-full">
              <p className="text-xs text-muted-foreground mb-1">
                Block Header + Nonce
              </p>
              <div className="bg-background rounded-lg p-3 font-mono text-xs text-foreground overflow-x-auto">
                header_data +{" "}
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-primary"
                >
                  nonce=2147483647
                </motion.span>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
            <div className="flex-1 w-full">
              <p className="text-xs text-muted-foreground mb-1">
                Equihash Output
              </p>
              <div className="bg-background rounded-lg p-3 font-mono text-xs overflow-x-auto">
                <span className="text-primary">000000</span>
                <span className="text-muted-foreground">8a3f7c1d9b2e4f...</span>
              </div>
            </div>
          </div>

          {/* Target explanation */}
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <span className="font-semibold text-primary">Target:</span> Hash
              must start with a specific number of leading zeros. More zeros =
              higher difficulty.
            </p>
          </div>

          {/* Mining attempts animation */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Mining attempts:</p>
            {[
              { nonce: "0000001", hash: "f8a2...❌", valid: false },
              { nonce: "0000002", hash: "b3c1...❌", valid: false },
              { nonce: "2147483647", hash: "000000...✓", valid: true },
            ].map((attempt, i) => (
              <motion.div
                key={attempt.nonce}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.3 }}
                className={`flex items-center gap-4 p-2 rounded ${
                  attempt.valid
                    ? "bg-pool-sapling/20 border border-pool-sapling"
                    : "bg-muted"
                }`}
              >
                <span className="text-xs font-mono text-muted-foreground">
                  nonce: {attempt.nonce}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span
                  className={`text-xs font-mono ${
                    attempt.valid
                      ? "text-pool-sapling"
                      : "text-muted-foreground"
                  }`}
                >
                  {attempt.hash}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

    </div>
  );
};
