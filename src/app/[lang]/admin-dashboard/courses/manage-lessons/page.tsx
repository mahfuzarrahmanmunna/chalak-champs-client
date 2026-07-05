// src/app/[lang]/admin-dashboard/courses/manage-lessons/page.tsx

"use client";

import React, { Suspense, useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Search,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  ChevronDown,
  GripVertical,
  Edit,
  ArrowLeft,
  Video,
  FileText,
  FileQuestion,
  Link2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import Link from "next/link";
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
  const c = "w-4 h-4";
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

const formatDuration = (mins?: number) => {
  if (!mins) return null;
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${hrs}h ${m}m` : `${hrs}h`;
};

// =============================================================
// MAIN COMPONENT — Handles BOTH list view and detail view
// =============================================================
export default function ManageLessonsPage() {
  return (
    <Suspense fallback={<ManageLessonsFallback />}>
      <ManageLessonsContent />
    </Suspense>
  );
}

function ManageLessonsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { getLink, currentLang } = useLanguage();

  // ✅ Read course ID from query param: ?id=xxx
  const courseId = searchParams.get("id");

  // If courseId exists → show module/lesson editor
  // If courseId is null → show course listing
  if (courseId) {
    return <CourseModulesView courseId={courseId} />;
  }

  return <CourseListingView />;
}

function ManageLessonsFallback() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10 flex items-center justify-center">
      <div className="flex items-center gap-3 text-gray-600">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading lessons...</span>
      </div>
    </div>
  );
}

// =============================================================
// VIEW 1: Course Listing (original table)
// =============================================================
function CourseListingView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { getLink } = useLanguage();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

    const { data, isLoading } = useQuery({
      queryKey: ["courses"],
      queryFn: async () => {
        const res = await axios.get("/api/courses");
        return res.data; // ✅ RETURN FULL OBJECT
      },
    });


    const filteredCourses = useMemo(() => {
      return (data?.data || []).filter((course: any) => {
        // ✅ ADD ?.data || []
        const s = searchTerm.toLowerCase();
        const title =
          typeof course.title === "string"
            ? course.title
            : course.title?.en || course.title?.bn || "";
        return (
          title.toLowerCase().includes(s) ||
          course.instructorName?.toLowerCase().includes(s)
        );
      });
    }, [data, searchTerm]);


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalItems = filteredCourses?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredCourses?.slice(startIndex, endIndex) || [];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => axios.delete(`/api/courses/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`))
      deleteMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#214187] rounded-lg">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Course Management
            </h1>
          </div>
          <p className="text-gray-500 text-sm ml-14">
            Create, edit, and organize your course modules and content.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ml-14 lg:ml-0">
          <div className="relative group w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#F3056D] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search courses or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() =>
              router.push(getLink("/admin-dashboard/courses/create"))
            }
            className="w-full sm:w-auto bg-[#214187] hover:bg-[#192d6e] text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-[#214187]/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-4 h-4" /> Create New Course
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80 border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm">
              <tr className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-5 min-w-[320px]">Course Name</th>
                <th className="p-5 min-w-[200px]">Instructor</th>
                <th className="p-5 min-w-[120px]">Price</th>
                <th className="p-5 min-w-[120px]">Status</th>
                <th className="p-5 min-w-[100px]">Modules</th>
                <th className="p-5 text-right min-w-[180px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {["p-5", "p-5", "p-5", "p-5", "p-5", "p-5 text-right"].map(
                      (cls, ci) => (
                        <td key={ci} className={cls}>
                          <div className="h-4 bg-gray-200 rounded w-full" />
                        </td>
                      ),
                    )}
                  </tr>
                ))
              ) : totalItems === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="p-4 bg-gray-100 rounded-full mb-4">
                        <Filter className="w-8 h-8" />
                      </div>
                      <p className="font-semibold text-gray-600 text-lg mb-1">
                        No courses found
                      </p>
                      <p className="text-sm">
                        Try adjusting your search or create a new course.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((course: any) => {
                  const courseTitle =
                    course.title?.en || course.title || "Untitled Course";
                  return (
                    <tr
                      key={course._id}
                      className="group hover:bg-[#F3056D]/[0.02] transition-colors duration-200 border-b border-gray-50 last:border-0"
                    >
                      <td className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-16 rounded-lg bg-gray-100 border border-gray-200 shrink-0 overflow-hidden relative">
                            {course.thumbnail ? (
                              <img
                                src={course.thumbnail}
                                alt={courseTitle}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <BookOpen className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <h3 className="font-bold text-gray-900 text-[15px] mb-1 line-clamp-1 group-hover:text-[#214187] transition-colors">
                              {courseTitle}
                            </h3>
                            <span className="text-[11px] font-medium px-2 py-0.5 bg-[#214187]/10 text-[#214187] rounded-full w-fit">
                              {course.level || "All Levels"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#214187] to-[#F3056D] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                            {course.instructorName?.charAt(0) || "U"}
                          </div>
                          <span className="text-gray-700 font-medium truncate">
                            {course.instructorName || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-[#214187] text-base leading-tight">
                            {course.price || "Free"}
                            {course.price && (
                              <span className="text-xs font-normal text-gray-400 ml-1">
                                BDT
                              </span>
                            )}
                          </span>
                          {course.originalPrice && (
                            <span className="text-xs text-gray-400 line-through mt-0.5">
                              {course.originalPrice} BDT
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${course.isPublished ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm" : "bg-amber-50 text-amber-700 border-amber-200 shadow-sm"}`}
                        >
                          {course.isPublished ? (
                            <>
                              <Eye className="w-3 h-3" /> Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Draft
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                          <Layers className="w-4 h-4 text-gray-400" />
                          {course.modules?.length || 0}
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          {/* ✅ FIXED: Uses query param instead of dynamic route */}
                          <Link
                            href={`${getLink("/admin-dashboard/courses/manage-lessons")}?id=${course._id}`}
                            className="flex items-center gap-1.5 px-3 py-2 bg-[#F3056D]/5 border border-[#F3056D]/20 text-[#F3056D] rounded-lg hover:bg-[#F3056D] hover:text-white hover:border-[#F3056D] hover:shadow-lg hover:shadow-[#F3056D]/25 transition-all text-xs font-bold"
                          >
                            Manage
                          </Link>
                          <button
                            onClick={() =>
                              router.push(
                                getLink(
                                  `/admin-dashboard/courses/${course._id}/edit`,
                                ),
                              )
                            }
                            className="p-2 text-gray-400 hover:text-[#214187] hover:bg-[#214187]/10 rounded-lg transition-all"
                            title="Edit Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(course._id, courseTitle)
                            }
                            disabled={deleteMutation.isPending}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                            title="Delete Course"
                          >
                            {deleteMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {totalItems > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <div className="text-xs text-gray-500 mb-4 md:mb-0">
              Showing{" "}
              <span className="font-bold text-gray-700">{startIndex + 1}</span>{" "}
              -{" "}
              <span className="font-bold text-gray-700">
                {Math.min(endIndex, totalItems)}
              </span>{" "}
              of <span className="font-bold text-gray-700">{totalItems}</span>{" "}
              courses
            </div>
            <div className="flex items-center gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border-gray-200 rounded-lg text-xs py-2 px-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#214187]/20 text-gray-600 font-medium"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all text-gray-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {totalPages > 1 &&
                  Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? "bg-[#214187] text-white shadow-md shadow-[#214187]/30" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all text-gray-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================
// VIEW 2: Module & Lesson Editor (was in [id]/CourseModulesClient.tsx)
// =============================================================
function CourseModulesView({ courseId }: { courseId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { getLink, currentLang } = useLanguage();

  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(),
  );
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const {
    data: structure,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["courseStructure", courseId],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/courses/${courseId}/modules`);
        const modules = res.data?.data || res.data?.modules || res.data;
        if (!Array.isArray(modules)) return [];
        return modules;
      } catch (axiosError: any) {
        if (axiosError.response?.status === 404)
          throw new Error(`API not found: /api/courses/${courseId}/modules`);
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "Failed to fetch",
        );
      }
    },
    enabled: !!courseId,
    retry: 1,
    staleTime: 0,
  });

  const deleteModuleMutation = useMutation({
    mutationFn: async (moduleId: string) =>
      axios.delete(`/api/courses/${courseId}/modules/${moduleId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["courseStructure", courseId],
      }),
  });

  const createModuleMutation = useMutation({
    mutationFn: async (data: { title: string; titleBn?: string }) =>
      axios.post(`/api/courses/${courseId}/modules`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseStructure", courseId],
      });
      setIsModuleModalOpen(false);
      setEditingModule(null);
    },
  });

  const updateModuleMutation = useMutation({
    mutationFn: async ({
      moduleId,
      data,
    }: {
      moduleId: string;
      data: { title: string; titleBn?: string };
    }) => axios.put(`/api/courses/${courseId}/modules/${moduleId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseStructure", courseId],
      });
      setIsModuleModalOpen(false);
      setEditingModule(null);
    },
  });

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };
  const expandAll = () => {
    if (structure)
      setExpandedModules(new Set(structure.map((m: Module) => m._id)));
  };
  const collapseAll = () => setExpandedModules(new Set());
  const handleBack = () =>
    router.push(getLink("/admin-dashboard/courses/manage-lessons"));

  const handleModuleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = (fd.get("moduleTitle") as string)?.trim();
    const titleBn = (fd.get("moduleTitleBn") as string)?.trim();
    if (!title) {
      alert("Module title is required");
      return;
    }
    if (editingModule)
      updateModuleMutation.mutate({
        moduleId: editingModule._id,
        data: { title, titleBn: titleBn || undefined },
      });
    else createModuleMutation.mutate({ title, titleBn: titleBn || undefined });
  };

  const handleDeleteModule = (mod: Module) => {
    const c = mod.lessons?.length || 0;
    if (
      confirm(
        c > 0
          ? `This module has ${c} lesson(s). Delete anyway?`
          : `Delete module "${mod.title}"?`,
      )
    )
      deleteModuleMutation.mutate(mod._id);
  };

  const closeLessonModal = () => {
    setIsLessonModalOpen(false);
    setSelectedModuleId(null);
    setEditingLesson(null);
  };

  const totalModules = structure?.length || 0;
  const totalLessons =
    structure?.reduce(
      (a: number, m: Module) => a + (m.lessons?.length || 0),
      0,
    ) || 0;
  const publishedModules =
    structure?.filter((m: Module) => m.isPublished).length || 0;
  const isAllExpanded =
    totalModules > 0 && expandedModules.size === totalModules;

  // --- ERROR ---
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
                <span className="text-[#214187] font-bold">{courseId}</span>
              </p>
              <p>
                <span className="text-gray-400">API URL:</span>{" "}
                <span className="text-red-600 break-all">
                  /api/courses/{courseId}/modules
                </span>
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

  // --- LOADING ---
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

  // --- MAIN ---
  return (
    <div className="max-w-6xl mx-auto pb-20">
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

      {structure?.length === 0 && (
        <div className="text-center p-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-600 mb-2">
            No Modules Yet
          </h3>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            Start building your course by adding modules.
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

      <div className="space-y-4">
        {structure?.map((mod: Module, i: number) => {
          const isExpanded = expandedModules.has(mod._id);
          const lc = mod.lessons?.length || 0;
          return (
            <div
              key={mod._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group"
            >
              <div className="flex items-center gap-4 p-4 border-b bg-gray-50/80 hover:bg-white transition-colors">
                <GripVertical className="w-5 h-5 text-gray-300 cursor-grab active:cursor-grabbing shrink-0" />
                <div className="w-8 h-8 rounded-lg bg-[#214187] text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
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
                      {lc} Lesson{lc !== 1 ? "s" : ""}
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
              {isExpanded && (
                <div className="border-t border-gray-100">
                  {lc === 0 ? (
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
                      {mod.lessons.map((lesson: Lesson, li: number) => (
                        <div
                          key={lesson._id}
                          className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/80 transition-colors group/lesson"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <span className="text-xs font-bold text-gray-400 w-6 text-center shrink-0">
                              {li + 1}
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
                      ))}
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

      {/* MODULE MODAL */}
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Module Title (Bangla){" "}
                  <span className="text-gray-400 font-normal ml-1">
                    — optional
                  </span>
                </label>
                <input
                  type="text"
                  name="moduleTitleBn"
                  defaultValue={editingModule?.titleBn || ""}
                  placeholder="যেমন, ওয়েব ডেভেলপমেন্ট পরিচিতি"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] transition-all"
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

      {/* LESSON MODAL */}
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
