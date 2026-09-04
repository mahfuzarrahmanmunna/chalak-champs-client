// src/app/[lang]/privacy-policy/PrivacyContent.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Lock,
  FileText,
  UserCircle,
  GraduationCap,
  MonitorSmartphone,
  KeyRound,
  Database,
  Eye,
  ChevronDown,
  ArrowRight,
  Clock,
  Check,
} from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import Button from "@/app/ui/button/Button";

// Map string names from JSON to Lucide Icons
const iconMap: Record<string, React.ComponentType<any>> = {
  ShieldCheck,
  Lock,
  FileText,
  UserCircle,
  GraduationCap,
  MonitorSmartphone,
  KeyRound,
  Database,
  Eye,
};

export default function PrivacyContent() {
  const { privacyData: t, isBangla, getLink } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>("introduction");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Performant Scroll Spy using IntersectionObserver
  useEffect(() => {
    if (!t?.sections) return;

    const options = {
      rootMargin: "-20% 0px -70% 0px", // Triggers when section is near the top
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    // Observe all sections
    t.sections.forEach((sec) => {
      const elem = document.getElementById(sec.id);
      if (elem && observerRef.current) observerRef.current.observe(elem);
    });

    // Also observe security section
    const securityElem = document.getElementById("security");
    if (securityElem && observerRef.current)
      observerRef.current.observe(securityElem);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [t, isBangla]);

  const handleTocClick = (id: string) => {
    setMobileTocOpen(false);
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky headers if any (though this layout doesn't use a sticky global header here)
      const y = element.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (!t)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-400 font-sans">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 relative overflow-hidden">
      {/* Subtle Background Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF8FCA]/5 blur-[150px] rounded-full"></div>
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#214187]/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#F3056D]/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10">
        {/* --- HERO SECTION --- */}
        <section className="pt-28 pb-20 md:pt-36 md:pb-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 bg-[#F3056D]/5 border border-[#F3056D]/10 transition-all duration-500 hover:bg-[#F3056D]/10">
              <ShieldCheck className="h-4 w-4 text-[#F3056D]" />
              <span className="text-xs font-bold tracking-wider uppercase text-[#F3056D]">
                {t.hero.eyebrow}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#214187] tracking-tight mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-7 mb-8">
              {t.hero.description}
            </p>

            {/* Last Updated Badge */}
            <div className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm">
              <Clock className="h-4 w-4 text-[#F3056D]" />
              <span className="text-gray-600">{t.hero.lastUpdated}</span>
            </div>
          </div>
        </section>

        {/* --- TRUST STRIP --- */}
        <section className="py-12 border-y border-gray-100 bg-gray-50/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-around gap-8 sm:gap-4">
              {t.trustBar.items.map((item, i) => {
                const Icon = iconMap[item.icon] || Lock;
                return (
                  <React.Fragment key={i}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#214187] shadow-sm flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-gray-700 text-sm md:text-base">
                        {item.text}
                      </span>
                    </div>
                    {/* Vertical Separator */}
                    {i < t.trustBar.items.length - 1 && (
                      <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </section>

        {/* --- DATA COLLECTION SECTION --- */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 md:mb-16 max-w-2xl">
              <div className="w-12 h-1 bg-[#F3056D] rounded-full mb-4"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#214187] mb-4">
                {t.dataCollection.title}
              </h2>
              <p className="text-base text-gray-500 leading-7">
                {t.dataCollection.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {t.dataCollection.cards.map((card, i) => {
                const Icon = iconMap[card.icon] || FileText;
                const isPink = i % 2 === 0;
                const accentBg = isPink ? "bg-[#F3056D]" : "bg-[#214187]";
                const hoverGlow = isPink
                  ? "hover:shadow-[#F3056D]/10"
                  : "hover:shadow-[#214187]/10";

                return (
                  <div
                    key={i}
                    className={`group bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${hoverGlow}`}
                  >
                    <div
                      className={`w-12 h-12 ${accentBg} rounded-xl flex items-center justify-center text-white mb-6 transition-transform group-hover:scale-110`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#214187] mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-7">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* --- MAIN PRIVACY LAYOUT --- */}
        <section className="py-16 md:py-24 bg-gray-50/50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-12 lg:gap-16">
            {/* LEFT: TABLE OF CONTENTS */}
            <aside className="lg:block">
              {/* Desktop TOC */}
              <div className="hidden lg:block sticky top-24">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                  {t.toc.title}
                </h3>
                <ul className="space-y-1">
                  {t.toc.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleTocClick(item.id)}
                        className={`w-full text-left text-sm py-2 px-4 transition-all duration-200 border-l-2 ${
                          activeSection === item.id
                            ? "border-[#F3056D] bg-[#F3056D]/5 text-[#F3056D] font-semibold"
                            : "border-transparent text-gray-500 hover:text-[#214187] hover:bg-gray-100/50"
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile TOC */}
              <div className="lg:hidden mb-8">
                <button
                  onClick={() => setMobileTocOpen(!mobileTocOpen)}
                  className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm"
                >
                  <span className="font-bold text-sm text-[#214187]">
                    {t.toc.title}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${mobileTocOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileTocOpen && (
                  <div className="mt-2 p-2 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <ul className="space-y-1">
                      {t.toc.items.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => handleTocClick(item.id)}
                            className={`w-full text-left text-sm py-2 px-4 rounded-lg transition-colors ${
                              activeSection === item.id
                                ? "bg-[#F3056D]/5 text-[#F3056D] font-semibold"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>

            {/* RIGHT: PRIVACY CONTENT SECTIONS */}
            <div className="space-y-12 md:space-y-16">
              {t.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#F3056D]/10 text-[#F3056D] rounded-xl flex items-center justify-center font-bold text-sm">
                      {section.number}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#214187]">
                      {section.title}
                    </h2>
                  </div>

                  <div className="pl-2 md:pl-14 space-y-4 max-w-3xl">
                    <p className="text-[15px] md:text-base text-gray-600 leading-7">
                      {section.content}
                    </p>

                    {section.items && section.items.length > 0 && (
                      <ul className="mt-6 space-y-3 pt-4 border-t border-gray-100">
                        {section.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-[15px] text-gray-600 leading-7"
                          >
                            <Check className="w-4 h-4 text-[#F3056D] mt-1 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}

              {/* --- SECURITY SECTION --- */}
              <section
                id="security"
                className="relative bg-[#214187] rounded-3xl py-12 md:py-16 px-6 md:px-12 overflow-hidden shadow-lg scroll-mt-24"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#F3056D] blur-[120px] opacity-30 rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400 blur-[100px] opacity-20 rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                      <Lock className="w-6 h-6 text-[#F3056D]" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                      {t.security.title}
                    </h2>
                  </div>

                  <p className="text-sm md:text-base text-blue-100/80 mb-8 max-w-2xl leading-7 pl-2 md:pl-14">
                    {t.security.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pl-2 md:pl-14">
                    {t.security.items.map((item, i) => {
                      const Icon = iconMap[item.icon] || ShieldCheck;
                      return (
                        <div
                          key={i}
                          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10"
                        >
                          <Icon className="w-5 h-5 text-[#F3056D] mb-2" />
                          <h4 className="text-sm font-semibold text-white">
                            {item.title}
                          </h4>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* --- CONTACT CTA --- */}
        <section className="py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-white rounded-3xl p-8 md:p-12 text-center shadow-sm border border-[#F3056D]/10 overflow-hidden">
              {/* Subtle Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F3056D]/5 to-[#214187]/5 pointer-events-none"></div>

              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-[#214187] mb-4">
                  {t.contact.title}
                </h3>
                <p className="text-base text-gray-500 max-w-xl mx-auto mb-8 leading-7">
                  {t.contact.description}
                </p>

                <Button
                  bgColor="#F3056D"
                  highlightColor="#FF8FCA"
                  darkShadowColor="#C6005F"
                  textColor="white"
                  hoverTextColor="#F3056D"
                  textSize="lg"
                  px="px-10"
                  py="py-4"
                  onClick={() => (window.location.href = getLink("/contact"))}
                  className="transition-transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-center">
                    <span>{t.contact.button}</span>
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
