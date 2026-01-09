import { CollisionContent } from "./CollisionContent";
import { HashFunctionIntroContent } from "./HashFunctionIntroContent";
import { IntegrityContent } from "./IntegrityContent";
import { IrreversibleContent } from "./IrreversibleContent";
import { OtherPropertiesContent } from "./OtherPropertiesContent";
import { Stage } from "./types";

interface HashFunctionContentProps {
  stage: Stage;
}

export const HashFunction = (props: HashFunctionContentProps) => {
  switch (props.stage.hashType) {
    case "intro":
      return <HashFunctionIntroContent />;
    case "integrity":
      return <IntegrityContent />;
    case "irreversible":
      return <IrreversibleContent />;
    case "collision":
      return <CollisionContent />;
    case "properties":
      return <OtherPropertiesContent />;
  }
};
