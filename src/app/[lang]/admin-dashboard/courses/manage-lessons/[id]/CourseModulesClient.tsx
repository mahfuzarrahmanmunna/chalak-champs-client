"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  GripVertical,
  Play,
  FileText,
  Edit,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import ModuleFormModal from "./ModuleFormModal";
import LessonFormModal from "./LessonFormModal";

// --- TYPES ---
interface Module {
  _id: string;
  title: string;
  titleBn?: string;
  thumbnail?: string;
  videoUrl?: string;
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
}

export default function CourseModulesClient() {
  const params = useParams();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Fetch Structure
  const {
    data: structure,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courseStructure", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID missing");
      // Ensure the API route matches your backend route: /api/courses/:id/modules
      // Or if you mounted moduleRoutes as /api/modules, it would be /api/modules/:id
      // Based on the backend code provided, the route is /:courseId inside the router.
      // If the main app uses app.use("/api/courses", and this route is mounted as "/api/courses/:id", then the URL is correct.
      const res = await axios.get(`/api/courses/${courseId}/modules`);
      return res.data.data;
    },
  });

  // --- DELETE MODULE MUTATION ---
  const deleteModuleMutation = useMutation({
    mutationFn: async (id: string) => {
      // Ensure route matches backend: /api/courses/:courseId/modules/:id
      // OR if mounted as /api/modules, adjust axios URL.
      // Assuming the standard app structure where this route is nested inside /api/courses:
      return axios.delete(`/api/courses/modules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseStructure", courseId],
      });
    },
  });

  // --- CREATE MODULE MUTATION (ADDED) ---
  const createModuleMutation = useMutation({
    mutationFn: async (data: any) => {
      // Backend route: POST /api/courses/:courseId/modules
      return axios.post(`/api/courses/${courseId}/modules`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseStructure", courseId],
      });
      setIsModuleModalOpen(false);
    },
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) newSet.delete(moduleId);
      else newSet.add(moduleId);
      return newSet;
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#F3056D]" />
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 p-12 text-center">
        Failed to load course modules. Please ensure your backend routes are configured correctly.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/admin-dashboard/manage-lessons")}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft className="w-6 h-6 text-[#214187]" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
          <p className="text-gray-500 text-sm">Organize modules and lessons</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => {
              setEditingModule(null);
              setIsModuleModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#F3056D] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#d1045c] transition"
          >
            <Plus className="w-4 h-4" /> Add Module
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {structure?.length === 0 && (
          <div className="text-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
            No modules created yet. Click "Add Module" to start.
          </div>
        )}

        {structure?.map((mod: Module) => (
          <div
            key={mod._id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group"
          >
            {/* MODULE HEADER */}
            <div className="flex items-center gap-4 p-4 border-b bg-gray-50 hover:bg-white transition">
              <GripVertical className="w-5 h-5 text-gray-300 cursor-move" />

              {/* Thumbnail */}
              <div className="w-20 h-12 rounded overflow-hidden bg-gray-200 shrink-0 relative">
                {mod.thumbnail ? (
                  <img
                    src={mod.thumbnail}
                    alt={mod.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#214187]">{mod.title}</h3>
                  {mod.titleBn && (
                    <span className="text-sm text-gray-500">| {mod.titleBn}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span>{mod.lessons?.length || 0} Lessons</span>
                  {mod.isPublished ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Published
                    </span>
                  ) : (
                    <span className="text-gray-400 font-medium flex items-center gap-1">
                      <EyeOff className="w-3 h-3" /> Draft
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingModule(mod);
                    setIsModuleModalOpen(true);
                  }}
                  className="p-2 text-gray-400 hover:text-[#F3056D] hover:bg-pink-50 rounded-full transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete module?"))
                      deleteModuleMutation.mutate(mod._id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleModule(mod._id)}
                  className="p-2 text-gray-400 hover:text-[#214187] hover:bg-blue-50 rounded-full transition"
                >
                  {expandedModules.has(mod._id) ? <ChevronDown /> : <ChevronRight />}
                </button>
              </div>
            </div>

            {/* LESSONS LIST */}
            {expandedModules.has(mod._id) && (
              <div className="p-4 bg-white min-h-[100px]">
                {mod.lessons?.length === 0 ? (
                  <div className="text-center py-4 text-sm text-gray-400 italic">
                    No lessons in this module.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {mod.lessons.map((lesson: Lesson) => (
                      <div
                        key={lesson._id}
                        className="flex items-center justify-between border rounded-lg p-3 hover:shadow-sm transition"
                      >
                        <div className="flex items-center gap-3">
                          <Play className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-sm">{lesson.title.en}</span>
                          {lesson.isFreePreview && (
                            <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded">
                              Free
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setEditingLesson(lesson);
                            setSelectedModuleId(mod._id);
                            setIsLessonModalOpen(true);
                          }}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedModuleId(mod._id);
                    setEditingLesson(null);
                    setIsLessonModalOpen(true);
                  }}
                  className="w-full mt-4 border-2 border-dashed border-gray-200 rounded-lg p-2 text-sm text-gray-500 hover:border-[#F3056D] hover:text-[#F3056D] transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Lesson
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      {isModuleModalOpen && (
        <ModuleFormModal
          isOpen={isModuleModalOpen}
          onClose={() => setIsModuleModalOpen(false)}
          courseId={courseId!}
          module={editingModule}
        />
      )}

      {isLessonModalOpen && selectedModuleId && (
        <LessonFormModal
          isOpen={isLessonModalOpen}
          onClose={() => setIsLessonModalOpen(false)}
          moduleId={selectedModuleId}
          lesson={editingLesson}
        />
      )}
    </div>
  );
}