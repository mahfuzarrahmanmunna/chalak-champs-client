"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import videojs from "video.js";
import "video.js/dist/video-js.css";
// Import YouTube Plugin for Video.js
import "videojs-youtube";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Check,
  // --- NEW ICONS FOR COLORFUL LIST ---
  Video,
  Layers,
  Globe,
  GraduationCap,
  Users,
  Clock,
  Calendar,
  FileText,
  Palette,
  Award,
  Mic,
} from "lucide-react";
import Button from "@/app/ui/button/Button";

// --- Types for Slider Media ---
export type MediaType = "image" | "video";

export interface MediaAsset {
  type: MediaType;
  src: string;
  poster?: string;
}

// --- Props Interface ---
interface EnrollmentCardProps {
  data: any; // Your SingleCourseData
  onEnroll: () => void;
  mediaAssets: MediaAsset[];
}

const EnrollmentCard = ({
  data,
  onEnroll,
  mediaAssets = [],
}: EnrollmentCardProps) => {
  // --- Price Parsing ---
  const parts = data.quickInfo.offerPrice.split(" ");
  const originalPrice = parts.length > 2 ? `${parts[0]} ${parts[1]}` : null;
  const currentPrice =
    parts.length > 2 ? `${parts[2]} ${parts[3]}` : data.quickInfo.offerPrice;

  // --- Slider Logic ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Track play state for custom UI

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaAssets.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + mediaAssets.length) % mediaAssets.length,
    );
  };

  // --- Video.js Logic (Including YouTube) ---
  const videoNode = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  const currentMedia = mediaAssets[currentIndex];
  const isVideo = currentMedia?.type === "video";

  useEffect(() => {
    // 1. Cleanup existing player
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }

    // 2. Initialize Player if Video Slide
    if (isVideo && videoNode.current) {
      playerRef.current = videojs(videoNode.current, {
        controls: false, // We will use custom play button for cleaner look
        autoplay: false,
        preload: "auto",
        fluid: true, // Maintains aspect ratio
        responsive: true,
        fill: true,
        // YouTube Specific Config
        techOrder: ["youtube"],
        sources: [
          {
            type: "video/youtube",
            src: currentMedia.src,
          },
        ],
        youtube: { iv_load_policy: 1 },
      });

      // Play button click handler
      const customPlayBtn = document.querySelector(".vjs-custom-play-btn");
      if (customPlayBtn) {
        customPlayBtn.addEventListener("click", () => {
          if (playerRef.current) playerRef.current.play();
        });
      }

      // Listen for play/pause events to update state
      if (playerRef.current) {
        playerRef.current.on("play", () => setIsPlaying(true));
        playerRef.current.on("pause", () => setIsPlaying(false));
        playerRef.current.on("ended", () => setIsPlaying(false));
      }
    }

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [currentIndex, isVideo, currentMedia?.src]); // Re-run when slide changes

  // Custom Play Button Handler
  const handlePlayClick = () => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  // --- ICON & COLOR CONFIGURATION ---
  // Maps specific index to a unique icon and a light background color
  const iconConfig = [
    { Icon: Video, color: "text-red-500", bg: "bg-red-50" }, // 64 Classes
    { Icon: Layers, color: "text-blue-500", bg: "bg-blue-50" }, // 2 Levels
    { Icon: Globe, color: "text-green-500", bg: "bg-green-50" }, // Online Batch
    { Icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-50" }, // Class 1-8
    { Icon: Users, color: "text-orange-500", bg: "bg-orange-50" }, // Total Enrolled
    { Icon: Clock, color: "text-cyan-500", bg: "bg-cyan-50" }, // Time Required
    { Icon: Calendar, color: "text-indigo-500", bg: "bg-indigo-50" }, // 3 Days/Week
    { Icon: FileText, color: "text-yellow-600", bg: "bg-yellow-50" }, // PDF
    { Icon: Palette, color: "text-pink-500", bg: "bg-pink-50" }, // Colorful Materials
    { Icon: Award, color: "text-amber-500", bg: "bg-amber-50" }, // Certificate
    { Icon: Mic, color: "text-emerald-500", bg: "bg-emerald-50" }, // EFT Test
  ];

  // Helper to get config with fallback
  const getConfig = (idx: number) => {
    return iconConfig[idx % iconConfig.length];
  };

  return (
    <div className="">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* --- IMAGE / VIDEO SLIDER SECTION --- */}
        <div className="relative h-[220px] bg-black group overflow-hidden rounded-t-xl">
          {/* 1. IMAGE SLIDE */}
          {!isVideo && currentMedia && (
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={currentMedia.src}
                alt="Course Preview"
                fill
                className="object-cover"
                priority
              />
              {/* Professional Gradient Overlay for Images */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {/* 2. VIDEO SLIDE (Video.js + YouTube) */}
          {isVideo && currentMedia && (
            <div
              data-vjs-player
              className="absolute inset-0 w-full h-full rounded-t-xl overflow-hidden"
            >
              <video
                ref={videoNode}
                className="video-js vjs-big-play-centered vjs-show-big-play-button-on-pause w-full h-full"
                poster={currentMedia.poster}
              >
                <source src={currentMedia.src} type="video/youtube" />
                Your browser does not support the video tag.
              </video>

              {/* Professional Gradient Overlay for Video */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />
              )}
            </div>
          )}

          {/* --- PROFESSIONAL CUSTOM PLAY BUTTON --- */}
          {/* Only show if video, or if image (optional) */}
          {isVideo && !isPlaying && (
            <button
              onClick={handlePlayClick}
              className="vjs-custom-play-btn absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 border-2 border-white/30 z-30 group-hover:bg-white/40"
            >
              <Play className="h-8 w-8 text-white fill-white ml-1" />
            </button>
          )}

          {/* --- SLIDER CONTROLS --- */}

          {/* Left Arrow */}
          {mediaAssets.length > 1 && (
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 z-40 transition-all backdrop-blur-sm border border-white/20"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Right Arrow */}
          {mediaAssets.length > 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 z-40 transition-all backdrop-blur-sm border border-white/20"
              aria-label="Next Slide"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Pagination Dots */}
          {mediaAssets.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40">
              {mediaAssets.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === idx ? "w-6 bg-white" : "w-2 bg-white/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* --- THUMBNAIL STRIP --- */}
        {mediaAssets.length > 1 && (
          <div className="px-4 pt-3 pb-2">
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {mediaAssets.map((asset, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-[80px] h-[60px] flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      isActive
                        ? "border-[#F3056D] ring-2 ring-[#F3056D]/20 scale-105 shadow-md"
                        : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {asset.type === "video" ? (
                      <Image
                        src={asset.poster || "/placeholder-video.jpg"}
                        alt={`Video thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Image
                        src={asset.src}
                        alt={`Image thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    )}

                    {/* Play Icon Overlay for Video Thumbnails */}
                    {asset.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* --- CARD CONTENT (Price, Buttons, etc) --- */}
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
            {data.quickInfo.offerText}
          </div>

          <div className="flex flex-col gap-3">
            {/* Primary CTA */}
            <Button
              onClick={onEnroll}
              bgColor="#F3056D"
              darkShadowColor="#F3066E"
              highlightColor="#FF8FCA"
              hoverTextColor="#F3056D"
              className="w-full py-3 rounded-lg text-white font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-95 bg-[#F3056D]"
            >
              {data.quickInfo.cta1}
            </Button>

            {/* Secondary CTA */}
            <Button
              bgColor="#ffffff"
              darkShadowColor="#F3066E"
              highlightColor="#FF8FCA"
              hoverTextColor="#ffffff"
              textColor="#F3056D"
              hoverBgColor="#F3056D"
              onClick={onEnroll}
              className=""
            >
              {data.quickInfo.cta2}
            </Button>
          </div>

          {/* --- UPDATED LIST SECTION WITH COLORFUL ICONS --- */}
          <div className="space-y-3 text-sm text-gray-600 mt-6">
            <p className="font-bold text-gray-900 mb-2">
              {data.quickInfo.title}
            </p>
            {data.quickInfo.items.map((item: string, idx: number) => {
              const { Icon, color, bg } = getConfig(idx);
              return (
                <div key={idx} className="flex items-start gap-3">
                  {/* Colorful Icon Container */}
                  <span className={`mt-0.5 flex-shrink-0`}>
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
};

export default EnrollmentCard;
