"use client";

import Button from "@/app/ui/button/Button";
import {  ArrowRight, ArrowLeft, Layers, Tag } from "lucide-react"; // Added Layers and Tag icons
import Image from "next/image";
import React, { useState, useEffect, useRef, TouchEvent } from "react";
import { useLanguage } from "@/app/context/LanguageContext"; // Adjust path
import Link from "next/link";
import EyeIcon from "../ChalakCourses/EyeIcon";

// Types
interface LibraryItem {
  id: number;
  image: string;
  badge: string;
  badge2?: string; // Added badge2 property
  title: string;
}

const ChalakLibrary = () => {
  // 1. Get data from context
  const { libraryData } = useLanguage();

  // Data Array from Context
  const libraryDataItems: LibraryItem[] = libraryData.items || [];

  // State for Slider
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");

  // Dynamic Dimensions State
  const [cardWidthStep, setCardWidthStep] = useState(328);
  const [centerOffset, setCenterOffset] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isDragging, setIsDragging] = useState(false);

  // NEW: State to show/hide arrows based on content length
  const [showArrows, setShowArrows] = useState(false);

  // Refs
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // --- 1. Responsive Dimensions Calculation ---
  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      const isMobile = screenWidth < 768; // Tailwind md breakpoint

      const newVisibleCount = isMobile ? 1 : 3;
      setVisibleCount(newVisibleCount);

      // Calculate if arrows are needed
      setShowArrows(libraryDataItems.length > newVisibleCount);

      let calculatedStep = 328; // Default desktop
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
  }, [libraryDataItems]); // Re-calc if data changes

  // --- 2. Slider Logic ---
  // Limit index only if arrows are visible
  const maxIndex = showArrows
    ? Math.max(0, libraryDataItems.length - visibleCount)
    : 0;

  const nextSlide = () => {
    if (showArrows) {
      if (currentIndex < maxIndex) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex(0); // Loop
      }
    }
  };

  const prevSlide = () => {
    if (showArrows) {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else {
        setCurrentIndex(maxIndex); // Loop
      }
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

  // --- 3. Touch / Swipe Logic ---
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

  // --- 4. Autoplay Logic ---
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

  // --- 5. Render Helper for Pagination ---
  const renderPaginationDots = () => {
    if (!showArrows) return null; // Hide dots if no scrolling needed
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

  return (
    <div className="max-w-[1120px] overflow-hidden mx-auto">
      {/* Header */}
      <div className="text-center">
        <h3 className="font-bold py-2 tracking-[-5%] mb-2 leading-5 text-2xl md:text-5xl">
          <span className="text-secondary">{libraryData.titlePrefix}</span>{" "}
          {/* Suffix part with border - keeping your style but splitting text */}
          <span className="relative inline-block px-3 py-1 md:py-5 group">
            <span className="absolute inset-0 border-2 md:border-[3px] border-dashed border-pink-500"></span>
            <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="text-primary">{libraryData.titleSuffix}</span>
          </span>
        </h3>
        <p className="text-gray-600 mb-8 text-lg">
          {libraryData.shortDescription}
        </p>
      </div>

      {/* Slider Wrapper */}
      <div className="relative w-full max-w-[960px] mx-auto group">
        {/* Left Arrow Button - Conditional Rendering */}
        {showArrows && (
          <button
            onClick={handleLeftClick}
            className="absolute -left-5 top-1/2 cursor-pointer -translate-y-1/2 -translate-x-2 md:-translate-x-12 z-20 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors hidden md:block"
            aria-label="Previous Slide"
          >
            <ArrowLeft className="text-gray-700" size={24} />
          </button>
        )}

        {/* Slider Viewport with Touch Events */}
        <div
          className="overflow-hidden w-full select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={sliderRef}
            className={`flex gap-6 items-center transition-transform duration-500 ease-in-out will-change-transform ${
              !showArrows ? "justify-center" : "justify-start"
            }`}
            style={{
              // Only apply translate if arrows are shown
              transform: showArrows
                ? `translateX(${centerOffset - currentIndex * cardWidthStep}px)`
                : `translateX(0px)`,
            }}
          >
            {libraryDataItems.map((item, index) => (
              <div
                key={item.id}
                ref={index === 0 ? cardRef : null}
                className="shrink-0 w-[86vw] md:w-[304px]"
              >
                {/* CARD DESIGN */}
                <div className="max-w-80 mx-auto h-132  shadow bg-linear-to-b from-[#FF8FCA]  to-[#D9D9D9] rounded-[22px] p-0.5">
                  <div className="w-full h-full rounded-[20px] p-2 bg-[#F9FAFC]">
                    <div className="md:w-71 md:h-71 w-74 h-73 bg-[#001D3A0D] rounded-2xl relative overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover w-full"
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      {/* --- DOUBLE BADGE SECTION --- */}
                      <div className="flex items-center flex-col justify-center gap-2 mt-2 w-full flex-wrap">
                        {/* Badge 1: Blue-ish (Book Type) */}
                        <div className="flex items-center gap-1.5 text-black text-sm bg-[#1B386B26] rounded-full px-3 py-1.5 shadow-sm border border-white/50">
                          <Layers size={14} className="text-[#1B386B]" />
                          <p>{item.badge}</p>
                        </div>

                        {/* Badge 2: Pink-ish (Discount) */}
                        <div className="flex items-center gap-1.5 text-[#E2136E] text-xs bg-[#FCE7F3] rounded-full px-3 py-1.5 shadow-sm border border-white/50">
                          <Tag size={14} />
                          <p>{item.badge2}</p>
                        </div>
                      </div>
                      {/* --- END DOUBLE BADGE SECTION --- */}

                      <div className="flex  flex-col items-center">
                        <h3 className="text-[#3C4043] text-2xl leading-[140%] tracking-normal font-semibold mt-[15px] text-center px-2">
                          {item.title}
                        </h3>
                        {/* CTA Button using Button component */}
                        <div className="mt-3">
                          <Link href={"/en/bookdetails"}>
                            <Button
                              bgColor="#E2136E"
                              highlightColor="#FC7CB4"
                              darkShadowColor="#B80E5C"
                              textColor="white"
                              hoverTextColor="#E2136E"
                              textSize="lg"
                              // icon={<EyeIcon />}
                              iconPosition="right"
                              className="mt-3 flex hover:text-primary text-white items-center gap-2 px-4 py-2 cursor-pointer rounded-xl shadow-[inset_0_3px_0_rgba(255,255,255,0.5)] transition-all active:scale-95"
                            >
                              <div className="flex items-center gap-2">
                                {libraryData.ctaCard} <EyeIcon />
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

        {/* Right Arrow Button - Conditional Rendering */}
        {showArrows && (
          <button
            onClick={handleRightClick}
            className="absolute -right-5 top-1/2 cursor-pointer -translate-y-1/2 translate-x-2 md:translate-x-12 z-20 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors hidden md:block"
            aria-label="Next Slide"
          >
            <ArrowRight className="text-gray-700" size={24} />
          </button>
        )}
      </div>

      {/* Professional Pagination Dots */}
      <div className="flex justify-center items-center gap-3 mt-8">
        {renderPaginationDots()}
      </div>

      {/* Mobile Swipe Hint */}
      {showArrows && (
        <div className="md:hidden text-center text-gray-400 text-xs mt-2 animate-pulse">
          Swipe to view more
        </div>
      )}

      {/* <div className="flex flex-col justify-center items-center my-6">
        <Button px="px-18" textSize="xl" py="py-3" bgColor="#214187">
          <div>{libraryData.ctaFooter} </div>
        </Button>
      </div> */}
    </div>
  );
};

export default ChalakLibrary;
