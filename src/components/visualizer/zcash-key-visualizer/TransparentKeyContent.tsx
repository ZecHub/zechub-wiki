import { motion } from "framer-motion";
import { ArrowRight, Eye, Lock, Unlock } from "lucide-react";

export const TransparentKeyContent = () => {
  const keyFlow = [
    {
      label: "Private Key",
      sublabel: "256-bit secret",
      icon: Lock,
      color: "text-destructive",
    },
    {
      label: "Public Key",
      sublabel: "secp256k1 curve",
      icon: Unlock,
      color: "text-warning",
    },
    {
      label: "t-address",
      sublabel: "t1... or t3...",
      icon: Eye,
      color: "text-pool-transparent",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Key derivation chain */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
        {keyFlow.map((item, idx) => (
          <motion.div
            key={idx + item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.15 }}
            className="flex items-center gap-4"
          >
            <div className="p-4 rounded-xl bg-card border border-border flex flex-col items-center min-w-[140px] ">
              <item.icon className={`w-8 h-8 ${item.color} mb-2`} />
              <h4 className="font-semibold text-foreground text-sm">
                {item.label}
              </h4>
              <p className="text-xs text-muted-foreground">{item.sublabel}</p>
            </div>
            {idx < keyFlow.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.15 }}
              >
                <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Details card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-6 rounded-xl bg-pool-transparent/10 border border-pool-transparent/30"
      >
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-pool-transparent" />
          Transparent Key Properties
        </h4>

        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-pool-transparent">.</span>
            <span>
              Uses <strong className="text-foreground">secp256k1</strong>{" "}
              elliptic curve (same as Bitcoin)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pool-transparent">.</span>
            <span>
              Address prefixes:
              <code className="bg-muted px-1 rounded">t1</code> (P2PKH) or{" "}
              <code className="bg-muted px-1 rounded">t3</code> (P2SH)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pool-transparent">.</span>
            <span>All transaction are publicly visible on the blockchain</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pool-transparent">.</span>
            <span>Compactible with Bitcoin-style wallets and tools</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};
