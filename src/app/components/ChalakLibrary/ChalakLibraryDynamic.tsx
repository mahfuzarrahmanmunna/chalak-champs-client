"use client";

import Button from "@/app/ui/button/Button";
import { ArrowRight, ArrowLeft, Layers, Tag } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef, useMemo, TouchEvent } from "react";
import Link from "next/link";
import EyeIcon from "../ChalakCourses/EyeIcon";
import api from "@/lib/api";
import { useLanguage } from "@/app/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";

// --- Types ---
interface LibraryItem {
  _id: string;
  id: number;
  slug: string;
  image: string;
  badge: string;
  badge2?: string;
  title: string;
}

// --- Helper: safely parse "{en:..., bn:...}" JSON or plain string ---
const parseBilingual = (
  value: any,
  fallback: string = "",
): { en: string; bn: string } => {
  if (!value) return { en: fallback, bn: fallback };
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === "object" && parsed.en !== undefined) return parsed;
      return { en: String(value), bn: String(value) };
    } catch {
      return { en: String(value), bn: String(value) };
    }
  }
  if (typeof value === "object" && value.en !== undefined) return value;
  return { en: String(value || fallback), bn: String(value || fallback) };
};

// --- Helper: safely extract a string from any value ---
const safeStr = (val: any): string => {
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null) {
    // If it's a bilingual object, try to get .en
    if ("en" in val) return String(val.en || "");
    // Otherwise stringify
    try {
      return JSON.stringify(val);
    } catch {
      return "";
    }
  }
  return String(val || "");
};

// =============================================
// MAIN COMPONENT
// =============================================
const ChalakLibraryDynamic = () => {
  const { isBangla } = useLanguage();
  const locale = isBangla ? "bn" : "en";

  // Prevent Hydration Mismatch
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- Static bilingual UI text ---
  const uiText = {
    titlePrefix: isBangla ? "চালাক" : "Chalak",
    titleSuffix: isBangla ? "লাইব্রেরি" : "Library",
    shortDescription: isBangla
      ? "আমাদের বই এবং শেখার উপকরণের অসাধারণ সংগ্রহ দেখুন।"
      : "Explore our amazing collection of books and learning materials.",
    ctaCard: isBangla ? "বিস্তারিত" : "View Details",
    ctaFooter: isBangla ? "সব দেখুন" : "View All",
    swipeHint: isBangla ? "আরও দেখতে সোয়াইপ করুন" : "Swipe to view more",
    noImage: isBangla ? "ছবি নেই" : "No Image",
  };

  // Fetch data using TanStack Query
  const { data: rawProducts = [], isLoading } = useQuery<any[]>({
    queryKey: ["library-products"],
    queryFn: async () => {
      const response = await api.get("/products");
      if (response.data?.success) {
        return response.data.data || [];
      }
      throw new Error("Failed to fetch library data");
    },
  });

  // Transform raw data reactively when language changes
  const libraryDataItems: LibraryItem[] = useMemo(() => {
    return rawProducts.map((p, index) => {
      const parsedTitle = parseBilingual(p.title, "Untitled");
      const parsedBadge = parseBilingual(p.badge, "Product");

      let badge2 = "";
      if (p.originalFee && p.originalFee > p.fee) {
        const discount = Math.round(
          ((p.originalFee - p.fee) / p.originalFee) * 100,
        );
        badge2 = `${discount}% OFF`;
      }

      return {
        _id: p._id,
        id: index + 1,
        slug: p.slug || p._id,
        image: p.image || "",
        badge: safeStr(isBangla ? parsedBadge.bn : parsedBadge.en),
        badge2: badge2,
        title: safeStr(isBangla ? parsedTitle.bn : parsedTitle.en),
      };
    });
  }, [rawProducts, isBangla]);

  // --- Slider State ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const [cardWidthStep, setCardWidthStep] = useState(328);
  const [centerOffset, setCenterOffset] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // --- 1. Responsive Dimensions ---
  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      const isMobile = screenWidth < 768;

      const newVisibleCount = isMobile ? 1 : 3;
      setVisibleCount(newVisibleCount);
      setShowArrows(libraryDataItems.length > newVisibleCount);

      let calculatedStep = 328;
      let calculatedOffset = 0;

      if (isMobile) {
        const cardWidth = screenWidth * 0.85;
        calculatedStep = cardWidth + 24;
        calculatedOffset = (screenWidth - cardWidth) / 2;
      }

      setCardWidthStep(calculatedStep);
      setCenterOffset(calculatedOffset);
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (cardRef.current) resizeObserver.observe(cardRef.current);
    window.addEventListener("resize", updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [libraryDataItems]);

  // --- 2. Slider Logic ---
  const maxIndex = showArrows
    ? Math.max(0, libraryDataItems.length - visibleCount)
    : 0;

  const nextSlide = () => {
    if (showArrows) {
      setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    }
  };

  const prevSlide = () => {
    if (showArrows) {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    }
  };

  const handleRightClick = () => {
    setDirection("right");
    resetAutoplay();
    nextSlide();
  };

  const handleLeftClick = () => {
    setDirection("left");
    resetAutoplay();
    prevSlide();
  };

  // --- 3. Touch / Swipe ---
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = e.touches[0].clientX;
    setIsDragging(true);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;

    if (diff > 50) {
      setDirection("right");
      nextSlide();
    } else if (diff < -50) {
      setDirection("left");
      prevSlide();
    }

    startAutoplay();
  };

  // --- 4. Autoplay ---
  const startAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (direction === "right") {
        nextSlide();
      } else {
        prevSlide();
      }
    }, 3000);
  };

  const resetAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    startAutoplay();
  };

  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, direction, showArrows, maxIndex]);

  // --- 5. Pagination Dots ---
  const renderPaginationDots = () => {
    if (!showArrows) return null;
    const totalPages = maxIndex + 1;
    return Array.from({ length: totalPages }).map((_, idx) => (
      <button
        key={idx}
        onClick={() => {
          setCurrentIndex(idx);
          resetAutoplay();
        }}
        className={`h-2.5 rounded-full transition-all duration-300 ${
          currentIndex === idx
            ? "w-6 bg-[#E2136E]"
            : "w-2.5 bg-gray-300 hover:bg-gray-400"
        }`}
        aria-label={`Go to slide ${idx + 1}`}
      />
    ));
  };

  // --- Skeleton Card ---
  const SkeletonCard = () => (
    <div className="shrink-0 w-[86vw] md:w-[304px]">
      <div className="max-w-80 mx-auto h-132 shadow bg-linear-to-b from-[#FF8FCA] to-[#D9D9D9] rounded-[22px] p-0.5 animate-pulse">
        <div className="w-full h-full rounded-[20px] p-2 bg-[#F9FAFC]">
          <div className="md:w-71 md:h-71 w-74 h-73 bg-gray-200 rounded-2xl" />
          <div className="flex flex-col justify-center items-center">
            <div className="flex items-center flex-col justify-center gap-2 mt-2 w-full">
              <div className="w-24 h-7 bg-gray-200 rounded-full" />
              <div className="w-20 h-6 bg-gray-200 rounded-full" />
            </div>
            <div className="flex flex-col items-center w-full px-2">
              <div className="w-48 h-7 bg-gray-200 rounded-lg mt-[15px]" />
              <div className="w-28 h-9 bg-gray-200 rounded-xl mt-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ✅ FIX: Skeleton must match real content's className structure EXACTLY
  // Real content has: <div className="text-center"> then <p className="... mb-8">
  // So skeleton must have: <div className="text-center"> then <div ...mb-8>
  if (!isMounted) {
    return (
      <div className="max-w-[1120px] overflow-hidden mx-auto">
        <div className="text-center">
          <div className="h-12 w-64 bg-gray-200 animate-pulse mx-auto rounded-lg mb-4" />
          <div className="h-6 w-96 max-w-full bg-gray-200 animate-pulse mx-auto rounded-lg mb-8" />
        </div>
        <div className="flex gap-6 justify-center">
          <SkeletonCard />
          <div className="hidden md:block">
            <SkeletonCard />
          </div>
          <div className="hidden md:block">
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1120px] overflow-hidden mx-auto">
      {/* Header — className="text-center" matches skeleton exactly */}
      <div className="text-center">
        <h3 className="font-bold py-2 tracking-[-5%] mb-2 leading-5 text-2xl md:text-5xl">
          <span className="text-secondary">{String(uiText.titlePrefix)}</span>{" "}
          <span className="relative inline-block px-3 py-1 md:py-5 group">
            <span className="absolute inset-0 border-2 md:border-[3px] border-dashed border-pink-500" />
            <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600" />
            <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600" />
            <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600" />
            <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600" />
            <span className="text-primary">{String(uiText.titleSuffix)}</span>
          </span>
        </h3>
        <p className="text-gray-600 mb-8 text-lg">
          {String(uiText.shortDescription)}
        </p>
      </div>

      {/* Slider Wrapper */}
      <div className="relative w-full max-w-[960px] mx-auto group">
        {/* Left Arrow */}
        {showArrows && !isLoading && (
          <button
            onClick={handleLeftClick}
            className="absolute -left-5 top-1/2 cursor-pointer -translate-y-1/2 -translate-x-2 md:-translate-x-12 z-20 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors hidden md:block"
            aria-label="Previous Slide"
          >
            <ArrowLeft className="text-gray-700" size={24} />
          </button>
        )}

        {/* Slider Viewport */}
        <div
          className="overflow-hidden w-full select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={sliderRef}
            className={`flex gap-6 items-center transition-transform duration-500 ease-in-out will-change-transform ${
              !showArrows && !isLoading ? "justify-center" : "justify-start"
            }`}
            style={{
              transform:
                showArrows && !isLoading
                  ? `translateX(${centerOffset - currentIndex * cardWidthStep}px)`
                  : "translateX(0px)",
            }}
          >
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={`skeleton-${i}`} />
                ))
              : libraryDataItems.map((item, index) => (
                  <div
                    key={item._id}
                    ref={index === 0 ? cardRef : null}
                    className="shrink-0 w-[86vw] md:w-[304px]"
                  >
                    <div className="max-w-80 mx-auto h-132 shadow bg-linear-to-b from-[#FF8FCA] to-[#D9D9D9] rounded-[22px] p-0.5">
                      <div className="w-full h-full rounded-[20px] p-2 bg-[#F9FAFC]">
                        <div className="md:w-71 md:h-71 w-74 h-73 bg-[#001D3A0D] rounded-2xl relative overflow-hidden">
                          {item.image ? (
                            <Image
                              src={
                                item.image.startsWith("http")
                                  ? item.image
                                  : `https://${item.image}`
                              }
                              alt={String(item.title)}
                              fill
                              className="object-cover w-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                              {String(uiText.noImage)}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center items-center">
                          <div className="flex items-center flex-col justify-center gap-2 mt-2 w-full flex-wrap">
                            <div className="flex items-center gap-1.5 text-black text-sm bg-[#1B386B26] rounded-full px-3 py-1.5 shadow-sm border border-white/50">
                              <Layers size={14} className="text-[#1B386B]" />
                              <p>{String(item.badge)}</p>
                            </div>

                            {item.badge2 && (
                              <div className="flex items-center gap-1.5 text-[#E2136E] text-xs bg-[#FCE7F3] rounded-full px-3 py-1.5 shadow-sm border border-white/50">
                                <Tag size={14} />
                                <p>{String(item.badge2)}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-center">
                            <h3 className="text-[#3C4043] text-2xl leading-[140%] tracking-normal font-semibold mt-[15px] text-center px-2">
                              {String(item.title)}
                            </h3>
                            <div className="mt-3">
                              <Link
                                href={`/${locale}/products/${String(item.slug)}`}
                              >
                                <Button
                                  bgColor="#E2136E"
                                  highlightColor="#FC7CB4"
                                  darkShadowColor="#B80E5C"
                                  textColor="white"
                                  hoverTextColor="#E2136E"
                                  textSize="lg"
                                  iconPosition="right"
                                  className="mt-3 flex hover:text-primary text-white items-center gap-2 px-4 py-2 cursor-pointer rounded-xl shadow-[inset_0_3px_0_rgba(255,255,255,0.5)] transition-all active:scale-95"
                                >
                                  <div className="flex items-center gap-2">
                                    {String(uiText.ctaCard)} <EyeIcon />
                                  </div>
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Right Arrow */}
        {showArrows && !isLoading && (
          <button
            onClick={handleRightClick}
            className="absolute -right-5 top-1/2 cursor-pointer -translate-y-1/2 translate-x-2 md:translate-x-12 z-20 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors hidden md:block"
            aria-label="Next Slide"
          >
            <ArrowRight className="text-gray-700" size={24} />
          </button>
        )}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-3 mt-8">
        {!isLoading && renderPaginationDots()}
      </div>

      {/* Mobile Swipe Hint */}
      {showArrows && !isLoading && (
        <div className="md:hidden text-center text-gray-400 text-xs mt-2 animate-pulse">
          {String(uiText.swipeHint)}
        </div>
      )}
    </div>
  );
};

export default ChalakLibraryDynamic;
