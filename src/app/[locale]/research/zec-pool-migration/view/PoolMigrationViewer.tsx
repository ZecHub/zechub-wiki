"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const PDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
});

export default function PoolMigrationViewer() {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setPageWidth(Math.max(300, containerRef.current.clientWidth - 32));
      }
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    if (containerRef.current) observer.observe(containerRef.current);

    window.addEventListener("resize", updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <main className="min-h-screen px-4 py-10 md:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold">
          ZEC Pool Migration Field Guide
        </h1>

        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Sprout → Sapling → Ironwood · Sapling → Ironwood
        </p>

        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="rounded-lg border px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>

          <span>
            Page {pageNumber} / {numPages || "..."}
          </span>

          <button
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={!numPages || pageNumber >= numPages}
            className="rounded-lg border px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>

        <div
          ref={containerRef}
          className="overflow-hidden rounded-xl bg-white shadow-xl"
        >
          <PDFViewer
            pageNumber={pageNumber}
            pageWidth={pageWidth}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          />
        </div>

        <div className="mt-6 text-center">
          <a
            href="/api/research/zec-pool-migration/pdf"
            download="zcash_pool_migration_guide_zechub_v1_1_2026-09-18.pdf"
            className="font-semibold underline"
          >
            Download PDF
          </a>
        </div>
      </div>
    </main>
  );
}
