import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/animations/SmoothScroll";
import { db } from "@/lib/mock-data";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = db.settings;

  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col bg-[#070709] text-[#F3F4F6]">
        <Navbar siteName={settings.siteName} socialLinks={settings.socialLinks} />
        <main className="flex-1 w-full">{children}</main>
        <Footer settings={settings} />
      </div>
    </SmoothScroll>
  );
}
