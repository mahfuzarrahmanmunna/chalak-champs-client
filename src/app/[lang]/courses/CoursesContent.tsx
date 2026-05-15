"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, BookOpen, Clock } from "lucide-react"; // Added Clock import
import { useLanguage } from "@/app/context/LanguageContext";
import ChalakCourseCard from "@/app/components/ChalakCourses/ChalakCourseCard";
import CourseStats from "./CourseStats";

export default function CoursesPage() {
  const { coursesData, isBangla } = useLanguage();

  // State for Search and Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // --- Derived Data ---

  // Extract tabs from context or default to empty array to prevent errors
  const tabs = coursesData?.tabs || [];
  const allCourses = coursesData?.courses || [];

  // --- UPDATED FILTER LOGIC: Token-Based Search ---
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      // 1. Category Filter (Keep as is)
      const matchesCategory =
        activeCategory === "all" || course.category === activeCategory;

      // 2. Search Filter (New Smart Logic)
      let matchesSearch = true;

      if (searchTerm.trim() !== "") {
        // A. Split search term into separate words (tokens)
        const searchTokens = searchTerm
          .toLowerCase()
          .split(/\s+/) // Split by space
          .filter((token) => token.length > 0); // Remove empty strings

        // B. Prepare course data for checking
        const courseTitle = course.title.toLowerCase();
        const courseCategory = course.category.toLowerCase();

        // C. Check if ANY of the search tokens exist in the Title OR Category
        matchesSearch = searchTokens.some(
          (token) =>
            courseTitle.includes(token) || courseCategory.includes(token),
        );
      }

      return matchesCategory && matchesSearch;
    });
  }, [allCourses, searchTerm, activeCategory]);

  // Calculate stats dynamically
  const totalCourses = allCourses.length;
  const studentsCount = 1200;

  // --- Helper Texts (Bilingual) ---
  const uiText = {
    heroTitle: isBangla ? "আমাদের কোর্স" : "Our Courses",
    heroMain: isBangla
      ? "আপনার বাচ্চার ভবিষ্যত তৈরি করুন"
      : "Build Your Child's Future",
    heroDesc: isBangla
      ? "চালাক চ্যাম্পস (Chalak Champs)—যেখানে শেখা হয় আনন্দের সাথে! আমরা শুধু মুখস্থ বিদ্যা নয়, বরং আপনার বাচ্চার আগ্রহ, মেধা এবং আত্মবিশ্বাস বাড়াতে নিয়ে এসেছি বিশ্বমানের সব আধুনিক কোর্স।"
      : "Chalak Champs—Where learning is fun! We bring world-class modern courses not just to memorize, but to increase your child's interest, talent, and self-confidence.",
    searchPlaceholder: isBangla ? "কোর্স খুঁজুন..." : "Search for courses...",
    allFilter: isBangla ? "সব কোর্স" : "All Courses",
    popularTitle: isBangla ? "জনপ্রিয়ি কোর্স" : "Popular Courses",
    foundText: isBangla ? "মোট " : "Total ",
    foundSuffix: isBangla ? "টি কোর্স পাওয়া গেছে" : " courses found",
    noCourseTitle: isBangla ? "কোন কোর্স পাওয়া যায়নি" : "No courses found",
    noCourseDesc: isBangla
      ? "আপনার অনুসন্ধ কি ঠিক খুঁজছেন।"
      : "Please adjust your search filters.",
    clearBtn: isBangla ? "ফিল্টার মুছুন" : "Clear Filters",
    // --- New Texts for Coming Soon Card ---
    comingSoonTitle: isBangla ? "শীঘ্রই আসছে" : "Coming Soon",
    comingSoonSub: "Coming Soon",
    comingSoonDesc: isBangla
      ? "আমরা এই বিভাগে নতুন এবং উন্নত কোর্স নিয়ে আসছি। আপডেট পেতে চোখ রাখুন!"
      : "We are bringing new and improved courses to this section. Keep an eye out for updates!",
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* --- HERO SECTION --- */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="text-2xl text-gray-600 leading-[18.75px]">
            {uiText.heroTitle}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-secondary mb-6 leading-tight">
            {uiText.heroMain}
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            {uiText.heroDesc}
          </p>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#F3056D]" />
            </div>
            <input
              type="text"
              placeholder={uiText.searchPlaceholder}
              className="w-full text-gray-700 pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#F3056D] focus:ring-4 focus:ring-[#F3056D]/10 outline-none text-lg transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
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
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
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
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#111827] flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-[#F3056D]" />
              {uiText.popularTitle}
            </h2>
            <span className="text-sm text-gray-500">
              {uiText.foundText} {filteredCourses.length}
              {uiText.foundSuffix}
            </span>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="md:grid flex justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <ChalakCourseCard
                  key={course.id}
                  course={course}
                  ctaCardLabel={coursesData?.ctaCard || "Details"}
                />
              ))}
            </div>
          ) : (
            // --- COMING SOON CARD (REPLACED EMPTY STATE) ---
            <div className="flex justify-center w-full py-10">
              <div className="bg-white rounded-[30px] border-2 border-[#FF8FCA] p-10 md:p-16 shadow-xl flex flex-col items-center justify-center min-h-[400px] w-full max-w-2xl text-center">
                <div className="bg-pink-50 rounded-full p-6 mb-6 border-2 border-dashed border-pink-300">
                  <Clock size={64} className="text-[#D81B60]" />
                </div>
                <h3 className="text-[#D81B60] tracking-[0%] leading-[140%] font-bold text-3xl md:text-4xl mb-2">
                  {uiText.comingSoonTitle}
                </h3>
                <p className="text-gray-600 text-lg">{uiText.comingSoonSub}</p>
                <p className="text-gray-500 mt-4 text-sm max-w-md mx-auto">
                  {uiText.comingSoonDesc}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <CourseStats totalCourses={totalCourses} studentsCount={studentsCount} />
    </div>
  );
}
