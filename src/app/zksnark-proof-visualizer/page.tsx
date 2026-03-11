import ZKSNARKProofVisualizer from "@/components/visualizer/zk-SNARK-proof/ZK-SNARKProofVisualizer";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import { getDictionary } from '@/lib/getDictionary';

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return genMetadata({
    title: dict.pages?.visualizer?.zksnark?.title || "ZK-SNARK Proof Visualizer",
    url: "https://zechub.wiki/zksnark-proof-visualizer",
  }) as Metadata;
}

export default function ZKSNARKProofVisualizerPage(){
    return <ZKSNARKProofVisualizer/>
}
