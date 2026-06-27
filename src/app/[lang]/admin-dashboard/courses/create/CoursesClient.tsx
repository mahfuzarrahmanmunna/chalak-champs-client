"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import {
  Plus,
  Loader2,
  BookOpen,
  Globe,
  Upload,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import QuillEditor from "./QuillEditor";
import Link from "next/link";

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
  contentEn: string;
  contentBn: string;
}

export default function CoursesClient() {
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
      reset();
    },
    onError: (err: any) => {
      console.error(err);
      alert(
        "Error creating course: " +
          (err.response?.data?.message || err.message),
      );
    },
  });

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
      contentEn: "",
      contentBn: "",
    },
  });

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
    const stripHtml = (html = "") => {
      if (typeof window === "undefined") return html;
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    try {
      const formData = new FormData();

      formData.append("instructorName", data.instructorName || "");
      if (data.category) formData.append("category", data.category);
      if (data.level) formData.append("level", data.level);
      if (data.duration) formData.append("duration", data.duration);
      formData.append("price", (data.price || 0).toString());
      if (data.originalPrice)
        formData.append("originalPrice", data.originalPrice.toString());

      formData.append("title", data.title?.en || "");

      const heroFallback =
        data.heroSubtitle?.en?.trim() ||
        stripHtml(data.contentEn || "").slice(0, 160) ||
        data.title?.en ||
        "Course subtitle";
      formData.append("heroSubtitle", heroFallback);

      const descriptionText =
        data.heroSubtitle?.en?.trim() ||
        stripHtml(data.contentEn || "").slice(0, 300) ||
        "Course description";
      formData.append("description", descriptionText);

      formData.append(
        "quickInfo",
        JSON.stringify((data.quickInfo || []).map((q) => q.en || "")),
      );

      formData.append(
        "features",
        JSON.stringify(
          (data.features || []).map((f) => ({
            title: f.title?.en || "",
            description: f.desc?.en || "",
          })),
        ),
      );

      formData.append(
        "levels",
        JSON.stringify(
          (data.levels || []).map((lvl: any) => ({
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
          })),
        ),
      );

      formData.append(
        "faqs",
        JSON.stringify(
          (data.faqs || []).map((f: any) => ({
            question: f.question?.en || "",
            answer: f.answer?.en || "",
          })),
        ),
      );

      formData.append("contentEn", data.contentEn);
      formData.append("contentBn", data.contentBn);

      if (data.thumbnail && data.thumbnail[0])
        formData.append("thumbnail", data.thumbnail[0]);
      if (data.video && data.video[0]) formData.append("video", data.video[0]);

      formData.append("resources", JSON.stringify(data.resources));

      mutation.mutate(formData);
    } catch (err) {
      console.error(err);
      alert("Error saving form");
    }
  };

  // Reusable Input Classes
  const inputClass =
    "w-full border border-gray-300 p-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition-shadow bg-white";
  const fileClass =
    "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F3056D]/10 file:text-[#F3056D] hover:file:bg-[#F3056D]/20 cursor-pointer";

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Course Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Create new courses and manage existing ones.
            </p>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b bg-gray-50/80">
            <h2 className="text-xl font-bold text-[#214187] flex items-center gap-3">
              <div className="p-2 bg-[#F3056D] rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              Create New Course
            </h2>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* SECTION 1 */}
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#F3056D] pl-4">
                  1. Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Title (EN)
                    </label>
                    <input
                      {...register("title.en", { required: true })}
                      className={inputClass}
                      placeholder="Course Title (EN)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                      শিরোনাম (BN)
                    </label>
                    <input
                      {...register("title.bn", { required: true })}
                      className={inputClass}
                      placeholder="কোর্সের নাম (বাংলা)"
                      lang="bn"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Instructor
                    </label>
                    <input
                      {...register("instructorName")}
                      className={inputClass}
                      placeholder="Teacher Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Price (BDT)
                    </label>
                    <input
                      type="number"
                      {...register("price", {
                        required: true,
                        valueAsNumber: true,
                      })}
                      className={inputClass}
                      placeholder="15000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Original Price
                    </label>
                    <input
                      type="number"
                      {...register("originalPrice", { valueAsNumber: true })}
                      className={inputClass}
                      placeholder="20000 (Optional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Thumbnail Image
                    </label>
                    <input
                      type="file"
                      {...register("thumbnail")}
                      className={fileClass}
                      accept="image/*"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Promo Video
                    </label>
                    <input
                      type="file"
                      {...register("video")}
                      className={fileClass}
                      accept="video/*"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 2 */}
              <section className="bg-[#F9FAFB] p-6 rounded-2xl border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold text-[#214187]">
                  2. Course Details
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#214187]">
                      <Globe className="w-4 h-4" /> English Content
                    </label>
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
                    <label className="flex items-center gap-2 text-sm font-bold text-[#214187]">
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

              {/* SECTION 3 */}
              <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#F3056D] pl-4">
                    3. Quick Info
                  </h3>
                  <button
                    type="button"
                    onClick={() => appendQuickInfo({ en: "", bn: "" })}
                    className="text-sm font-semibold bg-[#F3056D]/10 text-[#F3056D] px-4 py-1.5 rounded-lg hover:bg-[#F3056D]/20 transition flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Info
                  </button>
                </div>
                <div className="space-y-3">
                  {quickInfoFields.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start bg-gray-50 p-4 rounded-xl"
                    >
                      <input
                        {...register(`quickInfo.${index}.en`)}
                        className={inputClass}
                        placeholder="English Info"
                      />
                      <div className="flex gap-2">
                        <input
                          {...register(`quickInfo.${index}.bn`)}
                          className={`${inputClass} flex-1`}
                          placeholder="বাংলা তথ্য"
                          lang="bn"
                        />
                        {quickInfoFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuickInfo(index)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 4 */}
              <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#F3056D] pl-4">
                    4. Resources
                  </h3>
                  <button
                    type="button"
                    onClick={() => appendResource({ type: "pdf", title: "" })}
                    className="text-sm font-semibold bg-[#214187]/10 text-[#214187] px-4 py-1.5 rounded-lg hover:bg-[#214187]/20 transition flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Resource
                  </button>
                </div>
                {resourceFields.map((field, index) => {
                  const currentType = watchedResources?.[index]?.type || "pdf";
                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-xl items-center border border-gray-100"
                    >
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 block mb-1">
                          Type
                        </label>
                        <select
                          {...register(`resources.${index}.type`)}
                          className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-sm focus:ring-2 focus:ring-[#F3056D]/20 outline-none"
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
                          className={`${inputClass} !py-2.5`}
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
                            className={`${inputClass} !py-2.5`}
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
                      <div className="md:col-span-1 flex justify-end pt-5">
                        <button
                          type="button"
                          onClick={() => removeResource(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </section>

              {/* SUBMIT */}
              <div className="pt-8 border-t border-gray-200 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => reset()}
                  disabled={mutation.isPending}
                  className="px-8 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold transition"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className={`px-10 py-3 rounded-xl font-bold flex items-center gap-2 text-white transition-all shadow-lg ${
                    mutation.isPending
                      ? "bg-gray-400 cursor-not-allowed shadow-none"
                      : "bg-[#F3056D] hover:bg-[#d9045c] shadow-[#F3056D]/30 hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  {mutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                  {mutation.isPending ? "Creating..." : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* COURSES LIST SECTION */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-[#214187] mb-8">
            Existing Courses
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-10 h-10 animate-spin text-[#F3056D]" />
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 font-medium">
              Failed to load courses.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data?.data?.map((course: any) => (
                <Link
                  href={`/dashboard/courses/${course._id}/modules`}
                  key={course._id}
                  className="group"
                >
                  <div className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#F3056D]/20 transition-all duration-300 flex flex-col h-full bg-white">
                    <div className="h-52 bg-gray-100 relative overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title?.en}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <BookOpen className="w-16 h-16" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-[#214187] transition-colors line-clamp-2">
                        {course.title?.en || course.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-1">
                        {course.heroSubtitle?.en || course.heroSubtitle}
                      </p>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-[#F3056D] font-extrabold text-xl">
                          {course.price === 0 ? "Free" : `৳${course.price}`}
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 ${
                            course.isPublished
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {course.isPublished ? (
                            <>
                              <Eye className="w-3 h-3" /> Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Draft
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {data?.data?.length === 0 && (
                <div className="col-span-3 text-center py-20 text-gray-400 font-medium border-2 border-dashed border-gray-200 rounded-2xl">
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
