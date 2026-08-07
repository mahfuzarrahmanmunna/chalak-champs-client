"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Rocket, Home, Send, CheckCircle } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

interface ComingSoonProps {
  pageTitle?: string; // Optional: To show which page is coming soon
  targetDate?: Date; // Optional: To set a specific launch date
}

// Local translations for the ComingSoon component
const translations = {
  en: {
    comingSoon: "Coming Soon!",
    subtitle:
      "We are building an amazing experience for you. Check the countdown below for the exact launch time.",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    notifyTitle: "Get Notified for Updates",
    notifyDesc: "You will be notified as soon as we launch.",
    successMsg: "Thank you! You will be notified.",
    emailPlaceholder: "Enter your email address",
    notifyBtn: "Notify Me",
    backToHome: "Back to Homepage",
  },
  bn: {
    comingSoon: "শীঘ্রই আসছে!",
    subtitle:
      "আমরা আপনার জন্য একটি চমৎকার অভিজ্ঞতা তৈরি করছি। লঞ্চ হওয়ার সঠিক সময় জানতে নিচের কাউন্টডাউনটি দেখুন।",
    days: "দিন",
    hours: "ঘণ্টা",
    minutes: "মিনিট",
    seconds: "সেকেন্ড",
    notifyTitle: "আপডেট পেতে নোটিফিকেশন নিন",
    notifyDesc: "লঞ্চ হওয়ার সাথে সাথেই আপনাকে জানানো হবে।",
    successMsg: "ধন্যবাদ! আপনাকে নোটিফিকেশন পাঠানো হবে।",
    emailPlaceholder: "আপনার ইমেইল অ্যাড্রেস লিখুন",
    notifyBtn: "নোটিফাই করুন",
    backToHome: "হোমপেজে ফিরে যান",
  },
} as const;

const ComingSoon: React.FC<ComingSoonProps> = ({
  pageTitle,
  targetDate,
}) => {
  // Access language context
  const { isBangla, getLink } = useLanguage();

  // Get current translations
  const t = isBangla ? translations.bn : translations.en;

  // Set default target date to 30 days from now if not provided
  const defaultTargetDate = new Date();
  defaultTargetDate.setDate(defaultTargetDate.getDate() + 30);

  const target = targetDate || defaultTargetDate;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Add your email subscription API logic here
      console.log("Subscribed email:", email);
      setIsSubscribed(true);
      setEmail("");

      // Reset success message after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const timeUnits = [
    { label: t.days, value: timeLeft.days },
    { label: t.hours, value: timeLeft.hours },
    { label: t.minutes, value: timeLeft.minutes },
    { label: t.seconds, value: timeLeft.seconds },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-16"
      dir={isBangla ? "rtl" : "ltr"}
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-pink-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#214187]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F3056D]/5 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Rocket Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl border border-gray-100 mb-8 animate-bounce">
          <Rocket className="w-10 h-10 text-[#F3056D]" strokeWidth={2.5} />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#214187] leading-tight tracking-tight mb-4">
          {pageTitle && (
            <>
              {pageTitle}{" "}
            </>
          )}
          <span className="text-[#F3056D]">{t.comingSoon}</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-500 mb-12 leading-relaxed max-w-lg mx-auto">
          {t.subtitle}
        </p>

        {/* Countdown Timer */}
        <div className="flex justify-center gap-4 md:gap-6 mb-12">
          {timeUnits.map((unit, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-16 md:w-24 h-16 md:h-24 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center mb-2 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-[#F3056D]/30">
                <span className="text-2xl md:text-4xl font-bold text-[#214187] tabular-nums">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-wider">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        {/* Back to Home Button */}
        <Link
          href={getLink("/")}
          className="inline-flex items-center gap-2 text-[#214187] font-semibold text-lg hover:text-[#F3056D] transition-colors group"
        >
          <Home className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          {t.backToHome}
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;