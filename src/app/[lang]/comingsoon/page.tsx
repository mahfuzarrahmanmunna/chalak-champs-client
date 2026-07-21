// app/[lang]/coming-soon/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";

// ============================================================
// CONFIG — Change this date to your launch target
// ============================================================
const LAUNCH_DATE = new Date("2025-08-15T00:00:00").getTime();

// ============================================================
// TRANSLATIONS (inline since this is a standalone page)
// ============================================================

interface ComingSoonTexts {
  brand: string;
  titleLine1: string;
  titleHighlight: string;
  titleLine2: string;
  subtitle: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  emailPlaceholder: string;
  notifyBtn: string;
  notifySuccess: string;
  backHome: string;
  footerNote: string;
}

const TEXTS: Record<string, ComingSoonTexts> = {
  en: {
    brand: "Chalak Champs",
    titleLine1: "Something Amazing",
    titleHighlight: "Is Coming",
    titleLine2: "Very Soon",
    subtitle:
      "We're crafting an incredible experience just for you. Stay tuned and be the first to know when we go live.",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    emailPlaceholder: "Enter your email address",
    notifyBtn: "Notify Me",
    notifySuccess: "You're on the list! We'll notify you soon.",
    backHome: "← Back to Home",
    footerNote: "© 2025 Chalak Champs. All rights reserved.",
  },
  bn: {
    brand: "চালাক চ্যাম্পস",
    titleLine1: "কিছু অসাধারণ",
    titleHighlight: "আসছে",
    titleLine2: "অনতিক্ষণেই",
    subtitle:
      "আমরা আপনার জন্য একটি অবিশ্বাসনীয় অভিজ্ঞতা তৈরি করছি। আমাদের লাইভ হওয়ার সাথে সাথে আপডেট পেতে সংযুক্ত থাকুন।",
    days: "দিন",
    hours: "ঘণ্টা",
    minutes: "মিনিট",
    seconds: "সেকেন্ড",
    emailPlaceholder: "আপনার ইমেইল ঠিকান দিন",
    notifyBtn: "আমাকে জানান",
    notifySuccess: "আপনি তালিকায় আছেন! আমরা শীঘ্রই আপনাকে জানাবো।",
    backHome: "← হোমপেজে ফিরে যান",
    footerNote: "© ২০২৫ চালাক চ্যাম্পস। সর্বস্বত্ব সংরক্ষিত।",
  },
};

// ============================================================
// HOOKS
// ============================================================

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function useCountdown(targetDate: number): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isExpired: false,
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

// ============================================================
// COMPONENTS
// ============================================================

function CountdownCard({
  value,
  label,
  isExpired,
}: {
  value: number;
  label: string;
  isExpired: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center
                    w-[80px] h-[90px] md:w-[110px] md:h-[120px]
                    rounded-2xl border-2 transition-all duration-500
                    ${
                      isExpired
                        ? "border-green-300 bg-green-50/50"
                        : "border-[#FF8FCA]/50 bg-white/80 backdrop-blur-sm"
                    }`}
    >
      {/* Corner dots — matching your dashed-box pattern */}
      <span className="absolute -top-1 -left-1 w-2 h-2 bg-[#F3066E] rounded-full" />
      <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#F3066E] rounded-full" />
      <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#F3066E] rounded-full" />
      <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#F3066E] rounded-full" />

      {/* Value */}
      <span
        className={`text-3xl md:text-5xl font-bold tabular-nums
                         ${isExpired ? "text-green-600" : "text-[#00477C]"}`}
      >
        {String(value).padStart(2, "0")}
      </span>

      {/* Label */}
      <span className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">
        {label}
      </span>
    </div>
  );
}

function FloatingShape({
  className,
  delay = "0s",
  duration = "6s",
}: {
  className: string;
  delay?: string;
  duration?: string;
}) {
  return (
    <div
      className={`absolute rounded-full opacity-[0.07] pointer-events-none ${className}`}
      style={{
        animation: `float ${duration} ease-in-out ${delay} infinite`,
      }}
    />
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function ComingSoonPage() {
  const { currentLang, getLink } = useLanguage();
  const lang = currentLang || "en";
  const t = TEXTS[lang] ?? TEXTS.en;

  const countdown = useCountdown(LAUNCH_DATE);

  // --- Email state ---
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState(false);

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setEmailStatus("success");
    setIsLoading(false);
    setEmail("");
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#f8faff] via-white to-[#fff5f9]">
      {/* ---------- BACKGROUND DECORATIONS ---------- */}
      <FloatingShape
        className="w-[300px] h-[300px] bg-[#00477C] top-[-80px] left-[-100px]"
        duration="8s"
        delay="0s"
      />
      <FloatingShape
        className="w-[200px] h-[200px] bg-[#F3066E] bottom-[-60px] right-[-60px]"
        duration="7s"
        delay="1s"
      />
      <FloatingShape
        className="w-[120px] h-[120px] bg-[#FF8FCA] top-[20%] right-[10%]"
        duration="9s"
        delay="2s"
      />
      <FloatingShape
        className="w-[80px] h-[80px] bg-[#00477C] bottom-[25%] left-[8%]"
        duration="6s"
        delay="0.5s"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#00477C 1px, transparent 1px), linear-gradient(90deg, #00477C 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ---------- CONTENT ---------- */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-12 text-center">
        {/* Brand / Logo */}
        <Link
          href={getLink("/")}
          className="inline-flex items-center gap-2 mb-10 group"
        >
          <div className="relative">
            <Image
              src="/logo.png"
              alt={t.brand}
              width={44}
              height={44}
              className="w-11 h-11"
            />
            {/* Pulse ring on hover */}
            <span className="absolute inset-0 rounded-full border-2 border-[#F3066E] opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110" />
          </div>
          <span className="text-xl font-bold text-[#00477C] tracking-[-2%]">
            {t.brand}
          </span>
        </Link>

        {/* ---------- TITLE ---------- */}
        <div className="mb-4">
          <p className="text-xl md:text-2xl text-gray-500 tracking-[-1%] leading-8 mb-2">
            {t.titleLine1}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#00477C] tracking-[-3%] md:tracking-[-4px] leading-tight md:leading-tight">
            {/* Highlighted word with dashed box */}
            <span className="relative inline-block">
              <span className="text-[#F3066E]">{t.titleHighlight}</span>
              <span
                className="absolute -inset-x-3 -inset-y-1.5 border-2 border-dashed border-[#F3066E] rounded-xl pointer-events-none -z-10"
              />
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#F3066E] rounded-full" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F3066E] rounded-full" />
              <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#F3066E] rounded-full" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#F3066E] rounded-full" />
            </span>
            <br />
            <span>{t.titleLine2}</span>
          </h1>
        </div>

        {/* ---------- SUBTITLE ---------- */}
        <p className="text-gray-500 text-base md:text-lg leading-6 md:leading-7 max-w-md mx-auto mb-12 tracking-[-1%]">
          {t.subtitle}
        </p>

        {/* ---------- COUNTDOWN ---------- */}
        <div className="flex items-center justify-center gap-3 md:gap-5 mb-12">
          <CountdownCard value={countdown.days} label={t.days} isExpired={countdown.isExpired} />
          
          {/* Separator */}
          <span className="text-2xl md:text-3xl font-bold text-[#FF8FCA] mb-4 select-none">:</span>
          
          <CountdownCard value={countdown.hours} label={t.hours} isExpired={countdown.isExpired} />
          
          <span className="text-2xl md:text-3xl font-bold text-[#FF8FCA] mb-4 select-none">:</span>
          
          <CountdownCard value={countdown.minutes} label={t.minutes} isExpired={countdown.isExpired} />
          
          <span className="text-2xl md:text-3xl font-bold text-[#FF8FCA] mb-4 select-none">:</span>
          
          <CountdownCard value={countdown.seconds} label={t.seconds} isExpired={countdown.isExpired} />
        </div>

        {/* ---------- EXPIRED MESSAGE ---------- */}
        {countdown.isExpired && (
          <div className="mb-10 animate-fade-in">
            <p className="text-2xl font-bold text-green-600 mb-2">🎉 We&apos;re Live!</p>
            <Link
              href={getLink("/")}
              className="inline-block text-[#F3066E] font-bold underline underline-offset-4 hover:text-[#00477C] transition-colors"
            >
              Go to Homepage →
            </Link>
          </div>
        )}

        {/* ---------- EMAIL NOTIFY ---------- */}
        {!countdown.isExpired && (
          <div className="max-w-md mx-auto mb-14">
            {emailStatus === "success" ? (
              <div className="animate-fade-in bg-green-50 border border-green-200 rounded-2xl px-6 py-5">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-700 font-medium text-sm">{t.notifySuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleNotify} className="relative">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailStatus === "error") setEmailStatus("idle");
                    }}
                    placeholder={t.emailPlaceholder}
                    className="flex-1 px-5 py-3.5 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm
                               text-sm text-gray-800 placeholder-gray-400
                               focus:ring-2 focus:ring-[#F3066E]/30 focus:border-[#F3066E] outline-none
                               transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative overflow-hidden px-7 py-3.5 rounded-xl bg-[#F3066E] text-white
                               text-sm font-bold tracking-[-1%]
                               hover:shadow-[0_0_20px_rgba(243,6,110,0.35)]
                               active:scale-[0.97] transition-all
                               disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {/* Shimmer */}
                    <span
                      className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/30 to-transparent"
                      style={{
                        transform: "translateX(-100%)",
                        animation: "shimmer 2.5s infinite ease-in-out",
                      }}
                    />
                    <span className="relative">
                      {isLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        t.notifyBtn
                      )}
                    </span>
                  </button>
                </div>
                {emailStatus === "error" && (
                  <p className="text-red-500 text-xs mt-2 text-left pl-1">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            )}
          </div>
        )}

        {/* ---------- SOCIAL LINKS ---------- */}
        <div className="flex items-center justify-center gap-4 mb-14">
          {/* Facebook */}
          <a
            href="#"
            aria-label="Facebook"
            className="w-10 h-10 rounded-full border border-gray-200 bg-white/60 backdrop-blur-sm
                       flex items-center justify-center text-gray-400
                       hover:text-[#F3066E] hover:border-[#F3066E] hover:shadow-[0_0_12px_rgba(243,6,110,0.15)]
                       transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="#"
            aria-label="YouTube"
            className="w-10 h-10 rounded-full border border-gray-200 bg-white/60 backdrop-blur-sm
                       flex items-center justify-center text-gray-400
                       hover:text-[#F3066E] hover:border-[#F3066E] hover:shadow-[0_0_12px_rgba(243,6,110,0.15)]
                       transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 12.587 0 12 0 12s0 10.413.502 17.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 14.413 24 12 24 12s0-2.413-.502-6.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="#"
            aria-label="Instagram"
            className="w-10 h-10 rounded-full border border-gray-200 bg-white/60 backdrop-blur-sm
                       flex items-center justify-center text-gray-400
                       hover:text-[#F3066E] hover:border-[#F3066E] hover:shadow-[0_0_12px_rgba(243,6,110,0.15)]
                       transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="#"
            aria-label="LinkedIn"
            className="w-10 h-10 rounded-full border border-gray-200 bg-white/60 backdrop-blur-sm
                       flex items-center justify-center text-gray-400
                       hover:text-[#F3066E] hover:border-[#F3066E] hover:shadow-[0_0_12px_rgba(243,6,110,0.15)]
                       transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-1.846 1.009-1.846 2.207v3.11h-3.554v-8.713h3.554v1.396c.474-.746 1.622-1.544 3.338-1.544 1.71 0 3.006.879 3.006 2.716v5.845h-3.554v-5.569c0-.892-.018-2.042-1.06-2.042-1.018 0-1.473.871-1.473 2.014v4.597h-3.554zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 012.063 2.065zm1.782 13.019H3.555V7.433h3.564v13.019zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>

        {/* ---------- BACK TO HOME ---------- */}
        <Link
          href={getLink("/")}
          className="inline-block text-sm text-gray-400 hover:text-[#00477C] font-medium transition-colors tracking-[-1%]"
        >
          {t.backHome}
        </Link>
      </div>

      {/* ---------- FOOTER ---------- */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-xs text-gray-400">{t.footerNote}</p>
      </div>

      {/* ---------- KEYFRAMES ---------- */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes shimmer {
              0%        { transform: translateX(-100%) skewX(-45deg); }
              40%, 100% { transform: translateX(150%)  skewX(-45deg); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px) scale(1); }
              50%      { transform: translateY(-20px) scale(1.05); }
            }
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(10px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fade-in 0.4s ease-out;
            }
          `,
        }}
      />
    </div>
  );
}