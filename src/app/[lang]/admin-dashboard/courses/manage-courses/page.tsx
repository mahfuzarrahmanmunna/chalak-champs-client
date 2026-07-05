// src/app/[lang]/admin-dashboard/courses/manage-courses/page.tsx

"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
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
  MoreVertical,
  GraduationCap,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react";
import CourseFormModal from "./CourseFormModal";




interface Course {
  _id: string;
  title: string;
  thumbnail?: string;
  price: number;
  originalPrice?: number;
  isPublished: boolean;
  heroSubtitle?: string;
  instructorName?: string;
  category?: string;
  level?: string;
  createdAt?: string;
}

function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] border-b border-gray-100">
          <th className="px-6 py-4 min-w-[350px]">Course</th>
          <th className="px-5 py-4 min-w-[100px]">Instructor</th>
          <th className="px-5 py-4 min-w-[100px]">Price</th>
          <th className="px-5 py-4 min-w-[110px]">Status</th>
          <th className="px-5 py-4 min-w-[90px]">Category</th>
          <th className="px-5 py-4 text-right min-w-[100px]">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <tr
            key={rowIdx}
            className="group animate-pulse"
            style={{ animationDelay: `${rowIdx * 60}ms` }}
          >
            {/* Course — thumbnail + title + subtitle */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gray-200 flex-shrink-0" />
                <div className="flex flex-col gap-2 min-w-0 w-full">
                  {/* ✅ Fixed: Replaced Math.random() with static Tailwind classes */}
                  <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-md w-1/2" />
                </div>
              </div>
            </td>

            {/* Instructor — avatar + name */}
            <td className="px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                {/* ✅ Fixed: Replaced Math.random() with static Tailwind class */}
                <div className="h-4 bg-gray-200 rounded-md w-16" />
              </div>
            </td>

            {/* Price */}
            <td className="px-5 py-4">
              <div className="flex flex-col gap-1.5">
                <div className="h-5 w-16 bg-gray-200 rounded-md" />
                <div className="h-3 w-12 bg-gray-100 rounded-md" />
              </div>
            </td>

            {/* Status badge */}
            <td className="px-5 py-4">
              <div className="h-7 w-16 bg-gray-200 rounded-lg" />
            </td>

            {/* Category pill */}
            <td className="px-5 py-4">
              <div className="h-6 w-16 bg-gray-200 rounded-md" />
            </td>

            {/* Action buttons */}
            <td className="px-5 py-4">
              <div className="flex items-center justify-end gap-2">
                <div className="w-9 h-9 rounded-lg bg-gray-200" />
                <div className="w-9 h-9 rounded-lg bg-gray-200" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-7 w-14 bg-gray-200 rounded" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ManageCourses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await axios.get("/api/courses");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setOpenMenuId(null);
    },
    onError: (err: any) => {
      alert(
        "Failed to delete: " + (err.response?.data?.message || err.message),
      );
    },
  });

  // --- Filtering & Pagination ---
  const filteredCourses = (data?.data || []).filter((c: Course) => {
    const s = searchTerm.toLowerCase();
    const matchSearch =
      (typeof c.title === "string" ? c.title : c.title?.en || "")
        .toLowerCase()
        .includes(s) ||
      c.instructorName?.toLowerCase().includes(s) ||
      c.category?.toLowerCase().includes(s);
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && c.isPublished) ||
      (filterStatus === "draft" && !c.isPublished);
    return matchSearch && matchStatus;
  });

  const totalItems = filteredCourses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredCourses.slice(startIndex, endIndex);

  const publishedCount = (data?.data || []).filter(
    (c: Course) => c.isPublished,
  ).length;
  const draftCount = (data?.data || []).length - publishedCount;
  const totalRevenue = (data?.data || []).reduce(
    (sum: number, c: Course) => sum + (c.price || 0),
    0,
  );

  const openCreateModal = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };
  const openEditModal = (c: Course) => {
    setSelectedCourse(c);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };
  const handleDelete = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this course? This cannot be undone.",
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===== HEADER ===== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-[#214187] rounded-xl shadow-lg shadow-[#214187]/30">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Manage Courses
              </h1>
            </div>
            <p className="text-gray-500 text-sm ml-[52px]">
              Create, edit, and organize your course catalog.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="self-start lg:self-auto flex items-center gap-2.5 bg-[#F3056D] hover:bg-[#d9045e] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-[#F3056D]/30 transition-all hover:shadow-[#F3056D]/40 hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-5 h-5" strokeWidth={3} />
            Create New Course
          </button>
        </div>

        {/* ===== STATS CARDS ===== */}
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Courses",
                value: (data?.data || []).length,
                icon: BookOpen,
                color: "#214187",
                bg: "bg-[#214187]/10",
                border: "border-[#214187]/20",
              },
              {
                label: "Published",
                value: publishedCount,
                icon: Eye,
                color: "#059669",
                bg: "bg-emerald-50",
                border: "border-emerald-200",
              },
              {
                label: "Drafts",
                value: draftCount,
                icon: EyeOff,
                color: "#d97706",
                bg: "bg-amber-50",
                border: "border-amber-200",
              },
              {
                label: "Total Revenue",
                value: `৳${totalRevenue.toLocaleString()}`,
                icon: TrendingUp,
                color: "#F3056D",
                bg: "bg-[#F3056D]/10",
                border: "border-[#F3056D]/20",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`relative overflow-hidden bg-white rounded-2xl border ${stat.border} p-5 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-[0.06]"
                  style={{ background: stat.color }}
                />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      {stat.label}
                    </p>
                    <p
                      className="text-2xl font-extrabold"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon
                      className="w-5 h-5"
                      style={{ color: stat.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== TOOLBAR ===== */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-5 border-b border-gray-100">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title, instructor, or category..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-2.5 bg-[#F5F6FA] border-0 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F3056D]/30 focus:bg-white transition-all"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-[#F5F6FA] rounded-xl p-1">
              {(["all", "published", "draft"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilterStatus(status);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    filterStatus === status
                      ? "bg-white text-[#214187] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Per Page */}
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-200 rounded-xl text-xs py-2.5 px-3 bg-white text-gray-600 font-semibold focus:outline-none focus:ring-2 focus:ring-[#214187]/20"
            >
              <option value={6}>6 / page</option>
              <option value={8}>8 / page</option>
              <option value={12}>12 / page</option>
              <option value={20}>20 / page</option>
            </select>
          </div>

          {/* ===== TABLE ===== */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <TableSkeleton rows={itemsPerPage} />
            ) : currentItems.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Filter className="w-9 h-9 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-600 mb-2">
                  No courses found
                </h3>
                <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your filters or search terms."
                    : "Get started by creating your first course."}
                </p>
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 bg-[#214187] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#192d6e] transition shadow-lg shadow-[#214187]/30"
                >
                  <Plus className="w-4 h-4" /> Create Course
                </button>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] border-b border-gray-100">
                    <th className="px-6 py-4 min-w-[350px]">Course</th>
                    <th className="px-5 py-4 min-w-[100px]">Instructor</th>
                    <th className="px-5 py-4 min-w-[100px]">Price</th>
                    <th className="px-5 py-4 min-w-[110px]">Status</th>
                    <th className="px-5 py-4 min-w-[90px]">Category</th>
                    <th className="px-5 py-4 text-right min-w-[100px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentItems.map((course: Course) => (
                    <tr
                      key={course._id}
                      className="group hover:bg-[#214187]/[0.02] transition-colors duration-150"
                    >
                      {/* Course */}
                      {/* Course */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#214187]/10 to-[#F3056D]/10 border border-gray-200/80 overflow-hidden flex-shrink-0 relative">
                            {course.thumbnail ? (
                              <img
                                src={course.thumbnail}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                            {course.isPublished && (
                              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                            )}
                          </div>
                          <div className="min-w-0">
                            {/* ✅ FIX: Handle both Object {en, bn} and String formats safely */}
                            <h4 className="font-bold text-gray-900 text-[15px] truncate max-w-[280px] group-hover:text-[#214187] transition-colors">
                              {typeof course.title === "object"
                                ? course.title?.en ||
                                  course.title?.bn ||
                                  "Untitled"
                                : course.title}
                            </h4>
                            <p className="text-xs text-gray-400 truncate max-w-[280px] mt-0.5">
                              {typeof course.heroSubtitle === "object"
                                ? course.heroSubtitle?.en ||
                                  course.heroSubtitle?.bn ||
                                  "No subtitle"
                                : course.heroSubtitle || "No subtitle"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Instructor */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#214187] to-[#F3056D] flex items-center justify-center text-white text-[11px] font-extrabold shadow-sm flex-shrink-0">
                            {course.instructorName?.charAt(0) || "U"}
                          </div>
                          <span className="text-sm text-gray-600 font-medium truncate max-w-[100px]">
                            {course.instructorName || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-[#214187] text-base leading-none">
                            {course.price
                              ? `৳${course.price.toLocaleString()}`
                              : "Free"}
                          </span>
                          {course.originalPrice &&
                            course.originalPrice > course.price && (
                              <span className="text-[11px] text-gray-400 line-through mt-1">
                                ৳{course.originalPrice.toLocaleString()}
                              </span>
                            )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                            course.isPublished
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {course.isPublished ? (
                            <>
                              <Eye className="w-3 h-3" /> Live
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Draft
                            </>
                          )}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                          {course.category || course.level || "General"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(course)}
                            className="p-2.5 rounded-lg text-gray-400 hover:text-[#214187] hover:bg-[#214187]/10 transition-all"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === course._id ? null : course._id,
                                )
                              }
                              className="p-2.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openMenuId === course._id && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setOpenMenuId(null)}
                                />
                                <div className="absolute right-0 top-11 z-50 w-48 bg-white rounded-xl border border-gray-200 shadow-xl py-2 animate-in fade-in slide-in-from-top-1 duration-150">
                                  <button
                                    onClick={() => openEditModal(course)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                                  >
                                    <Edit3 className="w-4 h-4 text-[#214187]" />{" "}
                                    Edit Course
                                  </button>
                                  <button
                                    onClick={() => handleDelete(course._id)}
                                    disabled={deleteMutation.isPending}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                                  >
                                    {deleteMutation.isPending ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                    Delete Course
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ===== PAGINATION FOOTER ===== */}
          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <p className="text-xs text-gray-500 mb-3 sm:mb-0">
                Showing{" "}
                <span className="font-bold text-gray-700">
                  {startIndex + 1}
                </span>
                –
                <span className="font-bold text-gray-700">
                  {Math.min(endIndex, totalItems)}
                </span>{" "}
                of <span className="font-bold text-gray-700">{totalItems}</span>{" "}
                courses
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-600 bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {totalPages > 1 &&
                  Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        currentPage === i + 1
                          ? "bg-[#214187] text-white shadow-lg shadow-[#214187]/40"
                          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-600 bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== MODAL ===== */}
      <CourseFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={selectedCourse}
      />
    </div>
  );
}
