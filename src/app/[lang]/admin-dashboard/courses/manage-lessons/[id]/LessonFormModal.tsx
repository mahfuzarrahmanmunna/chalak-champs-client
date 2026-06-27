// src/app/[lang]/admin-dashboard/courses/manage-lessons/[id]/LessonFormModal.tsx

"use client";

import React, { useEffect } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { X, Loader2, Video, FileText, FileQuestion, Link2 } from "lucide-react";

interface LessonFormData {
  title: { en: string; bn: string };
  type: "video" | "pdf" | "exam" | "capstone";
  videoUrl?: string;
  content: string;
  duration: number;
  isFreePreview: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  courseId: string;
  lesson: any;
}

const typeIcons: Record<string, any> = {
  video: Video,
  pdf: FileText,
  exam: FileQuestion,
  capstone: Link2,
};

export default function LessonFormModal({
  isOpen,
  onClose,
  moduleId,
  courseId,
  lesson,
}: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LessonFormData>({
    defaultValues: {
      title: { en: "", bn: "" },
      type: "video",
      videoUrl: "",
      content: "",
      duration: 0,
      isFreePreview: false,
    },
  });

  const lessonType = useWatch({ control, name: "type" });

  useEffect(() => {
    if (lesson) {
      reset({
        title: lesson.title || { en: "", bn: "" },
        type: lesson.type || "video",
        videoUrl: lesson.videoUrl || "",
        content: lesson.content || "",
        duration: lesson.duration || 0,
        isFreePreview: lesson.isFreePreview || false,
      });
    } else {
      reset({
        title: { en: "", bn: "" },
        type: "video",
        videoUrl: "",
        content: "",
        duration: 0,
        isFreePreview: false,
      });
    }
  }, [lesson, reset]);

  const mutation = useMutation({
    mutationFn: async (data: LessonFormData) => {
      const url = lesson
        ? `/api/courses/${courseId}/modules/${moduleId}/lessons/${lesson._id}`
        : `/api/courses/${courseId}/modules/${moduleId}/lessons`;
      const method = lesson ? "put" : "post";
      return axios[method](url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseStructure", courseId],
      });
      onClose();
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to save lesson");
    },
  });

  const onSubmit = (data: LessonFormData) => {
    mutation.mutate(data);
  };

  if (!isOpen) return null;

  const IconComponent = typeIcons[lessonType || "video"] || FileText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#214187]/10 rounded-lg">
              <IconComponent className="w-5 h-5 text-[#214187]" />
            </div>
            <h3 className="text-xl font-bold text-[#214187]">
              {lesson ? "Edit Lesson" : "Add New Lesson"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded-lg transition text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          {/* Titles Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Title (English) <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title.en", { required: "Title is required" })}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none text-sm transition"
                placeholder="e.g., Introduction to HTML"
              />
              {errors.title?.en && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.en.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                শিরোনাম (বাংলা)
              </label>
              <input
                {...register("title.bn")}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none text-sm transition"
                placeholder="যেমন, HTML পরিচিতি"
                lang="bn"
              />
            </div>
          </div>

          {/* Type & Duration Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Lesson Type
              </label>
              <select
                {...register("type")}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition"
              >
                <option value="video">🎥 Video Lesson</option>
                <option value="pdf">📄 PDF Document</option>
                <option value="exam">📝 Exam / Quiz</option>
                <option value="capstone">🎯 Capstone Project</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Duration (minutes)
              </label>
              <input
                type="number"
                {...register("duration", { valueAsNumber: true, min: 0 })}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition"
                placeholder="e.g., 15"
              />
            </div>
          </div>

          {/* Video URL (conditional) */}
          {lessonType === "video" && (
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Video URL
              </label>
              <input
                {...register("videoUrl")}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition"
                placeholder="https://vimeo.com/... or https://youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-400 mt-1">
                Supports YouTube, Vimeo, or direct MP4 links
              </p>
            </div>
          )}

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
              Lesson Content
            </label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={10}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none resize-y transition"
                  placeholder="Write lesson content here... (You can replace this with QuillEditor later)"
                />
              )}
            />
          </div>

          {/* Free Preview Toggle */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              id="freePreview"
              {...register("isFreePreview")}
              className="w-4 h-4 text-[#F3056D] rounded focus:ring-[#F3056D] border-gray-300"
            />
            <label
              htmlFor="freePreview"
              className="text-sm text-gray-700 font-medium cursor-pointer"
            >
              Mark as Free Preview
              <span className="text-gray-400 font-normal ml-1">
                — Students can view without purchasing
              </span>
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-400">
            Module:{" "}
            <span className="font-mono font-semibold text-gray-600">
              {moduleId.slice(0, 8)}...
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-white transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={mutation.isPending}
              className="px-6 py-2.5 rounded-lg bg-[#214187] text-white font-bold hover:bg-[#1a336b] transition flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#214187]/20"
            >
              {mutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {lesson ? "Update Lesson" : "Save Lesson"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
