"use client";

import React, { useState, useMemo } from "react";
import { Search, BookOpen, Award } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import InstructorCardModern from "./components/InstructorCardModern";

export default function OurInstructors() {
  const { instructorsData, isBangla } = useLanguage();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const allInstructors = instructorsData?.instructors || [];
  const heroData = instructorsData?.hero;

  // --- Filter Logic ---
  const filteredInstructors = useMemo(() => {
    return allInstructors.filter((inst) => {
      const matchesSearch =
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        activeCategory === "all" ||
        (activeCategory === "english" &&
          inst.role.toLowerCase().includes("english")) ||
        (activeCategory === "art" && inst.role.toLowerCase().includes("art"));

      return matchesSearch && matchesCategory;
    });
  }, [allInstructors, searchTerm, activeCategory]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20">
      {/* --- HERO SECTION (Following Image Pattern: Red Box, Title, Search, Buttons) --- */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Red Border Box Container */}
          <div className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
              {/* Small Title / Subtitle */}
              <span className="text-2xl text-gray-600 leading-[18.75px]">
                {heroData?.title || "Our Instructors"}
              </span>

              {/* Main H1 Title */}
              <h1 className="text-4xl md:text-5xl font-extrabold text-secondary mb-6 leading-tight">
                {heroData?.subtitle || "Chalak Champs — Instructor Profiles"}
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                {heroData?.description ||
                  "Meet the dedicated team of experts guiding your child's journey to success."}
              </p>

              {/* Search Bar */}
              <div className="max-w-lg mx-auto relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={
                    heroData?.searchPlaceholder || "Search for an instructor..."
                  }
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#F3056D] focus:ring-4 focus:ring-[#F3056D]/10 outline-none text-gray-700 shadow-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Buttons (Pattern from Image) */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                    activeCategory === "all"
                      ? "bg-[#F3056D] text-white border-[#F3056D] shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#F3056D] hover:text-[#F3056D]"
                  }`}
                >
                  {heroData?.allBtn || "All Instructors"}
                </button>

                <button
                  onClick={() => setActiveCategory("english")}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                    activeCategory === "english"
                      ? "bg-[#F3056D] text-white border-[#F3056D] shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#F3056D] hover:text-[#F3056D]"
                  }`}
                >
                  {heroData?.teamBtn1 || "English Team"}
                </button>

                <button
                  onClick={() => setActiveCategory("art")}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                    activeCategory === "art"
                      ? "bg-[#F3056D] text-white border-[#F3056D] shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#F3056D] hover:text-[#F3056D]"
                  }`}
                >
                  {heroData?.teamBtn2 || "Art Team"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- INSTRUCTORS GRID --- */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
          <BookOpen className="h-6 w-6 text-[#F3056D]" />
          <h2 className="text-2xl font-bold text-gray-800">
            {isBangla ? "দলের সদস্যবৃন্দ" : "Team Members"}
            <span className="text-gray-400 text-lg font-normal ml-2">
              ({filteredInstructors.length})
            </span>
          </h2>
        </div>

        {filteredInstructors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInstructors.map((instructor) => (
              <InstructorCardModern
                key={instructor.id}
                instructor={instructor}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {isBangla
                ? "কোন ইন্সট্রাক্টর পাওয়া যায়নি"
                : "No instructors found matching your criteria."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
