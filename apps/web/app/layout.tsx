import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VELVET NOIR RECORDINGS — Avant-Garde Luxury Music Label",
    template: "%s | VELVET NOIR RECORDINGS",
  },
  description:
    "An avant-garde collective of boundary-defying producers, cinematic composers, and visionary recording artists. Archival records, live tours, and documentary productions.",
  keywords: [
    "music label",
    "luxury record label",
    "electronic music",
    "orchestral film scores",
    "audiophile vinyl",
    "documentary production",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${plusJakarta.variable} dark`}>
      <body className="min-h-screen bg-[#070709] text-[#F3F4F6] selection:bg-[#D4AF37] selection:text-[#070709] antialiased">
        {children}
      </body>
    </html>
  );
}
