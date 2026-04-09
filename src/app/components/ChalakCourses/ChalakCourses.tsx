import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  GraduationCap,
  Palette,
  Calculator,
  BookOpen,
} from "lucide-react";

const ChalakCourses = () => {
  // 1. State to track the active tab
  const [activeTab, setActiveTab] = useState("নিউ কোর্স");

  // 2. Categories Configuration
  const categories = [
    { name: "নিউ কোর্স", icon: <BookOpen size={18} /> },
    { name: "স্কিলস", icon: <Palette size={18} /> },
    { name: "একাডেমিক", icon: <GraduationCap size={18} /> },
    { name: "ইংলিশ", icon: <LayoutGrid size={18} /> },
    { name: "ম্যাথ", icon: <Calculator size={18} /> },
  ];

  // 3. Fake Data (Array of Objects) for all categories
  const coursesData = [
    // --- নিউ কোর্স ---
    {
      id: 1,
      title: "কিডস Spoken English",
      category: "নিউ কোর্স",
      tag1: "● রেকর্ডড",
      tag2: "⏱️ ৫ মাস",
      image: "/kidsenglish.png",
    },
    {
      id: 2,
      title: "বেসিক কম্পিউটার",
      category: "নিউ কোর্স",
      tag1: "● লাইভ",
      tag2: "⏱️ ৩ মাস",
      image: "/kidsenglish.png",
    },
    {
      id: 3,
      title: "ক্রিয়েটিভ ডিজাইন",
      category: "নিউ কোর্স",
      tag1: "● মিক্সড",
      tag2: "⏱️ ৪ মাস",
      image: "/kidsenglish.png",
    },

    // --- স্কিলস ---
    {
      id: 4,
      title: "গ্রাফিক ডিজাইন",
      category: "স্কিলস",
      tag1: "● রেকর্ডড",
      tag2: "⏱️ ৬ মাস",
      image: "/kidsenglish.png",
    },
    {
      id: 5,
      title: "ওয়েব ডেভেলপমেন্ট",
      category: "স্কিলস",
      tag1: "● লাইভ",
      tag2: "⏱️ ৮ মাস",
      image: "/kidsenglish.png",
    },
    {
      id: 6,
      title: "ডিজিটাল মার্কেটিং",
      category: "স্কিলস",
      tag1: "● রেকর্ডড",
      tag2: "⏱️ ৪ মাস",
      image: "/kidsenglish.png",
    },

    // --- একাডেমিক ---
    {
      id: 7,
      title: "ক্লাস ৯-১০ সায়েন্স",
      category: "একাডেমিক",
      tag1: "● লাইভ",
      tag2: "⏱️ ১০ মাস",
      image: "/kidsenglish.png",
    },
    {
      id: 8,
      title: "ভর্তি প্রস্তুতি",
      category: "একাডেমিক",
      tag1: "● রেকর্ডড",
      tag2: "⏱️ ৩ মাস",
      image: "/kidsenglish.png",
    },
    {
      id: 9,
      title: "এইচএসসি শর্ট কোর্স",
      category: "একাডেমিক",
      tag1: "● লাইভ",
      tag2: "⏱️ ৬ মাস",
      image: "/kidsenglish.png",
    },

    // --- ইংলিশ ---
    {
      id: 10,
      title: "স্পোকেন ইংলিশ",
      category: "ইংলিশ",
      tag1: "● লাইভ",
      tag2: "⏱️ ২ মাস",
      image: "/kidsenglish.png",
    },
    {
      id: 11,
      title: "আইইএলটিএস প্রস্তুতি",
      category: "ইংলিশ",
      tag1: "● রেকর্ডড",
      tag2: "⏱️ ৩ মাস",
      image: "/kidsenglish.png",
    },
    {
      id: 12,
      title: "ইংলিশ গ্রামার",
      category: "ইংলিশ",
      tag1: "● রেকর্ডড",
      tag2: "⏱️ ১ মাস",
      image: "/kidsenglish.png",
    },

    // --- ম্যাথ ---
    {
      id: 13,
      title: "এরিথমেটিক",
      category: "ম্যাথ",
      tag1: "● লাইভ",
      tag2: "⏱️ ৪ মাস",
      image: "/kidsenglish.png",
    },
    {
      id: 14,
      title: "এডভান্সড অ্যালজেব্রা",
      category: "ম্যাথ",
      tag1: "● রেকর্ডড",
      tag2: "⏱️ ৬ মাস",
      image: "/kidsenglish.png",
    },
    {
      id: 15,
      title: "ক্যালকুলাস বেসিক",
      category: "ম্যাথ",
      tag1: "● লাইভ",
      tag2: "⏱️ ৫ মাস",
      image: "/kidsenglish.png",
    },
  ];

  // Filter courses based on active tab
  const filteredCourses = coursesData.filter(
    (course) => course.category === activeTab,
  );

  return (
    <section className="max-w-[1400px] mx-auto bg-[#D81B60] p-6 md:p-12 rounded-[40px] relative overflow-hidden">
      {/* --- Header Section --- */}
      <div className="text-center mb-8">
        <h2 className="text-white text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
          <span className="bg-linear-to-br from-secondary to-[#6392b2] bg-clip-text text-transparent font-bold">
            চালাক
          </span>
          Champs এর
          <div className="relative inline-block px-6 py-3 bg-[#D81B60]">
            {/* Dashed Border */}
            <div className="absolute inset-0 border-2 border-dashed border-white m-1"></div>

            {/* 4 Corner Square Dots */}
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white"></div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white"></div>
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white"></div>
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white"></div>

            {/* Text Content */}
            <h2 className="relative text-white text-3xl font-bold tracking-wide">
              কোর্সসমূহ
            </h2>
          </div>
        </h2>
      </div>

      {/* --- Categories / Tab Section --- */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(cat.name)} // Added click handler
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition-all ${
              cat.name === activeTab // Check active state
                ? "bg-[#003B73] text-white border-2 border-pink-400 shadow-lg transform scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100 hover:scale-105"
            }`}
          >
            <span
              className={
                cat.name === activeTab ? "text-pink-400" : "text-blue-900"
              }
            >
              {cat.icon}
            </span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* --- Slider Section --- */}
      <div className="relative max-w-6xl mx-auto px-10">
        {/* Navigation Arrows (Placeholder functionality for now, keeping design) */}
        <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 text-pink-600 hover:bg-pink-50 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 text-pink-600 hover:bg-pink-50 transition-colors">
          <ChevronRight size={24} />
        </button>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl p-2 pb-5 shadow-xl flex flex-col items-center hover:-translate-y-2 transition-transform duration-300"
            >
              {/* Image Container with Radial Gradient Background */}
              <div className="w-full aspect-4/3 rounded-[25px] overflow-hidden relative mb-4">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover object-bottom rounded-lg"
                />
              </div>

              {/* Badges/Tags */}
              <div className="flex gap-2 mb-3">
                <span className="bg-pink-100 text-pink-600 text-[10px] px-2 py-0.5 rounded-full border border-pink-200">
                  {course.tag1}
                </span>
                <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full border border-blue-200">
                  {course.tag2}
                </span>
              </div>

              {/* Course Title */}
              <h3 className="text-gray-800 font-bold text-lg mb-4 text-center">
                {course.title}
              </h3>

              {/* Action Button */}
              <button className="bg-[#E91E63] text-white px-8 py-2 rounded-full text-sm font-semibold hover:bg-pink-700 transition-colors shadow-md">
                বিস্তারিত দেখুন →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- Footer Button --- */}
      <div className="flex flex-col items-center mt-12 gap-4">
        <button className="bg-[#003B73] text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
          আরও দেখুন
        </button>

        <p className="text-white/80 text-xs text-center">
          📞 প্রতি সপ্তাহে আমাদের নতুন ব্যাচ ক্লাস শুরু হয়ে থাকে, বিস্তারিত
          জানতে আমাদের কল করুন:{" "}
          <span className="font-bold">+88 01740178774</span>
        </p>
      </div>
    </section>
  );
};

export default ChalakCourses;
