"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useTheme } from "@/app/context/ThemeContext";
import api from "@/lib/api";
import {
  Plus,
  LayoutTemplate,
  Pencil,
  Trash2,
  Eye,
  MoreVertical,
  AlertCircle,
  Loader2,
} from "lucide-react";

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
  const { user } = useAuth();
  const { colors } = useTheme();

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
      // Assuming your api.ts baseURL is set to 'http://localhost:5000/api'
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

      // Remove from local state
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-7xl mx-auto">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: colors.foreground }}
            >
              Manage Courses
            </h1>
            <p className="mt-1" style={{ color: colors.muted }}>
              Overview, edit, and organize your course content.
            </p>
          </div>
          <button
            onClick={() => router.push("/admin-dashboard/courses/create")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus className="w-5 h-5" />
            Create New Course
          </button>
        </div>

        {/* --- Stats Overview (Optional) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className="p-6 rounded-xl shadow-sm border"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <p className="text-sm font-medium" style={{ color: colors.muted }}>
              Total Courses
            </p>
            <h2
              className="text-3xl font-bold mt-2"
              style={{ color: colors.primary }}
            >
              {courses.length}
            </h2>
          </div>
          <div
            className="p-6 rounded-xl shadow-sm border"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <p className="text-sm font-medium" style={{ color: colors.muted }}>
              Published
            </p>
            <h2 className="text-3xl font-bold mt-2" style={{ color: "green" }}>
              {courses.filter((c) => c.isPublished).length}
            </h2>
          </div>
          <div
            className="p-6 rounded-xl shadow-sm border"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <p className="text-sm font-medium" style={{ color: colors.muted }}>
              Drafts
            </p>
            <h2
              className="text-3xl font-bold mt-2"
              style={{ color: colors.muted }}
            >
              {courses.filter((c) => !c.isPublished).length}
            </h2>
          </div>
        </div>

        {/* --- Courses Grid --- */}
        {courses.length === 0 ? (
          <div
            className="p-12 text-center rounded-xl border border-dashed"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.card,
            }}
          >
            <div
              className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: colors.background }}
            >
              <LayoutTemplate
                className="w-8 h-8 opacity-50"
                style={{ color: colors.muted }}
              />
            </div>
            <h3
              className="text-lg font-medium mb-1"
              style={{ color: colors.foreground }}
            >
              No courses found
            </h3>
            <p className="text-sm mb-6" style={{ color: colors.muted }}>
              Get started by creating your first course.
            </p>
            <button
              onClick={() => router.push("/admin-dashboard/courses/create")}
              className="px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: colors.primary }}
            >
              Create Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                colors={colors}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div
            className="w-full max-w-sm rounded-xl shadow-2xl p-6"
            style={{ backgroundColor: colors.card }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#fee2e2" }}
              >
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3
                className="text-lg font-bold"
                style={{ color: colors.foreground }}
              >
                Delete Course?
              </h3>
            </div>
            <p className="text-sm mb-6" style={{ color: colors.muted }}>
              Are you sure you want to delete{" "}
              <strong>`{courseToDelete?.title}`</strong>? This action cannot be
              undone and will also delete all associated modules.
            </p>
            <div className="flex justify-end gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ color: colors.foreground }}
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white shadow-md bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-component: Course Card ---
const CourseCard = ({ course, colors, onManage, onEdit, onDelete }: any) => {
  return (
    <div
      className="rounded-xl shadow-sm border overflow-hidden flex flex-col transition-all hover:shadow-md"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      {/* Thumbnail Area */}
      <div className="h-40 w-full bg-gray-200 relative group">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <LayoutTemplate className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
              course.isPublished ? "bg-green-600" : "bg-gray-600"
            }`}
          >
            {course.isPublished ? "Published" : "Draft"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span
            className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded"
            style={{
              backgroundColor: colors.background,
              color: colors.primary,
            }}
          >
            {course.category}
          </span>
          <span className="text-sm font-bold" style={{ color: colors.primary }}>
            ${course.price}
          </span>
        </div>

        <h3
          className="font-bold text-lg mb-2 line-clamp-1"
          style={{ color: colors.foreground }}
        >
          {course.title}
        </h3>
        <p
          className="text-sm mb-4 line-clamp-2 flex-1"
          style={{ color: colors.muted }}
        >
          {course.description}
        </p>

        {/* Actions */}
        <div
          className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t"
          style={{ borderColor: colors.border }}
        >
          <button
            onClick={onManage}
            className="flex flex-col items-center justify-center p-2 rounded hover:bg-black hover:bg-opacity-5 transition-colors"
            title="Manage Modules"
          >
            <LayoutTemplate
              className="w-5 h-5 mb-1"
              style={{ color: colors.primary }}
            />
            <span
              className="text-[10px] font-medium"
              style={{ color: colors.muted }}
            >
              Content
            </span>
          </button>

          <button
            onClick={onEdit}
            className="flex flex-col items-center justify-center p-2 rounded hover:bg-black hover:bg-opacity-5 transition-colors"
            title="Edit Course"
          >
            <Pencil className="w-5 h-5 mb-1" style={{ color: colors.muted }} />
            <span
              className="text-[10px] font-medium"
              style={{ color: colors.muted }}
            >
              Edit
            </span>
          </button>

          <button
            onClick={onDelete}
            className="flex flex-col items-center justify-center p-2 rounded hover:bg-red-50 transition-colors"
            title="Delete Course"
          >
            <Trash2 className="w-5 h-5 mb-1 text-red-500" />
            <span className="text-[10px] font-medium text-red-500">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
