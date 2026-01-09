"use client";
import { DarkModeContext } from "@/context/DarkModeContext";
import { useContext } from "react";

export const useDarkModeContext = () => {
  const context = useContext(DarkModeContext);

  if (!context) {
    throw new Error("useDarkMode must be use within a DarkModeProvider");
  }

  return context;
};
