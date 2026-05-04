"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, BookOpen } from "lucide-react";
import CourseCard from "./CourseCard";
import CourseStats from "./CourseStats";

interface Course {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeColor: string;
  image: string | null;
  age: string;
  duration: string;
  schedule: string;
  mode: string;
  fee: string;
  buttonText: string;
  faqs?: Array<{ id: string; question: string; answer: string }>;
  [key: string]: any;
}

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("./courses.json");
        if (!response.ok) throw new Error("Failed to fetch courses data");
        const data: Course[] = await response.json();
        setCourses(data);
      } catch (err) {
        console.error("Error loading courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" ||
      course.subtitle.toLowerCase().includes(filterCategory);
    return matchesSearch && matchesCategory;
  });

  // --- FIX: Define the variables that were missing ---
  const totalCourses = courses.length;
  // Note: Since your course interface doesn't have a 'students' field,
  // I am hardcoding this number. Change this as needed.
  const studentsCount = 1200;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* --- HERO SECTION --- */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="text-2xl text-gray-600 leading-18.75 ">
            আমাদের কোর্স
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-secondary mb-6 leading-tight">
            আপনার বাচ্চার{" "}
            <span className="relative inline-block px-3 py-2 group">
              <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>
              <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
              <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
              <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
              <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
              <span className="text-primary "> ভবিষ্যত</span>
            </span>{" "}
            তৈরি করুন
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            চালাক চ্যাম্পস (Chalak Champs)—যেখানে শেখা হয় আনন্দের সাথে! আমরা
            শুধু মুখস্থ বিদ্যা নয়, বরং আপনার বাচ্চার আগ্রহ, মেধা এবং আত্মবিশ্বাস বাড়াতে নিয়ে এসেছি বিশ্বমানের সব আধুনিক কোর্স। বাংলাদেশের মেধাবী শিক্ষার্থীদের দক্ষ ও চ্যাম্পিয়ন হিসেবে গড়ে তোলাই আমাদের লক্ষ্য।
          </p>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#F3056D]" />
            </div>
            <input
              type="text"
              placeholder="কোর্স খুঁজুন..."
              className="w-full text-gray-700 pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#F3056D] focus:ring-4 focus:ring-[#F3056D]/10 outline-none text-lg transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {["all", "academic", "skill", "language"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  filterCategory === cat
                    ? "bg-[#F3056D] text-white border-[#F3056D] shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {cat === "all"
                  ? "সব কোর্স"
                  : cat === "academic"
                    ? "একাডেমিক"
                    : cat === "skill"
                      ? "স্কিল ডেভেলপমেন্ট"
                      : "ভাষা"}
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
              জনপ্রিয়ি কোর্স
            </h2>
            <span className="text-sm text-gray-500">
              মোট {filteredCourses.length}টি কোর্স পাওয়া গেছে
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-20 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F3056D]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                দুঃখা হয়েছে!
              </h3>
              <p className="text-gray-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-[#F3056D] text-white rounded-lg hover:bg-[#D6005C]"
              >
                আবার চেষ্টা করুন
              </button>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                <Filter className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                কোন কোর্স পাওয়া যায়নি
              </h3>
              <p className="text-gray-500 mb-6">
                আপনার অনুসন্ধ কি ঠিক খুঁজছেন।
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("all");
                }}
                className="mt-6 px-6 py-2 bg-[#F3056D] text-white rounded-lg hover:bg-[#D6005C]"
              >
                ফিল্টার মুছুন
              </button>
            </div>
          )}
        </div>
      </section>

      <CourseStats totalCourses={totalCourses} studentsCount={studentsCount} />
    </div>
  );
}
