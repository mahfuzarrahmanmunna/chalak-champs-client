"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Save,
  Loader2,
  Globe,
  Sparkles,
  RotateCcw,
  UploadCloud,
  X,
  PlayCircle,
  ImagePlus,
} from "lucide-react";
import { upsertHeroFormData, fetchHeroData } from "@/app/services/heroService";
// ⚠️ IMPORT YOUR QUILL EDITOR COMPONENT HERE
// Adjust the import path based on where you saved QuillEditor.tsx
import QuillEditor from "../../../courses/create/QuillEditor"; 

// --- TYPES ---
interface LangData {
  title: string;
  subtitle: string; // This will now hold HTML from Quill
  ctaButton: string;
  secondaryLink: string;
  cta2: string;
  cta2Btn: string;
  kingImage: string;
  kingImageClass: string;
  videoId: string;
  videoThumbnail: string; // Cloudflare R2 public URL
}

type Lang = "en" | "bn";

// Accepted thumbnail formats (must match the backend whitelist)
const THUMBNAIL_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";
const THUMBNAIL_MIME_TYPES = THUMBNAIL_ACCEPT.split(",");
const THUMBNAIL_MAX_BYTES = 5 * 1024 * 1024; // 5MB

const formatBytes = (bytes: number) =>
  bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const initialLangState: LangData = {
  title: "",
  subtitle: "",
  ctaButton: "",
  secondaryLink: "",
  cta2: "",
  cta2Btn: "",
  kingImage: "",
  kingImageClass: "",
  videoId: "",
  videoThumbnail: "",
};

export default function ManageHero() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState<{ en: LangData; bn: LangData }>({
    en: { ...initialLangState },
    bn: { ...initialLangState },
  });

  const [enFile, setEnFile] = useState<File | null>(null);
  const [bnFile, setBnFile] = useState<File | null>(null);
  const [enPreview, setEnPreview] = useState<string | null>(null);
  const [bnPreview, setBnPreview] = useState<string | null>(null);

  // Video thumbnail (uploaded to Cloudflare R2 on save)
  const [thumbFiles, setThumbFiles] = useState<Record<Lang, File | null>>({ en: null, bn: null });
  const [thumbPreviews, setThumbPreviews] = useState<Record<Lang, string | null>>({ en: null, bn: null });
  const [thumbErrors, setThumbErrors] = useState<Record<Lang, string>>({ en: "", bn: "" });
  const [dragOver, setDragOver] = useState<Lang | null>(null);
  const thumbInputRefs = useRef<Record<Lang, HTMLInputElement | null>>({ en: null, bn: null });

  const inputClass = "w-full border border-gray-300 p-3 rounded-xl text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition-shadow bg-white";
  const textareaClass = "w-full border border-gray-300 p-3 rounded-xl text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition-shadow bg-white resize-none";
  const fileClass = "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F3056D]/10 file:text-[#F3056D] hover:file:bg-[#F3056D]/20 cursor-pointer";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [enData, bnData] = await Promise.all([
          fetchHeroData("en"),
          fetchHeroData("bn"),
        ]);
        const en = enData ? { ...initialLangState, ...enData } : { ...initialLangState };
        const bn = bnData ? { ...initialLangState, ...bnData } : { ...initialLangState };

        setFormData({ en, bn });

        if (en.kingImage) setEnPreview(en.kingImage);
        if (bn.kingImage) setBnPreview(bn.kingImage);
        setThumbPreviews({ en: en.videoThumbnail || null, bn: bn.videoThumbnail || null });
      } catch (err) {
        console.error("Failed to load hero data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Standard input handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, lang: "en" | "bn") => {
    setFormData((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [e.target.name]: e.target.value },
    }));
    if (successMsg) setSuccessMsg("");
  };

  // ✅ NEW: Quill handler specifically for the subtitle HTML content
  const handleQuillChange = (value: string, lang: "en" | "bn") => {
    setFormData((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], subtitle: value },
    }));
    if (successMsg) setSuccessMsg("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, lang: "en" | "bn") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (lang === "en") {
      setEnFile(file);
      setEnPreview(URL.createObjectURL(file));
    } else {
      setBnFile(file);
      setBnPreview(URL.createObjectURL(file));
    }
    if (successMsg) setSuccessMsg("");
  };

  const removeImage = (lang: "en" | "bn") => {
    if (lang === "en") {
      setEnFile(null);
      setEnPreview(null);
      setFormData((prev) => ({ ...prev, en: { ...prev.en, kingImage: "" } }));
    } else {
      setBnFile(null);
      setBnPreview(null);
      setFormData((prev) => ({ ...prev, bn: { ...prev.bn, kingImage: "" } }));
    }
  };

  // Release blob URLs created for local previews (on replace and on unmount)
  const latestThumbPreviews = useRef(thumbPreviews);
  useEffect(() => {
    latestThumbPreviews.current = thumbPreviews;
  }, [thumbPreviews]);
  const revokeBlob = (url?: string | null) => {
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
  };
  useEffect(() => () => Object.values(latestThumbPreviews.current).forEach(revokeBlob), []);

  const selectThumbnail = (file: File | undefined, lang: Lang) => {
    if (!file) return;
    if (!THUMBNAIL_MIME_TYPES.includes(file.type)) {
      setThumbErrors((p) => ({ ...p, [lang]: "Unsupported format. Use JPG, PNG, WEBP, GIF or AVIF." }));
      return;
    }
    if (file.size > THUMBNAIL_MAX_BYTES) {
      setThumbErrors((p) => ({ ...p, [lang]: `File is ${formatBytes(file.size)}. Max allowed is ${formatBytes(THUMBNAIL_MAX_BYTES)}.` }));
      return;
    }
    setThumbErrors((p) => ({ ...p, [lang]: "" }));
    setThumbFiles((p) => ({ ...p, [lang]: file }));
    revokeBlob(thumbPreviews[lang]);
    setThumbPreviews((p) => ({ ...p, [lang]: URL.createObjectURL(file) }));
    if (successMsg) setSuccessMsg("");
  };

  const removeThumbnail = (lang: Lang) => {
    setThumbFiles((p) => ({ ...p, [lang]: null }));
    revokeBlob(thumbPreviews[lang]);
    setThumbPreviews((p) => ({ ...p, [lang]: null }));
    setThumbErrors((p) => ({ ...p, [lang]: "" }));
    setFormData((prev) => ({ ...prev, [lang]: { ...prev[lang], videoThumbnail: "" } }));
    if (thumbInputRefs.current[lang]) thumbInputRefs.current[lang]!.value = "";
  };

  const handleReset = () => {
    setFormData({ en: { ...initialLangState }, bn: { ...initialLangState } });
    setEnFile(null);
    setBnFile(null);
    setEnPreview(null);
    setBnPreview(null);
    setThumbFiles({ en: null, bn: null });
    setThumbPreviews({ en: null, bn: null });
    setThumbErrors({ en: "", bn: "" });
    setSuccessMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      const enFormData = new FormData();
      enFormData.append("lang", "en");
      enFormData.append("title", formData.en.title);
      enFormData.append("subtitle", formData.en.subtitle); // Contains Quill HTML
      enFormData.append("ctaButton", formData.en.ctaButton);
      enFormData.append("secondaryLink", formData.en.secondaryLink);
      enFormData.append("cta2", formData.en.cta2);
      enFormData.append("cta2Btn", formData.en.cta2Btn);
      enFormData.append("kingImageClass", formData.en.kingImageClass);
      enFormData.append("videoId", formData.en.videoId);
      if (enFile) enFormData.append("kingImage", enFile);
      else if (formData.en.kingImage) enFormData.append("kingImage", formData.en.kingImage);
      if (thumbFiles.en) enFormData.append("videoThumbnail", thumbFiles.en);
      else enFormData.append("videoThumbnail", formData.en.videoThumbnail || "");

      const bnFormData = new FormData();
      bnFormData.append("lang", "bn");
      bnFormData.append("title", formData.bn.title);
      bnFormData.append("subtitle", formData.bn.subtitle); // Contains Quill HTML
      bnFormData.append("ctaButton", formData.bn.ctaButton);
      bnFormData.append("secondaryLink", formData.bn.secondaryLink);
      bnFormData.append("cta2", formData.bn.cta2);
      bnFormData.append("cta2Btn", formData.bn.cta2Btn);
      bnFormData.append("kingImageClass", formData.bn.kingImageClass);
      bnFormData.append("videoId", formData.bn.videoId);
      if (bnFile) bnFormData.append("kingImage", bnFile);
      else if (formData.bn.kingImage) bnFormData.append("kingImage", formData.bn.kingImage);
      if (thumbFiles.bn) bnFormData.append("videoThumbnail", thumbFiles.bn);
      else bnFormData.append("videoThumbnail", formData.bn.videoThumbnail || "");

      const [resEn, resBn] = await Promise.all([
        upsertHeroFormData(enFormData),
        upsertHeroFormData(bnFormData),
      ]);

      if (resEn.success && resBn.success) {
        // Sync with saved R2 URLs so a re-save doesn't re-upload
        const savedEn = resEn.data?.videoThumbnail || "";
        const savedBn = resBn.data?.videoThumbnail || "";
        setFormData((prev) => ({
          en: { ...prev.en, videoThumbnail: savedEn },
          bn: { ...prev.bn, videoThumbnail: savedBn },
        }));
        setThumbFiles({ en: null, bn: null });
        setThumbPreviews({ en: savedEn || null, bn: savedBn || null });
        setSuccessMsg("Hero section updated successfully for both languages!");
      } else {
        alert(resEn.message || resBn.message || "Failed to save one or both languages.");
      }
    } catch (error) {
      alert("Server error while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center items-center text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#F3056D] mb-4" />
        <p className="text-lg font-semibold">Loading Hero Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hero Banner Settings</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#FFD700] rounded-full shadow-sm shadow-[#FFD700]/50" />
              Update main homepage hero section content
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b bg-gray-50/80">
            <h2 className="text-xl font-bold text-[#214187] flex items-center gap-3">
              <div className="p-2 bg-[#F3056D] rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Edit Hero Content
            </h2>
          </div>

          <div className="p-8">
            {successMsg && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* SECTION 1: MAIN HEADLINES */}
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#F3056D] pl-4">1. Main Headlines</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* ENGLISH */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-[#214187]" />
                      <span className="text-sm font-bold text-[#214187] uppercase tracking-wider">English</span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Main Title <span className="text-[#F3056D]">*</span></label>
                      <input name="title" value={formData.en.title} onChange={(e) => handleChange(e, "en")} required maxLength={100} className={inputClass} placeholder="Format: 'We Believe Every Child Is A Champ'" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Subtitle / Description (Rich Text) <span className="text-[#F3056D]">*</span></label>
                      {/* ✅ REPLACED TEXTAREA WITH QUILL EDITOR */}
                      <QuillEditor 
                        value={formData.en.subtitle} 
                        onChange={(val) => handleQuillChange(val, "en")} 
                        placeholder="Write description, add images, and bold text directly here..." 
                      />
                    </div>
                  </div>

                  {/* BANGLA */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-[#F3056D]" />
                      <span className="text-sm font-bold text-[#F3056D] uppercase tracking-wider">বাংলা</span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">প্রধান শিরোনাম <span className="text-[#F3056D]">*</span></label>
                      <input name="title" value={formData.bn.title} onChange={(e) => handleChange(e, "bn")} required maxLength={100} className={inputClass} placeholder="ফরম্যাট: 'আমরা বিশ্বাস করি প্রতিটি শিশু একজন চ্যাম্প'" lang="bn" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">সাবটাইটেল / বিবরণ (Rich Text) <span className="text-[#F3056D]">*</span></label>
                      {/* ✅ REPLACED TEXTAREA WITH QUILL EDITOR */}
                      <QuillEditor 
                        value={formData.bn.subtitle} 
                        onChange={(val) => handleQuillChange(val, "bn")} 
                        placeholder="এখানে বিবরণ লিখুন, ছবি যুক্ত করুন এবং টেক্সট বোল্ড করুন..." 
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 2: CALL TO ACTION */}
              <section className="bg-[#F9FAFB] p-6 rounded-2xl border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold text-[#214187]">2. Call to Action Buttons & Links</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* ENGLISH CTA */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">CTA Button Text <span className="text-[#F3056D]">*</span></label>
                      <input name="ctaButton" value={formData.en.ctaButton} onChange={(e) => handleChange(e, "en")} required maxLength={50} className={inputClass} placeholder="e.g. Book Free Trial" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Below CTA Text <span className="text-[#F3056D]">*</span></label>
                        <input name="cta2" value={formData.en.cta2} onChange={(e) => handleChange(e, "en")} required maxLength={100} className={inputClass} placeholder="e.g. Explore our" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">CTA Link Text <span className="text-[#F3056D]">*</span></label>
                        <input name="cta2Btn" value={formData.en.cta2Btn} onChange={(e) => handleChange(e, "en")} required maxLength={30} className={inputClass} placeholder="e.g. Courses" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Secondary Link</label>
                      <input name="secondaryLink" value={formData.en.secondaryLink} onChange={(e) => handleChange(e, "en")} maxLength={100} className={inputClass} placeholder="/courses" />
                    </div>
                  </div>

                  {/* BANGLA CTA */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">সিটিএ বাটন টেক্সট <span className="text-[#F3056D]">*</span></label>
                      <input name="ctaButton" value={formData.bn.ctaButton} onChange={(e) => handleChange(e, "bn")} required maxLength={50} className={inputClass} placeholder="যেমন: ফ্রি ট্রায়াল বুক করুন" lang="bn" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">সিটিএর নিচের টেক্সট <span className="text-[#F3056D]">*</span></label>
                        <input name="cta2" value={formData.bn.cta2} onChange={(e) => handleChange(e, "bn")} required maxLength={100} className={inputClass} placeholder="যেমন: আমাদের" lang="bn" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">লিংক টেক্সট <span className="text-[#F3056D]">*</span></label>
                        <input name="cta2Btn" value={formData.bn.cta2Btn} onChange={(e) => handleChange(e, "bn")} required maxLength={30} className={inputClass} placeholder="যেমন: কোর্সসমূহ" lang="bn" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">সেকেন্ডারি লিংক</label>
                      <input name="secondaryLink" value={formData.bn.secondaryLink} onChange={(e) => handleChange(e, "bn")} maxLength={100} className={inputClass} placeholder="/bn/courses" lang="bn" />
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: MEDIA & ASSETS */}
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#F3056D] pl-4">3. Media & Assets</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* ENGLISH UPLOAD */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">King Crown Image (EN)</label>
                    <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors relative">
                      {enPreview ? (
                        <>
                          <Image src={enPreview} alt="EN Preview" fill className="object-contain p-2" />
                          <button type="button" onClick={() => removeImage("en")} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition shadow">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center text-gray-400 p-4">
                          <UploadCloud className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm font-medium">No image selected</p>
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "en")} className={fileClass} />
                    
                    <div className="space-y-2 mt-4">
                      <label className="text-sm font-bold text-gray-700">King Image Position Class (EN)</label>
                      <input name="kingImageClass" value={formData.en.kingImageClass} onChange={(e) => handleChange(e, "en")} className={inputClass} placeholder="absolute md:-top-8 z-0 right-[62%] -bottom-7 md:right-[calc(50%-355px)]" />
                    </div>

                    <div className="space-y-2 mt-4">
                      <label className="text-sm font-bold text-gray-700">YouTube Video ID (EN)</label>
                      <input name="videoId" value={formData.en.videoId} onChange={(e) => handleChange(e, "en")} className={inputClass} placeholder="e.g. pPcNHH20e5U" />
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-700">Video Thumbnail (EN)</label>
                        <span className="text-[11px] text-gray-400">16:9 · 1280×720 recommended</span>
                      </div>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => thumbInputRefs.current.en?.click()}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && thumbInputRefs.current.en?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragOver("en"); }}
                        onDragLeave={() => setDragOver(null)}
                        onDrop={(e) => { e.preventDefault(); setDragOver(null); selectThumbnail(e.dataTransfer.files?.[0], "en"); }}
                        className={`group relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#F3056D]/40 ${dragOver === "en" ? "border-[#F3056D] bg-[#F3056D]/5" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}
                      >
                        {thumbPreviews.en ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={thumbPreviews.en} alt="Video thumbnail preview" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <PlayCircle className="w-12 h-12 text-white/90 drop-shadow" />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-[11px] text-white flex justify-between">
                              <span className="truncate">{thumbFiles.en ? thumbFiles.en.name : "Saved on Cloudflare"}</span>
                              <span className="opacity-0 group-hover:opacity-100 transition">Click to replace</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeThumbnail("en"); }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition shadow"
                              aria-label="Remove thumbnail"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-400 p-4">
                            <ImagePlus className="w-10 h-10 mb-2 text-gray-300" />
                            <p className="text-sm font-medium">Drag & drop or <span className="text-[#F3056D] font-semibold">browse</span></p>
                            <p className="text-[11px] mt-1">JPG, PNG, WEBP, GIF, AVIF · max 5MB</p>
                            <p className="text-[11px] mt-1 text-gray-400/80">Empty = YouTube default thumbnail</p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={(el) => { thumbInputRefs.current.en = el; }}
                        type="file"
                        accept={THUMBNAIL_ACCEPT}
                        onChange={(e) => selectThumbnail(e.target.files?.[0], "en")}
                        className="hidden"
                      />
                      {thumbErrors.en && <p className="text-xs text-red-600 font-medium">{thumbErrors.en}</p>}
                    </div>
                  </div>

                  {/* BANGLA UPLOAD */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">কিং ক্রাউন ইমেজ (BN)</label>
                    <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors relative">
                      {bnPreview ? (
                        <>
                          <Image src={bnPreview} alt="BN Preview" fill className="object-contain p-2" />
                          <button type="button" onClick={() => removeImage("bn")} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition shadow">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center text-gray-400 p-4">
                          <UploadCloud className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm font-medium">কোনো ইমেজ সিলেক্ট করা হয়নি</p>
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "bn")} className={fileClass} />
                    
                    <div className="space-y-2 mt-4">
                      <label className="text-sm font-bold text-gray-700">King Image Position Class (BN)</label>
                      <input name="kingImageClass" value={formData.bn.kingImageClass} onChange={(e) => handleChange(e, "bn")} className={inputClass} placeholder="absolute md:-top-8 z-0 right-[62%] -bottom-7 md:right-[calc(50%-355px)]" />
                    </div>

                    <div className="space-y-2 mt-4">
                      <label className="text-sm font-bold text-gray-700">YouTube Video ID (BN)</label>
                      <input name="videoId" value={formData.bn.videoId} onChange={(e) => handleChange(e, "bn")} className={inputClass} placeholder="যেমন: pPcNHH20e5U" />
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-700">ভিডিও থাম্বনেইল (BN)</label>
                        <span className="text-[11px] text-gray-400">16:9 · 1280×720 recommended</span>
                      </div>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => thumbInputRefs.current.bn?.click()}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && thumbInputRefs.current.bn?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragOver("bn"); }}
                        onDragLeave={() => setDragOver(null)}
                        onDrop={(e) => { e.preventDefault(); setDragOver(null); selectThumbnail(e.dataTransfer.files?.[0], "bn"); }}
                        className={`group relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#F3056D]/40 ${dragOver === "bn" ? "border-[#F3056D] bg-[#F3056D]/5" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}
                      >
                        {thumbPreviews.bn ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={thumbPreviews.bn} alt="Video thumbnail preview" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <PlayCircle className="w-12 h-12 text-white/90 drop-shadow" />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-[11px] text-white flex justify-between">
                              <span className="truncate">{thumbFiles.bn ? thumbFiles.bn.name : "Saved on Cloudflare"}</span>
                              <span className="opacity-0 group-hover:opacity-100 transition">Click to replace</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeThumbnail("bn"); }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition shadow"
                              aria-label="Remove thumbnail"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-400 p-4">
                            <ImagePlus className="w-10 h-10 mb-2 text-gray-300" />
                            <p className="text-sm font-medium">ড্র্যাগ করে ছাড়ুন অথবা <span className="text-[#F3056D] font-semibold">ব্রাউজ করুন</span></p>
                            <p className="text-[11px] mt-1">JPG, PNG, WEBP, GIF, AVIF · max 5MB</p>
                            <p className="text-[11px] mt-1 text-gray-400/80">Empty = YouTube default thumbnail</p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={(el) => { thumbInputRefs.current.bn = el; }}
                        type="file"
                        accept={THUMBNAIL_ACCEPT}
                        onChange={(e) => selectThumbnail(e.target.files?.[0], "bn")}
                        className="hidden"
                      />
                      {thumbErrors.bn && <p className="text-xs text-red-600 font-medium">{thumbErrors.bn}</p>}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <strong>Note:</strong> If you leave Image, Class, Video ID or Thumbnail blank, the system will automatically fallback to the default English values to ensure the design doesn&apos;t break.
                </p>
              </section>

              {/* SUBMIT SECTION */}
              <div className="pt-8 border-t border-gray-200 flex justify-end gap-4">
                <button type="button" onClick={handleReset} disabled={saving} className="px-8 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold transition disabled:opacity-50">
                  <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Clear Form</span>
                </button>
                <button type="submit" disabled={saving} className={`px-10 py-3 rounded-xl font-bold flex items-center gap-2 text-white transition-all shadow-lg ${saving ? "bg-gray-400 cursor-not-allowed shadow-none" : "bg-[#F3056D] hover:bg-[#d9045c] shadow-[#F3056D]/30 hover:scale-[1.02] active:scale-95"}`}>
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {saving ? "Uploading..." : "Save Hero Section"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}