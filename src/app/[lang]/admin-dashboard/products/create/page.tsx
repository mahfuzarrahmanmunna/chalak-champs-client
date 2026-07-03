"use client";

import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import QuillEditor from "../../courses/create/QuillEditor";
import {
  Loader2,
  Package,
  Globe,
  Upload,
  X,
  Plus,
  ArrowLeft,
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

// --- SHARED INPUT STYLE ---
const inputClass =
  "w-full border border-gray-200 bg-white p-3 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none text-sm transition-all";

const selectClass =
  "w-full border border-gray-200 bg-white p-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none text-sm transition-all appearance-none";

export default function CreateProductPage() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post("/api/products", formData);
      return response.data;
    },
    onSuccess: () => {
      alert("Product Created Successfully!");
      reset();
    },
    onError: (err: any) => {
      console.error(err);
      alert("Error: " + (err.response?.data?.message || err.message));
    },
  });

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

  // --- Bilingual Row Helper ---
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
        className={inputClass}
        placeholder={enPlaceholder || "English"}
      />
      <div className="flex gap-2">
        <input
          {...register(bnName as any)}
          className={inputClass}
          placeholder={bnPlaceholder || "বাংলা"}
          lang="bn"
        />
        {showRemove && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl flex-shrink-0 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );

  // --- Section Wrapper ---
  const Section = ({
    number,
    title,
    children,
    action,
  }: {
    number: number;
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
  }) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-bold text-gray-900 flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-[#F3056D] text-white text-xs font-bold flex items-center justify-center">
            {number}
          </span>
          {title}
        </h3>
        {action}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
          <Link
            href={`/${lang}/dashboard/products`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#214187] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3056D]/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-[#F3056D]" />
            </div>
            Create New Product
          </h1>
          <p className="text-gray-500 mt-1 ml-[52px]">
            Fill in the details below to add a new product.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ===== 1. BASIC INFO ===== */}
          <Section number={1} title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Title (EN) <span className="text-[#F3056D]">*</span>
                </label>
                <input
                  {...register("title.en", { required: true })}
                  className={inputClass}
                  placeholder="Product title in English"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  শিরোনাম (BN)
                </label>
                <input
                  {...register("title.bn")}
                  className={inputClass}
                  placeholder="প্রোডাক্টের নাম বাংলায়"
                  lang="bn"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category <span className="text-[#F3056D]">*</span>
                </label>
                <select
                  {...register("category", { required: true })}
                  className={selectClass}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price (৳) <span className="text-[#F3056D]">*</span>
                </label>
                <input
                  type="number"
                  {...register("fee", { required: true, valueAsNumber: true })}
                  className={inputClass}
                  placeholder="550"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Original Price
                </label>
                <input
                  type="number"
                  {...register("originalFee", { valueAsNumber: true })}
                  className={inputClass}
                  placeholder="800 (optional)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Badge
                </label>
                <input
                  {...register("badge")}
                  className={inputClass}
                  placeholder='e.g. "Best Seller"'
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Pages
                </label>
                <input
                  {...register("pages")}
                  className={inputClass}
                  placeholder="120"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Sort Order
                </label>
                <input
                  type="number"
                  {...register("sortOrder", { valueAsNumber: true })}
                  className={inputClass}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Product Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#F3056D]/10 file:text-[#F3056D] hover:file:bg-[#F3056D]/20 file:cursor-pointer file:transition-colors"
                />
              </div>
            </div>
          </Section>

          {/* ===== 2. SUBTITLE ===== */}
          <Section number={2} title="Subtitle">
            <BilingualRow
              enName="subtitle.en"
              bnName="subtitle.bn"
              enPlaceholder="Book + eBook"
              bnPlaceholder="বই + ই-বুক"
            />
          </Section>

          {/* ===== 3. MAIN DESCRIPTION ===== */}
          <Section number={3} title="Main Description (Rich Text)">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#214187] uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5" /> English Content
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
                <label className="flex items-center gap-2 text-xs font-semibold text-[#214187] uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5" /> বাংলা কন্টেন্ট
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
          </Section>

          {/* ===== 4. SECONDARY DESCRIPTION ===== */}
          <Section number={4} title="Secondary Description (Plain Text)">
            <BilingualRow
              enName="secondaryDescEn"
              bnName="secondaryDescBn"
              enPlaceholder="Additional description in English..."
              bnPlaceholder="বাংলায় অতিরিক্ত বিবরণ..."
            />
          </Section>

          {/* ===== 5. HIGHLIGHTS ===== */}
          <Section
            number={5}
            title="Highlights"
            action={
              <button
                type="button"
                onClick={() => appendHighlight({ en: "", bn: "" })}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#F3056D]/10 text-[#F3056D] px-3 py-1.5 rounded-lg hover:bg-[#F3056D]/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            }
          >
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
          </Section>

          {/* ===== 6. FEATURES ===== */}
          <Section
            number={6}
            title="Features"
            action={
              <button
                type="button"
                onClick={() =>
                  appendFeature({
                    title: { en: "", bn: "" },
                    desc: { en: "", bn: "" },
                    icon: "clipboard-list",
                  })
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#F3056D]/10 text-[#F3056D] px-3 py-1.5 rounded-lg hover:bg-[#F3056D]/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            }
          >
            {featureFields.map((field, index) => (
              <div
                key={field.id}
                className="p-5 bg-gray-50/80 rounded-xl border border-gray-100 space-y-5 relative"
              >
                {featureFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Icon Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Icon
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ICON_OPTIONS.map((opt) => {
                      const OptIcon = opt.icon;
                      const isSelected = field.icon === opt.value;
                      return (
                        <label
                          key={opt.value}
                          className={`cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg border-2 transition-all hover:scale-110 ${
                            isSelected
                              ? "border-[#F3056D] bg-[#F3056D]/10 text-[#F3056D]"
                              : "border-gray-200 text-gray-300 hover:border-gray-300 hover:text-gray-500"
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
                          <OptIcon className="w-4 h-4" strokeWidth={2} />
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
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Description
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea
                      {...register(`features.${index}.desc.en`)}
                      rows={2}
                      className={`${inputClass} resize-none`}
                      placeholder="Description (EN)"
                    />
                    <textarea
                      {...register(`features.${index}.desc.bn`)}
                      rows={2}
                      className={`${inputClass} resize-none`}
                      placeholder="বিবরণ (বাংলা)"
                      lang="bn"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Section>

          {/* ===== 7. WHY POINTS ===== */}
          <Section
            number={7}
            title="Why This Is Special"
            action={
              <button
                type="button"
                onClick={() => appendWhyPoint({ en: "", bn: "" })}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#F3056D]/10 text-[#F3056D] px-3 py-1.5 rounded-lg hover:bg-[#F3056D]/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            }
          >
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
          </Section>

          {/* ===== 8. SPECIFICATIONS ===== */}
          <Section
            number={8}
            title="Specifications"
            action={
              <button
                type="button"
                onClick={() =>
                  appendSpec({
                    label: { en: "", bn: "" },
                    value: { en: "", bn: "" },
                  })
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#214187]/10 text-[#214187] px-3 py-1.5 rounded-lg hover:bg-[#214187]/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            }
          >
            {specFields.map((field, index) => (
              <div
                key={field.id}
                className="p-5 bg-gray-50/80 rounded-xl border border-gray-100 space-y-4 relative"
              >
                {specFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpec(index)}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
          </Section>

          {/* ===== 9. BOOK DETAILS ===== */}
          <Section number={9} title="Book Details (Optional)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            </div>
            <div className="max-w-md">
              <BilingualRow
                enName="language.en"
                bnName="language.bn"
                enPlaceholder="Bangla"
                bnPlaceholder="বাংলা"
              />
            </div>
          </Section>

          {/* ===== SUBMIT ===== */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => reset()}
              disabled={mutation.isPending}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className={`px-8 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                mutation.isPending
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-[#F3056D] hover:bg-[#F3056D]/90 text-white shadow-lg shadow-[#F3056D]/25 hover:shadow-xl hover:shadow-[#F3056D]/30"
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
  );
}
