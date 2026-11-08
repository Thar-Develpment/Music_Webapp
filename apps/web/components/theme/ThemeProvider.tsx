"use client";

import React, { createContext, useContext, useEffect, useCallback } from "react";
import { SiteTheme } from "@music-label/shared";

interface ThemeContextType {
  theme: SiteTheme;
  isDark: boolean;
  setTheme: (theme: SiteTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "white",
  isDark: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

function applyWhiteThemeToDOM() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", "white");
  root.classList.remove("dark", "theme-black");
  root.classList.add("theme-white");
  try {
    localStorage.removeItem("velvet_theme");
    document.cookie = "velvet_theme=white;path=/;max-age=31536000;SameSite=Lax";
  } catch (e) {
    // ignore
  }
}

export function ThemeProvider({
  children,
}: {
  initialTheme?: SiteTheme;
  children: React.ReactNode;
}) {
  useEffect(() => {
    applyWhiteThemeToDOM();
  }, []);

  const setTheme = useCallback((_newTheme: SiteTheme) => {
    applyWhiteThemeToDOM();
  }, []);

  const toggleTheme = useCallback(() => {
    applyWhiteThemeToDOM();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: "white",
        isDark: false,
        setTheme,
        toggleTheme,
      }}
    >
      <div
        data-theme="white"
        suppressHydrationWarning
        className="min-h-screen transition-colors duration-300 theme-white bg-[#FAFAFC] text-[#09090B]"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
