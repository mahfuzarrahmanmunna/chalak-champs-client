// src/app/[lang]/products/[slug]/ProductDetailsClient.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Star,
  Package,
  LayoutGrid,
  ListChecks,
  UserCheck,
  Home,
  AlertCircle,
  RefreshCw,
  BookOpen,
  Shirt,
  ShoppingBag,
  Pencil,
  Ruler,
  X,
  PartyPopper,
  Shield,
  Truck,
  Zap,
  Heart,
  Gift,
  Tag,
  ThumbsUp,
  Clock,
  Award,
} from "lucide-react";
import { FaSadCry } from "react-icons/fa";
import { useLanguage } from "@/app/context/LanguageContext";
import Button from "@/app/ui/button/Button";
import axiosInstance from "@/lib/axios";
import OrderModal from "./components/OrderModal";

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */
interface SingleProduct {
  id: string;
  breadcrumbs: string;
  hero: {
    title: string;
    subtitle: string;
    category: string;
    badge: string;
  };
  quickInfo: {
    title: string;
    items: string[];
    offerPrice: string;
    offerText: string;
    cta1: string;
    cta2: string;
    ctaBelow: string;
  };
  description: {
    title: string;
    main: string;
    secondary: string;
  };
  features: {
    title: string;
    cards: Array<{ title: string; body: string }>;
  };
  specs: {
    title: string;
    items: Array<{ label: string; value: string }>;
  };
  whyPoints: {
    title: string;
    items: string[];
  };
  categoryDetails: {
    title: string;
    items: Array<{ label: string; value: string }>;
  };
  image: string;
}

/* ═══════════════════════════════════════════════════
   DATA FLATTENER
   ═══════════════════════════════════════════════════ */
const getLang = (obj: any, lang: "en" | "bn"): string => {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] || obj.en || "";
};

const flattenProductData = (
  apiData: any,
  isBangla: boolean,
): SingleProduct | null => {
  if (!apiData?.success) return null;
  const p = apiData.data;
  const lang = isBangla ? "bn" : "en";

  const featureCards = (p.features || []).map((f: any) => ({
    title: getLang(f.title, lang),
    body: getLang(f.desc, lang),
  }));

  const specItems = (p.specs || []).map((s: any) => ({
    label: getLang(s.label, lang),
    value: getLang(s.value, lang),
  }));

  const highlightItems = (p.highlights || []).map((h: any) => getLang(h, lang));
  const whyPointItems = (p.whyPoints || []).map((w: any) => getLang(w, lang));

  let offerPrice = "";
  let offerText = "";
  if (p.originalFee && p.originalFee > p.fee) {
    offerPrice = `৳${p.originalFee} ৳${p.fee}`;
    offerText = isBangla ? "বিশেষ মূল্যহ্রাস!" : "Special Discount!";
  } else {
    offerPrice = `৳${p.fee}`;
  }

  const catDetailsMap: Record<string, Array<{ l: string; v: any }>> = {
    book: [
      { l: "Author", v: p.author },
      { l: "Pages", v: p.pages },
      { l: "Publisher", v: p.publisher },
      { l: "Edition", v: p.edition },
      { l: "Country", v: p.country },
      { l: "Language", v: p.language },
    ],
    bags: [
      { l: "Material", v: p.bagMaterial },
      { l: "Capacity", v: p.bagCapacity },
      { l: "Dimensions", v: p.bagDimensions },
      { l: "Compartments", v: p.bagCompartments },
    ],
    apparel: [
      { l: "Material", v: p.apparelMaterial },
      { l: "Fit", v: p.apparelFit },
      { l: "Sizes", v: p.apparelSizes },
      { l: "Colors", v: p.apparelColors },
    ],
    stationary: [
      { l: "Type", v: p.stationaryType },
      { l: "Color", v: p.stationaryColor },
      { l: "Pack Size", v: p.stationaryPackSize },
      { l: "Material", v: p.stationaryMaterial },
    ],
  };

  const categoryDetailsItems = (catDetailsMap[p.category] || [])
    .map((item) => ({
      label: item.l,
      value:
        typeof item.v === "object"
          ? getLang(item.v, lang)
          : String(item.v || ""),
    }))
    .filter((item) => item.value && item.value !== "undefined");

  const categoryTitles: Record<string, string> = {
    book: isBangla ? "বই এর বিবরণ" : "Book Details",
    bags: isBangla ? "ব্যাগের বিবরণ" : "Bag Details",
    apparel: isBangla ? "পোশাকের বিবরণ" : "Apparel Details",
    stationary: isBangla ? "স্টেশনারি বিবরণ" : "Stationary Details",
  };

  return {
    id: p._id,
    breadcrumbs: getLang(p.title, lang),
    hero: {
      title: getLang(p.title, lang),
      subtitle: getLang(p.subtitle, lang),
      category: p.category,
      badge: p.badge || "",
    },
    quickInfo: {
      title: isBangla ? "হাইলাইটস" : "Highlights",
      items: highlightItems,
      offerPrice,
      offerText,
      cta1: isBangla ? "অর্ডার করুন" : "Order Now",
      cta2: isBangla ? "ইনকুয়ারি করুন" : "Inquire",
      ctaBelow: "",
    },
    description: {
      title: isBangla ? "বিবরণ" : "Description",
      main: getLang(p.description, lang),
      secondary: getLang(p.secondaryDescription, lang),
    },
    features: {
      title: isBangla ? "ফিচার সমূহ" : "Features",
      cards: featureCards,
    },
    specs: {
      title: isBangla ? "স্পেসিফিকেশন" : "Specifications",
      items: specItems,
    },
    whyPoints: {
      title: isBangla ? "কেন এটি বিশেষ?" : "Why is this special?",
      items: whyPointItems,
    },
    categoryDetails: {
      title: categoryTitles[p.category] || "Details",
      items: categoryDetailsItems,
    },
    image: p.image
      ? p.image.startsWith("http")
        ? p.image
        : `https://${p.image}`
      : "",
  };
};

/* ═══════════════════════════════════════════════════
   SHARED ICON CONFIG (matches course page pattern)
   ═══════════════════════════════════════════════════ */
const iconConfig = [
  { Icon: Shield, color: "text-red-500", bg: "bg-red-50" },
  { Icon: Zap, color: "text-blue-500", bg: "bg-blue-50" },
  { Icon: Truck, color: "text-green-500", bg: "bg-green-50" },
  { Icon: Award, color: "text-purple-500", bg: "bg-purple-50" },
  { Icon: Heart, color: "text-orange-500", bg: "bg-orange-50" },
  { Icon: Clock, color: "text-cyan-500", bg: "bg-cyan-50" },
  { Icon: Gift, color: "text-indigo-500", bg: "bg-indigo-50" },
  { Icon: Tag, color: "text-yellow-600", bg: "bg-yellow-50" },
  { Icon: ThumbsUp, color: "text-pink-500", bg: "bg-pink-50" },
  { Icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
  { Icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
];

const getIconConfig = (idx: number) => iconConfig[idx % iconConfig.length];

/* ═══════════════════════════════════════════════════
   PRODUCT CARD (matches EnrollmentCard design)
   ═══════════════════════════════════════════════════ */
function ProductCard({
  data,
  onOrder,
}: {
  data: SingleProduct;
  onOrder: () => void;
}) {
  const pricingText = data?.quickInfo?.offerPrice || "";
  const parts = pricingText.split(" ").filter(Boolean);
  const originalPrice = parts.length > 2 ? `${parts[0]} ${parts[1]}` : null;
  const currentPrice =
    parts.length > 2 ? `${parts[2]} ${parts[3] || ""}`.trim() : pricingText;

  return (
    <div className="">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* ── IMAGE SECTION ── */}
        <div className="relative h-[220px] bg-gray-100 overflow-hidden rounded-t-xl">
          {data.image ? (
            <Image
              src={data.image}
              alt={data.hero.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <Package className="h-16 w-16 text-gray-300" />
            </div>
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Badge */}
          {data.hero.badge && (
            <div className="absolute top-3 left-3 z-20">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F3056D] text-white shadow-lg">
                {data.hero.badge}
              </span>
            </div>
          )}
        </div>

        {/* ── CARD CONTENT ── */}
        <div className="p-6">
          <div className="flex items-end gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">
              {currentPrice}
            </span>
            {originalPrice && (
              <span className="text-xl text-gray-400 line-through mb-1.5">
                {originalPrice}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 mb-6 min-h-[40px]">
            {data?.quickInfo?.offerText || ""}
          </div>

          <div className="flex flex-col gap-3">
            {/* Primary CTA */}
            <Button
              onClick={onOrder}
              bgColor="#F3056D"
              darkShadowColor="#F3066E"
              highlightColor="#FF8FCA"
              hoverTextColor="#F3056D"
              className="w-full py-3 rounded-lg text-white font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-95 bg-[#F3056D]"
            >
              {data?.quickInfo?.cta1 || "Order Now"}
            </Button>

            {/* Secondary CTA */}
            <Button
              bgColor="#ffffff"
              darkShadowColor="#F3066E"
              highlightColor="#FF8FCA"
              hoverTextColor="#ffffff"
              textColor="#F3056D"
              hoverBgColor="#F3056D"
              onClick={onOrder}
              className=""
            >
              {data?.quickInfo?.cta2 || "Inquire"}
            </Button>
          </div>

          {/* ── HIGHLIGHT LIST WITH COLORFUL ICONS ── */}
          <div className="space-y-3 text-sm text-gray-600 mt-6">
            <p className="font-bold text-gray-900 mb-2">
              {data?.quickInfo?.title || "Highlights"}
            </p>
            {(data?.quickInfo?.items || []).map((item: string, idx: number) => {
              const { Icon, color, bg } = getIconConfig(idx);
              return (
                <div key={idx} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg} ${color}`}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </div>
                  </span>
                  <span className="pt-1.5 leading-relaxed">{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PRODUCT SIDE STICKY (matches EnrollmentSideSticky design)
   ═══════════════════════════════════════════════════ */
function ProductSideSticky({
  data,
  onOrder,
  isVisible,
}: {
  data: SingleProduct;
  onOrder: () => void;
  isVisible: boolean;
}) {
  const pricingText = data?.quickInfo?.offerPrice || "";
  const parts = pricingText.split(" ").filter(Boolean);
  const originalPrice = parts.length > 2 ? `${parts[0]} ${parts[1]}` : null;
  const currentPrice =
    parts.length > 2 ? `${parts[2]} ${parts[3] || ""}`.trim() : pricingText;

  return (
    <div
      className={`transition-all duration-700 ease-out transform ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        {/* ── HEADER / PRICE SECTION ── */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">
              {currentPrice}
            </span>
            {originalPrice && (
              <span className="text-lg text-gray-400 line-through mb-1.5">
                {originalPrice}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {data?.quickInfo?.offerText || ""}
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="p-4 bg-white flex flex-col gap-2 border-b border-gray-100">
          <Button
            onClick={onOrder}
            bgColor="#F3056D"
            darkShadowColor="#F3066E"
            highlightColor="#FF8FCA"
            hoverTextColor="#F3056D"
            className="w-full py-2.5 rounded-lg text-white font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-95 bg-[#F3056D]"
          >
            {data?.quickInfo?.cta1 || "Order Now"}
          </Button>

          <Button
            bgColor="#ffffff"
            darkShadowColor="#F3066E"
            highlightColor="#FF8FCA"
            hoverTextColor="#ffffff"
            textColor="#F3056D"
            hoverBgColor="#F3056D"
            onClick={onOrder}
            className="text-sm py-2"
          >
            {data?.quickInfo?.cta2 || "Inquire"}
          </Button>
        </div>

        {/* ── FULL LIST SECTION (SCROLLABLE) ── */}
        <div className="p-5 max-h-[500px] overflow-y-auto custom-scrollbar">
          <p className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide opacity-80">
            {data?.quickInfo?.title || "Highlights"}
          </p>

          <div className="space-y-0.5">
            {(data?.quickInfo?.items || []).map((item: string, idx: number) => {
              const { Icon, color, bg } = getIconConfig(idx);
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <span className="mt-0.5 flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${bg} ${color}`}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </div>
                  </span>
                  <span className="text-sm text-gray-700 leading-relaxed pt-1.5">
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FOOTER NOTE ── */}
        <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {data?.quickInfo?.ctaBelow || ""}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SKELETON — pixel-perfect shimmer matching the course layout
   ═══════════════════════════════════════════════════ */
function Sk({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="skel-shine" />
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen mt-12 text-gray-900 font-sans bg-[#FAFAFA] skel-root">
      {/* ── Breadcrumb ── */}
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Sk className="h-4 w-10 rounded" delay={0} />
            <Sk className="h-2.5 w-2.5 rounded-full" delay={40} />
            <Sk className="h-4 w-16 rounded" delay={80} />
            <Sk className="h-2.5 w-2.5 rounded-full" delay={120} />
            <Sk className="h-4 w-24 rounded" delay={160} />
          </div>
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* ── LEFT COLUMN (65%) ── */}
          <div className="w-full lg:w-[65%] order-2 lg:order-1 space-y-10">
            {/* Back link */}
            <Sk className="h-5 w-36 rounded" delay={0} />

            {/* Hero title + subtitle */}
            <div className="space-y-4">
              <Sk className="h-10 md:h-14 w-full rounded-xl" delay={60} />
              <Sk className="h-10 md:h-14 w-4/5 rounded-xl" delay={100} />
              <Sk className="h-6 w-full rounded-lg" delay={140} />
              <Sk className="h-6 w-5/6 rounded-lg" delay={180} />
            </div>

            {/* Mobile product card (md:hidden) */}
            <div className="md:hidden">
              <div className="w-full rounded-[30px] border-2 border-gray-200 p-2 pb-5 space-y-4">
                <Sk className="w-full aspect-video rounded-[25px]" delay={0} />
                <div className="px-2 space-y-3">
                  <Sk className="h-8 w-32 rounded-lg" delay={40} />
                  <div className="space-y-2">
                    <Sk className="h-4 w-full rounded" delay={60} />
                    <Sk className="h-4 w-5/6 rounded" delay={80} />
                    <Sk className="h-4 w-4/6 rounded" delay={100} />
                  </div>
                  <Sk className="h-12 w-full rounded-xl" delay={40} />
                  <Sk
                    className="h-10 w-full rounded-xl !bg-gray-100"
                    delay={60}
                  />
                </div>
              </div>
            </div>

            {/* Sticky tab bar */}
            <div className="rounded-2xl border border-gray-200 bg-white/95 p-2 space-y-0">
              <div className="flex gap-2 overflow-hidden">
                <Sk className="h-10 w-28 rounded-xl flex-shrink-0" delay={0} />
                <Sk className="h-10 w-24 rounded-xl flex-shrink-0" delay={60} />
                <Sk
                  className="h-10 w-32 rounded-xl flex-shrink-0"
                  delay={120}
                />
                <Sk
                  className="h-10 w-20 rounded-xl flex-shrink-0"
                  delay={180}
                />
                <Sk
                  className="h-10 w-16 rounded-xl flex-shrink-0"
                  delay={240}
                />
              </div>
            </div>

            {/* ── Description section ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Sk className="h-8 w-1 rounded-full" delay={0} />
                <Sk className="h-8 w-48 rounded-lg" delay={40} />
              </div>
              <Sk className="h-44 w-full rounded-2xl" delay={80} />
            </div>

            {/* ── Features section (dark block) ── */}
            <div className="w-full bg-gray-300 rounded-2xl p-6 md:p-8 space-y-5">
              <Sk className="h-7 w-48 rounded-lg !bg-gray-400" delay={0} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="space-y-3 p-4 rounded-xl bg-gray-400/40"
                  >
                    <Sk
                      className="h-10 w-10 rounded-xl !bg-gray-500"
                      delay={i * 60}
                    />
                    <Sk
                      className="h-5 w-3/4 rounded !bg-gray-500"
                      delay={i * 60 + 40}
                    />
                    <Sk
                      className="h-4 w-full rounded !bg-gray-500"
                      delay={i * 60 + 80}
                    />
                    <Sk
                      className="h-4 w-5/6 rounded !bg-gray-500"
                      delay={i * 60 + 120}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Specifications section ── */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 space-y-5">
              <Sk className="h-8 w-44 rounded-lg" delay={0} />
              <Sk className="h-5 w-full rounded" delay={40} />
              <Sk className="h-5 w-5/6 rounded" delay={80} />
              <div className="space-y-3 pt-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Sk
                      className="h-6 w-6 rounded-full flex-shrink-0"
                      delay={i * 50}
                    />
                    <Sk className="h-5 w-full rounded" delay={i * 50 + 30} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Why Points (two-column grid like Syllabus) ── */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Sk className="h-8 w-1 rounded-full" delay={0} />
                <Sk className="h-8 w-52 rounded-lg" delay={40} />
              </div>
              <Sk className="h-5 w-2/3 rounded" delay={80} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 space-y-4"
                  >
                    <Sk className="h-5 w-full rounded" delay={i * 50} />
                    <Sk className="h-5 w-4/5 rounded" delay={i * 50 + 40} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Category Details (like Instructor) ── */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 space-y-5">
              <Sk className="h-6 w-32 rounded-full" delay={0} />
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Sk
                  className="w-24 h-24 md:w-28 md:h-28 rounded-2xl flex-shrink-0"
                  delay={40}
                />
                <div className="flex-1 space-y-3 w-full">
                  <Sk className="h-7 w-40 rounded-lg" delay={60} />
                  <Sk className="h-5 w-32 rounded" delay={100} />
                  <Sk className="h-5 w-full rounded" delay={140} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-5 space-y-2">
                    <Sk className="h-3 w-16 rounded" delay={i * 40} />
                    <Sk className="h-5 w-24 rounded" delay={i * 40 + 20} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (35%) ── */}
          <div className="w-full lg:w-[35%] order-1 mt-0 lg:order-2 space-y-6">
            {/* Desktop product card */}
            <div className="hidden md:block">
              <div className="w-full rounded-[30px] border-2 border-gray-200 p-2 pb-5 space-y-4">
                <Sk className="w-full aspect-video rounded-[25px]" delay={0} />
                <div className="px-2 space-y-3">
                  <Sk className="h-8 w-32 rounded-lg" delay={40} />
                  <div className="space-y-2">
                    <Sk className="h-4 w-full rounded" delay={60} />
                    <Sk className="h-4 w-5/6 rounded" delay={80} />
                    <Sk className="h-4 w-4/6 rounded" delay={100} />
                    <Sk className="h-4 w-full rounded" delay={120} />
                  </div>
                  <Sk className="h-12 w-full rounded-xl" delay={40} />
                  <Sk
                    className="h-10 w-full rounded-xl !bg-gray-100"
                    delay={60}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-300 rounded-3xl p-8 md:p-12 space-y-5 text-center">
          <Sk className="h-10 w-72 mx-auto rounded-xl !bg-gray-400" delay={0} />
          <Sk
            className="h-6 w-full max-w-3xl mx-auto rounded !bg-gray-400"
            delay={40}
          />
          <Sk
            className="h-6 w-2/3 max-w-3xl mx-auto rounded !bg-gray-400"
            delay={80}
          />
          <div className="flex justify-center gap-4 pt-2">
            <Sk className="h-14 w-48 rounded-xl !bg-gray-400" delay={60} />
            <Sk className="h-14 w-40 rounded-xl !bg-gray-400" delay={100} />
          </div>
          <Sk
            className="h-8 w-48 mx-auto rounded-full !bg-gray-400"
            delay={40}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════ */
const ProductDecorate = ({
  cards,
  title,
}: {
  cards: Array<{ title: string; body: string }>;
  title: string;
}) => (
  <section
    id="features"
    className="w-full bg-[#214187] border-2 border-[#FF8FCA] rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl"
  >
    <div className="container mx-auto max-w-6xl relative z-10">
      <div className="mb-6">
        <h2 className="font-bold text-xl md:text-2xl text-white tracking-wide">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {cards.map((feature, index) => (
          <div
            key={index}
            className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
          >
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#F3056D] shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-200 text-sm md:text-base leading-relaxed font-normal">
                  {feature.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CategoryDetailsSection = ({ data }: { data: SingleProduct }) => {
  const { isBangla } = useLanguage();

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "book":
        return <BookOpen className="h-4 w-4" />;
      case "apparel":
        return <Shirt className="h-4 w-4" />;
      case "bags":
        return <ShoppingBag className="h-4 w-4" />;
      case "stationary":
        return <Pencil className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="scroll-mt-36 md:scroll-mt-40 mb-12">
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-pink-100/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-blue-100/40 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[14px] font-semibold bg-[#F3056D]/10 text-[#F3056D] border border-[#F3056D]/20 mb-6">
            <Star className="h-3.5 w-3.5 fill-[#F3056D] text-[#F3056D]" />
            {data.categoryDetails.title}
          </span>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-[#214187] to-[#1e3a8a] flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white/20 overflow-hidden">
              {data.image ? (
                <img
                  src={data.image}
                  alt={data.hero.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-10 w-10 text-white/70" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                {isBangla ? "পণ্যের বিবরণ" : "Product Details"}
              </h3>
              <p className="text-[16px] text-gray-600 leading-relaxed">
                {data.hero.title}
              </p>
            </div>
          </div>

          {/* Category Detail Items Grid */}
          {data.categoryDetails.items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {data.categoryDetails.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border-2 border-gray-100 p-5 hover:border-pink-200 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center bg-[#F3056D]/10 text-[#F3056D] group-hover:bg-[#F3056D] group-hover:text-white transition-colors duration-300">
                      {getCategoryIcon(data.hero.category)}
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-gray-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function ProductNotFound({ isBangla, id }: { isBangla: boolean; id: string }) {
  const router = useRouter();
  return (
    <div className="min-h-screen mt-12 flex items-center justify-center bg-[#FAFAFA]">
      <div className="text-center px-6 max-w-lg">
        <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <Package className="h-10 w-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {isBangla ? "পণ্য পাওয়া যায়নি" : "Product Not Found"}
        </h1>
        <p className="text-gray-500 mb-8 text-[15px] leading-relaxed">
          {isBangla
            ? `এই আইডির কোনো পণ্য খুঁজে পাওয়া যায়নি।`
            : `No product found with this ID.`}
        </p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 bg-[#214187] text-white font-bold text-[14px] hover:bg-[#1a2f6e] transition-colors shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          {isBangla ? "ফিরে যান" : "Go Back"}
        </button>
      </div>
    </div>
  );
}

function ProductError({
  isBangla,
  onRetry,
  isFetching,
}: {
  isBangla: boolean;
  onRetry: () => void;
  isFetching: boolean;
}) {
  return (
    <div className="min-h-screen mt-12 flex items-center justify-center bg-[#FAFAFA]">
      <div className="text-center px-6 max-w-lg">
        <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {isBangla ? "পণ্য লোড করতে সমস্যা" : "Failed to Load Product"}
        </h1>
        <p className="text-gray-500 mb-8 text-[15px] leading-relaxed">
          {isBangla
            ? "দুঃখিত, পণ্যের তথ্য লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
            : "Sorry, something went wrong while loading the product. Please try again."}
        </p>
        <button
          onClick={onRetry}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 bg-[#214187] text-white font-bold text-[14px] hover:bg-[#1a2f6e] transition-colors shadow-lg disabled:opacity-60"
        >
          {isFetching ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isBangla ? "আবার চেষ্টা করুন" : "Try Again"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function ProductDetailsClient({
  lang,
  slug,
}: {
  lang: string;
  slug: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isBangla, getLink } = useLanguage();

  const productId = searchParams.get("id") || slug;

  const {
    data: productData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["product-detail", productId, isBangla],
    queryFn: async () => {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(productId);
      const endpoint = isObjectId
        ? `/api/products/${productId}`
        : `/api/products/slug/${productId}`;

      const response = await axiosInstance.get(endpoint);
      return flattenProductData(response.data, isBangla);
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey?.[1] === productId ? previousData : undefined,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  const data = productData || null;

  const [activeTab, setActiveTab] = useState("description");
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [showSideSticky, setShowSideSticky] = useState(false);
const [showOrderModal, setShowOrderModal] = useState(false);
const [orderSuccess, setOrderSuccess] = useState(false);

  const featuresRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const whyPointsRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const categoryDetailsRef = useRef<HTMLDivElement>(null);

  const sections = [
    {
      id: "description",
      label: isBangla ? "বিবরণ" : "Description",
      icon: LayoutGrid,
    },
    {
      id: "features",
      label: isBangla ? "ফিচার" : "Features",
      icon: ListChecks,
    },
    {
      id: "specs",
      label: isBangla ? "স্পেসিফিকেশন" : "Specifications",
      icon: UserCheck,
    },
    {
      id: "whyPoints",
      label: isBangla ? "কেন বিশেষ?" : "Why Special?",
      icon: Star,
    },
    {
      id: "categoryDetails",
      label: isBangla ? "বিবরণ" : "Details",
      icon: Package,
    },
  ].filter(
    (s) =>
      s.id !== "categoryDetails" ||
      (data?.categoryDetails.items && data.categoryDetails.items.length > 0),
  );

  useEffect(() => {
    if (!data) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveTab(entry.target.id);
        });
      },
      { threshold: 0.3 },
    );
    const refs = [
      { current: descriptionRef.current, id: "description" },
      { current: featuresRef.current, id: "features" },
      { current: specsRef.current, id: "specs" },
      { current: whyPointsRef.current, id: "whyPoints" },
      { current: categoryDetailsRef.current, id: "categoryDetails" },
    ];
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    const handleScroll = () => {
      setShowStickyCta(window.scrollY > 300);
      setShowSideSticky(window.scrollY > 1500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      refs.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
      window.removeEventListener("scroll", handleScroll);
    };
  }, [data]);

  const scrollToSection = (id: string) => {
    const refs: {
      [key: string]: React.RefObject<HTMLDivElement | null>;
    } = {
      description: descriptionRef,
      features: featuresRef,
      specs: specsRef,
      whyPoints: whyPointsRef,
      categoryDetails: categoryDetailsRef,
    };
    const ref = refs[id];
    if (ref?.current)
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

const handleOrder = () => {
  setShowOrderModal(true);
};

  if (isLoading) return <ProductDetailSkeleton />;
  if (isError)
    return (
      <ProductError
        isBangla={isBangla}
        onRetry={() => refetch()}
        isFetching={isFetching}
      />
    );
  if (!data) return <ProductNotFound isBangla={isBangla} id={productId} />;

  const priceParts = data.quickInfo.offerPrice.split(" ");
  const displayPrice =
    priceParts.length > 2
      ? `${priceParts[2]} ${priceParts[3]}`
      : data.quickInfo.offerPrice;
  const originalPrice =
    priceParts.length > 2 ? `${priceParts[0]} ${priceParts[1]}` : "";

  const breadcrumbItems = [
    {
      label: isBangla ? "হোম" : "Home",
      href: `/${lang}`,
      icon: Home,
    },
    {
      label: isBangla ? "পণ্যসমূহ" : "Products",
      href: getLink("/products"),
      icon: null,
    },
    {
      label: data.breadcrumbs || (isBangla ? "বিস্তারিত" : "Details"),
      href: null,
      icon: null,
    },
  ];

  return (
    <div className="min-h-screen mt-12 text-gray-900 font-sans relative selection:bg-pink-100 selection:text-pink-900">
      {/* ═══ ORDER SUCCESS TOAST ═══ */}
      {orderSuccess && (
        <div className="fixed top-24 right-4 z-[80] bg-green-50 border-2 border-green-200 rounded-2xl p-4 pr-3 shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-500">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <PartyPopper className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-green-800 text-sm">
              {isBangla ? "অর্ডার সফল!" : "Order Placed!"}
            </p>
            <p className="text-xs text-green-600 mt-0.5">
              {isBangla ? "শীঘ্রই যোগাযোগ করা হবে" : "We will contact you soon"}
            </p>
          </div>
          <button
            onClick={() => setOrderSuccess(false)}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-green-100 transition-colors"
          >
            <X className="h-4 w-4 text-green-400" />
          </button>
        </div>
      )}

      {/* ═══ MOBILE BOTTOM STICKY CTA ═══ */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-end gap-2">
              <span className="text-xl font-bold text-gray-900 truncate">
                {displayPrice}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-400 line-through mb-0.5">
                  {originalPrice}
                </span>
              )}
            </div>
            {data.quickInfo.offerText && (
              <p className="text-[11px] text-gray-500 truncate">
                {data.quickInfo.offerText}
              </p>
            )}
          </div>
          <Button
            onClick={handleOrder}
            bgColor="#F3056D"
            darkShadowColor="#F3066E"
            highlightColor="#FF8FCA"
            hoverTextColor="#F3056D"
            className="flex-shrink-0 px-6 py-2.5 rounded-lg text-white font-bold text-sm shadow-md transition-all active:scale-95 bg-[#F3056D]"
          >
            {data.quickInfo.cta1 || "Order Now"}
          </Button>
        </div>
      )}

      {/* ═══ BREADCRUMB ═══ */}
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap gap-y-1">
              {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;
                return (
                  <li key={index} className="flex items-center">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="group flex items-center gap-1.5 text-sm md:text-[15px] font-medium text-gray-400 hover:text-[#F3056D] transition-all duration-200 px-2 py-1 rounded-lg hover:bg-pink-50/60"
                      >
                        {item.icon && (
                          <item.icon className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#F3056D] transition-colors duration-200" />
                        )}
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <span className="text-sm md:text-[15px] font-semibold text-gray-800 px-2 py-1 bg-gradient-to-r from-pink-50/80 to-blue-50/60 rounded-lg">
                        {item.label}
                      </span>
                    )}
                    {!isLast && (
                      <ChevronRight
                        className="h-3.5 w-3.5 mx-0.5 text-gray-300/80 flex-shrink-0"
                        strokeWidth={2.5}
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      {/* ═══ HERO + MAIN ═══ */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* ── LEFT COLUMN (65%) ── */}
            <div className="w-full lg:w-[65%] order-2 lg:order-1">
              <div className="mb-10">
                <Link
                  href={getLink("/products")}
                  className="inline-flex items-center text-sm md:text-base font-medium mb-4 text-gray-500 hover:text-[#F3056D] transition-colors group"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  {isBangla ? "পণ্যে ফিরে যান" : "Back to Products"}
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight tracking-tight">
                  {data.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  {data.hero.subtitle}
                </p>
              </div>

              {/* Mobile: Product Card */}
              <div className="md:hidden mb-6 flex">
                <ProductCard data={data} onOrder={handleOrder} />
              </div>

              {/* ── Sticky Tab Bar ── */}
              <div className="sticky top-28 md:top-18 lg:top-22 rounded-2xl z-30 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm mb-12 overflow-hidden">
                <nav className="flex space-x-1 md:space-x-2 overflow-x-auto no-scrollbar py-2 px-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`py-2.5 px-4 md:px-5 rounded-xl font-medium text-sm md:text-base whitespace-nowrap transition-all duration-200 flex items-center ${
                          activeTab === section.id
                            ? "bg-[#214187] border-2 border-primary text-white shadow-md scale-[1.02]"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {section.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* ═══ SECTIONS ═══ */}

              {/* ── Description (like Overview) ── */}
              <div
                ref={descriptionRef}
                id="description"
                className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">
                  {data.description.title}
                </h2>
                <div className="bg-gray-50/50 p-6 md:p-8 rounded-2xl border border-gray-100">
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-line">
                    {data.description.main}
                  </p>
                  {data.description.secondary && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-base text-gray-600 leading-relaxed whitespace-pre-line">
                        {data.description.secondary}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Features (like course Features — dark block) ── */}
              <div
                ref={featuresRef}
                id="features"
                className="scroll-mt-36 md:scroll-mt-40 mb-12"
              >
                {data.features.cards.length > 0 ? (
                  <ProductDecorate
                    cards={data.features.cards}
                    title={data.features.title}
                  />
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-400 font-medium">
                      {isBangla
                        ? "কোনো ফিচার যোগ করা হয়নি"
                        : "No features added"}
                    </p>
                  </div>
                )}
              </div>

              {/* ── Specifications (like Who is this for — white card with checkmarks) ── */}
              <div
                ref={specsRef}
                id="specs"
                className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12"
              >
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-6">
                    {data.specs.title}
                  </h3>
                  {data.specs.items.length > 0 ? (
                    <ul className="space-y-4 mb-8">
                      {data.specs.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-base text-gray-700 group"
                        >
                          <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="leading-relaxed">
                            <span className="font-semibold text-gray-900">
                              {item.label}:
                            </span>{" "}
                            {item.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-center py-4">
                      {isBangla
                        ? "কোনো স্পেসিফিকেশন নেই"
                        : "No specifications available"}
                    </p>
                  )}
                </div>
              </div>

              {/* ── Why Points (like Syllabus/Levels — two-column grid cards) ── */}
              <div
                ref={whyPointsRef}
                id="whyPoints"
                className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">
                  {data.whyPoints.title}
                </h2>
                {data.whyPoints.items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.whyPoints.items.map((item, i) => (
                      <div
                        key={i}
                        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group"
                      >
                        <div
                          className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-8 -mt-8 opacity-30 group-hover:opacity-50 transition-opacity ${
                            i % 2 === 0 ? "bg-[#C7EAFF]" : "bg-[#FFD0CD]"
                          }`}
                        />
                        <p className="relative z-10 text-base text-gray-700 leading-relaxed flex items-start gap-3">
                          <ChevronRight
                            className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                              i % 2 === 0 ? "text-[#F3056D]" : "text-[#214187]"
                            }`}
                          />
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    {isBangla ? "কোনো তথ্য নেই" : "No points added"}
                  </p>
                )}
              </div>

              {/* ── Category Details (like Instructor section) ── */}
              {data.categoryDetails.items.length > 0 && (
                <div
                  ref={categoryDetailsRef}
                  id="categoryDetails"
                  className="scroll-mt-36 md:scroll-mt-40"
                >
                  <CategoryDetailsSection data={data} />
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN (35%) ── */}
            <div className="w-full lg:w-[35%] order-1 mt-0 lg:order-2 space-y-6">
              {/* Desktop: Product Card → transitions to Side Sticky */}
              <div className="hidden md:block">
                {/* ProductCard (visible initially, fades out on scroll) */}
                <div
                  className={`transition-all duration-700 ease-out ${
                    showSideSticky
                      ? "opacity-0 max-h-0 overflow-hidden pointer-events-none"
                      : "opacity-100 max-h-[2000px]"
                  }`}
                >
                  <ProductCard data={data} onOrder={handleOrder} />
                </div>

                {/* ProductSideSticky (appears on scroll) */}
                <div className="sticky top-[140px] z-10">
                  <ProductSideSticky
                    data={data}
                    onOrder={handleOrder}
                    isVisible={showSideSticky}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        productId={data.id}
        productTitle={data.hero.title}
        productImage={data.image}
        amount={displayPrice}
        originalAmount={originalPrice || null}
      />
      {/* ═══ FINAL CTA (like course Final CTA) ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-28 md:pb-12">
        <div className="bg-[#214187] rounded-3xl p-8 md:p-12 space-y-6 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-[-30px] left-[-30px] w-40 h-40 bg-[#FF8FCA]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-30px] right-[-30px] w-40 h-40 bg-[#F3056D]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {data.hero.title}
            </h2>
            <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              {data.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <Button
                onClick={handleOrder}
                bgColor="#F3056D"
                darkShadowColor="#F3066E"
                highlightColor="#FF8FCA"
                hoverTextColor="#F3056D"
                className="px-10 py-3.5 rounded-xl text-white font-bold text-base shadow-lg hover:shadow-xl transition-all active:scale-95 bg-[#F3056D]"
              >
                {data.quickInfo.cta1 || "Order Now"}
              </Button>

              <Button
                bgColor="#ffffff"
                darkShadowColor="#F3066E"
                highlightColor="#FF8FCA"
                hoverTextColor="#ffffff"
                textColor="#214187"
                hoverBgColor="#F3056D"
                onClick={handleOrder}
                className="px-8 py-3.5 rounded-xl font-bold text-base border-2 border-white/30"
              >
                {data.quickInfo.cta2 || "Inquire"}
              </Button>
            </div>

            {data.quickInfo.offerText && (
              <p className="text-sm text-gray-400">
                {data.quickInfo.offerText}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
