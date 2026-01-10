import { IntroContent } from "./IntroContent";
import { OrchardKeyContent } from "./OrchardKeyContent";
import { SaplingKeyContent } from "./SaplingKeyContent";
import { ShieldedOverviewContent } from "./ShieldedOverviewContent";
import { SproutKeyContent } from "./SproutKeyContent";
import { TransparentKeyContent } from "./TransparentKeyContent";
import { Stage } from "./types";

interface KeyContentProps {
  stage: Stage;
}

export const KeyContent = (props: KeyContentProps) => {
  switch (props.stage.keyType) {
    case "intro":
      return <IntroContent />;
    case 'transparent':
        return <TransparentKeyContent/>;
    case 'shielded-overview':
        return <ShieldedOverviewContent/>;
    case 'sprout':
        return <SproutKeyContent/>;
    case 'sapling':
        return <SaplingKeyContent/>
    case 'orchard':
        return <OrchardKeyContent/>
  }
};
