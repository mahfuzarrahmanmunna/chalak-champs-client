// src/app/[lang]/admin-dashboard/courses/manage-courses/CourseFormModal.tsx

"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import {
  Plus,
  Loader2,
  BookOpen,
  Globe,
  Upload,
  X,
  Trash2,
} from "lucide-react";
import QuillEditor from "../create/QuillEditor";

// --- TYPES ---
interface BilingualText {
  en: string;
  bn: string;
}

interface CourseFormData {
  _id?: string;
  title: BilingualText;
  heroSubtitle: BilingualText;
  price: number;
  originalPrice?: number;
  thumbnail: FileList;
  video: FileList;
  quickInfo: BilingualText[];
  features: any[];
  levels: any[];
  faqs: any[];
  instructorName: string;
  category: string;
  level: string;
  duration: string;
  resources: any[];
  contentEn: string;
  contentBn: string;
}

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null;
}

export default function CourseFormModal({
  isOpen,
  onClose,
  initialData,
}: CourseFormModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!initialData?._id;

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const url = isEditing
        ? `/api/courses/${initialData?._id}`
        : "/api/courses";
      const response = await axios({
        method: isEditing ? "put" : "post",
        url,
        data: formData,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      alert(
        isEditing
          ? "Course Updated Successfully!"
          : "Course Created Successfully!",
      );
      onClose();
    },
    onError: (err: any) => {
      alert("Error: " + (err.response?.data?.message || err.message));
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
      levels: [],
      faqs: [],
      resources: [],
      contentEn: "",
      contentBn: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      // 1. Normalize quickInfo: ["string"] -> [{ en: "string", bn: "string" }]
      const normalizedQuickInfo = (initialData.quickInfo || []).map((q: any) =>
        typeof q === "string" ? { en: q, bn: q } : q,
      );

      // 2. Normalize faqs: { question: "string" } -> { question: { en: "string", bn: "" } }
      const normalizedFaqs = (initialData.faqs || []).map((f: any) => ({
        question:
          typeof f.question === "string"
            ? { en: f.question, bn: "" }
            : f.question || { en: "", bn: "" },
        answer:
          typeof f.answer === "string"
            ? { en: f.answer, bn: "" }
            : f.answer || { en: "", bn: "" },
      }));

      // 3. Strip MongoDB _id from arrays so React Hook Form doesn't get confused
      const normalizedLevels = (initialData.levels || []).map(
        ({ _id, ...rest }: any) => rest,
      );
      const normalizedFeatures = (initialData.features || []).map(
        ({ _id, ...rest }: any) => rest,
      );

      reset({
        // Handle title safely (in case old DB entries are still plain strings)
        title:
          typeof initialData.title === "object"
            ? initialData.title
            : { en: initialData.title || "", bn: "" },

        heroSubtitle:
          typeof initialData.heroSubtitle === "object"
            ? initialData.heroSubtitle
            : { en: initialData.heroSubtitle || "", bn: "" },

        price: initialData.price || 0,
        originalPrice: initialData.originalPrice || 0,
        instructorName: initialData.instructorName || "",
        category: initialData.category || "",
        level: initialData.level || "",
        duration: initialData.duration || "",

        // Pass the normalized arrays
        quickInfo: normalizedQuickInfo.length
          ? normalizedQuickInfo
          : [{ en: "", bn: "" }],
        features: normalizedFeatures.length
          ? normalizedFeatures
          : [{ title: { en: "", bn: "" }, desc: { en: "", bn: "" } }],
        levels: normalizedLevels,
        faqs: normalizedFaqs,
        resources: initialData.resources || [],

        // Quill content is stored in description object in DB
        contentEn: initialData.contentEn || initialData.description?.en || "",
        contentBn: initialData.contentBn || initialData.description?.bn || "",
      });
    } else if (!isOpen) {
      reset();
    }
  }, [initialData, isOpen, reset]);

  
  const {
    fields: quickInfoFields,
    append: appendQuickInfo,
    remove: removeQuickInfo,
  } = useFieldArray({ control, name: "quickInfo" });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({ control, name: "features" });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({ control, name: "faqs" });

  const {
    fields: resourceFields,
    append: appendResource,
    remove: removeResource,
  } = useFieldArray({ control, name: "resources" });

  const {
    fields: levelFields,
    append: appendLevel,
    remove: removeLevel,
  } = useFieldArray({ control, name: "levels" });

  const watchedResources = useWatch({ control, name: "resources" });

  // Reusable Input Classes matching plain design
  const inputClass =
    "w-full border border-gray-300 p-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition-shadow bg-white";
  const fileClass =
    "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F3056D]/10 file:text-[#F3056D] hover:file:bg-[#F3056D]/20 cursor-pointer";

  const onSubmit = async (data: CourseFormData) => {
    try {
      const formData = new FormData();
      if (isEditing && initialData?._id)
        formData.append("_id", initialData._id);

      formData.append("instructorName", data.instructorName || "");
      if (data.category) formData.append("category", data.category);
      if (data.level) formData.append("level", data.level);
      if (data.duration) formData.append("duration", data.duration);
      formData.append("price", (data.price || 0).toString());
      if (data.originalPrice)
        formData.append("originalPrice", data.originalPrice.toString());

      formData.append(
        "title",
        JSON.stringify(data.title || { en: "", bn: "" }),
      );
      formData.append(
        "heroSubtitle",
        JSON.stringify(data.heroSubtitle || { en: "", bn: "" }),
      );

      const quickInfoArr = (data.quickInfo || []).map((q) => q.en || "");
      formData.append("quickInfo", JSON.stringify(quickInfoArr));

      formData.append("features", JSON.stringify(data.features || []));
      formData.append("levels", JSON.stringify(data.levels || []));

      const faqsMapped = (data.faqs || []).map((f: any) => ({
        question: f.question?.en || f.question || "",
        answer: f.answer?.en || f.answer || "",
      }));
      formData.append("faqs", JSON.stringify(faqsMapped));

      formData.append("contentEn", data.contentEn || "");
      formData.append("contentBn", data.contentBn || "");
      formData.append("resources", JSON.stringify(data.resources || []));

      if (data.thumbnail?.[0]) formData.append("thumbnail", data.thumbnail[0]);
      if (data.video?.[0]) formData.append("video", data.video[0]);

      mutation.mutate(formData);
    } catch (err) {
      console.error(err);
      alert("Error preparing form data");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-md p-4 pt-10 overflow-y-auto pb-10">
      <div className="bg-[#F9FAFB] rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden border border-gray-200/50 animate-in fade-in zoom-in-95 duration-200">
        {/* ===== MODAL HEADER ===== */}
        <div className="flex items-center justify-between p-6 border-b bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F3056D] rounded-lg shadow-lg shadow-[#F3056D]/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#214187]">
                {isEditing ? "Edit Course" : "Create New Course"}
              </h2>
              <p className="text-xs text-gray-500">Fill in the details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===== PLAIN SCROLLABLE FORM ===== */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 md:p-10 space-y-8"
        >
          {/* SECTION 1 */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/80">
              <h2 className="text-xl font-bold text-[#214187] flex items-center gap-3">
                <div className="p-2 bg-[#F3056D] rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                1. Basic Information
              </h2>
            </div>

            <div className="p-8 space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Category
                  </label>
                  <input
                    {...register("category")}
                    className={inputClass}
                    placeholder="e.g., Development"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Level
                  </label>
                  <select {...register("level")} className={inputClass}>
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all">All Levels</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Duration
                  </label>
                  <input
                    {...register("duration")}
                    className={inputClass}
                    placeholder="e.g., 20 hours"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Subtitle (EN)
                  </label>
                  <input
                    {...register("heroSubtitle.en")}
                    className={inputClass}
                    placeholder="Short description for cards"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    উপশিরোনাম (BN)
                  </label>
                  <input
                    {...register("heroSubtitle.bn")}
                    className={inputClass}
                    placeholder="কার্ডের জন্য সংক্ষিপ্ত বিবরণ"
                    lang="bn"
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
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-4">
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
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#F3056D] pl-4">
                4. Features
              </h3>
              <button
                type="button"
                onClick={() =>
                  appendFeature({
                    title: { en: "", bn: "" },
                    desc: { en: "", bn: "" },
                  })
                }
                className="text-sm font-semibold bg-[#F3056D]/10 text-[#F3056D] px-4 py-1.5 rounded-lg hover:bg-[#F3056D]/20 transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Feature
              </button>
            </div>
            <div className="space-y-4">
              {featureFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-gray-50 p-5 rounded-xl space-y-4 border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 bg-white px-2.5 py-1 rounded-md border">
                      Feature #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        Title (EN)
                      </label>
                      <input
                        {...register(`features.${index}.title.en`)}
                        className={inputClass}
                        placeholder="Feature title"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        Title (BN)
                      </label>
                      <input
                        {...register(`features.${index}.title.bn`)}
                        className={inputClass}
                        placeholder="বৈশিষ্ট্যের শিরোনাম"
                        lang="bn"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        Description (EN)
                      </label>
                      <textarea
                        {...register(`features.${index}.desc.en`)}
                        rows={2}
                        className={`${inputClass} resize-none`}
                        placeholder="Brief description"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        Description (BN)
                      </label>
                      <textarea
                        {...register(`features.${index}.desc.bn`)}
                        rows={2}
                        className={`${inputClass} resize-none`}
                        placeholder="সংক্ষিপ্ত বিবরণ"
                        lang="bn"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5 */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#F3056D] pl-4">
                5. Levels
              </h3>
              <button
                type="button"
                onClick={() =>
                  appendLevel({
                    title: { en: "", bn: "" },
                    description: { en: "", bn: "" },
                    target: { en: "", bn: "" },
                    topics: "",
                  })
                }
                className="text-sm font-semibold bg-[#F3056D]/10 text-[#F3056D] px-4 py-1.5 rounded-lg hover:bg-[#F3056D]/20 transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Level
              </button>
            </div>
            <div className="space-y-4">
              {levelFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-gray-50 p-5 rounded-xl space-y-4 border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 bg-white px-2.5 py-1 rounded-md border">
                      Level #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeLevel(index)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        Title (EN)
                      </label>
                      <input
                        {...register(`levels.${index}.title.en`)}
                        className={inputClass}
                        placeholder="e.g., Beginner Level"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        Title (BN)
                      </label>
                      <input
                        {...register(`levels.${index}.title.bn`)}
                        className={inputClass}
                        placeholder="যেমন, নতুন লেভেল"
                        lang="bn"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        Target Audience (EN)
                      </label>
                      <input
                        {...register(`levels.${index}.target.en`)}
                        className={inputClass}
                        placeholder="e.g., Absolute beginners"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        Topics
                      </label>
                      <input
                        {...register(`levels.${index}.topics`)}
                        className={inputClass}
                        placeholder="HTML, CSS, JS (comma separated)"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">
                      Description (EN)
                    </label>
                    <textarea
                      {...register(`levels.${index}.description.en`)}
                      rows={3}
                      className={`${inputClass} resize-none`}
                      placeholder="What students will learn in this level..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 6 */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#F3056D] pl-4">
                6. FAQs
              </h3>
              <button
                type="button"
                onClick={() =>
                  appendFaq({
                    question: { en: "", bn: "" },
                    answer: { en: "", bn: "" },
                  })
                }
                className="text-sm font-semibold bg-[#F3056D]/10 text-[#F3056D] px-4 py-1.5 rounded-lg hover:bg-[#F3056D]/20 transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add FAQ
              </button>
            </div>
            <div className="space-y-4">
              {faqFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-gray-50 p-5 rounded-xl space-y-4 border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 bg-white px-2.5 py-1 rounded-md border">
                      FAQ #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        Question (EN)
                      </label>
                      <input
                        {...register(`faqs.${index}.question.en`)}
                        className={inputClass}
                        placeholder="Question in English"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        Question (BN)
                      </label>
                      <input
                        {...register(`faqs.${index}.question.bn`)}
                        className={inputClass}
                        placeholder="বাংলায় প্রশ্ন"
                        lang="bn"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        Answer (EN)
                      </label>
                      <textarea
                        {...register(`faqs.${index}.answer.en`)}
                        rows={2}
                        className={`${inputClass} resize-none`}
                        placeholder="Answer in English"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        Answer (BN)
                      </label>
                      <textarea
                        {...register(`faqs.${index}.answer.bn`)}
                        rows={2}
                        className={`${inputClass} resize-none`}
                        placeholder="বাংলায় উত্তর"
                        lang="bn"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 7 */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#F3056D] pl-4">
                7. Resources
              </h3>
              <button
                type="button"
                onClick={() =>
                  appendResource({ type: "pdf", title: "", url: "" })
                }
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

          {/* SUBMIT SECTION */}
          <div className="pt-8 border-t border-gray-200 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="px-8 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold transition"
            >
              Cancel
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
              {mutation.isPending
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Course"
                  : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
