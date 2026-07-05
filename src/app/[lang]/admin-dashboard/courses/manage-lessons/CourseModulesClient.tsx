// src/app/[lang]/admin-dashboard/courses/manage-lessons/[id]/CourseModulesClient.tsx

"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  GripVertical,
  Edit,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  Video,
  FileText,
  FileQuestion,
  Link2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import LessonFormModal from "./LessonFormModal";

// --- TYPES ---
interface Module {
  _id: string;
  title: string;
  titleBn?: string;
  thumbnail?: string;
  order: number;
  isPublished: boolean;
  lessons: Lesson[];
}

interface Lesson {
  _id: string;
  title: { en: string; bn: string };
  type: string;
  order: number;
  isFreePreview: boolean;
  duration?: number;
}

// --- ICON MAPPER ---
const LessonTypeIcon = ({ type }: { type: string }) => {
  const iconClass = "w-4 h-4";
  switch (type?.toLowerCase()) {
    case "video":
      return <Video className={`${iconClass} text-red-500`} />;
    case "article":
    case "text":
      return <FileText className={`${iconClass} text-blue-500`} />;
    case "quiz":
    case "exam":
    case "assignment":
      return <FileQuestion className={`${iconClass} text-amber-500`} />;
    case "link":
    case "resource":
      return <Link2 className={`${iconClass} text-green-500`} />;
    default:
      return <FileText className={`${iconClass} text-gray-400`} />;
  }
};

const formatDuration = (minutes?: number) => {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes}m`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
};

export default function CourseModulesClient() {
  const params = useParams();
  const courseId = params?.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { getLink, currentLang } = useLanguage();

  // --- STATE ---
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(),
  );
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // --- FETCH COURSE STRUCTURE ---
  const {
    data: structure,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["courseStructure", courseId],
    queryFn: async () => {
      if (!courseId) {
        throw new Error("Course ID is missing from URL");
      }

      console.log("📡 Fetching modules for course:", courseId);

      try {
        const res = await axios.get(`/api/courses/${courseId}/modules`);
        console.log("✅ API Response:", res.data);

        const modules = res.data?.data || res.data?.modules || res.data;

        if (!Array.isArray(modules)) {
          console.warn("⚠️ Response is not an array:", modules);
          return [];
        }

        return modules;
      } catch (axiosError: any) {
        console.error("❌ API Error Details:", {
          message: axiosError.message,
          response: axiosError.response?.data,
          status: axiosError.response?.status,
          url: axiosError.config?.url,
        });

        if (axiosError.response?.status === 404) {
          throw new Error(
            `API endpoint not found: /api/courses/${courseId}/modules. Please create this endpoint.`,
          );
        }

        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "Failed to fetch course modules",
        );
      }
    },
    enabled: !!courseId,
    retry: 1,
    staleTime: 0,
  });

  // --- DELETE MODULE MUTATION ---
  const deleteModuleMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      return axios.delete(`/api/courses/${courseId}/modules/${moduleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseStructure", courseId],
      });
    },
  });

  // --- CREATE MODULE MUTATION ---
  const createModuleMutation = useMutation({
    mutationFn: async (data: { title: string; titleBn?: string }) => {
      return axios.post(`/api/courses/${courseId}/modules`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseStructure", courseId],
      });
      setIsModuleModalOpen(false);
      setEditingModule(null);
    },
  });

  // --- UPDATE MODULE MUTATION ---
  const updateModuleMutation = useMutation({
    mutationFn: async ({
      moduleId,
      data,
    }: {
      moduleId: string;
      data: { title: string; titleBn?: string };
    }) => {
      return axios.put(`/api/courses/${courseId}/modules/${moduleId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseStructure", courseId],
      });
      setIsModuleModalOpen(false);
      setEditingModule(null);
    },
  });

  // --- HANDLERS ---
  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) newSet.delete(moduleId);
      else newSet.add(moduleId);
      return newSet;
    });
  };

  const expandAll = () => {
    if (!structure) return;
    setExpandedModules(new Set(structure.map((mod: Module) => mod._id)));
  };

  const collapseAll = () => {
    setExpandedModules(new Set());
  };

  const handleBack = () => {
    router.push(getLink("/admin-dashboard/courses/manage-lessons"));
  };

  const handleModuleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("moduleTitle") as string;
    const titleBn = formData.get("moduleTitleBn") as string;

    if (!title.trim()) {
      alert("Module title is required");
      return;
    }

    if (editingModule) {
      updateModuleMutation.mutate({
        moduleId: editingModule._id,
        data: {
          title: title.trim(),
          titleBn: titleBn?.trim() || undefined,
        },
      });
    } else {
      createModuleMutation.mutate({
        title: title.trim(),
        titleBn: titleBn?.trim() || undefined,
      });
    }
  };

  const handleDeleteModule = (mod: Module) => {
    const lessonCount = mod.lessons?.length || 0;
    const confirmMsg =
      lessonCount > 0
        ? `This module has ${lessonCount} lesson(s). Delete anyway?`
        : `Delete module "${mod.title}"?`;

    if (confirm(confirmMsg)) {
      deleteModuleMutation.mutate(mod._id);
    }
  };

  const closeLessonModal = () => {
    setIsLessonModalOpen(false);
    setSelectedModuleId(null);
    setEditingLesson(null);
  };

  // --- COMPUTED VALUES ---
  const totalModules = structure?.length || 0;
  const totalLessons =
    structure?.reduce(
      (acc: number, mod: Module) => acc + (mod.lessons?.length || 0),
      0,
    ) || 0;
  const publishedModules =
    structure?.filter((mod: Module) => mod.isPublished).length || 0;
  const isAllExpanded =
    totalModules > 0 && expandedModules.size === totalModules;

  // ==================== ERROR STATE ====================
  if (isError) {
    return (
      <div className="max-w-6xl mx-auto pb-20">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#214187] hover:underline mb-6"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Courses
        </button>

        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-10 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-700 mb-3">
            Failed to Load Course Modules
          </h3>
          <p className="text-red-600 text-sm mb-2 max-w-lg mx-auto">
            {error?.message || "An unexpected error occurred."}
          </p>

          <div className="mt-6 p-4 bg-white/80 rounded-xl border border-red-200 text-left max-w-md mx-auto">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Debug Information
            </p>
            <div className="space-y-2 text-xs font-mono">
              <p>
                <span className="text-gray-400">Course ID:</span>{" "}
                <span className="text-[#214187] font-bold">
                  {courseId || "NOT FOUND"}
                </span>
              </p>
              <p>
                <span className="text-gray-400">API URL:</span>{" "}
                <span className="text-red-600 break-all">
                  /api/courses/{courseId}/modules
                </span>
              </p>
              <p>
                <span className="text-gray-400">Error Type:</span>{" "}
                <span className="text-red-600">{error?.name || "Unknown"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => refetch()}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
            <button
              onClick={handleBack}
              className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== LOADING STATE ====================
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto pb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-2 h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse"
            >
              <div className="h-8 w-16 bg-gray-200 rounded mx-auto mb-2" />
              <div className="h-3 w-16 bg-gray-100 rounded mx-auto" />
            </div>
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4 animate-pulse"
          >
            <div className="flex items-center gap-4 p-4 border-b bg-gray-50">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
              <div className="w-20 h-12 bg-gray-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-40 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-full transition self-start"
          title="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-[#214187]" />
        </button>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
          <p className="text-gray-500 text-sm">
            Organize modules and lessons for this course
          </p>
        </div>

        <button
          onClick={() => {
            setEditingModule(null);
            setIsModuleModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#F3056D] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#d1045c] transition shadow-lg shadow-[#F3056D]/20 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Module
        </button>
      </div>

      {/* STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-extrabold text-[#214187]">
            {totalModules}
          </p>
          <p className="text-xs text-gray-500 font-medium mt-1">Modules</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-extrabold text-[#F3056D]">
            {totalLessons}
          </p>
          <p className="text-xs text-gray-500 font-medium mt-1">Lessons</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-extrabold text-emerald-600">
            {publishedModules}
          </p>
          <p className="text-xs text-gray-500 font-medium mt-1">Published</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-extrabold text-gray-400">
            {totalModules - publishedModules}
          </p>
          <p className="text-xs text-gray-500 font-medium mt-1">Drafts</p>
        </div>
      </div>

      {/* TOOLBAR */}
      {totalModules > 0 && (
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            Course ID:{" "}
            <span className="font-mono font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
              {courseId}
            </span>
          </div>
          <button
            onClick={isAllExpanded ? collapseAll : expandAll}
            className="text-xs font-semibold text-[#214187] hover:underline"
          >
            {isAllExpanded ? "Collapse All" : "Expand All"}
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {structure?.length === 0 && (
        <div className="text-center p-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-600 mb-2">
            No Modules Yet
          </h3>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            Start building your course by adding modules. Each module can
            contain multiple lessons like videos, articles, and quizzes.
          </p>
          <button
            onClick={() => {
              setEditingModule(null);
              setIsModuleModalOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-[#F3056D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#d1045c] transition"
          >
            <Plus className="w-4 h-4" /> Create First Module
          </button>
        </div>
      )}

      {/* MODULES LIST */}
      <div className="space-y-4">
        {structure?.map((mod: Module, modIndex: number) => {
          const isExpanded = expandedModules.has(mod._id);
          const lessonCount = mod.lessons?.length || 0;

          return (
            <div
              key={mod._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group"
            >
              {/* MODULE HEADER */}
              <div className="flex items-center gap-4 p-4 border-b bg-gray-50/80 hover:bg-white transition-colors">
                <GripVertical className="w-5 h-5 text-gray-300 cursor-grab active:cursor-grabbing shrink-0" />

                <div className="w-8 h-8 rounded-lg bg-[#214187] text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {modIndex + 1}
                </div>

                <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0 border border-gray-100">
                  {mod.thumbnail ? (
                    <img
                      src={mod.thumbnail}
                      alt={mod.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FileText className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-[#214187] text-[15px] truncate">
                      {mod.title}
                    </h3>
                    {mod.titleBn && (
                      <span className="text-sm text-gray-400 truncate">
                        | {mod.titleBn}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="font-medium">
                      {lessonCount} Lesson{lessonCount !== 1 ? "s" : ""}
                    </span>
                    {mod.isPublished ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Eye className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400 font-semibold bg-gray-100 px-2 py-0.5 rounded-full">
                        <EyeOff className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => {
                      setEditingModule(mod);
                      setIsModuleModalOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-[#F3056D] hover:bg-pink-50 rounded-lg transition"
                    title="Edit Module"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteModule(mod)}
                    disabled={deleteModuleMutation.isPending}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                    title="Delete Module"
                  >
                    {deleteModuleMutation.isPending &&
                    deleteModuleMutation.variables === mod._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                  <div className="w-px h-6 bg-gray-200 mx-1" />
                  <button
                    onClick={() => toggleModule(mod._id)}
                    className="p-2 text-gray-400 hover:text-[#214187] hover:bg-blue-50 rounded-lg transition"
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* LESSONS LIST */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  {lessonCount === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Video className="w-5 h-5 text-gray-300" />
                      </div>
                      <p className="text-sm text-gray-400 italic">
                        No lessons in this module yet.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {mod.lessons.map(
                        (lesson: Lesson, lessonIndex: number) => (
                          <div
                            key={lesson._id}
                            className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/80 transition-colors group/lesson"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <span className="text-xs font-bold text-gray-400 w-6 text-center shrink-0">
                                {lessonIndex + 1}
                              </span>
                              <LessonTypeIcon type={lesson.type} />
                              <div className="min-w-0">
                                <span className="font-medium text-sm text-gray-800 truncate block">
                                  {currentLang === "bn" && lesson.title?.bn
                                    ? lesson.title.bn
                                    : lesson.title?.en || "Untitled Lesson"}
                                </span>
                                {lesson.type && (
                                  <span className="text-[11px] text-gray-400 capitalize">
                                    {lesson.type}
                                    {lesson.duration &&
                                      ` • ${formatDuration(lesson.duration)}`}
                                  </span>
                                )}
                              </div>
                              {lesson.isFreePreview && (
                                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                                  FREE
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                setEditingLesson(lesson);
                                setSelectedModuleId(mod._id);
                                setIsLessonModalOpen(true);
                              }}
                              className="p-2 text-gray-300 hover:text-[#214187] hover:bg-blue-50 rounded-lg transition opacity-0 group-hover/lesson:opacity-100"
                              title="Edit Lesson"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  <div className="p-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedModuleId(mod._id);
                        setEditingLesson(null);
                        setIsLessonModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-3 text-sm text-gray-500 hover:border-[#F3056D] hover:text-[#F3056D] hover:bg-[#F3056D]/[0.02] transition-all font-medium"
                    >
                      <Plus className="w-4 h-4" /> Add Lesson to this Module
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ==================== MODULE FORM MODAL ==================== */}
      {isModuleModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setIsModuleModalOpen(false);
            setEditingModule(null);
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {editingModule ? "Edit Module" : "Create New Module"}
              </h3>
              <button
                onClick={() => {
                  setIsModuleModalOpen(false);
                  setEditingModule(null);
                }}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleModuleSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Module Title (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="moduleTitle"
                  defaultValue={editingModule?.title || ""}
                  placeholder="e.g., Introduction to Web Development"
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Module Title (Bangla)
                  <span className="text-gray-400 font-normal ml-1">
                    — optional
                  </span>
                </label>
                <input
                  type="text"
                  name="moduleTitleBn"
                  defaultValue={editingModule?.titleBn || ""}
                  placeholder="যেমন, ওয়েব ডেভেলপমেন্ট পরিচিতি"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModuleModalOpen(false);
                    setEditingModule(null);
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createModuleMutation.isPending ||
                    updateModuleMutation.isPending
                  }
                  className="px-6 py-2.5 text-sm font-medium text-white bg-[#F3056D] hover:bg-[#d1045c] rounded-lg transition shadow-lg shadow-[#F3056D]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {(createModuleMutation.isPending ||
                    updateModuleMutation.isPending) && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {editingModule ? "Update Module" : "Create Module"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== LESSON FORM MODAL ==================== */}
      {isLessonModalOpen && selectedModuleId && (
        <LessonFormModal
          isOpen={isLessonModalOpen}
          onClose={closeLessonModal}
          moduleId={selectedModuleId}
          courseId={courseId}
          lesson={editingLesson}
        />
      )}
    </div>
  );
}
