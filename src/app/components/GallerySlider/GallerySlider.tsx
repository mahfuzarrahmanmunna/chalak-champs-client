"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import videojs from "video.js";
import "video.js/dist/video-js.css";
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
  onEnded: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  isActive,
  onEnded,
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const isPlayerInitialized = useRef(false);

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
        playerRef.current.pause();
      }
      return;
    }

    if (isActive && !isPlayerInitialized.current) {
      isPlayerInitialized.current = true;

      const player = (playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        muted: true,
        preload: "auto",
        loop: false,
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
        player.on("ended", () => {
          setTimeout(() => {
            onEnded();
          }, 800);
        });
      });
    }
  }, [isActive, videoId, onEnded]);

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

  const handleVideoEnd = () => {
    if (swiperRef.current && !swiperRef.current.destroyed) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="text-center mb-10 md:mb-14">
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

      <div className="relative w-full container mx-auto py-12 bg-white overflow-hidden">
        {/* Background Glow */}
        <div className="absolute left-[-100px] top-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#F3066E]/8 blur-[100px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute right-[-80px] top-1/3 w-[250px] h-[250px] bg-[#00477C]/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

        <Swiper
          modules={[FreeMode]}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={false}
          initialSlide={bufferCount}
          speed={400}
          spaceBetween={14}
          resistanceRatio={0.85}
          freeMode={{ enabled: true, sticky: true, momentumRatio: 0.7 }}
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
          className="gallery-swiper !overflow-visible py-8"
        >
          {allSlides.map((slide, index) => (
            <SwiperSlide key={index} className="!w-[180px] md:!w-[200px]">
              {({ isActive }) => (
                <div
                  className={`
                    relative rounded-[16px] md:rounded-[20px] overflow-hidden cursor-pointer select-none
                    w-[180px] h-[320px] md:w-[200px] md:h-[356px]
                    transition-all duration-[450ms] cubic-bezier(0.22, 1, 0.36, 1)
                    ${
                      isActive
                        ? "scale-[1.15] md:scale-[1.18] border-[2px] border-[#F3066E]/80 z-50 bg-black shadow-[0_20px_60px_-15px_rgba(243,5,109,0.45),0_0_0_1px_rgba(243,5,109,0.1)]"
                        : "scale-[0.88] border border-white/10 opacity-50 bg-black grayscale-[60%] hover:opacity-70 hover:scale-[0.92] hover:grayscale-0"
                    }
                  `}
                >
                  {/* Subtle inner highlight ring for active */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-[16px] md:rounded-[20px] ring-1 ring-inset ring-white/10 z-[60] pointer-events-none" />
                  )}

                  <div className="relative w-full h-full bg-gray-900">
                    {slide.type === "video" && (
                      <VideoPlayer
                        videoId={slide.id}
                        isActive={isActive}
                        onEnded={handleVideoEnd}
                      />
                    )}

                    {slide.type === "buffer" && (
                      <Image
                        src={`https://img.youtube.com/vi/${slide.id}/hqdefault.jpg`}
                        alt="Buffer Video"
                        fill
                        className="object-cover opacity-70 grayscale"
                        unoptimized
                      />
                    )}

                    {/* Bottom Gradient Overlay */}
                    {!isActive && (
                      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
                    )}

                    {/* Top subtle vignette */}
                    {!isActive && (
                      <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
                    )}

                    {/* Play Icon for Inactive */}
                    {!isActive && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/[0.15] flex items-center justify-center shadow-lg">
                          <svg
                            className="w-5 h-5 md:w-5.5 md:h-5.5 text-white/80 ml-0.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Shorts indicator for inactive */}
                    {!isActive && (
                      <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                        <div className="flex items-center gap-1.5 opacity-60">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
                          </svg>
                          <span className="text-[9px] text-white/70 font-medium uppercase tracking-widest">
                            Shorts
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Top-Right Corner Decoration for Active */}
                    {isActive && slide.type === "video" && (
                      <>
                        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/40 to-transparent z-50 pointer-events-none" />
                        <div className="absolute top-3 left-3 z-50 flex items-center gap-2 pointer-events-none">
                          <div className="bg-[#F3066E] text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.15em] shadow-[0_4px_12px_rgba(243,5,109,0.5)] flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-white rounded-full animate-ping" />
                            <span className="relative">Live</span>
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 z-50 pointer-events-none">
                          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/10">
                            <svg
                              className="w-2.5 h-2.5 text-red-500"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48,1.73-1.73.47-.13,1.33-.22,2.65-.28,1.3-.07,2.49-.1,3.59-.1L12,5c4.19,0,6.8.16,7.83.44.9.25,1.48.83,1.73,1.73z" />
                            </svg>
                            <span className="text-[8px] text-white/80 font-semibold uppercase tracking-wider">
                              Shorts
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Subtle Scroll Indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300/60" />
          <div className="w-8 h-1 bg-gray-300/40 rounded-full" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300/60" />
        </div>

        <style jsx global>{`
          .gallery-swiper .swiper-slide {
            display: flex;
            align-items: center;
            justify-content: center;
            transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          }
          .gallery-swiper {
            user-select: none;
            -webkit-user-drag: none;
            padding-bottom: 40px !important;
            overflow: hidden !important;
          }

          /* CRITICAL SWIPE FIX */
          .swiper-slide-active .vjs-tech {
            pointer-events: none !important;
          }
          .swiper-slide-active .vjs-control-bar,
          .swiper-slide-active .vjs-big-play-button {
            pointer-events: auto !important;
            z-index: 20;
          }

          /* Video.js — Compact Professional Style */
          .video-js .vjs-big-play-button {
            background-color: rgba(243, 6, 110, 0.85);
            border: 2px solid rgba(255, 255, 255, 0.2);
            width: 44px;
            height: 44px;
            line-height: 40px;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.6em;
            transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
            z-index: 10;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35),
                        0 0 20px rgba(243, 6, 110, 0.2);
            backdrop-filter: blur(4px);
          }
          .video-js:hover .vjs-big-play-button {
            transform: translate(-50%, -50%) scale(1.08);
            background-color: #f3066e;
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4),
                        0 0 30px rgba(243, 6, 110, 0.3);
          }

          /* Compact control bar */
          .swiper-slide-active .video-js .vjs-control-bar {
            height: 32px !important;
            background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%) !important;
            padding: 0 6px !important;
          }
          .swiper-slide-active .video-js .vjs-control-bar .vjs-control {
            width: 28px !important;
          }
          .swiper-slide-active .video-js .vjs-play-progress,
          .swiper-slide-active .video-js .vjs-volume-level {
            background-color: #f3066e !important;
          }
          .swiper-slide-active .video-js .vjs-slider {
            background-color: rgba(255,255,255,0.15) !important;
          }

          /* Hide controls on inactive slides */
          .swiper-slide:not(.swiper-slide-active) .video-js .vjs-control-bar {
            display: none !important;
          }
          .swiper-slide:not(.swiper-slide-active) .video-js .vjs-big-play-button {
            display: none !important;
          }

          /* Smooth fade-in for active slide */
          .swiper-slide-active {
            opacity: 1 !important;
          }
        `}</style>
      </div>
    </>
  );
}