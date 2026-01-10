import { IntroContent } from "./IntroContent";
import { OrchardKeyContent } from "./OrchardKeyContent";
import { SaplingKeyContent } from "./SaplingKeyContent";
import { ShieldedOverviewContent } from "./ShieldedOverviewContent";
import { SproutKeyContent } from "./SproutKeyContent";
import { TransparentKeyContent } from "./TransparentKeyContent";
import { Stage } from "./types";

interface ConsensusContentProps {
  stage: Stage;
}



export const ConsensusContent = (props: ConsensusContentProps) => {
  switch (props.stage.consensusype) {
    case "intro":
      return <ConsensusIntroContent />;
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
