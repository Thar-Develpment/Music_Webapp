"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
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

function applyThemeToDOM(theme: SiteTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  if (theme === "black") {
    root.classList.add("dark", "theme-black");
    root.classList.remove("theme-white");
  } else {
    root.classList.remove("dark", "theme-black");
    root.classList.add("theme-white");
  }
}

function getStoredTheme(): SiteTheme | null {
  if (typeof window === "undefined") return null;
  try {
    const local = localStorage.getItem("velvet_theme");
    if (local === "black" || local === "white") return local;

    // Check cookie
    const match = document.cookie.match(/(?:^|;\s*)velvet_theme=(black|white)/);
    if (match && (match[1] === "black" || match[1] === "white")) {
      return match[1] as SiteTheme;
    }
  } catch (e) {
    // ignore security/storage errors
  }
  return null;
}

export function ThemeProvider({
  initialTheme = "black",
  children,
}: {
  initialTheme?: SiteTheme;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<SiteTheme>(initialTheme);

  // Keep DOM updated synchronously
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  // Sync with client storage strictly after initial hydration to prevent SSR mismatch
  useEffect(() => {
    const stored = getStoredTheme();
    if (stored && stored !== initialTheme) {
      setThemeState(stored);
      applyThemeToDOM(stored);
    }
  }, [initialTheme]);

  const setTheme = useCallback((newTheme: SiteTheme) => {
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);

    // Save to storage
    try {
      localStorage.setItem("velvet_theme", newTheme);
      document.cookie = `velvet_theme=${newTheme};path=/;max-age=31536000;SameSite=Lax`;
    } catch (e) {
      // ignore
    }

    // Broadcast event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("velvet_theme_change", { detail: newTheme }));
    }

    // Persist to server in background
    fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: newTheme }),
    }).catch(() => {
      // quiet fallback
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "black" ? "white" : "black");
  }, [theme, setTheme]);

  // Listen to cross-tab storage changes and custom events
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "velvet_theme" && (e.newValue === "black" || e.newValue === "white")) {
        setThemeState(e.newValue);
        applyThemeToDOM(e.newValue);
      }
    };

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<SiteTheme>;
      if (customEvent.detail === "black" || customEvent.detail === "white") {
        setThemeState(customEvent.detail);
        applyThemeToDOM(customEvent.detail);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("velvet_theme_change", handleCustomEvent);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("velvet_theme_change", handleCustomEvent);
    };
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "black",
        setTheme,
        toggleTheme,
      }}
    >
      <div
        data-theme={theme}
        suppressHydrationWarning
        className={`min-h-screen transition-colors duration-300 ${
          theme === "black"
            ? "theme-black dark bg-[#08080A] text-[#F4F4F6]"
            : "theme-white bg-[#FAFAFC] text-[#09090B]"
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
