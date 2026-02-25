"use client";
import { DarkModeContext } from "@/context/DarkModeContext";
import React, { useEffect, useState } from "react";

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = (
  props,
) => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(prefersDark.matches);

    const listener = (e: MediaQueryListEvent) => setDark(e.matches);
    prefersDark.addEventListener("change", listener);

    return () => prefersDark.removeEventListener("change", listener);
  }, []);

  return (
    <DarkModeContext.Provider value={{ dark, setDark }}>
      {props.children}
    </DarkModeContext.Provider>
  );
};
