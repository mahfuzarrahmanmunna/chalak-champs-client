"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";
import { useAuth } from "@/app/hooks/useAuth";
import { useLanguage } from "@/app/context/LanguageContext";
import gsap from "gsap";
import Button from "@/app/ui/button/Button";
import { normalizeImageUrl } from "@/lib/normalizeImageUrl";

import {
  BookOpen,
  Clock,
  Calendar,
  Award,
  Play,
  CheckCircle2,
  Star,
  Target,
  Search,
  BookMarked,
  Receipt,
  ShoppingBag,
  GraduationCap,
  X,
  Eye,
  Palette,
  Microscope,
  Code2,
  Music,
  Pencil,
  Heart,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronDown,
  FileText,
  Timer,
  TrendingUp,
  Layers,
  CircleCheck,
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
  status: "completed" | "pending" | "cancelled" | "active";
  paymentMethod?: string;
  addons?: number[];
  createdAt: string;
  verifiedAt?: string;
  category?: string;
  instructor?: string;
  description?: string;
  totalLessons?: number;
  completedLessons?: number;
  image?: string;
  dates?: string;
  slug?: string;
  progress?: number;
  lastAccessed?: string;
  rating?: number;
  // New fields from enrollment
  enrolledAt?: string;
  source?: "enrollment" | "order";
}

// ===================== FALLBACK DATA =====================

const FALLBACK_COURSES: PurchasedCourse[] = [
  {
    _id: "enr_1",
    courseId: "66a6a0ff65e48775759432f51",
    courseTitle: "Fun with Numbers - Complete Math Course",
    amount: "4000",
    status: "active",
    paymentMethod: "bkash",
    createdAt: "2024-11-15T10:30:00Z",
    enrolledAt: "2024-11-15T10:31:00Z",
    category: "Mathematics",
    instructor: "Ms. Sarah",
    totalLessons: 24,
    completedLessons: 16,
    image:
      "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    dates: "03 Mar, 2024 - 31 Dec, 2024",
    slug: "fun-with-numbers",
    progress: 67,
    lastAccessed: "2025-06-14T15:30:00Z",
    rating: 4.8,
    source: "enrollment",
  },
  {
    _id: "enr_2",
    courseId: "66a6a0ff65e48775759432f52",
    courseTitle: "Color & Shapes - Art Fundamentals",
    amount: "3500",
    status: "active",
    paymentMethod: "nagad",
    createdAt: "2024-12-01T14:20:00Z",
    enrolledAt: "2024-12-01T14:22:00Z",
    category: "Art & Craft",
    instructor: "Mr. David",
    totalLessons: 18,
    completedLessons: 5,
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    dates: "01 Jan, 2025 - 30 Jun, 2025",
    slug: "color-and-shapes",
    progress: 28,
    lastAccessed: "2025-06-10T09:00:00Z",
    rating: 4.6,
    source: "enrollment",
  },
  {
    _id: "enr_3",
    courseId: "66a6a0ff65e48775759432f53",
    courseTitle: "Science Explorers - Lab Adventures",
    amount: "5000",
    status: "active",
    paymentMethod: "card",
    createdAt: "2025-01-10T09:00:00Z",
    enrolledAt: "2025-01-10T09:05:00Z",
    category: "Science",
    instructor: "Dr. Emily",
    totalLessons: 20,
    completedLessons: 17,
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    dates: "15 Jan, 2025 - 15 Jul, 2025",
    slug: "science-explorers",
    progress: 85,
    lastAccessed: "2025-06-14T18:00:00Z",
    rating: 4.9,
    source: "enrollment",
  },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Mathematics: <Target className="h-3.5 w-3.5" />,
  "Art & Craft": <Palette className="h-3.5 w-3.5" />,
  Science: <Microscope className="h-3.5 w-3.5" />,
  Technology: <Code2 className="h-3.5 w-3.5" />,
  "Creative Arts": <Music className="h-3.5 w-3.5" />,
  Language: <Pencil className="h-3.5 w-3.5" />,
  General: <BookOpen className="h-3.5 w-3.5" />,
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

type FilterTab = "all" | "active" | "completed" | "notstarted";
type ViewMode = "grid" | "list";
type SortOption = "recent" | "progress" | "name" | "price";

function SkeletonCard({ isList }: { isList: boolean }) {
  const { isDarkMode } = useTheme();
  const base = isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(33,65,135,0.04)";
  const shine = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(33,65,135,0.08)";

  if (isList) {
    return (
      <div
        className="flex gap-4 p-4 rounded-2xl"
        style={{
          background: base,
          border: isDarkMode
            ? "1px solid rgba(255,255,255,0.04)"
            : "1px solid rgba(33,65,135,0.04)",
        }}
      >
        <div
          className="w-28 h-20 rounded-xl flex-shrink-0 animate-pulse"
          style={{ background: shine }}
        />
        <div className="flex-1 space-y-2.5 py-1">
          <div
            className="h-4 rounded-lg w-3/4 animate-pulse"
            style={{ background: shine }}
          />
          <div
            className="h-3 rounded-lg w-1/3 animate-pulse"
            style={{ background: shine }}
          />
          <div
            className="h-2 rounded-full w-full animate-pulse"
            style={{ background: shine }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: base,
        border: isDarkMode
          ? "1px solid rgba(255,255,255,0.04)"
          : "1px solid rgba(33,65,135,0.04)",
      }}
    >
      <div className="h-44 animate-pulse" style={{ background: shine }} />
      <div className="p-4 space-y-3">
        <div
          className="h-4 rounded-lg w-4/5 animate-pulse"
          style={{ background: shine }}
        />
        <div
          className="h-3 rounded-lg w-1/3 animate-pulse"
          style={{ background: shine }}
        />
        <div
          className="h-2 rounded-full w-full animate-pulse"
          style={{ background: shine }}
        />
        <div className="flex gap-2 pt-1">
          <div
            className="h-9 rounded-xl flex-1 animate-pulse"
            style={{ background: shine }}
          />
          <div
            className="w-9 h-9 rounded-xl animate-pulse"
            style={{ background: shine }}
          />
        </div>
      </div>
    </div>
  );
}

export default function MyCoursesPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { isBangla } = useLanguage();
  const { currentUser, appUser } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [courses, setCourses] = useState<PurchasedCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ===================== FETCH COURSES =====================
  useEffect(() => {
    const fetchCourses = async () => {
      if (!currentUser) {
        setCourses(FALLBACK_COURSES);
        setIsLoading(false);
        return;
      }

      try {
        let mapped: PurchasedCourse[] = [];

        // ========== PRIORITY 1: Fetch from NEW Enrollment API ==========
        try {
          const idToken = await currentUser.getIdToken();
          const enrRes = await fetch(`${BACKEND_URL}/api/enrollments/my-enrollments`, {
            headers: { Authorization: `Bearer ${idToken}` },
          });

          if (enrRes.ok) {
            const enrData = await enrRes.json();
            if (enrData.success && enrData.data?.length > 0) {
              console.log(`✅ Loaded ${enrData.data.length} courses from Enrollment API`);
              mapped = enrData.data.map((e: Record<string, any>) => {
                const course = e.course || {};
                const title = course.title?.en || course.title?.bn || course.title || "Untitled Course";
                const image = course.thumbnail || "";

                return {
                  _id: e._id,
                  courseId: course._id?.toString() || "",
                  courseTitle: title,
                  courseImage: image,
                  amount: course.offerPrice || course.originalPrice || 0,
                  status: "active" as const,
                  paymentMethod: "manual",
                  createdAt: e.enrolledAt || e.createdAt,
                  verifiedAt: e.verifiedAt,
                  category: course.category?.en || course.category?.bn || "General",
                  instructor: course.instructorName || course.instructor?.firstName || "",
                  slug: course.slug || "",
                  progress: 0,
                  lastAccessed: e.lastAccessed || null,
                  source: "enrollment" as const,
                };
              });
            }
          }
        } catch (err) {
          console.log("⚠️ Enrollment API failed, trying Orders API...", err.message);
        }

        // ========== FALLBACK 2: Fetch from OLD Orders API ==========
        if (mapped.length === 0) {
          try {
            const idToken = await currentUser.getIdToken();
            const orderRes = await fetch(
              `${BACKEND_URL}/api/orders/user/${currentUser.uid}`,
              {
                headers: { Authorization: `Bearer ${idToken}` },
              },
            );

            if (orderRes.ok) {
              const orderData = await orderRes.json();
              if (orderData.orders?.length > 0) {
                console.log(`✅ Loaded ${orderData.orders.length} courses from Orders API`);

                const validOrders = orderData.orders.filter(
                  (order: Record<string, any>) => {
                    const courseId = typeof order.courseId === "string" ? order.courseId : "";
                    return courseId && /^[0-9a-fA-F]{24}$/.test(courseId);
                  },
                );

                mapped = await Promise.all(
                  validOrders.map(async (order: Record<string, any>) => {
                    const courseId = order.courseId as string;
                    let courseSlug = "";
                    let courseTitle = "Untitled Course";
                    let courseImage = "";

                    try {
                      const courseRes = await fetch(
                        `${BACKEND_URL}/api/courses/${courseId}`,
                        {
                          headers: { Authorization: `Bearer ${idToken}` },
                        },
                      );

                      if (courseRes.ok) {
                        const courseData = await courseRes.json();
                        const fullCourse =
                          courseData.course || courseData.data || courseData;

                        courseSlug = fullCourse?.slug || "";
                        courseTitle =
                          fullCourse?.title?.en ||
                          fullCourse?.title?.bn ||
                          fullCourse?.title ||
                          courseTitle;
                        courseImage = fullCourse?.thumbnail || "";
                      }
                    } catch {
                      // Silent fail - skip this order detail fetch issue
                    }

                    return {
                      _id: order._id as string,
                      orderId: order.orderId as string,
                      tranId: order.tranId as string,
                      courseId,
                      courseTitle,
                      courseImage,
                      amount: order.totalAmount as string,
                      status: "completed" as const,
                      paymentMethod: order.paymentMethod as string,
                      createdAt: order.createdAt as string,
                      verifiedAt: order.verifiedAt as string,
                      slug: courseSlug,
                      source: "order" as const,
                    };
                  }),
                );
              }
            }
          } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            console.log("⚠️ Orders API also failed, using fallback data", message);
          }
        }

        // ========== FALLBACK 3: Use static fallback ==========
        if (mapped.length === 0) {
          console.log("⚠️ Both APIs failed, using fallback data");
          mapped = FALLBACK_COURSES;
        }

        setCourses(mapped);
      } catch (err) {
        console.error("Fetch error:", err);
        setCourses(FALLBACK_COURSES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [currentUser]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-sort-menu]")) setShowSortMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
        ".toolbar-row",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.25 },
      );
      gsap.fromTo(
        ".course-item",
        { y: 25, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.07,
          ease: "power2.out",
          delay: 0.35,
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [isLoading, viewMode]);

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (activeFilter === "active")
      result = result.filter(
        (c) =>
          c.status === "active" &&
          (c.progress || 0) > 0 &&
          (c.progress || 0) < 100,
      );
    else if (activeFilter === "completed")
      result = result.filter((c) => (c.progress || 0) >= 100);
    else if (activeFilter === "notstarted")
      result = result.filter((c) => (c.progress || 0) === 0);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.courseTitle.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q) ||
          c.instructor?.toLowerCase().includes(q),
      );
    }

    if (sortBy === "recent")
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    else if (sortBy === "progress")
      result.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    else if (sortBy === "name")
      result.sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));
    else if (sortBy === "price")
      result.sort(
        (a, b) => parseFloat(String(b.amount)) - parseFloat(String(a.amount)),
      );

    return result;
  }, [courses, activeFilter, searchQuery, sortBy]);

  const totalSpent = courses.reduce(
    (sum, c) =>
      sum +
      (typeof c.amount === "number" ? c.amount : parseFloat(c.amount) || 0),
    0,
  );
  const avgProgress = courses.length
    ? Math.round(
        courses.reduce((sum, c) => sum + (c.progress || 0), 0) / courses.length,
      )
    : 0;

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

  const getTimeAgo = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(dateStr);
  };

  const getPaymentIcon = (method?: string) => {
    const m = method?.toLowerCase() || "";
    if (m.includes("bkash")) return "bKash";
    if (m.includes("nagad")) return "Nagad";
    if (m.includes("rocket")) return "Rocket";
    if (m.includes("card")) return "Card";
    return method || "—";
  };

  const getPaymentColor = (method?: string) => {
    const m = method?.toLowerCase() || "";
    if (m.includes("bkash")) return "#E2136E";
    if (m.includes("nagad")) return "#F6921E";
    if (m.includes("rocket")) return "#8C3494";
    return textMuted;
  };

  const goToCourse = (course: PurchasedCourse) => {
    if (course.status === "pending") return;
    const langPrefix = isBangla ? "bn" : "en";
    const courseIdentifier = course.slug || course.courseId;
    router.push(`/${langPrefix}/dashboard/mycourses/${courseIdentifier}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl animate-pulse"
            style={{
              background: isDarkMode
                ? "rgba(255,255,255,0.06)"
                : "rgba(33,65,135,0.06)",
            }}
          />
          <div className="space-y-2">
            <div
              className="h-7 w-48 rounded-lg animate-pulse"
              style={{
                background: isDarkMode
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(33,65,135,0.06)",
              }}
            />
            <div
              className="h-4 w-32 rounded-lg animate-pulse"
              style={{
                background: isDarkMode
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(33,65,135,0.04)",
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl space-y-3 animate-pulse"
              style={{
                background: isDarkMode
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(33,65,135,0.03)",
                border: isDarkMode
                  ? "1px solid rgba(255,255,255,0.04)"
                  : "1px solid rgba(33,65,135,0.04)",
              }}
            >
              <div
                className="h-8 w-8 rounded-xl animate-pulse"
                style={{
                  background: isDarkMode
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(33,65,135,0.06)",
                }}
              />
              <div
                className="h-6 w-16 rounded-lg animate-pulse"
                style={{
                  background: isDarkMode
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(33,65,135,0.06)",
                }}
              />
              <div
                className="h-3 w-20 rounded-lg animate-pulse"
                style={{
                  background: isDarkMode
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(33,65,135,0.04)",
                }}
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} isList={false} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto" ref={containerRef}>
      {/* PAGE HEADER */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #F3056D 0%, #ff3d8f 100%)",
                boxShadow: "0 6px 20px rgba(243,5,109,0.3)",
              }}
            >
              <BookOpen className="h-7 w-7 text-white relative z-10" />
            </div>
            <div>
              <h1
                className="text-2xl sm:text-3xl font-black tracking-tight"
                style={{ color: textPrimary }}
              >
                My Courses
              </h1>
              <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                {courses.length} course{courses.length !== 1 ? "s" : ""}{" "}
                purchased · ৳{totalSpent.toLocaleString()} total invested
              </p>
            </div>
          </div>
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: textMuted }}
            />
            <input
              type="text"
              placeholder="Search by title, category, instructor..."
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
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(243,5,109,0.1)";
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
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md transition-colors"
                style={{ color: textMuted }}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="stats-row grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Purchased",
            value: courses.length.toString(),
            icon: ShoppingBag,
            color: "#F3056D",
            bg: isDarkMode ? "rgba(243,5,109,0.1)" : "rgba(243,5,109,0.06)",
            sub: `${courses.filter((c) => c.status === "pending").length} pending`,
          },
          {
            label: "In Progress",
            value: courses
              .filter((c) => (c.progress || 0) > 0 && (c.progress || 0) < 100)
              .length.toString(),
            icon: Play,
            color: "#214187",
            bg: isDarkMode ? "rgba(33,65,135,0.15)" : "rgba(33,65,135,0.06)",
            sub: `Avg ${avgProgress}% done`,
          },
          {
            label: "Total Spent",
            value: `৳${totalSpent.toLocaleString()}`,
            icon: Receipt,
            color: "#ffd700",
            bg: isDarkMode ? "rgba(255,215,0,0.1)" : "rgba(255,215,0,0.08)",
            sub: `Avg ৳${courses.length ? Math.round(totalSpent / courses.length).toLocaleString() : 0}/course`,
          },
          {
            label: "Completed",
            value: courses
              .filter((c) => (c.progress || 0) >= 100)
              .length.toString(),
            icon: Award,
            color: "#4ade80",
            bg: isDarkMode ? "rgba(74,222,128,0.1)" : "rgba(74,222,128,0.06)",
            sub: "Certificates earned",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group p-4 sm:p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-default relative overflow-hidden"
            style={{
              background: cardBg,
              border: cardBorder,
              boxShadow: isDarkMode
                ? "0 4px 20px rgba(0,0,0,0.2)"
                : "0 4px 20px rgba(33,65,135,0.06)",
            }}
          >
            <div
              className="absolute top-0 left-4 right-4 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(90deg, ${stat.color}, transparent)`,
              }}
            />
            <div className="flex justify-between items-start mb-3">
              <div
                className="p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: stat.bg }}
              >
                <stat.icon
                  className="h-4.5 w-4.5"
                  style={{ color: stat.color }}
                />
              </div>
              <TrendingUp
                className="h-3.5 w-3.5 opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                style={{ color: stat.color }}
              />
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
            <p
              className="text-[9px] mt-1 font-medium"
              style={{ color: textMuted }}
            >
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="toolbar-row flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {(
            [
              { key: "all", label: "All", count: courses.length },
              {
                key: "active",
                label: "In Progress",
                count: courses.filter(
                  (c) => (c.progress || 0) > 0 && (c.progress || 0) < 100,
                ).length,
              },
              {
                key: "completed",
                label: "Completed",
                count: courses.filter((c) => (c.progress || 0) >= 100).length,
              },
              {
                key: "notstarted",
                label: "Not Started",
                count: courses.filter((c) => (c.progress || 0) === 0).length,
              },
            ] as const
          ).map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className="filter-tab flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300"
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
                  boxShadow: isActive
                    ? "0 4px 15px rgba(243,5,109,0.3)"
                    : "none",
                }}
              >
                {tab.label}
                <span
                  className="text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
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
        <div className="flex items-center gap-2">
          <div className="relative" data-sort-menu>
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
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
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sort</span>
              <ChevronDown
                className="h-3 w-3 transition-transform duration-200"
                style={{
                  transform: showSortMenu ? "rotate(180deg)" : "rotate(0)",
                }}
              />
            </button>
            {showSortMenu && (
              <div
                className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden z-50"
                style={{
                  background: isDarkMode ? "#1a1035" : "#fff",
                  border: isDarkMode
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(33,65,135,0.08)",
                  boxShadow: isDarkMode
                    ? "0 12px 40px rgba(0,0,0,0.5)"
                    : "0 12px 40px rgba(33,65,135,0.12)",
                }}
              >
                {[
                  {
                    key: "recent" as SortOption,
                    label: "Most Recent",
                    icon: Clock,
                  },
                  {
                    key: "progress" as SortOption,
                    label: "Progress",
                    icon: TrendingUp,
                  },
                  {
                    key: "name" as SortOption,
                    label: "Name A-Z",
                    icon: FileText,
                  },
                  {
                    key: "price" as SortOption,
                    label: "Price High-Low",
                    icon: Receipt,
                  },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setSortBy(opt.key);
                      setShowSortMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-colors duration-150"
                    style={{
                      color: sortBy === opt.key ? "#F3056D" : textSecondary,
                      background:
                        sortBy === opt.key
                          ? isDarkMode
                            ? "rgba(243,5,109,0.08)"
                            : "rgba(243,5,109,0.04)"
                          : "transparent",
                    }}
                  >
                    <opt.icon className="h-3.5 w-3.5" />
                    {opt.label}
                    {sortBy === opt.key && (
                      <CheckCircle2 className="h-3.5 w-3.5 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div
            className="flex rounded-xl overflow-hidden"
            style={{
              background: isDarkMode
                ? "rgba(255,255,255,0.05)"
                : "rgba(33,65,135,0.04)",
              border: isDarkMode
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(33,65,135,0.1)",
            }}
          >
            {[
              { mode: "grid" as ViewMode, icon: LayoutGrid },
              { mode: "list" as ViewMode, icon: List },
            ].map(({ mode, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="p-2.5 transition-all duration-200"
                style={{
                  background:
                    viewMode === mode
                      ? isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(33,65,135,0.08)"
                      : "transparent",
                  color: viewMode === mode ? textPrimary : textMuted,
                }}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COURSE GRID / LIST */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-24">
          <div
            className="w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-6 relative"
            style={{
              background: isDarkMode
                ? "rgba(255,255,255,0.04)"
                : "rgba(33,65,135,0.03)",
              border: isDarkMode
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(33,65,135,0.06)",
            }}
          >
            <BookOpen className="h-12 w-12" style={{ color: textMuted }} />
          </div>
          <h3
            className="text-xl font-black mb-2"
            style={{ color: textPrimary }}
          >
            {searchQuery ? "No courses found" : "No courses in this view"}
          </h3>
          <p
            className="text-sm mb-6 max-w-sm mx-auto"
            style={{ color: textSecondary }}
          >
            {searchQuery
              ? `No courses match "${searchQuery}". Try a different search term.`
              : "Try switching to a different filter tab to see your courses."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300"
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
              <X className="h-3.5 w-3.5" />
              Clear Search
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* ========== GRID VIEW ========== */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const category = course.category || "General";
            const catColor = CATEGORY_COLORS[category] || "#F3056D";
            const catIcon = CATEGORY_ICONS[category] || (
              <BookOpen className="h-3.5 w-3.5" />
            );
            const courseImage =
              normalizeImageUrl(
                course.image || course.courseImage || "/signup.webp",
              );
            const progress = course.progress || 0;
            const isNotStarted = progress === 0;
            const isComplete = progress >= 100;
            const isPending = course.status === "pending";
            const isGold = catColor === "#ffd700";

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
                onClick={() => goToCourse(course)}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={courseImage}
                    alt={course.courseTitle}
                    className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${isDarkMode ? "rgba(26,16,53,0.95)" : "rgba(33,65,135,0.9)"} 0%, ${isDarkMode ? "rgba(26,16,53,0.3)" : "rgba(33,65,135,0.3)"} 50%, transparent 100%)`,
                    }}
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    {isPending && (
                      <div
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold text-white backdrop-blur-md"
                        style={{ background: "rgba(245,158,11,0.85)" }}
                      >
                        <Clock className="h-3 w-3" />
                        Pending
                      </div>
                    )}
                    {isComplete && (
                      <div
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold text-white backdrop-blur-md"
                        style={{ background: "rgba(74,222,128,0.85)" }}
                      >
                        <CircleCheck className="h-3 w-3" />
                        Done
                      </div>
                    )}
                  </div>
                  <div className="absolute top-3 left-3">
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md"
                      style={{ background: `${catColor}cc` }}
                    >
                      {catIcon}
                      {category}
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 mb-1">
                      {course.courseTitle}
                    </h3>
                    <div className="flex items-center gap-2">
                      {course.instructor && (
                        <span className="text-[10px] text-white/60 flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {course.instructor}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-[10px] font-bold"
                        style={{
                          color: isComplete
                            ? "#4ade80"
                            : progress > 0
                              ? catColor
                              : textMuted,
                        }}
                      >
                        {isComplete
                          ? "Course Complete!"
                          : isNotStarted
                            ? "Not started"
                            : `${progress}% complete`}
                      </span>
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: textMuted }}
                      >
                        {course.completedLessons || 0}/
                        {course.totalLessons || 0} lessons
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{
                        background: isDarkMode
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(33,65,135,0.08)",
                      }}
                    >
                      <div
                        className="h-full rounded-full relative overflow-hidden transition-all duration-1000"
                        style={{
                          width: `${progress}%`,
                          background: isComplete
                            ? "linear-gradient(90deg, #4ade80, #22c55e)"
                            : `linear-gradient(90deg, ${catColor}, ${catColor}bb)`,
                        }}
                      >
                        {!isNotStarted && (
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                              animation: "shimmer 2s infinite",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-between mb-3 pb-3"
                    style={{
                      borderBottom: isDarkMode
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "1px solid rgba(33,65,135,0.05)",
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      {course.dates && (
                        <span
                          className="flex items-center gap-1 text-[10px] font-medium"
                          style={{ color: textMuted }}
                        >
                          <Calendar className="h-3 w-3" />
                          {formatDate(course.createdAt)}
                        </span>
                      )}
                      {course.lastAccessed && (
                        <span
                          className="flex items-center gap-1 text-[10px] font-medium"
                          style={{ color: textMuted }}
                        >
                          <Timer className="h-3 w-3" />
                          {getTimeAgo(course.lastAccessed)}
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
                  <div className="flex items-center justify-between text-[10px] mb-3">
                    <span style={{ color: textMuted }}>
                      {formatDate(course.createdAt)}
                    </span>
                    {course.paymentMethod && (
                      <span
                        className="font-bold text-[9px] px-2 py-0.5 rounded-md"
                        style={{
                          color: getPaymentColor(course.paymentMethod),
                          background: `${getPaymentColor(course.paymentMethod)}12`,
                        }}
                      >
                        {getPaymentIcon(course.paymentMethod)}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {isPending ? (
                      <Button
                        bgColor={
                          isDarkMode
                            ? "rgba(245,158,11,0.12)"
                            : "rgba(245,158,11,0.08)"
                        }
                        highlightColor="rgba(245,158,11,0.2)"
                        darkShadowColor="rgba(245,158,11,0.1)"
                        textColor={isDarkMode ? "#f59e0b" : "#d97706"}
                        className="flex-1 cursor-not-allowed border border-amber-500/20"
                        px="px-4"
                        py="py-2.5"
                        textSize="text-xs"
                        icon={<Clock className="h-3.5 w-3.5" />}
                      >
                        Pending
                      </Button>
                    ) : (
                      <Link
                        href={`/${isBangla ? "bn" : "en"}/dashboard/mycourses/${course.slug || course.courseId}`}
                        className="flex-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          bgColor="linear-gradient(135deg, #214187 0%, #002d4d 100%)"
                          highlightColor="#003a66"
                          textColor="#fff"
                          className="flex-1 w-full"
                          px="px-4"
                          py="py-2.5"
                          textSize="text-xs"
                          icon={<Play className="h-3.5 w-3.5" />}
                        >
                          {isComplete ? "View Course" : "Start Learning"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ========== LIST VIEW ========== */
        <div className="space-y-4">
          {filteredCourses.map((course) => {
            const category = course.category || "General";
            const catColor = CATEGORY_COLORS[category] || "#F3056D";
            const catIcon = CATEGORY_ICONS[category] || (
              <BookOpen className="h-3.5 w-3.5" />
            );
            const courseImage =
              normalizeImageUrl(
                course.image || course.courseImage || "/signup.webp",
              );
            const progress = course.progress || 0;
            const isNotStarted = progress === 0;
            const isComplete = progress >= 100;
            const isPending = course.status === "pending";

            return (
              <div
                key={course._id}
                className="course-item group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
                onClick={() => goToCourse(course)}
              >
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-xl relative overflow-hidden flex-shrink-0 border border-gray-200">
                    <img
                      src={courseImage}
                      alt={course.courseTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
                        style={{ background: `${catColor}15`, color: catColor }}
                      >
                        {catIcon}
                      </span>
                      {category}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-1">
                      {course.courseTitle}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-medium text-gray-500">
                        {course.instructor || "Instructor"}
                      </span>
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
                  </div>
                  <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400">
                    <span>{formatDate(course.createdAt)}</span>
                    {course.paymentMethod && (
                      <span
                        className="font-bold text-[9px] px-2 py-0.5 rounded-md"
                        style={{
                          color: getPaymentColor(course.paymentMethod),
                          background: `${getPaymentColor(course.paymentMethod)}12`,
                        }}
                      >
                        {getPaymentIcon(course.paymentMethod)}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-[10px] font-bold"
                        style={{
                          color: isComplete
                            ? "#4ade80"
                            : progress > 0
                              ? catColor
                              : textMuted,
                        }}
                      >
                        {isComplete
                          ? "Course Complete!"
                          : isNotStarted
                            ? "Not started"
                            : `${progress}% complete`}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400">
                        {course.completedLessons || 0}/
                        {course.totalLessons || 0} lessons
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${progress}%`,
                          background: isComplete
                            ? "linear-gradient(90deg, #4ade80, #22c55e)"
                            : `linear-gradient(90deg, ${catColor}, ${catColor}bb)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-end gap-2">
                    {isPending && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-amber-700 border border-amber-200 bg-amber-50">
                        Pending
                      </span>
                    )}
                    {isComplete && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-700 border border-emerald-200 bg-emerald-50">
                        Completed
                      </span>
                    )}
                    {progress > 0 && !isComplete && (
                      <Link
                        href={`/${isBangla ? "bn" : "en"}/dashboard/mycourses/${course.slug || course.courseId}`}
                        className="text-[10px] text-[#214187] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Continue →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
