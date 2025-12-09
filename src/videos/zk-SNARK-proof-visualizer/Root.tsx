import React from "react";
import { Composition } from "remotion";
import { PrivacyStoryVideo } from "./PrivacyStoryVideo";

export const ZkSNARKProofVisualizerRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PrivacyStory"
        component={PrivacyStoryVideo}
        durationInFrames={30 * 180} // 3 min at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
