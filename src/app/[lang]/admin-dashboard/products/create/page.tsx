"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import QuillEditor from "../../courses/create/QuillEditor";
import {
  Plus,
  Loader2,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Trash2,
  Globe,
  Package,
  ClipboardList,
  Target,
  GraduationCap,
  Dumbbell,
  Star,
  Gift,
  BookOpen,
  Palette,
  Trophy,
  Rocket,
  Lightbulb,
  Lock,
  Smartphone,
  Gamepad2,
  Puzzle,
  Pencil,
  Ruler,
  Backpack,
  type LucideIcon,
} from "lucide-react";

// ====================================================================
// CONSTANTS
// ====================================================================

const ICON_OPTIONS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "clipboard-list", label: "Clipboard List", icon: ClipboardList },
  { value: "target", label: "Target", icon: Target },
  { value: "graduation-cap", label: "Graduation Cap", icon: GraduationCap },
  { value: "dumbbell", label: "Dumbbell", icon: Dumbbell },
  { value: "star", label: "Star", icon: Star },
  { value: "gift", label: "Gift", icon: Gift },
  { value: "book-open", label: "Book Open", icon: BookOpen },
  { value: "palette", label: "Palette", icon: Palette },
  { value: "trophy", label: "Trophy", icon: Trophy },
  { value: "rocket", label: "Rocket", icon: Rocket },
  { value: "lightbulb", label: "Lightbulb", icon: Lightbulb },
  { value: "lock", label: "Lock", icon: Lock },
  { value: "smartphone", label: "Smartphone", icon: Smartphone },
  { value: "gamepad-2", label: "Gamepad", icon: Gamepad2 },
  { value: "puzzle", label: "Puzzle", icon: Puzzle },
  { value: "pencil", label: "Pencil", icon: Pencil },
  { value: "ruler", label: "Ruler", icon: Ruler },
  { value: "backpack", label: "Backpack", icon: Backpack },
];

const CATEGORIES = [
  { value: "book", label: "Book / eBook" },
  { value: "apparel", label: "Apparel / T-Shirt" },
  { value: "bags", label: "Bags" },
  { value: "stationary", label: "Stationary" },
];

// ====================================================================
// DEFAULT CONTENT — mirrors courses' getDefaultContent() pattern
// ====================================================================

const getDefaultContent = () => ({
  subtitle: { en: "", bn: "" },
  secondaryDesc: { en: "", bn: "" },
  highlights: { en: [] as string[], bn: [] as string[] },
  features: [] as {
    title: { en: string; bn: string };
    desc: { en: string; bn: string };
    icon: string;
  }[],
  whyPoints: { en: [] as string[], bn: [] as string[] },
  specs: [] as {
    label: { en: string; bn: string };
    value: { en: string; bn: string };
  }[],
  book: {
    author: { en: "", bn: "" },
    pages: "",
    publisher: { en: "", bn: "" },
    edition: { en: "", bn: "" },
    country: { en: "", bn: "" },
    language: { en: "", bn: "" },
  },
  bag: {
    material: { en: "", bn: "" },
    capacity: "",
    dimensions: "",
    compartments: 0,
  },
  apparel: {
    material: { en: "", bn: "" },
    fit: { en: "", bn: "" },
    sizes: "",
    colors: "",
  },
  stationary: {
    type: { en: "", bn: "" },
    color: "",
    packSize: "",
    material: { en: "", bn: "" },
  },
});

// ====================================================================
// SHARED STYLES — identical to courses page
// ====================================================================

const inputClass =
  "w-full border border-gray-300 p-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition-shadow bg-white text-sm";
const fileClass =
  "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F3056D]/10 file:text-[#F3056D] hover:file:bg-[#F3056D]/20 cursor-pointer";
const smInputClass =
  "w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none bg-white";

// ====================================================================
// SUB-COMPONENTS — identical pattern to courses page
// ====================================================================

function Section({
  id,
  title,
  number,
  children,
  defaultOpen = false,
}: {
  id: string;
  title: string;
  number: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
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
          {title}
        </h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isOpen && <div className="p-6 space-y-6 bg-white">{children}</div>}
    </div>
  );
}

function BilingualInput({
  label,
  path,
  type = "text",
  required = false,
  placeholderEn,
  placeholderBn,
  getVal,
  setVal,
}: {
  label: string;
  path: string;
  type?: string;
  required?: boolean;
  placeholderEn?: string;
  placeholderBn?: string;
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

function BilingualArrayInput({
  label,
  path,
  placeholderEn,
  placeholderBn,
  content,
  updateContent,
}: {
  label: string;
  path: string;
  placeholderEn?: string;
  placeholderBn?: string;
  content: any;
  updateContent: (p: string, v: any) => void;
}) {
  const items: any = path
    .split(".")
    .reduce((o: any, k: string) => o?.[k], content as any) || {
    en: [],
    bn: [],
  };
  const addItem = () =>
    updateContent(path, {
      en: [...(items.en || []), ""],
      bn: [...(items.bn || []), ""],
    });
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
        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          {label}
        </label>
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
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_40px] gap-2 items-start bg-gray-50 p-3 rounded-xl"
          >
            <input
              value={en}
              onChange={(e) => updateItem(i, "en", e.target.value)}
              className={`${inputClass} !py-2.5`}
              placeholder={placeholderEn}
            />
            <input
              value={items.bn?.[i] || ""}
              onChange={(e) => updateItem(i, "bn", e.target.value)}
              className={`${inputClass} !py-2.5`}
              placeholder={placeholderBn}
              lang="bn"
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="p-2 text-red-400 hover:text-red-600 rounded-lg transition mt-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ====================================================================
// FEATURE CARD EDITOR — with icon picker, matches courses' FeatureCardsEditor
// ====================================================================

function FeatureCardEditor({
  content,
  updateContent,
}: {
  content: any;
  updateContent: (path: string, val: any) => void;
}) {
  const addCard = () =>
    updateContent("features", [
      ...(content.features || []),
      {
        title: { en: "", bn: "" },
        desc: { en: "", bn: "" },
        icon: "clipboard-list",
      },
    ]);
  const removeCard = (i: number) =>
    updateContent(
      "features",
      content.features.filter((_: any, idx: number) => idx !== i),
    );
  const updateCardField = (
    i: number,
    field: string,
    lang: string,
    val: string,
  ) => {
    const newCards = [...(content.features || [])];
    newCards[i] = {
      ...newCards[i],
      [field]: { ...newCards[i][field], [lang]: val },
    };
    updateContent("features", newCards);
  };
  const updateCardIcon = (i: number, icon: string) => {
    const newCards = [...(content.features || [])];
    newCards[i] = { ...newCards[i], icon };
    updateContent("features", newCards);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={addCard}
        className="text-xs font-semibold bg-[#F3056D]/10 text-[#F3056D] px-3 py-1.5 rounded-lg hover:bg-[#F3056D]/20 transition flex items-center gap-1"
      >
        <Plus className="w-3 h-3" /> Add Feature Card
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(content.features || []).map((card: any, i: number) => (
          <div
            key={i}
            className="border border-gray-200 p-4 rounded-xl space-y-3 bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">
                Card #{i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeCard(i)}
                className="p-1 text-red-400 hover:text-red-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Icon Picker */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Icon
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ICON_OPTIONS.map((opt) => {
                  const OptIcon = opt.icon;
                  const isSelected = card.icon === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateCardIcon(i, opt.value)}
                      title={opt.label}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 transition-all hover:scale-110 ${
                        isSelected
                          ? "border-[#F3056D] bg-[#F3056D]/10 text-[#F3056D]"
                          : "border-gray-200 text-gray-300 hover:border-gray-300 hover:text-gray-500"
                      }`}
                    >
                      <OptIcon className="w-4 h-4" strokeWidth={2} />
                    </button>
                  );
                })}
              </div>
            </div>

            <input
              value={card.title?.en || ""}
              onChange={(e) =>
                updateCardField(i, "title", "en", e.target.value)
              }
              className={smInputClass}
              placeholder="Title (EN)"
            />
            <input
              value={card.title?.bn || ""}
              onChange={(e) =>
                updateCardField(i, "title", "bn", e.target.value)
              }
              className={smInputClass}
              placeholder="শিরোনাম (বাংলা)"
              lang="bn"
            />
            <textarea
              value={card.desc?.en || ""}
              onChange={(e) => updateCardField(i, "desc", "en", e.target.value)}
              className={`${smInputClass} min-h-[60px] resize-y`}
              placeholder="Description (EN)"
            />
            <textarea
              value={card.desc?.bn || ""}
              onChange={(e) => updateCardField(i, "desc", "bn", e.target.value)}
              className={`${smInputClass} min-h-[60px] resize-y`}
              placeholder="বিবরণ (বাংলা)"
              lang="bn"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ====================================================================
// SPEC EDITOR — matches courses' FaqEditor pattern
// ====================================================================

function SpecEditor({
  content,
  updateContent,
}: {
  content: any;
  updateContent: (path: string, val: any) => void;
}) {
  const addItem = () =>
    updateContent("specs", [
      ...(content.specs || []),
      { label: { en: "", bn: "" }, value: { en: "", bn: "" } },
    ]);
  const removeItem = (i: number) =>
    updateContent(
      "specs",
      content.specs.filter((_: any, idx: number) => idx !== i),
    );
  const updateItem = (i: number, field: string, lang: string, val: string) => {
    const newItems = [...(content.specs || [])];
    newItems[i] = {
      ...newItems[i],
      [field]: { ...newItems[i][field], [lang]: val },
    };
    updateContent("specs", newItems);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={addItem}
        className="text-xs font-semibold bg-[#F3056D]/10 text-[#F3056D] px-3 py-1.5 rounded-lg hover:bg-[#F3056D]/20 transition flex items-center gap-1"
      >
        <Plus className="w-3 h-3" /> Add Specification
      </button>
      <div className="space-y-3">
        {(content.specs || []).map((item: any, i: number) => (
          <div
            key={i}
            className="border border-gray-200 p-4 rounded-xl space-y-3 bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">
                Spec #{i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="p-1 text-red-400 hover:text-red-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-[#214187]">
                  Label (EN)
                </label>
                <input
                  value={item.label?.en || ""}
                  onChange={(e) => updateItem(i, "label", "en", e.target.value)}
                  className={smInputClass}
                  placeholder="e.g. Type"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#F3056D]">
                  লেবেল (বাংলা)
                </label>
                <input
                  value={item.label?.bn || ""}
                  onChange={(e) => updateItem(i, "label", "bn", e.target.value)}
                  className={smInputClass}
                  placeholder="যেমন ধরন"
                  lang="bn"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-[#214187]">
                  Value (EN)
                </label>
                <input
                  value={item.value?.en || ""}
                  onChange={(e) => updateItem(i, "value", "en", e.target.value)}
                  className={smInputClass}
                  placeholder="e.g. School Bag"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#F3056D]">
                  মান (বাংলা)
                </label>
                <input
                  value={item.value?.bn || ""}
                  onChange={(e) => updateItem(i, "value", "bn", e.target.value)}
                  className={smInputClass}
                  placeholder="যেমন স্কুল ব্যাগ"
                  lang="bn"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ====================================================================
// SLUG HELPER
// ====================================================================

const getSlugPreview = (val: string) =>
  val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

// ====================================================================
// MAIN COMPONENT — matches courses' CoursesClient pattern exactly
// ====================================================================

export default function CreateProductPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    slug: "",
    title: { en: "", bn: "" },
    category: "book",
    fee: 0,
    originalFee: 0,
    badge: "",
    sortOrder: 0,
    image: null as File | null,
    contentEn: "",
    contentBn: "",
    content: getDefaultContent(),
  });

  // ----------------------------------------------------------------
  // HELPERS — identical to courses page
  // ----------------------------------------------------------------

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

  // ----------------------------------------------------------------
  // MUTATION — matches courses' mutation pattern
  // ----------------------------------------------------------------

  const mutation = useMutation({
    mutationFn: async () => {
      const c = formData.content;
      const data = new FormData();

      const finalSlug = formData.slug || getSlugPreview(formData.title.en);

      data.append("slug", finalSlug);
      data.append("title", JSON.stringify(formData.title));
      data.append("category", formData.category);
      data.append("fee", (formData.fee || 0).toString());
      if (formData.originalFee)
        data.append("originalFee", formData.originalFee.toString());
      if (formData.badge) data.append("badge", formData.badge);
      data.append("sortOrder", (formData.sortOrder || 0).toString());
      data.append("subtitle", JSON.stringify(c.subtitle));

      // Convert { en: [], bn: [] } arrays → [{ en, bn }, ...]
      const highlightsArray = (c.highlights.en || []).map(
        (en: string, i: number) => ({
          en,
          bn: c.highlights.bn?.[i] || "",
        }),
      );
      data.append("highlights", JSON.stringify(highlightsArray));
      data.append("features", JSON.stringify(c.features || []));

      const whyPointsArray = (c.whyPoints.en || []).map(
        (en: string, i: number) => ({
          en,
          bn: c.whyPoints.bn?.[i] || "",
        }),
      );
      data.append("whyPoints", JSON.stringify(whyPointsArray));
      data.append("specs", JSON.stringify(c.specs || []));

      data.append("contentEn", formData.contentEn);
      data.append("contentBn", formData.contentBn);
      data.append("secondaryDescEn", c.secondaryDesc?.en || "");
      data.append("secondaryDescBn", c.secondaryDesc?.bn || "");

      if (formData.image) data.append("image", formData.image);

      // Category-specific fields
      if (formData.category === "book") {
        data.append("pages", c.book?.pages || "");
        data.append("author", JSON.stringify(c.book?.author || {}));
        data.append("publisher", JSON.stringify(c.book?.publisher || {}));
        data.append("edition", JSON.stringify(c.book?.edition || {}));
        data.append("country", JSON.stringify(c.book?.country || {}));
        data.append("language", JSON.stringify(c.book?.language || {}));
      } else if (formData.category === "bags") {
        data.append("bagMaterial", JSON.stringify(c.bag?.material || {}));
        data.append("bagCapacity", c.bag?.capacity || "");
        data.append("bagDimensions", c.bag?.dimensions || "");
        data.append("bagCompartments", (c.bag?.compartments || 0).toString());
      } else if (formData.category === "apparel") {
        data.append(
          "apparelMaterial",
          JSON.stringify(c.apparel?.material || {}),
        );
        data.append("apparelFit", JSON.stringify(c.apparel?.fit || {}));
        data.append("apparelSizes", c.apparel?.sizes || "");
        data.append("apparelColors", c.apparel?.colors || "");
      } else if (formData.category === "stationary") {
        data.append("stationaryType", JSON.stringify(c.stationary?.type || {}));
        data.append("stationaryColor", c.stationary?.color || "");
        data.append("stationaryPackSize", c.stationary?.packSize || "");
        data.append(
          "stationaryMaterial",
          JSON.stringify(c.stationary?.material || {}),
        );
      }

      // ✅ PROOF: Log what is ACTUALLY being sent to the backend
      console.log("=== SENDING PRODUCT TO BACKEND ===");
      console.log("Title:", formData.title);
      console.log("Slug:", finalSlug);
      console.log("Category:", formData.category);
      console.log("Features count:", (c.features || []).length);
      console.log("Specs count:", (c.specs || []).length);
      console.log("Highlights count:", highlightsArray.length);
      console.log("WhyPoints count:", whyPointsArray.length);

      const response = await axios.post("/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 180000,
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      alert("Product created successfully!");
      setFormData({
        slug: "",
        title: { en: "", bn: "" },
        category: "book",
        fee: 0,
        originalFee: 0,
        badge: "",
        sortOrder: 0,
        image: null,
        contentEn: "",
        contentBn: "",
        content: getDefaultContent(),
      });
    },
    onError: (err: any) => {
      console.error("[Mutation] Error:", err);
      alert("Error: " + (err.response?.data?.message || err.message));
    },
  });

  // ----------------------------------------------------------------
  // RENDER — identical layout structure to courses page
  // ----------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header — same as courses */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Product Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Create bilingual products with category-specific details.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-6"
        >
          {/* ============================================================
              SECTION 1 — BASIC INFORMATION
              ============================================================ */}
          <Section
            id="basic"
            title="Basic Information"
            number={1}
            defaultOpen={true}
          >
            {/* Title EN/BN — top-level field like courses' title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Product Title (EN) <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.title.en}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      title: { ...p.title, en: e.target.value },
                    }))
                  }
                  className={inputClass}
                  placeholder="Product title in English"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  প্রোডাক্টের নাম (BN)
                </label>
                <input
                  value={formData.title.bn}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      title: { ...p.title, bn: e.target.value },
                    }))
                  }
                  className={inputClass}
                  placeholder="প্রোডাক্টের নাম বাংলায়"
                  lang="bn"
                />
              </div>
            </div>

            {/* Slug — same pattern as courses' slug input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Slug (URL)
              </label>
              <input
                value={formData.slug}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-"),
                  }))
                }
                className={inputClass}
                placeholder="my-product-name"
              />
              <p className="text-xs text-gray-400">
                Leave empty to auto-generate from English title.
              </p>
              {formData.title.en && (
                <p className="text-xs text-blue-500 font-mono break-all">
                  Preview: /products/
                  {getSlugPreview(formData.title.en)}
                </p>
              )}
            </div>

            {/* Category, Price, Original Price — same grid as courses */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      category: e.target.value,
                    }))
                  }
                  className={inputClass}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Price (BDT) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.fee || ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      fee: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className={inputClass}
                  placeholder="550"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Original Price
                </label>
                <input
                  type="number"
                  value={formData.originalFee || ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      originalFee: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className={inputClass}
                  placeholder="800 (optional)"
                />
              </div>
            </div>

            {/* Badge & Sort Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Badge
                </label>
                <input
                  value={formData.badge}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      badge: e.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder='e.g. "Best Seller"'
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder || ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      sortOrder: parseInt(e.target.value) || 0,
                    }))
                  }
                  className={inputClass}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Product Image — same file pattern as courses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Product Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      image: e.target.files?.[0] || null,
                    }))
                  }
                  className={fileClass}
                  accept="image/*"
                  required
                />
                {formData.image && (
                  <p className="text-xs text-green-600">
                    ✓ {formData.image.name}
                  </p>
                )}
              </div>
            </div>

            {/* Image Preview — same gallery pattern as courses */}
            {formData.image && (
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 bg-gray-50/50">
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <ImageIcon className="w-5 h-5 text-[#F3056D]" />
                  <label className="text-sm font-bold uppercase tracking-wider">
                    Image Preview
                  </label>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  <div className="relative group border rounded-xl overflow-hidden bg-white shadow-sm">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Product preview"
                      className="w-full h-32 object-cover"
                    />
                    <p className="text-[10px] text-gray-500 p-1.5 truncate bg-white">
                      {formData.image.name}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Section>

          {/* ============================================================
              SECTION 2 — SUBTITLE
              ============================================================ */}
          <Section id="subtitle" title="Subtitle" number={2} defaultOpen={true}>
            <BilingualInput
              label="Product Subtitle"
              path="subtitle"
              getVal={getVal}
              setVal={setVal}
              placeholderEn="Book + eBook"
              placeholderBn="বই + ই-বুক"
            />
          </Section>

          {/* ============================================================
              SECTION 3 — MAIN DESCRIPTION (Rich Text)
              ============================================================ */}
          <Section
            id="description"
            title="Main Description (Rich Text)"
            number={3}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#214187] flex items-center gap-1">
                  <Globe className="w-3 h-3" /> EN — Rich Text
                </span>
                <QuillEditor
                  value={formData.contentEn}
                  onChange={(val: string) =>
                    setFormData((p) => ({ ...p, contentEn: val }))
                  }
                  placeholder="Type in English..."
                />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#F3056D] flex items-center gap-1">
                  <Globe className="w-3 h-3" /> বাংলা — রিচ টেক্সট
                </span>
                <QuillEditor
                  value={formData.contentBn}
                  onChange={(val: string) =>
                    setFormData((p) => ({ ...p, contentBn: val }))
                  }
                  placeholder="বাংলায় লিখুন..."
                />
              </div>
            </div>
          </Section>

          {/* ============================================================
              SECTION 4 — SECONDARY DESCRIPTION
              ============================================================ */}
          <Section
            id="secondaryDesc"
            title="Secondary Description"
            number={4}
            defaultOpen={true}
          >
            <BilingualInput
              label="Secondary Description"
              path="secondaryDesc"
              type="textarea"
              getVal={getVal}
              setVal={setVal}
              placeholderEn="Additional description in English..."
              placeholderBn="বাংলায় অতিরিক্ত বিবরণ..."
            />
          </Section>

          {/* ============================================================
              SECTION 5 — HIGHLIGHTS
              ============================================================ */}
          <Section
            id="highlights"
            title="Highlights"
            number={5}
            defaultOpen={true}
          >
            <BilingualArrayInput
              label="Highlight Items"
              path="highlights"
              placeholderEn="e.g. Step-by-step lessons"
              placeholderBn="যেমন ধাপে ধাপে সাজানো লেসন"
              content={formData.content}
              updateContent={updateContent}
            />
          </Section>

          {/* ============================================================
              SECTION 6 — FEATURES
              ============================================================ */}
          <Section id="features" title="Features" number={6} defaultOpen={true}>
            <FeatureCardEditor
              content={formData.content}
              updateContent={updateContent}
            />
          </Section>

          {/* ============================================================
              SECTION 7 — WHY THIS IS SPECIAL
              ============================================================ */}
          <Section
            id="whyPoints"
            title="Why This Is Special"
            number={7}
            defaultOpen={true}
          >
            <BilingualArrayInput
              label="Why Points"
              path="whyPoints"
              placeholderEn="Why point in English..."
              placeholderBn="কেন স্পেশাল পয়েন্ট বাংলায়..."
              content={formData.content}
              updateContent={updateContent}
            />
          </Section>

          {/* ============================================================
              SECTION 8 — SPECIFICATIONS
              ============================================================ */}
          <Section
            id="specs"
            title="Specifications"
            number={8}
            defaultOpen={true}
          >
            <SpecEditor
              content={formData.content}
              updateContent={updateContent}
            />
          </Section>

          {/* ============================================================
              SECTION 9 — CATEGORY-SPECIFIC DETAILS
              ============================================================ */}

          {/* BOOK */}
          {formData.category === "book" && (
            <Section
              id="bookDetails"
              title="Book Details"
              number={9}
              defaultOpen={true}
            >
              <BilingualInput
                label="Author"
                path="book.author"
                getVal={getVal}
                setVal={setVal}
                placeholderEn="Author name"
                placeholderBn="লেখকের নাম"
              />
              <BilingualInput
                label="Publisher"
                path="book.publisher"
                getVal={getVal}
                setVal={setVal}
                placeholderEn="Publisher name"
                placeholderBn="প্রকাশকের নাম"
              />
              <BilingualInput
                label="Edition"
                path="book.edition"
                getVal={getVal}
                setVal={setVal}
                placeholderEn="1st Edition"
                placeholderBn="১ম সংস্করণ"
              />
              <BilingualInput
                label="Country"
                path="book.country"
                getVal={getVal}
                setVal={setVal}
                placeholderEn="Bangladesh"
                placeholderBn="বাংলাদেশ"
              />
              <BilingualInput
                label="Language"
                path="book.language"
                getVal={getVal}
                setVal={setVal}
                placeholderEn="Bangla"
                placeholderBn="বাংলা"
              />
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Pages
                </label>
                <input
                  value={formData.content.book.pages}
                  onChange={(e) => updateContent("book.pages", e.target.value)}
                  className={inputClass}
                  placeholder="120"
                />
              </div>
            </Section>
          )}

          {/* BAGS */}
          {formData.category === "bags" && (
            <Section
              id="bagDetails"
              title="Bag Details"
              number={9}
              defaultOpen={true}
            >
              <BilingualInput
                label="Material"
                path="bag.material"
                getVal={getVal}
                setVal={setVal}
                placeholderEn="Material (e.g. Canvas, Leather)"
                placeholderBn="উপাদান (যেমন ক্যানভাস, চামড়া)"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Capacity
                  </label>
                  <input
                    value={formData.content.bag.capacity}
                    onChange={(e) =>
                      updateContent("bag.capacity", e.target.value)
                    }
                    className={inputClass}
                    placeholder="e.g. 25L"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Dimensions (L×W×H)
                  </label>
                  <input
                    value={formData.content.bag.dimensions}
                    onChange={(e) =>
                      updateContent("bag.dimensions", e.target.value)
                    }
                    className={inputClass}
                    placeholder="40x30x15 cm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Compartments
                  </label>
                  <input
                    type="number"
                    value={formData.content.bag.compartments || ""}
                    onChange={(e) =>
                      updateContent(
                        "bag.compartments",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className={inputClass}
                    placeholder="3"
                  />
                </div>
              </div>
            </Section>
          )}

          {/* APPAREL */}
          {formData.category === "apparel" && (
            <Section
              id="apparelDetails"
              title="Apparel / T-Shirt Details"
              number={9}
              defaultOpen={true}
            >
              <BilingualInput
                label="Material / Fabric"
                path="apparel.material"
                getVal={getVal}
                setVal={setVal}
                placeholderEn="Fabric (e.g. 100% Cotton)"
                placeholderBn="ফেব্রিক (যেমন ১০০% কটন)"
              />
              <BilingualInput
                label="Fit Type"
                path="apparel.fit"
                getVal={getVal}
                setVal={setVal}
                placeholderEn="Fit Type (e.g. Regular Fit)"
                placeholderBn="ফিট টাইপ (যেমন রেগুলার ফিট)"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Available Sizes
                  </label>
                  <input
                    value={formData.content.apparel.sizes}
                    onChange={(e) =>
                      updateContent("apparel.sizes", e.target.value)
                    }
                    className={inputClass}
                    placeholder="S, M, L, XL, XXL"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Available Colors
                  </label>
                  <input
                    value={formData.content.apparel.colors}
                    onChange={(e) =>
                      updateContent("apparel.colors", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Red, Blue, Black, White"
                  />
                </div>
              </div>
            </Section>
          )}

          {/* STATIONARY */}
          {formData.category === "stationary" && (
            <Section
              id="stationaryDetails"
              title="Stationary Details"
              number={9}
              defaultOpen={true}
            >
              <BilingualInput
                label="Type"
                path="stationary.type"
                getVal={getVal}
                setVal={setVal}
                placeholderEn="Type (e.g. Notebook, Pen Set)"
                placeholderBn="ধরন (যেমন নোটবুক, কলম সেট)"
              />
              <BilingualInput
                label="Material"
                path="stationary.material"
                getVal={getVal}
                setVal={setVal}
                placeholderEn="Material (e.g. Premium Paper)"
                placeholderBn="উপাদান (যেমন প্রিমিয়াম কাগজ)"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Color
                  </label>
                  <input
                    value={formData.content.stationary.color}
                    onChange={(e) =>
                      updateContent("stationary.color", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Blue, Black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Pack Size
                  </label>
                  <input
                    value={formData.content.stationary.packSize}
                    onChange={(e) =>
                      updateContent("stationary.packSize", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Pack of 5"
                  />
                </div>
              </div>
            </Section>
          )}

          {/* ============================================================
              SUBMIT BUTTONS — identical to courses page
              ============================================================ */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => {
                if (confirm("Clear form?")) window.location.reload();
              }}
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
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#F3056D] hover:bg-[#d9045c] shadow-[#F3056D]/30 hover:scale-[1.02] active:scale-95"
              }`}
            >
              {mutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              {mutation.isPending ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
