"use client";

import React, { useRef } from "react";

interface GlassTiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

/**
 * Ultra-fast GPU-accelerated Glass Card with smooth 3D tilt and specular lighting.
 * Direct DOM updates avoid React reconciliation cycles on mouse movement.
 */
export function GlassTiltCard({
  children,
  className = "",
  glowColor = "rgba(229, 30, 43, 0.25)",
}: GlassTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -5;
    const rotY = ((x - centerX) / centerX) * 5;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.01, 1.01, 1.01)`;
    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(circle 280px at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, ${glowColor}, transparent 70%)`;
      spotlightRef.current.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = "0";
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl glass-panel overflow-hidden transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Specular Radial Spotlight Layer */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-3xl z-10 opacity-0"
      />

      {/* Card Content */}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
}
