"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Palette,
  Languages,
  Clock,
  Video,
  Calendar as CalendarIcon,
  Gift,
  Info,
  Loader2,
  PhoneCall,
} from "lucide-react";
import Button from "@/app/ui/button/Button";
import EyeIcon from "./EyeIcon";
import { useLanguage } from "@/app/context/LanguageContext";
import { FaPhone } from "react-icons/fa6";

const ChalakCourses = () => {
  // 1. Get data from context
  const { coursesData } = useLanguage();

  const defaultTabIndex =
    coursesData.tabs?.findIndex(
      (tab) => tab === "কিডস ইংলিশ" || tab === "Kids English",
    ) ?? 0;

  // 3. State for active tab (Index based) - now defaults to "কিডস ইংলিশ"
  const [activeTabIndex, setActiveTabIndex] = useState(defaultTabIndex);

  // Ref for the slider container
  const sliderRef = useRef<HTMLDivElement>(null);

  // State to check if scrolling is needed (to show/hide arrows)
  const [showArrows, setShowArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const activeTab = coursesData.tabs?.[activeTabIndex] || "";

  // 4. Icon Map: Mapping specific tab names to Lucide icons
  const iconMap: Record<string, React.ReactNode> = {
    // Bangla -> Icon
    "জনপ্রিয় কোর্স": <BookOpen size={18} />,
    "কিডস ইংলিশ": <Languages size={18} />,
    "স্কুল প্রোগ্রাম": <GraduationCap size={18} />,
    "কিডস স্কিলস": <Palette size={18} />,

    // English -> Icon
    "Popular Courses": <BookOpen size={18} />,
    "Kids English": <Languages size={18} />,
    "School Program": <GraduationCap size={18} />,
    "Kids Skills": <Palette size={18} />,
  };

  // --- Helper to get Icon and Color for Badges ---
  const getBadgeStyle = (text: string) => {
    const lowerText = text.toLowerCase();

    if (
      lowerText.includes("live") ||
      lowerText.includes("লাইভ") ||
      lowerText.includes("recorded") ||
      lowerText.includes("রেকর্ডড")
    ) {
      return {
        icon: <Video size={12} />,
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-200",
      };
    }

    if (
      lowerText.includes("month") ||
      lowerText.includes("মাস") ||
      lowerText.includes("week") ||
      lowerText.includes("সপ্তাহ")
    ) {
      return {
        icon: <CalendarIcon size={12} />,
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
      };
    }

    if (lowerText.includes("free") || lowerText.includes("ফ্রি")) {
      return {
        icon: <Gift size={12} />,
        bg: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
      };
    }

    if (lowerText.includes("limited") || lowerText.includes("সীমিত")) {
      return {
        icon: <Info size={12} />,
        bg: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-200",
      };
    }

    return {
      icon: <Loader2 size={12} />,
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-200",
    };
  };

  // Filter courses based on active tab
  const filteredCourses = coursesData.courses.filter(
    (course) => course.category === activeTab,
  );

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
  }, [filteredCourses]);

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

  return (
    <section className="container mx-auto border-2 border-[#FF8FCA] bg-[#D81B60] p-6 md:p-12 rounded-[80px] relative overflow-hidden">
      {/* --- Header Section --- */}
      <div className="text-center mb-8">
        <h2 className="text-white text-2xl md:text-5xl font-bold tracking-[0%] flex items-center justify-center gap-2">
          {coursesData.titlePrefix}
          <div className="relative inline-block px-6 py-3 bg-[#D81B60]">
            <div className="absolute inset-0 border-2 border-dashed border-white m-1"></div>
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white"></div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white"></div>
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white"></div>
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white"></div>
            <h2 className="relative tracking-wide">
              {coursesData.titleSuffix}
            </h2>
          </div>
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
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="min-w-[300px] w-[300px] md:min-w-[400px] md:w-[340px] snap-center bg-white rounded-[30px] border-2 border-[#FF8FCA] p-2 pb-5 shadow-xl flex flex-col items-center hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-full aspect-video rounded-[25px] overflow-hidden relative mb-4">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover object-bottom rounded-lg"
                  />
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-3 w-full px-2">
                  {course.highlights.map((tag, tagIdx) => {
                    const style = getBadgeStyle(tag);
                    return (
                      <span
                        key={tagIdx}
                        className={`flex items-center gap-1 ${style.bg} ${style.text} text-[14px] px-3 leading-6 rounded-full border ${style.border}`}
                      >
                        {style.icon}
                        {tag}
                      </span>
                    );
                  })}
                </div>

                <h3 className="text-[#3C4043] tracking-[0%] leading-[140%] font-semibold text-2xl mb-4 text-center px-2 line-clamp-2">
                  {course.title}
                </h3>

                <Button
                  bgColor="#F3056D"
                  highlightColor="#FF8FCA"
                  darkShadowColor="#F3066E"
                  textColor="white"
                  hoverTextColor="#F3056D"
                  textSize="24px"
                  icon={<EyeIcon />}
                  iconPosition="right"
                  className="justify-center"
                >
                  {coursesData.ctaCard}
                </Button>
              </div>
            ))
          ) : (
            <div className="flex min-w-[300px] w-[300px] md:min-w-[340px] md:w-[340px] justify-center w-full min-w-full">
              <div className="bg-white rounded-[30px] border-2 border-[#FF8FCA] p-10 md:p-16 shadow-xl flex flex-col items-center justify-center min-h-[400px] w-full max-w-2xl text-center">
                <div className="bg-pink-50 rounded-full p-6 mb-6 border-2 border-dashed border-pink-300">
                  <Clock size={64} className="text-[#D81B60]" />
                </div>
                <h3 className="text-[#D81B60] tracking-[0%] leading-[140%] font-bold text-3xl md:text-4xl mb-2">
                  শীঘ্রই আসছে
                </h3>
                <p className="text-gray-600 text-lg">Coming Soon</p>
                <p className="text-gray-500 mt-4 text-sm max-w-md mx-auto">
                  আমরা এই বিভাগে নতুন এবং উন্নত কোর্স নিয়ে আসছি। আপডেট পেতে চোখ
                  রাখুন!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Footer Button --- */}
      <div className="flex flex-col items-center mt-12 gap-4">
        <Button bgColor="#003B73" textColor="#FFFFFF">
          {coursesData.ctaFooter}
        </Button>

        <p className="text-white/80 flex items-center gap-3 text-base text-center">
          <FaPhone /> {renderFooterNote()}
        </p>
      </div>
    </section>
  );
};

export default ChalakCourses;
