"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import Videoimg from "./Videoimg";
import AddsCard from "../AddsCard/AddsCard";
import { useLanguage } from "@/app/context/LanguageContext";
import { useBooking } from "@/app/providers/BookingProvider";

/* ================================================================
   CONFIGURATION — all language-dependent patterns live here.
   Add / edit keywords in one place; the component stays clean.
   ================================================================ */

interface TitlePattern {
  intro: string;
  highlight: string;
}

interface SubtitlePattern {
  courses: string[];
  brands: { chalak: string; champs: string };
}

interface FallbackTexts {
  title: string;
  subtitle: string;
  ctaButton: string;
  cta2: string;
  cta2Btn: string;
}

interface LangConfig {
  title: TitlePattern;
  subtitle: SubtitlePattern;
  fallback: FallbackTexts;
}

const LANG_CONFIG: Record<string, LangConfig> = {
  en: {
    title: { intro: "We Believe", highlight: "Champ" },
    subtitle: {
      courses: [
        "Spoken English",
        "Abacus Mind Math",
        "Drawing",
        "Programming",
        "Quran Learning",
      ],
      brands: { chalak: "Chalak", champs: "Champs" },
    },
    fallback: {
      title: "We Believe Every Child Is A Champ",
      subtitle:
        "Discover Spoken English, Abacus Mind Math, Drawing, Programming, Quran Learning courses at Chalak Champs",
      ctaButton: "Book Free Class",
      cta2: "Limited seats available! ",
      cta2Btn: "Explore Courses",
    },
  },
  bn: {
    title: { intro: "আমরা বিশ্বাস করি", highlight: "চ্যাম্প" },
    subtitle: {
      courses: [
        "কথা বলা ইংরেজি",
        "অ্যাবাকাস মাইন্ড ম্যাথ",
        "অঙ্কন",
        "প্রোগ্রামিং",
        "কুরআন শিক্ষা",
      ],
      brands: { chalak: "চালাক", champs: "চ্যাম্পস" },
    },
    fallback: {
      title: "আমরা বিশ্বাস করি প্রতিটি শিশু একজন চ্যাম্প",
      subtitle:
        "চালাক চ্যাম্পস-এ কথা বলা ইংরেজি, অ্যাবাকাস মাইন্ড ম্যাথ, অঙ্কন, প্রোগ্রামিং, কুরআন শিক্ষা কোর্স আবিষ্কার করুন",
      ctaButton: "বিনামূল্যে ক্লাস বুক করুন",
      cta2: "সীমিত আসন উপলব্ধ! ",
      cta2Btn: "কোর্স দেখুন",
    },
  },
};

/* ================================================================
   HELPERS
   ================================================================ */

/** Escape special regex chars in a string */
function esc(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Build a single RegExp that matches any string in the array (longest-first) */
function buildOrRegex(strings: string[]): RegExp {
  const sorted = [...strings].sort((a, b) => b.length - a.length);
  return new RegExp(`(${sorted.map(esc).join("|")})`, "gi");
}

/* ================================================================
   COMPONENT
   ================================================================ */

const Banner1 = () => {
  const { heroData, currentLang } = useLanguage();
  const { openBooking } = useBooking();

  // Pick config — default to "en" if lang is missing or unknown
  const lang = currentLang || "en";
  const cfg = LANG_CONFIG[lang] ?? LANG_CONFIG.en;

  /* ---------- 1. Resolve every field with fallback ---------- */
  const rawTitle: string = heroData?.title?.trim() || cfg.fallback.title;
  const rawSubtitle: string =
    heroData?.subtitle?.trim() || cfg.fallback.subtitle;
  const ctaButton: string = heroData?.ctaButton || cfg.fallback.ctaButton;
  const cta2: string = heroData?.cta2 || cfg.fallback.cta2;
  const cta2Btn: string = heroData?.cta2Btn || cfg.fallback.cta2Btn;
  const kingSrc: string = heroData?.kingImage || "/king.png";
  const secondaryLink: string = heroData?.secondaryLink || `/${lang}/courses`;
  const isBase64 = kingSrc.startsWith("data:");

  /* ---------- 2. Parse Title ---------- */
  let introText = "";
  let mainTitle = rawTitle;

  // Split "We Believe" / "আমরা বিশ্বাস করি" out as the intro <p>
  if (rawTitle.includes(cfg.title.intro)) {
    introText = cfg.title.intro;
    mainTitle = rawTitle
      .split(cfg.title.intro)
      .slice(1)
      .join(cfg.title.intro)
      .trim();
  }

  // Split around "Champ" / "চ্যাম্প" for highlighting
  const hlRegex = new RegExp(`(${esc(cfg.title.highlight)})`, "i");
  const hasHighlight = hlRegex.test(mainTitle);
  hlRegex.lastIndex = 0; // reset after .test()
  const titleParts = mainTitle.split(hlRegex);

  /* ---------- 3. Parse Subtitle ---------- */
  const subKeywords = [
    ...cfg.subtitle.courses,
    cfg.subtitle.brands.chalak,
    cfg.subtitle.brands.champs,
  ];
  const subRegex = buildOrRegex(subKeywords);
  const subtitleParts = rawSubtitle.split(subRegex);

  /** Render one segment of the parsed subtitle */
  const renderSubSegment = (seg: string, idx: number) => {
    const lower = seg.toLowerCase();

    // Course name → bold
    if (cfg.subtitle.courses.some((c) => c.toLowerCase() === lower)) {
      return (
        <span key={idx} className="font-bold">
          {seg}
        </span>
      );
    }
    // "Chalak" → secondary color
    if (lower === cfg.subtitle.brands.chalak.toLowerCase()) {
      return (
        <span key={idx} className="text-secondary font-bold">
          {seg}
        </span>
      );
    }
    // "Champs" → primary color
    if (lower === cfg.subtitle.brands.champs.toLowerCase()) {
      return (
        <span key={idx} className="text-primary font-bold">
          {seg}
        </span>
      );
    }
    // Plain text
    return <React.Fragment key={idx}>{seg}</React.Fragment>;
  };

  /* ---------- 4. Render ---------- */
  return (
    <div>
      {/* Top Ad Card */}
      <div className="md:mb-20 mb-15">
        <AddsCard />
      </div>

      <div className="text-center md:max-w-205 mx-auto font-inter">
        {/* ---- Intro line (e.g. "We Believe") ---- */}
        {introText && (
          <p className="text-2xl text-gray-600 leading-15 tracking-[0px]">
            {introText}
          </p>
        )}

        {/* ---- Title + dashed box + king image ---- */}
        <div className="flex flex-col relative items-center justify-center">
          <div className="relative flex flex-wrap items-center justify-center gap-2">
            <h1 className="text-4xl md:text-6xl font-bold text-[#00477C] pointer-events-none tracking-[-3%] md:tracking-[-4px] leading-12 md:leading-18.75">
              {titleParts.map((part, i) => {
                if (part.toLowerCase() === cfg.title.highlight.toLowerCase()) {
                  return (
                    <span key={i} className="text-[#F3066E] ml-3 mr-0 pr-0">
                      {part}
                    </span>
                  );
                }
                return <React.Fragment key={i}>{part}</React.Fragment>;
              })}
            </h1>

            {/* Dashed-border decoration around the highlighted word */}
            {hasHighlight && (
              <div
                className="absolute pointer-events-none flex items-center justify-center z-10
                           right-14 bottom-0.5 w-32.5 h-11.5
                           md:right-[calc(50%-327px)] md:-bottom-1.5 md:w-57 md:h-19"
              >
                <div className="w-full h-full border-2 border-dashed border-[#F3066E] relative">
                  <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#F3066E] rounded-full" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F3066E] rounded-full" />
                  <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#F3066E] rounded-full" />
                  <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#F3066E] rounded-full" />
                </div>
              </div>
            )}
          </div>

          {/* King crown image — from API or local fallback */}
          <div className="absolute md:-top-8 z-0 right-[62%] -bottom-7 md:right-[calc(50%-355px)]">
            <Image
              src={kingSrc}
              width={50}
              height={50}
              alt="King Icon"
              className="w-[35px] h-[35px] md:w-[50px] md:h-[50px]"
              unoptimized={isBase64}
            />
          </div>
        </div>

        {/* ---- Subtitle with styled course / brand names ---- */}
        <p className="my-6 mt-12 text-gray-700 tracking-[-2%] leading-5 text-base md:text-base">
          {subtitleParts.map(renderSubSegment)}
        </p>

        {/* ---- Primary CTA ---- */}
        <button
          onClick={openBooking}
          className="group tracking-[-2%] px-6 mt-10 md:px-24 z-10 text-white
                     transition-transform duration-300 group-hover:translate-y-[-1px]
                     relative overflow-hidden rounded-lg bg-primary py-4
                     text-lg font-bold
                     hover:shadow-[0_0_20px_rgba(255,143,202,0.5)]
                     active:scale-95"
          style={{ animation: "pulseScale 2.5s infinite ease-in-out" }}
        >
          {/* Shimmer overlay */}
          <span
            className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/40 to-transparent"
            style={{
              transform: "translateX(-100%)",
              animation: "shimmer 2.5s infinite ease-in-out",
            }}
          />
          <span className="relative">{ctaButton}</span>

          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes shimmer {
                  0%        { transform: translateX(-100%) skewX(-45deg); }
                  40%, 100% { transform: translateX(150%)  skewX(-45deg); }
                }
                @keyframes pulseScale {
                  0%, 100% { transform: scale(1); }
                  50%      { transform: scale(1.02); }
                }
              `,
            }}
          />
        </button>

        {/* ---- Secondary CTA line ---- */}
        {(cta2 || cta2Btn) && (
          <p className="text-[#000000]/50 font-medium text-base mt-4 tracking-[-2%]">
            {cta2}
            {cta2Btn && (
              <Link className="text-secondary font-bold" href={secondaryLink}>
                {cta2Btn}
              </Link>
            )}
          </p>
        )}
      </div>

      {/* Video / Image section below the banner */}
      <div>
        <Videoimg />
      </div>
    </div>
  );
};

export default Banner1;
