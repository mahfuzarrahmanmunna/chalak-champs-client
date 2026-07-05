"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Rocket, Home, Send, CheckCircle } from "lucide-react";

interface ComingSoonProps {
  pageTitle?: string; // Optional: To show which page is coming soon
  targetDate?: Date; // Optional: To set a specific launch date
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  pageTitle = "এই পেজটি",
  targetDate,
}) => {
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
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
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
    { label: "দিন", value: timeLeft.days },
    { label: "ঘণ্টা", value: timeLeft.hours },
    { label: "মিনিট", value: timeLeft.minutes },
    { label: "সেকেন্ড", value: timeLeft.seconds },
  ];

  return (
    <div className="min-h-screen lex items-center justify-center relative overflow-hidden px-4 py-16">

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Rocket Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl border border-gray-100 mb-8 animate-bounce">
          <Rocket className="w-10 h-10 text-[#F3056D]" strokeWidth={2.5} />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#214187] leading-tight tracking-tight mb-4">
          {pageTitle} <span className="text-[#F3056D]">শীঘ্রই আসছে!</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-500 mb-12 leading-relaxed max-w-lg mx-auto">
          আমরা আপনার জন্য একটি চমৎকার অভিজ্ঞতা তৈরি করছি। লঞ্চ হওয়ার সঠিক সময়
          জানতে নিচের কাউন্টডাউনটি দেখুন।
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

        {/* Email Notification Form */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            আপডেট পেতে নোটিফিকেশন নিন
          </h3>
          <p className="text-sm text-gray-500 mb-5">
            লঞ্চ হওয়ার সাথে সাথেই আপনাকে জানানো হবে।
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-2 text-green-600 font-semibold animate-in fade-in zoom-in-95 duration-300 py-3">
              <CheckCircle className="w-5 h-5" />
              ধন্যবাদ! আপনাকে নোটিফিকেশন পাঠানো হবে।
            </div>
          ) : (
            <form
              onSubmit={handleNotifySubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল অ্যাড্রেস লিখুন"
                className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3056D] focus:border-transparent text-gray-700 placeholder:text-gray-400 transition-shadow"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#F3056D] hover:bg-[#d9045f] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                নোটিফাই করুন
              </button>
            </form>
          )}
        </div>

        {/* Back to Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#214187] font-semibold text-lg hover:text-[#F3056D] transition-colors group"
        >
          <Home className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          হোমপেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
