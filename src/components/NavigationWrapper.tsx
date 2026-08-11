"use client";
import { usePathname } from "@/i18n/navigation";
import { Footer, Navigation } from "@/components";
import FloatingExplore from "@/components/FloatingExplore";
import ProgressBar from "@/components/UI/ProgressBar";
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

            <div className="flex flex-col justify-between grow">{children}</div>
          </div>

          <Footer />
        </>
      )}

      {isExempt && (
        <div className="flex flex-col justify-between grow">{children}</div>
      )}
    </>
  );
}
