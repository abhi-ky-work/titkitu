'use client';

import { create } from 'zustand';

type AuthUser = {
  username: string;
} | null;

type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser;
  initialized: boolean;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  setInitialized: (initialized: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  initialized: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
  setInitialized: (initialized) => set({ initialized }),
}));


