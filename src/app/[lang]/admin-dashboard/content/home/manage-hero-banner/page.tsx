"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  Loader2,
  Globe,
  Sparkles,
  RotateCcw,
  UploadCloud,
  X,
} from "lucide-react";
import { upsertHeroFormData, fetchHeroData } from "@/app/services/heroService";

// --- TYPES ---
interface LangData {
  title: string;
  subtitle: string;
  ctaButton: string;
  secondaryLink: string;
  cta2: string;
  cta2Btn: string;
  kingImage: string;
  kingImageClass: string;
  videoId: string; // NEW: YouTube Video ID
}

const initialLangState: LangData = {
  title: "",
  subtitle: "",
  ctaButton: "",
  secondaryLink: "",
  cta2: "",
  cta2Btn: "",
  kingImage: "",
  kingImageClass: "",
  videoId: "", // NEW
};

export default function ManageHero() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Form Text Data
  const [formData, setFormData] = useState<{ en: LangData; bn: LangData }>({
    en: { ...initialLangState },
    bn: { ...initialLangState },
  });

  // File & Preview States
  const [enFile, setEnFile] = useState<File | null>(null);
  const [bnFile, setBnFile] = useState<File | null>(null);
  const [enPreview, setEnPreview] = useState<string | null>(null);
  const [bnPreview, setBnPreview] = useState<string | null>(null);

  // Reusable Classes (Matching CoursesClient pattern)
  const inputClass =
    "w-full border border-gray-300 p-3 rounded-xl text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition-shadow bg-white";

  const textareaClass =
    "w-full border border-gray-300 p-3 rounded-xl text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition-shadow bg-white resize-none";

  const fileClass =
    "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F3056D]/10 file:text-[#F3056D] hover:file:bg-[#F3056D]/20 cursor-pointer";

  // Fetch Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [enData, bnData] = await Promise.all([
          fetchHeroData("en"),
          fetchHeroData("bn"),
        ]);
        const en = enData
          ? { ...initialLangState, ...enData }
          : { ...initialLangState };
        const bn = bnData
          ? { ...initialLangState, ...bnData }
          : { ...initialLangState };

        setFormData({ en, bn });

        // Set existing images as previews
        if (en.kingImage) setEnPreview(en.kingImage);
        if (bn.kingImage) setBnPreview(bn.kingImage);
      } catch (err) {
        console.error("Failed to load hero data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    lang: "en" | "bn",
  ) => {
    setFormData((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [e.target.name]: e.target.value },
    }));
    if (successMsg) setSuccessMsg("");
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    lang: "en" | "bn",
  ) => {
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

  const handleReset = () => {
    setFormData({ en: { ...initialLangState }, bn: { ...initialLangState } });
    setEnFile(null);
    setBnFile(null);
    setEnPreview(null);
    setBnPreview(null);
    setSuccessMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      // Construct EN FormData
      const enFormData = new FormData();
      enFormData.append("lang", "en");
      enFormData.append("title", formData.en.title);
      enFormData.append("subtitle", formData.en.subtitle);
      enFormData.append("ctaButton", formData.en.ctaButton);
      enFormData.append("secondaryLink", formData.en.secondaryLink);
      enFormData.append("cta2", formData.en.cta2);
      enFormData.append("cta2Btn", formData.en.cta2Btn);
      enFormData.append("kingImageClass", formData.en.kingImageClass);
      enFormData.append("videoId", formData.en.videoId); // Append Video ID
      if (enFile) {
        enFormData.append("kingImage", enFile);
      } else if (formData.en.kingImage) {
        enFormData.append("kingImage", formData.en.kingImage); 
      }

      // Construct BN FormData
      const bnFormData = new FormData();
      bnFormData.append("lang", "bn");
      bnFormData.append("title", formData.bn.title);
      bnFormData.append("subtitle", formData.bn.subtitle);
      bnFormData.append("ctaButton", formData.bn.ctaButton);
      bnFormData.append("secondaryLink", formData.bn.secondaryLink);
      bnFormData.append("cta2", formData.bn.cta2);
      bnFormData.append("cta2Btn", formData.bn.cta2Btn);
      bnFormData.append("kingImageClass", formData.bn.kingImageClass);
      bnFormData.append("videoId", formData.bn.videoId); // Append Video ID
      if (bnFile) {
        bnFormData.append("kingImage", bnFile);
      } else if (formData.bn.kingImage) {
        bnFormData.append("kingImage", formData.bn.kingImage);
      }

      const [resEn, resBn] = await Promise.all([
        upsertHeroFormData(enFormData),
        upsertHeroFormData(bnFormData),
      ]);

      if (resEn.success && resBn.success) {
        setSuccessMsg("Hero section updated successfully for both languages!");
      } else {
        alert("Failed to save one or both languages.");
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
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Hero Banner Settings
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#FFD700] rounded-full shadow-sm shadow-[#FFD700]/50" />
              Update main homepage hero section content
            </p>
          </div>
        </div>

        {/* FORM SECTION */}
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
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#F3056D] pl-4">
                  1. Main Headlines
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* ENGLISH */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-[#214187]" />
                      <span className="text-sm font-bold text-[#214187] uppercase tracking-wider">
                        English
                      </span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Main Title <span className="text-[#F3056D]">*</span>
                      </label>
                      <input
                        name="title"
                        value={formData.en.title}
                        onChange={(e) => handleChange(e, "en")}
                        required
                        maxLength={100}
                        className={inputClass}
                        placeholder="Max 100 chars. Format: 'Intro Text Main Text Champ'"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Subtitle / Description{" "}
                        <span className="text-[#F3056D]">*</span>
                      </label>
                      <textarea
                        name="subtitle"
                        value={formData.en.subtitle}
                        onChange={(e) => handleChange(e, "en")}
                        required
                        rows={5}
                        maxLength={500}
                        className={textareaClass}
                        placeholder="Max 500 chars. Note: 'Spoken English' & 'Chalak Champs' auto-style."
                      />
                    </div>
                  </div>

                  {/* BANGLA */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-[#F3056D]" />
                      <span className="text-sm font-bold text-[#F3056D] uppercase tracking-wider">
                        বাংলা
                      </span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        প্রধান শিরোনাম <span className="text-[#F3056D]">*</span>
                      </label>
                      <input
                        name="title"
                        value={formData.bn.title}
                        onChange={(e) => handleChange(e, "bn")}
                        required
                        maxLength={100}
                        className={inputClass}
                        placeholder="সর্বোচ্চ ১০০ অক্ষর।"
                        lang="bn"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        সাবটাইটেল / বিবরণ{" "}
                        <span className="text-[#F3056D]">*</span>
                      </label>
                      <textarea
                        name="subtitle"
                        value={formData.bn.subtitle}
                        onChange={(e) => handleChange(e, "bn")}
                        required
                        rows={5}
                        maxLength={500}
                        className={textareaClass}
                        placeholder="সর্বোচ্চ ৫০০ অক্ষর।"
                        lang="bn"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 2: CALL TO ACTION */}
              <section className="bg-[#F9FAFB] p-6 rounded-2xl border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold text-[#214187]">
                  2. Call to Action Buttons & Links
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* ENGLISH CTA */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        CTA Button Text{" "}
                        <span className="text-[#F3056D]">*</span>
                      </label>
                      <input
                        name="ctaButton"
                        value={formData.en.ctaButton}
                        onChange={(e) => handleChange(e, "en")}
                        required
                        maxLength={50}
                        className={inputClass}
                        placeholder="Max 50 chars."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                          Below CTA Text{" "}
                          <span className="text-[#F3056D]">*</span>
                        </label>
                        <input
                          name="cta2"
                          value={formData.en.cta2}
                          onChange={(e) => handleChange(e, "en")}
                          required
                          maxLength={100}
                          className={inputClass}
                          placeholder="Max 100 chars."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                          CTA Link Text{" "}
                          <span className="text-[#F3056D]">*</span>
                        </label>
                        <input
                          name="cta2Btn"
                          value={formData.en.cta2Btn}
                          onChange={(e) => handleChange(e, "en")}
                          required
                          maxLength={30}
                          className={inputClass}
                          placeholder="Max 30 chars."
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Secondary Link
                      </label>
                      <input
                        name="secondaryLink"
                        value={formData.en.secondaryLink}
                        onChange={(e) => handleChange(e, "en")}
                        maxLength={100}
                        className={inputClass}
                        placeholder="Max 100 chars."
                      />
                    </div>
                  </div>

                  {/* BANGLA CTA */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        সিটিএ বাটন টেক্সট{" "}
                        <span className="text-[#F3056D]">*</span>
                      </label>
                      <input
                        name="ctaButton"
                        value={formData.bn.ctaButton}
                        onChange={(e) => handleChange(e, "bn")}
                        required
                        maxLength={50}
                        className={inputClass}
                        placeholder="সর্বোচ্চ ৫০ অক্ষর।"
                        lang="bn"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                          সিটিএর নিচের টেক্সট{" "}
                          <span className="text-[#F3056D]">*</span>
                        </label>
                        <input
                          name="cta2"
                          value={formData.bn.cta2}
                          onChange={(e) => handleChange(e, "bn")}
                          required
                          maxLength={100}
                          className={inputClass}
                          placeholder="সর্বোচ্চ ১০০ অক্ষর।"
                          lang="bn"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                          লিংক টেক্সট <span className="text-[#F3056D]">*</span>
                        </label>
                        <input
                          name="cta2Btn"
                          value={formData.bn.cta2Btn}
                          onChange={(e) => handleChange(e, "bn")}
                          required
                          maxLength={30}
                          className={inputClass}
                          placeholder="সর্বোচ্চ ৩০ অক্ষর।"
                          lang="bn"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        সেকেন্ডারি লিংক
                      </label>
                      <input
                        name="secondaryLink"
                        value={formData.bn.secondaryLink}
                        onChange={(e) => handleChange(e, "bn")}
                        maxLength={100}
                        className={inputClass}
                        placeholder="সর্বোচ্চ ১০০ অক্ষর।"
                        lang="bn"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: MEDIA & ASSETS (UPLOAD SYSTEM) */}
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#F3056D] pl-4">
                  3. Media & Assets
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* ENGLISH UPLOAD */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      King Crown Image (EN)
                    </label>
                    <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors relative">
                      {enPreview ? (
                        <>
                          <Image
                            src={enPreview}
                            alt="EN Preview"
                            fill
                            className="object-contain p-2"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage("en")}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition shadow"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center text-gray-400 p-4">
                          <UploadCloud className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm font-medium">
                            No image selected
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "en")}
                      className={fileClass}
                    />
                    <div className="space-y-2 mt-4">
                      <label className="text-sm font-bold text-gray-700">
                        King Image Position Class (EN)
                      </label>
                      <input
                        name="kingImageClass"
                        value={formData.en.kingImageClass}
                        onChange={(e) => handleChange(e, "en")}
                        className={inputClass}
                        placeholder="e.g. absolute md:-top-8 z-0 right-[62%] -bottom-7"
                      />
                    </div>
                    <div className="space-y-2 mt-4">
                      <label className="text-sm font-bold text-gray-700">
                        YouTube Video ID (EN)
                      </label>
                      <input
                        name="videoId"
                        value={formData.en.videoId}
                        onChange={(e) => handleChange(e, "en")}
                        className={inputClass}
                        placeholder="e.g. pPcNHH20e5U"
                      />
                    </div>
                  </div>

                  {/* BANGLA UPLOAD */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      কিং ক্রাউন ইমেজ (BN)
                    </label>
                    <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors relative">
                      {bnPreview ? (
                        <>
                          <Image
                            src={bnPreview}
                            alt="BN Preview"
                            fill
                            className="object-contain p-2"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage("bn")}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition shadow"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center text-gray-400 p-4">
                          <UploadCloud className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm font-medium">
                            কোনো ইমেজ সিলেক্ট করা হয়নি
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "bn")}
                      className={fileClass}
                    />
                    <div className="space-y-2 mt-4">
                      <label className="text-sm font-bold text-gray-700">
                        King Image Position Class (BN)
                      </label>
                      <input
                        name="kingImageClass"
                        value={formData.bn.kingImageClass}
                        onChange={(e) => handleChange(e, "bn")}
                        className={inputClass}
                        placeholder="e.g. absolute md:-top-8 z-0 right-[62%] -bottom-7"
                      />
                    </div>
                    <div className="space-y-2 mt-4">
                      <label className="text-sm font-bold text-gray-700">
                        YouTube Video ID (BN)
                      </label>
                      <input
                        name="videoId"
                        value={formData.bn.videoId}
                        onChange={(e) => handleChange(e, "bn")}
                        className={inputClass}
                        placeholder="যেমন: pPcNHH20e5U"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <strong>Note:</strong> Recommended 1:1 aspect ratio (Square),
                  min 100x100px. Leaving the image blank will use the default crown
                  image. Video ID should be the string after "v=" in a YouTube URL.
                </p>
              </section>

              {/* SUBMIT SECTION */}
              <div className="pt-8 border-t border-gray-200 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={saving}
                  className="px-8 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold transition disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Clear Form
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-10 py-3 rounded-xl font-bold flex items-center gap-2 text-white transition-all shadow-lg ${saving ? "bg-gray-400 cursor-not-allowed shadow-none" : "bg-[#F3056D] hover:bg-[#d9045c] shadow-[#F3056D]/30 hover:scale-[1.02] active:scale-95"}`}
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
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