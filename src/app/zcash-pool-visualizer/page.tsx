import { ZcashPoolVisualizer } from "@/components/visualizer/zcash-pool-visualizer";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = genMetadata({
  title: "Zechub Tutorial",
  url: "https://zechub.wiki/zcash-pool-visualizer",
});

export default function ZcashPoolVisualizerPage() {
  return (
    <div className="min-h-[600px] w-full max-w-4xl m-auto">
      <ZcashPoolVisualizer />
    </div>
  );
}
