"use client";

import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function PDFViewer({
  pageNumber,
  pageWidth,
  onLoadSuccess,
}: {
  pageNumber: number;
  pageWidth: number;
  onLoadSuccess: (data: { numPages: number }) => void;
}) {
  return (
    <Document
      file="/api/research/zec-pool-migration/pdf"
      onLoadSuccess={onLoadSuccess}
      loading={<div className="p-12 text-center">Loading PDF...</div>}
      error={
        <div className="p-12 text-center text-red-500">
          Failed to load PDF
        </div>
      }
    >
      <Page
        pageNumber={pageNumber}
        width={pageWidth}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </Document>
  );
}
