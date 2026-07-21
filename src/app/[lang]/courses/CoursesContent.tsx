"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, BookOpen, Clock } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import ChalakCourseCard from "@/app/components/ChalakCourses/ChalakCourseCard";

// ✅ SKELETON COMPONENTS
const SkeletonPulse = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 relative overflow-hidden rounded-lg ${className}`}>
    <div className="absolute inset-0 skeleton-shimmer" />
  </div>
);

const CourseCardSkeleton = () => (
  <div className="w-full bg-white rounded-[30px] border-2 border-[#FF8FCA] p-2 pb-5 shadow-xl flex flex-col items-center">
    {/* Image */}
    <div className="w-full aspect-video rounded-[25px] overflow-hidden mb-4">
      <SkeletonPulse className="!rounded-[25px] w-full h-full" />
    </div>

    {/* Badges */}
    <div className="flex flex-wrap justify-center gap-2 mb-3 w-full px-2">
      {[...Array(3)].map((_, i) => (
        <SkeletonPulse key={i} className="h-6 w-20 !rounded-full" />
      ))}
    </div>

    {/* Title */}
    <div className="w-full px-2 mb-4 space-y-2">
      <SkeletonPulse className="h-7 w-full" />
      <SkeletonPulse className="h-7 w-3/4 mx-auto" />
    </div>

    {/* Price */}
    <div className="flex items-center gap-2 mb-4">
      <SkeletonPulse className="h-5 w-16 !rounded-md" />
      <SkeletonPulse className="h-6 w-14 !rounded-md" />
    </div>

    {/* Button */}
    <SkeletonPulse className="h-12 w-40 !rounded-xl" />
  </div>
);

const CoursesSkeletonGrid = () => (
  <div className="min-h-screen bg-gray-50 font-sans pb-20">
    {/* Hero Skeleton */}
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-center">
        {/* Subtitle */}
        <div className="w-32 mx-auto mb-4 md:mb-6">
          <SkeletonPulse className="h-5 md:h-6 w-full" />
        </div>

        {/* Main Title */}
        <div className="w-64 sm:w-80 md:w-[500px] mx-auto mb-4 md:mb-6">
          <SkeletonPulse className="h-9 md:h-12 w-full !rounded-xl" />
        </div>

        {/* Description */}
        <div className="max-w-2xl mx-auto mb-6 md:mb-8 space-y-3">
          <SkeletonPulse className="h-4 md:h-5 w-full" />
          <SkeletonPulse className="h-4 md:h-5 w-5/6 mx-auto" />
        </div>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto mb-6 md:mb-8">
          <SkeletonPulse className="h-12 md:h-14 w-full !rounded-xl" />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {[...Array(5)].map((_, i) => (
            <SkeletonPulse key={i} className="h-9 md:h-10 w-20 md:w-24 !rounded-full" />
          ))}
        </div>
      </div>
    </section>

    {/* Grid Skeleton */}
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <SkeletonPulse className="h-7 md:h-8 w-40 md:w-48" />
          <SkeletonPulse className="h-4 md:h-5 w-28 md:w-32 !rounded-md" />
        </div>

        {/* Cards - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[...Array(6)].map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>

    {/* Shimmer Animation */}
    <style jsx global>{`
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      .skeleton-shimmer::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.5) 50%,
          transparent 100%
        );
        animation: shimmer 1.5s ease-in-out infinite;
      }
    `}</style>
  </div>
);

// ✅ MAIN COMPONENT
export default function CoursesContent() {
  const { isBangla } = useLanguage();

  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://apichalakchamps.vercel.app"}/api/courses`
        );
        const data = await response.json();
        setCourses(data?.data || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const tabs = useMemo(() => {
    const categories = courses.map((c) => c.category).filter(Boolean);
    return [...new Set(categories)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        activeCategory === "all" || course.category === activeCategory;

      let matchesSearch = true;

      if (searchTerm.trim() !== "") {
        const searchTokens = searchTerm
          .toLowerCase()
          .split(/\s+/)
          .filter((token) => token.length > 0);

        const titleEn = (course.title?.en || "").toLowerCase();
        const titleBn = (course.title?.bn || "").toLowerCase();
        const courseCategory = (course.category || "").toLowerCase();
        const instructorName = (course.instructorName || "").toLowerCase();

        matchesSearch = searchTokens.some(
          (token) =>
            titleEn.includes(token) ||
            titleBn.includes(token) ||
            courseCategory.includes(token) ||
            instructorName.includes(token)
        );
      }

      return matchesCategory && matchesSearch;
    });
  }, [courses, searchTerm, activeCategory]);

  const uiText = {
    heroTitle: isBangla ? "আমাদের কোর্স" : "Our Courses",
    heroMain: isBangla
      ? "আপনার বাচ্চার ভবিষ্যত তৈরি করুন"
      : "Build Your Child's Future",
    heroDesc: isBangla
      ? "চালাক চ্যাম্পস (Chalak Champs)—যেখানে শেখা হয় আনন্দের সাথে! আমরা শুধু মুখস্থ বিদ্যা নয়, বরং আপনার বাচ্চার আগ্রহ, মেধা এবং আত্মবিশ্বাস বাড়াতে নিয়ে এসেছি বিশ্বমানের সব আধুনিক কোর্স।"
      : "Chalak Champs—Where learning is fun! We bring world-class modern courses not just to memorize, but to increase your child's interest, talent, and self-confidence.",
    searchPlaceholder: isBangla ? "কোর্স খুঁজুন..." : "Search for courses...",
    allFilter: isBangla ? "সব কোর্স" : "All Courses",
    popularTitle: isBangla ? "জনপ্রিয়ি কোর্স" : "Popular Courses",
    foundText: isBangla ? "মোট " : "Total ",
    foundSuffix: isBangla ? "টি কোর্স পাওয়া গেছে" : " courses found",
    noCourseTitle: isBangla ? "কোন কোর্স পাওয়া যায়নি" : "No courses found",
    noCourseDesc: isBangla
      ? "আপনার অনুসন্ধ কি ঠিক খুঁজছেন।"
      : "Please adjust your search filters.",
    clearBtn: isBangla ? "ফিল্টার মুছুন" : "Clear Filters",
    comingSoonTitle: isBangla ? "শীঘ্রই আসছে" : "Coming Soon",
    comingSoonSub: "Coming Soon",
    comingSoonDesc: isBangla
      ? "আমরা এই বিভাগে নতুন এবং উন্নত কোর্স নিয়ে আসছি। আপডেট পেতে চোখ রাখুন!"
      : "We are bringing new and improved courses to this section. Keep an eye out for updates!",
  };

  // ✅ SKELETON LOADER
  if (isLoading) {
    return <CoursesSkeletonGrid />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16 md:pb-20">
      {/* --- HERO SECTION --- */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-center">
          <span className="text-lg md:text-2xl text-gray-600 leading-[18.75px]">
            {uiText.heroTitle}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-secondary mb-4 md:mb-6 leading-tight">
            {uiText.heroMain}
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed px-2">
            {uiText.heroDesc}
          </p>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 md:h-5 w-4 md:w-5 text-gray-400 group-focus-within:text-[#F3056D]" />
            </div>
            <input
              type="text"
              placeholder={uiText.searchPlaceholder}
              className="w-full text-gray-700 pl-11 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-[#F3056D] focus:ring-4 focus:ring-[#F3056D]/10 outline-none text-base md:text-lg transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-6 md:mt-8 px-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all border ${
                activeCategory === "all"
                  ? "bg-[#F3056D] text-white border-[#F3056D] shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {uiText.allFilter}
            </button>

            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all border ${
                  activeCategory === tab
                    ? "bg-[#F3056D] text-white border-[#F3056D] shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- COURSES GRID SECTION --- */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#111827] flex items-center gap-2">
              <BookOpen className="w-5 h-5 md:w-7 md:h-7 text-[#F3056D]" />
              {uiText.popularTitle}
            </h2>
            <span className="text-xs md:text-sm text-gray-500">
              {uiText.foundText} {filteredCourses.length}
              {uiText.foundSuffix}
            </span>
          </div>

          {filteredCourses.length > 0 ? (
            // ✅ RESPONSIVE GRID: 1 col mobile, 3 cols desktop
            <div className="md:grid grid-cols-1 flex flex-col justify-center items-center md:grid-cols-3 gap-6 md:gap-8">
              {filteredCourses.map((course) => (
                <ChalakCourseCard
                  key={course._id}
                  course={course}
                  ctaCardLabel={isBangla ? "বিস্তারিত" : "Details"}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center w-full py-10">
              <div className="bg-white rounded-[30px] border-2 border-[#FF8FCA] p-8 md:p-16 shadow-xl flex flex-col items-center justify-center min-h-[350px] md:min-h-[400px] w-full max-w-2xl text-center">
                <div className="bg-pink-50 rounded-full p-5 md:p-6 mb-4 md:mb-6 border-2 border-dashed border-pink-300">
                  <Clock size={48 } className="text-[#D81B60]" />
                </div>
                <h3 className="text-[#D81B60] tracking-[0%] leading-[140%] font-bold text-2xl md:text-4xl mb-2">
                  {uiText.comingSoonTitle}
                </h3>
                <p className="text-gray-600 text-base md:text-lg">
                  {uiText.comingSoonSub}
                </p>
                <p className="text-gray-500 mt-3 md:mt-4 text-xs md:text-sm max-w-md mx-auto px-4">
                  {uiText.comingSoonDesc}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}