"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "@/components/theme/ThemeProvider";

interface OneRoofLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "horizontal" | "stacked" | "icon";
  showText?: boolean;
  className?: string;
  priority?: boolean;
}

export default function OneRoofLogo({
  size = "md",
  variant = "horizontal",
  showText = true,
  className = "",
  priority = false,
}: OneRoofLogoProps) {
  const { isDark } = useTheme();

  // Size configurations
  const iconSizes = {
    sm: { width: 32, height: 26, container: "w-8 h-8" },
    md: { width: 44, height: 36, container: "w-11 h-11" },
    lg: { width: 60, height: 50, container: "w-14 h-14" },
    xl: { width: 88, height: 72, container: "w-20 h-20" },
  };

  const textSizes = {
    sm: {
      title: "text-base tracking-[0.16em]",
      subtitle: "text-[8px] tracking-[0.32em]",
      gap: "gap-2.5",
    },
    md: {
      title: "text-lg sm:text-xl tracking-[0.18em]",
      subtitle: "text-[9px] sm:text-[10px] tracking-[0.34em]",
      gap: "gap-3",
    },
    lg: {
      title: "text-2xl sm:text-3xl tracking-[0.18em]",
      subtitle: "text-xs tracking-[0.36em]",
      gap: "gap-4",
    },
    xl: {
      title: "text-3xl sm:text-4xl tracking-[0.2em]",
      subtitle: "text-sm tracking-[0.38em]",
      gap: "gap-5",
    },
  };

  const iconDim = iconSizes[size];
  const textDim = textSizes[size];

  // If icon-only
  if (variant === "icon" || !showText) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 group ${className}`}
      >
        <div className="relative">
          <img
            src="/logo-icon.png"
            alt="One Roof Logo"
            className="w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            style={{ height: iconDim.height }}
          />
        </div>
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div
        className={`flex flex-col items-center text-center group ${textDim.gap} ${className}`}
      >
        <div className="relative">
          <img
            src="/logo-icon.png"
            alt="One Roof"
            className="w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
            style={{ height: iconDim.height * 1.3 }}
          />
        </div>
        <div className="flex flex-col items-center">
          <span
            className={`font-heading font-black leading-none uppercase ${
              isDark ? "text-white" : "text-[#09090B]"
            } ${textDim.title}`}
          >
            ONE ROOF
          </span>
          <span
            className={`font-medium uppercase leading-relaxed mt-1 ${
              isDark ? "text-zinc-300" : "text-zinc-700"
            } ${textDim.subtitle}`}
          >
            ENTERTAINMENT
          </span>
          {/* Prismatic rainbow underline matching logo */}
          <div className="w-full mt-1.5 h-[2px] rounded-full bg-gradient-to-r from-[#2563EB] via-[#7C3AED] via-[#E11D48] via-[#EA580C] to-[#FACC15]" />
        </div>
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div
      className={`inline-flex items-center ${textDim.gap} group select-none ${className}`}
    >
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src="/logo-icon.png"
          alt="One Roof Icon"
          className="w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
          style={{ height: iconDim.height }}
        />
      </div>

      <div className="flex flex-col justify-center">
        <span
          className={`font-heading font-black leading-none uppercase ${
            isDark ? "text-white" : "text-[#09090B]"
          } ${textDim.title}`}
        >
          ONE ROOF
        </span>
        <div className="relative inline-block mt-1">
          <span
            className={`font-bold uppercase block leading-none ${
              isDark ? "text-zinc-300" : "text-zinc-800"
            } ${textDim.subtitle}`}
          >
            ENTERTAINMENT
          </span>
          {/* Signature Multi-Color Spectrum Accent Underline */}
          <div className="w-full mt-1 h-[2px] rounded-full bg-gradient-to-r from-[#2563EB] via-[#7C3AED] via-[#E11D48] via-[#EA580C] to-[#FACC15]" />
        </div>
      </div>
    </div>
  );
}

