import React, { Suspense } from "react";
import ContactPageView from "@/components/site/ContactPageView";
import { getSettings, getPageContent } from "@/lib/supabase/service";
import { ContactPageContent } from "@music-label/shared";

export const metadata = {
  title: "Contact & Bookings | Velvet Noir Recordings",
  description:
    "Direct booking, sync licensing, and press management enquiries for Velvet Noir Recordings.",
};

async function ContactDataFetcher() {
  const [settings, content] = await Promise.all([
    getSettings(),
    getPageContent<ContactPageContent>("contact"),
  ]);

  return <ContactPageView settings={settings} content={content} />;
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)] animate-pulse" />}>
      <ContactDataFetcher />
    </Suspense>
  );
}

