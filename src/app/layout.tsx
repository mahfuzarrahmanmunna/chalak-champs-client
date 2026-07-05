import type { Metadata } from "next";
import { Hind_Siliguri, Open_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// --- Configure Fonts ---
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

// --- Root Metadata ---
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  // CORE SEO
  title: "চালক Champs | Be clever, Be a champ",
  description:
    "আমরা ৩-১৫ বছর বয়সী শিশুদের জন্য আনন্দময় পরিবেশে ভাষা, গণিত, জীবন দক্ষতাসহ সার্বিক বিকাশে কাজ করি।",

  keywords: [
    "চালক চ্যাম্পস",
    "Chalak Champs",
    "kids education",
    "child development",
    "Bangla education",
    "math for kids",
  ],
  category: "Education",

  // LANGUAGE & INDEXING
  alternates: {
    canonical: siteUrl,
    languages: {
      en: `${siteUrl}/en`,
      bn: `${siteUrl}/bn`,
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_CODE",
  },

  authors: [{ name: "Chalak Champs", url: siteUrl }],

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",

  // SOCIAL MEDIA (Fallback for root)
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Chalak Champs",
    locale: "bn_BD",
    title: "চালক Champs | Be clever, Be a champ",
    description:
      "আমরা ৩-১৫ বছর বয়সী শিশুদের জন্য আনন্দময় পরিবেশে ভাষা, গণিত, জীবন দক্ষতাসহ সার্বিক বিকাশে কাজ করি।",
    images: [
      {
        url: `${siteUrl}/homecover.jpg`,
        width: 1200,
        height: 630,
        alt: "Chalak Champs Social Cover",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "চালক Champs | Be clever, Be a champ",
    description:
      "আমরা ৩-১৫ বছর বয়সী শিশুদের জন্য আনন্দময় পরিবেশে ভাষা, গণিত, জীবন দক্ষতাসহ সার্বিক বিকাশে কাজ করি।",
    images: [`${siteUrl}/homecover.jpg`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- Root Level Structured Data ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "চালক Champs",
    alternateName: "Chalak Champs",
    url: siteUrl,
    description:
      "আমরা ৩-১৫ বছর বয়সী শিশুদের জন্য আনন্দময় পরিবেশে ভাষা, গণিত, জীবন দক্ষতাসহ সার্বিক বিকাশে কাজ করি।",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="bn" data-theme="light">
      <body
        className={`${hindSiliguri.variable} ${googleSans.variable} font-sans antialiased`}
      >
        <Script
          id="structured-data-root"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
