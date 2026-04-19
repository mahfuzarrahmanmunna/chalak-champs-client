// src/app/layout.tsx
import type { Metadata } from "next";
import { Hind_Siliguri, Open_Sans } from "next/font/google"; // 1. Import Hind Siliguri & Open Sans (Google Sans proxy)
import "./globals.css";
import Providers from "./providers/Providers";

// 2. Configure Hind Siliguri (Bangla Font)
// Includes Bengali and Latin subsets (for fallback), weights from Normal to Bold
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

// 3. Configure Google Sans (Using Open Sans as the official Google Sans is proprietary)
// Only includes Latin subset. This forces Bangla text to fall back to Hind Siliguri.
const googleSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-google-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chalak Champs - Learn English with Fun",
  description:
    "Chalak Champs is an interactive English learning platform designed for children. With engaging games, fun activities, and a vibrant community, we make learning English enjoyable and effective for young learners.",
  manifest: "/manifest.json",

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme='light'>
      <head>
        {/* Ensure Chrome can detect the PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body
        // ADDED BOTH FONT VARIABLES HERE
        cz-shortcut-listen="true"
        className={`${hindSiliguri.variable}  ${googleSans.variable} font-sans antialiased bg-base-100 text-black dark:text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
