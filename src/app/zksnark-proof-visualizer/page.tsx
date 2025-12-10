import ZKSNARKProofVisualizer from "@/components/visualizer/zk-SNARK-proof/ZK-SNARKProofVisualizer";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = genMetadata({
  title: "Zechub Tutorial",
  url: "https://zechub.wiki/zksnark-proof-visualizer",
});

export default function ZKSNARKProofVisualizerPage(){
    return <ZKSNARKProofVisualizer/>
}
