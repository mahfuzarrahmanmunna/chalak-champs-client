"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Plus, Loader2, BookOpen, Globe, Upload, X } from "lucide-react";
import QuillEditor from "../create/QuillEditor";
// import QuillEditor from "./QuillEditor"; // Ensure this path is correct

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
  _id?: string; // Added for editing
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

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CourseFormData | null; // Data for editing
}

export default function CourseFormModal({
  isOpen,
  onClose,
  initialData,
}: CourseFormModalProps) {
  const queryClient = useQueryClient();

  // Determine if we are creating or editing based on presence of _id
  const isEditing = !!initialData?._id;

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // If editing, we might PUT to /api/courses/id, or POST with ID
      // Assuming your backend handles updates via POST with _id or a specific endpoint
      // For now, keeping generic POST logic as per your previous code
      const url = isEditing
        ? `/api/courses/${initialData?._id}`
        : "/api/courses";
      const method = isEditing ? "put" : "post"; // or 'post' depending on your API

      // Note: axios.put/post(body) handles FormData correctly in modern versions
      const response = await axios({
        method,
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
      console.error(err);
      alert(
        "Error saving course: " + (err.response?.data?.message || err.message),
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
      levels: [],
      faqs: [],
      resources: [],
      contentEn: "",
      contentBn: "",
    },
  });

  // Reset form when initialData changes (when opening modal for edit)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else if (!isOpen) {
      reset(); // Clear form if closed without data (create mode)
    }
  }, [initialData, isOpen, reset]);

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

  const stripHtml = (html = "") => {
    if (typeof window === "undefined") return html;
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const onSubmit = async (data: CourseFormData) => {
    try {
      const formData = new FormData();

      // Append ID if editing
      if (isEditing && initialData?._id) {
        formData.append("_id", initialData._id);
      }

      // Simple Fields
      formData.append("instructorName", data.instructorName || "");
      if (data.category) formData.append("category", data.category);
      if (data.level) formData.append("level", data.level);
      if (data.duration) formData.append("duration", data.duration);
      formData.append("price", (data.price || 0).toString());
      if (data.originalPrice) {
        formData.append("originalPrice", data.originalPrice.toString());
      }

      // Transform/Append fields
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

      const quickInfoArr = (data.quickInfo || []).map((q) => q.en || "");
      formData.append("quickInfo", JSON.stringify(quickInfoArr));

      const featuresMapped = (data.features || []).map((f) => ({
        title: f.title?.en || "",
        description: f.desc?.en || "",
      }));
      formData.append("features", JSON.stringify(featuresMapped));

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

      const faqsMapped = (data.faqs || []).map((f: any) => ({
        question: f.question?.en || "",
        answer: f.answer?.en || "",
      }));
      formData.append("faqs", JSON.stringify(faqsMapped));

      formData.append("contentEn", data.contentEn);
      formData.append("contentBn", data.contentBn);

      // Files: Only append if a new file is selected
      if (data.thumbnail && data.thumbnail[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }
      if (data.video && data.video[0]) {
        formData.append("video", data.video[0]);
      }

      formData.append("resources", JSON.stringify(data.resources));

      mutation.mutate(formData);
    } catch (err) {
      console.error(err);
      alert("Error saving form");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            {isEditing ? "Edit Course" : "Create New Course"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* SECTION 1: BASIC INFO */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">
                1. Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Title (EN)
                  </label>
                  <input
                    {...register("title.en")}
                    className="w-full border p-2 rounded text-gray-700 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    শিরোনাম (BN)
                  </label>
                  <input
                    {...register("title.bn")}
                    className="w-full border p-2 rounded text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Instructor
                  </label>
                  <input
                    {...register("instructorName")}
                    className="w-full border p-2 rounded text-gray-700 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    className="w-full border p-2 rounded text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Thumbnail
                  </label>
                  <input
                    type="file"
                    {...register("thumbnail")}
                    className="text-sm w-full text-gray-700 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Promo Video
                  </label>
                  <input
                    type="file"
                    {...register("video")}
                    className="text-sm w-full text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </section>

            {/* SECTION 2: QUILL EDITORS */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">
                2. Course Details
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label className="text-sm font-bold text-blue-700">
                    English Content
                  </label>
                  <Controller
                    name="contentEn"
                    control={control}
                    render={({ field }) => (
                      <QuillEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Type in English..."
                        className="text-gray-700 placeholder:text-gray-400"
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-green-700">
                    বাংলা কন্টেন্ট
                  </label>
                  <Controller
                    name="contentBn"
                    control={control}
                    render={({ field }) => (
                      <QuillEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="বাংলায় লিখুন..."
                        className="text-gray-700 placeholder:text-gray-400"
                      />
                    )}
                  />
                </div>
              </div>
            </section>

            {/* SECTION 3 & 4: QUICK INFO & RESOURCES (Simplified for brevity, copy from previous code) */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg text-gray-900 font-bold">3. Quick Info</h3>
                <button
                  type="button"
                  onClick={() => appendQuickInfo({ en: "", bn: "" })}
                  className="text-blue-600 text-sm font-bold"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {quickInfoFields.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-2 gap-2">
                    <input
                      {...register(`quickInfo.${index}.en`)}
                      placeholder="English"
                      className="border p-2 rounded w-full text-gray-700 placeholder:text-gray-400"
                    />
                    <div className="flex gap-2">
                      <input
                        {...register(`quickInfo.${index}.bn`)}
                        placeholder="বাংলা"
                        className="border p-2 rounded w-full text-gray-700 placeholder:text-gray-400"
                      />
                      {quickInfoFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuickInfo(index)}
                          className="text-red-500 px-2"
                        >
                          X
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SUBMIT BUTTON */}
            <div className="pt-6 border-t bg-white flex justify-end gap-3 sticky bottom-0 z-10">
              <button
                type="button"
                onClick={onClose}
                disabled={mutation.isPending}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                {mutation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {isEditing ? "Update Course" : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
