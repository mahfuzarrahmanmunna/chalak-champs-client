"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";

// Register YouTube tech
import "videojs-youtube";
import type { Swiper as SwiperClass } from "swiper";

const videoIds = [
  "5-qR3s-2p3Q", // Short 1
  "tJN6G4eJ3Xg", // Short 2
  "fJ1r-9wX-9c", // Short 3
  "1zyQaDpR-48", // Short 4
  "vX1Mx5kO-5Y", // Short 5
];

// --- 2. Video Player Component ---
type VideoJsPlayer = ReturnType<typeof videojs>;

interface VideoPlayerProps {
  videoId: string;
  isActive: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, isActive }) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const previousVideoIdRef = useRef<string | null>(null); // Track previous ID

  React.useEffect(() => {
    if (typeof window === "undefined" || !videoRef.current) return;

    // Check if videoId has changed compared to previous render
    // If yes, we must dispose the old player and create a new one
    if (previousVideoIdRef.current !== videoId) {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      previousVideoIdRef.current = videoId;
    }

    // Check for duplicate slide to avoid unnecessary initializations on load
    // But allow initialization if isActive is true (meaning it came to center)
    const isDuplicate = videoRef.current?.closest(".swiper-slide-duplicate");
    if (isDuplicate && !isActive) return;

    // Initialize Player
    if (!playerRef.current) {
      const player = (playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        muted: true,
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
          iv_load_policy: 3,
          cc_load_policy: 0,
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
        },
      }));

      player.ready(() => {
        player.muted(true);
      });
    }

    // --- HANDLE PLAY/PAUSE ---
    if (playerRef.current) {
      if (isActive) {
        setTimeout(() => {
          if (playerRef.current) {
            playerRef.current.currentTime(0);
            playerRef.current.play().catch((e) => {
              console.log("Autoplay prevented:", e);
            });
          }
        }, 100);
      } else {
        playerRef.current.pause();
      }
    }
  }, [isActive, videoId]); // Run effect when these change

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
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

// --- 3. Main Component ---
export default function VideoGallerySlider() {
  const [mounted, setMounted] = React.useState(false);
  const swiperRef = useRef<SwiperClass | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-5xl font-bold text-[#00477C] leading-17 tracking-[-5%] text-center">
          কেন আমরাই শিক্ষার্থী ও অভিভাবকদের <br className="md:flex hidden" />
          <span className="relative inline-block px-2 py-3 group">
            <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>
            <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="text-primary"> প্রথম পছন্দ?</span>
          </span>
        </h2>
        <figure className="flex items-center justify-center mt-4.5">
          <Image
            src={"/staricon.webp"}
            width={162}
            height={45}
            alt="star icon"
            className=""
          />
        </figure>
      </div>

      <div className="relative w-full container mx-auto py-16 bg-white overflow-hidden">
        {/* Background decorative blob */}
        <div className="absolute left-[-100px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#F3066E]/10 blur-[120px] rounded-full -z-10" />

        <Swiper
          modules={[Autoplay, Navigation]}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={true}
          loopAdditionalSlides={videoIds.length} // Ensure enough clones for gap-less loop
          speed={600}
          spaceBetween={30}
          className="gallery-swiper !overflow-visible py-10"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            swiper.on("click", (s) => {
              if (s.clickedIndex !== undefined) {
                s.slideToLoop(s.clickedIndex);
              }
            });
          }}
        >
          {videoIds.map((id, index) => (
            <SwiperSlide
              key={id} // Use 'id' as key, better than index for React reconciliation
              className="!w-[260px]"
            >
              {({ isActive }) => (
                <div
                  className={`
                    relative rounded-[30px] overflow-hidden cursor-pointer select-none
                    transition-all duration-500 ease-out
                    ${
                      isActive
                        ? "w-[400px] scale-110 border-[6px] border-[#F3066E] z-50 shadow-[0_25px_50px_-12px_rgba(243,6,110,0.5)] bg-black"
                        : "w-[260px] scale-100 border-2 border-blue-400 z-10 opacity-70 bg-black grayscale hover:grayscale-0 hover:opacity-90"
                    }
                  `}
                >
                  {/* 9:16 Aspect Ratio Container */}
                  <div className="relative aspect-[9/16] w-full bg-gray-900">
                    <VideoPlayer videoId={id} isActive={isActive} />

                    {/* Overlays */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                    )}

                    {!isActive && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-pulse">
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

                    {isActive && (
                      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
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
          }

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
          }
          .video-js:hover .vjs-big-play-button {
            transform: translate(-50%, -50%) scale(1.1);
            background-color: #f3066e;
          }
          .swiper-slide:not(.swiper-slide-active) .video-js .vjs-control-bar {
            display: none !important;
          }
        `}</style>
      </div>
    </>
  );
}
