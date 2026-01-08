"use client";
import { useDarkModeContext } from "@/hooks/useDarkModeContext";
import { motion } from "framer-motion";
import Image from "next/image";
import { WalletInfo } from "./index";
import { Stage } from "./types";

export const WelcomeContent = (props: {
  stage: Stage;
  wallets: WalletInfo[];
}) => {
  const { dark } = useDarkModeContext();

  return (
    <div className="space-y-12">
      {/* Animated icons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center gap-8 my-16"
      >
        {props.wallets.slice(0, 6).map((w, idx) => (
          <motion.div
            key={idx + w.title}
            className="flex flex-col items-center gap-2"
          >
            <div className="p-2 rounded-xl bg-pool-transparent/10 border border-pool-transparent/30">
              <Image
                priority
                src={w.imageUrl.trimEnd()}
                alt={w.title}
                width={64}
                height={64}
                // className="w-12 h-12 text-pool-transparent"
              />
            </div>
            <span className="text-xs text-muted-foreground">{w.title}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
