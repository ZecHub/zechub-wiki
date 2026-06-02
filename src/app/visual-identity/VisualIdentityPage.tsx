"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Configure PDF.js worker for Next.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function VisualIdentityPage() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [pageWidth, setPageWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle window resize and container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Get the actual container width and subtract padding
        const containerWidth = containerRef.current.clientWidth;
        setPageWidth(containerWidth - 32); // Subtract 32px for padding (16px on each side)
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    
    // Use ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateWidth);
      resizeObserver.disconnect();
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const flipPage = useCallback(
    (direction: "next" | "prev") => {
      if (isFlipping) return;

      if (direction === "next" && pageNumber < numPages) {
        setIsFlipping(true);
        setTimeout(() => {
          setPageNumber((prev) => prev + 1);
          setIsFlipping(false);
        }, 500);
      } else if (direction === "prev" && pageNumber > 1) {
        setIsFlipping(true);
        setTimeout(() => {
          setPageNumber((prev) => prev - 1);
          setIsFlipping(false);
        }, 500);
      }
    },
    [isFlipping, pageNumber, numPages],
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        flipPage("prev");
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        flipPage("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flipPage]);

  // Touch swipe support
  useEffect(() => {
    let touchStartX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          flipPage("next");
        } else {
          flipPage("prev");
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [flipPage]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="pt-16 pb-8 px-6">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm font-medium">
            Brand Guidelines
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            ZecHub Visual Identity
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Explore the official ZecHub Brand Visual Identity Guidelines. This
            document contains logo usage, color palettes, typography standards,
            branding rules, and visual assets.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/zecHub-visual-identity.pdf"
              download
              className="inline-flex items-center px-6 py-3 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download PDF
            </a>
            <a
              href="https://drive.google.com/file/d/1js6Yt5JX4qh2mkWVVQ3Vcq7Z19io5Qku/view"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:border-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Open in Drive
            </a>
          </div>
        </div>
      </section>

      {/* Flipbook Viewer */}
      <section className="pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="relative max-w-6xl mx-auto">
            {/* Book Container */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden">
              {/* Top Navigation Bar */}
              <div className="relative z-30 flex items-center justify-between p-4 md:p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => flipPage("prev")}
                    disabled={pageNumber <= 1 || isFlipping}
                    className="group relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm border border-white/10"
                    aria-label="Previous page"
                  >
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => flipPage("next")}
                    disabled={pageNumber >= numPages || isFlipping}
                    className="group relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm border border-white/10"
                    aria-label="Next page"
                  >
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                  <span className="text-yellow-400 font-bold text-lg md:text-xl">
                    {pageNumber}
                  </span>
                  <span className="text-white/50">/</span>
                  <span className="text-white/70 font-medium">
                    {numPages || "..."}
                  </span>
                </div>
              </div>

              {/* PDF Viewer Area - Added ref and padding removal */}
              <div className="relative p-4 md:p-6">
                {/* Page Flip Animation Container - Removed fixed min-height, made responsive */}
                <div 
                  ref={containerRef}
                  className="relative bg-white rounded-lg shadow-2xl overflow-hidden w-full"
                >
                  {/* Animated Page */}
                  <div
                    className={`
                      animate-in fade-in duration-300
                      ${isFlipping ? "opacity-0 scale-95" : "opacity-100 scale-100"}
                      transition-all duration-300 ease-in-out
                      flex justify-center
                    `}
                  >
                    <Document
                      file="/zecHub-visual-identity.pdf"
                      onLoadSuccess={onDocumentLoadSuccess}
                      loading={
                        <div className="flex items-center justify-center min-h-[400px] md:min-h-[600px]">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">
                              Loading flipbook...
                            </p>
                          </div>
                        </div>
                      }
                      error={
                        <div className="flex items-center justify-center min-h-[400px] md:min-h-[600px]">
                          <div className="text-center">
                            <svg
                              className="w-16 h-16 text-red-400 mx-auto mb-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                              />
                            </svg>
                            <p className="text-red-500 font-medium">
                              Failed to load PDF
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                              Please make sure the PDF file exists in the public
                              folder
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
                  </div>
                </div>

                {/* Page Turn Indicators */}
                {pageNumber > 1 && (
                  <button
                    onClick={() => flipPage("prev")}
                    className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 z-10"
                  >
                    <svg
                      className="w-6 h-6 md:w-8 md:h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}

                {pageNumber < numPages && (
                  <button
                    onClick={() => flipPage("next")}
                    className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 z-10"
                  >
                    <svg
                      className="w-6 h-6 md:w-8 md:h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Bottom Controls */}
              <div className="relative z-30 p-4 md:p-6 border-t border-white/10 space-y-4">
                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${numPages ? (pageNumber / numPages) * 100 : 0}%`,
                    }}
                  />
                </div>

                {/* Page Navigation Dots */}
                {numPages > 0 && (
                  <div className="flex justify-center gap-1.5 flex-wrap max-w-2xl mx-auto">
                    {Array.from({ length: numPages }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setPageNumber(index + 1)}
                        className={`transition-all duration-300 rounded-full ${
                          pageNumber === index + 1
                            ? "w-6 h-1.5 bg-yellow-400 shadow-lg shadow-yellow-400/50"
                            : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50 hover:scale-125"
                        }`}
                        title={`Go to page ${index + 1}`}
                        aria-label={`Go to page ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Quick Navigation */}
                <div className="flex items-center justify-center gap-3 md:gap-4">
                  <button
                    onClick={() => setPageNumber(1)}
                    disabled={pageNumber === 1}
                    className="text-xs md:text-sm text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    First
                  </button>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={numPages}
                      value={pageNumber}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= 1 && value <= numPages) {
                          setPageNumber(value);
                        }
                      }}
                      className="w-16 md:w-20 text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-2 py-1.5 text-white text-sm"
                      aria-label="Page number input"
                    />
                    <span className="text-white/50 text-xs md:text-sm">
                      of {numPages}
                    </span>
                  </div>

                  <button
                    onClick={() => setPageNumber(numPages)}
                    disabled={pageNumber === numPages}
                    className="text-xs md:text-sm text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Last
                  </button>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="text-center">
                  <span className="text-white/40 text-xs">
                    💡 Use ← → arrow keys or swipe to flip pages
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}