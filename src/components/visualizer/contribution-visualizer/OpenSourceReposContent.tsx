"use client";

import { motion } from "framer-motion";
import { Code, Github } from "lucide-react";

export const OpenSourceReposContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center max-w-4xl mx-auto"
    >
      <h2 className="text-4xl font-bold mb-6 text-foreground">
        Open Source Repositories
      </h2>
      <div className="space-y-6 text-left">
        <div className="bg-card/50 p-6 rounded-lg border border-border/50">
          <h3 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
            <Code className="w-6 h-6" />
            ZecDev Community Wishlist
          </h3>
          <p className="text-muted-foreground mb-4">
            A community-driven list of desired features and improvements for Zcash development.
          </p>
          <a
            href="https://zecdev.github.io/community"
            className="text-primary hover:text-primary/80 underline flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4" />
            ZecDev Community
          </a>
        </div>
        <div className="bg-card/50 p-6 rounded-lg border border-border/50">
          <h3 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
            <Github className="w-6 h-6" />
            ZingoLabs Repositories
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a
                href="https://github.com/zingolabs"
                className="text-primary hover:text-primary/80 underline flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
                ZingoLabs GitHub Organization - Zingo Wallet and related tools
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Code className="w-4 h-4 text-primary" />
              Zaino - Zcash chain indexer
            </li>
          </ul>
        </div>
        <div className="bg-card/50 p-6 rounded-lg border border-border/50">
          <h3 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
            <Github className="w-6 h-6" />
            ZcashFoundation Zebra
          </h3>
          <p className="text-muted-foreground mb-4">
            Zebra is an ongoing Rust implementation of a Zcash node.
          </p>
          <a
            href="https://github.com/ZcashFoundation/zebra"
            className="text-primary hover:text-primary/80 underline flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4" />
            Zebra Repository
          </a>
        </div>
      </div>
    </motion.div>
  );
};