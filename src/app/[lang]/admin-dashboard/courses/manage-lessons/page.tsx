// src/app/[lang]/admin-dashboard/courses/manage-lessons/page.tsx
// ⚠️ FILE MUST BE NAMED page.tsx (NOT pages.tsx)
// ⚠️ FOLDER MUST BE named manage-lessons (NOT manage-leassons)

"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import Link from "next/link";

export default function ManageLessonsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { getLink } = useLanguage();

  const { data, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await axios.get("/api/courses");
      return res.data.data;
    },
  });

  const filteredCourses = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((course: any) => {
      const searchLower = searchTerm.toLowerCase();
      const titleText =
        typeof course.title === "string"
          ? course.title
          : course.title?.en || course.title?.bn || "";
      return (
        titleText?.toLowerCase().includes(searchLower) ||
        course.instructorName?.toLowerCase().includes(searchLower)
      );
    });
  }, [data, searchTerm]);

  const totalItems = filteredCourses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredCourses.slice(startIndex, endIndex);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => axios.delete(`/api/courses/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`))
      deleteMutation.mutate(id);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
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
              onChange={(e) => handleSearchChange(e.target.value)}
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
                          <Link
                            href={getLink(
                              `/admin-dashboard/courses/manage-lessons/${course._id}`,
                            )}
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
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border-gray-200 rounded-lg text-xs py-2 px-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#214187]/20 text-gray-600 font-medium"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
