import { Cormorant_Garamond, IBM_Plex_Mono, Outfit, Share_Tech_Mono, Zen_Kaku_Gothic_New } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const ui = Outfit({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const gothic = Zen_Kaku_Gothic_New({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const lcd = Share_Tech_Mono({
  variable: "--font-lcd",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Scouter — scan a GitHub, unlock the anime",
  description:
    "Public GitHub in. Holographic anime card, power scouter, traits, and 1,000 extras out.",
  openGraph: {
    title: "Scouter",
    description: "Scan a GitHub. Unlock the anime.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ui.variable} ${serif.variable} ${gothic.variable} ${mono.variable} ${lcd.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
