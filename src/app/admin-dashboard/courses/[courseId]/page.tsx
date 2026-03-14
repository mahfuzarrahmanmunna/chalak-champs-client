"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useTheme } from "@/app/context/ThemeContext";
import api from "@/lib/api";
import {
  PlusIcon,
  ClockIcon,
  TrashIcon,
  PencilIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  XIcon,
} from "lucide-react";
import { format } from "date-fns";

// --- Types ---
interface Module {
  _id: string;
  title: string;
  description?: string;
  order: number;
  isPublished: boolean;
  scheduledPublishAt: string | null;
  thumbnail?: string;
  videoUrl?: string;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
}

export default function ManageCoursePage() {
  const { courseId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledPublishAt: "", // Format: "YYYY-MM-DDTHH:MM"
  });

  // File State
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch Course Details
      const courseRes = await api.get(`/courses/${courseId}`);
      setCourse(courseRes.data.data);

      // Fetch Modules
      const modRes = await api.get(`/courses/${courseId}/modules`);
      setModules(modRes.data.data || []);
    } catch (error) {
      console.error("Error fetching course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);

      if (formData.scheduledPublishAt) {
        payload.append("scheduledPublishAt", formData.scheduledPublishAt);
      }

      // Append files for Cloudinary upload
      if (thumbnailFile) payload.append("thumbnail", thumbnailFile);
      if (videoFile) payload.append("video", videoFile);

      await api.post(`/courses/${courseId}/modules`, payload);

      setIsModalOpen(false);
      // Reset Form
      setFormData({ title: "", description: "", scheduledPublishAt: "" });
      setThumbnailFile(null);
      setVideoFile(null);
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Error creating module:", error);
      alert("Failed to create module. Please try again.");
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;
    try {
      await api.delete(`/modules/${moduleId}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <button
          onClick={() => router.back()}
          className="text-sm mb-4 hover:opacity-70 flex items-center gap-1"
          style={{ color: colors.muted }}
        >
          &larr; Back to Courses
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: colors.foreground }}
            >
              {course?.title}
            </h1>
            <p className="mt-2" style={{ color: colors.muted }}>
              Manage course modules and content scheduling.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white shadow-lg transition-all hover:opacity-90"
            style={{ backgroundColor: colors.primary }}
          >
            <PlusIcon className="w-5 h-5" />
            Add New Module
          </button>
        </div>
      </div>

      {/* Modules List */}
      <div className="max-w-5xl mx-auto space-y-4">
        {modules.length === 0 ? (
          <div
            className="p-12 text-center rounded-xl border border-dashed"
            style={{ borderColor: colors.border, backgroundColor: colors.card }}
          >
            <div
              className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: colors.accent }}
            >
              <CalendarDaysIcon
                className="w-8 h-8 opacity-50"
                style={{ color: colors.muted }}
              />
            </div>
            <h3
              className="text-lg font-medium mb-1"
              style={{ color: colors.foreground }}
            >
              No Modules Yet
            </h3>
            <p className="text-sm" style={{ color: colors.muted }}>
              Create your first module to start structuring this course.
            </p>
          </div>
        ) : (
          modules
            .sort((a, b) => a.order - b.order) // Sort by order
            .map((module) => (
              <ModuleCard
                key={module._id}
                module={module}
                colors={colors}
                onDelete={() => handleDeleteModule(module._id)}
              />
            ))
        )}
      </div>

      {/* Add Module Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div
            className="w-full max-w-md rounded-xl shadow-2xl p-6 relative"
            style={{ backgroundColor: colors.card }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4"
              style={{ color: colors.muted }}
            >
              <XIcon className="w-6 h-6" />
            </button>

            <h2
              className="text-xl font-bold mb-6"
              style={{ color: colors.foreground }}
            >
              Add New Module
            </h2>

            <form onSubmit={handleAddModule} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  Module Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                  placeholder="e.g. Introduction to Grammar"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                  placeholder="Brief overview of this module..."
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  Thumbnail Image
                </label>
                <div
                  className="relative border rounded-lg p-2"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && setThumbnailFile(e.target.files[0])
                    }
                    className="w-full text-sm"
                  />
                  {thumbnailFile && (
                    <p className="text-xs mt-2 text-green-600">
                      Selected: {thumbnailFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  Intro Video
                </label>
                <div
                  className="relative border rounded-lg p-2"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  }}
                >
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      e.target.files && setVideoFile(e.target.files[0])
                    }
                    className="w-full text-sm"
                  />
                  {videoFile && (
                    <p className="text-xs mt-2 text-green-600">
                      Selected: {videoFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2 flex items-center gap-2"
                  style={{ color: colors.foreground }}
                >
                  <ClockIcon className="w-4 h-4" />
                  Schedule Publish Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledPublishAt}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scheduledPublishAt: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                />
                <p className="text-xs mt-1" style={{ color: colors.muted }}>
                  Leave empty to publish immediately (or keep as draft).
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ color: colors.foreground }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg text-white text-sm font-medium shadow-md"
                  style={{ backgroundColor: colors.primary }}
                >
                  Create Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for Module Card
interface ModuleCardProps {
  module: Module;
  colors: any;
  onDelete: () => void;
}

const ModuleCard = ({ module, colors, onDelete }: ModuleCardProps) => {
  const isScheduled =
    module.scheduledPublishAt &&
    new Date(module.scheduledPublishAt) > new Date();
  const isPublished = module.isPublished;

  return (
    <div
      className="p-5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition-all hover:shadow-md"
      style={{
        backgroundColor: colors.card,
        borderColor: isScheduled ? colors.primary : colors.border,
      }}
    >
      <div className="flex items-center gap-4">
        {/* Thumbnail Preview */}
        <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
          {module.thumbnail ? (
            <img
              src={module.thumbnail}
              alt="Module"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
              No Img
            </div>
          )}
        </div>

        <div>
          <h3
            className="font-semibold text-lg"
            style={{ color: colors.foreground }}
          >
            {module.title}
          </h3>
          {module.description && (
            <p
              className="text-sm truncate max-w-md"
              style={{ color: colors.muted }}
            >
              {module.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-sm mt-1">
            {isPublished ? (
              <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-0.5 rounded-full text-xs font-medium">
                Published
              </span>
            ) : isScheduled ? (
              <span className="flex items-center gap-1 text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full text-xs font-medium">
                <ClockIcon className="w-3 h-3" />
                Scheduled:{" "}
                {format(
                  new Date(module.scheduledPublishAt!),
                  "MMM dd, hh:mm a",
                )}
              </span>
            ) : (
              <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium">
                Draft
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          // TODO: Implement Edit
          className="p-2 rounded-lg hover:bg-black hover:bg-opacity-5"
          style={{ color: colors.muted }}
          title="Edit"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg hover:bg-red-50"
          style={{ color: colors.destructive }}
          title="Delete"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
        <button
          // TODO: Navigate to Lessons
          className="p-2 rounded-lg hover:bg-black hover:bg-opacity-5"
          style={{ color: colors.primary }}
          title="View Content"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
