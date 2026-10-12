import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import AboutUsContent from "./AboutUsContent";

// Import your translation data directly so the server can read it for SEO
import aboutUsEnglish from "../../data/translations/aboutus-bangla.json";
import aboutUsBangla from "../../data/translations/aboutus-english.json";

// Define your route slugs here so they can be reused in metadata
const SLUG_EN = "/en/aboutus";
const SLUG_BN = "/bn/aboutus";

// --- SEO GENERATION ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isBangla = lang === "bn";
  const t = isBangla ? aboutUsBangla : aboutUsEnglish;

  // Safely extract text with optional chaining (?.) and fallback strings
  const seoTitle = t?.hero?.title || "About Us";

  // Try multiple possible JSON structures safely
  const seoDescription =
    (isBangla ? t?.whoWeAre?.bangla : t?.whoWeAre?.english) ||
    t?.whoWeAre?.title ||
    t?.hero?.subtitle ||
    "Learn more about our mission, vision, and values.";

  return {
    title: seoTitle,
    // substring(0, 160) is now safe because seoDescription defaults to a string
    description: seoDescription.substring(0, 160),

    // Open Graph / Social Media Sharing
    openGraph: {
      title: seoTitle,
      description: seoDescription.substring(0, 160),
      type: "website",
      locale: isBangla ? "bn_BD" : "en_US",
      url: isBangla ? SLUG_BN : SLUG_EN,
      siteName: "Chalak Champs", // Replace with your actual brand name
    },

    // Tell Google about your bilingual pages to avoid duplicate content issues
    alternates: {
      canonical: isBangla ? SLUG_BN : SLUG_EN,
      languages: {
        "en-US": SLUG_EN,
        "bn-BD": SLUG_BN,
      },
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

// --- PAGE COMPONENT ---
const AboutUsPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;
  const isBangla = lang === "bn";
  const t = isBangla ? aboutUsBangla : aboutUsEnglish;

  // JSON-LD Structured Data (Highly recommended for modern SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t?.hero?.title || "About Us",
    description:
      (isBangla ? t?.whoWeAre?.bangla : t?.whoWeAre?.english) ||
      "Learn more about us.",
    inLanguage: isBangla ? "bn" : "en",
    url: isBangla ? SLUG_BN : SLUG_EN,
  };

  return (
    <>
      {/* Inject Structured Data for search engine crawlers */}
      <Script
        id="about-us-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Semantic HTML wrapper for SEO */}
      <main>
        <AboutUsContent />
      </main>
    </>
  );
};

export default AboutUsPage;
