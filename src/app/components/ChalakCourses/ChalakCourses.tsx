"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Palette,
  Languages,
  Clock,
} from "lucide-react";
import Button from "@/app/ui/button/Button";
import { useLanguage } from "@/app/context/LanguageContext";
import { FaBell, FaPhone } from "react-icons/fa6";
import Link from "next/link";
import ChalakCourseCard from "./ChalakCourseCard";

const ChalakCourses = () => {
  // 1. Get data from context
  const { coursesData } = useLanguage();
  const context = useLanguage();

  // Fallback values in case context is undefined
  const t = context?.t || {};
  const isBangla = context?.isBangla || false;

  const defaultTabIndex =
    coursesData.tabs?.findIndex(
      (tab) => tab === "কিডস ইংলিশ" || tab === "Kids English",
    ) ?? 0;

  // 3. State for active tab (Index based)
  const [activeTabIndex, setActiveTabIndex] = useState(defaultTabIndex);

  // Ref for the slider container
  const sliderRef = useRef<HTMLDivElement>(null);

  // State to check if scrolling is needed (to show/hide arrows)
  const [showArrows, setShowArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const activeTab = coursesData.tabs?.[activeTabIndex] || "";

  // 4. Icon Map
  const iconMap: Record<string, React.ReactNode> = {
    "জনপ্রিয় কোর্স": <BookOpen size={18} />,
    "কিডস ইংলিশ": <Languages size={18} />,
    "স্কুল প্রোগ্রাম": <GraduationCap size={18} />,
    "কিডস স্কিলস": <Palette size={18} />,
    "Popular Courses": <BookOpen size={18} />,
    "Kids English": <Languages size={18} />,
    "School Program": <GraduationCap size={18} />,
    "Kids Skills": <Palette size={18} />,
  };

  // Filter courses based on active tab
  const filteredCourses = coursesData.courses.filter(
    (course) => course.category === activeTab,
  );

  // --- NEW LOGIC: Force Coming Soon for School Program ---
  const isSchoolProgramTab =
    activeTab === "School Program" || activeTab === "স্কুল প্রোগ্রাম";

  // Show Coming Soon if it IS School Program OR if there are genuinely no courses
  const shouldShowComingSoonCard =
    isSchoolProgramTab || filteredCourses.length === 0;

  // --- Slider Logic ---
  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      setShowArrows(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [filteredCourses, activeTab]); // Added activeTab dependency

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 320;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Helper function to render phone number link
  const renderFooterNote = () => {
    if (!coursesData.footerNote) return null;
    const parts = coursesData.footerNote.split("+88");
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}
          <a
            href="tel:+8801740176774"
            className="font-bold underline hover:text-white transition-colors"
          >
            +88{parts[1]}
          </a>
        </>
      );
    }
    return coursesData.footerNote;
  };

  // --- Bilingual Text for Coming Soon Card ---
  const comingSoonText = {
    title: isBangla ? "শীঘ্রই আসছে" : "Coming Soon",
    subtitle: "Coming Soon", // Kept as English in design, or change to isBangla ? "শীঘ্রই আসছে" : "Coming Soon"
    description: isBangla
      ? "আমরা এই বিভাগে নতুন এবং উন্নত কোর্স নিয়ে আসছি। আপডেট পেতে চোখ রাখুন!"
      : "We are bringing new and improved courses to this section. Keep an eye out for updates!",
  };

  return (
    <section className="container mx-auto border-2 border-[#FF8FCA] bg-[#D81B60] p-6 md:p-12 rounded-4xl md:rounded-[80px] relative overflow-hidden">
      {/* --- Header Section --- */}
      <div className="text-center mb-8">
        <h2 className="text-white text-xl md:text-5xl font-bold tracking-[0%] flex items-center justify-center gap-2">
          {coursesData.titlePrefix}
          <span className="relative inline-block px-3 md:py-3 py-1 group">
            {/* Dashed Border */}
            <span className="absolute inset-0 border-2 md:border-[3px] border-dashed border-white"></span>

            {/* Corner Dots */}
            <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-white"></span>
            <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-white"></span>
            <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-white"></span>
            <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-white"></span>

            <span className="text-white ">{coursesData.titleSuffix}</span>
          </span>
        </h2>
        <p className="text-white/90 text-lg mt-4">
          {coursesData.shortDescription}
        </p>
      </div>

      {/* --- Categories / Tab Section --- */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {coursesData.tabs?.map((tabName, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTabIndex(idx)}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition-all ${
              idx === activeTabIndex
                ? "bg-[#003B73] text-white border-2 border-pink-400 shadow-lg transform scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100 hover:scale-105"
            }`}
          >
            <span
              className={
                idx === activeTabIndex ? "text-pink-400" : "text-blue-900"
              }
            >
              {iconMap[tabName] || <BookOpen size={18} />}
            </span>
            {tabName}
          </button>
        ))}
      </div>

      {/* --- Slider Section --- */}
      <div className="relative max-w-6xl mx-auto px-4 md:px-10">
        {showArrows && (
          <>
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-20 text-pink-600 hover:bg-pink-50 transition-all duration-300 ${!canScrollLeft ? "opacity-30 cursor-not-allowed" : "opacity-100"}`}
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-20 text-pink-600 hover:bg-pink-50 transition-all duration-300 ${!canScrollRight ? "opacity-30 cursor-not-allowed" : "opacity-100"}`}
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}

        <div
          ref={sliderRef}
          onScroll={checkScroll}
          className="flex gap-6 snap-x snap-mandatory justify-center pb-8 scroll-smooth no-scrollbar"
        >
          {/* --- RENDER LOGIC --- */}
          {shouldShowComingSoonCard ? (
            // --- COMING SOON CARD ---
            <div className="flex min-w-[300px] w-[300px] md:min-w-[340px] md:w-[340px] justify-center w-full min-w-full">
              <div className="bg-white rounded-[30px] border-2 border-[#FF8FCA] p-10 md:p-16 shadow-xl flex flex-col items-center justify-center min-h-[400px] w-full max-w-2xl text-center">
                <div className="bg-pink-50 rounded-full p-6 mb-6 border-2 border-dashed border-pink-300">
                  <Clock size={64} className="text-[#D81B60]" />
                </div>
                <h3 className="text-[#D81B60] tracking-[0%] leading-[140%] font-bold text-3xl md:text-4xl mb-2">
                  {comingSoonText.title}
                </h3>
                <p className="text-gray-600 text-lg">
                  {comingSoonText.subtitle}
                </p>
                <p className="text-gray-500 mt-4 text-sm max-w-md mx-auto">
                  {comingSoonText.description}
                </p>
              </div>
            </div>
          ) : (
            // --- COURSES LIST ---
            filteredCourses.map((course) => (
              <ChalakCourseCard
                key={course.id}
                course={course}
                ctaCardLabel={coursesData.ctaCard}
              />
            ))
          )}
        </div>
      </div>

      {/* --- Footer Button --- */}
      <div className="flex flex-col items-center mt-12 gap-4">
        <Link href={`/${isBangla ? "bn/courses" : "en/courses"}`}>
          <Button bgColor="#003B73" textColor="#FFFFFF">
            {coursesData.ctaFooter}
          </Button>
        </Link>

        <p className="text-white/80 md:flex items-center md:gap-3 text-sm  text-center">
          <FaBell className="hidden md:flex" /> {renderFooterNote()}
        </p>
      </div>
    </section>
  );
};

export default ChalakCourses;
