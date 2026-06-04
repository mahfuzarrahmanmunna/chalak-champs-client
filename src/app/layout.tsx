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

// FIX: Ensure metadataBase resolves correctly on all environments
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://chalakchamps.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Chalak Champs - Learn English with Fun",
  description:
    "Chalak Champs is an interactive English learning platform designed for children. With engaging games, fun activities, and a vibrant community, we make learning English enjoyable and effective for young learners.",

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Chalak Champs",
    title: "Chalak Champs - Learn English with Fun",
    description:
      "Chalak Champs is an interactive English learning platform designed for children. With engaging games, fun activities, and a vibrant community, we make learning English enjoyable and effective for young learners.",
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: "Chalak Champs Logo",
      },
    ],
  },

  // FIX 3: Twitter Sharing added properly
  twitter: {
    card: "summary_large_image",
    title: "Chalak Champs - Learn English with Fun",
    description:
      "Chalak Champs is an interactive English learning platform designed for children. With engaging games, fun activities, and a vibrant community, we make learning English enjoyable and effective for young learners.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is useful when switching lang dynamically
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        {/* --- SEO FAVICONS --- */}
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/icon.png" sizes="180x180" />

        {/* --- SEO METADATA --- */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* --- GOOGLE VERIFICATION --- */}
        {/* Replace 'your-google-code' with actual verification code */}
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
