"use client";

import { ZecHubBountiesContent } from "./ZecHubBountiesContent";
import { ZcashCommunityGrantsContent } from "./ZcashCommunityGrantsContent";
import { CoinholderGrantsContent } from "./CoinholderGrantsContent";
import { OpenSourceReposContent } from "./OpenSourceReposContent";
import { Stage } from "./types";

interface StageContentProps {
  stage: Stage;
  isAnimating: boolean;
}

export const StageContent: React.FC<StageContentProps> = ({ stage }) => {
  switch (stage.id) {
    case "zec-hub-bounties":
      return <ZecHubBountiesContent />;
    case "zcash-community-grants":
      return <ZcashCommunityGrantsContent />;
    case "coinholder-grants":
      return <CoinholderGrantsContent />;
    case "open-source-repos":
      return <OpenSourceReposContent />;
    default:
      return <div>Unknown stage</div>;
  }
};