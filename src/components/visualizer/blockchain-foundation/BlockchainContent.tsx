import { BlockAnatomy } from "./BlockAnatomy";
import { BlockchainIntroContent } from "./BlockchainIntroContent";
import { Difficulty } from "./Difficulty";
import { DigitalSignature } from "./DigitalSignature";
import { Miners } from "./Miners";
import { Mining } from "./Mining";
import { TransactionLifecycle } from "./TransactionLifecycle";
import { Stage } from "./types";

type BlockchainContentProps = {
  stage: Stage;
};
export const BlockchainContent = (props: BlockchainContentProps) => {
  switch (props.stage.blockchainType) {
    case "intro":
      return <BlockchainIntroContent />;
    case "digital-signature":
      return <DigitalSignature />;
    case "anatomy":
      return <BlockAnatomy />;
    case "transaction-lifecycle":
      return <TransactionLifecycle />;
    case "mining":
      return <Mining />;
    case "miners":
      return <Miners />;
    case "difficulty":
      return <Difficulty />;
    default:
      return null;
  }
};
