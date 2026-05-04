"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  Plus,
  LayoutTemplate,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  BookOpen,
  FolderOpen,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext"; // Importing Theme Context

// --- Interfaces ---
interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  category: string;
  level: string;
  isPublished: boolean;
  createdAt: string;
  instructor: {
    _id: string;
    name?: string;
    email: string;
  };
}

export default function ManageCoursesPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { theme } = useTheme(); // Using Theme Context for dynamic colors

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Courses on Load
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/courses");
      setCourses(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;

    try {
      setIsDeleting(true);
      await api.delete(`/courses/${courseToDelete._id}`);

      setCourses(courses.filter((c) => c._id !== courseToDelete._id));
      setIsDeleteModalOpen(false);
      setCourseToDelete(null);
    } catch (error: any) {
      console.error("Delete failed:", error);
      alert(error?.response?.data?.message || "Failed to delete course");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Stats Components ---
  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: Icon;
    label: string;
    value: number | string;
    color: string;
  }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        {React.createElement(icon, { className: "w-6 h-6 text-white" })}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );

  // --- Course Card Component ---
  const CourseCard = ({ course, onManage, onEdit, onDelete }: any) => {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
        {/* Thumbnail Area */}
        <div className="relative h-48 w-full bg-gray-100 group overflow-hidden">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <BookOpen className="w-16 h-16 text-gray-300" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full text-white shadow-sm ${
                course.isPublished ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              {course.isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded bg-gray-100 text-gray-600">
                {course.category}
              </span>
              <span className="text-xl font-bold text-gray-900">
                ${course.price}
              </span>
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">
              {course.title}
            </h3>
            <p className="text-gray-500 text-sm mb-6 line-clamp-2">
              {course.description}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
            <button
              onClick={onManage}
              className="flex items-center gap-2 w-full justify-start px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FolderOpen className="w-5 h-5" />
              <span>Manage Content</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border border-blue-200"
              >
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </button>

              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#F3056D] animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Header --- */}
      <div className="bg-white border-b border-gray-200 py-6 px-4 mb-8 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
            <p className="text-gray-500 mt-1">
              Create, edit, or delete course content.
            </p>
          </div>
          <button
            onClick={() => router.push("/admin-dashboard/courses/create")}
            className="bg-[#F3056D] text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-[#d946ef] hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Course</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* --- Stats Overview --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={LayoutTemplate}
            label="Total Courses"
            value={courses.length}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            icon={BookOpen}
            label="Published"
            value={courses.filter((c) => c.isPublished).length}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            icon={Pencil}
            label="Drafts"
            value={courses.filter((c) => !c.isPublished).length}
            color="bg-gray-100 text-gray-600"
          />
          <StatCard
            icon={FolderOpen}
            label="Total Students"
            value="--"
            color="bg-purple-100 text-purple-600"
          />
        </div>

        {/* --- Empty State --- */}
        {courses.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-300 rounded-xl bg-white">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Get started by creating your first course content to engage
              students.
            </p>
            <button
              onClick={() => router.push("/admin-dashboard/courses/create")}
              className="px-6 py-3 bg-white text-[#F3056D] border border border-[#F3056D] rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Create Your First Course
            </button>
          </div>
        )}

        {/* --- Courses Grid --- */}
        {courses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onManage={() =>
                  router.push(`/admin-dashboard/courses/${course._id}`)
                }
                onEdit={() =>
                  router.push(`/admin-dashboard/courses/edit/${course._id}`)
                }
                onDelete={() => handleDeleteClick(course)}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- Delete Confirmation Modal --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Delete Course?
              </h3>

              <p className="text-gray-500 mb-8 text-center leading-relaxed">
                Are you sure you want to delete{" "}
                <strong className="text-gray-900">
                  `{courseToDelete?.title}`
                </strong>
                ? This action cannot be undone and will permanently delete the
                course from the database.
              </p>

              <div className="flex justify-end gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-6 py-2.5 rounded-lg text-white bg-red-600 font-medium hover:bg-red-700 disabled:bg-red-400 disabled:opacity-70 transition-colors flex items-center gap-2"
                >
                  {isDeleting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                  <span>{isDeleting ? "Deleting..." : "Yes, Delete"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
