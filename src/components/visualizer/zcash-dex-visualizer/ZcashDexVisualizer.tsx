"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";
import { useEffect } from "react";
import { Button } from "@/components/UI/shadcn/button";
import { ExternalLink, Shield, Zap, Wallet } from "lucide-react";
import { motion } from "framer-motion";

const DEX_PLATFORMS = [
  {
    name: "Near Intents",
    description: "Swap directly into shielded ZEC with minimal fees",
    logo: "/Logo/near.png", 
    link: "https://near.org/intents",
    features: ["Direct to shielded ZEC", "Cross-chain swaps", "Near Protocol"],
  },
  {
    name: "Maya Protocol",
    description: "Native cross-chain DEX supporting shielded ZEC",
    logo: "/Logo/maya-protocol.png", 
    link: "https://mayaprotocol.com",
    features: [
      "Native ZEC support",
      "No wrapped tokens",
      "Censorship-resistant",
    ],
  },
  {
    name: "Thorchain",
    description: "Cross-chain liquidity protocol for ZEC",
    logo: "/Logo/thorr.png", 
    link: "https://thorchain.org",
    features: ["Cross-chain swaps", "Deep liquidity", "Non-custodial"],
  },
];

const WALLET_INTEGRATIONS = [
  "Zashi Wallet",
  "Edge Wallet",
  "Unstoppable Wallet",
];

interface ZcashDexVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const ZcashDexVisualizer = ({ onComplete, autoStart = false }: ZcashDexVisualizerProps) => {
  useEffect(() => {
    if (autoStart && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [autoStart, onComplete]);  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-emerald-400 bg-clip-text text-transparent">
            Zcash Decentralized Exchanges
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Permissionless, censorship-resistant access to ZEC using
            decentralized exchanges
          </p>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/50 backdrop-blur-md border border-border/50 rounded-xl p-6 mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-8 h-8 text-emerald-400" />
            <h2 className="text-2xl font-bold">Why Use DEXs for Zcash?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-muted-foreground mb-4">
                While Zcash can be purchased on centralized exchanges, DEXs
                provide
                <span className="font-semibold text-yellow-400">
                  {" "}
                  permissionless, censorship-resistant access{" "}
                </span>
                to ZEC without intermediaries.
              </p>
              <p className="text-muted-foreground">
                Swap from multiple assets directly to Zcash with
                <span className="font-semibold text-emerald-400">
                  {" "}
                  minimal fees{" "}
                </span>
                using platforms that support shielded ZEC natively.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">Direct to shielded ZEC</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">Non-custodial & private</span>
              </div>
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-cyan-400" />
                <span className="font-medium">
                  Integrated with Zcash wallets
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* DEX Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            Supported DEX Platforms
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {DEX_PLATFORMS.map((dex, index) => (
              <motion.div
                key={dex.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 h-full hover:border-slate-600/50 transition-all">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-emerald-400/20 rounded-lg flex items-center justify-center font-bold">
                        <img
                          src={dex.logo}
                          alt={`${dex.name} logo`}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      {dex.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {dex.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {dex.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full bg-gradient-to-r from-yellow-400 to-emerald-400 hover:from-yellow-500 hover:to-emerald-500 text-slate-900 font-semibold"
                      onClick={() => window.open(dex.link, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Platform
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Wallet Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Wallet Integrations
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {WALLET_INTEGRATIONS.map((wallet) => (
              <div
                key={wallet}
                className="px-6 py-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg border border-slate-600/50 hover:border-emerald-400/50 transition-colors"
              >
                <span className="font-medium">{wallet}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 mt-6">
            These wallets support direct integration with Zcash DEX platforms
          </p>
        </motion.div>
      </div>
    </div>
  );
};
