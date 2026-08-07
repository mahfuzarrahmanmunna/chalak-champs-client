// src/app/[lang]/products/ProductsContent.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  BookOpen,
  Clock,
  Shirt,
  ShoppingBag,
  Pencil,
  Package,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import ProductCard from "./ProductCard";
import axiosInstance from "@/lib/axios";

/* ═══════════════════════════════════════════════════
   CATEGORY CONFIG — translated labels + icons
   ═══════════════════════════════════════════════════ */
const categoryMeta: Record<
  string,
  { icon: React.ElementType; en: string; bn: string }
> = {
  book: { icon: BookOpen, en: "Books", bn: "বই" },
  bags: { icon: ShoppingBag, en: "Bags", bn: "ব্যাগ" },
  apparel: { icon: Shirt, en: "Apparel", bn: "পোশাক" },
  stationary: { icon: Pencil, en: "Stationery", bn: "স্টেশনারি" },
};

/* ═══════════════════════════════════════════════════
   BILINGUAL HELPER
   Handles: { en: "...", bn: "..." } | JSON string | plain string
   ═══════════════════════════════════════════════════ */
const getBilingual = (val: any, isBangla: boolean): string => {
  if (!val) return "";
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === "object" && parsed !== null) {
        return isBangla
          ? parsed.bn || parsed.en || ""
          : parsed.en || parsed.bn || "";
      }
    } catch {
      // Not JSON — return the plain string
    }
    return val;
  }
  if (typeof val === "object") {
    return isBangla ? val.bn || val.en || "" : val.en || val.bn || "";
  }
  return String(val);
};

/* ═══════════════════════════════════════════════════
   SKELETON
   ═══════════════════════════════════════════════════ */
const ProductCardSkeleton = () => (
  <div className="w-[86vw] md:w-[304px]">
    <div className="max-w-80 mx-auto h-132 shadow bg-linear-to-b from-[#FF8FCA] to-[#D9D9D9] rounded-[22px] p-0.5">
      <div className="w-full h-full rounded-[20px] p-2 bg-[#F9FAFC]">
        <div className="md:w-71 md:h-71 w-74 h-73 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="flex flex-col items-center gap-2 mt-2 w-full">
          <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="flex flex-col items-center mt-4 w-full px-4">
          <div className="h-6 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="flex justify-center mt-3">
          <div className="h-10 w-36 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function ProductsContent() {
  const { isBangla } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  /* ── FETCH REAL DATA ── */
  const {
    data: apiResponse,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/products");
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  // Handle both { data: [...] } and { success: true, data: [...] }
  const rawProducts: any[] = useMemo(() => {
    if (!apiResponse) return [];
    return Array.isArray(apiResponse.data)
      ? apiResponse.data
      : Array.isArray(apiResponse)
        ? apiResponse
        : [];
  }, [apiResponse]);

  /* ── EXTRACT UNIQUE CATEGORIES (ordered by categoryMeta) ── */
  const tabs = useMemo(() => {
    const cats = new Set(
      rawProducts.map((p: any) => p.category).filter(Boolean),
    );
    // Sort: known categories first (in categoryMeta order), then unknowns
    const knownOrder = Object.keys(categoryMeta);
    const known = knownOrder.filter((c) => cats.has(c));
    const unknown = Array.from(cats).filter(
      (c: string) => !knownOrder.includes(c),
    );
    return [...known, ...unknown];
  }, [rawProducts]);

  /* ── FILTER PRODUCTS ── */
  const filteredProducts = useMemo(() => {
    return rawProducts.filter((product: any) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;

      if (!searchTerm.trim()) return matchesCategory;

      const tokens = searchTerm
        .toLowerCase()
        .split(/\s+/)
        .filter((t) => t.length > 0);

      const titleEn = getBilingual(product.title, false).toLowerCase();
      const titleBn = getBilingual(product.title, true).toLowerCase();
      const subtitleEn = getBilingual(product.subtitle, false).toLowerCase();
      const subtitleBn = getBilingual(product.subtitle, true).toLowerCase();
      const descEn = getBilingual(product.description, false).toLowerCase();
      const descBn = getBilingual(product.description, true).toLowerCase();
      const category = (product.category || "").toLowerCase();
      const badge = (product.badge || "").toLowerCase();

      const searchable = [
        titleEn,
        titleBn,
        subtitleEn,
        subtitleBn,
        descEn,
        descBn,
        category,
        badge,
      ].join(" ");

      const matchesSearch = tokens.some((token) => searchable.includes(token));

      return matchesCategory && matchesSearch;
    });
  }, [rawProducts, searchTerm, activeCategory]);

  /* ── TRANSFORM FOR PRODUCT CARD ── */
  const displayProducts = useMemo(() => {
    return filteredProducts.map((p: any) => {
      const originalFee = Number(p.originalFee) || 0;
      const fee = Number(p.fee) || 0;
      const hasDiscount = originalFee > 0 && originalFee > fee;

      const meta = categoryMeta[p.category];
      const categoryLabel = meta
        ? isBangla
          ? meta.bn
          : meta.en
        : p.category || "Other";

      // Fix image URL if it's missing protocol
      let imageUrl: string | null = null;
      if (p.image) {
        imageUrl = p.image.startsWith("http") ? p.image : `https://${p.image}`;
      }

      return {
        id: p._id,
        slug: p.slug || p._id,
        title: getBilingual(p.title, isBangla),
        category: p.category || "Uncategorized",
        categoryLabel,
        subtitle: getBilingual(p.subtitle, isBangla),
        description: getBilingual(p.description, isBangla),
        secondaryDescription: getBilingual(p.secondaryDescription, isBangla),
        image: imageUrl,
        fee: fee > 0 ? `৳${fee}` : "",
        originalFee: hasDiscount ? `৳${originalFee}` : "",
        hasDiscount,
        badge: p.badge || null,
        highlights: (p.highlights || [])
          .map((h: any) => getBilingual(h, isBangla))
          .filter(Boolean),
      };
    });
  }, [filteredProducts, isBangla]);

  /* ── UI TEXT ── */
  const uiText = {
    heroTitle: isBangla ? "আমাদের প্রোডাক্টস" : "Our Products",
    heroMain: isBangla
      ? "আপনার বাচ্চার জন্য সেরা শেখার সামগ্রী"
      : "Best Learning Materials for Your Child",
    heroDesc: isBangla
      ? "চালাক চ্যাম্পসের বিশেষভাবে ডিজাইন করা বই, ই-বুক, টি-শার্ট, ব্যাগ ও স্টেশনারি—শেখাকে আরও আনন্দময় করতে।"
      : "Specially designed books, eBooks, T-shirts, bags and stationery from Chalak Champs—to make learning even more enjoyable.",
    searchPlaceholder: isBangla
      ? "প্রোডাক্ট খুঁজুন..."
      : "Search for products...",
    allFilter: isBangla ? "সব প্রোডাক্ট" : "All Products",
    popularTitle: isBangla ? "আমাদের প্রোডাক্ট" : "Our Products",
    foundText: isBangla ? "মোট " : "Total ",
    foundSuffix: isBangla ? "টি পাওয়া গেছে" : " found",
    comingSoonTitle: isBangla ? "শীঘ্রই আসছে" : "Coming Soon",
    comingSoonSub: "Coming Soon",
    comingSoonDesc: isBangla
      ? "আমরা এই বিভাগে নতুন প্রোডাক্ট নিয়ে আসছি। আপডেট পেতে চোখ রাখুন!"
      : "We are bringing new products to this section. Keep an eye out for updates!",
    ctaCardLabel: isBangla ? "বিস্তারিত দেখুন" : "View Details",
    errorTitle: isBangla ? "ত্রুটি হয়েছে" : "Something Went Wrong",
    errorDesc: isBangla
      ? "প্রোডাক্ট লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
      : "Failed to load products. Please try again.",
    retryBtn: isBangla ? "আবার চেষ্টা করুন" : "Try Again",
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* ═══ HERO SECTION ═══ */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="text-2xl text-gray-600 leading-[18.75px]">
            {uiText.heroTitle}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-secondary mb-6 leading-tight">
            {uiText.heroMain}
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            {uiText.heroDesc}
          </p>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#F3056D] transition-colors" />
            </div>
            <input
              type="text"
              placeholder={uiText.searchPlaceholder}
              className="w-full text-gray-700 pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#F3056D] focus:ring-4 focus:ring-[#F3056D]/10 outline-none text-lg transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filters — with icons + translated labels */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {/* "All" tab */}
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border flex items-center gap-2 ${
                activeCategory === "all"
                  ? "bg-[#F3056D] text-white border-[#F3056D] shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Package className="h-4 w-4" />
              {uiText.allFilter}
            </button>

            {/* Dynamic category tabs */}
            {tabs.map((tab) => {
              const meta = categoryMeta[tab];
              const Icon = meta?.icon || Package;
              const label = meta
                ? isBangla
                  ? meta.bn
                  : meta.en
                : tab.charAt(0).toUpperCase() + tab.slice(1);

              return (
                <button
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border flex items-center gap-2 ${
                    activeCategory === tab
                      ? "bg-[#F3056D] text-white border-[#F3056D] shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCTS SECTION ═══ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#111827] flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-[#F3056D]" />
              {uiText.popularTitle}
            </h2>
            {!isLoading && !isError && (
              <span className="text-sm text-gray-500">
                {uiText.foundText}
                {displayProducts.length}
                {uiText.foundSuffix}
              </span>
            )}
          </div>

          {/* ── LOADING STATE ── */}
          {isLoading && (
            <div className="flex flex-wrap justify-start gap-6 md:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* ── ERROR STATE ── */}
          {isError && !isLoading && (
            <div className="flex justify-center w-full py-10">
              <div className="bg-white rounded-[30px] border-2 border-red-200 p-10 md:p-16 shadow-xl flex flex-col items-center justify-center min-h-[400px] w-full max-w-2xl text-center">
                <div className="bg-red-50 rounded-full p-6 mb-6 border-2 border-dashed border-red-300">
                  <Clock size={64} className="text-red-400" />
                </div>
                <h3 className="text-red-600 font-bold text-2xl md:text-3xl mb-2">
                  {uiText.errorTitle}
                </h3>
                <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto mb-6">
                  {uiText.errorDesc}
                </p>
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#214187] text-white font-bold text-sm hover:bg-[#1a2f6e] transition-colors shadow-lg disabled:opacity-60"
                >
                  {isFetching ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {uiText.retryBtn}
                </button>
              </div>
            </div>
          )}

          {/* ── PRODUCTS GRID ── */}
          {!isLoading && !isError && displayProducts.length > 0 && (
            <div className="flex flex-wrap justify-start gap-6 md:gap-8">
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  ctaCardLabel={uiText.ctaCardLabel}
                />
              ))}
            </div>
          )}

          {/* ── EMPTY / COMING SOON ── */}
          {!isLoading &&
            !isError &&
            displayProducts.length === 0 &&
            rawProducts.length === 0 && (
              <div className="flex justify-center w-full py-10">
                <div className="bg-white rounded-[30px] border-2 border-[#FF8FCA] p-10 md:p-16 shadow-xl flex flex-col items-center justify-center min-h-[400px] w-full max-w-2xl text-center">
                  <div className="bg-pink-50 rounded-full p-6 mb-6 border-2 border-dashed border-pink-300">
                    <Clock size={64} className="text-[#D81B60]" />
                  </div>
                  <h3 className="text-[#D81B60] tracking-[0%] leading-[140%] font-bold text-3xl md:text-4xl mb-2">
                    {uiText.comingSoonTitle}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {uiText.comingSoonSub}
                  </p>
                  <p className="text-gray-500 mt-4 text-sm max-w-md mx-auto">
                    {uiText.comingSoonDesc}
                  </p>
                </div>
              </div>
            )}

          {/* ── NO RESULTS (products exist but filter/search yields nothing) ── */}
          {!isLoading &&
            !isError &&
            rawProducts.length > 0 &&
            displayProducts.length === 0 && (
              <div className="flex justify-center w-full py-10">
                <div className="bg-white rounded-[30px] border-2 border-gray-200 p-10 md:p-16 shadow-xl flex flex-col items-center justify-center min-h-[300px] w-full max-w-2xl text-center">
                  <div className="bg-gray-50 rounded-full p-6 mb-6 border-2 border-dashed border-gray-300">
                    <Search size={64} className="text-gray-300" />
                  </div>
                  <h3 className="text-gray-700 font-bold text-2xl mb-2">
                    {isBangla
                      ? "কোনো প্রোডাক্ট পাওয়া যায়নি"
                      : "No Products Found"}
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto mb-6">
                    {isBangla
                      ? `"${searchTerm}" দিয়ে কোনো প্রোডাক্ট মেলেনি। অন্য কিছু দিয়ে খুঁজুন।`
                      : `No products match "${searchTerm}". Try a different search term.`}
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategory("all");
                    }}
                    className="px-6 py-3 rounded-xl bg-[#F3056D] text-white font-bold text-sm hover:bg-[#d9045e] transition-colors shadow-lg"
                  >
                    {isBangla ? "ফিল্টার মুছুন" : "Clear Filters"}
                  </button>
                </div>
              </div>
            )}
        </div>
      </section>
    </div>
  );
}
