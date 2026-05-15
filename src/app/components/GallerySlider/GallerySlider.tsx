"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules"; // Removed Autoplay
import videojs from "video.js";
import "video.js/dist/video-js.css";

// IMPORTANT: Make sure you have installed this package
// npm install videojs-youtube
import "videojs-youtube";

import "swiper/css";
import type { Swiper as SwiperClass } from "swiper";

const videoIds = [
  "rpBie8bhqPk",
  "9HQXNXT2TD8",
  "cPAQNgBRSew",
  "nJT78Jy9kTQ",
  "fWH5nYCx55E",
  "x7tOeFJA7oY",
  "jA1Tw0yyLk4",
  "LMs_7DAt_FI",
  "uyCfIld5yE0",
  "9fV67IIoCL0",
];

type VideoJsPlayer = ReturnType<typeof videojs>;

type SlideItem = { type: "video"; id: string } | { type: "buffer"; id: string };

interface VideoPlayerProps {
  videoId: string;
  isActive: boolean;
  onEnded: () => void; // Callback when video finishes
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  isActive,
  onEnded,
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const isPlayerInitialized = useRef(false);

  // --- NEW: Toggle Play/Pause Function ---
  const togglePlay = () => {
    if (playerRef.current) {
      if (playerRef.current.paused()) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !videoRef.current) return;

    // Logic to handle active/inactive states
    if (playerRef.current) {
      if (isActive) {
        setTimeout(() => {
          if (playerRef.current) {
            const currentTime = playerRef.current.currentTime();
            if (currentTime > 5) playerRef.current.currentTime(0);

            playerRef.current
              ?.play()
              ?.catch((e) => console.log("Autoplay prevented:", e));
          }
        }, 300);
      } else {
        // IMPORTANT: Pause immediately if not active
        playerRef.current.pause();
      }
      return;
    }

    // Initialize Player only if active and not already initialized
    if (isActive && !isPlayerInitialized.current) {
      isPlayerInitialized.current = true;

      const player = (playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        muted: true, // Muted is usually required for autoplay
        preload: "auto",
        loop: false, // ✅ CHANGED: False so it triggers 'ended' event
        fluid: false,
        fill: true,
        playsinline: true,
        techOrder: ["youtube"],
        sources: [
          {
            src: `https://www.youtube.com/watch?v=${videoId}`,
            type: "video/youtube",
          },
        ],
        youtube: {
          ytControls: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          rel: 0,
          modestbranding: 1,
        },
      }));

      player.ready(() => {
        player.muted(true);
        player.play().catch((e) => console.log(e));

        // ✅ NEW: Listen for the 'ended' event
        player.on("ended", () => {
          // Add a small delay before moving to next slide for better UX
          setTimeout(() => {
            onEnded();
          }, 1000);
        });
      });
    }
  }, [isActive, videoId, onEnded]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
        isPlayerInitialized.current = false;
      }
    };
  }, []);

  return (
    // Container receives click events (pointer-events-auto) to toggle play/pause
    // z-10 ensures it sits below the video-js controls (z-20)
    <div
      data-vjs-player
      className="w-full h-full absolute inset-0 pointer-events-auto z-10"
      onClick={togglePlay}
    >
      <div
        ref={videoRef}
        className="video-js vjs-big-play-centered vjs-fill vjs-layout-large"
      />
    </div>
  );
};

export default function VideoGallerySlider() {
  const swiperRef = useRef<SwiperClass | null>(null);

  // Infinite Loop Logic
  const bufferCount = Math.min(3, videoIds.length);
  const allSlides: SlideItem[] = [];

  for (let i = videoIds.length - bufferCount; i < videoIds.length; i++) {
    allSlides.push({ type: "buffer", id: videoIds[i] });
  }
  for (let i = 0; i < videoIds.length; i++) {
    allSlides.push({ type: "video", id: videoIds[i] });
  }
  for (let i = 0; i < bufferCount; i++) {
    allSlides.push({ type: "buffer", id: videoIds[i] });
  }

  // ✅ Handle when video ends
  const handleVideoEnd = () => {
    if (swiperRef.current && !swiperRef.current.destroyed) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-2xl md:text-5xl font-bold text-[#00477C] leading-[1.7] tracking-tight">
          কেন আমরাই শিক্ষার্থী ও অভিভাবকদের
          <br className="hidden md:block" />
          <span className="relative inline-block px-2 py-0.5 md:px-3 group">
            <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>
            <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="text-primary"> প্রথম পছন্দ</span>
          </span>
        </h2>
        <figure className="flex items-center justify-center mt-4">
          <Image
            src={"/staricon.webp"}
            width={162}
            height={45}
            alt="star icon"
          />
        </figure>
      </div>

      <div className="relative w-full container -mt-16 mx-auto py-16 bg-white overflow-hidden">
        {/* Background Glow */}
        <div className="absolute left-[-100px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#F3066E]/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <Swiper
          modules={[FreeMode]} // Removed Autoplay
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={false}
          initialSlide={bufferCount}
          speed={500}
          spaceBetween={20}
          resistanceRatio={0.85}
          freeMode={{ enabled: true, sticky: true, momentumRatio: 0.8 }}
          // REMOVED: autoplay={{ ... }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            const idx = swiper.activeIndex;
            const realStart = bufferCount;
            const realEnd = bufferCount + videoIds.length - 1;

            if (idx < realStart) {
              const targetIdx = idx + videoIds.length;
              swiper.slideTo(targetIdx, 0);
            } else if (idx > realEnd) {
              const targetIdx = idx - videoIds.length;
              swiper.slideTo(targetIdx, 0);
            }
          }}
          className="gallery-swiper !overflow-visible py-10"
        >
          {allSlides.map((slide, index) => (
            <SwiperSlide key={index} className="!w-[280px]">
              {({ isActive }) => (
                <div
                  className={`
                    relative rounded-[30px] overflow-hidden cursor-pointer select-none
                    w-[280px] h-[500px] md:h-[550px]
                    transition-all duration-[500ms] cubic-bezier(0.25, 1, 0.5, 1)
                    ${
                      isActive
                        ? "scale-[1.12] border-[2.5px] border-[#F3066E] z-50 bg-black shadow-[0_25px_50px_-12px_rgba(243,5,109,0.5)]"
                        : "scale-90 border-2 border-transparent opacity-60 bg-black grayscale hover:opacity-80 hover:scale-95"
                    }
                  `}
                >
                  <div className="relative w-full h-full bg-gray-900">
                    {slide.type === "video" && (
                      <VideoPlayer
                        videoId={slide.id}
                        isActive={isActive}
                        onEnded={handleVideoEnd} // Pass the handler
                      />
                    )}

                    {slide.type === "buffer" && (
                      <Image
                        src={`https://img.youtube.com/vi/${slide.id}/hqdefault.jpg`}
                        alt="Buffer Video"
                        fill
                        className="object-cover opacity-80"
                        unoptimized
                      />
                    )}

                    {/* Gradients & Overlays */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none"></div>
                    )}

                    {/* Play Icon for Inactive */}
                    {!isActive && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                          <svg
                            className="w-7 h-7 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Live Badge for Active Video */}
                    {isActive && slide.type === "video" && (
                      <div className="absolute top-4 left-4 z-50 flex items-center gap-2 pointer-events-none">
                        <div className="bg-[#F3066E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-[0_4px_15px_rgba(243,5,109,0.4)] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                          Live
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Scroll Indicator (UX Polish) */}
        <div className="flex justify-center mt-6 opacity-40">
          <div className="w-12 h-1 bg-gray-800 rounded-full animate-pulse"></div>
        </div>

        <style jsx global>{`
          .gallery-swiper .swiper-slide {
            display: flex;
            align-items: center;
            justify-content: center;
            transition-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
          }
          .gallery-swiper {
            user-select: none;
            -webkit-user-drag: none;
            padding-bottom: 60px !important;
            overflow: hidden !important;
          }

          /* --- CRITICAL SWIPE FIX --- */
          /* Disable pointer events on the video element/iframe specifically for the active slide. */
          .swiper-slide-active .vjs-tech {
            pointer-events: none !important;
          }

          /* Re-enable pointer events for the controls */
          .swiper-slide-active .vjs-control-bar,
          .swiper-slide-active .vjs-big-play-button {
            pointer-events: auto !important;
            z-index: 20;
          }

          /* Video.js Customization */
          .video-js .vjs-big-play-button {
            background-color: rgba(243, 6, 110, 0.9);
            border: none;
            width: 64px;
            height: 64px;
            line-height: 64px;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2.5em;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 10;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          }
          .video-js:hover .vjs-big-play-button {
            transform: translate(-50%, -50%) scale(1.1);
            background-color: #f3066e;
          }

          /* Hide controls on inactive slides */
          .swiper-slide:not(.swiper-slide-active) .video-js .vjs-control-bar {
            display: none !important;
          }

          /* Hide big play button on inactive slides */
          .swiper-slide:not(.swiper-slide-active)
            .video-js
            .vjs-big-play-button {
            display: none !important;
          }
        `}</style>
      </div>
    </>
  );
}
