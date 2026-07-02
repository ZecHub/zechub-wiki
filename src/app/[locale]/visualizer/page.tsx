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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as VisualizerDictionary;
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