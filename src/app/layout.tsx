// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 1. Import Inter
import "./globals.css";
import Providers from "./providers/Providers";

// 2. Configure the Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // CSS variable name
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
    <html lang="en">
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
        // ADDED 'font-sans' HERE
        cz-shortcut-listen="true"
        className={`${inter.variable} font-sans antialiased bg-base-100 text-black dark:text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
