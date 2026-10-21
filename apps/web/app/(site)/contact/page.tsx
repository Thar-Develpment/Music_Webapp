import React from "react";
import { db } from "@/lib/mock-data";
import ContactPageView from "@/components/site/ContactPageView";

export const metadata = {
  title: "Contact & Bookings | Velvet Noir Recordings",
  description:
    "Direct booking, sync licensing, and press management enquiries for Velvet Noir Recordings.",
};

export default function ContactPage() {
  const settings = db.settings;
  const content = db.contactContent;

  return <ContactPageView settings={settings} content={content} />;
}
