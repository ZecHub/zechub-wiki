import ZKSNARKProofVisualizer from "@/components/visualizer/zk-SNARK-proof/ZK-SNARKProofVisualizer";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import { getDictionary } from '@/lib/getDictionary';

type VisualizerDictionary = {
  pages?: {
    visualizer?: {
      zksnark?: {
        title?: string;
      };
    };
  };
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as VisualizerDictionary;
  return genMetadata({
    title: dict.pages?.visualizer?.zksnark?.title || "ZK-SNARK Proof Visualizer",
    url: "https://zechub.wiki/zksnark-proof-visualizer",
  }) as Metadata;
}

export default function ZKSNARKProofVisualizerPage(){
    return <ZKSNARKProofVisualizer/>
}
