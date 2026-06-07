"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { useThemeStore } from "@/lib/themeStore";
import { signOut } from "@/lib/cognitoActions";

export default function StitchHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const initialized = useAuthStore((state: any) => state.initialized);
  const clearAuth = useAuthStore((state: any) => state.clearAuth);

  const [headerSearchQuery, setHeaderSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearchQuery.trim()) {
      router.push(`/browseEvents2?q=${encodeURIComponent(headerSearchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    clearAuth();
    router.push("/");
  };

  return (
    <header className="bg-background/80 backdrop-blur-xl sticky top-0 z-50 border-b border-outline-variant/10 shadow-[0_0_20px_rgba(188,19,254,0.15)]">
      <nav className="flex justify-between items-center w-full px-5 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <span
            onClick={() => router.push(isAuthenticated ? "/dashboard" : "/")}
            className="font-display-lg text-2xl md:text-3xl tracking-tighter text-primary cursor-pointer font-extrabold"
          >
            TiketIt
          </span>
          <div className="hidden md:flex gap-6 items-center">
            <span
              onClick={() => router.push("/browseEvents")}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                pathname === "/browseEvents" ? "text-primary border-b-2 border-primary pb-0.5" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Standard Browse
            </span>
            <span
              onClick={() => router.push("/browseEvents2")}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                pathname === "/browseEvents2" ? "text-primary border-b-2 border-primary pb-0.5" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Stitch Grid
            </span>
            <span
              onClick={() => router.push("/dashboard")}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-sm font-medium"
            >
              Dashboard
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Header Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              className="bg-surface-container-high border-none rounded-full pl-10 pr-4 py-2 text-sm text-[var(--foreground)] focus:ring-1 focus:ring-secondary-container w-64 transition-all"
              placeholder="Search clubs or events..."
              type="text"
              value={headerSearchQuery}
              onChange={(e) => setHeaderSearchQuery(e.target.value)}
            />
          </form>

          {/* Theme Toggle Switcher */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-primary hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDarkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {initialized && (
            <>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => router.push("/dashboard/create-event")}
                    className="hidden lg:block px-6 py-2 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold scale-95 active:scale-90 transition-transform neon-glow-primary cursor-pointer"
                  >
                    Create Event
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/partnerLogin")}
                    className="hidden lg:block px-6 py-2 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold scale-95 active:scale-90 transition-transform neon-glow-primary cursor-pointer"
                  >
                    Partner Sign In
                  </button>
                  <button
                    onClick={() => router.push("/partnerLogin")}
                    className="text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold cursor-pointer"
                  >
                    Sign In
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
