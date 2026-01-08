import { motion } from "framer-motion";
import { Globe, Monitor, Smartphone } from "lucide-react";
import { WalletInfo } from "./index";
import { ResourcesSlide } from "./ResourcesSlide";
import { Stage } from "./types";
import { WalletIntro } from "./WalletIntro";
import { WalletList } from "./WalletList";

interface WalletContentProps {
  stage: Stage;
  wallets: WalletInfo[];
}
 
export const WalletContent = ({ stage, wallets }: WalletContentProps) => {
  const MOBILE_WALLETS =
    wallets.filter((w) => w.devices.includes("mobile")) || [];

  const WEB_WALLETS = wallets.filter((w) => w.devices.includes("web")) || [];
  
  const DESKTOP_WALLETS =
    wallets.filter((w) => w.devices.includes("desktop")) || [];

  const renderContent = () => {
    switch (stage.walletType) {
      case "intro":
        return <WalletIntro />;
      case "mobile":
        return (
          <WalletList
            wallets={MOBILE_WALLETS}
            type="Mobile"
            icon={Smartphone}
          />
        );
      case "desktop":
        return (
          <WalletList wallets={DESKTOP_WALLETS} type="Desktop" icon={Monitor} />
        );
      case "web":
        return <WalletList wallets={WEB_WALLETS} type="Web" icon={Globe} />;
      case "resources":
        return <ResourcesSlide />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {renderContent()}
    </motion.div>
  );
};
