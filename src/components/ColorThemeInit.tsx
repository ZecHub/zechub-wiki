"use client";
import { useEffect } from "react";
import { COLOR_THEME_KEY } from "@/components/ColorThemePicker";

/** Restores the saved colour theme after hydration (no inline script, so no CSP nonce mismatch). */
export default function ColorThemeInit() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(COLOR_THEME_KEY);
      if (saved && saved !== "default") document.documentElement.setAttribute("data-color-theme", saved);
    } catch {
      /* storage unavailable: stay on default */
    }
  }, []);
  return null;
}
