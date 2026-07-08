"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Globe, Languages } from "lucide-react";
import { upsertHeroData, fetchHeroData } from "@/app/services/heroService";

// Type for a single language's data
interface LangData {
  title: string;
  subtitle: string;
  ctaButton: string;
  secondaryLink: string;
  cta2: string;
  cta2Btn: string;
  kingImage: string;
}

export default function ManageHero() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState<{
    en: LangData;
    bn: LangData;
  }>({
    en: {
      title: "",
      subtitle: "",
      ctaButton: "",
      secondaryLink: "",
      cta2: "",
      cta2Btn: "",
      kingImage: "",
    },
    bn: {
      title: "",
      subtitle: "",
      ctaButton: "",
      secondaryLink: "",
      cta2: "",
      cta2Btn: "",
      kingImage: "",
    },
  });

  // Fetch both languages simultaneously
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setSuccessMsg("");
      try {
        const [enData, bnData] = await Promise.all([
          fetchHeroData("en"),
          fetchHeroData("bn"),
        ]);

        setFormData({
          en: enData
            ? {
                title: enData.title || "",
                subtitle: enData.subtitle || "",
                ctaButton: enData.ctaButton || "",
                secondaryLink: enData.secondaryLink || "",
                cta2: enData.cta2 || "",
                cta2Btn: enData.cta2Btn || "",
                kingImage: enData.kingImage || "",
              }
            : {
                title: "",
                subtitle: "",
                ctaButton: "",
                secondaryLink: "",
                cta2: "",
                cta2Btn: "",
                kingImage: "",
              },
          bn: bnData
            ? {
                title: bnData.title || "",
                subtitle: bnData.subtitle || "",
                ctaButton: bnData.ctaButton || "",
                secondaryLink: bnData.secondaryLink || "",
                cta2: bnData.cta2 || "",
                cta2Btn: bnData.cta2Btn || "",
                kingImage: bnData.kingImage || "",
              }
            : {
                title: "",
                subtitle: "",
                ctaButton: "",
                secondaryLink: "",
                cta2: "",
                cta2Btn: "",
                kingImage: "",
              },
        });
      } catch (error) {
        console.error("Failed to load hero data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle input changes for specific language
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

  // Save both languages
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      // Save English
      const resEn = await upsertHeroData({ ...formData.en, lang: "en" });
      // Save Bangla
      const resBn = await upsertHeroData({ ...formData.bn, lang: "bn" });

      if (resEn.success && resBn.success) {
        setSuccessMsg(
          "Both English and Bangla hero sections saved successfully!",
        );
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
      <div className="flex flex-col justify-center items-center h-64 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#214187]" />
        Loading Hero Data...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#F3056D]/10 rounded-xl">
            <Languages className="w-6 h-6 text-[#F3056D]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Manage Hero Banner
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Edit English and Bangla content side by side
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium text-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ================= ENGLISH COLUMN ================= */}
          <div className="border-2 border-[#214187]/20 rounded-2xl p-6 bg-[#214187]/[0.02] relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#214187] text-white text-xs font-bold px-4 py-1.5 rounded-b-lg shadow-md">
              ENGLISH
            </div>

            <div className="space-y-5 pt-4">
              <InputField
                name="title"
                value={formData.en.title}
                onChange={(e) => handleChange(e, "en")}
                label="Main Title"
                required
                maxLength={100}
                placeholder="Max 100 chars. Format: 'Intro Text Main Text Champ' (e.g., We Believe Every Child Is A Champ)"
                accentColor="#214187"
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#214187]/20 focus:border-[#214187] outline-none transition-all text-gray-800 placeholder:text-gray-500 resize-none"
                  placeholder="Max 500 characters. Note: 'Spoken English' and 'Chalak Champs' will auto-style on frontend."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  name="ctaButton"
                  value={formData.en.ctaButton}
                  onChange={(e) => handleChange(e, "en")}
                  label="CTA Button Text"
                  required
                  maxLength={50}
                  placeholder="Max 50 chars. (e.g., Try 1 Free Class!)"
                  accentColor="#214187"
                />
                <InputField
                  name="secondaryLink"
                  value={formData.en.secondaryLink}
                  onChange={(e) => handleChange(e, "en")}
                  label="Secondary Link Text"
                  maxLength={100}
                  placeholder="Max 100 chars. (Optional)"
                  accentColor="#214187"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  name="cta2"
                  value={formData.en.cta2}
                  onChange={(e) => handleChange(e, "en")}
                  label="Below CTA Text"
                  required
                  maxLength={100}
                  placeholder="Max 100 chars. (e.g., Want to explore?)"
                  accentColor="#214187"
                />
                <InputField
                  name="cta2Btn"
                  value={formData.en.cta2Btn}
                  onChange={(e) => handleChange(e, "en")}
                  label="Below CTA Link Text"
                  required
                  maxLength={30}
                  placeholder="Max 30 chars. (e.g., See them now)"
                  accentColor="#214187"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  King Crown Image URL
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Leave blank to use default
                  </span>
                </div>
                <input
                  type="text"
                  name="kingImage"
                  value={formData.en.kingImage}
                  onChange={(e) => handleChange(e, "en")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#214187]/20 focus:border-[#214187] outline-none transition-all text-gray-800 placeholder:text-gray-500"
                  placeholder="URL. Rec: 1:1 aspect ratio, min 100x100px."
                />
              </div>
            </div>
          </div>

          {/* ================= BANGLA COLUMN ================= */}
          <div className="border-2 border-[#F3056D]/20 rounded-2xl p-6 bg-[#F3056D]/[0.02] relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F3056D] text-white text-xs font-bold px-4 py-1.5 rounded-b-lg shadow-md">
              বাংলা
            </div>

            <div className="space-y-5 pt-4">
              <InputField
                name="title"
                value={formData.bn.title}
                onChange={(e) => handleChange(e, "bn")}
                label="প্রধান শিরোনাম"
                required
                maxLength={100}
                placeholder="সর্বোচ্চ ১০০ অক্ষর। ফরম্যাট: 'ভূমিকা মূল টেক্সট Champ' (যেমনঃ আমরা বিশ্বাস করি Every Child Is A Champ)"
                accentColor="#F3056D"
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  সাবটাইটেল / বিবরণ <span className="text-[#F3056D]">*</span>
                </label>
                <textarea
                  name="subtitle"
                  value={formData.bn.subtitle}
                  onChange={(e) => handleChange(e, "bn")}
                  required
                  rows={5}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition-all text-gray-800 placeholder:text-gray-500 resize-none"
                  placeholder="সর্বোচ্চ ৫০০ অক্ষর। নোট: 'Spoken English' এবং 'Chalak Champs' ফ্রন্টএন্ডে স্বয়ংক্রিয়ভাবে স্টাইল হবে।"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  name="ctaButton"
                  value={formData.bn.ctaButton}
                  onChange={(e) => handleChange(e, "bn")}
                  label="সিটিএ বাটন টেক্সট"
                  required
                  maxLength={50}
                  placeholder="সর্বোচ্চ ৫০ অক্ষর। (যেমনঃ ১টি ফ্রি ক্লাস করুন!)"
                  accentColor="#F3056D"
                />
                <InputField
                  name="secondaryLink"
                  value={formData.bn.secondaryLink}
                  onChange={(e) => handleChange(e, "bn")}
                  label="সেকেন্ডারি লিংক টেক্সট"
                  maxLength={100}
                  placeholder="সর্বোচ্চ ১০০ অক্ষর। (ঐচ্ছিক)"
                  accentColor="#F3056D"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  name="cta2"
                  value={formData.bn.cta2}
                  onChange={(e) => handleChange(e, "bn")}
                  label="সিটিএর নিচের টেক্সট"
                  required
                  maxLength={100}
                  placeholder="সর্বোচ্চ ১০০ অক্ষর। (যেমনঃ কোর্স সম্পর্কে জানতে চাইলে -)"
                  accentColor="#F3056D"
                />
                <InputField
                  name="cta2Btn"
                  value={formData.bn.cta2Btn}
                  onChange={(e) => handleChange(e, "bn")}
                  label="সিটিএর নিচের লিংক টেক্সট"
                  required
                  maxLength={30}
                  placeholder="সর্বোচ্চ ৩০ অক্ষর। (যেমনঃ ক্লিক করুন)"
                  accentColor="#F3056D"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  কিং ক্রাউন ইমেজ URL
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    খালি রাখলে ডিফল্ট ইমেজ দেখাবে
                  </span>
                </div>
                <input
                  type="text"
                  name="kingImage"
                  value={formData.bn.kingImage}
                  onChange={(e) => handleChange(e, "bn")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition-all text-gray-800 placeholder:text-gray-500"
                  placeholder="URL। রেকমেন্ডেড: ১:১ অ্যাসপেক্ট রেশিও, সর্বনিম্ন ১০০x১০০px."
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= SUBMIT BUTTON ================= */}
        <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FFD700] rounded-full shadow-sm shadow-[#FFD700]/50"></span>
            Saves both languages simultaneously to the database
          </p>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#F3056D] to-[#d4045e] hover:from-[#d4045e] hover:to-[#F3056D] text-white font-bold py-3.5 px-10 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#F3056D]/30 hover:shadow-[#F3056D]/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Saving Both
                Languages...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> Save Hero Section
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ================= REUSABLE INPUT COMPONENT =================
interface InputFieldProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
  maxLength: number;
  placeholder: string;
  accentColor: string;
}

function InputField({
  name,
  value,
  onChange,
  label,
  required = false,
  maxLength,
  placeholder,
  accentColor,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-[#F3056D]">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        style={
          {
            // Dynamically apply focus ring and border color based on column
            // Fallback ensures it still works if standard classes are loaded
            "--tw-ring-color": `${accentColor}33`,
          } as React.CSSProperties
        }
        className={`w-full px-4 py-3 border border-gray-300 rounded-xl outline-none transition-all text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:border-[${accentColor}]`}
        placeholder={placeholder}
      />
    </div>
  );
}
