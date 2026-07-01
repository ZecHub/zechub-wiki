import { VisualizerHub } from "@/components/visualizer/VisualizerHub";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import { getDictionary } from '@/lib/getDictionary';

type VisualizerDictionary = {
  pages?: {
    visualizer?: {
      title?: string;
    };
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const dict = (await getDictionary()) as VisualizerDictionary;
  return genMetadata({
    title: dict.pages?.visualizer?.title || "Zcash Visualizers",
    url: "https://zechub.wiki/visualizer",
  }) as Metadata;
}

export default function VisualizerPage() {
  return (
    <div className="min-h-screen w-full">
      <VisualizerHub />
    </div>
  );
}