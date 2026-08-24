"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";
import { useAuth } from "@/app/context/AuthContext";
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
  Zap,
  Palette,
  Users,
  PlayCircle,
  Loader2,
  AlertCircle,
  BarChart2,
} from "lucide-react";

const iconMap: Record<string, any> = {
  BookOpen, Clock, Calendar, Award, Play, ChevronRight, TrendingUp, CheckCircle2,
  Star, Trophy, Flame, Target, Crown, Sparkles, ArrowRight, Zap,
  Palette, Users, PlayCircle, BarChart2
};

const getIcon = (iconName?: string) => {
  if (!iconName) return BookOpen;
  return iconMap[iconName] || BookOpen;
};

export default function StudentDashboardPage() {
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  const [ongoingCourses, setOngoingCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch(
          `${BACKEND_URL}/api/orders/user/${currentUser.uid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error("Failed to load your enrolled courses");
        
        const data = await response.json();
        const orders = Array.isArray(data) ? data : (data.orders || data.data || []);

        const enrolledCourses = orders.map((order: any) => ({
          id: order._id || order.id,
          title: order.courseTitle || order.course?.title || "Untitled Course",
          image: order.courseImage || order.course?.thumbnail || order.course?.image || "/default-course.jpg",
          progress: order.progress || 0, 
          instructor: order.courseInstructor || order.course?.instructor || "Instructor",
          category: order.courseCategory || order.course?.category || "General",
          color: order.courseColor || order.course?.color || "#214187",
          icon: order.courseIcon || order.course?.icon || "BookOpen",
          nextLesson: order.nextLesson || "Next Lesson",
          completedLessons: order.completedLessons || 0,
          totalLessons: order.totalLessons || 0,
        }));

        setOngoingCourses(enrolledCourses);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, BACKEND_URL]);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-card", { y: 30, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" });
      gsap.fromTo(".stat-card", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.2 });
      gsap.fromTo(".course-card", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: "power2.out", delay: 0.4 });
      gsap.fromTo(".widget-card", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.5 });
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  const cardBg = isDarkMode ? "rgba(26,16,53,0.6)" : "#fff";
  const cardBorder = isDarkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(33,65,135,0.06)";
  const textPrimary = isDarkMode ? "#fff" : "#214187";
  const textSecondary = isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(33,65,135,0.5)";
  const textMuted = isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(33,65,135,0.35)";

  const uniqueInstructors = new Set(ongoingCourses.map((c) => c.instructor)).size;
  const uniqueCategories = new Set(ongoingCourses.map((c) => c.category)).size;
  const avgProgress = ongoingCourses.length > 0 
    ? Math.round(ongoingCourses.reduce((acc, curr) => acc + (curr.progress || 0), 0) / ongoingCourses.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-[#F3056D] animate-spin mb-4" />
        <p style={{ color: textSecondary }}>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="p-4 bg-red-50 rounded-2xl mb-4">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: textPrimary }}>Oops! Something went wrong</h2>
        <p className="mb-4" style={{ color: textSecondary }}>{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#F3056D] text-white font-bold rounded-xl">
          Try Again
        </button>
      </div>
    );
  }

  const handleCourseMouseEnter = (e: React.MouseEvent<HTMLDivElement>, color: string) => {
    e.currentTarget.style.boxShadow = `0 8px 30px ${color}20`;
    e.currentTarget.style.borderColor = `${color}30`;
  };

  const handleCourseMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = isDarkMode ? "0 2px 10px rgba(0,0,0,0.2)" : "0 2px 10px rgba(33,65,135,0.05)";
    e.currentTarget.style.borderColor = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(33,65,135,0.08)";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" ref={containerRef}>
      {/* ==================== HERO WELCOME CARD ==================== */}
      <div
        className="hero-card relative overflow-hidden rounded-3xl p-6 sm:p-8"
        style={{
          background: isDarkMode
            ? "linear-gradient(135deg, #2d1045 0%, #1a1035 40%, #0d1a2d 100%)"
            : "linear-gradient(135deg, #214187 0%, #1a3470 40%, #152d5e 100%)",
          boxShadow: isDarkMode ? "0 20px 60px rgba(0,0,0,0.4)" : "0 20px 60px rgba(33,65,135,0.25)",
        }}
      >
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4" style={{ background: "#F3056D" }} />
        <div className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full blur-3xl opacity-15 translate-y-1/2" style={{ background: "#ffd700" }} />

        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5" style={{ background: "rgba(243,5,109,0.2)", color: "#F3056D", border: "1px solid rgba(243,5,109,0.2)" }}>
              <Flame className="h-3.5 w-3.5" />
              <span>Keep up the great work!</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 tracking-tight leading-tight" style={{ color: "#fff" }}>
              Welcome back, <br />
              <span style={{ color: "#ffd700" }}>{currentUser?.displayName || "Student"}!</span>
            </h1>
            <p className="text-sm sm:text-base mb-6 max-w-md leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              You have an average progress of <span className="font-bold text-white">{avgProgress}%</span> across your courses. Keep learning to achieve your goals!
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl" style={{ background: "linear-gradient(135deg, #F3056D 0%, #ff3d8f 100%)", color: "#fff", boxShadow: "0 8px 25px rgba(243,5,109,0.35)" }}>
                <Play className="h-4 w-4" fill="#fff" />
                Continue Learning
              </button>
              <Link href="/courses" className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}>
                <Sparkles className="h-4 w-4" />
                Explore Courses
              </Link>
            </div>
          </div>

          <div className="hidden md:flex justify-end items-center relative h-48">
            <div className="absolute w-44 p-4 rounded-2xl backdrop-blur-sm transform -rotate-6 hover:rotate-0 transition-transform duration-500 cursor-default" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4" style={{ color: "#ffd700" }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>Enrolled</span>
              </div>
              <p className="text-3xl font-black" style={{ color: "#fff" }}>{ongoingCourses.length}</p>
              <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Active Courses</p>
            </div>
            <div className="absolute w-40 p-4 rounded-2xl backdrop-blur-sm transform rotate-6 translate-x-12 translate-y-4 hover:rotate-0 transition-transform duration-500 cursor-default" style={{ background: "rgba(243,5,109,0.15)", border: "1px solid rgba(243,5,109,0.2)" }}>
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="h-4 w-4" style={{ color: "#ffd700" }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>Avg Progress</span>
              </div>
              <p className="text-3xl font-black" style={{ color: "#ffd700" }}>{avgProgress}%</p>
              <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Keep it up!</p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== STATS GRID ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Courses", value: ongoingCourses.length.toString().padStart(2, "0"), icon: BookOpen, color: "#F3056D", bgColor: isDarkMode ? "rgba(243,5,109,0.1)" : "rgba(243,5,109,0.06)" },
          { label: "Instructors", value: uniqueInstructors.toString().padStart(2, "0"), icon: Users, color: "#214187", bgColor: isDarkMode ? "rgba(33,65,135,0.15)" : "rgba(33,65,135,0.06)" },
          { label: "Categories", value: uniqueCategories.toString().padStart(2, "0"), icon: Palette, color: "#ffd700", bgColor: isDarkMode ? "rgba(255,215,0,0.1)" : "rgba(255,215,0,0.08)" },
          { label: "Avg. Progress", value: `${avgProgress}%`, icon: TrendingUp, color: "#F3056D", bgColor: isDarkMode ? "rgba(243,5,109,0.1)" : "rgba(243,5,109,0.06)" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card p-4 sm:p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-default" style={{ background: cardBg, border: cardBorder, boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(33,65,135,0.06)", backdropFilter: "blur(10px)" }}>
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 rounded-xl" style={{ background: stat.bgColor }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black" style={{ color: textPrimary }}>{stat.value}</h3>
            <p className="text-xs font-medium mt-1" style={{ color: textSecondary }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ==================== MAIN BENTO GRID ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Enrolled Courses List (Enhanced UI) */}
          <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: cardBorder, boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(33,65,135,0.06)", backdropFilter: "blur(10px)" }}>
            <div className="flex items-center justify-between p-5 sm:p-6" style={{ borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(33,65,135,0.06)" }}>
              <div>
                <h2 className="text-lg font-black" style={{ color: textPrimary }}>Continue Learning</h2>
                <p className="text-xs mt-0.5" style={{ color: textSecondary }}>Pick up where you left off</p>
              </div>
              <Link href="/dashboard/courses" className="flex items-center gap-1 text-xs font-bold transition-colors duration-200" style={{ color: "#F3056D" }}>
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {ongoingCourses.length > 0 ? (
                ongoingCourses.slice(0, 4).map((course) => {
                  const CourseIcon = getIcon(course.icon);
                  const courseColor = course.color || "#214187";
                  
                  return (
                    <div 
                      key={course.id} 
                      className="course-card group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1" 
                      style={{ 
                        border: isDarkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(33,65,135,0.08)", 
                        boxShadow: isDarkMode ? "0 2px 10px rgba(0,0,0,0.2)" : "0 2px 10px rgba(33,65,135,0.05)" 
                      }} 
                      onMouseEnter={(e) => handleCourseMouseEnter(e, courseColor)} 
                      onMouseLeave={(e) => handleCourseMouseLeave(e)}
                    >
                      <div className="relative h-32 overflow-hidden">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${isDarkMode ? "rgba(26,16,53,0.9)" : "rgba(33,65,135,0.8)"}, transparent)` }} />
                        
                        <div className="absolute top-3 left-3 p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
                          <CourseIcon className="h-4 w-4 text-white" />
                        </div>
                        
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: courseColor === "#214187" ? "#fff" : courseColor }}>
                            {course.category}
                          </p>
                          <h3 className="text-sm font-bold text-white truncate">
                            {course.title}
                          </h3>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: textSecondary }}>
                          <PlayCircle className="h-3.5 w-3.5" /> 
                          <span>{course.nextLesson}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(33,65,135,0.08)" }}>
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${course.progress}%`, background: `linear-gradient(90deg, ${courseColor}, ${courseColor}cc)` }} />
                          </div>
                          <span className="text-xs font-black" style={{ color: courseColor }}>
                            {course.progress}%
                          </span>
                        </div>

                        <button className="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:opacity-80" style={{ background: `${courseColor}15`, color: courseColor }}>
                          <Play className="h-3.5 w-3.5" fill="currentColor" /> 
                          Resume
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 p-8 text-center">
                  <p className="text-sm" style={{ color: textSecondary }}>You haven't enrolled in any courses yet.</p>
                  <Link href="/courses" className="mt-4 inline-block px-5 py-2 text-xs font-bold rounded-xl text-white" style={{ background: "#F3056D" }}>
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================== RIGHT SIDEBAR WIDGETS ==================== */}
        <div className="space-y-6">
          
          {/* Upcoming Events / Exams Mock */}
          <div className="widget-card rounded-2xl overflow-hidden" style={{ background: cardBg, border: cardBorder, boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(33,65,135,0.06)", backdropFilter: "blur(10px)" }}>
            <div className="flex items-center justify-between p-5" style={{ borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(33,65,135,0.06)" }}>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" style={{ color: "#F3056D" }} />
                <h3 className="font-black text-sm" style={{ color: textPrimary }}>Upcoming</h3>
              </div>
              <Link href="/dashboard/schedule" className="text-[10px] font-bold" style={{ color: "#F3056D" }}>View All</Link>
            </div>
            <div className="p-4 space-y-3">
              {[
                { id: 1, title: "Math Live Quiz", time: "Today, 4:00 PM", color: "#F3056D", icon: "Target" },
                { id: 2, title: "Science Homework", time: "Tomorrow, 9:00 PM", color: "#ffd700", icon: "Clock" },
              ].map((item) => {
                const ItemIcon = getIcon(item.icon);
                return (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer" style={{ background: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(33,65,135,0.03)", borderLeft: `3px solid ${item.color}` }}>
                    <div className="p-2 rounded-xl flex-shrink-0" style={{ background: `${item.color}15` }}>
                      <ItemIcon className="h-4 w-4" style={{ color: item.color }} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate" style={{ color: textPrimary }}>{item.title}</h4>
                      <p className="text-[10px] mt-0.5" style={{ color: textSecondary }}>{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements Mock */}
          <div className="widget-card relative overflow-hidden rounded-2xl p-5" style={{ background: isDarkMode ? "linear-gradient(135deg, rgba(243,5,109,0.15) 0%, rgba(255,215,0,0.1) 100%)" : "linear-gradient(135deg, rgba(243,5,109,0.04) 0%, rgba(255,215,0,0.06) 100%)", border: isDarkMode ? "1px solid rgba(243,5,109,0.15)" : "1px solid rgba(243,5,109,0.1)" }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-30 -translate-y-1/2 translate-x-1/2" style={{ background: "#F3056D" }} />
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #F3056D, #ffd700)", boxShadow: "0 6px 20px rgba(243,5,109,0.3)" }}>
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-black text-sm mb-1" style={{ color: textPrimary }}>Achievement Unlocked!</h3>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: textSecondary }}>
                You&apos;ve completed over <span className="font-bold">{avgProgress}%</span> of your courses. Keep going!
              </p>
              <button className="flex items-center gap-2 text-xs font-bold transition-all duration-200 hover:gap-3" style={{ color: "#F3056D" }}>
                View All Badges
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Help */}
          <div className="widget-card rounded-2xl p-5" style={{ background: cardBg, border: cardBorder, boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(33,65,135,0.06)", backdropFilter: "blur(10px)" }}>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: "rgba(33,65,135,0.08)" }}>
                <Zap className="h-5 w-5" style={{ color: "#214187" }} />
              </div>
              <div>
                <h3 className="font-black text-sm mb-1" style={{ color: textPrimary }}>Need Help?</h3>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: textSecondary }}>
                  Check out our FAQs or contact support if you face any issues.
                </p>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:-translate-y-0.5" style={{ background: isDarkMode ? "rgba(33,65,135,0.15)" : "rgba(33,65,135,0.06)", color: "#214187", border: isDarkMode ? "1px solid rgba(33,65,135,0.2)" : "1px solid rgba(33,65,135,0.1)" }}>
                  <Sparkles className="h-3.5 w-3.5" />
                  Go to Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}