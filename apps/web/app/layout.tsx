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
    default: "VELVET NOIR RECORDINGS — Avant-Garde Music Label",
    template: "%s | VELVET NOIR RECORDINGS",
  },
  description:
    "An avant-garde collective of boundary-defying producers, rock icons, and visionary recording artists. Archival records, live tours, and documentary productions.",
  keywords: [
    "music label",
    "rock record label",
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
  const theme: SiteTheme = db.settings.theme === "black" ? "black" : "white";

  return (
    <html
      lang="en"
      data-theme={theme}
      suppressHydrationWarning
      className={`${blodeStarkly.variable} ${trench.variable} ${
        theme === "black" ? "dark theme-black" : "theme-white"
      }`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var m = document.cookie.match(/(?:^|;\\s*)velvet_theme=(black|white)/);
                  var t = (m && m[1]) || localStorage.getItem('velvet_theme') || '${theme}';
                  document.documentElement.setAttribute('data-theme', t);
                  if (t === 'black') {
                    document.documentElement.classList.add('dark', 'theme-black');
                    document.documentElement.classList.remove('theme-white');
                  } else {
                    document.documentElement.classList.remove('dark', 'theme-black');
                    document.documentElement.classList.add('theme-white');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[#E51E2B] selection:text-white antialiased">
        <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
