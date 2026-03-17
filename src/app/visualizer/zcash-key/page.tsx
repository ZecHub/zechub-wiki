import { ZcashKeyVisualizer } from "@/components/visualizer/zcash-key-visualizer";
import { genMetadata } from '@/lib/helpers';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/getDictionary';

type Dictionary = {
  pages?: {
    visualizer?: {
      zcashKey?: {
        title?: string;
      };
    };
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const dict = (await getDictionary()) as Dictionary;
  return genMetadata({
    title: dict.pages?.visualizer?.zcashKey?.title || 'Zcash Key Visualizer',
    url: 'https://zechub.wiki/visualizer/zcash-key',
  }) as Metadata;
}

export default function ZcashKeyVisualizerPage() {
  return <ZcashKeyVisualizer />;
}
