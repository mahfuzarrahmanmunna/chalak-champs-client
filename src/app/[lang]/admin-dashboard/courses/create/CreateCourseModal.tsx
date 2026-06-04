"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Plus, Upload, Loader2, BookOpen, Globe, X } from "lucide-react";

// Dynamic Import
import dynamic from "next/dynamic";

const CourseEditor = dynamic(() => import("./CourseEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center bg-gray-50 border rounded-md">
      <span className="text-gray-500 animate-pulse">Loading Editor...</span>
    </div>
  ),
});

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
}

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  mutate: (data: FormData) => void;
  isPending: boolean;
}

export default function CreateCourseModal({
  isOpen,
  onClose,
  mutate,
  isPending,
}: CreateCourseModalProps) {
  const enEditorRef = useRef<any>(null);
  const bnEditorRef = useRef<any>(null);
  const [enEditorReady, setEnEditorReady] = useState(false);
  const [bnEditorReady, setBnEditorReady] = useState(false);

  // --- FIX: Stabilize the callback to prevent resets ---
  const handleEditorReady = useCallback((lang: "en" | "bn") => {
    if (lang === "en") setEnEditorReady(true);
    if (lang === "bn") setBnEditorReady(true);
  }, []);

  // --- FIX: Cleanup editors ONLY when modal closes ---
  // This prevents React 18 Strict Mode unmounts from destroying the editor too early
  useEffect(() => {
    return () => {
      // If the modal is closing (or closed), destroy the instances
      if (!isOpen) {
        if (enEditorRef.current?.destroy) {
          enEditorRef.current.destroy();
        }
        if (bnEditorRef.current?.destroy) {
          bnEditorRef.current.destroy();
        }
      }
    };
  }, [isOpen]);

  // Reset editor readiness when the modal opens
  useEffect(() => {
    if (isOpen) {
      setEnEditorReady(false);
      setBnEditorReady(false);
    }
  }, [isOpen]);

  const editorsLoaded = enEditorReady && bnEditorReady;

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
    },
  });

  // --- FIELD ARRAYS ---
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
    fields: resourceFields,
    append: appendResource,
    remove: removeResource,
  } = useFieldArray({ control, name: "resources" });

  const watchedResources = useWatch({ control, name: "resources" });

  const onSubmit = async (data: CourseFormData) => {
    // --- CRITICAL FIX: Check if refs are ready ---
    // This prevents the crash if the user hits Enter or clicks Submit too fast
    if (!editorsLoaded || !enEditorRef.current || !bnEditorRef.current) {
      alert(
        "Editors are still loading. Please wait a moment before submitting.",
      );
      return;
    }

    try {
      const enEditorData = await enEditorRef.current.save();
      const bnEditorData = await bnEditorRef.current.save();

      // 1. Create FormData
      const formData = new FormData();

      // 2. Append Simple Fields
      formData.append("instructorName", data.instructorName);
      formData.append("category", data.category);
      formData.append("level", data.level);
      formData.append("duration", data.duration);
      formData.append("price", data.price.toString());
      if (data.originalPrice) {
        formData.append("originalPrice", data.originalPrice.toString());
      }

      // 3. Append Bilingual/Complex Fields
      formData.append("title", JSON.stringify(data.title));
      formData.append("heroSubtitle", JSON.stringify(data.heroSubtitle));
      formData.append("quickInfo", JSON.stringify(data.quickInfo));
      formData.append("features", JSON.stringify(data.features));
      formData.append("levels", JSON.stringify(data.levels));
      formData.append("faqs", JSON.stringify(data.faqs));

      // 4. Append Editor Data
      formData.append(
        "overview",
        JSON.stringify({ en: enEditorData, bn: bnEditorData }),
      );

      // 5. Append Files
      if (data.thumbnail && data.thumbnail[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }
      if (data.video && data.video[0]) {
        formData.append("video", data.video[0]);
      }

      // 6. Append Resources
      formData.append("resources", JSON.stringify(data.resources));

      // 7. Trigger Mutation
      mutate(formData);
    } catch (err) {
      console.error(err);
      alert("Error saving form");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Create Bilingual Course
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* SECTION 1: BASIC INFO */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
              <h3 className="text-lg font-bold text-gray-900">
                1. Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase">
                    Title (EN)
                  </label>
                  <input
                    {...register("title.en", { required: true })}
                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-900"
                    placeholder="Course Title (EN)"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase">
                    শিরোনাম (BN)
                  </label>
                  <input
                    {...register("title.bn", { required: true })}
                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-900"
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

            {/* --- SECTION 2: EDITOR JS --- */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
              <h3 className="text-lg font-bold text-gray-900">
                2. Course Details
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-blue-700">
                    <Globe className="w-4 h-4" /> English Content
                  </label>
                  <CourseEditor
                    editorRef={enEditorRef}
                    placeholder="Type in English..."
                    onEditorReady={() => handleEditorReady("en")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-green-700">
                    <Globe className="w-4 h-4" /> বাংলা কন্টেন্ট
                  </label>
                  <CourseEditor
                    editorRef={bnEditorRef}
                    placeholder="বাংলায় লিখুন..."
                    onEditorReady={() => handleEditorReady("bn")}
                  />
                </div>
              </div>
              {!editorsLoaded && (
                <p className="text-sm text-gray-500 mt-2">
                  Course editor is still initializing. Please wait a moment
                  before submitting.
                </p>
              )}
            </section>

            {/* --- SECTION 3: QUICK INFO --- */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-bold text-gray-900">
                  3. Quick Info
                </h3>
                <button
                  type="button"
                  onClick={() => appendQuickInfo({ en: "", bn: "" })}
                  className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-md"
                >
                  <Plus className="w-4 h-4 inline mr-1" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {quickInfoFields.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2"
                  >
                    <input
                      {...register(`quickInfo.${index}.en`)}
                      className="w-full border p-2 rounded text-sm text-gray-900 placeholder:text-gray-600"
                      placeholder="English Info"
                    />
                    <input
                      {...register(`quickInfo.${index}.bn`)}
                      className="w-full border p-2 rounded text-sm text-gray-900 placeholder:text-gray-600"
                      placeholder="বাংলা তথ্য"
                      lang="bn"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* --- SECTION 4: RESOURCES --- */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-bold text-gray-900">
                  4. Resources
                </h3>
                <button
                  type="button"
                  onClick={() => appendResource({ type: "pdf", title: "" })}
                  className="text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-md"
                >
                  <Plus className="w-4 h-4 inline mr-1" /> Add Resource
                </button>
              </div>
              {resourceFields.map((field, index) => {
                const currentType = watchedResources?.[index]?.type || "pdf";
                return (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <label className="text-xs font-bold text-gray-500">
                        Type
                      </label>
                      <select
                        {...register(`resources.${index}.type`)}
                        className="w-full border p-2 rounded bg-white text-gray-900 placeholder:text-gray-600"
                      >
                        <option value="pdf">PDF</option>
                        <option value="video">Video Link</option>
                        <option value="link">Link</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500">
                        Title
                      </label>
                      <input
                        {...register(`resources.${index}.title`)}
                        className="w-full border p-2 rounded text-gray-900 placeholder:text-gray-600"
                        placeholder="Title"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500">
                        File / URL
                      </label>
                      {currentType === "video" || currentType === "link" ? (
                        <input
                          {...register(`resources.${index}.url`)}
                          className="w-full border p-2 rounded text-gray-900 placeholder:text-gray-600"
                          placeholder="Paste URL"
                        />
                      ) : (
                        <input
                          type="file"
                          {...register(`resources.${index}.file`)}
                          className="w-full text-xs text-gray-900 placeholder:text-gray-600"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </section>

            {/* SUBMIT BUTTON (INSIDE FORM) */}
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !editorsLoaded}
                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  isPending || !editorsLoaded
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : !editorsLoaded ? (
                  <span>Initializing Editor...</span>
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {isPending
                  ? "Creating..."
                  : editorsLoaded
                    ? "Create Course"
                    : "Wait..."}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
