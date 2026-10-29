"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import {
  Loader2, Upload, X, ChevronDown, ChevronUp, ImageIcon, Trash2,
  Globe, Users, UserCircle, Plus, Search,
} from "lucide-react";
import QuillEditor from "./QuillEditor";

// ====================================================================
// DEFAULT INSTRUCTOR TEMPLATE
// ====================================================================
const getDefaultInstructor = () => ({
  title: { en: "", bn: "" },
  name: "",
  designation: { en: "", bn: "" },
  bio: { en: "", bn: "" },
  experience: { en: "", bn: "" },
  studentsCount: 0,
  rating: 0,
  specializations: { en: [] as string[], bn: [] as string[] },
  achievements: { en: [] as string[], bn: [] as string[] },
  education: { en: "", bn: "" },
  image: "",
  isNewImage: false,
  tempImageIndex: -1,
  social: { facebook: "", linkedin: "", youtube: "" },
});

// ====================================================================
// DEFAULT CONTENT
// ====================================================================
const getDefaultContent = () => ({
  breadcrumb: { en: "", bn: "" },
  hero: { title: { en: "", bn: "" }, subtitle: { en: "", bn: "" } },
  quickInfo: {
    title: { en: "", bn: "" },
    items: { en: [] as string[], bn: [] as string[] },
    offerPrice: { en: "", bn: "" },
    offerText: { en: "", bn: "" },
    cta1: { en: "", bn: "" },
    cta2: { en: "", bn: "" },
    ctaBelow: { en: "", bn: "" },
  },
  overview: { title: { en: "", bn: "" }, content: { en: "", bn: "" } },
  levels: {
    title: { en: "", bn: "" },
    intro: { en: "", bn: "" },
    level1: {
      title: { en: "", bn: "" },
      for: { en: "", bn: "" },
      intro: { en: "", bn: "" },
      items: { en: [] as string[], bn: [] as string[] },
    },
    level2: {
      title: { en: "", bn: "" },
      for: { en: "", bn: "" },
      intro: { en: "", bn: "" },
      items: { en: [] as string[], bn: [] as string[] },
    },
  },
  whoIsThisFor: {
    title: { en: "", bn: "" },
    intro: { en: "", bn: "" },
    items: { en: [] as string[], bn: [] as string[] },
    boldStatement: { en: "", bn: "" },
  },
  features: {
    title: { en: "", bn: "" },
    cards: [] as { title: { en: string; bn: string }; body: { en: string; bn: string } }[],
  },
  syllabus: { title: { en: "", bn: "" }, content: { en: "", bn: "" } },
  finalCta: {
    title: { en: "", bn: "" },
    body: { en: "", bn: "" },
    cta1: { en: "", bn: "" },
    cta2: { en: "", bn: "" },
    cta3: { en: "", bn: "" },
    ctaBelow: { en: "", bn: "" },
  },
  payment: { title: { en: "", bn: "" }, description: { en: "", bn: "" } },
  instructorsTitle: { en: "Course Instructors", bn: "কোর্স ইন্সট্রাক্টর" },
  instructors: [getDefaultInstructor()],
  review: { title: { en: "", bn: "" } },
  faq: {
    title: { en: "", bn: "" },
    items: [] as { q: { en: string; bn: string }; a: { en: string; bn: string } }[],
  },
  mediaAssets: [] as {
    type: "image" | "video";
    src: string;
    poster?: string;
    isNew?: boolean;
    tempIndex?: number;
  }[],
});

// ====================================================================
// STYLE CLASSES
// ====================================================================
const inputClass =
  "w-full border border-gray-300 p-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition-shadow bg-white text-sm";
const fileClass =
  "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F3056D]/10 file:text-[#F3056D] hover:file:bg-[#F3056D]/20 cursor-pointer";
const smInputClass =
  "w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none bg-white";

// ====================================================================
// SUB-COMPONENTS
// ====================================================================

function Section({
  id, title, number, children, defaultOpen = false, icon,
}: {
  id: string; title: string; number: number; children: React.ReactNode; defaultOpen?: boolean; icon?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 bg-gray-50/80 hover:bg-gray-100 transition text-left"
      >
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
          <span className="w-8 h-8 bg-[#F3056D] text-white rounded-lg flex items-center justify-center text-sm font-bold">
            {number}
          </span>
          {icon && <span className="text-[#F3056D]">{icon}</span>}
          {title}
        </h3>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {isOpen && <div className="p-6 space-y-6 bg-white">{children}</div>}
    </div>
  );
}

function BilingualInput({
  label, path, type = "text", required = false, placeholderEn, placeholderBn, getVal, setVal,
}: {
  label: string; path: string; type?: string; required?: boolean;
  placeholderEn?: string; placeholderBn?: string;
  getVal: (p: string, l: "en" | "bn") => string;
  setVal: (p: string, l: "en" | "bn", v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#214187] flex items-center gap-1">
            <Globe className="w-3 h-3" /> EN
          </span>
          {type === "textarea" ? (
            <textarea
              value={getVal(path, "en")}
              onChange={(e) => setVal(path, "en", e.target.value)}
              className={`${inputClass} min-h-[100px] resize-y`}
              placeholder={placeholderEn}
              required={required}
            />
          ) : (
            <input
              type={type}
              value={getVal(path, "en")}
              onChange={(e) => setVal(path, "en", e.target.value)}
              className={inputClass}
              placeholder={placeholderEn}
              required={required}
            />
          )}
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#F3056D] flex items-center gap-1">
            <Globe className="w-3 h-3" /> বাংলা
          </span>
          {type === "textarea" ? (
            <textarea
              value={getVal(path, "bn")}
              onChange={(e) => setVal(path, "bn", e.target.value)}
              className={`${inputClass} min-h-[100px] resize-y`}
              placeholder={placeholderBn}
              required={required}
              lang="bn"
            />
          ) : (
            <input
              type={type}
              value={getVal(path, "bn")}
              onChange={(e) => setVal(path, "bn", e.target.value)}
              className={inputClass}
              placeholder={placeholderBn}
              required={required}
              lang="bn"
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ====================================================================
// ✅ NEW: Bilingual Quill Editor — rich text for EN + BN
// ====================================================================
function BilingualQuillEditor({
  label, path, getVal, setVal, placeholderEn, placeholderBn,
}: {
  label: string; path: string;
  getVal: (p: string, l: "en" | "bn") => string;
  setVal: (p: string, l: "en" | "bn", v: string) => void;
  placeholderEn?: string; placeholderBn?: string;
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
        {label}
      </label>
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#214187] flex items-center gap-1">
            <Globe className="w-3 h-3" /> English
          </span>
          <QuillEditor
            value={getVal(path, "en")}
            onChange={(v) => setVal(path, "en", v)}
            placeholder={placeholderEn || "Write content in English..."}
          />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#F3056D] flex items-center gap-1">
            <Globe className="w-3 h-3" /> বাংলা
          </span>
          <QuillEditor
            value={getVal(path, "bn")}
            onChange={(v) => setVal(path, "bn", v)}
            placeholder={placeholderBn || "বাংলায় লিখুন..."}
          />
        </div>
      </div>
    </div>
  );
}

function BilingualArrayInput({
  label, path, placeholderEn, placeholderBn, content, updateContent,
}: {
  label: string; path: string; placeholderEn?: string; placeholderBn?: string;
  content: any; updateContent: (p: string, v: any) => void;
}) {
  const items: any = path.split(".").reduce((o: any, k: string) => o?.[k], content as any) || { en: [], bn: [] };
  const addItem = () => updateContent(path, { en: [...(items.en || []), ""], bn: [...(items.bn || []), ""] });
  const removeItem = (i: number) =>
    updateContent(path, {
      en: items.en.filter((_: string, idx: number) => idx !== i),
      bn: items.bn.filter((_: string, idx: number) => idx !== i),
    });
  const updateItem = (i: number, lang: "en" | "bn", val: string) => {
    const newEn = [...(items.en || [])];
    const newBn = [...(items.bn || [])];
    if (lang === "en") newEn[i] = val;
    else newBn[i] = val;
    updateContent(path, { en: newEn, bn: newBn });
  };
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{label}</label>
        <button
          type="button"
          onClick={addItem}
          className="text-xs font-semibold bg-[#F3056D]/10 text-[#F3056D] px-3 py-1.5 rounded-lg hover:bg-[#F3056D]/20 transition flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {(items.en || []).map((en: string, i: number) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_40px] gap-2 items-start bg-gray-50 p-3 rounded-xl">
            <input value={en} onChange={(e) => updateItem(i, "en", e.target.value)} className={`${inputClass} !py-2.5`} placeholder={placeholderEn} />
            <input value={items.bn?.[i] || ""} onChange={(e) => updateItem(i, "bn", e.target.value)} className={`${inputClass} !py-2.5`} placeholder={placeholderBn} lang="bn" />
            <button type="button" onClick={() => removeItem(i)} className="p-2 text-red-400 hover:text-red-600 rounded-lg transition mt-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureCardsEditor({ content, updateContent }: { content: any; updateContent: (path: string, val: any) => void; }) {
  const addCard = () => updateContent("features.cards", [...(content.features?.cards || []), { title: { en: "", bn: "" }, body: { en: "", bn: "" } }]);
  const removeCard = (i: number) => updateContent("features.cards", content.features.cards.filter((_: any, idx: number) => idx !== i));
  const updateCard = (i: number, field: string, lang: string, val: string) => {
    const newCards = [...(content.features?.cards || [])];
    newCards[i] = { ...newCards[i], [field]: { ...newCards[i][field], [lang]: val } };
    updateContent("features.cards", newCards);
  };
  return (
    <div className="space-y-3">
      <button type="button" onClick={addCard} className="text-xs font-semibold bg-[#F3056D]/10 text-[#F3056D] px-3 py-1.5 rounded-lg hover:bg-[#F3056D]/20 transition flex items-center gap-1">
        <Plus className="w-3 h-3" /> Add Feature Card
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(content.features?.cards || []).map((card: any, i: number) => (
          <div key={i} className="border border-gray-200 p-4 rounded-xl space-y-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">Card #{i + 1}</span>
              <button type="button" onClick={() => removeCard(i)} className="p-1 text-red-400 hover:text-red-600 rounded"><X className="w-4 h-4" /></button>
            </div>
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

function FaqEditor({ content, updateContent }: { content: any; updateContent: (path: string, val: any) => void; }) {
  const addItem = () => updateContent("faq.items", [...(content.faq?.items || []), { q: { en: "", bn: "" }, a: { en: "", bn: "" } }]);
  const removeItem = (i: number) => updateContent("faq.items", content.faq.items.filter((_: any, idx: number) => idx !== i));
  const updateItem = (i: number, field: string, lang: string, val: string) => {
    const newItems = [...(content.faq?.items || [])];
    newItems[i] = { ...newItems[i], [field]: { ...newItems[i][field], [lang]: val } };
    updateContent("faq.items", newItems);
  };
  return (
    <div className="space-y-3">
      <button type="button" onClick={addItem} className="text-xs font-semibold bg-[#F3056D]/10 text-[#F3056D] px-3 py-1.5 rounded-lg hover:bg-[#F3056D]/20 transition flex items-center gap-1">
        <Plus className="w-3 h-3" /> Add FAQ
      </button>
      <div className="space-y-3">
        {(content.faq?.items || []).map((item: any, i: number) => (
          <div key={i} className="border border-gray-200 p-4 rounded-xl space-y-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">FAQ #{i + 1}</span>
              <button type="button" onClick={() => removeItem(i)} className="p-1 text-red-400 hover:text-red-600 rounded"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-[#214187]">Question (EN)</label>
                <input value={item.q?.en || ""} onChange={(e) => updateItem(i, "q", "en", e.target.value)} className={smInputClass} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#F3056D]">প্রশ্ন (বাংলা)</label>
                <input value={item.q?.bn || ""} onChange={(e) => updateItem(i, "q", "bn", e.target.value)} className={smInputClass} lang="bn" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-[#214187]">Answer (EN)</label>
                <textarea value={item.a?.en || ""} onChange={(e) => updateItem(i, "a", "en", e.target.value)} className={`${smInputClass} min-h-[60px] resize-y`} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#F3056D]">উত্তর (বাংলা)</label>
                <textarea value={item.a?.bn || ""} onChange={(e) => updateItem(i, "a", "bn", e.target.value)} className={`${smInputClass} min-h-[60px] resize-y`} lang="bn" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ====================================================================
// ✅ NEW: Teacher Select Dropdown — fetches approved teachers from backend
// and auto-fills instructor fields when one is selected
// ====================================================================
function TeacherSelectDropdown({
  existingInstructorNames,
  onSelect,
}: {
  existingInstructorNames: string[];
  onSelect: (teacher: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["teachers-for-course"],
    queryFn: async () => (await axios.get("/api/admin/teachers/for-course-select")).data,
    staleTime: 60_000,
  });

  const teachers: any[] = data?.teachers || [];

  const filtered = teachers.filter((t) => {
    const name = t.displayName || "";
    if (existingInstructorNames.includes(name)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        name.toLowerCase().includes(q) ||
        (t.professionalTitle || "").toLowerCase().includes(q) ||
        (t.subjects || []).some((s: string) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="border-2 border-dashed border-[#F3056D]/30 rounded-2xl p-4 bg-[#F3056D]/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#F3056D]" />
          <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Select Existing Teacher
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-xs font-semibold bg-[#F3056D] text-white px-3 py-1.5 rounded-lg hover:bg-[#d9045c] transition flex items-center gap-1"
        >
          {open ? "Close" : "Browse Teachers"} <ChevronDown className={`w-3 h-3 transition ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="space-y-3">
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-500 p-3">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading teachers…
            </div>
          )}
          {error && (
            <div className="text-sm text-red-600 p-3 bg-red-50 rounded-lg border border-red-200">
              Failed to load teachers: {error.message}
              <br />
              <span className="text-xs">Make sure you've created teacher profiles in /admin-dashboard/teachers first.</span>
            </div>
          )}
          {!isLoading && !error && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${inputClass} pl-10 !py-2.5`}
                  placeholder="Search by name, subject, or title…"
                />
              </div>
              {filtered.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-400">
                  {teachers.length === 0
                    ? "No approved teacher profiles yet. Create one in /admin-dashboard/teachers first."
                    : "No teachers match your search."}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                  {filtered.map((t) => {
                    const name = t.displayName || "";
                    const initials = name.charAt(0) || "T";
                    return (
                      <button
                        type="button"
                        key={t._id}
                        onClick={() => {
                          onSelect(t);
                          setOpen(false);
                          setSearch("");
                        }}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#F3056D] hover:bg-[#F3056D]/5 transition text-left bg-white"
                      >
                        {t.profilePhotoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.profilePhotoUrl} alt={name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F3056D] to-[#214187] flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-white">{initials}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 text-sm truncate">{name}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {t.professionalTitle || "No title set"}
                          </div>
                          {t.subjects?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {t.subjects.slice(0, 2).map((s: string) => (
                                <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <Plus className="w-4 h-4 text-[#F3056D] flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ====================================================================
// INSTRUCTOR EDITOR CARD
// ====================================================================
function InstructorEditor({
  index, instructor, formData, updateContent, getVal, setVal, onImageChange, onRemove, canRemove,
}: {
  index: number; instructor: any; formData: any;
  updateContent: (path: string, val: any) => void;
  getVal: (path: string, lang: "en" | "bn") => string;
  setVal: (path: string, lang: "en" | "bn", val: string) => void;
  onImageChange: (index: number, file: File | null) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}) {
  const base = `instructors.${index}`;
  let previewSrc: string | null = null;
  if (instructor.isNewImage && formData.instructorImageFiles[index]) {
    previewSrc = URL.createObjectURL(formData.instructorImageFiles[index]);
  } else if (instructor.image && !instructor.isNewImage) {
    previewSrc = instructor.image;
  }
  const accentColors = ["border-l-[#F3056D]", "border-l-[#214187]", "border-l-[#10B981]", "border-l-[#F59E0B]", "border-l-[#8B5CF6]", "border-l-[#EC4899]"];
  const accentColor = accentColors[index % accentColors.length];

  return (
    <div className={`border-2 border-gray-200 border-l-4 ${accentColor} rounded-2xl overflow-hidden bg-white shadow-sm`}>
      <div className="flex justify-between items-center p-4 bg-gray-50/80 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F3056D] to-[#214187] flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{instructor.name || `Instructor #${index + 1}`}</h4>
            <p className="text-xs text-gray-500">{instructor.designation?.en || "No designation set"}</p>
          </div>
        </div>
        {canRemove && (
          <button type="button" onClick={() => { if (confirm(`Remove "${instructor.name || "Instructor #" + (index + 1)}"?`)) onRemove(index); }}
            className="flex items-center gap-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition text-sm font-semibold">
            <Trash2 className="w-4 h-4" /> Remove
          </button>
        )}
      </div>
      <div className="p-5 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#F3056D]" /> Instructor Photo
          </label>
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
              {previewSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewSrc} alt={instructor.name || "Instructor"} className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-10 h-10 text-gray-300" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input type="file" onChange={(e) => onImageChange(index, e.target.files?.[0] || null)} className={fileClass} accept="image/*" />
              {instructor.isNewImage && (
                <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">🆕 New image selected — will upload on save</p>
              )}
              {instructor.image && !instructor.isNewImage && (
                <button type="button" onClick={() => { updateContent(`${base}.image`, ""); onImageChange(index, null); }}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold">✕ Remove existing image</button>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Full Name *</label>
            <input value={instructor.name || ""} onChange={(e) => updateContent(`${base}.name`, e.target.value)} className={inputClass} placeholder="মোঃ রাফি ইসলাম" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Students Count</label>
            <input type="number" value={instructor.studentsCount || ""} onChange={(e) => updateContent(`${base}.studentsCount`, parseInt(e.target.value) || 0)} className={inputClass} placeholder="1400" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Rating (0-5)</label>
            <input type="number" step="0.1" value={instructor.rating || ""} onChange={(e) => updateContent(`${base}.rating`, parseFloat(e.target.value) || 0)} className={inputClass} placeholder="4.8" />
          </div>
        </div>
        <BilingualInput label="Designation" path={`${base}.designation`} getVal={getVal} setVal={setVal} placeholderEn="Spoken English Instructor" placeholderBn="স্পোকেন ইংরেজি ইন্সট্রাক্টর" />
        <BilingualInput label="Bio" path={`${base}.bio`} type="textarea" getVal={getVal} setVal={setVal} placeholderEn="Short bio about the instructor..." placeholderBn="ইন্সট্রাক্টর সম্পর্কে সংক্ষিপ্ত পরিচিতি..." />
        <BilingualInput label="Experience" path={`${base}.experience`} getVal={getVal} setVal={setVal} placeholderEn="6 Years" placeholderBn="৬ বছর" />
        <BilingualInput label="Education" path={`${base}.education`} getVal={getVal} setVal={setVal} placeholderEn="B.A. (Honours) in English" placeholderBn="ইংরেজিতে স্নাতক (সম্মান)" />
        <BilingualArrayInput label="Specializations" path={`${base}.specializations`} placeholderEn="Phonetics & Pronunciation" placeholderBn="ফোনেটিক্স ও উচ্চারণ" content={formData.content} updateContent={updateContent} />
        <BilingualArrayInput label="Achievements" path={`${base}.achievements`} placeholderEn="1400+ students completed" placeholderBn="১,৪০০+ শিক্ষার্থী সম্পন্ন" content={formData.content} updateContent={updateContent} />
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Social Links</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Facebook</label>
              <input value={instructor.social?.facebook || ""} onChange={(e) => updateContent(`${base}.social.facebook`, e.target.value)} className={smInputClass} placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">LinkedIn</label>
              <input value={instructor.social?.linkedin || ""} onChange={(e) => updateContent(`${base}.social.linkedin`, e.target.value)} className={smInputClass} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">YouTube</label>
              <input value={instructor.social?.youtube || ""} onChange={(e) => updateContent(`${base}.social.youtube`, e.target.value)} className={smInputClass} placeholder="https://youtube.com/..." />
            </div>
          </div>
        </div>
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
    slug: "",
    title: { en: "", bn: "" },
    category: "general",
    price: 0,
    originalPrice: 0,
    isPublished: false,
    thumbnail: null as File | null,
    youtubeVideoUrl: "",  // ✅ NEW
    instructorImageFiles: [] as (File | null)[],
    galleryImages: [] as File[],
    mediaFiles: [] as File[],
    content: getDefaultContent(),
  });;

  const updateContent = (path: string, value: any) => {
    setFormData((prev) => {
      const newContent = JSON.parse(JSON.stringify(prev.content));
      const keys = path.split(".");
      let current: any = newContent;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
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
    updateContent(path, {
      en: lang === "en" ? val : otherVal,
      bn: lang === "bn" ? val : otherVal,
    });
  };

  // Instructor management
  const addInstructor = () => {
    setFormData((prev) => ({
      ...prev,
      instructorImageFiles: [...prev.instructorImageFiles, null],
      content: { ...prev.content, instructors: [...prev.content.instructors, getDefaultInstructor()] },
    }));
  };

  const removeInstructor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      instructorImageFiles: prev.instructorImageFiles.filter((_, i) => i !== index),
      content: { ...prev.content, instructors: prev.content.instructors.filter((_, i) => i !== index) },
    }));
  };

  const handleInstructorImageChange = (index: number, file: File | null) => {
    setFormData((prev) => {
      const newFiles = [...prev.instructorImageFiles];
      newFiles[index] = file;
      const newInstructors = [...prev.content.instructors];
      newInstructors[index] = { ...newInstructors[index], isNewImage: !!file, tempImageIndex: -1 };
      return { ...prev, instructorImageFiles: newFiles, content: { ...prev.content, instructors: newInstructors } };
    });
  };

  // ✅ NEW: Handle teacher selection from dropdown — auto-fills instructor fields
  const handleSelectTeacher = (teacher: any) => {
    const newInstructor = {
      title: { en: "Instructor", bn: "ইন্সট্রাক্টর" },
      name: teacher.displayName || "",
      designation: {
        en: teacher.professionalTitle || "",
        bn: teacher.professionalTitle || "",
      },
      bio: {
        en: teacher.shortIntro || teacher.biography || "",
        bn: teacher.shortIntro || teacher.biography || "",
      },
      experience: {
        en: `${teacher.totalYearsExperience || 0} Years`,
        bn: `${teacher.totalYearsExperience || 0} বছর`,
      },
      studentsCount: 0,
      rating: 0,
      specializations: {
        en: teacher.subjects || [],
        bn: teacher.subjects || [],
      },
      achievements: {
        en: teacher.awards || [],
        bn: teacher.awards || [],
      },
      education: {
        en: teacher.education?.[0]?.degree || "",
        bn: teacher.education?.[0]?.degree || "",
      },
      image: teacher.profilePhotoUrl || "",
      isNewImage: false,
      tempImageIndex: -1,
      social: { facebook: "", linkedin: "", youtube: "" },
    };

    setFormData((prev) => ({
      ...prev,
      instructorImageFiles: [...prev.instructorImageFiles, null],
      content: { ...prev.content, instructors: [...prev.content.instructors, newInstructor] },
    }));
  };

  const getPreviewUrl = (asset: any): string | null => {
    if (asset.isNew && asset.tempIndex !== undefined) {
      const allFiles = [...formData.galleryImages, ...formData.mediaFiles];
      const file = allFiles[asset.tempIndex];
      if (file) return URL.createObjectURL(file);
    }
    if (asset.src && !asset.src.startsWith("blob:") && asset.src !== "") return asset.src;
    return null;
  };

  const { data } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => (await axios.get("/api/courses")).data,
  });

  // ====================================================================
  // MUTATION
  // ====================================================================
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
      // ✅ NEW: send YouTube URL to backend
      if (formData.youtubeVideoUrl) data.append("youtubeVideoUrl", formData.youtubeVideoUrl);

      const contentToSend = JSON.parse(JSON.stringify(formData.content));
      let instrImgIdx = 0;
      const instrImgFilesToAppend: File[] = [];

      contentToSend.instructors = (contentToSend.instructors || []).map((inst: any, idx: number) => {
        if (inst.isNewImage && formData.instructorImageFiles[idx]) {
          instrImgFilesToAppend.push(formData.instructorImageFiles[idx]!);
          return { ...inst, image: "", isNewImage: true, tempImageIndex: instrImgIdx++ };
        }
        return { ...inst, isNewImage: undefined, tempImageIndex: undefined };
      });

      instrImgFilesToAppend.forEach((file) => data.append("instructorImages", file));

      const allMediaFiles = [...formData.galleryImages, ...formData.mediaFiles];
      allMediaFiles.forEach((file) => data.append("mediaFiles", file));

      const existingAssets = (contentToSend.mediaAssets || []).filter((a: any) => !a.isNew);
      const newAssetPlaceholders = allMediaFiles.map((file, index) => ({
        type: (file.type.startsWith("video") ? "video" : "image") as "image" | "video",
        src: "", poster: "", isNew: true, tempIndex: index,
      }));
      contentToSend.mediaAssets = [...existingAssets, ...newAssetPlaceholders];

      data.append("content", JSON.stringify(contentToSend));

      const response = await axios.post("/api/courses", data, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 300000,
      });
      return response.data;
    },
        onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      alert("Course created successfully!");
      setFormData({
        slug: "", title: { en: "", bn: "" }, category: "general", price: 0, originalPrice: 0,
        isPublished: false, thumbnail: null, youtubeVideoUrl: "",  // ✅ NEW
        instructorImageFiles: [], galleryImages: [], mediaFiles: [],
        content: getDefaultContent(),
      });
    },
    onError: (err: any) => {
      console.error("[Mutation] Error:", err);
      alert("Error: " + (err.response?.data?.message || err.message));
    },
  });

  // Gallery / Media handlers
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
        ...prev, mediaFiles: [...prev.mediaFiles, ...newFiles],
        content: { ...prev.content, mediaAssets: [...prev.content.mediaAssets, ...newAssets] },
      };
    });
    e.target.value = "";
  };

  const removeMediaAsset = (index: number) => {
    setFormData((prev) => {
      const asset = prev.content.mediaAssets[index];
      let newMediaFiles = [...prev.mediaFiles];
      if (asset?.isNew && asset.tempIndex !== undefined)
        newMediaFiles = newMediaFiles.filter((_, i) => i !== asset.tempIndex);
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

  // ====================================================================
  // RENDER
  // ====================================================================
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Course Dashboard</h1>
          <p className="text-gray-500 mt-1">Create bilingual courses with rich-text descriptions and select existing teachers as instructors.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-6">
          {/* SECTION 1: Basic Information */}
          <Section id="basic" title="Basic Information" number={1} defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Title (EN) *</label>
                <input value={formData.title.en} onChange={(e) => setFormData((p) => ({ ...p, title: { ...p.title, en: e.target.value } }))} className={inputClass} placeholder="Course Title (EN)" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">শিরোনাম (BN) *</label>
                <input value={formData.title.bn} onChange={(e) => setFormData((p) => ({ ...p, title: { ...p.title, bn: e.target.value } }))} className={inputClass} placeholder="কোর্সের নাম (বাংলা)" lang="bn" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Slug (URL)</label>
                <input value={formData.slug} onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") }))} className={inputClass} placeholder="kids-fluent-english" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Category</label>
                <select value={formData.category} onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))} className={inputClass}>
                  <option value="spoken-english">Spoken English</option>
                  <option value="art">Art & Drawing</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Price (BDT) *</label>
                <input type="number" value={formData.price || ""} onChange={(e) => setFormData((p) => ({ ...p, price: parseFloat(e.target.value) || 0 }))} className={inputClass} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Original Price</label>
                <input type="number" value={formData.originalPrice || ""} onChange={(e) => setFormData((p) => ({ ...p, originalPrice: parseFloat(e.target.value) || 0 }))} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Status</label>
                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 h-[46px]">
                  <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData((p) => ({ ...p, isPublished: e.target.checked }))} className="w-5 h-5 text-[#F3056D] rounded" />
                  <span className="text-sm font-medium">{formData.isPublished ? "Published" : "Draft"}</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Course Thumbnail *</label>
              <input type="file" onChange={(e) => setFormData((p) => ({ ...p, thumbnail: e.target.files?.[0] || null }))} className={fileClass} accept="image/*" required />
              {formData.thumbnail && <p className="text-xs text-green-600">✓ {formData.thumbnail.name}</p>}
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 bg-gray-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <ImageIcon className="w-5 h-5 text-[#F3056D]" />
                  <label className="text-sm font-bold uppercase tracking-wider">Gallery / Media Images</label>
                </div>
                <input type="file" multiple onChange={handleGalleryAdd} className={fileClass} accept="image/*,video/*" style={{ maxWidth: "300px" }} />
              </div>
              <p className="text-xs text-gray-500">Select multiple images/videos. They will automatically save into the <b>Media Assets</b> array.</p>
              {formData.galleryImages.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                  {formData.galleryImages.map((file, index) => (
                    <div key={index} className="relative group border rounded-xl overflow-hidden bg-white shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
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
            {/* ✅ NEW: YouTube Video URL */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#F3056D]" />
                Promotional YouTube Video URL
              </label>
              <input
                type="url"
                value={formData.youtubeVideoUrl}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, youtubeVideoUrl: e.target.value }))
                }
                className={inputClass}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-500">
                Paste a YouTube link (e.g., <code>https://www.youtube.com/watch?v=abc123</code> or <code>https://youtu.be/abc123</code>). It will be embedded on the course details page.
              </p>
              {formData.youtubeVideoUrl && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-700 font-semibold truncate">
                    ✓ {formData.youtubeVideoUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, youtubeVideoUrl: "" }))}
                    className="ml-auto text-xs text-red-500 hover:text-red-700 font-semibold"
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
            </div>
          </Section>

          {/* SECTION 2: Hero */}
          <Section id="hero" title="Hero Section" number={2} defaultOpen={true}>
            <BilingualInput label="Hero Title" path="hero.title" getVal={getVal} setVal={setVal} required placeholderEn="Kids Fluent English Course..." placeholderBn="KIDS' অনর্গল English..." />
            <BilingualInput label="Hero Subtitle" path="hero.subtitle" type="textarea" getVal={getVal} setVal={setVal} placeholderEn="Fluent English speaking with..." placeholderBn="শুদ্ধ উচ্চারণে অনর্গল..." />
            <BilingualInput label="Breadcrumb" path="breadcrumb" getVal={getVal} setVal={setVal} placeholderEn="Home, Courses, Kids English" placeholderBn="হোম, কোর্স, কিডস ইংরেজি" />
          </Section>

          {/* SECTION 3: Quick Info */}
          <Section id="quickInfo" title="Quick Info Section" number={3} defaultOpen={true}>
            <BilingualInput label="Section Title" path="quickInfo.title" getVal={getVal} setVal={setVal} placeholderEn="This course includes" placeholderBn="এই কোর্সে যা থাকে" />
            <BilingualArrayInput label="Info Items" path="quickInfo.items" placeholderEn="64 Live Classes" placeholderBn="৬৪ টি লাইভ ক্লাস" content={formData.content} updateContent={updateContent} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BilingualInput label="Offer Price" path="quickInfo.offerPrice" getVal={getVal} setVal={setVal} placeholderEn="৳ ১৮,০০০" />
              <BilingualInput label="CTA Button 1" path="quickInfo.cta1" getVal={getVal} setVal={setVal} placeholderEn="Enroll Now →" />
              <BilingualInput label="CTA Button 2" path="quickInfo.cta2" getVal={getVal} setVal={setVal} placeholderEn="Book a Free Demo →" />
            </div>
          </Section>

          {/* SECTION 4: Overview — ✅ USES QUILL */}
          <Section id="overview" title="Course Overview" number={4} defaultOpen={true}>
            <BilingualInput label="Section Title" path="overview.title" getVal={getVal} setVal={setVal} placeholderEn="Course Details" placeholderBn="কোর্স সম্পর্কে বিস্তারিত" />
            {/* ✅ QUILL EDITOR for rich-text overview content */}
            <BilingualQuillEditor
              label="Overview Content (Rich Text)"
              path="overview.content"
              getVal={getVal}
              setVal={setVal}
              placeholderEn="The Kids English Course is designed for..."
              placeholderBn="এই কোর্সটি ৬ থেকে ১১ বছর..."
            />
          </Section>

          {/* SECTION 5: Levels */}
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

          {/* SECTION 6: Who Is This For — ✅ USES QUILL for intro */}
          <Section id="whoIsThisFor" title="Who Is This For" number={6} defaultOpen={true}>
            <BilingualInput label="Section Title" path="whoIsThisFor.title" getVal={getVal} setVal={setVal} placeholderEn="Course is Designed For" placeholderBn="কোর্সটি যাদের জন্য" />
            {/* ✅ QUILL EDITOR for rich-text intro */}
            <BilingualQuillEditor
              label="Section Intro (Rich Text)"
              path="whoIsThisFor.intro"
              getVal={getVal}
              setVal={setVal}
              placeholderEn="Does your child relate to any of these?"
              placeholderBn="আপনার সন্তান কি এরকম?"
            />
            <BilingualArrayInput label="Target Items" path="whoIsThisFor.items" placeholderEn="Can't speak English..." placeholderBn="ইংলিশ একদমই বলতে পারে না..." content={formData.content} updateContent={updateContent} />
            <BilingualInput label="Bold Statement" path="whoIsThisFor.boldStatement" getVal={getVal} setVal={setVal} placeholderEn="This course was built exactly for your child." placeholderBn="তাহলে এই কোর্সটা ঠিক তার জন্যই।" />
          </Section>

          {/* SECTION 7: Features */}
          <Section id="features" title="Course Features" number={7} defaultOpen={true}>
            <BilingualInput label="Section Title" path="features.title" getVal={getVal} setVal={setVal} placeholderEn="Course Features" placeholderBn="কোর্সের ফিচার" />
            <FeatureCardsEditor content={formData.content} updateContent={updateContent} />
          </Section>

          {/* SECTION 8: INSTRUCTORS — ✅ WITH TEACHER SELECT DROPDOWN */}
          <Section id="instructors" title="Instructors" number={8} defaultOpen={true} icon={<Users className="w-5 h-5" />}>
            <BilingualInput label="Section Title" path="instructorsTitle" getVal={getVal} setVal={setVal} placeholderEn="Course Instructors" placeholderBn="কোর্স ইন্সট্রাক্টর" />

            {/* ✅ NEW: Teacher Select Dropdown */}
            <TeacherSelectDropdown
              existingInstructorNames={formData.content.instructors.map((i: any) => i.name)}
              onSelect={handleSelectTeacher}
            />

            {/* Instructor count badge + Add blank instructor button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-[#F3056D]/10 text-[#F3056D] text-xs font-bold px-3 py-1.5 rounded-full">
                  <Users className="w-3.5 h-3.5" />
                  {formData.content.instructors.length} Instructor{formData.content.instructors.length !== 1 ? "s" : ""} Added
                </span>
              </div>
              <button type="button" onClick={addInstructor} className="flex items-center gap-2 bg-white border-2 border-[#F3056D] text-[#F3056D] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#F3056D]/5 transition">
                <Plus className="w-4 h-4" /> Add Blank Instructor
              </button>
            </div>

            <p className="text-xs text-gray-500 bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <span className="font-bold text-blue-700">Tip:</span> Use the dropdown above to auto-fill from existing teacher profiles. Or click "Add Blank Instructor" to type manually.
            </p>

            <div className="space-y-6">
              {formData.content.instructors.map((instructor: any, index: number) => (
                <InstructorEditor
                  key={index}
                  index={index}
                  instructor={instructor}
                  formData={formData}
                  updateContent={updateContent}
                  getVal={getVal}
                  setVal={setVal}
                  onImageChange={handleInstructorImageChange}
                  onRemove={removeInstructor}
                  canRemove={formData.content.instructors.length > 1}
                />
              ))}
            </div>
          </Section>

          {/* SECTION 9: FAQ */}
          <Section id="faq" title="FAQ Section" number={9} defaultOpen={true}>
            <BilingualInput label="Section Title" path="faq.title" getVal={getVal} setVal={setVal} placeholderEn="Frequently Asked Questions" placeholderBn="সাধারণ জিজ্ঞাসা" />
            <FaqEditor content={formData.content} updateContent={updateContent} />
          </Section>

          {/* SECTION 10: Syllabus — ✅ USES QUILL */}
          <Section id="syllabus" title="Syllabus" number={10} defaultOpen={true}>
            <BilingualInput label="Title" path="syllabus.title" getVal={getVal} setVal={setVal} placeholderEn="Course Syllabus/Curriculum" placeholderBn="কোর্স সিলেবাস/কারিকুলাম" />
            {/* ✅ QUILL EDITOR for rich-text syllabus content */}
            <BilingualQuillEditor
              label="Syllabus Content (Rich Text)"
              path="syllabus.content"
              getVal={getVal}
              setVal={setVal}
              placeholderEn="Tab system with detailed curriculum..."
              placeholderBn="ট্যাব সিস্টেম সহ বিস্তারিত সিলেবাস..."
            />
          </Section>

          {/* SECTION 11: Final CTA */}
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

          {/* SECTION 12: Payment — ✅ USES QUILL */}
          <Section id="payment" title="Payment Section" number={12} defaultOpen={true}>
            <BilingualInput label="Title" path="payment.title" getVal={getVal} setVal={setVal} placeholderEn="Payment Process" placeholderBn="ভর্তি হওয়ার প্রক্রিয়া" />
            {/* ✅ QUILL EDITOR for rich-text payment description */}
            <BilingualQuillEditor
              label="Payment Description (Rich Text)"
              path="payment.description"
              getVal={getVal}
              setVal={setVal}
              placeholderEn="Watch this video to learn how to pay..."
              placeholderBn="কীভাবে পেমেন্ট করবেন..."
            />
          </Section>

          {/* SECTION 13: Review */}
          <Section id="review" title="Review Section" number={13} defaultOpen={true}>
            <BilingualInput label="Section Title" path="review.title" getVal={getVal} setVal={setVal} placeholderEn="Student Reviews" placeholderBn="শিক্ষার্থীদের মতামত" />
          </Section>

          {/* SECTION 14: Media Assets */}
          <Section id="media" title="Media Assets (Advanced / External URLs)" number={14} defaultOpen={true}>
            <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
              If you didn't use the Gallery box above, you can add external URLs or more files here.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-bold text-gray-700 mb-2 block">Upload More Files</label>
                <input type="file" multiple onChange={handleMediaFileAdd} className={fileClass} accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-bold text-gray-700 mb-2 block">Add External URL</label>
                <button type="button" onClick={() => { updateContent("mediaAssets", [...(formData.content.mediaAssets || []), { type: "image" as const, src: "", poster: "", isNew: false }]); }}
                  className="w-full h-[46px] border-2 border-dashed border-gray-300 rounded-xl text-sm font-bold text-gray-500 hover:border-[#F3056D] hover:text-[#F3056D] transition flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add External URL
                </button>
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
                        {asset.type === "video" ? (
                          <video src={previewUrl} className="w-full h-full object-contain" controls />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                        )}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Type</label>
                        <select value={asset.type} onChange={(e) => updateMediaAsset(index, "type", e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg text-sm bg-white">
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">{asset.isNew ? "Source (auto-replaced)" : "Source URL"}</label>
                        {asset.isNew ? (
                          <div className="w-full border border-gray-200 p-2 rounded-lg text-sm bg-gray-100 text-gray-500 flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Will be replaced with R2 URL
                          </div>
                        ) : (
                          <input value={asset.src || ""} onChange={(e) => updateMediaAsset(index, "src", e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg text-sm bg-white" placeholder="https://..." />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {formData.content.mediaAssets.length === 0 && (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No media assets added yet</p>
              </div>
            )}
          </Section>

          {/* SUBMIT BUTTONS */}
          <div className="flex justify-end gap-4 pt-6 pb-12">
            <button type="button" onClick={() => { if (confirm("Clear form?")) window.location.reload(); }} disabled={mutation.isPending}
              className="px-8 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold transition">
              Clear Form
            </button>
            <button type="submit" disabled={mutation.isPending}
              className={`px-10 py-3 rounded-xl font-bold flex items-center gap-2 text-white transition-all shadow-lg ${mutation.isPending ? "bg-gray-400 cursor-not-allowed" : "bg-[#F3056D] hover:bg-[#d9045c] shadow-[#F3056D]/30 hover:scale-[1.02] active:scale-95"}`}>
              {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {mutation.isPending ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}