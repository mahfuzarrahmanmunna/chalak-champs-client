import Button from "@/app/ui/button/Button";
import { Eye, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef, TouchEvent } from "react";

// Types
interface LibraryItem {
  id: number;
  image: string;
  category: string;
  title: string;
}

const ChalakLibrary = () => {
  // Data Array
  const libraryData: LibraryItem[] = [
    {
      id: 1,
      image: "/kidsbook.png",
      category: "বই",
      title: "KIDS' অনর্গল ENGLISH",
    },
    {
      id: 2,
      image: "/kidsbook.png",
      category: "বই",
      title: "KIDS' SMART MATH",
    },
    {
      id: 3,
      image: "/kidsbook.png",
      category: "বই",
      title: "KIDS' BANGLA ABC",
    },
    {
      id: 4,
      image: "/kidsbook.png",
      category: "বই",
      title: "KIDS' SCIENCE FUN",
    },
  ];

  // State for Slider
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");

  // Dynamic Dimensions State
  // cardWidthStep = Width of card + Gap (used for sliding calculation)
  const [cardWidthStep, setCardWidthStep] = useState(328);
  // centerOffset = Pixels to shift the slider so the active card is centered
  const [centerOffset, setCenterOffset] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isDragging, setIsDragging] = useState(false);

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

      // Determine how many cards are visible
      const newVisibleCount = isMobile ? 1 : 3;
      setVisibleCount(newVisibleCount);

      let calculatedStep = 328; // Default desktop (304px card + 24px gap)
      let calculatedOffset = 0; // Default desktop (No offset, align left)

      if (isMobile) {
        // Mobile Logic: Center the active card
        const cardWidth = screenWidth * 0.85; // Card takes 85% of screen width
        calculatedStep = cardWidth + 24; // Step includes the gap (24px)

        // Calculate how much space is left on the screen to center the card
        // Offset = (Screen Width - Card Width) / 2
        calculatedOffset = (screenWidth - cardWidth) / 2;
      }

      setCardWidthStep(calculatedStep);
      setCenterOffset(calculatedOffset);
    };

    updateDimensions();

    // Re-calculate on resize
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    // Also listen to window resize to catch viewport changes affecting breakpoints
    window.addEventListener("resize", updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // --- 2. Slider Logic ---
  const maxIndex = Math.max(0, libraryData.length - visibleCount);

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(maxIndex); // Loop to the end
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

    // Threshold for swipe
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
  }, [currentIndex, direction, maxIndex]);

  // --- 5. Render Helper for Pagination ---
  const renderPaginationDots = () => {
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
            ? "w-6 bg-[#E2136E]" // Active State
            : "w-2.5 bg-gray-300 hover:bg-gray-400" // Inactive State
        }`}
        aria-label={`Go to slide ${idx + 1}`}
      />
    ));
  };

  return (
    <div className="max-w-[1120px] overflow-hidden mx-auto">
      {/* Header */}
      <div className="text-center">
        <h3 className="font-bold tracking-[-5%] py-2 leading-5 text-2xl md:text-5xl mb-12">
          <span className="text-secondary">চালাক</span>{" "}
          <span className="text-primary">Champs এর</span>{" "}
          <span className="relative inline-block px-3 py-5 group">
            <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>
            <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="bg-linear-to-r from-primary to-[#FC7CB4] bg-clip-text text-transparent">
              {" "}
              লাইব্রেরি
            </span>
          </span>
        </h3>
      </div>

      {/* Slider Wrapper */}
      <div className="relative w-full max-w-[960px] mx-auto group">
        {/* Left Arrow Button */}
        <button
          onClick={handleLeftClick}
          className="absolute -left-5 top-1/2 cursor-pointer -translate-y-1/2 -translate-x-2 md:-translate-x-12 z-20 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors hidden md:block"
          aria-label="Previous Slide"
        >
          <ArrowLeft className="text-gray-700" size={24} />
        </button>

        {/* Slider Viewport with Touch Events */}
        <div
          className="overflow-hidden w-full select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={sliderRef}
            className="flex gap-6 items-center justify-between transition-transform duration-500 ease-in-out will-change-transform"
            style={{
              // Apply centerOffset to shift the start position on mobile
              transform: `translateX(${centerOffset - currentIndex * cardWidthStep}px)`,
            }}
          >
            {libraryData.map((item, index) => (
              <div
                key={item.id}
                ref={index === 0 ? cardRef : null}
                className="shrink-0 w-[85vw] md:w-[304px]"
              >
                {/* CARD DESIGN - SAME AS BEFORE */}
                <div className="max-w-76 h-110 shadow bg-linear-to-b from-[#FF8FCA]  to-[#D9D9D9] rounded-[22px] p-0.5">
                  <div className="w-full h-full rounded-[21px] p-2 bg-[#F9FAFC]">
                    <div className="w-68.5 h-68.5 bg-[#001D3A0D] rounded-2xl relative overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 85vw, 304px"
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      <div className="flex items-center w-fit mt-2 gap-1 text-black dark:text-white text-xs bg-[#1B386B26] rounded-full px-2.5 py-1">
                        <div className="h-1 w-1 rounded-full bg-black dark:bg-white" />
                        <p>{item.category}</p>
                      </div>
                      <div>
                        <h3 className="text-[#3C4043] leading-[1.4] tracking-normal font-semibold mt-[15px] text-center px-2">
                          {item.title}
                        </h3>
                        <button className="flex gap-2 px-4 py-2 text-lg cursor-pointer font-semibold mt-3 items-center bg-[#E2136E] text-white rounded-xl shadow-[inset_0_3px_0_rgba(255,255,255,0.5)] transition-all active:scale-95">
                          <span>বিস্তারিত দেখুন</span>
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleRightClick}
          className="absolute -right-5 top-1/2 cursor-pointer -translate-y-1/2 translate-x-2 md:translate-x-12 z-20 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors hidden md:block"
          aria-label="Next Slide"
        >
          <ArrowRight className="text-gray-700" size={24} />
        </button>
      </div>

      {/* Professional Pagination Dots */}
      <div className="flex justify-center items-center gap-3 mt-8">
        {renderPaginationDots()}
      </div>

      {/* Mobile Swipe Hint */}
      <div className="md:hidden text-center text-gray-400 text-xs mt-2 animate-pulse">
        Swipe to view more
      </div>

      <div className="flex flex-col justify-center items-center my-6">
        {/* <button className="text-xl font-bold text-white tracking-normal leading-7 px-12 py-2.5 bg-[#214187] rounded-lg shadow-[inset_0_3px_0_rgba(255,255,255,0.5)] transition-all active:scale-95 hover:bg-[#1a366e]">
          আরও দেখুন
        </button> */}
        <Button px="px-18" textSize="xl" py="py-3">
          আরও দেখুন
        </Button>
      </div>
    </div>
  );
};

export default ChalakLibrary;
