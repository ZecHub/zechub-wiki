
import { HashFunctionContent } from "./HashFunctionContent";
import { IntegrityContent } from "./IntegrityContent";
import { IntroContent } from "./IntroContent";
import { Stage } from "./types";

interface HashFunctionContentProps {
  stage: Stage;
}

export type HashType =
  | "intro"
  | "integrity"
  | "irreversible"
  | "collision"
  | "properties";

export const HashFunction = (props: HashFunctionContentProps) => {
  switch (props.stage.hashType) {
    case "intro":
      return <IntroContent stage={props.stage} />;
    case 'integrity':
      return <IntegrityContent/>
  }
};
