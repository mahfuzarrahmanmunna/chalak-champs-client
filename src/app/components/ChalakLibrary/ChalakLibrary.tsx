import { Eye, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

const ChalakLibrary = () => {
  // Data Array
  const libraryData = [
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

  // NEW: State to store calculated width and visible count
  const [cardWidth, setCardWidth] = useState(328); // Default fallback (304px card + 24px gap)
  const [visibleCount, setVisibleCount] = useState(3); // Default to 3 for desktop

  // Refs
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // NEW: Calculate dynamic width and visible count based on screen size
  useEffect(() => {
    const updateDimensions = () => {
      // 1. Measure the actual width of the card + gap
      if (cardRef.current) {
        const width = cardRef.current.offsetWidth + 24; // 24 is gap-6
        setCardWidth(width);
      }

      // 2. Determine how many cards are visible (Responsive Logic)
      if (window.innerWidth < 768) {
        // Tailwind 'md' breakpoint (768px)
        setVisibleCount(1); // Small device: Show 1 card
      } else {
        setVisibleCount(3); // Large device: Show 3 cards
      }
    };

    // Initial measurement
    updateDimensions();

    // Resize Observer to track card size changes
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    // Window resize listener to track viewport changes
    window.addEventListener("resize", updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Calculate max index based on how many cards are currently visible
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

  // Auto Slide Logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (direction === "right") {
        nextSlide();
      } else {
        prevSlide();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, direction, maxIndex, nextSlide, prevSlide]);

  const handleRightClick = () => {
    setDirection("right");
    nextSlide();
  };

  const handleLeftClick = () => {
    setDirection("left");
    prevSlide();
  };

  return (
    <div className="max-w-280 overflow-hidden mx-auto">
      {/* Header */}
      <div>
        <h3 className="font-semibold py-2 leading-5 text-2xl md:text-4xl text-center mb-12">
          <span className="text-secondary">চালাক</span>{" "}
          <span className="text-primary">Champs এর</span>{" "}
          <span className="relative inline-block px-3 py-4 group">
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

        {/* Slider Viewport */}
        <div className="overflow-hidden w-full">
          <div
            ref={sliderRef}
            className="flex gap-6 transition-transform duration-500 ease-in-out"
            style={{
              // FIX: Use state variable instead of accessing ref directly
              transform: `translateX(-${currentIndex * cardWidth}px)`,
            }}
          >
            {libraryData.map((item, index) => (
              <div
                key={item.id}
                ref={index === 0 ? cardRef : null}
                className="shrink-0 w-[304px]"
              >
                {/* CARD DESIGN - SAME AS BEFORE */}
                <div className="max-w-76 h-110 shadow bg-linear-to-b from-[#FF8FCA] to-[#D9D9D9] rounded-[22px] p-1">
                  <div className="w-full h-full rounded-[21px] p-2 bg-[#F9FAFC]">
                    <div className="w-68.5 h-68.5 bg-[#001D3A0D] rounded-2xl">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={366}
                        height={366}
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      <div className="flex items-center w-fit mt-2 gap-1 text-black dark:text-white text-xs bg-[#1B386B26] rounded-full px-2.5 py-1">
                        <div className="h-1 w-1 rounded-full bg-black dark:bg-white" />
                        <p>{item.category}</p>
                      </div>
                      <div>
                        <h3 className="text-[#3C4043] leading-[1.4] tracking-normal font-semibold mt-[15px]">
                          {item.title}
                        </h3>
                        <button className="flex gap-2 px-4 py-2 text-lg cursor-pointer font-semibold mt-3 items-center bg-[#E2136E] text-white rounded-xl shadow-[inset_0_3px_0_rgba(255,255,255,0.5)] transition-all">
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

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={handleLeftClick}
          className={`h-2 w-2 rounded-full transition-all duration-300 cursor-pointer ${
            currentIndex === 0
              ? "bg-gray-200 opacity-50 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          aria-label="Previous"
        />

        <div className="h-3 w-3 bg-black rounded-full shadow-md" />

        <button
          onClick={handleRightClick}
          className={`h-2 w-2 rounded-full transition-all duration-300 cursor-pointer ${
            currentIndex === maxIndex
              ? "bg-gray-200 opacity-50 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          aria-label="Next"
        />
      </div>

      <div className="flex flex-col justify-center items-center mt-6">
        <button className="text-xl font-bold text-white tracking-normal leading-7 px-12 py-2.5 bg-[#214187] rounded-lg shadow-[inset_0_3px_0_rgba(255,255,255,0.5)] transition-all">
          আরও দেখুন
        </button>
      </div>
    </div>
  );
};

export default ChalakLibrary;
