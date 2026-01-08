import { motion } from "framer-motion";
import { ExternalLink, TypeIcon, Wallet } from "lucide-react";

import { WalletInfo } from "./WalletContent";

interface WalletListProps {
  wallets: WalletInfo[];
  type: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const WalletList = (props: WalletListProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-3 mb-8"
      >
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/30">
          <TypeIcon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          {props.type} Wallets
        </h3>
      </motion.div>

      {/* Wallet cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {props.wallets.map((wallet, index) => (
          <motion.a
            key={wallet.name}
            href={wallet.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group block"
          >
            <div className="h-full p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/50 transition-all duration-300">
              {/* Logo placeholder */}
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${wallet.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <Wallet className="w-8 h-8 text-white" />
              </div>

              {/* Wallet name */}
              <h4 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                {wallet.name}
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>

              {/* Features */}
              <div className="space-y-2">
                {wallet.features.map((feature: string) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Download hint */}
              <div className="mt-4 pt-4 border-t border-border/30">
                <span className="text-xs text-primary font-medium group-hover:underline">
                  Download →
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};
