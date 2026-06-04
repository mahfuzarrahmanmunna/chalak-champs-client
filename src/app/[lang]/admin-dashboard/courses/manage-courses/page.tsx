"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Loader2, BookOpen, Plus, Edit, Trash2 } from "lucide-react";
import CourseFormModal from "./CourseFormModal";
// import CourseFormModal from "./CourseFormModal"; // Import the modal we created

// Simple interface for the list item (adjust based on your DB response)
interface Course {
  _id: string;
  title: { en: string; bn: string };
  thumbnail?: string;
  price: number;
  isPublished: boolean;
  heroSubtitle?: { en: string };
}

export default function ManageCourses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // 1. Fetch Courses
  const { data, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await axios.get("/api/courses");
      return response.data;
    },
  });

  // Handlers
  const openCreateModal = () => {
    setSelectedCourse(null); // No data = Create Mode
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course); // Data = Edit Mode
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
            <p className="text-gray-500">View, edit, and create new courses.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Course</span>
          </button>
        </div>

        {/* GRID LIST */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            Failed to load courses.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.data?.map((course: Course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                onClick={() => openEditModal(course)} // CLICK TO OPEN MODAL
              >
                {/* Image */}
                <div className="h-40 bg-gray-200 overflow-hidden relative">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title.en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <BookOpen className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                    BDT {course.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 truncate">
                    {course.title.en}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2 h-8">
                    {course.heroSubtitle?.en || "No description available."}
                  </p>

                  {/* Actions Overlay on Hover (Optional but good UX) */}
                  <div className="flex justify-between items-center pt-2 border-t mt-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        course.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                    <button
                      className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        openEditModal(course);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {data?.data?.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400 border-2 border-dashed rounded-xl">
                No courses found. Create one to get started!
              </div>
            )}
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
