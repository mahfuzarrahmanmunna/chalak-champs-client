"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
import { Controller } from "react-hook-form"; // Required for Quill
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Plus, Loader2, BookOpen, Globe, Upload, X } from "lucide-react";

// Import the new Quill Editor
import QuillEditor from "./QuillEditor";

// --- TYPES ---
interface BilingualText {
  en: string;
  bn: string;
}

interface BilingualFeature {
  title: BilingualText;
  desc: BilingualText;
}

interface Resource {
  type: "pdf" | "video" | "link" | "image";
  title: string;
  url?: string;
  file?: FileList;
}

interface CourseFormData {
  title: BilingualText;
  heroSubtitle: BilingualText;
  price: number;
  originalPrice?: number;
  thumbnail: FileList;
  video: FileList;
  quickInfo: BilingualText[];
  features: BilingualFeature[];
  levels: any[];
  faqs: any[];
  instructorName: string;
  category: string;
  level: string;
  duration: string;
  resources: Resource[];
  // Changed from EditorJS object to simple HTML strings
  contentEn: string;
  contentBn: string;
}

export default function CoursesClient() {
  // --- REACT QUERY SETUP ---
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await axios.get("/api/courses");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post("/api/courses", formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      alert("Course Created Successfully!");
      reset(); // Reset form after success
    },
    onError: (err: any) => {
      console.error(err);
      alert(
        "Error creating course: " +
          (err.response?.data?.message || err.message),
      );
    },
  });

  // --- FORM SETUP ---
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CourseFormData>({
    defaultValues: {
      title: { en: "", bn: "" },
      heroSubtitle: { en: "", bn: "" },
      price: 0,
      originalPrice: 0,
      instructorName: "",
      category: "",
      level: "",
      duration: "",
      quickInfo: [{ en: "", bn: "" }],
      features: [{ title: { en: "", bn: "" }, desc: { en: "", bn: "" } }],
      levels: [
        { title: { en: "", bn: "" }, target: { en: "", bn: "" }, topics: "" },
      ],
      faqs: [{ question: { en: "", bn: "" }, answer: { en: "", bn: "" } }],
      resources: [],
      // Initialize Quill with empty strings
      contentEn: "",
      contentBn: "",
    },
  });

  // --- FIELD ARRAYS ---
  const {
    fields: quickInfoFields,
    append: appendQuickInfo,
    remove: removeQuickInfo,
  } = useFieldArray({ control, name: "quickInfo" });

  const {
    fields: resourceFields,
    append: appendResource,
    remove: removeResource,
  } = useFieldArray({ control, name: "resources" });

  const watchedResources = useWatch({ control, name: "resources" });

  const onSubmit = async (data: CourseFormData) => {
    // --- HELPER FUNCTION: Defined Once ---
    const stripHtml = (html = "") => {
      if (typeof window === "undefined") return html;
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    // No need to check for "editorsLoaded" as Quill initializes instantly
    try {
      const formData = new FormData();

      // Simple Fields
      formData.append("instructorName", data.instructorName || "");
      if (data.category) formData.append("category", data.category);
      // Only append level when provided (avoid empty string enum cast)
      if (data.level) formData.append("level", data.level);
      if (data.duration) formData.append("duration", data.duration);
      formData.append("price", (data.price || 0).toString());
      if (data.originalPrice) {
        formData.append("originalPrice", data.originalPrice.toString());
      }

      // Transform bilingual structures into backend-friendly shapes
      // Title and heroSubtitle: send English string (backend expects string)
      formData.append("title", data.title?.en || "");

      const heroFallback =
        data.heroSubtitle?.en?.trim() ||
        stripHtml(data.contentEn || "").slice(0, 160) ||
        data.title?.en ||
        "Course subtitle";
      formData.append("heroSubtitle", heroFallback);

      // description is required by backend — prefer heroSubtitle or fall back to plain-text from contentEn
      const descriptionText =
        data.heroSubtitle?.en?.trim() ||
        stripHtml(data.contentEn || "").slice(0, 300) ||
        "Course description";
      formData.append("description", descriptionText);

      // quickInfo: backend expects string[] -> send English entries
      const quickInfoArr = (data.quickInfo || []).map((q) => q.en || "");
      formData.append("quickInfo", JSON.stringify(quickInfoArr));

      // features: map to { title: string, description: string }
      const featuresMapped = (data.features || []).map((f) => ({
        title: f.title?.en || "",
        description: f.desc?.en || "",
      }));
      formData.append("features", JSON.stringify(featuresMapped));

      // levels: map to expected backend shape
      const levelsMapped = (data.levels || []).map((lvl: any) => ({
        title: lvl.title?.en || "",
        description: lvl.description?.en || "",
        targetAudience: lvl.target?.en || "",
        topics:
          typeof lvl.topics === "string" && lvl.topics.length
            ? lvl.topics
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean)
            : Array.isArray(lvl.topics)
              ? lvl.topics
              : [],
      }));
      formData.append("levels", JSON.stringify(levelsMapped));

      // faqs
      const faqsMapped = (data.faqs || []).map((f: any) => ({
        question: f.question?.en || "",
        answer: f.answer?.en || "",
      }));
      formData.append("faqs", JSON.stringify(faqsMapped));

      // Quill Editor Data (Simple HTML Strings)
      formData.append("contentEn", data.contentEn);
      formData.append("contentBn", data.contentBn);

      // Files
      if (data.thumbnail && data.thumbnail[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }
      if (data.video && data.video[0]) {
        formData.append("video", data.video[0]);
      }

      // Resources
      formData.append("resources", JSON.stringify(data.resources));

      mutation.mutate(formData);
    } catch (err) {
      console.error(err);
      alert("Error saving form");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- PAGE HEADER --- */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Course Dashboard
            </h1>
            <p className="text-gray-500">
              Create new courses and manage existing ones.
            </p>
          </div>
        </div>

        {/* --- DIRECT FORM SECTION --- */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Create New Course
            </h2>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* SECTION 1: BASIC INFO */}
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                  1. Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      Title (EN)
                    </label>
                    <input
                      {...register("title.en", { required: true })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Course Title (EN)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      শিরোনাম (BN)
                    </label>
                    <input
                      {...register("title.bn", { required: true })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="কোর্সের নাম (বাংলা)"
                      lang="bn"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      Instructor Name
                    </label>
                    <input
                      {...register("instructorName")}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900"
                      placeholder="Teacher Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      Price
                    </label>
                    <input
                      type="number"
                      {...register("price", {
                        required: true,
                        valueAsNumber: true,
                      })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900"
                      placeholder="15000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thumbnail
                    </label>
                    <input
                      type="file"
                      {...register("thumbnail")}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Promo Video
                    </label>
                    <input
                      type="file"
                      {...register("video")}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 2: QUILL EDITORS */}
              <section className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
                <h3 className="text-lg font-bold text-gray-900">
                  2. Course Details
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-blue-700">
                      <Globe className="w-4 h-4" /> English Content
                    </label>
                    {/* Controller is required for React Hook Form + Custom Component */}
                    <Controller
                      name="contentEn"
                      control={control}
                      render={({ field }) => (
                        <QuillEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Type in English..."
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-green-700">
                      <Globe className="w-4 h-4" /> বাংলা কন্টেন্ট
                    </label>
                    <Controller
                      name="contentBn"
                      control={control}
                      render={({ field }) => (
                        <QuillEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="বাংলায় লিখুন..."
                        />
                      )}
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 3: QUICK INFO */}
              <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    3. Quick Info
                  </h3>
                  <button
                    type="button"
                    onClick={() => appendQuickInfo({ en: "", bn: "" })}
                    className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-100 transition"
                  >
                    <Plus className="w-4 h-4 inline mr-1" /> Add Info
                  </button>
                </div>
                <div className="space-y-3">
                  {quickInfoFields.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
                    >
                      <input
                        {...register(`quickInfo.${index}.en`)}
                        className="w-full border p-3 rounded text-sm text-gray-900"
                        placeholder="English Info"
                      />
                      <div className="flex gap-2">
                        <input
                          {...register(`quickInfo.${index}.bn`)}
                          className="w-full border p-3 rounded text-sm text-gray-900"
                          placeholder="বাংলা তথ্য"
                          lang="bn"
                        />
                        {quickInfoFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuickInfo(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 4: RESOURCES */}
              <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    4. Resources
                  </h3>
                  <button
                    type="button"
                    onClick={() => appendResource({ type: "pdf", title: "" })}
                    className="text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-md hover:bg-purple-100 transition"
                  >
                    <Plus className="w-4 h-4 inline mr-1" /> Add Resource
                  </button>
                </div>
                {resourceFields.map((field, index) => {
                  const currentType = watchedResources?.[index]?.type || "pdf";
                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg items-center"
                    >
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 block mb-1">
                          Type
                        </label>
                        <select
                          {...register(`resources.${index}.type`)}
                          className="w-full border p-2 rounded bg-white text-sm"
                        >
                          <option value="pdf">PDF</option>
                          <option value="video">Video</option>
                          <option value="link">Link</option>
                        </select>
                      </div>
                      <div className="md:col-span-4">
                        <label className="text-xs font-bold text-gray-500 block mb-1">
                          Title
                        </label>
                        <input
                          {...register(`resources.${index}.title`)}
                          className="w-full border p-2 rounded text-sm"
                          placeholder="Resource Title"
                        />
                      </div>
                      <div className="md:col-span-5">
                        <label className="text-xs font-bold text-gray-500 block mb-1">
                          File / URL
                        </label>
                        {currentType === "video" || currentType === "link" ? (
                          <input
                            {...register(`resources.${index}.url`)}
                            className="w-full border p-2 rounded text-sm"
                            placeholder="https://..."
                          />
                        ) : (
                          <input
                            type="file"
                            {...register(`resources.${index}.file`)}
                            className="w-full text-xs text-gray-500"
                          />
                        )}
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeResource(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </section>

              {/* SUBMIT BUTTON */}
              <div className="pt-6 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => reset()}
                  disabled={mutation.isPending}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition ${
                    mutation.isPending
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                  }`}
                >
                  {mutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {mutation.isPending ? "Creating..." : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* --- COURSES LIST SECTION --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Existing Courses
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Failed to load courses.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data?.data?.map((course: any) => (
                <div
                  key={course._id}
                  className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title?.en}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg mb-2 text-gray-900">
                      {course.title?.en || course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
                      {course.heroSubtitle?.en || course.heroSubtitle}
                    </p>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t">
                      <span className="text-blue-600 font-bold text-lg">
                        BDT {course.price}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          course.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {data?.data?.length === 0 && (
                <div className="col-span-3 text-center py-12 text-gray-400">
                  No courses found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
