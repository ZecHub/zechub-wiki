"use client";
import { DarkModeContext } from "@/context/DarkModeContext";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = (
  props,
) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <DarkModeContext.Provider value={{ dark: isDark, setDark: (dark) => setTheme(dark ? 'dark' : 'light') }}>
      {props.children}
    </DarkModeContext.Provider>
  );
};
