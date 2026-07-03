// src/app/[lang]/admin-dashboard/courses/manage-lessons/LessonFormModal.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import {
  X,
  Loader2,
  Video,
  FileText,
  FileQuestion,
  Link2,
  Plus,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Target,
  Newspaper,
} from "lucide-react";

interface LessonFormData {
  title: { en: string; bn: string };
  type: "video" | "pdf" | "exam" | "capstone" | "article";
  videoUrl?: string;
  content: string;
  duration: number;
  isFreePreview: boolean;
  // Exam-specific fields
  examMode?: "existing" | "new";
  examId?: string;
  examTitle?: { en: string; bn: string };
  examDescription?: { en: string; bn: string };
  examDuration?: number;
  examPassingMarks?: number;
  examNegativeMarking?: number;
  examIsProctored?: boolean;
  questions?: ExamQuestion[];
}

interface ExamQuestion {
  id: string;
  type: "mcq" | "fill-blank" | "short-answer";
  text: { en: string; bn: string };
  options?: { en: string; bn: string }[];
  correctAnswer: string;
  marks: number;
}

interface AvailableExam {
  _id: string;
  title: { en: string; bn: string } | string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  questionCount: number;
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
  article: FileText,
};

export default function LessonFormModal({
  isOpen,
  onClose,
  moduleId,
  courseId,
  lesson,
}: Props) {
  const queryClient = useQueryClient();
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<AvailableExam | null>(null);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LessonFormData>({
    defaultValues: {
      title: { en: "", bn: "" },
      type: "video",
      videoUrl: "",
      content: "",
      duration: 0,
      isFreePreview: false,
      examMode: "existing",
      examId: "",
      examTitle: { en: "", bn: "" },
      examDescription: { en: "", bn: "" },
      examDuration: 60,
      examPassingMarks: 50,
      examNegativeMarking: 0,
      examIsProctored: true,
      questions: [],
    },
  });

    const lessonTypeOptions = [
      { value: "video", label: "Video Lesson", icon: Video },
      { value: "pdf", label: "PDF Document", icon: FileText },
      { value: "exam", label: "Exam / Quiz", icon: FileQuestion },
      { value: "capstone", label: "Capstone Project", icon: Target },
      { value: "article", label: "Article", icon: Newspaper },
    ];

  const lessonType = useWatch({ control, name: "type" });
  const examMode = useWatch({ control, name: "examMode" });
  const examId = useWatch({ control, name: "examId" });
  const questions = useWatch({ control, name: "questions" });

  // Fetch available exams for dropdown
  const { data: examsData, isLoading: examsLoading } = useQuery({
    queryKey: ["availableExams", courseId],
    queryFn: async () => {
      const response = await axios.get(
        `/api/courses/${courseId}/modules/available-exams`,
      );
      return response.data.data;
    },
    enabled: isOpen && lessonType === "exam",
  });

  useEffect(() => {
    if (lesson) {
      reset({
        title: lesson.title || { en: "", bn: "" },
        type: lesson.type || "video",
        videoUrl: lesson.videoUrl || "",
        content: lesson.content || "",
        duration: lesson.duration || 0,
        isFreePreview: lesson.isFreePreview || false,
        examMode: lesson.examId ? "existing" : "new",
        examId: lesson.examId?._id || lesson.examId || "",
        examTitle: lesson.examConfig
          ? { en: "Exam", bn: "পরীক্ষা" }
          : { en: "", bn: "" },
        examDuration: lesson.examConfig?.duration || 60,
        examPassingMarks: lesson.examConfig?.passingMarks || 50,
        examNegativeMarking: lesson.examConfig?.negativeMarking || 0,
        examIsProctored: lesson.examConfig?.isProctored ?? true,
        questions: [],
      });

      if (lesson.examId) {
        setSelectedExam({
          _id: lesson.examId._id || lesson.examId,
          title: lesson.examId.title || { en: "Exam", bn: "পরীক্ষা" },
          duration: lesson.examConfig?.duration || 0,
          totalMarks: lesson.examConfig?.totalMarks || 0,
          passingMarks: lesson.examConfig?.passingMarks || 0,
          questionCount: lesson.examConfig?.totalQuestions || 0,
        });
      }
    } else {
      reset({
        title: { en: "", bn: "" },
        type: "video",
        videoUrl: "",
        content: "",
        duration: 0,
        isFreePreview: false,
        examMode: "existing",
        examId: "",
        examTitle: { en: "", bn: "" },
        examDescription: { en: "", bn: "" },
        examDuration: 60,
        examPassingMarks: 50,
        examNegativeMarking: 0,
        examIsProctored: true,
        questions: [],
      });
      setSelectedExam(null);
    }
  }, [lesson, reset, isOpen]);

  // Handle exam selection
  useEffect(() => {
    if (examId && examsData) {
      const found = examsData.find((e: AvailableExam) => e._id === examId);
      setSelectedExam(found || null);
      if (found) {
        setValue("duration", found.duration);
      }
    } else {
      setSelectedExam(null);
    }
  }, [examId, examsData, setValue]);

  const mutation = useMutation({
    mutationFn: async (data: LessonFormData) => {
      const formData = new FormData();

      // Basic fields
      formData.append("title", JSON.stringify(data.title));
      formData.append("type", data.type);
      formData.append("duration", String(data.duration));
      formData.append("isFreePreview", String(data.isFreePreview));

      if (data.videoUrl) formData.append("videoUrl", data.videoUrl);
      if (data.content) formData.append("content", data.content);

      // Exam-specific fields
      if (data.type === "exam") {
        formData.append("examMode", data.examMode || "existing");

        if (data.examMode === "existing" && data.examId) {
          formData.append("examId", data.examId);
        } else if (data.examMode === "new") {
          formData.append("examTitle", JSON.stringify(data.examTitle));
          formData.append(
            "examDescription",
            JSON.stringify(data.examDescription),
          );
          formData.append("examDuration", String(data.examDuration));
          formData.append("examPassingMarks", String(data.examPassingMarks));
          formData.append(
            "examNegativeMarking",
            String(data.examNegativeMarking),
          );
          formData.append("examIsProctored", String(data.examIsProctored));

          if (data.questions && data.questions.length > 0) {
            const questionsPayload = data.questions.map((q) => ({
              type: q.type,
              text: q.text,
              marks: q.marks,
              correctAnswer: q.correctAnswer,
              options:
                q.type === "mcq"
                  ? q.options?.map((opt) => opt.en || "")
                  : undefined,
            }));
            formData.append("questions", JSON.stringify(questionsPayload));
          }
        }
      }

      const url = lesson
        ? `/api/courses/${courseId}/modules/${moduleId}/lessons/${lesson._id}`
        : `/api/courses/${courseId}/modules/${moduleId}/lessons`;
      const method = lesson ? "put" : "post";
      return axios[method](url, formData);
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
    // Validation for exam type
    if (data.type === "exam") {
      if (data.examMode === "existing" && !data.examId) {
        alert("Please select an exam");
        return;
      }
      if (
        data.examMode === "new" &&
        (!data.questions || data.questions.length === 0)
      ) {
        alert("Please add at least one question to create a new exam");
        return;
      }
    }
    mutation.mutate(data);
  };

  // Question management helpers
  const addQuestion = () => {
    const currentQuestions = questions || [];
    setValue("questions", [
      ...currentQuestions,
      {
        id: `q${Date.now()}`,
        type: "mcq",
        text: { en: "", bn: "" },
        options: [
          { en: "", bn: "" },
          { en: "", bn: "" },
          { en: "", bn: "" },
          { en: "", bn: "" },
        ],
        correctAnswer: "",
        marks: 1,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    const currentQuestions = questions || [];
    setValue(
      "questions",
      currentQuestions.filter((_, i) => i !== index),
    );
  };

  if (!isOpen) return null;

  const IconComponent = typeIcons[lessonType || "video"] || FileText;
  const totalMarks = (questions || []).reduce(
    (sum, q) => sum + (q.marks || 0),
    0,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col"
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

        {/* Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          {/* Title Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Title (English) <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title.en", { required: "Title is required" })}
                className="w-full p-2.5 border border-gray-300 placeholder:text-gray-50 text-gray-800 rounded-lg focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none text-sm transition"
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
                className="w-full p-2.5 border border-gray-300 placeholder:text-gray-50 text-gray-800 rounded-lg focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none text-sm transition"
                placeholder="যেমন, HTML পরিচিতি"
                lang="bn"
              />
            </div>
          </div>

          {/* Type & Duration */}
          {/* Type & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ✅ CUSTOM ICON SELECT DROPDOWN */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Lesson Type
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                  className="w-full flex items-center justify-between p-2.5 border border-gray-300 bg-white text-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition"
                >
                  <span className="flex items-center gap-2.5">
                    <IconComponent className="w-4 h-4 text-[#214187]" />
                    <span>
                      {lessonTypeOptions.find((o) => o.value === lessonType)
                        ?.label || "Select Type"}
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${isTypeDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isTypeDropdownOpen && (
                  <>
                    {/* Invisible backdrop to detect outside clicks */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsTypeDropdownOpen(false)}
                    />
                    {/* Dropdown Menu */}
                    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-2 overflow-hidden">
                      {lessonTypeOptions.map((option) => {
                        const Icon = option.icon;
                        const isActive = lessonType === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setValue("type", option.value as any);
                              setIsTypeDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                              isActive
                                ? "bg-[#F3056D]/5 text-[#F3056D] font-semibold"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className={`p-1.5 rounded-lg ${isActive ? "bg-[#F3056D]/10 text-[#F3056D]" : "bg-gray-100 text-gray-500"}`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="flex-1">{option.label}</span>
                            {isActive && (
                              <CheckCircle className="w-4 h-4 text-[#F3056D]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Duration (minutes)
              </label>
              <input
                type="number"
                {...register("duration", { valueAsNumber: true, min: 0 })}
                className="w-full p-2.5 border border-gray-300 placeholder:text-gray-50 text-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition"
                placeholder="e.g., 15"
              />
            </div>
          </div>

          {/* ============================================ */}
          {/* VIDEO TYPE CONTENT */}
          {/* ============================================ */}
          {lessonType === "video" && (
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Video URL
              </label>
              <input
                {...register("videoUrl")}
                className="w-full p-2.5 border border-gray-300 placeholder:text-gray-50 text-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition"
                placeholder="https://vimeo.com/... or https://youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-400 mt-1">
                Supports YouTube, Vimeo, or direct MP4 links
              </p>
            </div>
          )}

          {/* ARTICLE TYPE CONTENT */}
          {(lessonType === "article" || lessonType === "pdf") && (
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Content
              </label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={8}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none resize-y transition"
                    placeholder="Write lesson content here..."
                  />
                )}
              />
            </div>
          )}

          {/* ============================================ */}
          {/* EXAM TYPE CONTENT */}
          {/* ============================================ */}
          {lessonType === "exam" && (
            <div className="space-y-4 border-2 border-amber-200 bg-amber-50/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileQuestion className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-amber-800">Exam Configuration</h4>
              </div>

              {/* Exam Mode Selection */}
              <div className="flex gap-3 mb-4">
                <label
                  className={`flex-1 cursor-pointer p-3 rounded-lg border-2 transition ${
                    examMode === "existing"
                      ? "border-[#214187] bg-[#214187]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    {...register("examMode")}
                    value="existing"
                    className="sr-only"
                  />
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`w-5 h-5 ${
                        examMode === "existing"
                          ? "text-[#214187]"
                          : "text-gray-300"
                      }`}
                    />
                    <div>
                      <p className="font-semibold text-gray-700
                       text-sm">Use Existing Exam</p>
                      <p className="text-xs text-gray-500">
                        Select from your exam library
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`flex-1 cursor-pointer p-3 rounded-lg border-2 transition ${
                    examMode === "new"
                      ? "border-[#214187] bg-[#214187]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    {...register("examMode")}
                    value="new"
                    className="sr-only"
                  />
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`w-5 h-5 ${
                        examMode === "new" ? "text-[#214187]" : "text-gray-300"
                      }`}
                    />
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Create New Exam</p>
                      <p className="text-xs text-gray-500">
                        Build questions here
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Existing Exam Selection */}
              {examMode === "existing" && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-600 uppercase">
                    Select Exam
                  </label>
                  {examsLoading ? (
                    <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin text-[#214187]" />
                      <span className="text-sm text-gray-500">
                        Loading exams...
                      </span>
                    </div>
                  ) : examsData && examsData.length > 0 ? (
                    <select
                      {...register("examId")}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 text-sm focus:ring-2 focus:ring-[#214187] outline-none"
                    >
                      <option value="">-- Select an Exam --</option>
                      {examsData.map((exam: AvailableExam) => (
                        <option key={exam._id} value={exam._id}>
                          {typeof exam.title === "object"
                            ? exam.title.en
                            : exam.title}{" "}
                          — {exam.questionCount} questions, {exam.duration}m,{" "}
                          {exam.totalMarks} marks
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-700">
                        No exams found.{" "}
                        <button
                          type="button"
                          onClick={() => setValue("examMode", "new")}
                          className="underline font-semibold hover:text-yellow-900"
                        >
                          Create a new exam instead
                        </button>
                      </p>
                    </div>
                  )}

                  {/* Selected Exam Preview */}
                  {selectedExam && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">
                        Exam Preview
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-gray-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-500">Questions</p>
                          <p className="font-bold text-[#214187]">
                            {selectedExam.questionCount}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="font-bold text-[#214187]">
                            {selectedExam.duration}m
                          </p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-500">Total Marks</p>
                          <p className="font-bold text-[#214187]">
                            {selectedExam.totalMarks}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-500">Passing</p>
                          <p className="font-bold text-[#214187]">
                            {selectedExam.passingMarks}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* New Exam Creation */}
              {examMode === "new" && (
                <div className="space-y-4">
                  {/* Exam Title */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                        Exam Title (EN)
                      </label>
                      <input
                        {...register("examTitle.en")}
                        className="w-full p-2.5 border border-gray-300 placeholder:text-gray-500 text-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-[#214187] outline-none"
                        placeholder="Midterm Exam"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                        Exam Title (BN)
                      </label>
                      <input
                        {...register("examTitle.bn")}
                        className="w-full p-2.5 border border-gray-300 placeholder:text-gray-500 text-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-[#214187] outline-none"
                        placeholder="মধ্যম সেশন পরীক্ষা"
                        lang="bn"
                      />
                    </div>
                  </div>

                  {/* Exam Settings */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                        Duration (min)
                      </label>
                      <input
                        type="number"
                        {...register("examDuration", { valueAsNumber: true })}
                        className="w-full p-2.5 border border-gray-300 placeholder:text-gray-50 text-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-[#214187] outline-none"
                        defaultValue={60}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                        Passing Marks
                      </label>
                      <input
                        type="number"
                        {...register("examPassingMarks", {
                          valueAsNumber: true,
                        })}
                        className="w-full p-2.5 border border-gray-300 placeholder:text-gray-50 text-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-[#214187] outline-none"
                        defaultValue={50}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                        Negative Marking
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        {...register("examNegativeMarking", {
                          valueAsNumber: true,
                        })}
                        className="w-full p-2.5 border border-gray-300 placeholder:text-gray-50 text-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-[#214187] outline-none"
                        defaultValue={0}
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer p-2.5 bg-white border border-gray-300 rounded-lg w-full">
                        <input
                          type="checkbox"
                          {...register("examIsProctored")}
                          className="w-4 h-4 text-[#214187] rounded"
                          defaultChecked={true}
                        />
                        <span className="text-xs font-medium text-gray-700">
                          Proctored
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Questions Builder */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-700">
                          Questions
                        </span>
                        <span className="bg-[#214187] text-white text-xs px-2 py-0.5 rounded-full">
                          {questions?.length || 0}
                        </span>
                        <span className="text-xs text-gray-500">
                          | Total: {totalMarks} marks
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="text-xs bg-[#214187] text-white px-3 py-1.5 rounded-lg hover:bg-[#1a336b] transition flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Question
                      </button>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {(!questions || questions.length === 0) && (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                          <FileQuestion className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-400">
                            No questions added yet
                          </p>
                          <button
                            type="button"
                            onClick={addQuestion}
                            className="mt-2 text-xs text-[#214187] font-semibold hover:underline"
                          >
                            + Add your first question
                          </button>
                        </div>
                      )}

                      {questions?.map((q, qIndex) => (
                        <div
                          key={q.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 relative group"
                        >
                          {/* Question Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded">
                                Q{qIndex + 1}
                              </span>
                              <select
                                {...register(`questions.${qIndex}.type`)}
                                className="border border-gray-300 rounded text-xs p-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#214187]"
                              >
                                <option value="mcq">MCQ</option>
                                <option value="fill-blank">Fill Blank</option>
                                <option value="short-answer">
                                  Short Answer
                                </option>
                              </select>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeQuestion(qIndex)}
                              className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Question Text */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                            <input
                              {...register(`questions.${qIndex}.text.en`)}
                              className="w-full p-2 border border-gray-200 placeholder:text-gray-400 text-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#214187]"
                              placeholder="Question (EN)"
                            />
                            <input
                              {...register(`questions.${qIndex}.text.bn`)}
                              className="w-full p-2 border border-gray-200 placeholder:text-gray-400 text-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#214187]"
                              placeholder="প্রশ্ন (BN)"
                              lang="bn"
                            />
                          </div>

                          {/* MCQ Options */}
                          {q.type === "mcq" && (
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              {[0, 1, 2, 3].map((optIdx) => (
                                <div
                                  key={optIdx}
                                  className="flex items-center gap-2"
                                >
                                  <span className="text-xs font-bold text-gray-400 w-4">
                                    {String.fromCharCode(65 + optIdx)}.
                                  </span>
                                  <input
                                    {...register(
                                      `questions.${qIndex}.options.${optIdx}.en`,
                                    )}
                                    className="flex-1 p-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#214187]"
                                    placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Correct Answer & Marks */}
                          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                            <div className="flex-1">
                              <label className="text-xs text-gray-500 mb-1 block">
                                Correct Answer
                              </label>
                              {q.type === "mcq" ? (
                                <select
                                  {...register(
                                    `questions.${qIndex}.correctAnswer`,
                                  )}
                                  className="w-full p-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 text-gray-700 focus:ring-[#214187]"
                                >
                                  <option value="">Select</option>
                                  <option value="0">A</option>
                                  <option value="1">B</option>
                                  <option value="2">C</option>
                                  <option value="3">D</option>
                                </select>
                              ) : (
                                <input
                                  {...register(
                                    `questions.${qIndex}.correctAnswer`,
                                  )}
                                  className="w-full p-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#214187]"
                                  placeholder="Type answer..."
                                />
                              )}
                            </div>
                            <div className="w-20">
                              <label className="text-xs text-gray-500 mb-1 block">
                                Marks
                              </label>
                              <input
                                type="number"
                                {...register(`questions.${qIndex}.marks`, {
                                  valueAsNumber: true,
                                })}
                                className="w-full p-1.5 border border-gray-200 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#214187]"
                                defaultValue={1}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Free Preview Checkbox */}
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
