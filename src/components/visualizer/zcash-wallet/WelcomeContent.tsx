import { useDarkModeContext } from "@/hooks/useDarkModeContext";
import { motion } from "framer-motion";
import Image from "next/image";
import ZashiIconBlack from "../../../assets/brand/Wallets/Zashi/PNG/ZashiIconBlack.png";
import ZashIconWhite from "../../../assets/brand/Wallets/Zashi/PNG/ZashiIconWhite.png";
import { Stage } from "./types";

export const WelcomeContent = ({ stage }: { stage: Stage }) => {
  const { dark } = useDarkModeContext();

  const walletInfo = [
    {
      label: "Zashi",
      icon: dark ? ZashIconWhite.src : ZashiIconBlack.src,
      description: "",
    },
    {
      label: "YWallet",
      icon: "/zwallets.png",
      description: "",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Animated icons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center gap-12 my-16"
      >
        {walletInfo.map((w, idx) => (
          <motion.div
            key={idx + w.label}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.4 * idx + 0.3,
            }}
            className="flex flex-col items-center gap-2"
          >
            <div className="p-4 rounded-xl bg-pool-transparent/10 border border-pool-transparent/30">
              <Image
                priority
                src={w.icon}
                alt={w.label}
                width={32}
                height={32}
                className="w-8 h-8 text-pool-transparent"
              />
            </div>
            <span className="text-xs text-muted-foreground">{w.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
