"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useParams } from "next/navigation";
import Link from "next/link";
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
  Edit3,
  Eye,
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
// DEFAULT CONTENT
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

const getDefaultFormData = () => ({
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

// ====================================================================
// SHARED STYLES — text-gray-900 → text-gray-800
// ====================================================================

const inputClass =
  "w-full border border-gray-300 p-3 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition-shadow bg-white text-sm";
const fileClass =
  "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F3056D]/10 file:text-[#F3056D] hover:file:bg-[#F3056D]/20 cursor-pointer";
const smInputClass =
  "w-full border border-gray-300 p-2.5 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none bg-white";

// ====================================================================
// DATA PARSING HELPERS
// ====================================================================

const parseBilingual = (val: any): { en: string; bn: string } => {
  if (!val) return { en: "", bn: "" };
  if (typeof val === "object" && "en" in val && "bn" in val) return val;
  try {
    const parsed = JSON.parse(val);
    if (parsed && typeof parsed === "object" && "en" in parsed) return parsed;
  } catch {}
  return { en: String(val), bn: "" };
};

const parseBilingualToEnBnArrays = (
  arr: any[],
): { en: string[]; bn: string[] } => {
  if (!arr || arr.length === 0) return { en: [], bn: [] };
  return {
    en: arr.map((item: any) =>
      typeof item === "object" ? item.en || "" : String(item),
    ),
    bn: arr.map((item: any) => (typeof item === "object" ? item.bn || "" : "")),
  };
};

const getSlugPreview = (val: string) =>
  val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

// ====================================================================
// SUB-COMPONENTS
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
        className="w-full flex justify-between items-center p-4 bg-gray-50/80 hover:bg-gray-100 transition text-left"
      >
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-3">
          <span className="w-7 h-7 bg-[#F3056D] text-white rounded-lg flex items-center justify-center text-xs font-bold">
            {number}
          </span>
          {title}
        </h3>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isOpen && <div className="p-5 space-y-5 bg-white">{children}</div>}
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
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#214187] flex items-center gap-1">
            <Globe className="w-3 h-3" /> EN
          </span>
          {type === "textarea" ? (
            <textarea
              value={getVal(path, "en")}
              onChange={(e) => setVal(path, "en", e.target.value)}
              className={`${inputClass} !p-2.5 min-h-[80px] resize-y text-sm`}
              placeholder={placeholderEn}
              required={required}
            />
          ) : (
            <input
              type={type}
              value={getVal(path, "en")}
              onChange={(e) => setVal(path, "en", e.target.value)}
              className={`${inputClass} !p-2.5 text-sm`}
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
              className={`${inputClass} !p-2.5 min-h-[80px] resize-y text-sm`}
              placeholder={placeholderBn}
              required={required}
              lang="bn"
            />
          ) : (
            <input
              type={type}
              value={getVal(path, "bn")}
              onChange={(e) => setVal(path, "bn", e.target.value)}
              className={`${inputClass} !p-2.5 text-sm`}
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
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
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
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_36px] gap-2 items-start bg-gray-50 p-2.5 rounded-xl"
          >
            <input
              value={en}
              onChange={(e) => updateItem(i, "en", e.target.value)}
              className={`${smInputClass} !p-2`}
              placeholder={placeholderEn}
            />
            <input
              value={items.bn?.[i] || ""}
              onChange={(e) => updateItem(i, "bn", e.target.value)}
              className={`${smInputClass} !p-2`}
              placeholder={placeholderBn}
              lang="bn"
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="p-1.5 text-red-400 hover:text-red-600 rounded-lg transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(content.features || []).map((card: any, i: number) => (
          <div
            key={i}
            className="border border-gray-200 p-3 rounded-xl space-y-2.5 bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500">
                Card #{i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeCard(i)}
                className="p-1 text-red-400 hover:text-red-600 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                Icon
              </span>
              <div className="flex flex-wrap gap-1">
                {ICON_OPTIONS.map((opt) => {
                  const OptIcon = opt.icon;
                  const isSelected = card.icon === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateCardIcon(i, opt.value)}
                      title={opt.label}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg border-2 transition-all hover:scale-110 ${isSelected ? "border-[#F3056D] bg-[#F3056D]/10 text-[#F3056D]" : "border-gray-200 text-gray-300 hover:border-gray-300 hover:text-gray-500"}`}
                    >
                      <OptIcon className="w-3.5 h-3.5" strokeWidth={2} />
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
              className={`${smInputClass} min-h-[50px] resize-y`}
              placeholder="Description (EN)"
            />
            <textarea
              value={card.desc?.bn || ""}
              onChange={(e) => updateCardField(i, "desc", "bn", e.target.value)}
              className={`${smInputClass} min-h-[50px] resize-y`}
              placeholder="বিবরণ (বাংলা)"
              lang="bn"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <div className="space-y-2">
        {(content.specs || []).map((item: any, i: number) => (
          <div
            key={i}
            className="border border-gray-200 p-3 rounded-xl space-y-2.5 bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500">
                Spec #{i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="p-1 text-red-400 hover:text-red-600 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-[#214187]">
                  Label (EN)
                </label>
                <input
                  value={item.label?.en || ""}
                  onChange={(e) => updateItem(i, "label", "en", e.target.value)}
                  className={smInputClass}
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
                  lang="bn"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-[#214187]">
                  Value (EN)
                </label>
                <input
                  value={item.value?.en || ""}
                  onChange={(e) => updateItem(i, "value", "en", e.target.value)}
                  className={smInputClass}
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
// MAIN COMPONENT
// ====================================================================

export default function ProductsListPage() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState(getDefaultFormData());

  // ----------------------------------------------------------------
  // HELPERS
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
  // POPULATE FORM FROM EXISTING PRODUCT
  // ----------------------------------------------------------------

  const populateForm = (product: any) => {
    const highlightsArr = parseBilingualToEnBnArrays(product.highlights);
    const whyPointsArr = parseBilingualToEnBnArrays(product.whyPoints);
    const parsedFeatures = (product.features || []).map((f: any) => ({
      title: parseBilingual(f.title),
      desc: parseBilingual(f.desc),
      icon: f.icon || "clipboard-list",
    }));
    const parsedSpecs = (product.specs || []).map((s: any) => ({
      label: parseBilingual(s.label),
      value: parseBilingual(s.value),
    }));

    setFormData({
      slug: product.slug || "",
      title: parseBilingual(product.title),
      category: product.category || "book",
      fee: product.fee || 0,
      originalFee: product.originalFee || 0,
      badge: product.badge || "",
      sortOrder: product.sortOrder || 0,
      image: null,
      contentEn: product.description?.en || "",
      contentBn: product.description?.bn || "",
      content: {
        subtitle: parseBilingual(product.subtitle),
        secondaryDesc: parseBilingual(product.secondaryDescription),
        highlights: highlightsArr,
        features: parsedFeatures,
        whyPoints: whyPointsArr,
        specs: parsedSpecs,
        book: {
          author: parseBilingual(product.author),
          pages: product.pages || "",
          publisher: parseBilingual(product.publisher),
          edition: parseBilingual(product.edition),
          country: parseBilingual(product.country),
          language: parseBilingual(product.language),
        },
        bag: {
          material: parseBilingual(product.bagMaterial),
          capacity: product.bagCapacity || "",
          dimensions: product.bagDimensions || "",
          compartments: product.bagCompartments || 0,
        },
        apparel: {
          material: parseBilingual(product.apparelMaterial),
          fit: parseBilingual(product.apparelFit),
          sizes: product.apparelSizes || "",
          colors: product.apparelColors || "",
        },
        stationary: {
          type: parseBilingual(product.stationaryType),
          color: product.stationaryColor || "",
          packSize: product.stationaryPackSize || "",
          material: parseBilingual(product.stationaryMaterial),
        },
      },
    });
  };

  // ----------------------------------------------------------------
  // QUERIES & MUTATIONS
  // ----------------------------------------------------------------

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => (await axios.get("/api/products")).data,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      (await axios.delete(`/api/products/${id}`)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
    onError: (err: any) =>
      alert("Error: " + (err.response?.data?.message || err.message)),
  });

  const saveMutation = useMutation({
    mutationFn: async ({
      formData: fd,
      id,
    }: {
      formData: FormData;
      id?: string;
    }) => {
      if (id)
        return (
          await axios.put(`/api/products/${id}`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 180000,
          })
        ).data;
      return (
        await axios.post("/api/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 180000,
        })
      ).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      alert(
        editingProduct
          ? "Product Updated Successfully!"
          : "Product Created Successfully!",
      );
      handleCloseModal();
    },
    onError: (err: any) =>
      alert("Error: " + (err.response?.data?.message || err.message)),
  });

  // ----------------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------------

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(getDefaultFormData());
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product);
    populateForm(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(getDefaultFormData());
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  };

  // ----------------------------------------------------------------
  // BUILD FORM DATA FOR SUBMIT
  // ----------------------------------------------------------------

  const buildFormData = (): FormData => {
    const c = formData.content;
    const fd = new FormData();

    const finalSlug = formData.slug || getSlugPreview(formData.title.en);
    fd.append("slug", finalSlug);
    fd.append("title", JSON.stringify(formData.title));
    fd.append("category", formData.category);
    fd.append("fee", (formData.fee || 0).toString());
    if (formData.originalFee)
      fd.append("originalFee", formData.originalFee.toString());
    if (formData.badge) fd.append("badge", formData.badge);
    fd.append("sortOrder", (formData.sortOrder || 0).toString());
    fd.append("subtitle", JSON.stringify(c.subtitle));

    const highlightsArray = (c.highlights.en || []).map(
      (en: string, i: number) => ({ en, bn: c.highlights.bn?.[i] || "" }),
    );
    fd.append("highlights", JSON.stringify(highlightsArray));
    fd.append("features", JSON.stringify(c.features || []));

    const whyPointsArray = (c.whyPoints.en || []).map(
      (en: string, i: number) => ({ en, bn: c.whyPoints.bn?.[i] || "" }),
    );
    fd.append("whyPoints", JSON.stringify(whyPointsArray));
    fd.append("specs", JSON.stringify(c.specs || []));

    fd.append("contentEn", formData.contentEn);
    fd.append("contentBn", formData.contentBn);
    fd.append("secondaryDescEn", c.secondaryDesc?.en || "");
    fd.append("secondaryDescBn", c.secondaryDesc?.bn || "");

    if (formData.image) fd.append("image", formData.image);

    if (formData.category === "book") {
      fd.append("pages", c.book?.pages || "");
      fd.append("author", JSON.stringify(c.book?.author || {}));
      fd.append("publisher", JSON.stringify(c.book?.publisher || {}));
      fd.append("edition", JSON.stringify(c.book?.edition || {}));
      fd.append("country", JSON.stringify(c.book?.country || {}));
      fd.append("language", JSON.stringify(c.book?.language || {}));
    } else if (formData.category === "bags") {
      fd.append("bagMaterial", JSON.stringify(c.bag?.material || {}));
      fd.append("bagCapacity", c.bag?.capacity || "");
      fd.append("bagDimensions", c.bag?.dimensions || "");
      fd.append("bagCompartments", (c.bag?.compartments || 0).toString());
    } else if (formData.category === "apparel") {
      fd.append("apparelMaterial", JSON.stringify(c.apparel?.material || {}));
      fd.append("apparelFit", JSON.stringify(c.apparel?.fit || {}));
      fd.append("apparelSizes", c.apparel?.sizes || "");
      fd.append("apparelColors", c.apparel?.colors || "");
    } else if (formData.category === "stationary") {
      fd.append("stationaryType", JSON.stringify(c.stationary?.type || {}));
      fd.append("stationaryColor", c.stationary?.color || "");
      fd.append("stationaryPackSize", c.stationary?.packSize || "");
      fd.append(
        "stationaryMaterial",
        JSON.stringify(c.stationary?.material || {}),
      );
    }

    return fd;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ formData: buildFormData(), id: editingProduct?._id });
  };

  // ----------------------------------------------------------------
  // TABLE DATA
  // ----------------------------------------------------------------

  const products = data?.data || [];
  const publishedCount = products.filter((p: any) => p.isPublished).length;

  // ====================================================================
  // RENDER
  // ====================================================================

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* --- HEADER --- */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F3056D]/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#F3056D]" />
                </div>
                Product Dashboard
              </h1>
              <p className="text-gray-500 mt-1 ml-[52px]">
                {products.length} total &middot; {publishedCount} published
              </p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 bg-[#F3056D] hover:bg-[#d9045c] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#F3056D]/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-5 h-5" /> Create Product
            </button>
          </div>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#F3056D]" />
              <p className="text-sm text-gray-400">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Package className="w-12 h-12 text-gray-300" />
              <p className="text-gray-500">No products found.</p>
              <button
                onClick={handleOpenCreate}
                className="text-sm font-semibold text-[#F3056D] hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Create your first product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product: any) => {
                    const title = parseBilingual(product.title);
                    const imageUrl = product.image
                      ? product.image.startsWith("http")
                        ? product.image
                        : `https://${product.image}`
                      : null;
                    return (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50/80 transition-colors group"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={title.en}
                                className="w-14 h-14 object-cover rounded-xl border shadow-sm"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate max-w-[260px]">
                                {title.en || "Untitled"}
                              </p>
                              {title.bn && (
                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[260px]">
                                  {title.bn}
                                </p>
                              )}
                              {product.slug && (
                                <p className="text-[10px] text-blue-400 font-mono mt-0.5 truncate max-w-[260px]">
                                  /{product.slug}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#214187]/10 text-[#214187] uppercase">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-gray-900">
                            ৳{product.fee}
                          </span>
                          {product.originalFee > product.fee && (
                            <span className="text-xs text-gray-400 line-through ml-2">
                              ৳{product.originalFee}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg ${product.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-2 ${product.isPublished ? "bg-emerald-500" : "bg-amber-500"}`}
                            />
                            {product.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`?id=${product._id}`}
                              className="p-2.5 text-gray-500 hover:text-[#214187] hover:bg-[#214187]/5 rounded-lg"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleOpenEdit(product)}
                              className="p-2.5 text-gray-500 hover:text-[#F3056D] hover:bg-[#F3056D]/5 rounded-lg"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(product._id, title.en)
                              }
                              disabled={deleteMutation.isPending}
                              className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40"
                            >
                              {deleteMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ====================================================================
          MODAL
          ==================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center overflow-y-auto py-6 px-4">
          <div className="relative bg-[#F9FAFB] w-full max-w-5xl my-auto rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
            {/* Modal Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-5 bg-white border-b border-gray-200">
              <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F3056D]/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-[#F3056D]" />
                </div>
                {editingProduct ? "Edit Product" : "Create New Product"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* SECTION 1 — BASIC INFO */}
                <Section
                  id="basic"
                  title="Basic Information"
                  number={1}
                  defaultOpen={true}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#214187] flex items-center gap-1">
                        <Globe className="w-3 h-3" /> EN
                      </span>
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
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#F3056D] flex items-center gap-1">
                        <Globe className="w-3 h-3" /> বাংলা
                      </span>
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
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      URL Slug
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
                    {formData.title.en && (
                      <p className="text-[10px] text-blue-500 font-mono break-all">
                        Preview: /products/{getSlugPreview(formData.title.en)}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Price (৳) <span className="text-red-500">*</span>
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
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                        placeholder="800"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Badge
                      </label>
                      <input
                        value={formData.badge}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, badge: e.target.value }))
                        }
                        className={inputClass}
                        placeholder='e.g. "Best Seller"'
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Product Image{" "}
                      {editingProduct ? (
                        ""
                      ) : (
                        <span className="text-red-500">*</span>
                      )}
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
                      {...(!editingProduct && { required: true })}
                    />
                    {editingProduct?.image && (
                      <div className="flex items-center gap-3 mt-2">
                        <img
                          src={
                            editingProduct.image.startsWith("http")
                              ? editingProduct.image
                              : `https://${editingProduct.image}`
                          }
                          alt="Current"
                          className="w-14 h-14 object-cover rounded-xl border shadow-sm"
                        />
                        <p className="text-[10px] text-gray-500">
                          Current:{" "}
                          <span className="text-[#214187] font-medium">
                            {editingProduct.image.split("/").pop()}
                          </span>
                        </p>
                      </div>
                    )}
                    {formData.image && (
                      <p className="text-[10px] text-green-600 font-medium">
                        ✓ New: {formData.image.name}
                      </p>
                    )}
                  </div>
                </Section>

                {/* SECTION 2 — SUBTITLE */}
                <Section
                  id="subtitle"
                  title="Subtitle"
                  number={2}
                  defaultOpen={true}
                >
                  <BilingualInput
                    label="Product Subtitle"
                    path="subtitle"
                    getVal={getVal}
                    setVal={setVal}
                    placeholderEn="Book + eBook"
                    placeholderBn="বই + ই-বুক"
                  />
                </Section>

                {/* SECTION 3 — DESCRIPTION */}
                <Section
                  id="description"
                  title="Main Description (Rich Text)"
                  number={3}
                  defaultOpen={true}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#214187] flex items-center gap-1">
                        <Globe className="w-3 h-3" /> EN
                      </span>
                      <QuillEditor
                        value={formData.contentEn}
                        onChange={(val: string) =>
                          setFormData((p) => ({ ...p, contentEn: val }))
                        }
                        placeholder="Type in English..."
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#F3056D] flex items-center gap-1">
                        <Globe className="w-3 h-3" /> বাংলা
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

                {/* SECTION 4 — SECONDARY DESC */}
                <Section
                  id="secondaryDesc"
                  title="Secondary Description"
                  number={4}
                  defaultOpen={false}
                >
                  <BilingualInput
                    label="Secondary Description"
                    path="secondaryDesc"
                    type="textarea"
                    getVal={getVal}
                    setVal={setVal}
                    placeholderEn="Additional description..."
                    placeholderBn="বাংলায় অতিরিক্ত বিবরণ..."
                  />
                </Section>

                {/* SECTION 5 — HIGHLIGHTS */}
                <Section
                  id="highlights"
                  title="Highlights"
                  number={5}
                  defaultOpen={false}
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

                {/* SECTION 6 — FEATURES */}
                <Section
                  id="features"
                  title="Features"
                  number={6}
                  defaultOpen={false}
                >
                  <FeatureCardEditor
                    content={formData.content}
                    updateContent={updateContent}
                  />
                </Section>

                {/* SECTION 7 — WHY POINTS */}
                <Section
                  id="whyPoints"
                  title="Why This Is Special"
                  number={7}
                  defaultOpen={false}
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

                {/* SECTION 8 — SPECS */}
                <Section
                  id="specs"
                  title="Specifications"
                  number={8}
                  defaultOpen={false}
                >
                  <SpecEditor
                    content={formData.content}
                    updateContent={updateContent}
                  />
                </Section>

                {/* SECTION 9 — CATEGORY DETAILS */}
                {formData.category === "book" && (
                  <Section
                    id="bookDetails"
                    title="Book Details"
                    number={9}
                    defaultOpen={false}
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
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Pages
                      </label>
                      <input
                        value={formData.content.book.pages}
                        onChange={(e) =>
                          updateContent("book.pages", e.target.value)
                        }
                        className={inputClass}
                        placeholder="120"
                      />
                    </div>
                  </Section>
                )}

                {formData.category === "bags" && (
                  <Section
                    id="bagDetails"
                    title="Bag Details"
                    number={9}
                    defaultOpen={false}
                  >
                    <BilingualInput
                      label="Material"
                      path="bag.material"
                      getVal={getVal}
                      setVal={setVal}
                      placeholderEn="Material (e.g. Canvas)"
                      placeholderBn="উপাদান (যেমন ক্যানভাস)"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Capacity
                        </label>
                        <input
                          value={formData.content.bag.capacity}
                          onChange={(e) =>
                            updateContent("bag.capacity", e.target.value)
                          }
                          className={inputClass}
                          placeholder="25L"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Dimensions
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
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
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

                {formData.category === "apparel" && (
                  <Section
                    id="apparelDetails"
                    title="Apparel Details"
                    number={9}
                    defaultOpen={false}
                  >
                    <BilingualInput
                      label="Material"
                      path="apparel.material"
                      getVal={getVal}
                      setVal={setVal}
                      placeholderEn="100% Cotton"
                      placeholderBn="১০০% কটন"
                    />
                    <BilingualInput
                      label="Fit Type"
                      path="apparel.fit"
                      getVal={getVal}
                      setVal={setVal}
                      placeholderEn="Regular Fit"
                      placeholderBn="রেগুলার ফিট"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Sizes
                        </label>
                        <input
                          value={formData.content.apparel.sizes}
                          onChange={(e) =>
                            updateContent("apparel.sizes", e.target.value)
                          }
                          className={inputClass}
                          placeholder="S, M, L, XL"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Colors
                        </label>
                        <input
                          value={formData.content.apparel.colors}
                          onChange={(e) =>
                            updateContent("apparel.colors", e.target.value)
                          }
                          className={inputClass}
                          placeholder="Red, Blue, Black"
                        />
                      </div>
                    </div>
                  </Section>
                )}

                {formData.category === "stationary" && (
                  <Section
                    id="stationaryDetails"
                    title="Stationary Details"
                    number={9}
                    defaultOpen={false}
                  >
                    <BilingualInput
                      label="Type"
                      path="stationary.type"
                      getVal={getVal}
                      setVal={setVal}
                      placeholderEn="Notebook, Pen Set"
                      placeholderBn="নোটবুক, কলম সেট"
                    />
                    <BilingualInput
                      label="Material"
                      path="stationary.material"
                      getVal={getVal}
                      setVal={setVal}
                      placeholderEn="Premium Paper"
                      placeholderBn="প্রিমিয়াম কাগজ"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
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

                {/* SUBMIT */}
                <div className="flex justify-end gap-3 pt-4 pb-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={saveMutation.isPending}
                    className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-sm transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className={`px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 text-white text-sm transition-all shadow-lg ${saveMutation.isPending ? "bg-gray-400 cursor-not-allowed" : "bg-[#F3056D] hover:bg-[#d9045c] shadow-[#F3056D]/30 hover:scale-[1.02] active:scale-95"}`}
                  >
                    {saveMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {saveMutation.isPending
                      ? "Saving..."
                      : editingProduct
                        ? "Update Product"
                        : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
