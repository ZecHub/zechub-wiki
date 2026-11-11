import { Suspense } from "react";
import { VisualizerHub } from "@/components/visualizer/VisualizerHub";
import {
  buildVisualizerMetadata,
  type VisualizerMetadataDictionary,
  type VisualizerSearchParams,
} from "@/components/visualizer/visualizerMetadata";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/getDictionary";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<VisualizerSearchParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [dict, query] = await Promise.all([
    getDictionary(locale).catch(() => ({})) as Promise<VisualizerMetadataDictionary>,
    searchParams ?? Promise.resolve({}),
  ]);

  return buildVisualizerMetadata({
    dictionary: dict,
    locale,
    searchParams: query,
  });
}

export default function VisualizerPage() {
  return (
    <div className="min-h-screen w-full">
      {/* The hub reads its selected module from the query string, and
          useSearchParams needs a Suspense boundary on a prerendered page. */}
      <Suspense fallback={<div className="min-h-screen w-full" />}>
        <VisualizerHub />
      </Suspense>
    </div>
  );
}
