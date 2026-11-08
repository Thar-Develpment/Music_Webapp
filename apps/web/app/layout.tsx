import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { db } from "@/lib/mock-data";
import { SiteTheme } from "@music-label/shared";

const blodeStarkly = localFont({
  src: "../public/fonts/blode-starkly/Blodestarkly-Regular.ttf",
  variable: "--font-blode",
  display: "swap",
});

const trench = localFont({
  src: "../public/fonts/trench/trench100.ttf",
  variable: "--font-trench",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ONE ROOF ENTERTAINMENT — Avant-Garde Music & Film Label",
    template: "%s | ONE ROOF ENTERTAINMENT",
  },
  description:
    "An avant-garde collective of boundary-defying producers, rock icons, and visionary recording artists. Archival records, live tours, and documentary productions.",
  keywords: [
    "one roof entertainment",
    "music label",
    "entertainment production",
    "electronic music",
    "film scores",
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
    <html
      lang="en"
      data-theme="white"
      suppressHydrationWarning
      className={`${blodeStarkly.variable} ${trench.variable} theme-white`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  document.documentElement.setAttribute('data-theme', 'white');
                  document.documentElement.classList.remove('dark', 'theme-black');
                  document.documentElement.classList.add('theme-white');
                  localStorage.removeItem('velvet_theme');
                  document.cookie = 'velvet_theme=white;path=/;max-age=31536000;SameSite=Lax';
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[#e11d48] selection:text-white antialiased"
      >
        <ThemeProvider initialTheme="white">{children}</ThemeProvider>
      </body>
    </html>
  );
}
