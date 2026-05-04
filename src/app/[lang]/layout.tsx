import type { Metadata } from "next";
import Providers from "../providers/Providers";

// SEO: Generate metadata based on the current language
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://chalakchamps.vercel.app";

  const bnTitle = "চালাক চ্যাম্পস - আনন্দের সাথে ইংরেজি শিখুন";
  const bnDesc =
    "চালাক চ্যাম্পস হলো বাংলাদেশের #১ স্কিল-ভিত্তি কিডস লার্নিং প্লাটফর্ম; যেখানে ৩ থেকে ১৫ বছর বয়সী শিশুদের জন্য রয়েছে Spoken English, Abacus Mind Math, Drawing, Programming, Quran Learning সহ আরও অনেক কোর্স।";
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
          url: `${siteUrl}/icon.png`,
          width: 1200,
          height: 630,
          alt: "Chalak Champs Logo",
        },
      ],
    },

    // --- SEO: TWITTER ---
    twitter: {
      card: "summary_large_image",
      title: lang === "bn" ? bnTitle : enTitle,
      description: lang === "bn" ? bnDesc : enDesc,
      images: [`${siteUrl}/icon.png`],
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
            logo: `${siteUrl}/icon.png`,
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

export const generateStaticParams = () => {
  return [{ lang: "en" }, { lang: "bn" }];
};

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
