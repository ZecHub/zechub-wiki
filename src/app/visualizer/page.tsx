import { VisualizerHub } from "@/components/visualizer/VisualizerHub";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = genMetadata({
  title: "Zcash Visualizers",
  url: "https://zechub.wiki/visualizer",
});

export default function VisualizerPage() {
  return (
    <div className="min-h-screen w-full">
      <VisualizerHub />
    </div>
  );
}