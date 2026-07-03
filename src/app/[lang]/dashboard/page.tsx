"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";
import gsap from "gsap";
import {
  BookOpen,
  Clock,
  Calendar,
  Award,
  Play,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Star,
  Trophy,
  Flame,
  Target,
  Crown,
  Sparkles,
  ArrowRight,
  Lock,
  Zap,
  Gamepad2,
  Palette,
  Music,
  Code2,
  Microscope,
  Pencil,
  Rocket,
  Heart,
  Users,
  BookMarked,
  PlayCircle,
} from "lucide-react";

// Mock Data
const ongoingCourses = [
  {
    id: "1",
    title: "Fun with Numbers",
    instructor: "Ms. Sarah",
    progress: 65,
    image:
      "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    nextLesson: "Addition Adventures",
    category: "Mathematics",
    color: "#F3056D",
    icon: Target,
    totalLessons: 24,
    completedLessons: 16,
  },
  {
    id: "2",
    title: "Color & Shapes",
    instructor: "Mr. David",
    progress: 30,
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    nextLesson: "Mixing Primary Colors",
    category: "Art & Craft",
    color: "#ffd700",
    icon: Palette,
    totalLessons: 18,
    completedLessons: 5,
  },
  {
    id: "3",
    title: "Science Explorers",
    instructor: "Dr. Emily",
    progress: 85,
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    nextLesson: "Solar System Tour",
    category: "Science",
    color: "#214187",
    icon: Microscope,
    totalLessons: 20,
    completedLessons: 17,
  },
];

const recommendedCourses = [
  {
    id: "r1",
    title: "Coding with Blocks",
    category: "Technology",
    color: "#F3056D",
    icon: Code2,
    lessons: 15,
    rating: 4.8,
    students: 1200,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "r2",
    title: "Music & Rhythm",
    category: "Creative Arts",
    color: "#ffd700",
    icon: Music,
    lessons: 12,
    rating: 4.9,
    students: 890,
    image:
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "r3",
    title: "Story Writing Fun",
    category: "Language",
    color: "#214187",
    icon: Pencil,
    lessons: 10,
    rating: 4.7,
    students: 750,
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "r4",
    title: "Space Adventures",
    category: "Science",
    color: "#F3056D",
    icon: Rocket,
    lessons: 8,
    rating: 4.9,
    students: 2100,
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
];

const upcomingSchedule = [
  {
    id: 1,
    title: "Live Math Quiz",
    time: "Today, 4:00 PM",
    type: "live",
    color: "#F3056D",
    icon: Gamepad2,
  },
  {
    id: 2,
    title: "Art Homework Due",
    time: "Tomorrow, 9:00 PM",
    type: "deadline",
    color: "#ffd700",
    icon: Clock,
  },
  {
    id: 3,
    title: "Science Lab Session",
    time: "Friday, 2:00 PM",
    type: "event",
    color: "#214187",
    icon: Microscope,
  },
];

const leaderboard = [
  { rank: 1, name: "Emma W.", points: 2450, avatar: "kid2" },
  { rank: 2, name: "Liam K.", points: 2180, avatar: "kid3" },
  { rank: 3, name: "You", points: 1950, avatar: "kid1", isYou: true },
];

export default function StudentDashboardPage() {
  const { isDarkMode } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-card",
        { y: 30, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" },
      );
      gsap.fromTo(
        ".stat-card",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.2,
        },
      );
      gsap.fromTo(
        ".course-card",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.12,
          ease: "power2.out",
          delay: 0.4,
        },
      );
      gsap.fromTo(
        ".widget-card",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.5,
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const cardBg = isDarkMode ? "rgba(26,16,53,0.6)" : "#fff";
  const cardBorder = isDarkMode
    ? "1px solid rgba(255,255,255,0.06)"
    : "1px solid rgba(33,65,135,0.06)";
  const textPrimary = isDarkMode ? "#fff" : "#214187";
  const textSecondary = isDarkMode
    ? "rgba(255,255,255,0.5)"
    : "rgba(33,65,135,0.5)";
  const textMuted = isDarkMode
    ? "rgba(255,255,255,0.3)"
    : "rgba(33,65,135,0.35)";

  return (
    <div className="space-y-6 max-w-7xl mx-auto" ref={containerRef}>
      {/* ==================== HERO WELCOME CARD ==================== */}
      <div
        className="hero-card relative overflow-hidden rounded-3xl p-6 sm:p-8"
        style={{
          background: isDarkMode
            ? "linear-gradient(135deg, #2d1045 0%, #1a1035 40%, #0d1a2d 100%)"
            : "linear-gradient(135deg, #214187 0%, #1a3470 40%, #152d5e 100%)",
          boxShadow: isDarkMode
            ? "0 20px 60px rgba(0,0,0,0.4)"
            : "0 20px 60px rgba(33,65,135,0.25)",
        }}
      >
        {/* Decorative Elements */}
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4"
          style={{ background: "#F3056D" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full blur-3xl opacity-15 translate-y-1/2"
          style={{ background: "#ffd700" }}
        />

        {/* Floating Shapes */}
        <div
          className="hidden sm:block absolute top-6 right-32 w-16 h-16 rounded-2xl rotate-12 opacity-20"
          style={{
            background: "#F3056D",
            border: "2px solid rgba(255,255,255,0.1)",
          }}
        />
        <div
          className="hidden sm:block absolute bottom-8 right-52 w-10 h-10 rounded-full opacity-20"
          style={{ background: "#ffd700" }}
        />
        <div
          className="hidden sm:block absolute top-16 right-72 w-6 h-6 rotate-45 opacity-15"
          style={{ background: "#fff" }}
        />

        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5"
              style={{
                background: "rgba(243,5,109,0.2)",
                color: "#F3056D",
                border: "1px solid rgba(243,5,109,0.2)",
              }}
            >
              <Flame className="h-3.5 w-3.5" />
              <span>5 Day Learning Streak!</span>
            </div>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 tracking-tight leading-tight"
              style={{ color: "#fff" }}
            >
              Welcome back,
              <br />
              <span style={{ color: "#ffd700" }}>Little Star!</span>
            </h1>
            <p
              className="text-sm sm:text-base mb-6 max-w-md leading-relaxed"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              You&apos;re doing amazing! Complete 2 more lessons today to earn
              your Super Learner badge.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #F3056D 0%, #ff3d8f 100%)",
                  color: "#fff",
                  boxShadow: "0 8px 25px rgba(243,5,109,0.35)",
                }}
              >
                <Play className="h-4 w-4" fill="#fff" />
                Continue Learning
              </button>
              <button
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <Sparkles className="h-4 w-4" />
                Daily Challenge
              </button>
            </div>
          </div>

          {/* Right Side: Fun Stats Cards */}
          <div className="hidden md:flex justify-end items-center relative h-44">
            <div
              className="absolute w-44 p-4 rounded-2xl backdrop-blur-sm transform -rotate-6 hover:rotate-0 transition-transform duration-500 cursor-default"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4" style={{ color: "#ffd700" }} />
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Weekly Progress
                </span>
              </div>
              <p className="text-3xl font-black" style={{ color: "#fff" }}>
                +15%
              </p>
              <p
                className="text-[11px] mt-1"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                vs last week
              </p>
            </div>
            <div
              className="absolute w-40 p-4 rounded-2xl backdrop-blur-sm transform rotate-6 translate-x-12 translate-y-4 hover:rotate-0 transition-transform duration-500 cursor-default"
              style={{
                background: "rgba(243,5,109,0.15)",
                border: "1px solid rgba(243,5,109,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4" style={{ color: "#ffd700" }} />
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Rank
                </span>
              </div>
              <p className="text-3xl font-black" style={{ color: "#ffd700" }}>
                #3
              </p>
              <p
                className="text-[11px] mt-1"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                in your class
              </p>
            </div>
            <div
              className="absolute w-32 p-3 rounded-2xl backdrop-blur-sm transform -rotate-3 -translate-x-4 translate-y-16 hover:rotate-0 transition-transform duration-500 cursor-default"
              style={{
                background: "rgba(255,215,0,0.1)",
                border: "1px solid rgba(255,215,0,0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Star
                  className="h-3.5 w-3.5"
                  style={{ color: "#ffd700" }}
                  fill="#ffd700"
                />
                <span
                  className="text-[10px] font-bold"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Stars
                </span>
              </div>
              <p className="text-2xl font-black" style={{ color: "#fff" }}>
                1,250
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== STATS GRID ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "My Courses",
            value: "05",
            icon: BookOpen,
            color: "#F3056D",
            bgColor: isDarkMode
              ? "rgba(243,5,109,0.1)"
              : "rgba(243,5,109,0.06)",
          },
          {
            label: "Lessons Done",
            value: "42",
            icon: CheckCircle2,
            color: "#214187",
            bgColor: isDarkMode
              ? "rgba(33,65,135,0.15)"
              : "rgba(33,65,135,0.06)",
          },
          {
            label: "Badges Earned",
            value: "08",
            icon: Award,
            color: "#ffd700",
            bgColor: isDarkMode
              ? "rgba(255,215,0,0.1)"
              : "rgba(255,215,0,0.08)",
          },
          {
            label: "Learning Time",
            value: "86h",
            icon: Clock,
            color: "#F3056D",
            bgColor: isDarkMode
              ? "rgba(243,5,109,0.1)"
              : "rgba(243,5,109,0.06)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="stat-card p-4 sm:p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-default"
            style={{
              background: cardBg,
              border: cardBorder,
              boxShadow: isDarkMode
                ? "0 4px 20px rgba(0,0,0,0.2)"
                : "0 4px 20px rgba(33,65,135,0.06)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <div
                className="p-2.5 rounded-xl"
                style={{ background: stat.bgColor }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <TrendingUp
                className="h-4 w-4"
                style={{ color: stat.color, opacity: 0.5 }}
              />
            </div>
            <h3
              className="text-2xl sm:text-3xl font-black"
              style={{ color: textPrimary }}
            >
              {stat.value}
            </h3>
            <p
              className="text-xs font-medium mt-1"
              style={{ color: textSecondary }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ==================== MAIN BENTO GRID ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Courses Section (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: cardBg,
              border: cardBorder,
              boxShadow: isDarkMode
                ? "0 4px 20px rgba(0,0,0,0.2)"
                : "0 4px 20px rgba(33,65,135,0.06)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="flex items-center justify-between p-5 sm:p-6"
              style={{
                borderBottom: isDarkMode
                  ? "1px solid rgba(255,255,255,0.05)"
                  : "1px solid rgba(33,65,135,0.06)",
              }}
            >
              <div>
                <h2
                  className="text-lg font-black"
                  style={{ color: textPrimary }}
                >
                  Continue Learning
                </h2>
                <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                  Pick up where you left off
                </p>
              </div>
              <Link
                href="/dashboard/courses"
                className="flex items-center gap-1 text-xs font-bold transition-colors duration-200"
                style={{ color: "#F3056D" }}
              >
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div
              className="divide-y"
              style={{
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(33,65,135,0.04)",
              }}
            >
              {ongoingCourses.map((course) => (
                <div
                  key={course.id}
                  className="course-card p-4 sm:p-5 flex flex-col sm:flex-row gap-4 transition-all duration-300 cursor-pointer group"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDarkMode
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(33,65,135,0.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="relative w-full sm:w-36 h-24 rounded-xl overflow-hidden flex-shrink-0"
                    style={{
                      boxShadow: `0 4px 15px ${course.color}15`,
                    }}
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: course.color }}
                      >
                        <Play
                          className="h-4 w-4 text-white ml-0.5"
                          fill="#fff"
                        />
                      </div>
                    </div>
                    {/* Category badge */}
                    <div
                      className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider text-white"
                      style={{ background: course.color }}
                    >
                      {course.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="p-1 rounded-md"
                        style={{ background: `${course.color}15` }}
                      >
                        <course.icon
                          className="h-3.5 w-3.5"
                          style={{ color: course.color }}
                        />
                      </div>
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: textMuted }}
                      >
                        {course.instructor}
                      </span>
                    </div>
                    <h3
                      className="font-bold text-sm sm:text-base truncate"
                      style={{ color: textPrimary }}
                    >
                      {course.title}
                    </h3>
                    <p
                      className="text-xs mt-0.5 mb-3 flex items-center gap-1"
                      style={{ color: textSecondary }}
                    >
                      <PlayCircle className="h-3 w-3" />
                      Next: {course.nextLesson}
                    </p>

                    {/* Progress */}
                    <div className="flex items-center gap-3">
                      <div
                        className="flex-1 h-2 rounded-full overflow-hidden"
                        style={{
                          background: isDarkMode
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(33,65,135,0.08)",
                        }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                          style={{
                            width: `${course.progress}%`,
                            background: `linear-gradient(90deg, ${course.color}, ${course.color}cc)`,
                          }}
                        >
                          {/* Shimmer effect */}
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                              animation: "shimmer 2s infinite",
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          className="text-xs font-black"
                          style={{ color: course.color }}
                        >
                          {course.progress}%
                        </span>
                        <span
                          className="text-[10px]"
                          style={{ color: textMuted }}
                        >
                          ({course.completedLessons}/{course.totalLessons})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Courses */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: cardBg,
              border: cardBorder,
              boxShadow: isDarkMode
                ? "0 4px 20px rgba(0,0,0,0.2)"
                : "0 4px 20px rgba(33,65,135,0.06)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="flex items-center justify-between p-5 sm:p-6"
              style={{
                borderBottom: isDarkMode
                  ? "1px solid rgba(255,255,255,0.05)"
                  : "1px solid rgba(33,65,135,0.06)",
              }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" style={{ color: "#ffd700" }} />
                <h2
                  className="text-lg font-black"
                  style={{ color: textPrimary }}
                >
                  Recommended for You
                </h2>
              </div>
              <Link
                href="/dashboard/courses"
                className="flex items-center gap-1 text-xs font-bold"
                style={{ color: "#F3056D" }}
              >
                See All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedCourses.map((course) => (
                <div
                  key={course.id}
                  className="course-card group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  style={{
                    border: isDarkMode
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid rgba(33,65,135,0.08)",
                    boxShadow: isDarkMode
                      ? "0 2px 10px rgba(0,0,0,0.2)"
                      : "0 2px 10px rgba(33,65,135,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 8px 30px ${course.color}20`;
                    e.currentTarget.style.borderColor = `${course.color}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = isDarkMode
                      ? "0 2px 10px rgba(0,0,0,0.2)"
                      : "0 2px 10px rgba(33,65,135,0.05)";
                    e.currentTarget.style.borderColor = isDarkMode
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid rgba(33,65,135,0.08)";
                  }}
                >
                  {/* Mini Thumbnail */}
                  <div className="relative h-28 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, ${isDarkMode ? "rgba(26,16,53,0.9)" : "rgba(33,65,135,0.8)"}, transparent)`,
                      }}
                    />
                    <div
                      className="absolute top-3 left-3 p-1.5 rounded-lg"
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <course.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                        style={{ color: course.color }}
                      >
                        {course.category}
                      </p>
                      <h3 className="text-sm font-bold text-white truncate">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  {/* Info Footer */}
                  <div
                    className="p-3 flex items-center justify-between"
                    style={{
                      background: isDarkMode
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(33,65,135,0.01)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star
                          className="h-3 w-3"
                          style={{ color: "#ffd700" }}
                          fill="#ffd700"
                        />
                        <span
                          className="text-[11px] font-bold"
                          style={{ color: textPrimary }}
                        >
                          {course.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookMarked
                          className="h-3 w-3"
                          style={{ color: textMuted }}
                        />
                        <span
                          className="text-[11px] font-medium"
                          style={{ color: textSecondary }}
                        >
                          {course.lessons} lessons
                        </span>
                      </div>
                    </div>
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      style={{ color: course.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==================== RIGHT SIDEBAR WIDGETS ==================== */}
        <div className="space-y-6">
          {/* Upcoming Schedule */}
          <div
            className="widget-card rounded-2xl overflow-hidden"
            style={{
              background: cardBg,
              border: cardBorder,
              boxShadow: isDarkMode
                ? "0 4px 20px rgba(0,0,0,0.2)"
                : "0 4px 20px rgba(33,65,135,0.06)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="flex items-center justify-between p-5"
              style={{
                borderBottom: isDarkMode
                  ? "1px solid rgba(255,255,255,0.05)"
                  : "1px solid rgba(33,65,135,0.06)",
              }}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" style={{ color: "#F3056D" }} />
                <h3
                  className="font-black text-sm"
                  style={{ color: textPrimary }}
                >
                  Upcoming
                </h3>
              </div>
              <Link
                href="/dashboard/schedule"
                className="text-[10px] font-bold"
                style={{ color: "#F3056D" }}
              >
                View All
              </Link>
            </div>
            <div className="p-4 space-y-2.5">
              {upcomingSchedule.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer"
                  style={{
                    background: isDarkMode
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(33,65,135,0.03)",
                    borderLeft: `3px solid ${item.color}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(33,65,135,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDarkMode
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(33,65,135,0.03)";
                  }}
                >
                  <div
                    className="p-2 rounded-xl flex-shrink-0"
                    style={{ background: `${item.color}15` }}
                  >
                    <item.icon
                      className="h-4 w-4"
                      style={{ color: item.color }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h4
                      className="text-xs font-bold truncate"
                      style={{ color: textPrimary }}
                    >
                      {item.title}
                    </h4>
                    <p
                      className="text-[10px] mt-0.5"
                      style={{ color: textSecondary }}
                    >
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div
            className="widget-card rounded-2xl overflow-hidden"
            style={{
              background: isDarkMode
                ? "linear-gradient(180deg, rgba(26,16,53,0.8) 0%, rgba(13,26,45,0.8) 100%)"
                : "linear-gradient(180deg, #214187 0%, #1a3470 100%)",
              border: isDarkMode ? "1px solid rgba(255,255,255,0.06)" : "none",
              boxShadow: isDarkMode
                ? "0 4px 20px rgba(0,0,0,0.3)"
                : "0 8px 30px rgba(33,65,135,0.25)",
            }}
          >
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" style={{ color: "#ffd700" }} />
                <h3 className="font-black text-sm text-white">Leaderboard</h3>
              </div>
              <Crown className="h-4 w-4" style={{ color: "#ffd700" }} />
            </div>
            <div className="px-4 pb-4 space-y-2">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
                  style={{
                    background: user.isYou
                      ? "rgba(255,215,0,0.15)"
                      : "rgba(255,255,255,0.05)",
                    border: user.isYou
                      ? "1px solid rgba(255,215,0,0.25)"
                      : "1px solid transparent",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs"
                    style={{
                      background:
                        user.rank === 1
                          ? "#ffd700"
                          : user.rank === 2
                            ? "#C0C0C0"
                            : "#cd7f32",
                      color: user.rank <= 2 ? "#214187" : "#fff",
                    }}
                  >
                    {user.rank}
                  </div>
                  <img
                    src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${user.avatar}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2"
                    style={{
                      borderColor: user.isYou
                        ? "#ffd700"
                        : "rgba(255,255,255,0.1)",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-bold truncate"
                      style={{
                        color: user.isYou ? "#ffd700" : "#fff",
                      }}
                    >
                      {user.name}
                      {user.isYou && (
                        <span
                          className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{
                            background: "rgba(255,215,0,0.2)",
                            color: "#ffd700",
                          }}
                        >
                          YOU
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star
                      className="h-3 w-3"
                      style={{ color: "#ffd700" }}
                      fill="#ffd700"
                    />
                    <span
                      className="text-xs font-black"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {user.points.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Card */}
          <div
            className="widget-card relative overflow-hidden rounded-2xl p-5"
            style={{
              background: isDarkMode
                ? "linear-gradient(135deg, rgba(243,5,109,0.15) 0%, rgba(255,215,0,0.1) 100%)"
                : "linear-gradient(135deg, rgba(243,5,109,0.04) 0%, rgba(255,215,0,0.06) 100%)",
              border: isDarkMode
                ? "1px solid rgba(243,5,109,0.15)"
                : "1px solid rgba(243,5,109,0.1)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-30 -translate-y-1/2 translate-x-1/2"
              style={{ background: "#F3056D" }}
            />
            <div className="relative">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: "linear-gradient(135deg, #F3056D, #ffd700)",
                  boxShadow: "0 6px 20px rgba(243,5,109,0.3)",
                }}
              >
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3
                className="font-black text-sm mb-1"
                style={{ color: textPrimary }}
              >
                Achievement Unlocked!
              </h3>
              <p
                className="text-xs mb-4 leading-relaxed"
                style={{ color: textSecondary }}
              >
                You earned the &quot;Science Explorer&quot; badge for completing
                15 science lessons!
              </p>
              <button
                className="flex items-center gap-2 text-xs font-bold transition-all duration-200 hover:gap-3"
                style={{ color: "#F3056D" }}
              >
                View All Badges
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Help */}
          <div
            className="widget-card rounded-2xl p-5"
            style={{
              background: cardBg,
              border: cardBorder,
              boxShadow: isDarkMode
                ? "0 4px 20px rgba(0,0,0,0.2)"
                : "0 4px 20px rgba(33,65,135,0.06)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="p-2.5 rounded-xl flex-shrink-0"
                style={{ background: "rgba(33,65,135,0.08)" }}
              >
                <Zap className="h-5 w-5" style={{ color: "#214187" }} />
              </div>
              <div>
                <h3
                  className="font-black text-sm mb-1"
                  style={{ color: textPrimary }}
                >
                  Need Help?
                </h3>
                <p
                  className="text-xs mb-3 leading-relaxed"
                  style={{ color: textSecondary }}
                >
                  Ask our AI buddy anything about your courses!
                </p>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: isDarkMode
                      ? "rgba(33,65,135,0.15)"
                      : "rgba(33,65,135,0.06)",
                    color: "#214187",
                    border: isDarkMode
                      ? "1px solid rgba(33,65,135,0.2)"
                      : "1px solid rgba(33,65,135,0.1)",
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Ask AI Buddy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
