"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-youtube";

import "swiper/css";
import type { Swiper as SwiperClass } from "swiper";

const videoIds = [
  "rpBie8bhqPk",
  "rpBie8bhqPk", // Replace with real IDs
  "rpBie8bhqPk",
  "rpBie8bhqPk",
  "rpBie8bhqPk",
];

type VideoJsPlayer = ReturnType<typeof videojs>;

type SlideItem = { type: "video"; id: string } | { type: "buffer"; id: string };

interface VideoPlayerProps {
  videoId: string;
  isActive: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, isActive }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const isPlayerInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !videoRef.current) return;

    // 1. Handle Play/Pause based on isActive
    if (playerRef.current) {
      if (isActive) {
        // Small delay to ensure transition is done before playing
        setTimeout(() => {
          if (playerRef.current) {
            const currentTime = playerRef.current.currentTime();
            // Only restart if we aren't already watching it deeply
            if (currentTime > 5) playerRef.current.currentTime(0);

            playerRef.current
              .play()
              .catch((e) => console.log("Autoplay prevented:", e));
          }
        }, 300);
      } else {
        playerRef.current.pause();
      }
      return;
    }

    // 2. Initialize Player only once
    if (isActive && !isPlayerInitialized.current) {
      isPlayerInitialized.current = true;

      const player = (playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        muted: true, // Required for autoplay
        preload: "auto",
        loop: true,
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
          ytControls: 1, // Show controls so user can unmute
          iv_load_policy: 3,
          cc_load_policy: 0,
          rel: 0,
          modestbranding: 1,
        },
        // Explicitly set dimensions to ensure rendering
        width: "100%",
        height: "100%",
      }));

      player.ready(() => {
        player.muted(true);
        player.play().catch((e) => console.log(e));
      });
    }
  }, [isActive, videoId]);

  // Cleanup on unmount
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
    <div data-vjs-player className="w-full h-full absolute inset-0">
      <div
        ref={videoRef}
        className="video-js vjs-big-play-centered vjs-fill vjs-layout-large w-full h-full"
      />
    </div>
  );
};

export default function VideoTestomonial() {
  const swiperRef = useRef<SwiperClass | null>(null);

  // ✅ Buffer Logic
  const bufferCount = 2; // Reduced to 2 for smoother performance
  const allSlides: SlideItem[] = [];

  // 1. Left Buffers (Last N items)
  for (let i = videoIds.length - bufferCount; i < videoIds.length; i++) {
    allSlides.push({ type: "buffer", id: videoIds[i] });
  }

  // 2. Real Videos
  for (let i = 0; i < videoIds.length; i++) {
    allSlides.push({ type: "video", id: videoIds[i] });
  }

  // 3. Right Buffers (First N items)
  for (let i = 0; i < bufferCount; i++) {
    allSlides.push({ type: "buffer", id: videoIds[i] });
  }

  // ✅ Custom Autoplay Logic (Required because Swiper autoplay breaks with Buffer technique)
  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current && !swiperRef.current.destroyed) {
        swiperRef.current.slideNext();
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div>
        <h2 className="text-2xl md:text-5xl font-bold text-[#00477C] leading-[1.7] tracking-tight text-center">
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

      <div className="relative px-4 w-full container mx-auto py-2 bg-white overflow-hidden">
        {/* Background Blob */}
        <div className="absolute left-[-100px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#F3066E]/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <Swiper
          modules={[Navigation, Pagination]} // Removed Autoplay & FreeMode
          grabCursor={true}
          centeredSlides={true} // Centering looks better
          slidesPerView={1}
          loop={false}
          initialSlide={bufferCount}
          speed={500}
          spaceBetween={20}
          watchSlidesProgress={true}
          // Removed freeMode to ensure snapping works perfectly with buffer logic
          // Removed autoplay to implement custom logic below
          breakpoints={{
            768: {
              slidesPerView: 2,
              centeredSlides: false, // Disable center on grid
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              centeredSlides: false,
              spaceBetween: 30,
            },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            const idx = swiper.activeIndex;
            const realStart = bufferCount;
            const realEnd = bufferCount + videoIds.length - 1;

            // Disable transitions for the instant jump
            swiper.params.speed = 0;

            if (idx < realStart) {
              // Wrapped to left buffer -> Jump to Right Real
              const targetIdx = idx + videoIds.length;
              swiper.slideTo(targetIdx, 0);
            } else if (idx > realEnd) {
              // Wrapped to right buffer -> Jump to Left Real
              const targetIdx = idx - videoIds.length;
              swiper.slideTo(targetIdx, 0);
            } else {
              // Normal slide
              swiper.params.speed = 500;
            }

            swiper.update(); // Important to update swiper state after speed change
          }}
          className="testomonial-swiper !overflow-visible py-10"
        >
          {allSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              {({ isActive }) => (
                <div
                  className={`
                    relative rounded-[30px] overflow-hidden cursor-pointer select-none
                    transition-all duration-500 ease-out
                    w-full h-full flex flex-col
                    aspect-video
                    ${
                      isActive
                        ? "scale-105 border-[2px] border-[#F3066E] z-50 bg-black shadow-2xl"
                        : "scale-100 border-2 border-blue-400 z-10 opacity-70 bg-black grayscale hover:grayscale-0 hover:scale-[1.02]"
                    }
                  `}
                >
                  <div className="relative w-full h-full bg-gray-900 flex-grow">
                    {/* Render Video Player ONLY for Real Videos */}
                    {slide.type === "video" && (
                      <VideoPlayer videoId={slide.id} isActive={isActive} />
                    )}

                    {/* Render Thumbnail ONLY for Buffer Slides */}
                    {slide.type === "buffer" && (
                      <Image
                        src={`https://img.youtube.com/vi/${slide.id}/hqdefault.jpg`}
                        alt="Buffer Video"
                        fill
                        className="object-cover opacity-80"
                        unoptimized
                      />
                    )}

                    {/* Overlay for inactive videos & buffers */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                    )}

                    {/* Play button overlay for inactive videos & buffers */}
                    {!isActive && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                          <svg
                            className="w-6 h-6 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Live Badge for Active Real Video */}
                    {isActive && slide.type === "video" && (
                      <div className="absolute top-4 left-4 z-50 flex items-center gap-2 pointer-events-none">
                        <div className="bg-[#F3066E] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-lg animate-bounce">
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

        <style jsx global>{`
          .testomonial-swiper .swiper-slide {
            display: flex;
            align-items: center;
            justify-content: center;
            height: auto !important; /* Let aspect-video dictate height */
          }
          .testomonial-swiper {
            user-select: none;
            -webkit-user-drag: none;
            padding-bottom: 50px !important;
          }

          /* Video.js Customization */
          .video-js .vjs-big-play-button {
            background-color: rgba(243, 6, 110, 0.9);
            border: none;
            width: 60px;
            height: 60px;
            line-height: 60px;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2.5em;
            transition: all 0.3s ease;
            z-index: 10;
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
