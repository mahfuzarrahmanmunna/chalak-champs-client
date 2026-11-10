import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Providers from "../providers/Providers";
import { fetchStatic } from "@/lib/staticApi";

// NOTE: If you are using Next.js 15, params is a Promise.
// You will need to use: const { lang } = await params;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  // MUST AWAIT PARAMS in Next.js 15
  const { lang } = await params;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://chalakchamps.com";

  const coverImage = `${siteUrl}/homecover.jpg`;

  const bnTitle = "চালক Champs | Every child is a champ ";
  const bnDesc =
    "আমরা ৩-১৫ বছর বয়সী শিশুদের জন্য আনন্দময় পরিবেশে ভাষা, গণিত, জীবন দক্ষতাসহ সার্বিক বিকাশে কাজ করি।";

  const enTitle = "Chalak Champs | Every child is a champ ";
  const enDesc =
    "Chalak Champs is an interactive English learning platform designed for children. With engaging games, fun activities, and a vibrant community, we make learning English enjoyable and effective for young learners.";

  const isBn = lang === "bn";

  return {
    title: isBn ? bnTitle : enTitle,
    description: isBn ? bnDesc : enDesc,

    metadataBase: new URL(siteUrl),

    keywords: isBn
      ? ["শিশুদের শিক্ষা", "গণিত", "ভাষা", "Chalak Champs", "Kids Education"]
      : [
          "kids education",
          "child development",
          "English learning",
          "Chalak Champs",
          "math for kids",
        ],

    authors: [{ name: "Chalak Champs", url: siteUrl }],

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
      },
    },

    alternates: {
      // This was causing /undefined because 'lang' was undefined
      canonical: `${siteUrl}/${lang}`,
      languages: {
        en: `${siteUrl}/en`,
        bn: `${siteUrl}/bn`,
      },
    },

    openGraph: {
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      // This was also causing /undefined
      url: `${siteUrl}/${lang}`,
      siteName: "Chalak Champs",
      title: isBn ? bnTitle : enTitle,
      description: isBn ? bnDesc : enDesc,

      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: "Chalak Champs Social Media Cover",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: isBn ? bnTitle : enTitle,
      description: isBn ? bnDesc : enDesc,
      images: [coverImage],
    },

    other: {
      "fb:app_id": process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
    },
  };
}

// Every page under /[lang] is server-rendered per request (live API data).
export const dynamic = "force-dynamic";

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
  if (lang !== "bn" && lang !== "en") {
    notFound();
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://chalakchamps.com";

  // Hero content fetched live on every request.
  const heroJson = await fetchStatic<{ success?: boolean; data?: any }>(
    `/api/hero/${lang}`,
  );
  // Base64 images (e.g. the unused kingImage, ~500 KB) are left out so the HTML
  // stays small; the client refresh still loads the full record.
  const initialHeroData =
    heroJson?.success && heroJson.data
      ? Object.fromEntries(
          Object.entries(heroJson.data).filter(
            ([, v]) => !(typeof v === "string" && v.startsWith("data:")),
          ),
        )
      : null;

  // --- Dynamic Structured Data (JSON-LD) ---
  const jsonLd = {
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
      },
      {
        "@type": "WebSite",
        url: `${siteUrl}/${lang}`,
        name: lang === "bn" ? "চালক Champs" : "Chalak Champs",
        description:
          lang === "bn"
            ? "আমরা ৩-১৫ বছর বয়সী শিশুদের জন্য আনন্দময় পরিবেশে ভাষা, গণিত, জীবন দক্ষতাসহ সার্বিক বিকাশে কাজ করি।"
            : "Chalak Champs is an interactive English learning platform designed for children.",
        inLanguage: lang,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/${lang}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="structured-data-lang"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Providers initialLang={lang} initialHeroData={initialHeroData}>
        {children}
      </Providers>
    </>
  );
}
