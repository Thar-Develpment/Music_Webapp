"use client";

import React from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

export function FloatingOrbs() {
  const { isDark } = useTheme();

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* Top subtle crimson accent halo */}
      <div
        className={`absolute -top-[15%] left-[20%] w-[650px] h-[500px] rounded-full transition-opacity duration-500 ${
          isDark ? "opacity-45" : "opacity-30"
        }`}
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(229,30,43,0.18) 0%, rgba(229,30,43,0.04) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(229,30,43,0.12) 0%, rgba(229,30,43,0.02) 60%, transparent 80%)",
          transform: "translateZ(0)",
        }}
      />

      {/* Center-right subtle red ambient warmth */}
      <div
        className={`absolute top-[40%] -right-[10%] w-[600px] h-[600px] rounded-full transition-opacity duration-500 ${
          isDark ? "opacity-35" : "opacity-25"
        }`}
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(229,30,43,0.15) 0%, rgba(255,43,56,0.05) 50%, transparent 75%)"
            : "radial-gradient(circle, rgba(229,30,43,0.1) 0%, rgba(255,43,56,0.03) 50%, transparent 75%)",
          transform: "translateZ(0)",
        }}
      />

      {/* Bottom ambient glow */}
      <div
        className={`absolute bottom-[5%] left-[10%] w-[500px] h-[400px] rounded-full transition-opacity duration-500 ${
          isDark ? "opacity-30" : "opacity-20"
        }`}
        style={{
          background: "radial-gradient(circle, rgba(229,30,43,0.1) 0%, transparent 70%)",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}
