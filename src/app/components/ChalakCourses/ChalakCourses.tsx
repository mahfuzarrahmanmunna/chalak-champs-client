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
import { FaBell } from "react-icons/fa6";
import Link from "next/link";
import ChalakCourseCard from "./ChalakCourseCard";
import { usePublicCourses } from "@/app/hooks/usePublicCourses";

const ChalakCourses = () => {
  const { coursesData } = useLanguage();
  const context = useLanguage();

  const t = context?.t || {};
  const isBangla = context?.isBangla || false;

  const defaultTabIndex =
    coursesData.tabs?.findIndex(
      (tab) => tab === "কিডস ইংলিশ" || tab === "Kids English",
    ) ?? 0;

  const [activeTabIndex, setActiveTabIndex] = useState(defaultTabIndex);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [sliderPadding, setSliderPadding] = useState(0);

  const activeTab = coursesData.tabs?.[activeTabIndex] || "";

  const { data: apiCourses = [], isLoading: isCoursesLoading } =
    usePublicCourses();

  const dbCourses = apiCourses.map((course: any) => ({
    id: course._id,
    _id: course._id,
    slug: course.slug,
    title: course.title,
    thumbnail: course.thumbnail,
    category: course.category,
    price: course.price,
    originalPrice: course.originalPrice,
    content: course.content,
  }));

  const categoryMap: Record<string, string | null> = {
    "জনপ্রিয় কোর্স": null,
    "Popular Courses": null,
    "কিডস ইংলিশ": "spoken-english",
    "Kids English": "spoken-english",
    "স্কুল প্রোগ্রাম": "school-program",
    "School Program": "school-program",
    "কিডস স্কিলস": "art",
    "Kids Skills": "art",
  };

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

  const targetCategory = categoryMap[activeTab];
  const filteredCourses =
    targetCategory === null
      ? dbCourses
      : dbCourses.filter((course) => course.category === targetCategory);

  const isSchoolProgramTab =
    activeTab === "School Program" || activeTab === "স্কুল প্রোগ্রাম";

  const shouldShowComingSoonCard =
    isSchoolProgramTab || filteredCourses.length === 0;

  // --- Calculate padding to center cards perfectly ---
  useEffect(() => {
    const updatePadding = () => {
      if (sliderRef.current && !isCoursesLoading && !shouldShowComingSoonCard) {
        const containerWidth = sliderRef.current.clientWidth;
        const isMobile = window.innerWidth < 768;
        const cardWidth = isMobile ? 300 : 340;
        const gap = 24; // gap-6 is 1.5rem = 24px

        const totalCardsWidth =
          filteredCourses.length * cardWidth +
          (filteredCourses.length - 1) * gap;

        if (totalCardsWidth < containerWidth) {
          setSliderPadding((containerWidth - totalCardsWidth) / 2);
        } else {
          setSliderPadding(0);
        }
      } else {
        setSliderPadding(0);
      }
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, [filteredCourses, isCoursesLoading, shouldShowComingSoonCard]);

  // --- Slider Scroll Logic ---
  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
      setShowArrows(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [filteredCourses, sliderPadding]);

  // ✅ FIX: Keep smooth scrolling ONLY for button clicks, not for hand swipes
  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 320;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth", // Smooth is applied here via JS, not in CSS
      });
    }
  };

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

  const comingSoonText = {
    title: isBangla ? "শীঘ্রই আসছে" : "Coming Soon",
    subtitle: "Coming Soon",
    description: isBangla
      ? "আমরা এই বিভাগে নতুন এবং উন্নত কোর্স নিয়ে আসছি। আপডেট পেতে চোখ রাখুন!"
      : "We are bringing new and improved courses to this section. Keep an eye out for updates!",
  };

  const CardSkeleton = () => (
    <div className="min-w-[300px] w-[300px] md:min-w-[340px] md:w-[340px] snap-center bg-white rounded-[30px] border-2 border-[#FF8FCA] p-2 pb-5 shadow-xl flex flex-col items-center animate-pulse">
      <div className="w-full aspect-video rounded-[25px] bg-gray-200 mb-4" />
      <div className="flex gap-2 mb-3 w-full px-2">
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
        <div className="h-6 w-24 bg-gray-200 rounded-full" />
      </div>
      <div className="h-7 w-3/4 bg-gray-200 rounded mb-4" />
      <div className="h-10 w-40 bg-gray-200 rounded-xl mt-auto" />
    </div>
  );

  return (
    <section className="container mx-auto border-2 border-[#FF8FCA] bg-[#D81B60] p-6 md:p-12 rounded-4xl md:rounded-[80px] relative overflow-hidden">
      {/* --- Header Section --- */}
      <div className="text-center mb-8">
        <h2 className="text-white text-xl md:text-5xl font-bold tracking-[0%] flex items-center justify-center gap-2">
          {coursesData.titlePrefix}
          <span className="relative inline-block px-3 md:py-3 py-1 group">
            <span className="absolute inset-0 border-2 md:border-[3px] border-dashed border-white"></span>
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
          // ✅ CRITICAL FIX: Removed 'scroll-smooth' (breaks mobile swipe) & Added 'overflow-x-auto' (enables swipe)
          className="flex gap-6 snap-x snap-mandatory overflow-x-auto pb-8 no-scrollbar"
          style={{ paddingLeft: `${sliderPadding}px` }}
        >
          {isCoursesLoading ? (
            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          ) : shouldShowComingSoonCard ? (
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

        <p className="text-white/80 md:flex items-center md:gap-3 text-sm text-center">
          <FaBell className="hidden md:flex" /> {renderFooterNote()}
        </p>
      </div>
    </section>
  );
};

export default ChalakCourses;
