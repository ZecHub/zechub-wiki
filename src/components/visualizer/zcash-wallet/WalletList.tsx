import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { WalletInfo } from "./index";

interface WalletListProps {
  wallets: WalletInfo[];
  type: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const WalletList = (props: WalletListProps) => {
  return (
    <div className="space-y-6">
      {/* Wallet cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xlgrid-cols-4 gap-6">
        {props.wallets.map((wallet, index) => (
          <motion.a
            key={wallet.title}
            href={wallet.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group block"
          >
            <div className="flex flex-col h-full p-6 rounded-2xl dark:text-slate-600 bg-card/10 border border-border/100 hover:border-primary/50 transition-all duration-300">
              {/* Logo placeholder */}
              <div
                className={`flex flex-row items-center gap-4 rounded-xl bg-gradient-to-br mb-4 `}
              >
                <Image
                  priority
                  src={wallet.imageUrl.trimEnd()}
                  alt={wallet.title}
                  width={64}
                  height={64}
                  className="w-24"
                />

                {/* Wallet name */}
                <h4 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  {wallet.title}
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 " />
                </h4>
              </div>

              {/* Features */}
              <div className="space-y-2 flex-1">
                {wallet.features.slice(0, 3).map((feature: string) => (
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
              <div className="mt-4 pt-4 border-t border-border/30 ">
                <span className="text-xs text-primary font-medium group-hover:underline">
                  Visit -&gt;
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};
