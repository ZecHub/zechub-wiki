"use client";
import { useEffect } from "react";
import { applyInterface, savedInterface } from "@/lib/interfaces";

/** Restores the saved interface after hydration (no inline script, so no CSP nonce mismatch). */
export default function InterfaceInit() {
  useEffect(() => {
    applyInterface(savedInterface());
  }, []);
  return null;
}
