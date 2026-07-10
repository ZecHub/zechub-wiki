"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Configure PDF.js worker (only runs on client). Served same-origin from
// public/ instead of a third-party CDN (unpkg). The file is copied from
// react-pdf's own pdfjs-dist by scripts/copy-pdf-worker.mjs (predev/prebuild),
// so its version always matches pdfjs.version.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PDFViewerProps {
  pageNumber: number;
  onLoadSuccess: (data: { numPages: number }) => void;
  pageWidth: number;
}

export default function PDFViewer({ pageNumber, onLoadSuccess, pageWidth }: PDFViewerProps) {
  return (
    <Document
      file="/zecHub-visual-identity.pdf"
      onLoadSuccess={onLoadSuccess}
      loading={
        <div className="flex items-center justify-center min-h-[400px] md:min-h-[600px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading flipbook...</p>
          </div>
        </div>
      }
      error={
        <div className="flex items-center justify-center min-h-[400px] md:min-h-[600px]">
          <div className="text-center">
            <p className="text-red-500 font-medium">Failed to load PDF</p>
            <p className="text-gray-500 text-sm mt-2">
              Please make sure the PDF file exists in the public folder
            </p>
          </div>
        </div>
      }
    >
      <Page
        pageNumber={pageNumber}
        width={pageWidth}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        className="flex justify-center w-full"
        loading={
          <div className="flex items-center justify-center min-h-[400px] md:min-h-[600px]">
            <div className="animate-pulse text-gray-400">
              Loading page {pageNumber}...
            </div>
          </div>
        }
      />
    </Document>
  );
}