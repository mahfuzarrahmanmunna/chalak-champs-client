"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation } from "swiper/modules";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// IMPORTANT: Make sure you have installed this package
// npm install videojs-youtube
import "videojs-youtube";

import "swiper/css";
import type { Swiper as SwiperClass } from "swiper";

const videoIds = [
  "rpBie8bhqPk",
  "rpBie8bhqPk",
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
  const isPlayerInitialized = useRef(false); // Prevent double init in Strict Mode

  // 2. Video Player Logic
  useEffect(() => {
    if (typeof window === "undefined" || !videoRef.current) return;

    // If player exists, just handle Play/Pause state
    if (playerRef.current) {
      if (isActive) {
        // Small delay to ensure transition is almost done
        setTimeout(() => {
          if (playerRef.current) {
            playerRef.current.currentTime(0);
            playerRef.current
              ?.play()
              ?.catch((e) => console.log("Autoplay prevented:", e));
          }
        }, 300);
      } else {
        playerRef.current.pause();
      }
      return;
    }

    // Initialize new player ONLY if active and not already initialized
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
          ytControls: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          rel: 0,
          modestbranding: 1,
        },
      }));

      player?.ready(() => {
        player?.muted(true);
        player?.play()?.catch((e) => console.log(e));
      });
    }
  }, [isActive, videoId]);

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
    <div data-vjs-player className="w-full h-full">
      <div
        ref={videoRef}
        className="video-js vjs-big-play-centered vjs-fill vjs-layout-large"
      />
    </div>
  );
};

export default function VideoGallerySlider() {
  const swiperRef = useRef<SwiperClass | null>(null);

  // ✅ INFINITE LOOP FIX: Buffer Slides Technique
  const bufferCount = Math.min(3, videoIds.length); // Take 3 slides for buffer
  const allSlides: SlideItem[] = [];

  // 1. Add Left Buffers (Last 3 videos to fill the left empty space of the first video)
  for (let i = videoIds.length - bufferCount; i < videoIds.length; i++) {
    allSlides.push({ type: "buffer", id: videoIds[i] });
  }

  // 2. Add Real Videos
  for (let i = 0; i < videoIds.length; i++) {
    allSlides.push({ type: "video", id: videoIds[i] });
  }

  // 3. Add Right Buffers (First 3 videos to fill the right empty space of the last video)
  for (let i = 0; i < bufferCount; i++) {
    allSlides.push({ type: "buffer", id: videoIds[i] });
  }

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

      <div className="relative w-full container mx-auto py-16 bg-white overflow-hidden">
        <div className="absolute left-[-100px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#F3066E]/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <Swiper
          modules={[Autoplay, FreeMode, Navigation]}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={false} // ✅ MUST remain false for video.js
          initialSlide={bufferCount} // ✅ Start at the first REAL video
          speed={600}
          spaceBetween={20}
          watchSlidesProgress={true}
          freeMode={{ enabled: true, sticky: true }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onTouchStart={(swiper) => swiper.autoplay.stop()}
          onTouchEnd={(swiper) => swiper.autoplay.start()}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          // ✅ Seamless Infinite Snap Logic
          onSlideChange={(swiper) => {
            const idx = swiper.activeIndex;
            const realStart = bufferCount;
            const realEnd = bufferCount + videoIds.length - 1;

            if (idx < realStart) {
              // Swiped left into the left buffer -> Instantly snap to the corresponding real slide at the end
              const targetIdx = idx + videoIds.length;
              swiper.slideTo(targetIdx, 0); // 0 speed = instant jump
            } else if (idx > realEnd) {
              // Swiped right into the right buffer -> Instantly snap to the corresponding real slide at the beginning
              const targetIdx = idx - videoIds.length;
              swiper.slideTo(targetIdx, 0); // 0 speed = instant jump
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
                    transition-all duration-500 ease-out
                    w-[280px] h-[500px] md:h-[550px]
                    ${
                      isActive
                        ? "scale-110 border-[2px] border-[#F3066E] z-50 bg-black shadow-2xl"
                        : "scale-100 border-2 border-blue-400 z-10 opacity-70 bg-black grayscale hover:grayscale-0"
                    }
                  `}
                >
                  <div className="relative w-full h-full bg-gray-900">
                    {/* Render Video Player ONLY for Real Videos */}
                    {slide.type === "video" && (
                      <VideoPlayer videoId={slide.id} isActive={isActive} />
                    )}

                    {/* Render Thumbnail ONLY for Buffer Slides (Saves performance, no video.js crash) */}
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
          .gallery-swiper .swiper-slide {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .gallery-swiper {
            user-select: none;
            -webkit-user-drag: none;
            padding-bottom: 50px !important; /* Space for shadows/scaling */
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
