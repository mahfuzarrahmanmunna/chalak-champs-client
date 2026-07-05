"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-youtube";

import "swiper/css";
import type { Swiper as SwiperClass } from "swiper";

const videoIds = [
  "7jIEEcdIY8w",
  "7jIEEcdIY8w",
  "7jIEEcdIY8w",
  "7jIEEcdIY8w",
  "7jIEEcdIY8w",
];

type VideoJsPlayer = ReturnType<typeof videojs>;

type SlideItem = { type: "video"; id: string } | { type: "buffer"; id: string };

interface VideoPlayerProps {
  videoId: string;
  isActive: boolean;
  onEnded: () => void; // New prop to handle video end
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
              .play()
              .catch((e) => console.log("Autoplay prevented:", e));
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
        loop: false, // ✅ Changed to false so it triggers 'ended' event
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
          ytControls: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
          rel: 0,
          modestbranding: 1,
        },
        width: "100%",
        height: "100%",
      }));

      player.ready(() => {
        player.muted(true);
        player.play().catch((e) => console.log(e));

        // ✅ Add 'ended' event listener
        player.on("ended", () => {
          // Optional: Short delay before moving to next slide for better UX
          setTimeout(() => {
            onEnded();
          }, 1000);
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
      className="w-full h-full absolute inset-0 pointer-events-auto"
      onClick={togglePlay}
    >
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
  const bufferCount = 2;
  const allSlides: SlideItem[] = [];

  // 1. Left Buffers
  for (let i = videoIds.length - bufferCount; i < videoIds.length; i++) {
    allSlides.push({ type: "buffer", id: videoIds[i] });
  }

  // 2. Real Videos
  for (let i = 0; i < videoIds.length; i++) {
    allSlides.push({ type: "video", id: videoIds[i] });
  }

  // 3. Right Buffers
  for (let i = 0; i < bufferCount; i++) {
    allSlides.push({ type: "buffer", id: videoIds[i] });
  }

  // ✅ Handle when video ends
  const handleVideoEnd = () => {
    if (swiperRef.current && !swiperRef.current.destroyed) {
      swiperRef.current.slideNext();
    }
  };

  // ✅ REMOVED: The setInterval logic is removed
  // Now it relies entirely on the video 'ended' event

  return (
    <>
      <div className="relative px-4 w-full container -mt-20 mx-auto py-2 bg-white overflow-visible">
        {/* Background Blob */}
        <div className="absolute left-[-100px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#F3066E]/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <Swiper
          modules={[Navigation, Pagination]}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1.2}
          loop={false}
          initialSlide={bufferCount}
          speed={500}
          spaceBetween={20}
          watchSlidesProgress={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              centeredSlides: false,
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

            swiper.params.speed = 0;

            if (idx < realStart) {
              const targetIdx = idx + videoIds.length;
              swiper.slideTo(targetIdx, 0);
            } else if (idx > realEnd) {
              const targetIdx = idx - videoIds.length;
              swiper.slideTo(targetIdx, 0);
            } else {
              swiper.params.speed = 500;
            }

            swiper.update();
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
                    w-full aspect-[16/9]
                    ${
                      isActive
                        ? "scale-105 border-[2px] border-[#F3066E] z-50 bg-black shadow-2xl"
                        : "scale-100 border-2 border-transparent z-10 opacity-70 bg-black grayscale hover:grayscale-0 hover:scale-[1.02]"
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

                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                    )}

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
            height: auto;
          }
          .testomonial-swiper {
            user-select: none;
            -webkit-user-drag: none;
            padding-bottom: 60px !important;
          }

          /* --- SWIPE FIX FOR IFRAMES --- */
          .swiper-slide-active .vjs-tech {
            pointer-events: none !important;
          }

          .swiper-slide-active .vjs-control-bar,
          .swiper-slide-active .vjs-big-play-button {
            pointer-events: auto !important;
            z-index: 20;
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

          .swiper-slide:not(.swiper-slide-active) .video-js .vjs-control-bar {
            display: none !important;
          }

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
