"use client";

import { useThemeStore } from "@/lib/themeStore";
import { useEffect } from "react";

export default function StitchThemeWrapper({ children }: { children: React.ReactNode }) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className={`stitch-theme min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? "dark-theme" : "light-theme"
    }`}>
      {children}
    </div>
  );
}
