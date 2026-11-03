import React, { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/animations/SmoothScroll";
import { FloatingOrbs } from "@/components/animations/FloatingOrbs";
import { db } from "@/lib/mock-data";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = db.settings;

  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col relative transition-colors duration-300 bg-[var(--background)] text-[var(--foreground)]">
        {/* Ambient Drifting Glowing Orbs for Glass Refraction */}
        <FloatingOrbs />

        {/* Global Navigation */}
        <Navbar siteName={settings.siteName} socialLinks={settings.socialLinks} />

        {/* Page Content */}
        <Suspense fallback={null}>
          <main className="flex-1 w-full relative">{children}</main>
        </Suspense>

        {/* Global Footer */}
        <Footer settings={settings} />
      </div>
    </SmoothScroll>
  );
}
