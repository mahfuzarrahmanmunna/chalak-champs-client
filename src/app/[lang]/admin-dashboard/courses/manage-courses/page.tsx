"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Loader2, BookOpen, Plus, Edit, Trash2 } from "lucide-react";
import CourseFormModal from "./CourseFormModal";

// Updated interface to match the actual DB response
interface Course {
  _id: string;
  title: string; // Backend saves this as a simple string
  thumbnail?: string;
  price: number;
  isPublished: boolean;
  heroSubtitle?: string; // Backend saves this as a simple string
  description?: { en: string; bn: string }; // Our newly fixed bilingual description
}

export default function ManageCourses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const queryClient = useQueryClient();

  // 1. Fetch Courses
  const { data, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await axios.get("/api/courses");
      return response.data;
    },
  });

  // 2. Delete Course Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err: any) => {
      alert(
        "Failed to delete course: " +
          (err.response?.data?.message || err.message),
      );
    },
  });

  // Handlers
  const openCreateModal = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent row click triggering edit
    if (window.confirm("Are you sure you want to delete this course?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
            <p className="text-gray-500">View, edit, and create new courses.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all font-medium whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Course</span>
          </button>
        </div>

        {/* TABLE CONTAINER */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 bg-white rounded-xl shadow-sm">
            Failed to load courses.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                {/* TABLE HEADER */}
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Course
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody>
                  {data?.data?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-12 text-gray-400"
                      >
                        No courses found. Create one to get started!
                      </td>
                    </tr>
                  ) : (
                    data?.data?.map((course: Course) => (
                      <tr
                        key={course._id}
                        className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => openEditModal(course)}
                      >
                        {/* COURSE NAME & THUMBNAIL */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {course.thumbnail ? (
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <BookOpen className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              {/* FIX: Render title directly as string */}
                              <div className="font-semibold text-gray-900 truncate max-w-[250px]">
                                {course.title}
                              </div>
                              {/* FIX: Render heroSubtitle directly as string */}
                              <div className="text-xs text-gray-500 truncate max-w-[250px]">
                                {course.heroSubtitle || "No description"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* PRICE */}
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          BDT {course.price}
                        </td>

                        {/* STATUS BADGE */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              course.isPublished
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {course.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-xs transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(course);
                              }}
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 font-medium text-xs transition-colors disabled:opacity-50"
                              onClick={(e) => handleDelete(e, course._id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      <CourseFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={selectedCourse}
      />
    </div>
  );
}
