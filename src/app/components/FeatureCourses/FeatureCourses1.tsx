// components/FeatureCourses.tsx

"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  fetchFeatureCoursesBanner,
  type FeatureCoursesBannerData,
} from "@/services/featureCoursesBannerService";

// ---------- Fallback config per language ----------

interface BannerDefaults {
  image: string;
  link: string;
  altText: string;
}

const DEFAULTS: Record<string, BannerDefaults> = {
  en: {
    image: "/discount.png",
    link: "/en/coursedetails",
    altText: "Popular product discount image",
  },
  bn: {
    image: "/discount.png",
    link: "/bn/coursedetails",
    altText: "জনপ্রিয় পণ্য ছাড়ের ছবি",
  },
};

const FeatureCourses1 = () => {
  const { currentLang } = useLanguage();
  const lang = currentLang || "en";

  // --- State ---
  const [banner, setBanner] = useState<FeatureCoursesBannerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Fetch on mount / lang change ---
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFeatureCoursesBanner(lang);
        if (!cancelled) setBanner(data);
      } catch {
        if (!cancelled) setBanner(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  // --- Resolve values: API → fallback ---
  const defaults = DEFAULTS[lang] ?? DEFAULTS.en;

  const imageSrc: string = banner?.image || defaults.image;
  const linkHref: string = banner?.link || defaults.link;
  const altText: string = banner?.altText || defaults.altText;
  const isBase64: boolean = imageSrc.startsWith("data:");

  // --- Loading skeleton ---
  if (isLoading) {
    return (
      <section className="container mx-auto animate-pulse">
        <div className="mx-auto h-[200px] md:h-[400px] rounded-3xl md:rounded-[36px] bg-gray-200" />
      </section>
    );
  }

  return (
    <section className="container mx-auto">
      <Link href={linkHref}>
        <Image
          src={imageSrc}
          width={1000}
          height={400}
          alt={altText}
          className="mx-auto rounded-3xl md:rounded-[36px] border border-[#FF8FCA] transition-opacity hover:opacity-90"
          unoptimized={isBase64}
        />
      </Link>
    </section>
  );
};

export default FeatureCourses1;
