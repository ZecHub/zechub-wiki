"use client";
import { usePathname } from "@/i18n/navigation";
import { Footer, Navigation } from "@/components";
import FloatingExplore from "@/components/FloatingExplore";
import ProgressBar from "@/components/UI/ProgressBar";
import { MAIN_CONTENT_ID } from "@/components/SkipToContent";
import type { Searcher } from "@/types";

const EXEMPT_ROUTES = ["/welcome"];

export default function NavigationWrapper({
  children,
  searchItems,
}: {
  children: React.ReactNode;
  searchItems: readonly Searcher[];
}) {
  const pathname = usePathname();
  const isExempt = EXEMPT_ROUTES.some((route) => pathname?.startsWith(route));

  return (
    <>
      {!isExempt && (
        <>
          <div className="min-h-screen mx-auto">
            <ProgressBar />
            <Navigation searchItems={searchItems} />
            <FloatingExplore />

            <div
              id={MAIN_CONTENT_ID}
              tabIndex={-1}
              className="flex flex-col justify-between grow scroll-mt-24"
            >
              {children}
            </div>
          </div>

          <Footer />
        </>
      )}

      {isExempt && (
        <div
          id={MAIN_CONTENT_ID}
          tabIndex={-1}
          className="flex flex-col justify-between grow scroll-mt-24"
        >
          {children}
        </div>
      )}
    </>
  );
}
