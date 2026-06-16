"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { X, Upload, Plus, Trash2, Loader2 } from "lucide-react";
import QuillEditor from "../../create/QuillEditor";

// --- TYPES ---
interface LessonFormData {
  title: { en: string; bn: string };
  type: "video" | "pdf" | "exam" | "capstone";
  videoUrl?: string;
  content: string; // HTML
  duration: number;
  isFreePreview: boolean;
  quiz: {
    questionText: string;
    options: string[];
    correctAnswer: number;
  }[];
  resources: { type: "pdf" | "link"; title: string; url: string }[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  lesson: any; // Pass null if creating new
}

export default function LessonFormModal({
  isOpen,
  onClose,
  moduleId,
  lesson,
}: Props) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"content" | "quiz" | "resources">(
    "content",
  );

  // --- REACT HOOK FORM ---
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LessonFormData>({
    defaultValues: lesson || {
      title: { en: "", bn: "" },
      type: "video",
      videoUrl: "",
      content: "",
      duration: 0,
      isFreePreview: false,
      quiz: [],
      resources: [],
    },
  });

  useEffect(() => {
    if (lesson) reset(lesson);
  }, [lesson, reset]);

  // --- MUTATION ---
  const mutation = useMutation({
    mutationFn: async (data: LessonFormData) => {
      const url = lesson
        ? `/api/lessons/${lesson._id}`
        : `/api/modules/${moduleId}/lessons`;

      const method = lesson ? "put" : "post";

      // Prepare FormData if we were uploading files directly,
      // but here we assume URLs are handled or small files.
      // For simplicity, sending JSON.
      return axios[method](url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseStructure"] });
      onClose();
      reset();
    },
  });

  const onSubmit = (data: LessonFormData) => {
    mutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="p-5 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h3 className="text-xl font-bold text-[#214187]">
            {lesson ? "Edit Lesson" : "Add New Lesson"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b">
          {["content", "quiz", "resources"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 text-sm font-medium uppercase tracking-wider transition ${
                activeTab === tab
                  ? "text-[#F3056D] border-b-2 border-[#F3056D] bg-pink-50/50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* FORM BODY */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6"
        >
          {/* 1. COMMON INFO (Always Visible) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Title En */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                Title (English)
              </label>
              <input
                {...register("title.en", { required: true })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F3056D] outline-none"
                placeholder="Lesson Title"
              />
            </div>
            {/* Title Bn */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                শিরোনাম (বাংলা)
              </label>
              <input
                {...register("title.bn")}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F3056D] outline-none"
                placeholder="লেসনের নাম"
                lang="bn"
              />
            </div>

            {/* Type & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                  Type
                </label>
                <select
                  {...register("type")}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="video">Video Lesson</option>
                  <option value="pdf">PDF Document</option>
                  <option value="exam">Exam / Quiz</option>
                  <option value="capstone">Capstone Project</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                  Duration (mins)
                </label>
                <input
                  type="number"
                  {...register("duration", { valueAsNumber: true })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Video URL (Conditional) */}
            {watch("type") === "video" && (
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                  Video URL (Vimeo/YouTube/AWS)
                </label>
                <input
                  {...register("videoUrl")}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="https://..."
                />
              </div>
            )}
          </div>

          {/* TAB CONTENT */}
          {activeTab === "content" && (
            <div className="space-y-6">
              {/* Free Preview Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="freePreview"
                  {...register("isFreePreview")}
                  className="w-4 h-4 text-[#F3056D] rounded focus:ring-[#F3056D]"
                />
                <label
                  htmlFor="freePreview"
                  className="text-sm text-gray-700 font-medium"
                >
                  Mark as Free Preview
                </label>
              </div>

              {/* Quill Editor */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Lesson Content (English)
                </label>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <div className="border border-gray-300 rounded-lg overflow-hidden h-96">
                      <QuillEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Add homework or quiz questions.
              </p>
              {/* Quiz fields would go here - dynamic field array logic similar to CourseClient */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-800 text-sm">
                *Note: Implement dynamic Quiz Field Array here similar to the
                &quot;Quick Info&quot; section in CourseClient.
              </div>
            </div>
          )}

          {activeTab === "resources" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-blue-800 text-sm">
                *Note: Implement dynamic Resources Field Array here (Type:
                PDF/Link, Title, URL).
              </div>
            </div>
          )}
        </form>

        {/* FOOTER */}
        <div className="p-5 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
            className="px-6 py-2 rounded-lg bg-[#214187] text-white font-bold hover:bg-[#1a336b] transition flex items-center gap-2"
          >
            {mutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Lesson"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper to watch type in form
function watch(field: string) {
  // Simplified for this snippet, in real implementation use useWatch from react-hook-form
  return "video";
}
