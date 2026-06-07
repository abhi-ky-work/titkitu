'use client';

import { create } from 'zustand';

type ThemeState = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: true, // Default to dark mode matching Stitch Grid Theme design
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setTheme: (isDark) => set({ isDarkMode: isDark }),
}));
