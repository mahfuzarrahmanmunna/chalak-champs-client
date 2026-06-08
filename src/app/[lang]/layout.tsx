import type { Metadata } from "next";
import Providers from "../providers/Providers"; // Ensure this path matches your project structure

// SEO: Generate metadata based on the current language
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://chalakchamps.com";

  const bnTitle = "চালাক চ্যাম্পস - আনন্দের সাথে ইংরেজি শিখুন";
  const bnDesc =
    "আমরা ৩-১৫ বছর বয়সী শিশুদের জন্য আনন্দময় পরিবেশে ভাষা, গণিত, জীবন দক্ষতাসহ সার্বিক বিকাশে কাজ করি।";
  const enTitle = "Chalak Champs - Learn English with Fun";
  const enDesc =
    "Chalak Champs is an interactive English learning platform designed for children. With engaging games, fun activities, and a vibrant community, we make learning English enjoyable and effective for young learners.";

  return {
    title: lang === "bn" ? bnTitle : enTitle,
    description: lang === "bn" ? bnDesc : enDesc,

    // --- SEO: ALTERNATES & CANONICAL ---
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        en: `${siteUrl}/en`,
        bn: `${siteUrl}/bn`,
      },
    },

    // --- SEO: OPEN GRAPH ---
    openGraph: {
      type: "website",
      locale: lang === "bn" ? "bn_BD" : "en_US",
      url: `${siteUrl}/${lang}`,
      siteName: "Chalak Champs",
      title: lang === "bn" ? bnTitle : enTitle,
      description: lang === "bn" ? bnDesc : enDesc,
      images: [
        {
          // FIX: Changed from icon.png to homecover.jpg
          // IMPORTANT: Ensure you have a file named 'homecover.jpg' in your 'public' folder
          // with dimensions 1200px x 630px.
          url: `${siteUrl}/homecover.jpg`,
          width: 1200,
          height: 630,
          alt: "Chalak Champs Social Media Cover",
        },
      ],
    },

    // --- SEO: TWITTER ---
    twitter: {
      card: "summary_large_image",
      title: lang === "bn" ? bnTitle : enTitle,
      description: lang === "bn" ? bnDesc : enDesc,
      // FIX: Changed from icon.png to homecover.jpg
      images: [`${siteUrl}/homecover.jpg`],
    },

    // --- SEO: JSON-LD STRUCTURED DATA ---
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            name: "Chalak Champs",
            url: siteUrl,
            logo: `${siteUrl}/icon.png`, // It is okay to use icon.png here for the logo schema
            sameAs: [
              "https://www.facebook.com/chalakchamps",
              "https://www.linkedin.com/company/chalakchamps",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+880174017674",
              contactType: "Customer Service",
              areaServed: "BD",
              availableLanguage: ["English", "Bengali", "Hindi"],
            },
          },
          {
            "@type": "WebSite",
            url: `${siteUrl}/${lang}`,
            name: "Chalak Champs",
            description: lang === "bn" ? bnDesc : enDesc,
            publisher: {
              "@type": "Organization",
              name: "Chalak Champs",
            },
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteUrl}/search?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          },
        ],
      }),
    },
  };
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "bn" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    // Providers wraps the children and handles NavHeader, Footer, etc.
    // We pass the 'lang' from the URL to the Providers.
    <Providers initialLang={lang}>{children}</Providers>
  );
}
