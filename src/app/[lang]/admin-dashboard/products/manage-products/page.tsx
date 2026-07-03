// src/app/[lang]/admin-dashboard/products/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import QuillEditor from "../../courses/create/QuillEditor";
import {
  Plus,
  Loader2,
  Package,
  Globe,
  Upload,
  X,
  Edit3,
  Eye,
  Trash2,
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

// --- DATA PARSING HELPERS (API might send strings or objects) ---
const parseBilingual = (val: any): BilingualText => {
  if (!val) return { en: "", bn: "" };
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return { en: String(val), bn: "" };
  }
};

const parseBilingualArray = (arr: any[]): BilingualText[] => {
  if (!arr || arr.length === 0) return [{ en: "", bn: "" }];
  return arr.map(parseBilingual);
};

const parseFeatures = (arr: any[]): BilingualFeature[] => {
  if (!arr || arr.length === 0)
    return [
      {
        title: { en: "", bn: "" },
        desc: { en: "", bn: "" },
        icon: "clipboard-list",
      },
    ];
  return arr.map((item) => ({
    title: parseBilingual(item.title),
    desc: parseBilingual(item.desc),
    icon: item.icon || "clipboard-list",
  }));
};

const parseSpecs = (arr: any[]): BilingualSpec[] => {
  if (!arr || arr.length === 0)
    return [{ label: { en: "", bn: "" }, value: { en: "", bn: "" } }];
  return arr.map((item) => ({
    label: parseBilingual(item.label),
    value: parseBilingual(item.value),
  }));
};

const DEFAULT_VALUES: ProductFormData = {
  title: { en: "", bn: "" },
  category: "book",
  subtitle: { en: "", bn: "" },
  fee: 0,
  originalFee: 0,
  badge: "",
  image: undefined as any,
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
};

export default function ProductsListPage() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

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

  const saveMutation = useMutation({
    mutationFn: async ({
      formData,
      id,
    }: {
      formData: FormData;
      id?: string;
    }) => {
      if (id) {
        // Update existing product
        const response = await axios.put(`/api/products/${id}`, formData);
        return response.data;
      }
      // Create new product
      const response = await axios.post("/api/products", formData);
      return response.data;
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
    onError: (err: any) => {
      console.error(err);
      alert("Error: " + (err.response?.data?.message || err.message));
    },
  });

  // --- MODAL HANDLERS ---
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset(DEFAULT_VALUES);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  };

  // --- FORM SETUP ---
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: DEFAULT_VALUES,
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

  // --- POPULATE FORM WHEN EDITING ---
  useEffect(() => {
    if (isModalOpen && editingProduct) {
      reset({
        title: parseBilingual(editingProduct.title),
        category: editingProduct.category || "book",
        subtitle: parseBilingual(editingProduct.subtitle),
        fee: editingProduct.fee || 0,
        originalFee: editingProduct.originalFee || 0,
        badge: editingProduct.badge || "",
        image: undefined as any,
        author: parseBilingual(editingProduct.author),
        pages: editingProduct.pages || "",
        publisher: parseBilingual(editingProduct.publisher),
        edition: parseBilingual(editingProduct.edition),
        country: parseBilingual(editingProduct.country),
        language: parseBilingual(editingProduct.language),
        sortOrder: editingProduct.sortOrder || 0,
        highlights: parseBilingualArray(editingProduct.highlights),
        features: parseFeatures(editingProduct.features),
        whyPoints: parseBilingualArray(editingProduct.whyPoints),
        specs: parseSpecs(editingProduct.specs),
        contentEn: editingProduct.contentEn || "",
        contentBn: editingProduct.contentBn || "",
        secondaryDescEn: editingProduct.secondaryDescEn || "",
        secondaryDescBn: editingProduct.secondaryDescBn || "",
      });
    } else if (isModalOpen) {
      reset(DEFAULT_VALUES);
    }
  }, [isModalOpen, editingProduct, reset]);

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

      saveMutation.mutate({ formData, id: editingProduct?._id });
    } catch (err) {
      console.error(err);
      alert("Error preparing form data");
    }
  };

  const parseTitle = (title: any) => parseBilingual(title);
  const products = data?.data || [];
  const publishedCount = products.filter((p: any) => p.isPublished).length;

  // --- HELPER: Bilingual Input Row ---
  const BilingualRow = ({
    enName,
    bnName,
    enPlaceholder,
    bnPlaceholder,
    showRemove,
    onRemove,
  }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      <input
        {...register(enName)}
        className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#214187] focus:border-[#214187] outline-none text-sm transition-colors"
        placeholder={enPlaceholder || "English"}
      />
      <div className="flex gap-2">
        <input
          {...register(bnName)}
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
    <div className="min-h-screen bg-gray-50">
      {/* --- HEADER --- */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F3056D]/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#F3056D]" />
                </div>
                Products
              </h1>
              <p className="text-gray-500 mt-1 ml-[52px]">
                {products.length} total &middot; {publishedCount} published
              </p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 bg-[#F3056D] hover:bg-[#F3056D]/90 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-[#F3056D]/20 transition-all"
            >
              <Plus className="w-4 h-4" /> Create Product
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
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Failed to load products.
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Package className="w-12 h-12 text-gray-300" />
              <p className="text-gray-500">No products found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product: any) => {
                    const title = parseTitle(product.title);
                    return (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50/80 transition-colors group"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={title?.en}
                                className="w-14 h-14 object-cover rounded-xl border shadow-sm"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate max-w-[260px]">
                                {title?.en || "Untitled"}
                              </p>
                              {title?.bn && (
                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[260px]">
                                  {title.bn}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#214187]/10 text-[#214187] uppercase">
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
                              href={`/${lang}/products/${product._id}`}
                              target="_blank"
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
                                handleDelete(product._id, title?.en)
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

      {/* --- MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center overflow-y-auto py-8 px-4">
          <div className="relative bg-white w-full max-w-5xl my-auto rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            {/* Modal Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 border-b bg-[#214187]">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Package className="w-6 h-6 text-[#ffd700]" />
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <form
                id="product-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-10"
              >
                {/* SECTION 1 */}
                <section className="space-y-6">
                  <h3 className="text-lg font-bold text-[#214187] border-b-2 border-[#214187]/10 pb-2">
                    1. Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase">
                        Title (EN) *
                      </label>
                      <input
                        {...register("title.en", { required: true })}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#214187] outline-none"
                        placeholder="Product Title (EN)"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase">
                        শিরোনাম (BN)
                      </label>
                      <input
                        {...register("title.bn")}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#F3056D] outline-none"
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
                        className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-[#214187] outline-none"
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
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#214187] outline-none"
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
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#214187] outline-none"
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
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#214187] outline-none"
                        placeholder='e.g. "Best Seller"'
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase">
                        Pages
                      </label>
                      <input
                        {...register("pages")}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#214187] outline-none"
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
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#214187] outline-none"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase">
                      Product Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      {...register("image")}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#F3056D]/10 file:text-[#F3056D] hover:file:bg-[#F3056D]/20 cursor-pointer"
                    />
                    {editingProduct?.image && (
                      <p className="text-xs text-gray-500 mt-1">
                        Current:{" "}
                        <span className="text-[#214187] font-medium truncate max-w-xs inline-block align-bottom">
                          {editingProduct.image.split("/").pop()}
                        </span>
                      </p>
                    )}
                  </div>
                </section>

                {/* SECTION 2 */}
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

                {/* SECTION 3 */}
                <section className="bg-gray-50 p-6 rounded-xl border space-y-6">
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
                            key={`en-${editingProduct?._id || "new"}`}
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
                            key={`bn-${editingProduct?._id || "new"}`}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="বাংলায় লিখুন..."
                          />
                        )}
                      />
                    </div>
                  </div>
                </section>

                {/* SECTION 4 */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-[#214187] border-b-2 border-[#214187]/10 pb-2">
                    4. Secondary Description
                  </h3>
                  <BilingualRow
                    enName="secondaryDescEn"
                    bnName="secondaryDescBn"
                    enPlaceholder="Additional description in English..."
                    bnPlaceholder="বাংলায় অতিরিক্ত বিবরণ..."
                  />
                </section>

                {/* SECTION 5 */}
                <section className="space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-[#214187]/10 pb-2">
                    <h3 className="text-lg font-bold text-[#214187]">
                      5. Highlights
                    </h3>
                    <button
                      type="button"
                      onClick={() => appendHighlight({ en: "", bn: "" })}
                      className="text-sm bg-[#F3056D]/10 text-[#F3056D] px-4 py-1.5 rounded-lg hover:bg-[#F3056D]/20 font-medium"
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
                        enPlaceholder="Highlight (EN)"
                        bnPlaceholder="হাইলাইট (বাংলা)"
                        showRemove={highlightFields.length > 1}
                        onRemove={() => removeHighlight(index)}
                      />
                    ))}
                  </div>
                </section>

                {/* SECTION 6 */}
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
                      className="text-sm bg-[#F3056D]/10 text-[#F3056D] px-4 py-1.5 rounded-lg hover:bg-[#F3056D]/20 font-medium"
                    >
                      <Plus className="w-4 h-4 inline mr-1" /> Add
                    </button>
                  </div>
                  <div className="space-y-6">
                    {featureFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-5 bg-gray-50 rounded-xl border space-y-4 relative"
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
                                  className={`cursor-pointer w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all hover:scale-110 ${isSelected ? "border-[#F3056D] bg-[#F3056D]/10 text-[#F3056D]" : "border-gray-200 text-gray-400 hover:border-[#214187] hover:text-[#214187]"}`}
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
                          <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                            Description
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <textarea
                              {...register(`features.${index}.desc.en`)}
                              rows={2}
                              className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-[#214187] outline-none resize-none"
                              placeholder="Description (EN)"
                            />
                            <textarea
                              {...register(`features.${index}.desc.bn`)}
                              rows={2}
                              className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-[#F3056D] outline-none resize-none"
                              placeholder="বিবরণ (বাংলা)"
                              lang="bn"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* SECTION 7 & 8 Condensed for brevity, fully functional */}
                <section className="space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-[#214187]/10 pb-2">
                    <h3 className="text-lg font-bold text-[#214187]">
                      7. Why This Is Special
                    </h3>
                    <button
                      type="button"
                      onClick={() => appendWhyPoint({ en: "", bn: "" })}
                      className="text-sm bg-[#F3056D]/10 text-[#F3056D] px-4 py-1.5 rounded-lg hover:bg-[#F3056D]/20 font-medium"
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
                        enPlaceholder="Why point (EN)"
                        bnPlaceholder="কেন স্পেশাল (বাংলা)"
                        showRemove={whyPointFields.length > 1}
                        onRemove={() => removeWhyPoint(index)}
                      />
                    ))}
                  </div>
                </section>

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
                      className="text-sm bg-[#214187]/10 text-[#214187] px-4 py-1.5 rounded-lg hover:bg-[#214187]/20 font-medium"
                    >
                      <Plus className="w-4 h-4 inline mr-1" /> Add
                    </button>
                  </div>
                  <div className="space-y-4">
                    {specFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-5 bg-gray-50 rounded-xl border space-y-3 relative"
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
                          enPlaceholder="Label (EN)"
                          bnPlaceholder="লেবেল (বাংলা)"
                        />
                        <BilingualRow
                          enName={`specs.${index}.value.en`}
                          bnName={`specs.${index}.value.bn`}
                          enPlaceholder="Value (EN)"
                          bnPlaceholder="মান (বাংলা)"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* SECTION 9 */}
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
                    />
                  </div>
                </section>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex-shrink-0 border-t bg-gray-50 px-6 py-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saveMutation.isPending}
                className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={saveMutation.isPending}
                className={`px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg ${saveMutation.isPending ? "bg-gray-400 cursor-not-allowed text-white shadow-none" : "bg-[#F3056D] text-white hover:bg-[#d4045e] hover:shadow-xl"}`}
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                {saveMutation.isPending
                  ? "Saving..."
                  : editingProduct
                    ? "Update Product"
                    : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
