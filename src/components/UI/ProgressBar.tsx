"use client";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import { useEffect } from "react";

export default function ProgressBar() {
  const pathname = usePathname();
  NProgress.configure({ showSpinner: false });

  useEffect(() => {
    NProgress.start();

    const timer = setTimeout(() => {
    NProgress.done();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
