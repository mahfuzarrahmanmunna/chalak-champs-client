"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  User,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

export default function ManageLessonsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch all courses
  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await axios.get("/api/courses");
      return res.data.data;
    },
  });

  // Filter courses based on search term
  const filteredCourses = useMemo(() => {
    return data?.filter((course: any) => {
      const searchLower = searchTerm.toLowerCase();
      // Handle both string and object title structures
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

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination Logic
  const totalItems = filteredCourses?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredCourses?.slice(startIndex, endIndex) || [];

  // Delete Course Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`/api/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      deleteMutation.mutate(id);
    }
  };

  // Get Language Helper
  const { currentLang, getLink } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Course Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your course modules, lessons, and content.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          {/* Search Bar */}
          <div className="relative group w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#F3056D] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] transition-all shadow-sm"
            />
          </div>

          {/* Create Button */}
          <button
            onClick={() =>
              router.push(getLink("/admin-dashboard/courses/create"))
            }
            className="w-full md:w-auto bg-[#214187] hover:bg-[#1a336b] text-white px-6 py-2.5 rounded-lg font-semibold text-sm shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Course
          </button>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* TABLE HEAD */}
            <thead className="bg-gray-50/50 border-b border-gray-100 sticky top-0 z-10">
              <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-5 min-w-[300px]">Course Name</th>
                <th className="p-5 min-w-[200px]">Instructor</th>
                <th className="p-5 min-w-[120px]">Price</th>
                <th className="p-5 min-w-[100px]">Status</th>
                <th className="p-5 min-w-[100px]">Modules</th>
                <th className="p-5 text-right min-w-[120px]">Actions</th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                // Loading Skeleton
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="p-6">
                      <div className="flex items-center gap-4 animate-pulse">
                        <div className="w-16 h-12 bg-gray-200 rounded-lg" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : totalItems === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Filter className="w-10 h-10 mb-3 opacity-50" />
                      <p className="font-medium">No courses found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((course: any) => (
                  <tr
                    key={course._id}
                    className="group hover:bg-gray-50/50 transition-colors duration-150 border-b border-gray-50 last:border-0"
                  >
                    {/* Course Name Cell */}
                    <td className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="h-12 w-16 rounded-lg bg-gray-100 border border-gray-200 shrink-0 overflow-hidden relative">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={
                                typeof course.title === "string"
                                  ? course.title
                                  : course.title?.en || "Course"
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <BookOpen className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        {/* Text Info */}
                        <div className="flex flex-col">
                          {/* --- FIXED TITLE LOGIC --- */}
                          <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">
                            {course.title?.en ||
                              course.title ||
                              "Untitled Course"}
                          </h3>
                          {/* ------------------------------ */}
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                              {course.level || "All Levels"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Instructor Cell */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#214187] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {course.instructorName?.charAt(0) || "U"}
                        </div>
                        <span className="text-gray-700 font-medium truncate">
                          {course.instructorName || "Unknown"}
                        </span>
                      </div>
                    </td>

                    {/* Price Cell */}
                    <td className="p-5">
                      <span className="font-bold text-[#214187] text-base block">
                        {course.price}
                        <span className="text-xs font-normal text-gray-500">
                          {" "}
                          BDT
                        </span>
                      </span>
                      {course.originalPrice && (
                        <span className="text-xs text-gray-400 line-through block">
                          {course.originalPrice}
                        </span>
                      )}
                    </td>

                    {/* Status Cell */}
                    <td className="p-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          course.isPublished
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
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

                    {/* Modules Count Cell */}
                    <td className="p-5">
                      <span className="text-gray-600 font-medium">
                        {course.modules?.length || 0} Modules
                      </span>
                    </td>

                    {/* Actions Cell */}
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Manage Content Button */}
                        <button
                          onClick={() =>
                            router.push(
                              getLink(
                                `/admin-dashboard/courses/manage-lessons/${course._id}`,
                              ),
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-[#F3056D] hover:text-[#F3056D] hover:bg-[#F3056D]/5 transition-all text-xs font-semibold shadow-sm"
                        >
                          Manage Content
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() =>
                            router.push(
                              getLink(
                                `/admin-dashboard/courses/${course._id}/edit`,
                              ),
                            )
                          }
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {startIndex + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900">
              {Math.min(endIndex, totalItems)}
            </span>{" "}
            of <span className="font-semibold text-gray-900">{totalItems}</span>{" "}
            results
          </div>

          <div className="flex items-center gap-2">
            {/* Rows per page selector */}
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border-gray-300 rounded-md text-xs py-1 px-2 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-[#F3056D]/20"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            {/* Page Numbers (Simple Logic) */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? "bg-[#214187] text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
