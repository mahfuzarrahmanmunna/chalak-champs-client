"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/app/context/ThemeContext";
import { useAuth } from "@/app/hooks/useAuth";
import gsap from "gsap";
import {
  BookOpen,
  Clock,
  Calendar,
  Award,
  Play,
  ChevronRight,
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
  Search,
  Filter,
  BookMarked,
  Receipt,
  CircleCheck,
  CircleX,
  Loader2,
  ShoppingBag,
  GraduationCap,
  X,
  Gift,
  Eye,
  Download,
  ExternalLink,
  Palette,
  Microscope,
  Code2,
  Music,
  Rocket,
  Pencil,
  Gamepad2,
  Heart,
} from "lucide-react";

// ===================== TYPES =====================

interface PurchasedCourse {
  _id: string;
  orderId?: string;
  tranId?: string;
  courseId: string;
  courseTitle: string;
  courseImage?: string;
  amount: string | number;
  status: "completed" | "pending" | "cancelled";
  paymentMethod?: string;
  addons?: number[];
  createdAt: string;
  verifiedAt?: string;
  // Enriched fields (from frontend join with courses API)
  category?: string;
  instructor?: string;
  description?: string;
  totalLessons?: number;
  image?: string;
  dates?: string;
  slug?: string;
}

// ===================== FALLBACK DATA =====================

const FALLBACK_COURSES: PurchasedCourse[] = [
  {
    _id: "enr_1",
    courseId: "course_123",
    courseTitle: "Fun with Numbers - Complete Math Course",
    amount: "4000",
    status: "completed",
    paymentMethod: "bkash",
    createdAt: "2024-11-15T10:30:00Z",
    verifiedAt: "2024-11-15T10:31:00Z",
    category: "Mathematics",
    instructor: "Ms. Sarah",
    totalLessons: 24,
    image:
      "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    dates: "03 Mar, 2024 - 31 Dec, 2024",
    slug: "fun-with-numbers",
  },
  {
    _id: "enr_2",
    courseId: "course_456",
    courseTitle: "Color & Shapes - Art Fundamentals",
    amount: "3500",
    status: "completed",
    paymentMethod: "nagad",
    createdAt: "2024-12-01T14:20:00Z",
    verifiedAt: "2024-12-01T14:22:00Z",
    category: "Art & Craft",
    instructor: "Mr. David",
    totalLessons: 18,
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    dates: "01 Jan, 2025 - 30 Jun, 2025",
    slug: "color-and-shapes",
  },
  {
    _id: "enr_3",
    courseId: "course_789",
    courseTitle: "Science Explorers - Lab Adventures",
    amount: "5000",
    status: "completed",
    paymentMethod: "card",
    createdAt: "2025-01-10T09:00:00Z",
    verifiedAt: "2025-01-10T09:05:00Z",
    category: "Science",
    instructor: "Dr. Emily",
    totalLessons: 20,
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    dates: "15 Jan, 2025 - 15 Jul, 2025",
    slug: "science-explorers",
  },
  {
    _id: "enr_4",
    courseId: "course_101",
    courseTitle: "Coding with Blocks - Beginner Programming",
    amount: "4500",
    status: "completed",
    paymentMethod: "bkash",
    createdAt: "2025-02-20T16:45:00Z",
    verifiedAt: "2025-02-20T16:47:00Z",
    category: "Technology",
    instructor: "Mr. Alex",
    totalLessons: 15,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    dates: "01 Mar, 2025 - 31 Aug, 2025",
    slug: "coding-with-blocks",
  },
  {
    _id: "enr_5",
    courseId: "course_202",
    courseTitle: "Music & Rhythm - Discover Sounds",
    amount: "3000",
    status: "completed",
    paymentMethod: "rocket",
    createdAt: "2025-03-05T11:30:00Z",
    verifiedAt: "2025-03-05T11:32:00Z",
    category: "Creative Arts",
    instructor: "Ms. Lily",
    totalLessons: 12,
    image:
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    dates: "10 Mar, 2025 - 10 Sep, 2025",
    slug: "music-and-rhythm",
  },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Mathematics: <Target className="h-4 w-4" />,
  "Art & Craft": <Palette className="h-4 w-4" />,
  Science: <Microscope className="h-4 w-4" />,
  Technology: <Code2 className="h-4 w-4" />,
  "Creative Arts": <Music className="h-4 w-4" />,
  Language: <Pencil className="h-4 w-4" />,
  General: <BookOpen className="h-4 w-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  Mathematics: "#F3056D",
  "Art & Craft": "#ffd700",
  Science: "#214187",
  Technology: "#F3056D",
  "Creative Arts": "#ffd700",
  Language: "#214187",
  General: "#F3056D",
};

type FilterTab = "all" | "active" | "completed";

// ===================== COMPONENT =====================

export default function MyCoursesPage() {
  const { isDarkMode } = useTheme();
  const { currentUser, appUser } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [courses, setCourses] = useState<PurchasedCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [selectedCourse, setSelectedCourse] = useState<PurchasedCourse | null>(
    null,
  );
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://apichalakchamps.vercel.app";

  // --- Fetch purchased courses ---
  // --- Fetch purchased courses ---
  useEffect(() => {
    const fetchCourses = async () => {
      if (!currentUser) {
        setCourses(FALLBACK_COURSES);
        setIsLoading(false);
        return;
      }

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(
          `${BACKEND_URL}/api/orders/user/${currentUser.uid}`,
          { signal: controller.signal },
        );
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          if (data.orders?.length > 0) {
            const mapped: PurchasedCourse[] = data.orders.map(
              (order: Record<string, unknown>) => ({
                _id: order._id,
                orderId: order.orderId,
                tranId: order.tranId,
                courseId: order.courseId,
                courseTitle: order.courseTitle,
                courseImage: order.courseImage,
                amount: order.totalAmount,
                status: "completed" as const,
                paymentMethod: order.paymentMethod,
                addons: order.addons,
                createdAt: order.createdAt,
                verifiedAt: order.verifiedAt,
              }),
            );
            setCourses(mapped);
            setIsLoading(false);
            return;
          }
        }

        // Fallback: try enrollments
        const identifier =
          currentUser.phoneNumber || currentUser.email || appUser?.email || "";
        if (identifier) {
          const enrController = new AbortController();
          const enrTimeout = setTimeout(() => enrController.abort(), 5000);

          const enrRes = await fetch(
            `${BACKEND_URL}/api/enrollments/user/${encodeURIComponent(identifier)}`,
            { signal: enrController.signal },
          );
          clearTimeout(enrTimeout);

          if (enrRes.ok) {
            const enrData = await enrRes.json();
            if (enrData.enrollments?.length > 0) {
              const mapped: PurchasedCourse[] = enrData.enrollments.map(
                (e: Record<string, unknown>) => ({
                  _id: e._id,
                  courseId: e.courseId,
                  courseTitle: e.courseTitle,
                  amount: e.amount,
                  status: e.status,
                  createdAt: e.createdAt,
                }),
              );
              setCourses(mapped);
              setIsLoading(false);
              return;
            }
          }
        }

        // Final fallback — silent, no console.error
        setCourses(FALLBACK_COURSES);
      } catch {
        // Network error / timeout / backend not running — use fallback silently
        setCourses(FALLBACK_COURSES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  
  // --- GSAP Animations ---
  useEffect(() => {
    if (isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".page-header",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      );
      gsap.fromTo(
        ".stats-row",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.15,
        },
      );
      gsap.fromTo(
        ".filter-tab",
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.06,
          ease: "power2.out",
          delay: 0.25,
        },
      );
      gsap.fromTo(
        ".course-item",
        { y: 25, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.35,
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [isLoading]);

  // --- Computed values ---
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Filter by tab
    if (activeFilter === "active") {
      result = result.filter((c) => c.status === "completed");
    } else if (activeFilter === "completed") {
      result = result.filter((c) => c.status === "completed");
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.courseTitle.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q) ||
          c.instructor?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [courses, activeFilter, searchQuery]);

  const totalSpent = courses.reduce(
    (sum, c) =>
      sum +
      (typeof c.amount === "number" ? c.amount : parseFloat(c.amount) || 0),
    0,
  );

  // --- Theme tokens ---
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

  // --- Format helpers ---
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // =================== RENDER: Loading ===================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse"
            style={{
              background: "linear-gradient(135deg, #F3056D, #ffd700)",
            }}
          >
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <p className="text-sm font-medium" style={{ color: textSecondary }}>
            Loading your courses...
          </p>
        </div>
      </div>
    );
  }

  // =================== RENDER: Main ===================

  return (
    <div className="space-y-6 max-w-7xl mx-auto" ref={containerRef}>
      {/* ==================== PAGE HEADER ==================== */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #F3056D 0%, #ff3d8f 100%)",
              boxShadow: "0 6px 20px rgba(243,5,109,0.3)",
            }}
          >
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1
              className="text-2xl sm:text-3xl font-black tracking-tight"
              style={{ color: textPrimary }}
            >
              My Courses
            </h1>
            <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
              {courses.length} course{courses.length !== 1 ? "s" : ""} purchased
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: textMuted }}
          />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl text-sm outline-none transition-all duration-300"
            style={{
              background: isDarkMode
                ? "rgba(255,255,255,0.05)"
                : "rgba(33,65,135,0.04)",
              border: isDarkMode
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(33,65,135,0.1)",
              color: textPrimary,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#F3056D";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(243,5,109,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = isDarkMode
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(33,65,135,0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-3.5 w-3.5" style={{ color: textMuted }} />
            </button>
          )}
        </div>
      </div>

      {/* ==================== STATS ROW ==================== */}
      <div className="stats-row grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Purchased",
            value: courses.length.toString(),
            icon: ShoppingBag,
            color: "#F3056D",
            bg: isDarkMode ? "rgba(243,5,109,0.1)" : "rgba(243,5,109,0.06)",
          },
          {
            label: "Active",
            value: courses
              .filter((c) => c.status === "completed")
              .length.toString(),
            icon: Play,
            color: "#214187",
            bg: isDarkMode ? "rgba(33,65,135,0.15)" : "rgba(33,65,135,0.06)",
          },
          {
            label: "Total Spent",
            value: `৳${totalSpent.toLocaleString()}`,
            icon: Receipt,
            color: "#ffd700",
            bg: isDarkMode ? "rgba(255,215,0,0.1)" : "rgba(255,215,0,0.08)",
          },
          {
            label: "Certificates",
            value: "02",
            icon: Award,
            color: "#F3056D",
            bg: isDarkMode ? "rgba(243,5,109,0.1)" : "rgba(243,5,109,0.06)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-default"
            style={{
              background: cardBg,
              border: cardBorder,
              boxShadow: isDarkMode
                ? "0 4px 20px rgba(0,0,0,0.2)"
                : "0 4px 20px rgba(33,65,135,0.06)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex justify-between items-start mb-2.5">
              <div className="p-2 rounded-xl" style={{ background: stat.bg }}>
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
            </div>
            <h3
              className="text-xl sm:text-2xl font-black"
              style={{ color: textPrimary }}
            >
              {stat.value}
            </h3>
            <p
              className="text-[11px] font-medium mt-0.5"
              style={{ color: textSecondary }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ==================== FILTER TABS ==================== */}
      <div className="flex items-center gap-2">
        {(
          [
            { key: "all", label: "All Courses", count: courses.length },
            {
              key: "active",
              label: "Active",
              count: courses.filter((c) => c.status === "completed").length,
            },
            { key: "completed", label: "Completed", count: 0 },
          ] as const
        ).map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className="filter-tab flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, #F3056D 0%, #ff3d8f 100%)"
                  : isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(33,65,135,0.04)",
                color: isActive ? "#fff" : textSecondary,
                border: isActive
                  ? "none"
                  : isDarkMode
                    ? "1px solid rgba(255,255,255,0.06)"
                    : "1px solid rgba(33,65,135,0.08)",
                boxShadow: isActive ? "0 4px 15px rgba(243,5,109,0.3)" : "none",
              }}
            >
              {tab.label}
              <span
                className="text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                style={{
                  background: isActive
                    ? "rgba(255,255,255,0.2)"
                    : isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(33,65,135,0.08)",
                  color: isActive ? "#fff" : textMuted,
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ==================== COURSE GRID ==================== */}
      {filteredCourses.length === 0 ? (
        /* --- Empty State --- */
        <div className="text-center py-20">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: isDarkMode
                ? "rgba(255,255,255,0.05)"
                : "rgba(33,65,135,0.04)",
              border: isDarkMode
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(33,65,135,0.08)",
            }}
          >
            <BookOpen className="h-10 w-10" style={{ color: textMuted }} />
          </div>
          <h3
            className="text-xl font-black mb-2"
            style={{ color: textPrimary }}
          >
            {searchQuery ? "No courses found" : "No courses yet!"}
          </h3>
          <p
            className="text-sm mb-6 max-w-sm mx-auto"
            style={{ color: textSecondary }}
          >
            {searchQuery
              ? `No courses match "${searchQuery}". Try a different search.`
              : "Start your learning journey by exploring our amazing courses!"}
          </p>
          {!searchQuery && (
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #F3056D 0%, #ff3d8f 100%)",
                boxShadow: "0 6px 20px rgba(243,5,109,0.3)",
              }}
            >
              <Sparkles className="h-4 w-4" />
              Browse Courses
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const category = course.category || "General";
            const catColor = CATEGORY_COLORS[category] || "#F3056D";
            const catIcon = CATEGORY_ICONS[category] || (
              <BookOpen className="h-4 w-4" />
            );
            const courseImage =
              course.image || course.courseImage || "/signup.webp";

            return (
              <div
                key={course._id}
                className="course-item group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  background: cardBg,
                  border: cardBorder,
                  boxShadow: isDarkMode
                    ? "0 4px 20px rgba(0,0,0,0.2)"
                    : "0 4px 20px rgba(33,65,135,0.06)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 12px 40px ${catColor}18`;
                  e.currentTarget.style.borderColor = `${catColor}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = isDarkMode
                    ? "0 4px 20px rgba(0,0,0,0.2)"
                    : "0 4px 20px rgba(33,65,135,0.06)";
                  e.currentTarget.style.borderColor = isDarkMode
                    ? "1px solid rgba(255,255,255,0.06)"
                    : "1px solid rgba(33,65,135,0.06)";
                }}
              >
                {/* --- Image Area --- */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={courseImage}
                    alt={course.courseTitle}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${isDarkMode ? "rgba(26,16,53,0.95)" : "rgba(33,65,135,0.9)"} 0%, transparent 60%)`,
                    }}
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <div
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-white backdrop-blur-sm"
                      style={{
                        background:
                          course.status === "completed"
                            ? "rgba(34,197,94,0.85)"
                            : course.status === "pending"
                              ? "rgba(245,158,11,0.85)"
                              : "rgba(239,68,68,0.85)",
                      }}
                    >
                      {course.status === "completed" ? (
                        <CircleCheck className="h-3 w-3" />
                      ) : course.status === "pending" ? (
                        <Clock className="h-3 w-3" />
                      ) : (
                        <CircleX className="h-3 w-3" />
                      )}
                      {course.status === "completed"
                        ? "Active"
                        : course.status === "pending"
                          ? "Pending"
                          : "Cancelled"}
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
                      style={{ background: `${catColor}cc` }}
                    >
                      {catIcon}
                      {category}
                    </div>
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300"
                      style={{
                        background: catColor,
                        boxShadow: `0 8px 25px ${catColor}50`,
                      }}
                    >
                      <Play className="h-6 w-6 text-white ml-1" fill="#fff" />
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 mb-1">
                      {course.courseTitle}
                    </h3>
                    {course.instructor && (
                      <p className="text-[11px] text-white/60 flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />
                        {course.instructor}
                      </p>
                    )}
                  </div>
                </div>

                {/* --- Content Area --- */}
                <div className="p-4">
                  {/* Meta Row */}
                  <div
                    className="flex items-center justify-between mb-3 pb-3"
                    style={{
                      borderBottom: isDarkMode
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "1px solid rgba(33,65,135,0.06)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {course.dates && (
                        <span
                          className="flex items-center gap-1 text-[10px] font-medium"
                          style={{ color: textMuted }}
                        >
                          <Calendar className="h-3 w-3" />
                          {course.dates.split("-")[0]?.trim()}
                        </span>
                      )}
                      {course.totalLessons && (
                        <span
                          className="flex items-center gap-1 text-[10px] font-medium"
                          style={{ color: textMuted }}
                        >
                          <BookMarked className="h-3 w-3" />
                          {course.totalLessons} lessons
                        </span>
                      )}
                    </div>
                    <span
                      className="text-xs font-black"
                      style={{ color: catColor }}
                    >
                      ৳
                      {typeof course.amount === "number"
                        ? course.amount.toLocaleString()
                        : course.amount}
                    </span>
                  </div>

                  {/* Purchase Info */}
                  <div
                    className="flex items-center justify-between text-[10px] mb-3"
                    style={{ color: textMuted }}
                  >
                    <span>Purchased: {formatDate(course.createdAt)}</span>
                    {course.paymentMethod && (
                      <span className="font-medium capitalize">
                        via {course.paymentMethod}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:-translate-y-0.5"
                      style={{
                        background: `linear-gradient(135deg, ${catColor} 0%, ${catColor}cc 100%)`,
                        color: "#fff",
                        boxShadow: `0 4px 12px ${catColor}25`,
                      }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Details
                    </button>
                    <button
                      className="p-2.5 rounded-xl transition-all duration-200"
                      style={{
                        background: isDarkMode
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(33,65,135,0.04)",
                        border: isDarkMode
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "1px solid rgba(33,65,135,0.1)",
                        color: textSecondary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#F3056D";
                        e.currentTarget.style.borderColor =
                          "rgba(243,5,109,0.3)";
                        e.currentTarget.style.background =
                          "rgba(243,5,109,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = textSecondary;
                        e.currentTarget.style.borderColor = isDarkMode
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "1px solid rgba(33,65,135,0.1)";
                        e.currentTarget.style.background = isDarkMode
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(33,65,135,0.04)";
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2.5 rounded-xl transition-all duration-200"
                      style={{
                        background: isDarkMode
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(33,65,135,0.04)",
                        border: isDarkMode
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "1px solid rgba(33,65,135,0.1)",
                        color: textSecondary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#214187";
                        e.currentTarget.style.borderColor =
                          "rgba(33,65,135,0.3)";
                        e.currentTarget.style.background =
                          "rgba(33,65,135,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = textSecondary;
                        e.currentTarget.style.borderColor = isDarkMode
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "1px solid rgba(33,65,135,0.1)";
                        e.currentTarget.style.background = isDarkMode
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(33,65,135,0.04)";
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== COURSE DETAIL MODAL ==================== */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          isDarkMode={isDarkMode}
          textPrimary={textPrimary}
          textSecondary={textSecondary}
          textMuted={textMuted}
          cardBg={cardBg}
          cardBorder={cardBorder}
          onClose={() => setSelectedCourse(null)}
        />
      )}

      {/* Shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

// ===================== DETAIL MODAL COMPONENT =====================

function CourseDetailModal({
  course,
  isDarkMode,
  textPrimary,
  textSecondary,
  textMuted,
  cardBg,
  cardBorder,
  onClose,
}: {
  course: PurchasedCourse;
  isDarkMode: boolean;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  cardBg: string;
  cardBorder: string;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const category = course.category || "General";
  const catColor = CATEGORY_COLORS[category] || "#F3056D";
  const catIcon = CATEGORY_ICONS[category] || <BookOpen className="h-4 w-4" />;
  const courseImage = course.image || course.courseImage || "/signup.webp";

  // GSAP modal entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".modal-backdrop",
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      );
      gsap.fromTo(
        ".modal-content",
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.5)",
          delay: 0.1,
        },
      );
      gsap.fromTo(
        ".modal-detail-item",
        { x: -15, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.35,
          stagger: 0.06,
          ease: "power2.out",
          delay: 0.25,
        },
      );
    }, modalRef);
    return () => ctx.revert();
  }, []);

  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      ref={modalRef}
      className="modal-backdrop fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-content w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background: isDarkMode ? "#1a1035" : "#fff",
          border: isDarkMode
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(33,65,135,0.08)",
          boxShadow: isDarkMode
            ? "0 30px 80px rgba(0,0,0,0.6)"
            : "0 30px 80px rgba(33,65,135,0.2)",
        }}
      >
        {/* Modal Header Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={courseImage}
            alt={course.courseTitle}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${isDarkMode ? "#1a1035" : "#fff"} 0%, transparent 70%)`,
            }}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <X className="h-4 w-4" />
          </button>

          {/* Category Badge */}
          <div className="absolute bottom-4 left-5">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white"
              style={{
                background: `${catColor}cc`,
                backdropFilter: "blur(10px)",
              }}
            >
              {catIcon}
              {category}
            </div>
          </div>

          {/* Status */}
          <div className="absolute bottom-4 right-5">
            <div
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold text-white"
              style={{
                background:
                  course.status === "completed"
                    ? "rgba(34,197,94,0.85)"
                    : "rgba(245,158,11,0.85)",
              }}
            >
              {course.status === "completed" ? (
                <CircleCheck className="h-3 w-3" />
              ) : (
                <Clock className="h-3 w-3" />
              )}
              {course.status === "completed" ? "Active" : "Pending"}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 -mt-2">
          <h2
            className="text-xl font-black mb-1 leading-snug"
            style={{ color: textPrimary }}
          >
            {course.courseTitle}
          </h2>
          {course.instructor && (
            <p
              className="text-sm mb-5 flex items-center gap-1.5"
              style={{ color: textSecondary }}
            >
              <GraduationCap className="h-4 w-4" />
              {course.instructor}
            </p>
          )}

          {/* Detail Items */}
          <div className="space-y-3 mb-6">
            {[
              {
                icon: <Receipt className="h-4 w-4" />,
                label: "Amount Paid",
                value: `৳${typeof course.amount === "number" ? course.amount.toLocaleString() : course.amount}`,
                highlight: true,
              },
              {
                icon: <Calendar className="h-4 w-4" />,
                label: "Purchase Date",
                value: formatDate(course.createdAt),
              },
              ...(course.verifiedAt
                ? [
                    {
                      icon: <CheckCircle2 className="h-4 w-4" />,
                      label: "Verified At",
                      value: formatDate(course.verifiedAt),
                    },
                  ]
                : []),
              ...(course.paymentMethod
                ? [
                    {
                      icon: <Star className="h-4 w-4" />,
                      label: "Payment Method",
                      value:
                        course.paymentMethod.charAt(0).toUpperCase() +
                        course.paymentMethod.slice(1),
                    },
                  ]
                : []),
              ...(course.orderId
                ? [
                    {
                      icon: <BookMarked className="h-4 w-4" />,
                      label: "Order ID",
                      value: course.orderId,
                    },
                  ]
                : []),
              ...(course.tranId
                ? [
                    {
                      icon: <Zap className="h-4 w-4" />,
                      label: "Transaction ID",
                      value: course.tranId,
                    },
                  ]
                : []),
              ...(course.dates
                ? [
                    {
                      icon: <Clock className="h-4 w-4" />,
                      label: "Course Period",
                      value: course.dates,
                    },
                  ]
                : []),
              ...(course.totalLessons
                ? [
                    {
                      icon: <BookOpen className="h-4 w-4" />,
                      label: "Total Lessons",
                      value: `${course.totalLessons} lessons`,
                    },
                  ]
                : []),
            ].map((item, i) => (
              <div
                key={i}
                className="modal-detail-item flex items-center justify-between py-3"
                style={{
                  borderBottom: isDarkMode
                    ? "1px solid rgba(255,255,255,0.05)"
                    : "1px solid rgba(33,65,135,0.06)",
                }}
              >
                <span
                  className="flex items-center gap-2.5 text-xs font-medium"
                  style={{ color: textSecondary }}
                >
                  <span style={{ color: textMuted }}>{item.icon}</span>
                  {item.label}
                </span>
                <span
                  className="text-xs font-bold text-right max-w-[60%] truncate"
                  style={{
                    color:
                      "highlight" in item && item.highlight
                        ? catColor
                        : textPrimary,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(135deg, ${catColor} 0%, ${catColor}cc 100%)`,
                boxShadow: `0 6px 20px ${catColor}30`,
              }}
            >
              <Play className="h-4 w-4" fill="#fff" />
              Continue Learning
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200"
              style={{
                background: isDarkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(33,65,135,0.04)",
                border: isDarkMode
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(33,65,135,0.1)",
                color: textSecondary,
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
