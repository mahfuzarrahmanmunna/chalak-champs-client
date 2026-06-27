// src/app/[lang]/dashboard/products/ProductsClient.tsx

"use client";

import React, { useState } from "react";
import {
  useForm,
  useFieldArray,
  useWatch,
  Control,
  Controller,
} from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import {
  Plus,
  Loader2,
  Package,
  Globe,
  Upload,
  X,
  Trash2,
  Edit3,
  Eye,
  Image as ImageIcon,
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
import Link from "next/link";
import QuillEditor from "../courses/create/QuillEditor";

// --- TYPES ---
interface BilingualText {
  en: string;
  bn: string;
}

interface BilingualFeature {
  title: BilingualText;
  desc: BilingualText;
  icon: string;
}

interface BilingualSpec {
  label: BilingualText;
  value: BilingualText;
}

interface ProductFormData {
  title: BilingualText;
  category: string;
  subtitle: BilingualText;
  fee: number;
  originalFee?: number;
  badge: string;
  image: FileList;
  highlights: BilingualText[];
  features: BilingualFeature[];
  whyPoints: BilingualText[];
  specs: BilingualSpec[];
  author: BilingualText;
  pages: string;
  publisher: BilingualText;
  edition: BilingualText;
  country: BilingualText;
  language: BilingualText;
  contentEn: string;
  contentBn: string;
  secondaryDescEn: string;
  secondaryDescBn: string;
  sortOrder: number;
}

const CATEGORIES = [
  { value: "book", label: "Book / eBook" },
  { value: "apparel", label: "Apparel / T-Shirt" },
  { value: "bags", label: "Bags" },
  { value: "stationary", label: "Stationary" },
];

// --- ICON OPTIONS: Lucide icons replace emojis ---
interface IconOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

const ICON_OPTIONS: IconOption[] = [
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

// Helper: find icon component by string value
const getIconComponent = (value: string): LucideIcon => {
  const found = ICON_OPTIONS.find((opt) => opt.value === value);
  return found ? found.icon : ClipboardList;
};

export default function ProductsClient() {
  const queryClient = useQueryClient();

  // --- QUERIES & MUTATIONS ---
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const response = await axios.get("/api/products");
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (err: any) => {
      alert("Error: " + (err.response?.data?.message || err.message));
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post("/api/products", formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      alert("Product Created Successfully!");
      reset();
    },
    onError: (err: any) => {
      console.error(err);
      alert("Error: " + (err.response?.data?.message || err.message));
    },
  });

  // --- FORM SETUP ---
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      title: { en: "", bn: "" },
      category: "book",
      subtitle: { en: "", bn: "" },
      fee: 0,
      originalFee: 0,
      badge: "",
      author: { en: "", bn: "" },
      pages: "",
      publisher: { en: "", bn: "" },
      edition: { en: "", bn: "" },
      country: { en: "", bn: "" },
      language: { en: "", bn: "" },
      sortOrder: 0,
      highlights: [{ en: "", bn: "" }],
      features: [
        {
          title: { en: "", bn: "" },
          desc: { en: "", bn: "" },
          icon: "clipboard-list",
        },
      ],
      whyPoints: [{ en: "", bn: "" }],
      specs: [{ label: { en: "", bn: "" }, value: { en: "", bn: "" } }],
      contentEn: "",
      contentBn: "",
      secondaryDescEn: "",
      secondaryDescBn: "",
    },
  });

  // --- FIELD ARRAYS ---
  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({ control, name: "highlights" });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({ control, name: "features" });

  const {
    fields: whyPointFields,
    append: appendWhyPoint,
    remove: removeWhyPoint,
  } = useFieldArray({ control, name: "whyPoints" });

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({ control, name: "specs" });

  // --- DELETE HANDLER ---
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  };

  // --- SUBMIT ---
  const onSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData();

      formData.append("category", data.category);
      formData.append("fee", (data.fee || 0).toString());
      if (data.originalFee)
        formData.append("originalFee", data.originalFee.toString());
      if (data.badge) formData.append("badge", data.badge);
      if (data.pages) formData.append("pages", data.pages);
      formData.append("sortOrder", (data.sortOrder || 0).toString());

      formData.append("title", JSON.stringify(data.title));
      formData.append("subtitle", JSON.stringify(data.subtitle));
      formData.append("author", JSON.stringify(data.author));
      formData.append("publisher", JSON.stringify(data.publisher));
      formData.append("edition", JSON.stringify(data.edition));
      formData.append("country", JSON.stringify(data.country));
      formData.append("language", JSON.stringify(data.language));

      formData.append("highlights", JSON.stringify(data.highlights));
      formData.append("features", JSON.stringify(data.features));
      formData.append("whyPoints", JSON.stringify(data.whyPoints));
      formData.append("specs", JSON.stringify(data.specs));

      formData.append("contentEn", data.contentEn);
      formData.append("contentBn", data.contentBn);
      formData.append("secondaryDescEn", data.secondaryDescEn);
      formData.append("secondaryDescBn", data.secondaryDescBn);

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      mutation.mutate(formData);
    } catch (err) {
      console.error(err);
      alert("Error preparing form data");
    }
  };

  // --- HELPER: Bilingual Input Row ---
  const BilingualRow = ({
    enName,
    bnName,
    enPlaceholder,
    bnPlaceholder,
    showRemove,
    onRemove,
  }: {
    enName: string;
    bnName: string;
    enPlaceholder?: string;
    bnPlaceholder?: string;
    showRemove?: boolean;
    onRemove?: () => void;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      <input
        {...register(enName as any)}
        className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        placeholder={enPlaceholder || "English"}
      />
      <div className="flex gap-2">
        <input
          {...register(bnName as any)}
          className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          placeholder={bnPlaceholder || "বাংলা"}
          lang="bn"
        />
        {showRemove && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- PAGE HEADER --- */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product Dashboard
            </h1>
            <p className="text-gray-500">Create and manage products.</p>
          </div>
        </div>

        {/* --- CREATE FORM --- */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              Create New Product
            </h2>
          </div>

          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* ===== SECTION 1: BASIC INFO ===== */}
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                  1. Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      Title (EN) *
                    </label>
                    <input
                      {...register("title.en", { required: true })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Product Title (EN)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      শিরোনাম (BN)
                    </label>
                    <input
                      {...register("title.bn")}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="প্রোডাক্টের নাম (বাংলা)"
                      lang="bn"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      Category *
                    </label>
                    <select
                      {...register("category", { required: true })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      Price (৳) *
                    </label>
                    <input
                      type="number"
                      {...register("fee", {
                        required: true,
                        valueAsNumber: true,
                      })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="550"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      Original Price
                    </label>
                    <input
                      type="number"
                      {...register("originalFee", { valueAsNumber: true })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="800 (optional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      Badge
                    </label>
                    <input
                      {...register("badge")}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder='e.g. "Best Seller"'
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      Pages
                    </label>
                    <input
                      {...register("pages")}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="120"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      {...register("sortOrder", { valueAsNumber: true })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </section>

              {/* ===== SECTION 2: SUBTITLE ===== */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                  2. Subtitle
                </h3>
                <BilingualRow
                  enName="subtitle.en"
                  bnName="subtitle.bn"
                  enPlaceholder="Book + eBook"
                  bnPlaceholder="বই + ই-বুক"
                />
              </section>

              {/* ===== SECTION 3: DESCRIPTION (Quill) ===== */}
              <section className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
                <h3 className="text-lg font-bold text-gray-900">
                  3. Main Description (Rich Text)
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-blue-700">
                      <Globe className="w-4 h-4" /> English Content
                    </label>
                    <Controller
                      name="contentEn"
                      control={control}
                      render={({ field }) => (
                        <QuillEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Type in English..."
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-green-700">
                      <Globe className="w-4 h-4" /> বাংলা কন্টেন্ট
                    </label>
                    <Controller
                      name="contentBn"
                      control={control}
                      render={({ field }) => (
                        <QuillEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="বাংলায় লিখুন..."
                        />
                      )}
                    />
                  </div>
                </div>
              </section>

              {/* ===== SECTION 4: SECONDARY DESCRIPTION ===== */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                  4. Secondary Description (Plain Text)
                </h3>
                <BilingualRow
                  enName="secondaryDescEn"
                  bnName="secondaryDescBn"
                  enPlaceholder="Additional description in English..."
                  bnPlaceholder="বাংলায় অতিরিক্ত বিবরণ..."
                />
              </section>

              {/* ===== SECTION 5: HIGHLIGHTS ===== */}
              <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    5. Highlights
                  </h3>
                  <button
                    type="button"
                    onClick={() => appendHighlight({ en: "", bn: "" })}
                    className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-100 transition"
                  >
                    <Plus className="w-4 h-4 inline mr-1" /> Add
                  </button>
                </div>
                <div className="space-y-3">
                  {highlightFields.map((item, index) => (
                    <BilingualRow
                      key={item.id}
                      enName={`highlights.${index}.en`}
                      bnName={`highlights.${index}.bn`}
                      enPlaceholder="e.g. Step-by-step lessons"
                      bnPlaceholder="যেমন ধাপে ধাপে সাজানো লেসন"
                      showRemove={highlightFields.length > 1}
                      onRemove={() => removeHighlight(index)}
                    />
                  ))}
                </div>
              </section>

              {/* ===== SECTION 6: FEATURES ===== */}
              <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    6. Features
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      appendFeature({
                        title: { en: "", bn: "" },
                        desc: { en: "", bn: "" },
                        icon: "clipboard-list",
                      })
                    }
                    className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-100 transition"
                  >
                    <Plus className="w-4 h-4 inline mr-1" /> Add
                  </button>
                </div>
                <div className="space-y-6">
                  {featureFields.map((field, index) => {
                    const SelectedIcon = getIconComponent(field.icon);

                    return (
                      <div
                        key={field.id}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4 relative"
                      >
                        {featureFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="absolute top-3 right-3 p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}

                        {/* Icon Picker — Lucide Icons */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">
                            Icon
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {ICON_OPTIONS.map((opt) => {
                              const OptIcon = opt.icon;
                              const isSelected = field.icon === opt.value;
                              return (
                                <label
                                  key={opt.value}
                                  className={`cursor-pointer w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all hover:scale-110 ${
                                    isSelected
                                      ? "border-blue-500 bg-blue-50 text-blue-600"
                                      : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                                  }`}
                                  title={opt.label}
                                >
                                  <input
                                    type="radio"
                                    {...register(`features.${index}.icon`)}
                                    value={opt.value}
                                    className="sr-only"
                                    defaultChecked={isSelected}
                                  />
                                  <OptIcon
                                    className="w-[18px] h-[18px]"
                                    strokeWidth={2}
                                  />
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Title */}
                        <BilingualRow
                          enName={`features.${index}.title.en`}
                          bnName={`features.${index}.title.bn`}
                          enPlaceholder="Feature title (EN)"
                          bnPlaceholder="ফিচারের শিরোনাম (বাংলা)"
                        />

                        {/* Description */}
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                            Description
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <textarea
                              {...register(`features.${index}.desc.en`)}
                              rows={2}
                              className="w-full border border-gray-300 p-3 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                              placeholder="Description (EN)"
                            />
                            <textarea
                              {...register(`features.${index}.desc.bn`)}
                              rows={2}
                              className="w-full border border-gray-300 p-3 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                              placeholder="বিবরণ (বাংলা)"
                              lang="bn"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ===== SECTION 7: WHY POINTS ===== */}
              <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    7. Why This Is Special
                  </h3>
                  <button
                    type="button"
                    onClick={() => appendWhyPoint({ en: "", bn: "" })}
                    className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-100 transition"
                  >
                    <Plus className="w-4 h-4 inline mr-1" /> Add
                  </button>
                </div>
                <div className="space-y-3">
                  {whyPointFields.map((item, index) => (
                    <BilingualRow
                      key={item.id}
                      enName={`whyPoints.${index}.en`}
                      bnName={`whyPoints.${index}.bn`}
                      enPlaceholder="Why point in English..."
                      bnPlaceholder="কেন স্পেশাল পয়েন্ট বাংলায়..."
                      showRemove={whyPointFields.length > 1}
                      onRemove={() => removeWhyPoint(index)}
                    />
                  ))}
                </div>
              </section>

              {/* ===== SECTION 8: SPECIFICATIONS ===== */}
              <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    8. Specifications
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      appendSpec({
                        label: { en: "", bn: "" },
                        value: { en: "", bn: "" },
                      })
                    }
                    className="text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-md hover:bg-purple-100 transition"
                  >
                    <Plus className="w-4 h-4 inline mr-1" /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {specFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 relative"
                    >
                      {specFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpec(index)}
                          className="absolute top-3 right-3 p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <BilingualRow
                        enName={`specs.${index}.label.en`}
                        bnName={`specs.${index}.label.bn`}
                        enPlaceholder="Label (EN) e.g. Type"
                        bnPlaceholder="লেবেল (বাংলা) যেমন ধরন"
                      />
                      <BilingualRow
                        enName={`specs.${index}.value.en`}
                        bnName={`specs.${index}.value.bn`}
                        enPlaceholder="Value (EN) e.g. School Bag"
                        bnPlaceholder="মান (বাংলা) যেমন স্কুল ব্যাগ"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* ===== SECTION 9: BOOK INFO ===== */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                  9. Book Details (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BilingualRow
                    enName="author.en"
                    bnName="author.bn"
                    enPlaceholder="Author name"
                    bnPlaceholder="লেখকের নাম"
                  />
                  <BilingualRow
                    enName="publisher.en"
                    bnName="publisher.bn"
                    enPlaceholder="Publisher"
                    bnPlaceholder="প্রকাশক"
                  />
                  <BilingualRow
                    enName="edition.en"
                    bnName="edition.bn"
                    enPlaceholder="1st Edition"
                    bnPlaceholder="১ম সংস্করণ"
                  />
                  <BilingualRow
                    enName="country.en"
                    bnName="country.bn"
                    enPlaceholder="Bangladesh"
                    bnPlaceholder="বাংলাদেশ"
                  />
                  <BilingualRow
                    enName="language.en"
                    bnName="language.bn"
                    enPlaceholder="Bangla"
                    bnPlaceholder="বাংলা"
                    showRemove={false}
                  />
                </div>
              </section>

              {/* ===== SUBMIT ===== */}
              <div className="pt-6 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => reset()}
                  disabled={mutation.isPending}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition ${
                    mutation.isPending
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                  }`}
                >
                  {mutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {mutation.isPending ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* --- EXISTING PRODUCTS LIST --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Existing Products ({data?.data?.length || 0})
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Failed to load products.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                      Image
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                      Title
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.data?.map((product: any) => {
                    const title =
                      typeof product.title === "string"
                        ? JSON.parse(product.title)
                        : product.title;

                    return (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={title?.en || ""}
                              className="w-16 h-12 object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-gray-200 rounded-lg border flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900 text-sm">
                            {title?.en || product.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {title?.bn || ""}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 capitalize">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-gray-900">
                            ৳ {product.fee}
                          </span>
                          {product.originalFee && (
                            <span className="text-xs text-gray-400 line-through ml-2">
                              ৳ {product.originalFee}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              product.isPublished
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {product.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/en/products/${product._id}`}
                              target="_blank"
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View on site"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/dashboard/products/${product._id}/edit`}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(
                                  product._id,
                                  title?.en || product.title,
                                )
                              }
                              disabled={deleteMutation.isPending}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {data?.data?.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No products found. Create your first product above.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
