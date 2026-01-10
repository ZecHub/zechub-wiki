import { HardForkContent } from "./HardForkContent";
import { IntroContent } from "./IntroContent";
import { NetworkUpgradeContent } from "./NetworkUpgradeContent";
import { SoftForkContent } from "./SoftForkContent";
import { SybilContent } from "./SybilContent";
import { Stage } from "./types";

interface ConsensusContentProps {
  stage: Stage;
}

export const ConsensusContent = (props: ConsensusContentProps) => {
  switch (props.stage.consensusType) {
    case "intro":
      return <IntroContent />;
    case "sybil":
      return <SybilContent />;
    case "soft-fork":
      return <SoftForkContent />;
    case "hard-fork":
      return <HardForkContent />;
    case "network-upgrade":
      return <NetworkUpgradeContent />;
    default:
      return null;
  }
};
