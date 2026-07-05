"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Plus, Upload, Loader2, BookOpen, Globe, X } from "lucide-react";
import dynamic from "next/dynamic";

const CourseEditor = dynamic(() => import("./CourseEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center bg-gray-50 border rounded-xl">
      <span className="text-gray-500 animate-pulse">Loading Editor...</span>
    </div>
  ),
});

interface BilingualText { en: string; bn: string; }
interface BilingualFeature { title: BilingualText; desc: BilingualText; }
interface Resource { type: "pdf" | "video" | "link" | "image"; title: string; url?: string; file?: FileList; }

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

export default function CreateCourseModal({ isOpen, onClose, mutate, isPending }: CreateCourseModalProps) {
  const enEditorRef = useRef<any>(null);
  const bnEditorRef = useRef<any>(null);
  const [enEditorReady, setEnEditorReady] = useState(false);
  const [bnEditorReady, setBnEditorReady] = useState(false);
  const [editorSessionKey, setEditorSessionKey] = useState(0);

  const handleEditorReady = useCallback((lang: "en" | "bn") => {
    if (lang === "en") setEnEditorReady(true);
    if (lang === "bn") setBnEditorReady(true);
  }, []);

  const handleEditorDestroy = useCallback((lang: "en" | "bn") => {
    if (lang === "en") setEnEditorReady(false);
    if (lang === "bn") setBnEditorReady(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setEnEditorReady(false);
      setBnEditorReady(false);
      setEditorSessionKey((key) => key + 1);
    }
  }, [isOpen]);

  const editorsLoaded = enEditorReady && bnEditorReady;
  const areEditorsCallable = () => typeof enEditorRef.current?.save === "function" && typeof bnEditorRef.current?.save === "function";

  const { register, handleSubmit, control, reset } = useForm<CourseFormData>({
    defaultValues: {
      title: { en: "", bn: "" }, heroSubtitle: { en: "", bn: "" }, price: 0, originalPrice: 0,
      instructorName: "", category: "", level: "", duration: "",
      quickInfo: [{ en: "", bn: "" }],
      features: [{ title: { en: "", bn: "" }, desc: { en: "", bn: "" } }],
      levels: [{ title: { en: "", bn: "" }, target: { en: "", bn: "" }, topics: "" }],
      faqs: [{ question: { en: "", bn: "" }, answer: { en: "", bn: "" } }],
      resources: [],
    },
  });

  const { fields: quickInfoFields, append: appendQuickInfo, remove: removeQuickInfo } = useFieldArray({ control, name: "quickInfo" });
  const { fields: resourceFields, append: appendResource, remove: removeResource } = useFieldArray({ control, name: "resources" });
  const watchedResources = useWatch({ control, name: "resources" });

  const onSubmit = async (data: CourseFormData) => {
    if (!areEditorsCallable()) { alert("Editors are still loading."); return; }
    try {
      const enEditorData = await enEditorRef.current.save();
      const bnEditorData = await bnEditorRef.current.save();
      const formData = new FormData();

      formData.append("instructorName", data.instructorName);
      formData.append("category", data.category);
      formData.append("level", data.level);
      formData.append("duration", data.duration);
      formData.append("price", data.price.toString());
      if (data.originalPrice) formData.append("originalPrice", data.originalPrice.toString());

      formData.append("title", JSON.stringify(data.title));
      formData.append("heroSubtitle", JSON.stringify(data.heroSubtitle));
      formData.append("quickInfo", JSON.stringify(data.quickInfo));
      formData.append("features", JSON.stringify(data.features));
      formData.append("levels", JSON.stringify(data.levels));
      formData.append("faqs", JSON.stringify(data.faqs));
      formData.append("overview", JSON.stringify({ en: enEditorData, bn: bnEditorData }));

      if (data.thumbnail && data.thumbnail[0]) formData.append("thumbnail", data.thumbnail[0]);
      if (data.video && data.video[0]) formData.append("video", data.video[0]);
      formData.append("resources", JSON.stringify(data.resources));

      mutate(formData);
    } catch (err) { console.error(err); alert("Error saving form"); }
  };

  if (!isOpen) return null;

  const inputClass = "w-full border border-gray-300 p-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition-shadow bg-white";
  const fileClass = "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30 cursor-pointer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-white/10">
        {/* Modal Header - Primary Color */}
        <div className="p-6 border-b flex justify-between items-center bg-[#F3056D]">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7" />
            Create Bilingual Course
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 transition text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* SECTION 1 */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-lg font-bold text-[#214187] border-l-4 border-[#F3056D] pl-4">1. Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Title (EN)</label>
                  <input {...register("title.en", { required: true })} className={inputClass} placeholder="Course Title (EN)" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">শিরোনাম (BN)</label>
                  <input {...register("title.bn", { required: true })} className={inputClass} placeholder="কোর্সের নাম (বাংলা)" lang="bn" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Instructor</label>
                  <input {...register("instructorName")} className={inputClass} placeholder="Teacher Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Price (BDT)</label>
                  <input type="number" {...register("price", { required: true, valueAsNumber: true })} className={inputClass} placeholder="15000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Original Price</label>
                  <input type="number" {...register("originalPrice", { valueAsNumber: true })} className={inputClass} placeholder="20000" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Thumbnail Image</label>
                  <input type="file" {...register("thumbnail")} className={fileClass} accept="image/*" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Promo Video</label>
                  <input type="file" {...register("video")} className={fileClass} accept="video/*" />
                </div>
              </div>
            </section>

            {/* SECTION 2 */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-lg font-bold text-[#214187]">2. Course Details (EditorJS)</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-[#214187]"><Globe className="w-4 h-4" /> English Content</label>
                  <CourseEditor key={`en-${editorSessionKey}`} editorRef={enEditorRef} placeholder="Type in English..." onEditorReady={() => handleEditorReady("en")} onEditorDestroy={() => handleEditorDestroy("en")} />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-[#214187]"><Globe className="w-4 h-4" /> বাংলা কন্টেন্ট</label>
                  <CourseEditor key={`bn-${editorSessionKey}`} editorRef={bnEditorRef} placeholder="বাংলায় লিখুন..." onEditorReady={() => handleEditorReady("bn")} onEditorDestroy={() => handleEditorDestroy("bn")} />
                </div>
              </div>
              {!editorsLoaded && <p className="text-sm text-gray-500 mt-2 italic">Course editor is still initializing...</p>}
            </section>

            {/* SECTION 3 */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#F3056D] pl-4">3. Quick Info</h3>
                <button type="button" onClick={() => appendQuickInfo({ en: "", bn: "" })} className="text-sm font-semibold bg-[#F3056D]/10 text-[#F3056D] px-4 py-1.5 rounded-lg hover:bg-[#F3056D]/20 transition flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-3">
                {quickInfoFields.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl">
                    <input {...register(`quickInfo.${index}.en`)} className={inputClass} placeholder="English Info" />
                    <div className="flex gap-2">
                      <input {...register(`quickInfo.${index}.bn`)} className={`${inputClass} flex-1`} placeholder="বাংলা তথ্য" lang="bn" />
                      {quickInfoFields.length > 1 && (
                        <button type="button" onClick={() => removeQuickInfo(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition"><X className="w-5 h-5" /></button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

             {/* SECTION 4 */}
             <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#F3056D] pl-4">4. Resources</h3>
                <button type="button" onClick={() => appendResource({ type: "pdf", title: "" })} className="text-sm font-semibold bg-[#214187]/10 text-[#214187] px-4 py-1.5 rounded-lg hover:bg-[#214187]/20 transition flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Resource
                </button>
              </div>
              {resourceFields.map((field, index) => {
                const currentType = watchedResources?.[index]?.type || "pdf";
                return (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">Type</label>
                      <select {...register(`resources.${index}.type`)} className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-sm focus:ring-2 focus:ring-[#F3056D]/20 outline-none">
                        <option value="pdf">PDF</option>
                        <option value="video">Video Link</option>
                        <option value="link">Link</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">Title</label>
                      <input {...register(`resources.${index}.title`)} className={`${inputClass} !py-2.5`} placeholder="Title" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">File / URL</label>
                      {currentType === "video" || currentType === "link" ? (
                        <input {...register(`resources.${index}.url`)} className={`${inputClass} !py-2.5`} placeholder="Paste URL" />
                      ) : (
                        <input type="file" {...register(`resources.${index}.file`)} className="w-full text-xs text-gray-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </section>

          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
          <button type="button" onClick={onClose} disabled={isPending} className="px-8 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-white font-bold transition">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit(onSubmit)} disabled={isPending || !editorsLoaded} className={`px-10 py-3 rounded-xl font-bold flex items-center gap-2 text-white transition-all shadow-lg ${
            isPending || !editorsLoaded ? "bg-gray-400 cursor-not-allowed shadow-none" : "bg-[#214187] hover:bg-[#1a336b] shadow-[#214187]/30 hover:scale-[1.02] active:scale-95"
          }`}>
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : !editorsLoaded ? <span>Initializing...</span> : <Upload className="w-5 h-5" />}
            {isPending ? "Creating..." : editorsLoaded ? "Create Course" : "Wait..."}
          </button>
        </div>
      </div>
    </div>
  );
}