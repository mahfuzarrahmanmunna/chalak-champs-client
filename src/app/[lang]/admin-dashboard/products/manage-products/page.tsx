"use client";

import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import {
  Plus,
  Loader2,
  Package,
  Globe,
  Upload,
  X,
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
import QuillEditor from "../../courses/create/QuillEditor";
// NOTE: Adjust this import path based on your actual project structure

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

// --- ICON OPTIONS ---
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

const getIconComponent = (value: string): LucideIcon => {
  const found = ICON_OPTIONS.find((opt) => opt.value === value);
  return found ? found.icon : ClipboardList;
};

export default function ManageProductsPage() {
  const queryClient = useQueryClient();

  // --- MUTATION ---
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
        className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#214187] focus:border-[#214187] outline-none text-sm transition-colors"
        placeholder={enPlaceholder || "English"}
      />
      <div className="flex gap-2">
        <input
          {...register(bnName as any)}
          className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#F3056D] focus:border-[#F3056D] outline-none text-sm transition-colors"
          placeholder={bnPlaceholder || "বাংলা"}
          lang="bn"
        />
        {showRemove && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* --- PAGE HEADER --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#214187]">
            Add New Product
          </h1>
          <p className="text-gray-500 mt-1">
            Fill in the details below to create a new product.
          </p>
        </div>

        {/* --- CREATE FORM --- */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b bg-[#214187]">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Package className="w-6 h-6 text-[#ffd700]" />
              Product Information
            </h2>
          </div>

          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* ===== SECTION 1: BASIC INFO ===== */}
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-[#214187] border-b-2 border-[#214187]/10 pb-2">
                  1. Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Title (EN) *
                    </label>
                    <input
                      {...register("title.en", { required: true })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#214187] outline-none transition-colors"
                      placeholder="Product Title (EN)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      শিরোনাম (BN)
                    </label>
                    <input
                      {...register("title.bn")}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#F3056D] outline-none transition-colors"
                      placeholder="প্রোডাক্টের নাম (বাংলা)"
                      lang="bn"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Category *
                    </label>
                    <select
                      {...register("category", { required: true })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#214187] outline-none bg-white transition-colors"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Price (৳) *
                    </label>
                    <input
                      type="number"
                      {...register("fee", {
                        required: true,
                        valueAsNumber: true,
                      })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#214187] outline-none transition-colors"
                      placeholder="550"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Original Price
                    </label>
                    <input
                      type="number"
                      {...register("originalFee", { valueAsNumber: true })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#214187] outline-none transition-colors"
                      placeholder="800 (optional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Badge
                    </label>
                    <input
                      {...register("badge")}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#214187] outline-none transition-colors"
                      placeholder='e.g. "Best Seller"'
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Pages
                    </label>
                    <input
                      {...register("pages")}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#214187] outline-none transition-colors"
                      placeholder="120"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      {...register("sortOrder", { valueAsNumber: true })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#214187] outline-none transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#F3056D]/10 file:text-[#F3056D] hover:file:bg-[#F3056D]/20 cursor-pointer transition-colors"
                  />
                </div>
              </section>

              {/* ===== SECTION 2: SUBTITLE ===== */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-[#214187] border-b-2 border-[#214187]/10 pb-2">
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
                <h3 className="text-lg font-bold text-[#214187]">
                  3. Main Description (Rich Text)
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#214187]">
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
                    <label className="flex items-center gap-2 text-sm font-bold text-[#F3056D]">
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
                <h3 className="text-lg font-bold text-[#214187] border-b-2 border-[#214187]/10 pb-2">
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
                <div className="flex justify-between items-center border-b-2 border-[#214187]/10 pb-2">
                  <h3 className="text-lg font-bold text-[#214187]">
                    5. Highlights
                  </h3>
                  <button
                    type="button"
                    onClick={() => appendHighlight({ en: "", bn: "" })}
                    className="text-sm bg-[#F3056D]/10 text-[#F3056D] px-4 py-1.5 rounded-lg hover:bg-[#F3056D]/20 font-medium transition-colors"
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
                <div className="flex justify-between items-center border-b-2 border-[#214187]/10 pb-2">
                  <h3 className="text-lg font-bold text-[#214187]">
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
                    className="text-sm bg-[#F3056D]/10 text-[#F3056D] px-4 py-1.5 rounded-lg hover:bg-[#F3056D]/20 font-medium transition-colors"
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
                        className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-4 relative"
                      >
                        {featureFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="absolute top-3 right-3 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}

                        {/* Icon Picker */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
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
                                      ? "border-[#F3056D] bg-[#F3056D]/10 text-[#F3056D]"
                                      : "border-gray-200 text-gray-400 hover:border-[#214187] hover:text-[#214187]"
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

                        <BilingualRow
                          enName={`features.${index}.title.en`}
                          bnName={`features.${index}.title.bn`}
                          enPlaceholder="Feature title (EN)"
                          bnPlaceholder="ফিচারের শিরোনাম (বাংলা)"
                        />

                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                            Description
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <textarea
                              {...register(`features.${index}.desc.en`)}
                              rows={2}
                              className="w-full border border-gray-300 p-3 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#214187] outline-none resize-none transition-colors"
                              placeholder="Description (EN)"
                            />
                            <textarea
                              {...register(`features.${index}.desc.bn`)}
                              rows={2}
                              className="w-full border border-gray-300 p-3 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#F3056D] outline-none resize-none transition-colors"
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
                <div className="flex justify-between items-center border-b-2 border-[#214187]/10 pb-2">
                  <h3 className="text-lg font-bold text-[#214187]">
                    7. Why This Is Special
                  </h3>
                  <button
                    type="button"
                    onClick={() => appendWhyPoint({ en: "", bn: "" })}
                    className="text-sm bg-[#F3056D]/10 text-[#F3056D] px-4 py-1.5 rounded-lg hover:bg-[#F3056D]/20 font-medium transition-colors"
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
                <div className="flex justify-between items-center border-b-2 border-[#214187]/10 pb-2">
                  <h3 className="text-lg font-bold text-[#214187]">
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
                    className="text-sm bg-[#214187]/10 text-[#214187] px-4 py-1.5 rounded-lg hover:bg-[#214187]/20 font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-1" /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {specFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-3 relative"
                    >
                      {specFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpec(index)}
                          className="absolute top-3 right-3 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                <h3 className="text-lg font-bold text-[#214187] border-b-2 border-[#214187]/10 pb-2">
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

              {/* ===== SUBMIT BUTTONS ===== */}
              <div className="pt-8 border-t-2 border-gray-100 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => reset()}
                  disabled={mutation.isPending}
                  className="px-8 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-bold transition-colors"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg ${
                    mutation.isPending
                      ? "bg-gray-400 cursor-not-allowed text-white shadow-none"
                      : "bg-[#F3056D] text-white hover:bg-[#d4045e] hover:shadow-xl"
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
      </div>
    </div>
  );
}
