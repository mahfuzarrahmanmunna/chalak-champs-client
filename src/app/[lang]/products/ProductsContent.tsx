"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, BookOpen, Clock } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import ProductCard from "./ProductCard";
import axios from "@/lib/axios";

// --- HELPER: Handles both Stringified JSON & Objects from DB ---
const getBilingual = (val: any, isBangla: boolean): string => {
  if (!val) return "";
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return isBangla
        ? parsed.bn || parsed.en || ""
        : parsed.en || parsed.bn || "";
    } catch {
      return val; // Fallback if it's just a normal string
    }
  }
  if (typeof val === "object") {
    return isBangla ? val.bn || val.en || "" : val.en || val.bn || "";
  }
  return String(val);
};

// --- SKELETON COMPONENT: Matches exact ProductCard dimensions & gradients ---
const ProductCardSkeleton = () => (
  <div className="w-[86vw] md:w-[304px]">
    <div className="max-w-80 mx-auto h-132 shadow bg-linear-to-b from-[#FF8FCA] to-[#D9D9D9] rounded-[22px] p-0.5">
      <div className="w-full h-full rounded-[20px] p-2 bg-[#F9FAFC]">
        {/* Image Skeleton */}
        <div className="md:w-71 md:h-71 w-74 h-73 bg-gray-200 rounded-2xl animate-pulse" />

        {/* Badges Skeleton */}
        <div className="flex flex-col items-center gap-2 mt-2 w-full">
          <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Title Skeleton */}
        <div className="flex flex-col items-center mt-4 w-full px-4">
          <div className="h-6 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Button Skeleton */}
        <div className="flex justify-center mt-3">
          <div className="h-10 w-36 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

export default function ProductsContent() {
  const { isBangla } = useLanguage();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // --- FETCH REAL DATA ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data?.data || res.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- EXTRACT UNIQUE CATEGORIES DYNAMICALLY ---
  const tabs = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(cats);
  }, [products]);

  // --- FILTER PRODUCTS ---
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;

      if (!searchTerm.trim()) return matchesCategory;

      const searchTokens = searchTerm
        .toLowerCase()
        .split(/\s+/)
        .filter((token) => token.length > 0);

      const titleEn = getBilingual(product.title, false).toLowerCase();
      const titleBn = getBilingual(product.title, true).toLowerCase();
      const category = (product.category || "").toLowerCase();

      const matchesSearch = searchTokens.some(
        (token) =>
          titleEn.includes(token) ||
          titleBn.includes(token) ||
          category.includes(token),
      );

      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, activeCategory]);

  // --- TRANSFORM TO FLAT STRUCTURE FOR PRODUCT CARD ---
  const displayProducts = useMemo(() => {
    return filteredProducts.map((p) => ({
      id: p._id,
      title: getBilingual(p.title, isBangla),
      category: p.category || "Uncategorized",
      subtitle: getBilingual(p.subtitle, isBangla),
      description: getBilingual(p.secondaryDescEn, isBangla),
      image: p.image || null,
      fee: p.fee ? `৳${p.fee}` : "",
      badge: p.badge || null,
      highlights: (p.highlights || [])
        .map((h: any) => getBilingual(h, isBangla))
        .filter(Boolean),
    }));
  }, [filteredProducts, isBangla]);

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
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* ─── HERO SECTION ─── */}
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
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#F3056D]" />
            </div>
            <input
              type="text"
              placeholder={uiText.searchPlaceholder}
              className="w-full text-gray-700 pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#F3056D] focus:ring-4 focus:ring-[#F3056D]/10 outline-none text-lg transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filters (Dynamic) */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                activeCategory === "all"
                  ? "bg-[#F3056D] text-white border-[#F3056D] shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {uiText.allFilter}
            </button>

            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  activeCategory === tab
                    ? "bg-[#F3056D] text-white border-[#F3056D] shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS SECTION ─── */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#111827] flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-[#F3056D]" />
              {uiText.popularTitle}
            </h2>
            {!loading && (
              <span className="text-sm text-gray-500">
                {uiText.foundText} {displayProducts.length}
                {uiText.foundSuffix}
              </span>
            )}
          </div>

          {loading ? (
            /* ── SKELETON GRID (Left Aligned) ── */
            <div className="flex flex-wrap justify-start gap-6 md:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : displayProducts.length > 0 ? (
            /* ── REAL GRID (Left Aligned) ── */
            <div className="flex flex-wrap justify-start gap-6 md:gap-8">
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  ctaCardLabel={uiText.ctaCardLabel}
                />
              ))}
            </div>
          ) : (
            /* ── Empty / Coming-soon state ── */
            <div className="flex justify-center w-full py-10">
              <div className="bg-white rounded-[30px] border-2 border-[#FF8FCA] p-10 md:p-16 shadow-xl flex flex-col items-center justify-center min-h-[400px] w-full max-w-2xl text-center">
                <div className="bg-pink-50 rounded-full p-6 mb-6 border-2 border-dashed border-pink-300">
                  <Clock size={64} className="text-[#D81B60]" />
                </div>
                <h3 className="text-[#D81B60] tracking-[0%] leading-[140%] font-bold text-3xl md:text-4xl mb-2">
                  {uiText.comingSoonTitle}
                </h3>
                <p className="text-gray-600 text-lg">{uiText.comingSoonSub}</p>
                <p className="text-gray-500 mt-4 text-sm max-w-md mx-auto">
                  {uiText.comingSoonDesc}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
