// src/app/admin-dashboard/courses/create/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Save,
  Loader2,
  Calendar,
  Clock,
  User,
  ListChecks,
  Tag,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import api from "@/lib/api";

// Local fallback colors so this page doesn't depend on ThemeContext
const colors = {
  background: "#f3f4f6",
  foreground: "#111827",
  card: "#ffffff",
  border: "#d1d5db",
  primary: "#2563eb",
  muted: "#6b7280",
  destructive: "#ef4444",
};

// --- 1. Interface ---
interface CreateCourseFormInputs {
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  language: "en" | "bn";
  price: number;
  originalPrice?: number;
  instructor: string;
  duration: string;
  publishDate: string;
  startDate: string;
  tags: string;
  objectives: string[];
  requirements: string[];
}

// --- 2. Validation Schema ---
const courseSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description too short"),
  instructor: yup.string().required("Instructor is required"),
  category: yup.string().required("Category is required"),
  level: yup
    .string()
    .oneOf(["beginner", "intermediate", "advanced"])
    .required("Level is required"),
  language: yup.string().oneOf(["en", "bn"]).required("Language is required"),
  price: yup.number().required("Price is required").min(0),
  duration: yup.string().required("Duration is required"),
  publishDate: yup.string().required("Publish date is required"),
  startDate: yup.string().required("Start date is required"),
  tags: yup.string(),
  objectives: yup.array().of(yup.string()).min(1, "Add at least one objective"),
  requirements: yup.array().of(yup.string()),
});

const categories = [
  "Grammar",
  "Business",
  "Test Preparation",
  "Speaking",
  "Writing",
  "Literature",
  "Vocabulary",
  "Other",
];

const mockInstructors = [
  { id: "1", name: "Sarah Johnson" },
  { id: "2", name: "Michael Chen" },
  { id: "3", name: "Emily Watson" },
  { id: "4", name: "David Brown" },
];

export default function CreateCoursePage() {
  const router = useRouter();
  // REMOVED: const { colors } = useTheme(); (Using the object above now)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateCourseFormInputs>({
    resolver: yupResolver(courseSchema) as any,
    defaultValues: {
      language: "en",
      level: "beginner",
      publishDate: new Date().toISOString().slice(0, 16),
      objectives: [""],
      requirements: [""],
    },
  });

  const {
    fields: objectiveFields,
    append: appendObjective,
    remove: removeObjective,
  } = (useFieldArray as any)({
    control,
    name: "objectives",
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = (useFieldArray as any)({
    control,
    name: "requirements",
  });

  useEffect(() => {
    if (thumbnailFile) {
      const previewUrl = URL.createObjectURL(thumbnailFile);
      setThumbnailPreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [thumbnailFile]);

  const onSubmit: SubmitHandler<CreateCourseFormInputs> = async (data) => {
    if (!thumbnailFile) {
      alert("Please upload a course thumbnail.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // 1. Append Data
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("level", data.level);
      formData.append("language", data.language);
      formData.append("price", data.price.toString());
      if (data.originalPrice)
        formData.append("originalPrice", data.originalPrice.toString());

      // Using req.user._id from backend, but sending instructor ID is good practice if you have it
      // If your backend defaults to req.user._id, you might not need this line, but it's safe.
      // formData.append("instructor", "some_id_if_needed");

      formData.append("duration", data.duration);
      formData.append("publishDate", data.publishDate);
      formData.append("startDate", data.startDate);
      formData.append("tags", data.tags);

      // 2. Append Arrays
      const validObjectives = data.objectives.filter((o) => o.trim() !== "");
      formData.append("objectives", JSON.stringify(validObjectives));

      const validRequirements = data.requirements.filter(
        (r) => r.trim() !== "",
      );
      formData.append("requirements", JSON.stringify(validRequirements));

      // 3. Append Files
      formData.append("thumbnail", thumbnailFile);
      if (videoFile) formData.append("video", videoFile);

      // 4. API Call
      // Note: We use relative path because baseURL is set in api.ts
      const response = await api.post("/courses", formData);

      if (response.data?.success) {
        alert("Course created successfully!");
        router.push("/admin-dashboard/courses");
      } else {
        alert(response.data?.message || "Failed to create course.");
      }
    } catch (error: any) {
      console.error("Error creating course:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create course.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ color: colors.foreground }}
          >
            <ArrowLeft className="w-5 h-5" /> Back to Courses
          </button>
          <h1
            className="text-3xl font-bold"
            style={{ color: colors.foreground }}
          >
            Create New Course
          </h1>
        </div>

        <div
          className="rounded-xl shadow-lg p-8"
          style={{ backgroundColor: colors.card }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* --- Section 1: Basic Info --- */}
            <div className="space-y-4">
              <h2
                className="text-xl font-semibold border-b pb-2 flex items-center gap-2"
                style={{ borderColor: colors.border }}
              >
                <FileText className="w-5 h-5" /> Basic Information
              </h2>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title")}
                  placeholder="e.g. Complete English Grammar"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: errors.title
                      ? colors.destructive
                      : colors.border,
                    color: colors.foreground,
                  }}
                />
                {errors.title && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.destructive }}
                  >
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="What will students learn in this course?"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: errors.description
                      ? colors.destructive
                      : colors.border,
                    color: colors.foreground,
                  }}
                />
                {errors.description && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.destructive }}
                  >
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* --- Section 2: Categorization & Instructor --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  Instructor <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("instructor")}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                >
                  <option value="">Select Instructor</option>
                  {mockInstructors.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
                {errors.instructor && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.destructive }}
                  >
                    {errors.instructor.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  Category
                </label>
                <select
                  {...register("category")}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.destructive }}
                  >
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  Level
                </label>
                <select
                  {...register("level")}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                {errors.level && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.destructive }}
                  >
                    {errors.level.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  Language
                </label>
                <select
                  {...register("language")}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                >
                  <option value="en">English</option>
                  <option value="bn">Bangla</option>
                </select>
              </div>
            </div>

            {/* --- Section 3: Pricing & Duration --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="49.99"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                />
                {errors.price && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.destructive }}
                  >
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  Original Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("originalPrice", { valueAsNumber: true })}
                  placeholder="89.99"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  Duration (Hours) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock
                    className="absolute left-3 top-3 w-5 h-5 opacity-50"
                    style={{ color: colors.muted }}
                  />
                  <input
                    type="number"
                    {...register("duration")}
                    placeholder="12"
                    className="w-full pl-10 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.foreground,
                    }}
                  />
                </div>
                {errors.duration && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.destructive }}
                  >
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>

            {/* --- Section 4: Scheduling --- */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t"
              style={{ borderColor: colors.border }}
            >
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Publish Date{" "}
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="datetime-local"
                  {...register("publishDate")}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                />
                {errors.publishDate && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.destructive }}
                  >
                    {errors.publishDate.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Start Date{" "}
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="datetime-local"
                  {...register("startDate")}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                />
                {errors.startDate && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.destructive }}
                  >
                    {errors.startDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* --- Section 5: Course Details (Dynamic Lists) --- */}
            <div
              className="space-y-6 pt-4 border-t"
              style={{ borderColor: colors.border }}
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ListChecks className="w-5 h-5" /> Course Details
              </h2>

              {/* Tags */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Tags / Keywords
                  </div>
                </label>
                <input
                  {...register("tags")}
                  placeholder="english, grammar, beginner (comma separated)"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                />
              </div>

              {/* Dynamic Objectives */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  What you'll learn (Objectives){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {objectiveFields.map((field: any, index: number) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        {...register(`objectives.${index}`)}
                        placeholder={`Objective ${index + 1}`}
                        className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: errors.objectives
                            ? colors.destructive
                            : colors.border,
                          color: colors.foreground,
                        }}
                      />
                      {objectiveFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeObjective(index)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {errors.objectives && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: colors.destructive }}
                    >
                      {errors.objectives.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => appendObjective("" as any)}
                  className="mt-2 text-sm flex items-center gap-1 hover:underline"
                  style={{ color: colors.primary }}
                >
                  <Plus className="w-4 h-4" /> Add Objective
                </button>
              </div>

              {/* Dynamic Requirements */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  Requirements
                </label>
                <div className="space-y-2">
                  {requirementFields.map((field: any, index: number) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        {...register(`requirements.${index}`)}
                        placeholder={`Requirement ${index + 1}`}
                        className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                          color: colors.foreground,
                        }}
                      />
                      {requirementFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => appendRequirement("" as any)}
                  className="mt-2 text-sm flex items-center gap-1 hover:underline"
                  style={{ color: colors.primary }}
                >
                  <Plus className="w-4 h-4" /> Add Requirement
                </button>
              </div>
            </div>

            {/* --- Section 6: Media --- */}
            <div
              className="space-y-6 pt-4 border-t"
              style={{ borderColor: colors.border }}
            >
              <h2 className="text-xl font-semibold">Course Media</h2>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  Course Thumbnail <span className="text-red-500">*</span>
                </label>
                <div className="flex items-start gap-4">
                  <div
                    className="w-48 h-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center bg-cover bg-center relative overflow-hidden group"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                      backgroundImage: thumbnailPreview
                        ? `url(${thumbnailPreview})`
                        : "none",
                    }}
                  >
                    {!thumbnailPreview && (
                      <>
                        <ImageIcon
                          className="w-8 h-8 mb-2 opacity-50"
                          style={{ color: colors.muted }}
                        />
                        <span className="text-xs opacity-50">No Image</span>
                      </>
                    )}
                    {thumbnailPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveThumbnail}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="file"
                      id="thumbnail-upload"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0])
                          setThumbnailFile(e.target.files[0]);
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="flex items-center justify-center w-full h-12 px-4 border rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        borderColor: colors.primary,
                        color: colors.primary,
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" /> Choose Image
                    </label>
                    <p className="text-xs mt-2" style={{ color: colors.muted }}>
                      Recommended: 1280x720px. JPG, PNG.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.foreground }}
                >
                  Intro Video (Optional)
                </label>
                <div
                  className="flex items-center gap-4 p-4 rounded-lg border"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  }}
                >
                  <Video
                    className="w-8 h-8 opacity-50"
                    style={{ color: colors.muted }}
                  />
                  <div className="flex-1">
                    <input
                      type="file"
                      id="video-upload"
                      accept="video/mp4,video/webm"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setVideoFile(e.target.files[0]);
                          setVideoName(e.target.files[0].name);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="video-upload"
                      className="text-sm font-medium cursor-pointer hover:underline"
                      style={{ color: colors.primary }}
                    >
                      {videoName ? videoName : "Click to upload video"}
                    </label>
                    <p className="text-xs mt-1" style={{ color: colors.muted }}>
                      Max 500MB. MP4 or WebM.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Actions --- */}
            <div className="pt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 rounded-lg font-medium"
                style={{ color: colors.foreground }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white shadow-lg disabled:opacity-70 transition-all"
                style={{ backgroundColor: colors.primary }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Create Course
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
