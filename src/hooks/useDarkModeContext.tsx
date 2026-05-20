"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const useDarkModeContext = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  return { dark: (mounted && theme === 'dark'), setDark: (isDark: boolean) => setTheme(isDark ? 'dark' : 'light')};
};
