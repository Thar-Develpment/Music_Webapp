import React from "react";
import ContactPageView from "@/components/site/ContactPageView";
import { getSettings, getPageContent } from "@/lib/supabase/service";
import { ContactPageContent } from "@music-label/shared";

export const metadata = {
  title: "Contact & Bookings | Velvet Noir Recordings",
  description:
    "Direct booking, sync licensing, and press management enquiries for Velvet Noir Recordings.",
};

export default async function ContactPage() {
  const [settings, content] = await Promise.all([
    getSettings(),
    getPageContent<ContactPageContent>("contact"),
  ]);

  return <ContactPageView settings={settings} content={content} />;
}
