"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import ModuleCard from "./ModuleCard";
import { useAuth } from "@/app/context/AuthContext";

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

interface Props {
  courseId?: string;
}

export default function ManageCourseContent({ courseId: propCourseId }: Props) {
  const { courseId } = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledPublishAt: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    const idToFetch = propCourseId || courseId;
    if (idToFetch) {
      fetchData(idToFetch as string);
    }
  }, [propCourseId, courseId]);

  const fetchData = async (id: string) => {
    try {
      setLoading(true);
      const courseRes = await api.get(`/courses/${id}`);
      setCourse(courseRes.data.data);

      const modRes = await api.get(`/courses/${id}/modules`);
      setModules(modRes.data.data || []);
    } catch (error) {
      console.error("Error fetching course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    const idToUse = propCourseId || courseId;

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);

      if (formData.scheduledPublishAt) {
        payload.append("scheduledPublishAt", formData.scheduledPublishAt);
      }

      if (thumbnailFile) payload.append("thumbnail", thumbnailFile);
      if (videoFile) payload.append("video", videoFile);

      await api.post(`/courses/${idToUse}/modules`, payload);

      setIsModalOpen(false);
      setFormData({ title: "", description: "", scheduledPublishAt: "" });
      setThumbnailFile(null);
      setVideoFile(null);
      fetchData(idToUse as string);
    } catch (error) {
      console.error("Error creating module:", error);
      alert("Failed to create module. Please try again.");
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;
    try {
      await api.delete(`/modules/${moduleId}`);
      const idToUse = propCourseId || courseId;
      fetchData(idToUse as string);
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
      
    >
      <div className="max-w-5xl mx-auto mb-8">
        <button
          onClick={() => router.back()}
          className="text-sm mb-4 hover:opacity-70 flex items-center gap-1"
          
        >
          &larr; Back to Courses
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-bold"
              
            >
              {course?.title}
            </h1>
            <p className="mt-2" >
              Manage course modules and content scheduling.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white shadow-lg transition-all hover:opacity-90"
            
          >
            <PlusIcon className="w-5 h-5" />
            Add New Module
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-4">
        {modules.length === 0 ? (
          <div
            className="p-12 text-center rounded-xl border border-dashed"
            
          >
            <div
              className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
              
            >
              <CalendarDaysIcon
                className="w-8 h-8 opacity-50"
                
              />
            </div>
            <h3
              className="text-lg font-medium mb-1"
              
            >
              No Modules Yet
            </h3>
            <p className="text-sm" >
              Create your first module to start structuring this course.
            </p>
          </div>
        ) : (
          modules
            .sort((a, b) => a.order - b.order)
            .map((module) => (
              <ModuleCard
                key={module._id}
                module={module}
                onDelete={() => handleDeleteModule(module._id)}
              />
            ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div
            className="w-full max-w-md rounded-xl shadow-2xl p-6 relative"
            
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4"
              
            >
              <XIcon className="w-6 h-6" />
            </button>

            <h2
              className="text-xl font-bold mb-6"
              
            >
              Add New Module
            </h2>

            <form onSubmit={handleAddModule} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  
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
                  placeholder="e.g. Introduction to Grammar"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  
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
                    placeholder="Brief overview of this module..."
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  
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
                <p className="text-xs mt-1" >
                  Leave empty to publish immediately (or keep as draft).
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg text-white text-sm font-medium shadow-md"
                  
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
