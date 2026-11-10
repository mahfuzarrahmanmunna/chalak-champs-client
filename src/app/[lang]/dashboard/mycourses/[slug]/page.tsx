// src/app/[lang]/mycourses/[slug]/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import { useAuth } from "@/app/hooks/useAuth";
import gsap from "gsap";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  BookOpen,
  ChevronDown,
  AlertCircle,
  Loader2,
  FileText,
  GraduationCap,
  Layers,
  Video,
  FileQuestion,
  Link2,
  CreditCard,
  PartyPopper,
} from "lucide-react";

// Types
interface Lesson {
  _id: string;
  title: string | { en: string; bn: string };
  type: string;
  videoUrl?: string;
  content?: string;
  duration?: number;
  isFreePreview?: boolean;
}

interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseData {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  instructor?: string;
  modules: Module[];
}

interface CourseProgress {
  completedLessons: string[];
  lastAccessedModule: string;
  lastAccessedLesson: string;
  progressPercentage: number;
  completedLessonsCount: number;
  totalLessons: number;
}

// Helpers
const formatImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

const getLessonTitle = (title: any) => {
  if (!title) return "Untitled Lesson";
  if (typeof title === "string") return title;
  return title.en || title.bn || "Untitled Lesson";
};

const getYouTubeEmbedUrl = (url?: string) => {
  if (!url) return null;
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&playsinline=1`;
  }
  return null;
};

const LessonTypeIcon = ({
  type,
  className,
}: {
  type: string;
  className?: string;
}) => {
  const c = className || "w-4 h-4";
  switch (type?.toLowerCase()) {
    case "video":
      return <Video className={`${c} text-red-500`} />;
    case "article":
    case "text":
      return <FileText className={`${c} text-blue-500`} />;
    case "quiz":
    case "exam":
    case "assignment":
      return <FileQuestion className={`${c} text-amber-500`} />;
    case "link":
    case "resource":
      return <Link2 className={`${c} text-green-500`} />;
    default:
      return <FileText className={`${c} text-gray-400`} />;
  }
};

export default function CourseLearningPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { currentUser, loading: authLoading } = useAuth();

  const containerRef = useRef<HTMLDivElement>(null);

  const [course, setCourse] = useState<CourseData | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProgress, setIsSavingProgress] = useState(false); // Prevents race conditions
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(),
  );
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://chalakchampsbackend.vercel.app";

  const updateLastAccessed = async (
    moduleId: string,
    lessonId: string,
    token: string,
    courseId?: string,
  ) => {
    if (!courseId) return;

    try {
      setIsSavingProgress(true);
      const res = await fetch(
        `${BACKEND_URL}/api/courses/${courseId}/progress/last-accessed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ moduleId, lessonId }),
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.warn(
          "Failed to save last accessed lesson:",
          errData.message || res.statusText,
        );
      }
    } catch (err) {
      console.warn("Error updating last accessed lesson:", err);
    } finally {
      setIsSavingProgress(false);
    }
  };

  // 1. Fetch Course & Progress
  useEffect(() => {
    if (authLoading) return;

    const fetchCourseData = async () => {
      if (!currentUser || !slug) {
        if (!currentUser) router.push("/login");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const token = await currentUser.getIdToken();

        // Fetch Course Details
        const courseRes = await fetch(
          `${BACKEND_URL}/api/courses/slug/${slug}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!courseRes.ok) throw new Error("Failed to load course data.");
        const courseJson = await courseRes.json();
        const courseDetails =
          courseJson.data?.[0] || courseJson.course || courseJson.data;

        if (!courseDetails) throw new Error("Course not found.");

        // Fetch Modules & Lessons
        const modulesRes = await fetch(
          `${BACKEND_URL}/api/courses/${courseDetails._id}/modules`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (modulesRes.status === 403) {
          setIsEnrolled(false);
          setCourse({
            _id: courseDetails._id,
            title: courseDetails.title?.en || courseDetails.title || "Course",
            instructor:
              courseDetails.instructorName ||
              courseDetails.instructor?.firstName ||
              "Instructor",
            thumbnail: formatImageUrl(courseDetails.thumbnail),
            modules: [],
          });
          return;
        }

        if (!modulesRes.ok) throw new Error("Failed to load course modules.");

        const modulesJson = await modulesRes.json();
        const modulesData =
          modulesJson.data || modulesJson.modules || modulesJson;

        const fullCourseData: CourseData = {
          _id: courseDetails._id,
          title:
            courseDetails.title?.en || courseDetails.title || "Untitled Course",
          description:
            courseDetails.description?.en || courseDetails.description,
          instructor:
            courseDetails.instructorName ||
            courseDetails.instructor?.firstName ||
            "Instructor",
          thumbnail: formatImageUrl(courseDetails.thumbnail),
          modules: Array.isArray(modulesData) ? modulesData : [],
        };

        setCourse(fullCourseData);
        setIsEnrolled(true);

        // ✅ FETCH USER PROGRESS
        const progressRes = await fetch(
          `${BACKEND_URL}/api/courses/${courseDetails._id}/progress`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!progressRes.ok) throw new Error("Failed to load progress.");
        const progressJson = await progressRes.json();
        const userProgress: CourseProgress = progressJson.data;
        setProgress(userProgress);

        // ✅ RESUME LOGIC
        if (fullCourseData.modules?.length > 0) {
          const flatLessons = fullCourseData.modules.flatMap((m) => m.lessons);

          // Find saved lesson
          const savedLesson = flatLessons.find(
            (l) => l._id === userProgress.lastAccessedLesson,
          );
          const savedModule = fullCourseData.modules.find(
            (m) => m._id === userProgress.lastAccessedModule,
          );

          if (savedLesson && savedModule) {
            setActiveLesson(savedLesson);
            setActiveModuleId(savedModule._id);
            setExpandedModules(new Set([savedModule._id]));
          } else {
            // Fallback to M1/L1 if no saved progress
            const firstModule = fullCourseData.modules[0];
            const firstLesson = firstModule.lessons[0];
            setActiveLesson(firstLesson);
            setActiveModuleId(firstModule._id);
            setExpandedModules(new Set([firstModule._id]));

            // Save initial progress to DB
            updateLastAccessed(firstModule._id, firstLesson._id, token);
          }
        }
      } catch (err: any) {
        console.error("Error fetching course:", err);
        setError(err.message || "An error occurred while loading the course.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [currentUser, authLoading, slug, BACKEND_URL, router]);

  // GSAP Animations
  useEffect(() => {
    if (isLoading || error || !isEnrolled) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".learn-header",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      );
      gsap.fromTo(
        ".learn-content",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: "power2.out" },
      );
      gsap.fromTo(
        ".learn-sidebar",
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: "power2.out" },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [isLoading, error, isEnrolled]);

  // Toast Auto-dismiss
  useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => setToast({ show: false, message: "" }), 3000);
      return () => clearTimeout(t);
    }
  }, [toast.show]);

  const allLessons = course?.modules.flatMap((mod) => mod.lessons) || [];
  const currentIndex = activeLesson
    ? allLessons.findIndex((l) => l._id === activeLesson._id)
    : -1;
  const hasPrevLesson = currentIndex > 0;
  const hasNextLesson =
    currentIndex !== -1 && currentIndex < allLessons.length - 1;

  // ✅ Helper: Check completion state from DB source of truth
  const isLessonCompleted = (lessonId: string) => {
    return progress?.completedLessons.includes(lessonId) || false;
  };

  // ✅ Helper: Check if a lesson is accessible based on sequential completion
  const isLessonAccessible = (lessonId: string) => {
    const index = allLessons.findIndex((l) => l._id === lessonId);
    if (index === -1) return false;
    if (index === 0) return true; // First lesson is always accessible

    // Accessible if the lesson itself is already completed OR the previous lesson is completed
    const isThisCompleted = isLessonCompleted(lessonId);
    const isPrevCompleted = isLessonCompleted(allLessons[index - 1]._id);
    return isThisCompleted || isPrevCompleted;
  };

  const handleSelectLesson = async (module: Module, lesson: Lesson) => {
    if (isSavingProgress) return; // Prevent race condition

    // ✅ Block if sequential progression blocks it
    if (!isLessonAccessible(lesson._id)) {
      setToast({
        show: true,
        message: "Please complete the previous lesson first!",
      });
      return;
    }

    setActiveLesson(lesson);
    setActiveModuleId(module._id);
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.add(module._id);
      return next;
    });

    // ✅ Save position to DB whenever user opens a lesson
    const token = await currentUser!.getIdToken();
    await updateLastAccessed(module._id, lesson._id, token);

    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navigateLesson = async (direction: "next" | "prev") => {
    if (!course || !activeLesson || isSavingProgress) return;

    // ✅ Prevent going next if current lesson is not completed
    if (direction === "next" && !isLessonCompleted(activeLesson._id)) {
      setToast({
        show: true,
        message: "Please complete the current lesson to proceed!",
      });
      return;
    }

    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0 || newIndex >= allLessons.length) return;

    const newLesson = allLessons[newIndex];
    const containingModule = course.modules.find((mod) =>
      mod.lessons.some((l) => l._id === newLesson._id),
    );

    if (containingModule) {
      // Reuse handleSelectLesson to ensure validation & DB saving occurs
      handleSelectLesson(containingModule, newLesson);
    }
  };

  const handleMarkComplete = async () => {
    if (!activeLesson || !course || !currentUser || !activeModuleId) return;

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(
        `${BACKEND_URL}/api/courses/${course._id}/modules/${activeModuleId}/lessons/${activeLesson._id}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(
          errData.message || "Failed to update progress on server.",
        );
      }

      const data = await res.json();

      // ✅ Update progress state directly from DB response (Source of Truth)
      setProgress(data.data);
      setToast({ show: true, message: "Lesson marked as complete!" });

      // ✅ Automatically determine and navigate to next lesson (unlocked, but not completed)
      if (hasNextLesson) {
        setTimeout(() => navigateLesson("next"), 1000);
      }
    } catch (err: any) {
      console.error("Error marking lesson complete:", err);
      setToast({
        show: true,
        message: err.message || "Failed to update progress.",
      });
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  // Theme tokens
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
  const highlightBg = isDarkMode
    ? "rgba(243,5,109,0.1)"
    : "rgba(243,5,109,0.05)";

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#F3056D] animate-spin mb-4" />
        <p style={{ color: textSecondary }}>Loading your course...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="p-4 bg-red-50 rounded-2xl mb-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-black mb-2" style={{ color: textPrimary }}>
          Error
        </h2>
        <p className="mb-6 max-w-sm" style={{ color: textSecondary }}>
          {error}
        </p>
        <Link
          href="/dashboard/mycourses"
          className="px-6 py-2.5 bg-[#F3056D] text-white font-bold rounded-xl flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Courses
        </Link>
      </div>
    );
  }

  if (!course) return null;

  if (!isEnrolled) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="p-4 bg-amber-50 rounded-2xl mb-4">
          <Lock className="h-12 w-12 text-amber-500" />
        </div>
        <h2 className="text-2xl font-black mb-2" style={{ color: textPrimary }}>
          Access Denied
        </h2>
        <p className="mb-6 max-w-sm" style={{ color: textSecondary }}>
          You are not enrolled in this course. Please purchase it to access the
          lessons, videos, and exams.
        </p>
        <Link
          href={`/${params.lang}/courses/${slug}`}
          className="px-6 py-3 bg-[#F3056D] text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-[#F3056D]/30 hover:bg-[#d9045c] transition-colors"
        >
          <CreditCard className="h-4 w-4" /> Enroll Now
        </Link>
      </div>
    );
  }

  const courseModules = course.modules || [];
  const totalLessons = progress?.totalLessons || 0;
  const completedCount = progress?.completedLessonsCount || 0;
  const overallProgress = progress?.progressPercentage || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative" ref={containerRef}>
      {/* HEADER */}
      <div className="learn-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/mycourses")}
            className="p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
            style={{
              background: isDarkMode
                ? "rgba(255,255,255,0.05)"
                : "rgba(33,65,135,0.04)",
              color: textSecondary,
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1
              className="text-xl sm:text-2xl font-black tracking-tight"
              style={{ color: textPrimary }}
            >
              {course.title}
            </h1>
            <div
              className="flex items-center gap-3 mt-1 text-xs"
              style={{ color: textSecondary }}
            >
              <span className="flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5" /> {course.instructor}
              </span>
              <span className="flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" /> {courseModules.length}{" "}
                Modules
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" /> {totalLessons} Lessons
              </span>
            </div>
          </div>
        </div>

        <div
          className="hidden sm:flex items-center gap-4 px-5 py-3 rounded-2xl shadow-sm"
          style={{ background: cardBg, border: cardBorder }}
        >
          <div className="relative w-12 h-12">
            <svg
              className="w-full h-full transform -rotate-90 transition-all duration-700"
              viewBox="0 0 36 36"
            >
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={
                  isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(33,65,135,0.1)"
                }
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#F3056D"
                strokeWidth="3"
                strokeDasharray={`${overallProgress}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-[11px] font-black"
                style={{ color: textPrimary }}
              >
                {overallProgress}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: textPrimary }}>
              {completedCount}/{totalLessons} Done
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: textMuted }}>
              {overallProgress === 100
                ? "Course Completed!"
                : "Keep up the great work!"}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: DYNAMIC LESSON CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="learn-content rounded-2xl overflow-hidden shadow-sm"
            style={{ background: cardBg, border: cardBorder }}
          >
            {activeLesson ? (
              <>
                {/* VIDEO TYPE (Removed onEnded Auto-complete) */}
                {activeLesson.type === "video" && (
                  <div className="relative bg-black aspect-video w-full">
                    {(() => {
                      const ytUrl = getYouTubeEmbedUrl(activeLesson.videoUrl);
                      if (ytUrl) {
                        return (
                          <iframe
                            key={activeLesson._id}
                            className="w-full h-full"
                            src={ytUrl}
                            title={getLessonTitle(activeLesson.title)}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        );
                      } else if (activeLesson.videoUrl) {
                        return (
                          <video
                            key={activeLesson._id}
                            controls
                            className="w-full h-full"
                            src={activeLesson.videoUrl}
                            poster={course.thumbnail}
                          />
                        );
                      } else {
                        return (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white/70 p-8 text-center">
                            <Video className="h-12 w-12 mb-3 text-[#F3056D]" />
                            <h3 className="text-lg font-bold text-white">
                              No video available for this lesson
                            </h3>
                            <p className="text-sm text-white/50 mt-1">
                              Please check back later or contact support.
                            </p>
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}

                {/* EXAM / QUIZ TYPE */}
                {(activeLesson.type === "exam" ||
                  activeLesson.type === "quiz" ||
                  activeLesson.type === "assignment") && (
                  <div className="p-8 sm:p-12 text-center bg-gradient-to-br from-amber-50 to-orange-50 min-h-[400px] flex flex-col items-center justify-center">
                    <div className="p-4 bg-white rounded-2xl shadow-md mb-4">
                      <FileQuestion className="h-12 w-12 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2 capitalize">
                      {activeLesson.type}: {getLessonTitle(activeLesson.title)}
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md">
                      Read the instructions carefully before starting the exam.
                      You will have a limited time to complete all questions.
                    </p>
                    <button className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105">
                      Start Exam
                    </button>
                  </div>
                )}

                {/* DOCUMENT / ARTICLE TYPE */}
                {(activeLesson.type === "article" ||
                  activeLesson.type === "text" ||
                  activeLesson.type === "document") && (
                  <div
                    className="p-6 sm:p-10 prose max-w-none min-h-[400px]"
                    style={{ color: textPrimary }}
                  >
                    <h2 className="text-2xl font-black mb-4">
                      {getLessonTitle(activeLesson.title)}
                    </h2>
                    <div
                      className="text-sm leading-relaxed"
                      style={{ color: textSecondary }}
                    >
                      {activeLesson.content ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: activeLesson.content,
                          }}
                        />
                      ) : (
                        "No document content available."
                      )}
                    </div>
                  </div>
                )}

                {/* LINK TYPE */}
                {activeLesson.type === "link" && (
                  <div className="p-8 sm:p-12 text-center bg-gradient-to-br from-green-50 to-emerald-50 min-h-[400px] flex flex-col items-center justify-center">
                    <div className="p-4 bg-white rounded-2xl shadow-md mb-4">
                      <Link2 className="h-12 w-12 text-green-500" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">
                      External Resource
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md">
                      This lesson contains an external link. Click the button
                      below to open it in a new tab.
                    </p>
                    <a
                      href={
                        activeLesson.videoUrl || activeLesson.content || "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105 inline-flex items-center gap-2"
                    >
                      Open Link <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 sm:p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                <PartyPopper className="h-12 w-12 mb-3 text-[#F3056D]" />
                <h3
                  className="text-lg font-bold"
                  style={{ color: textPrimary }}
                >
                  Course Completed!
                </h3>
                <p className="text-sm" style={{ color: textSecondary }}>
                  You have finished all available lessons in this course.
                </p>
              </div>
            )}
          </div>

          {/* LESSON INFO & ACTIONS */}
          {activeLesson && (
            <div
              className="rounded-2xl p-5 sm:p-6 shadow-sm"
              style={{ background: cardBg, border: cardBorder }}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2
                    className="text-lg font-black mb-1"
                    style={{ color: textPrimary }}
                  >
                    {getLessonTitle(activeLesson.title)}
                  </h2>
                  <p
                    className="text-xs flex items-center gap-2 capitalize"
                    style={{ color: textSecondary }}
                  >
                    <LessonTypeIcon
                      type={activeLesson.type}
                      className="w-3.5 h-3.5"
                    />
                    {activeLesson.type}
                  </p>
                </div>
                {isLessonCompleted(activeLesson._id) && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-green-500">
                    <CheckCircle2 className="h-3 w-3" /> Completed
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => navigateLesson("prev")}
                  disabled={!hasPrevLesson || isSavingProgress}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: isDarkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(33,65,135,0.04)",
                    color: textPrimary,
                    border: cardBorder,
                  }}
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </button>

                <button
                  onClick={handleMarkComplete}
                  disabled={
                    isLessonCompleted(activeLesson._id) || isSavingProgress
                  }
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, #F3056D 0%, #ff3d8f 100%)",
                    color: "#fff",
                    boxShadow: "0 4px 15px rgba(243,5,109,0.2)",
                  }}
                >
                  {isLessonCompleted(activeLesson._id) ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Completed
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Mark Complete
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigateLesson("next")}
                  disabled={
                    !hasNextLesson ||
                    !isLessonCompleted(activeLesson._id) ||
                    isSavingProgress
                  }
                  title={
                    !isLessonCompleted(activeLesson._id)
                      ? "Complete this lesson to proceed"
                      : ""
                  }
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: isDarkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(33,65,135,0.04)",
                    color: textPrimary,
                    border: cardBorder,
                  }}
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: COURSE MODULES & LESSONS */}
        <div className="lg:col-span-1">
          <div
            className="learn-sidebar rounded-2xl overflow-hidden sticky top-24 shadow-sm"
            style={{
              background: cardBg,
              border: cardBorder,
              maxHeight: "calc(100vh - 7rem)",
              overflowY: "auto",
            }}
          >
            {/* Sidebar Progress Header */}
            <div
              className="p-5 sticky top-0 z-10 backdrop-blur-md"
              style={{
                background: isDarkMode
                  ? "rgba(26,16,53,0.85)"
                  : "rgba(255,255,255,0.85)",
                borderBottom: cardBorder,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3
                  className="font-black text-sm"
                  style={{ color: textPrimary }}
                >
                  Course Content
                </h3>
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(243,5,109,0.1)",
                    color: "#F3056D",
                  }}
                >
                  {overallProgress}% Complete
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{
                  background: isDarkMode
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(33,65,135,0.08)",
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${overallProgress}%`,
                    background: "linear-gradient(90deg, #F3056D, #ff3d8f)",
                    boxShadow: "0 0 10px rgba(243,5,109,0.5)",
                  }}
                />
              </div>
              <p
                className="text-[10px] mt-2 text-left"
                style={{ color: textSecondary }}
              >
                {completedCount} of {totalLessons} lessons completed
              </p>
            </div>

            {/* Modules List */}
            <div className="p-3 space-y-2">
              {courseModules.map((module, index) => {
                const isExpanded = expandedModules.has(module._id);
                const moduleLessons = module.lessons || [];
                const moduleCompleted = moduleLessons.filter((l) =>
                  isLessonCompleted(l._id),
                ).length;
                const moduleTotal = moduleLessons.length;
                const moduleProgress =
                  moduleTotal > 0
                    ? Math.round((moduleCompleted / moduleTotal) * 100)
                    : 0;

                return (
                  <div
                    key={module._id}
                    className="rounded-xl overflow-hidden transition-all"
                    style={{
                      background: isDarkMode
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(33,65,135,0.01)",
                    }}
                  >
                    <button
                      onClick={() => toggleModule(module._id)}
                      className="w-full flex items-center justify-between p-3.5 transition-colors hover:bg-black/5"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0"
                          style={{
                            background: "rgba(243,5,109,0.1)",
                            color: "#F3056D",
                          }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <h4
                            className="text-xs font-bold leading-tight"
                            style={{ color: textPrimary }}
                          >
                            {module.title}
                          </h4>
                          <p
                            className="text-[10px] mt-0.5"
                            style={{ color: textMuted }}
                          >
                            {moduleLessons.length} Lessons
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {moduleProgress === 100 ? (
                          <div className="w-5 h-5 rounded-full bg-[#4ade80] flex items-center justify-center">
                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                          </div>
                        ) : (
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{
                              background: isDarkMode
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(33,65,135,0.04)",
                              color: textSecondary,
                            }}
                          >
                            {moduleCompleted}/{moduleTotal}
                          </span>
                        )}
                        <ChevronDown
                          className="h-4 w-4 transition-transform duration-300"
                          style={{
                            color: textSecondary,
                            transform: isExpanded
                              ? "rotate(180deg)"
                              : "rotate(0)",
                          }}
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="pb-2 space-y-1 animate-[slideDown_0.3s_ease-out]">
                        {moduleLessons.map((lesson) => {
                          const isActive = activeLesson?._id === lesson._id;
                          const accessible = isLessonAccessible(lesson._id);
                          const isCompleted = isLessonCompleted(lesson._id);
                          const isBlocked = !accessible;

                          return (
                            <button
                              key={lesson._id}
                              onClick={() => handleSelectLesson(module, lesson)}
                              disabled={isBlocked || isSavingProgress}
                              className="w-full flex items-center gap-3 p-2.5 pl-10 rounded-lg text-left transition-all duration-200 group"
                              style={{
                                background: isActive
                                  ? highlightBg
                                  : "transparent",
                                cursor: isBlocked ? "not-allowed" : "pointer",
                                opacity: isBlocked ? 0.5 : 1,
                              }}
                            >
                              <div className="flex-shrink-0">
                                {isBlocked ? (
                                  <Lock
                                    className="h-4 w-4"
                                    style={{ color: textMuted }}
                                  />
                                ) : isCompleted ? (
                                  <div className="w-5 h-5 rounded-full bg-[#4ade80] flex items-center justify-center">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                  </div>
                                ) : (
                                  <LessonTypeIcon
                                    type={lesson.type}
                                    className="w-4 h-4"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5
                                  className="text-xs font-medium leading-tight truncate"
                                  style={{
                                    color: isActive ? "#F3056D" : textPrimary,
                                  }}
                                >
                                  {getLessonTitle(lesson.title)}
                                </h5>
                                {lesson.duration && (
                                  <p
                                    className="text-[10px] mt-0.5"
                                    style={{ color: textMuted }}
                                  >
                                    {lesson.duration} mins
                                  </p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {courseModules.length === 0 && (
                <div
                  className="p-8 text-center text-xs"
                  style={{ color: textMuted }}
                >
                  No modules or lessons found for this course yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <p className="font-bold text-green-800 text-sm">{toast.message}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
