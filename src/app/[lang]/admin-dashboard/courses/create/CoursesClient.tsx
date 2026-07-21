"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import {
  Plus, Loader2, Upload, X, ChevronDown, ChevronUp, ImageIcon, Trash2, Globe,
} from "lucide-react";

const getDefaultContent = () => ({
  breadcrumb: { en: "", bn: "" },
  breadcrumbs: { en: "", bn: "" },
  hero: { title: { en: "", bn: "" }, subtitle: { en: "", bn: "" } },
  quickInfo: {
    title: { en: "", bn: "" },
    items: { en: [] as string[], bn: [] as string[] },
    offerPrice: { en: "", bn: "" }, offerText: { en: "", bn: "" },
    cta1: { en: "", bn: "" }, cta2: { en: "", bn: "" }, ctaBelow: { en: "", bn: "" },
  },
  overview: { title: { en: "", bn: "" }, content: { en: "", bn: "" } },
  levels: {
    title: { en: "", bn: "" }, intro: { en: "", bn: "" },
    level1: { title: { en: "", bn: "" }, for: { en: "", bn: "" }, intro: { en: "", bn: "" }, items: { en: [] as string[], bn: [] as string[] } },
    level2: { title: { en: "", bn: "" }, for: { en: "", bn: "" }, intro: { en: "", bn: "" }, items: { en: [] as string[], bn: [] as string[] } },
  },
  whoIsThisFor: { title: { en: "", bn: "" }, intro: { en: "", bn: "" }, items: { en: [] as string[], bn: [] as string[] }, boldStatement: { en: "", bn: "" } },
  features: { title: { en: "", bn: "" }, cards: [] as { title: { en: string; bn: string }; body: { en: string; bn: string } }[] },
  syllabus: { title: { en: "", bn: "" }, content: { en: "", bn: "" } },
  finalCta: { title: { en: "", bn: "" }, body: { en: "", bn: "" }, cta1: { en: "", bn: "" }, cta2: { en: "", bn: "" }, cta3: { en: "", bn: "" }, ctaBelow: { en: "", bn: "" } },
  payment: { title: { en: "", bn: "" }, description: { en: "", bn: "" } },
  instructor: {
    title: { en: "", bn: "" }, name: "", designation: { en: "", bn: "" }, bio: { en: "", bn: "" },
    experience: { en: "", bn: "" }, studentsCount: 0, rating: 0,
    specializations: { en: [] as string[], bn: [] as string[] }, achievements: { en: [] as string[], bn: [] as string[] },
    education: { en: "", bn: "" }, image: "", social: { facebook: "", linkedin: "", youtube: "" },
  },
  review: { title: { en: "", bn: "" } },
  faq: { title: { en: "", bn: "" }, items: [] as { q: { en: string; bn: string }; a: { en: string; bn: string } }[] },
  mediaAssets: [] as { type: "image" | "video"; src: string; poster?: string; isNew?: boolean; tempIndex?: number }[],
});

const inputClass = "w-full border border-gray-300 p-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition-shadow bg-white text-sm";
const fileClass = "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F3056D]/10 file:text-[#F3056D] hover:file:bg-[#F3056D]/20 cursor-pointer";
const smInputClass = "w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none bg-white";

// ====================================================================
// SUB-COMPONENTS
// ====================================================================

// ✅ FIX: Added defaultOpen={false} prop so we can force sections open
function Section({ id, title, number, children, defaultOpen = false }: { id: string; title: string; number: number; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-5 bg-gray-50/80 hover:bg-gray-100 transition text-left">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
          <span className="w-8 h-8 bg-[#F3056D] text-white rounded-lg flex items-center justify-center text-sm font-bold">{number}</span>{title}
        </h3>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {isOpen && <div className="p-6 space-y-6 bg-white">{children}</div>}
    </div>
  );
}

function BilingualInput({ label, path, type = "text", required = false, placeholderEn, placeholderBn, getVal, setVal }: {
  label: string; path: string; type?: string; required?: boolean; placeholderEn?: string; placeholderBn?: string;
  getVal: (p: string, l: "en" | "bn") => string; setVal: (p: string, l: "en" | "bn", v: string) => void
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#214187] flex items-center gap-1"><Globe className="w-3 h-3" /> EN</span>
          {type === "textarea" ? (
            <textarea value={getVal(path, "en")} onChange={(e) => setVal(path, "en", e.target.value)} className={`${inputClass} min-h-[100px] resize-y`} placeholder={placeholderEn} required={required} />
          ) : (
            <input type={type} value={getVal(path, "en")} onChange={(e) => setVal(path, "en", e.target.value)} className={inputClass} placeholder={placeholderEn} required={required} />
          )}
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#F3056D] flex items-center gap-1"><Globe className="w-3 h-3" /> বাংলা</span>
          {type === "textarea" ? (
            <textarea value={getVal(path, "bn")} onChange={(e) => setVal(path, "bn", e.target.value)} className={`${inputClass} min-h-[100px] resize-y`} placeholder={placeholderBn} required={required} lang="bn" />
          ) : (
            <input type={type} value={getVal(path, "bn")} onChange={(e) => setVal(path, "bn", e.target.value)} className={inputClass} placeholder={placeholderBn} required={required} lang="bn" />
          )}
        </div>
      </div>
    </div>
  );
}

function BilingualArrayInput({ label, path, placeholderEn, placeholderBn, content, updateContent }: {
  label: string; path: string; placeholderEn?: string; placeholderBn?: string; content: any; updateContent: (p: string, v: any) => void
}) {
  const items: any = path.split('.').reduce((o: any, k: string) => o?.[k], content as any) || { en: [], bn: [] };
  const addItem = () => updateContent(path, { en: [...(items.en || []), ""], bn: [...(items.bn || []), ""] });
  const removeItem = (i: number) => updateContent(path, { en: items.en.filter((_: string, idx: number) => idx !== i), bn: items.bn.filter((_: string, idx: number) => idx !== i) });
  const updateItem = (i: number, lang: "en" | "bn", val: string) => {
    const newEn = [...(items.en || [])]; const newBn = [...(items.bn || [])];
    if (lang === "en") newEn[i] = val; else newBn[i] = val;
    updateContent(path, { en: newEn, bn: newBn });
  };
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{label}</label>
        <button type="button" onClick={addItem} className="text-xs font-semibold bg-[#F3056D]/10 text-[#F3056D] px-3 py-1.5 rounded-lg hover:bg-[#F3056D]/20 transition flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
      </div>
      <div className="space-y-2">
        {(items.en || []).map((en: string, i: number) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_40px] gap-2 items-start bg-gray-50 p-3 rounded-xl">
            <input value={en} onChange={(e) => updateItem(i, "en", e.target.value)} className={`${inputClass} !py-2.5`} placeholder={placeholderEn} />
            <input value={items.bn?.[i] || ""} onChange={(e) => updateItem(i, "bn", e.target.value)} className={`${inputClass} !py-2.5`} placeholder={placeholderBn} lang="bn" />
            <button type="button" onClick={() => removeItem(i)} className="p-2 text-red-400 hover:text-red-600 rounded-lg transition mt-1"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureCardsEditor({ content, updateContent }: { content: any; updateContent: (path: string, val: any) => void }) {
  const addCard = () => updateContent("features.cards", [...(content.features?.cards || []), { title: { en: "", bn: "" }, body: { en: "", bn: "" } }]);
  const removeCard = (i: number) => updateContent("features.cards", content.features.cards.filter((_: any, idx: number) => idx !== i));
  const updateCard = (i: number, field: string, lang: string, val: string) => {
    const newCards = [...(content.features?.cards || [])];
    newCards[i] = { ...newCards[i], [field]: { ...newCards[i][field], [lang]: val } };
    updateContent("features.cards", newCards);
  };
  return (
    <div className="space-y-3">
      <button type="button" onClick={addCard} className="text-xs font-semibold bg-[#F3056D]/10 text-[#F3056D] px-3 py-1.5 rounded-lg hover:bg-[#F3056D]/20 transition flex items-center gap-1"><Plus className="w-3 h-3" /> Add Feature Card</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(content.features?.cards || []).map((card: any, i: number) => (
          <div key={i} className="border border-gray-200 p-4 rounded-xl space-y-3 bg-gray-50">
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-gray-500">Card #{i + 1}</span><button type="button" onClick={() => removeCard(i)} className="p-1 text-red-400 hover:text-red-600 rounded"><X className="w-4 h-4" /></button></div>
            <input value={card.title?.en || ""} onChange={(e) => updateCard(i, "title", "en", e.target.value)} className={smInputClass} placeholder="Title (EN)" />
            <input value={card.title?.bn || ""} onChange={(e) => updateCard(i, "title", "bn", e.target.value)} className={smInputClass} placeholder="শিরোনাম (বাংলা)" lang="bn" />
            <textarea value={card.body?.en || ""} onChange={(e) => updateCard(i, "body", "en", e.target.value)} className={`${smInputClass} min-h-[60px] resize-y`} placeholder="Description (EN)" />
            <textarea value={card.body?.bn || ""} onChange={(e) => updateCard(i, "body", "bn", e.target.value)} className={`${smInputClass} min-h-[60px] resize-y`} placeholder="বিবরণ (বাংলা)" lang="bn" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqEditor({ content, updateContent }: { content: any; updateContent: (path: string, val: any) => void }) {
  const addItem = () => updateContent("faq.items", [...(content.faq?.items || []), { q: { en: "", bn: "" }, a: { en: "", bn: "" } }]);
  const removeItem = (i: number) => updateContent("faq.items", content.faq.items.filter((_: any, idx: number) => idx !== i));
  const updateItem = (i: number, field: string, lang: string, val: string) => {
    const newItems = [...(content.faq?.items || [])];
    newItems[i] = { ...newItems[i], [field]: { ...newItems[i][field], [lang]: val } };
    updateContent("faq.items", newItems);
  };
  return (
    <div className="space-y-3">
      <button type="button" onClick={addItem} className="text-xs font-semibold bg-[#F3056D]/10 text-[#F3056D] px-3 py-1.5 rounded-lg hover:bg-[#F3056D]/20 transition flex items-center gap-1"><Plus className="w-3 h-3" /> Add FAQ</button>
      <div className="space-y-3">
        {(content.faq?.items || []).map((item: any, i: number) => (
          <div key={i} className="border border-gray-200 p-4 rounded-xl space-y-3 bg-gray-50">
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-gray-500">FAQ #{i + 1}</span><button type="button" onClick={() => removeItem(i)} className="p-1 text-red-400 hover:text-red-600 rounded"><X className="w-4 h-4" /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className="text-[10px] font-bold text-[#214187]">Question (EN)</label><input value={item.q?.en || ""} onChange={(e) => updateItem(i, "q", "en", e.target.value)} className={smInputClass} /></div>
              <div><label className="text-[10px] font-bold text-[#F3056D]">প্রশ্ন (বাংলা)</label><input value={item.q?.bn || ""} onChange={(e) => updateItem(i, "q", "bn", e.target.value)} className={smInputClass} lang="bn" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className="text-[10px] font-bold text-[#214187]">Answer (EN)</label><textarea value={item.a?.en || ""} onChange={(e) => updateItem(i, "a", "en", e.target.value)} className={`${smInputClass} min-h-[60px] resize-y`} /></div>
              <div><label className="text-[10px] font-bold text-[#F3056D]">উত্তর (বাংলা)</label><textarea value={item.a?.bn || ""} onChange={(e) => updateItem(i, "a", "bn", e.target.value)} className={`${smInputClass} min-h-[60px] resize-y`} lang="bn" /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ====================================================================
// MAIN COMPONENT
// ====================================================================

export default function CoursesClient() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    slug: "", title: { en: "", bn: "" }, category: "general", price: 0, originalPrice: 0, isPublished: false,
    thumbnail: null as File | null, 
    instructorImage: null as File | null, 
    galleryImages: [] as File[], 
    mediaFiles: [] as File[],   
    content: getDefaultContent(),
  });

  const updateContent = (path: string, value: any) => {
    setFormData((prev) => {
      const newContent = JSON.parse(JSON.stringify(prev.content));
      const keys = path.split(".");
      let current: any = newContent;
      for (let i = 0; i < keys.length - 1; i++) { if (!current[keys[i]]) current[keys[i]] = {}; current = current[keys[i]]; }
      current[keys[keys.length - 1]] = value;
      return { ...prev, content: newContent };
    });
  };

  const getVal = (path: string, lang: "en" | "bn"): string => {
    const keys = path.split(".");
    let obj: any = formData.content;
    for (const k of keys) obj = obj?.[k];
    return obj?.[lang] || "";
  };

  const setVal = (path: string, lang: "en" | "bn", val: string) => {
    const otherLang = lang === "en" ? "bn" : "en";
    const otherVal = getVal(path, otherLang);
    updateContent(path, { en: lang === "en" ? val : otherVal, bn: lang === "bn" ? val : otherVal });
  };

  const getPreviewUrl = (asset: any): string | null => {
    if (asset.isNew && asset.tempIndex !== undefined) {
      const allFiles = [...formData.galleryImages, ...formData.mediaFiles];
      const file = allFiles[asset.tempIndex];
      if (file) return URL.createObjectURL(file);
    }
    if (asset.src && !asset.src.startsWith('blob:') && asset.src !== "") return asset.src;
    return null;
  };

  const { data } = useQuery({ queryKey: ["courses"], queryFn: async () => (await axios.get("/api/courses")).data });

  const mutation = useMutation({
    mutationFn: async () => {        
      const finalSlug = formData.slug || `course-${Date.now()}`;
      const data = new FormData();
      
      data.append("slug", finalSlug);
      data.append("title", JSON.stringify(formData.title));
      data.append("category", formData.category);
      data.append("price", formData.price.toString());
      if (formData.originalPrice) data.append("originalPrice", formData.originalPrice.toString());
      data.append("isPublished", formData.isPublished.toString());
      
      if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);
      if (formData.instructorImage) data.append("instructorImage", formData.instructorImage);
      
      const allMediaFiles = [...formData.galleryImages, ...formData.mediaFiles];
      allMediaFiles.forEach((file) => data.append("mediaFiles", file));
      
      const contentToSend = JSON.parse(JSON.stringify(formData.content));
      const existingAssets = (contentToSend.mediaAssets || []).filter((a: any) => !a.isNew);
      
      const newAssetPlaceholders = allMediaFiles.map((file, index) => ({
        type: file.type.startsWith("video") ? "video" : "image",
        src: "",
        poster: "",
        isNew: true,
        tempIndex: index, 
      }));

      contentToSend.mediaAssets = [...existingAssets, ...newAssetPlaceholders];
      
      // ✅ PROOF: Log what is ACTUALLY being sent to the backend
      console.log("=== SENDING TO BACKEND ===");
      console.log("Payment Title EN:", contentToSend.payment?.title?.en);
      console.log("Final CTA Title EN:", contentToSend.finalCta?.title?.en);
      console.log("Syllabus Title EN:", contentToSend.syllabus?.title?.en);
      console.log("Review Title EN:", contentToSend.review?.title?.en);
      console.log("Instructor Title EN:", contentToSend.instructor?.title?.en);
      console.log("Who Is This For EN:", contentToSend.whoIsThisFor?.title?.en);

      data.append("content", JSON.stringify(contentToSend));

      const response = await axios.post("/api/courses", data, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 180000,
      });
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      alert("Course created successfully!");
      setFormData({ 
        slug: "", title: { en: "", bn: "" }, category: "general", price: 0, originalPrice: 0, isPublished: false, 
        thumbnail: null, instructorImage: null, galleryImages: [], mediaFiles: [], content: getDefaultContent() 
      });
    },
    onError: (err: any) => {
      console.error("[Mutation] Error:", err);
      alert("Error: " + (err.response?.data?.message || err.message));
    },
  });

  const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFormData((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, ...Array.from(e.target.files)] }));
    e.target.value = "";
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({ ...prev, galleryImages: prev.galleryImages.filter((_, i) => i !== index) }));
  };

  const handleMediaFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setFormData((prev) => {
      const startIndex = prev.galleryImages.length + prev.mediaFiles.length;
      const newAssets = newFiles.map((file, index) => ({
        type: (file.type.startsWith("video") ? "video" : "image") as "image" | "video",
        src: "", poster: "", isNew: true, tempIndex: startIndex + index,
      }));
      return {
        ...prev,
        mediaFiles: [...prev.mediaFiles, ...newFiles],
        content: { ...prev.content, mediaAssets: [...prev.content.mediaAssets, ...newAssets] },
      };
    });
    e.target.value = "";
  };

  const removeMediaAsset = (index: number) => {
    setFormData((prev) => {
      const asset = prev.content.mediaAssets[index];
      let newMediaFiles = [...prev.mediaFiles];
      if (asset?.isNew && asset.tempIndex !== undefined) newMediaFiles = newMediaFiles.filter((_, i) => i !== asset.tempIndex);
      return {
        ...prev, mediaFiles: newMediaFiles,
        content: { ...prev.content, mediaAssets: prev.content.mediaAssets.filter((_, i) => i !== index) },
      };
    });
  };

  const updateMediaAsset = (index: number, key: string, value: any) => {
    setFormData((prev) => { 
      const newAssets = [...prev.content.mediaAssets]; 
      newAssets[index] = { ...newAssets[index], [key]: value }; 
      return { ...prev, content: { ...prev.content, mediaAssets: newAssets } }; 
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Course Dashboard</h1>
          <p className="text-gray-500 mt-1">Create bilingual courses matching exact JSON structure.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-6">

          <Section id="basic" title="Basic Information" number={1} defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Title (EN) *</label><input value={formData.title.en} onChange={(e) => setFormData(p => ({ ...p, title: { ...p.title, en: e.target.value } }))} className={inputClass} placeholder="Course Title (EN)" required /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 uppercase tracking-wider">শিরোনাম (BN) *</label><input value={formData.title.bn} onChange={(e) => setFormData(p => ({ ...p, title: { ...p.title, bn: e.target.value } }))} className={inputClass} placeholder="কোর্সের নাম (বাংলা)" lang="bn" required /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Slug (URL)</label><input value={formData.slug} onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") }))} className={inputClass} placeholder="kids-fluent-english" required /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Category</label><select value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))} className={inputClass}><option value="spoken-english">Spoken English</option><option value="art">Art & Drawing</option><option value="general">General</option></select></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Price (BDT) *</label><input type="number" value={formData.price || ""} onChange={(e) => setFormData(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} className={inputClass} required /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Original Price</label><input type="number" value={formData.originalPrice || ""} onChange={(e) => setFormData(p => ({ ...p, originalPrice: parseFloat(e.target.value) || 0 }))} className={inputClass} /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Status</label><label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 h-[46px]"><input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData(p => ({ ...p, isPublished: e.target.checked }))} className="w-5 h-5 text-[#F3056D] rounded" /><span className="text-sm font-medium">{formData.isPublished ? "Published" : "Draft"}</span></label></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Thumbnail *</label><input type="file" onChange={(e) => setFormData(p => ({ ...p, thumbnail: e.target.files?.[0] || null }))} className={fileClass} accept="image/*" required />{formData.thumbnail && <p className="text-xs text-green-600">✓ {formData.thumbnail.name}</p>}</div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Instructor Image</label><input type="file" onChange={(e) => setFormData(p => ({ ...p, instructorImage: e.target.files?.[0] || null }))} className={fileClass} accept="image/*" />{formData.instructorImage && <p className="text-xs text-green-600">✓ {formData.instructorImage.name}</p>}</div>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 bg-gray-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700"><ImageIcon className="w-5 h-5 text-[#F3056D]" /><label className="text-sm font-bold uppercase tracking-wider">Gallery / Media Images</label></div>
                <input type="file" multiple onChange={handleGalleryAdd} className={fileClass} accept="image/*,video/*" style={{maxWidth: '300px'}} />
              </div>
              <p className="text-xs text-gray-500">Select multiple images/videos here. They will automatically save into the <b>Media Assets</b> array in the database.</p>
              {formData.galleryImages.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                  {formData.galleryImages.map((file, index) => (
                    <div key={index} className="relative group border rounded-xl overflow-hidden bg-white shadow-sm">
                      <img src={URL.createObjectURL(file)} alt={`Gallery ${index}`} className="w-full h-24 object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button type="button" onClick={() => removeGalleryImage(index)} className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <p className="text-[10px] text-gray-500 p-1.5 truncate bg-white">{file.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

          <Section id="hero" title="Hero Section" number={2} defaultOpen={true}>
            <BilingualInput label="Hero Title" path="hero.title" getVal={getVal} setVal={setVal} required placeholderEn="Kids Fluent English Course..." placeholderBn="KIDS' অনর্গল English..." />
            <BilingualInput label="Hero Subtitle" path="hero.subtitle" type="textarea" getVal={getVal} setVal={setVal} placeholderEn="Fluent English speaking with..." placeholderBn="শুদ্ধ উচ্চারণে অনর্গল..." />
            <BilingualInput label="Breadcrumb" path="breadcrumb" getVal={getVal} setVal={setVal} placeholderEn="Home, Courses, Kids English" placeholderBn="হোম, কোর্স, কিডস ইংরেজি" />
          </Section>

          <Section id="quickInfo" title="Quick Info Section" number={3} defaultOpen={true}>
            <BilingualInput label="Section Title" path="quickInfo.title" getVal={getVal} setVal={setVal} placeholderEn="This course includes" placeholderBn="এই কোর্সে যা থাকে" />
            <BilingualArrayInput label="Info Items" path="quickInfo.items" placeholderEn="64 Live Classes" placeholderBn="৬৪ টি লাইভ ক্লাস" content={formData.content} updateContent={updateContent} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BilingualInput label="Offer Price" path="quickInfo.offerPrice" getVal={getVal} setVal={setVal} placeholderEn="৳ ১৮,০০০" />
              <BilingualInput label="CTA Button 1" path="quickInfo.cta1" getVal={getVal} setVal={setVal} placeholderEn="Enroll Now →" />
              <BilingualInput label="CTA Button 2" path="quickInfo.cta2" getVal={getVal} setVal={setVal} placeholderEn="Book a Free Demo →" />
            </div>
          </Section>

          <Section id="overview" title="Course Overview" number={4} defaultOpen={true}>
            <BilingualInput label="Section Title" path="overview.title" getVal={getVal} setVal={setVal} placeholderEn="Course Details" placeholderBn="কোর্স সম্পর্কে বিস্তারিত" />
            <BilingualInput label="Overview Content" path="overview.content" type="textarea" getVal={getVal} setVal={setVal} placeholderEn="The Kids English Course is..." placeholderBn="এই কোর্সটি ৬ থেকে ১১ বছর..." />
          </Section>

          {/* ✅ FIX: defaultOpen={true} ADDED TO ALL REMAINING SECTIONS */}
          <Section id="levels" title="Course Levels" number={5} defaultOpen={true}>
            <BilingualInput label="Section Title" path="levels.title" getVal={getVal} setVal={setVal} placeholderEn="Two Course Levels" placeholderBn="কোর্সের দুটি লেভেল" />
            <div className="bg-blue-50 p-5 rounded-2xl space-y-4 border border-blue-100">
              <h4 className="font-bold text-[#214187] text-lg">Level 1</h4>
              <BilingualInput label="Title" path="levels.level1.title" getVal={getVal} setVal={setVal} placeholderEn="Level 1, Basic..." />
              <BilingualArrayInput label="Items" path="levels.level1.items" placeholderEn="Item" placeholderBn="আইটেম" content={formData.content} updateContent={updateContent} />
            </div>
            <div className="bg-purple-50 p-5 rounded-2xl space-y-4 border border-purple-100">
              <h4 className="font-bold text-purple-700 text-lg">Level 2</h4>
              <BilingualInput label="Title" path="levels.level2.title" getVal={getVal} setVal={setVal} placeholderEn="Level 2, Advanced..." />
              <BilingualArrayInput label="Items" path="levels.level2.items" placeholderEn="Item" placeholderBn="আইটেম" content={formData.content} updateContent={updateContent} />
            </div>
          </Section>

          <Section id="whoIsThisFor" title="Who Is This For" number={6} defaultOpen={true}>
            <BilingualInput label="Section Title" path="whoIsThisFor.title" getVal={getVal} setVal={setVal} placeholderEn="Course is Designed For" placeholderBn="কোর্সটি যাদের জন্য" />
            <BilingualInput label="Section Intro" path="whoIsThisFor.intro" getVal={getVal} setVal={setVal} placeholderEn="Does your child relate to any of these?" placeholderBn="আপনার সন্তান কি এরকম?" />
            <BilingualArrayInput label="Target Items" path="whoIsThisFor.items" placeholderEn="Can't speak English..." placeholderBn="ইংলিশ একদমই বলতে পারে না..." content={formData.content} updateContent={updateContent} />
            <BilingualInput label="Bold Statement" path="whoIsThisFor.boldStatement" getVal={getVal} setVal={setVal} placeholderEn="This course was built exactly for your child." placeholderBn="তাহলে এই কোর্সটা ঠিক তার জন্যই।" />
          </Section>

          <Section id="features" title="Course Features" number={7} defaultOpen={true}>
            <BilingualInput label="Section Title" path="features.title" getVal={getVal} setVal={setVal} placeholderEn="Course Features" placeholderBn="কোর্সের ফিচার" />
            <FeatureCardsEditor content={formData.content} updateContent={updateContent} />
          </Section>

          <Section id="instructor" title="Instructor Details" number={8} defaultOpen={true}>
            <BilingualInput label="Section Title" path="instructor.title" getVal={getVal} setVal={setVal} placeholderEn="Course Instructor" placeholderBn="চালাক চ্যাম্পস ইন্সট্রাক্টর" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Instructor Name</label><input value={formData.content.instructor.name} onChange={(e) => updateContent("instructor.name", e.target.value)} className={inputClass} placeholder="মোঃ রাফি ইসলাম" /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Students Count</label><input type="number" value={formData.content.instructor.studentsCount || ""} onChange={(e) => updateContent("instructor.studentsCount", parseInt(e.target.value) || 0)} className={inputClass} /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Rating (0-5)</label><input type="number" step="0.1" value={formData.content.instructor.rating || ""} onChange={(e) => updateContent("instructor.rating", parseFloat(e.target.value) || 0)} className={inputClass} /></div>
            </div>
            <BilingualInput label="Designation" path="instructor.designation" getVal={getVal} setVal={setVal} placeholderEn="Spoken English Instructor..." />
            <BilingualInput label="Bio" path="instructor.bio" type="textarea" getVal={getVal} setVal={setVal} />
            <BilingualInput label="Experience" path="instructor.experience" getVal={getVal} setVal={setVal} placeholderEn="6 Years" placeholderBn="৬ বছর" />
            <BilingualInput label="Education" path="instructor.education" getVal={getVal} setVal={setVal} placeholderEn="B.A. (Honours) in English..." />
            <BilingualArrayInput label="Specializations" path="instructor.specializations" placeholderEn="Phonetics & Pronunciation" placeholderBn="ফোনেটিক্স ও উচ্চারণ" content={formData.content} updateContent={updateContent} />
            <BilingualArrayInput label="Achievements" path="instructor.achievements" placeholderEn="1400+ students completed" placeholderBn="১,৪০০+ শিক্ষার্থী সম্পন্ন" content={formData.content} updateContent={updateContent} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Facebook URL</label><input value={formData.content.instructor.social.facebook} onChange={(e) => updateContent("instructor.social.facebook", e.target.value)} className={inputClass} /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700">LinkedIn URL</label><input value={formData.content.instructor.social.linkedin} onChange={(e) => updateContent("instructor.social.linkedin", e.target.value)} className={inputClass} /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700">YouTube URL</label><input value={formData.content.instructor.social.youtube} onChange={(e) => updateContent("instructor.social.youtube", e.target.value)} className={inputClass} /></div>
            </div>
          </Section>

          <Section id="faq" title="FAQ Section" number={9} defaultOpen={true}>
            <BilingualInput label="Section Title" path="faq.title" getVal={getVal} setVal={setVal} placeholderEn="Frequently Asked Questions" placeholderBn="সাধারণ জিজ্ঞাসা" />
            <FaqEditor content={formData.content} updateContent={updateContent} />
          </Section>

          <Section id="syllabus" title="Syllabus" number={10} defaultOpen={true}>
            <BilingualInput label="Title" path="syllabus.title" getVal={getVal} setVal={setVal} placeholderEn="Course Syllabus/Curriculum" placeholderBn="কোর্স সিলেবাস/কারিকুলাম" />
            <BilingualInput label="Content" path="syllabus.content" type="textarea" getVal={getVal} setVal={setVal} placeholderEn="Tab system" />
          </Section>

          <Section id="finalCta" title="Final Call to Action" number={11} defaultOpen={true}>
            <BilingualInput label="Title" path="finalCta.title" getVal={getVal} setVal={setVal} placeholderEn="Any More Questions?" placeholderBn="আরও কোন জিজ্ঞাসা আছে?" />
            <BilingualInput label="Body Text" path="finalCta.body" type="textarea" getVal={getVal} setVal={setVal} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <BilingualInput label="CTA 1" path="finalCta.cta1" getVal={getVal} setVal={setVal} placeholderEn="Book My Free Class →" />
              <BilingualInput label="CTA 2" path="finalCta.cta2" getVal={getVal} setVal={setVal} placeholderEn="Enroll Now →" />
              <BilingualInput label="CTA 3 (Phone)" path="finalCta.cta3" getVal={getVal} setVal={setVal} placeholderEn="01740176774 (24/7)" />
              <BilingualInput label="Below Text" path="finalCta.ctaBelow" getVal={getVal} setVal={setVal} placeholderEn="Limited seats, confirm today" placeholderBn="সীমিত আসন, আজই নিশ্চিত করুন" />
            </div>
          </Section>

          <Section id="payment" title="Payment Section" number={12} defaultOpen={true}>
            <BilingualInput label="Title" path="payment.title" getVal={getVal} setVal={setVal} placeholderEn="Payment Process" placeholderBn="ভর্তি হওয়ার প্রক্রিয়া" />
            <BilingualInput label="Description" path="payment.description" type="textarea" getVal={getVal} setVal={setVal} placeholderEn="Watch This Video To Learn More..." placeholderBn="কীভাবে পেমেন্ট করবেন..." />
          </Section>

          <Section id="review" title="Review Section" number={13} defaultOpen={true}>
            <BilingualInput label="Section Title" path="review.title" getVal={getVal} setVal={setVal} placeholderEn="Student Reviews" placeholderBn="শিক্ষার্থীদের মতামত" />
          </Section>

          <Section id="media" title="Media Assets (Advanced / External URLs)" number={14} defaultOpen={true}>
            <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">If you didn't use the Gallery box above, you can add external URLs or more files here.</p>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-bold text-gray-700 mb-2 block">Upload More Files</label>
                <input type="file" multiple onChange={handleMediaFileAdd} className={fileClass} accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-bold text-gray-700 mb-2 block">Add External URL</label>
                <button type="button" onClick={() => { updateContent("mediaAssets", [...(formData.content.mediaAssets || []), { type: "image" as const, src: "", poster: "", isNew: false }]); }} className="w-full h-[46px] border-2 border-dashed border-gray-300 rounded-xl text-sm font-bold text-gray-500 hover:border-[#F3056D] hover:text-[#F3056D] transition flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add External URL</button>
              </div>
            </div>
            <div className="space-y-4 mt-4">
              {formData.content.mediaAssets.map((asset, index) => {
                const previewUrl = getPreviewUrl(asset);
                return (
                  <div key={index} className="border border-gray-200 p-4 rounded-xl space-y-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded border">#{index + 1}</span>
                        {asset.isNew && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">🆕 New Upload</span>}
                        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">{asset.type}</span>
                      </div>
                      <button type="button" onClick={() => removeMediaAsset(index)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    {previewUrl && (
                      <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden border">
                        {asset.type === "video" ? <video src={previewUrl} className="w-full h-full object-contain" controls /> : <img src={previewUrl} alt={`Preview`} className="w-full h-full object-contain" />}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Type</label>
                        <select value={asset.type} onChange={(e) => updateMediaAsset(index, "type", e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg text-sm bg-white"><option value="image">Image</option><option value="video">Video</option></select>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">{asset.isNew ? "Source (auto-replaced)" : "Source URL"}</label>
                        {asset.isNew ? (
                          <div className="w-full border border-gray-200 p-2 rounded-lg text-sm bg-gray-100 text-gray-500 flex items-center gap-2"><Upload className="w-4 h-4" /> Will be replaced with R2 URL</div>
                        ) : (
                          <input value={asset.src || ""} onChange={(e) => updateMediaAsset(index, "src", e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg text-sm bg-white" placeholder="https://..." />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {formData.content.mediaAssets.length === 0 && <div className="text-center py-12"><ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-sm text-gray-400">No media assets added yet</p></div>}
          </Section>

          <div className="flex justify-end gap-4 pt-6">
            <button type="button" onClick={() => { if (confirm("Clear form?")) window.location.reload(); }} disabled={mutation.isPending} className="px-8 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold transition">Clear Form</button>
            <button type="submit" disabled={mutation.isPending} className={`px-10 py-3 rounded-xl font-bold flex items-center gap-2 text-white transition-all shadow-lg ${mutation.isPending ? "bg-gray-400 cursor-not-allowed" : "bg-[#F3056D] hover:bg-[#d9045c] shadow-[#F3056D]/30 hover:scale-[1.02] active:scale-95"}`}>
              {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {mutation.isPending ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
