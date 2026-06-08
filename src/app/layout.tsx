import type { Metadata } from "next";
import { Hind_Siliguri, Open_Sans } from "next/font/google";
import "./globals.css";

// Configure Fonts
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const googleSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-google-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chalakchamps.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  // --- Core SEO ---
  title: "চালক Champs | Be clever, Be a champ",
  description:
    "আমরা ৩-১৫ বছর বয়সী শিশুদের জন্য আনন্দময় পরিবেশে ভাষা, গণিত, জীবন দক্ষতাসহ সার্বিক বিকাশে কাজ করি।",

  // --- Multilingual SEO (Crucial for /en and /bn) ---
  alternates: {
    canonical: "./",
    languages: {
      en: `${siteUrl}/en`,
      bn: `${siteUrl}/bn`,
    },
  },

  // --- Icons (Keep for tabs, but these are NOT for social sharing cards) ---
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",

  // --- Open Graph (Facebook, Messenger, WhatsApp, LinkedIn) ---
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Chalak Champs",
    title: "চালক Champs | Be clever, Be a champ",
    description:
      "আমরা ৩-১৫ বছর বয়সী শিশুদের জন্য আনন্দময় পরিবেশে ভাষা, গণিত, জীবন দক্ষতাসহ সার্বিক বিকাশে কাজ করি।",
    images: [
      {
        // FIX: Use absolute URL to ensure scrapers find the image
        url: `${siteUrl}/homecover.jpg`,
        width: 1200,
        height: 630,
        alt: "Chalak Champs Social Cover",
      },
    ],
  },

  // --- Twitter Card ---
  twitter: {
    card: "summary_large_image",
    title: "চালক Champs | Be clever, Be a champ",
    description:
      "আমরা ৩-১৫ বছর বয়সী শিশুদের জন্য আনন্দময় পরিবেশে ভাষা, গণিত, জীবন দক্ষতাসহ সার্বিক বিকাশে কাজ করি।",
    // FIX: Absolute URL
    images: [`${siteUrl}/homecover.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        {/* Favicon links are fine here */}
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />

        <meta name="theme-color" content="#ec4899" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* --- VERIFICATION --- */}
        <meta name="google-site-verification" content="your-google-code" />
      </head>
      <body
        className={`${hindSiliguri.variable} ${googleSans.variable} font-sans antialiased bg-base-100 text-black dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
