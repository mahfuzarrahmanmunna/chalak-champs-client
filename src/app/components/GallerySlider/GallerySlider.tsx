"use client";
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import Image from "next/image";
import api from "@/lib/api";

// --- DYNAMIC TYPES ---
interface VideoData {
  youtubeId: string;
  thumbnail: string;
  isActive: boolean;
  order: number;
  _id: string;
}

// --- HELPERS ---
const getThumbnailUrl = (
  thumbnail: string | undefined,
  youtubeId: string,
): string => {
  if (thumbnail && thumbnail.trim() !== "") {
    const trimmed = thumbnail.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
};

// --- YOUTUBE API SINGLETON LOADER ---
let ytApiPromise: Promise<void> | null = null;

const loadYouTubeAPI = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.reject();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = () => resolve();
  });

  return ytApiPromise;
};

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// --- BUFFER THUMBNAIL COMPONENT ---
const BufferThumbnail: React.FC<{ thumbnail: string; youtubeId: string }> = ({
  thumbnail,
  youtubeId,
}) => {
  const [src, setSrc] = useState(() => getThumbnailUrl(thumbnail, youtubeId));
  const fallbackSrc = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <Image
      src={src}
      alt="Video Thumbnail"
      fill
      className="object-cover"
      unoptimized
      onError={() => {
        if (src !== fallbackSrc) setSrc(fallbackSrc);
      }}
    />
  );
};

// --- LIGHTWEIGHT SKELETON ---
const SkeletonCard: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div
    className={`
      relative rounded-[16px] md:rounded-[20px] overflow-hidden
      w-[180px] h-[320px] md:w-[200px] md:h-[356px] bg-gray-100 animate-pulse
      transition-all duration-[450ms] cubic-bezier(0.22, 1, 0.36, 1)
      ${
        isActive
          ? "scale-[1.15] md:scale-[1.18] border-[2px] border-[#F3066E]/80 z-50 shadow-[0_20px_60px_-15px_rgba(243,5,109,0.45),0_0_0_1px_rgba(243,5,109,0.1)]"
          : "scale-[0.88] border border-gray-200/50 opacity-50"
      }
    `}
  >
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gray-200/50 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-gray-400/60 ml-0.5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  </div>
);

const VideoGallerySkeleton: React.FC = () => {
  const cardCount = 7;
  const activeIndex = Math.floor(cardCount / 2);
  return (
    <div className="text-center mb-10 md:mb-14">
      <div className="flex flex-col items-center gap-3 w-full max-w-xl mx-auto">
        <div className="h-6 md:h-10 w-[85%] bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-6 md:h-10 w-[40%] bg-gray-100 rounded-lg animate-pulse" />
      </div>
      <div className="flex items-center justify-center mt-4">
        <div className="w-[162px] h-[45px] bg-gray-100 rounded-lg animate-pulse" />
      </div>
      <div className="relative w-full container mx-auto py-12 bg-white overflow-visible mt-10">
        <div className="flex items-center justify-center gap-[14px] py-8 pb-12">
          {Array.from({ length: cardCount }).map((_, i) => (
            <SkeletonCard key={i} isActive={i === activeIndex} />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- LAZY YOUTUBE PLAYER WRAPPER ---
interface VideoPlayerWrapperProps {
  videoId: string;
  shouldPlay: boolean;
  onEnd: () => void;
}

const VideoPlayerWrapper: React.FC<VideoPlayerWrapperProps> = ({
  videoId,
  shouldPlay,
  onEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (shouldPlay) {
      if (playerRef.current) {
        // Player exists, just resume
        playerRef.current.playVideo();
      } else {
        // Lazy Initialization
        loadYouTubeAPI().then(() => {
          if (!containerRef.current) return;

          playerRef.current = new window.YT.Player(containerRef.current, {
            videoId,
            playerVars: {
              controls: 1,
              modestbranding: 1,
              rel: 0,
              playsinline: 1,
              iv_load_policy: 3,
              cc_load_policy: 0,
            },
            events: {
              onReady: (event: any) => {
                // User explicitly clicked, so enable audio directly
                event.target.unMute();
                event.target.setVolume(100);
                event.target.playVideo();
              },
              onStateChange: (event: any) => {
                if (event.data === window.YT.PlayerState.ENDED) {
                  onEndRef.current();
                }
              },
            },
          });
        });
      }
    } else {
      // Pause if playing
      if (
        playerRef.current &&
        typeof playerRef.current.pauseVideo === "function"
      ) {
        playerRef.current.pauseVideo();
      }
    }
  }, [shouldPlay, videoId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 z-10 bg-black transition-opacity duration-300 ${
        shouldPlay ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

// --- MAIN GALLERY COMPONENT ---
export default function VideoGallerySlider1() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Separated States: Active is for carousel, Playing is for video
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Refs for ultra-smooth 60fps dragging (bypasses React re-renders)
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startTranslateX = useRef(0);
  const currentTranslateX = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);

  const [cardWidth, setCardWidth] = useState(180);
  const GAP = 14;
  const STEP = cardWidth + GAP;

  // Sync ref with state
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Responsive card width
  useEffect(() => {
    const handleResize = () =>
      setCardWidth(window.innerWidth >= 768 ? 200 : 180);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Snap logic
  const snapTo = useCallback(
    (index: number, smooth = true) => {
      if (!trackRef.current) return;
      const x = -index * STEP;
      trackRef.current.style.transition = smooth
        ? "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
        : "none";
      trackRef.current.style.transform = `translateX(calc(-50% + ${x}px))`;
      currentTranslateX.current = x;
    },
    [STEP],
  );

  // Re-snap on resize or index change
  useEffect(() => {
    snapTo(activeIndex, false);
  }, [activeIndex, cardWidth, snapTo]);

  // Fetch API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get("/video-gallery");
        if (res.data.success && res.data.data?.videos) {
          const activeVideos = res.data.data.videos
            .filter((v: VideoData) => v.isActive)
            .sort((a: VideoData, b: VideoData) => a.order - b.order);
          setVideos(activeVideos);
          // Set initial active to middle
          setActiveIndex(Math.floor(activeVideos.length / 2));
        }
      } catch (error) {
        console.error("Failed to load video gallery:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const getClickedIndex = (clientX: number) => {
    if (!trackRef.current) return activeIndexRef.current;
    const children = trackRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const rect = children[i].getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right) return i;
    }
    return activeIndexRef.current;
  };

  const handlePlayPause = () => {
    const currentId = videos[activeIndexRef.current]?.youtubeId;
    if (!currentId) return;
    setPlayingVideoId((prev) => (prev === currentId ? null : currentId));
  };

  // --- Premium Drag Handlers ---
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = false;
    startX.current = e.clientX;
    startTranslateX.current = currentTranslateX.current;
    lastX.current = e.clientX;
    lastTime.current = Date.now();
    velocity.current = 0;

    if (trackRef.current) trackRef.current.style.transition = "none";
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const dx = e.clientX - startX.current;

    if (!isDragging.current && Math.abs(dx) > 5) {
      isDragging.current = true;
    }

    if (isDragging.current) {
      const now = Date.now();
      const dt = now - lastTime.current;
      if (dt > 0) velocity.current = (e.clientX - lastX.current) / dt;
      lastX.current = e.clientX;
      lastTime.current = now;

      const newX = startTranslateX.current + dx;
      currentTranslateX.current = newX;

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(calc(-50% + ${newX}px))`;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    if (!isDragging.current) {
      const clickedIndex = getClickedIndex(e.clientX);
      if (clickedIndex === activeIndexRef.current) {
        handlePlayPause();
      } else {
        setActiveIndex(clickedIndex);
        activeIndexRef.current = clickedIndex;
        snapTo(clickedIndex);
        setPlayingVideoId(null); // Pause if switching active via click
      }
      return;
    }

    // Drag End -> Momentum Snapping
    const momentum = velocity.current * 150;
    let projectedX = currentTranslateX.current + momentum;
    let newIndex = Math.round(-projectedX / STEP);
    newIndex = Math.max(0, Math.min(videos.length - 1, newIndex));

    if (newIndex !== activeIndexRef.current) {
      setPlayingVideoId(null); // Pause video if swiped away
    }

    setActiveIndex(newIndex);
    activeIndexRef.current = newIndex;
    snapTo(newIndex);
  };

  if (isLoading) return <VideoGallerySkeleton />;
  if (videos.length === 0) return null;

  return (
    <>
      {/* Header Section */}
      <div className="text-center mb-10 md:mb-14">
        <h2 className="text-2xl md:text-5xl font-bold text-[#00477C] leading-[1.7] tracking-tight">
          কেন আমরাই শিক্ষারী ও অভিভাবকদের
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

      <div className="relative w-full container mx-auto py-12 bg-white overflow-visible">
        {/* Soft Background Glow */}
        <div className="absolute left-[-100px] top-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#F3066E]/8 blur-[100px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute right-[-80px] top-1/3 w-[250px] h-[250px] bg-[#00477C]/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

        {/* Custom Carousel Container */}
        <div
          className="relative w-full select-none"
          style={{ touchAction: "pan-y" }} // Native scroll fix: allows vertical scroll, captures horizontal drag
        >
          <div
            ref={trackRef}
            className="inline-flex items-center gap-[14px] py-8 will-change-transform"
            style={{
              position: "relative",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {videos.map((video, index) => {
              const isActive = index === activeIndex;
              const isPlaying = playingVideoId === video.youtubeId;

              return (
                <div
                  key={video._id}
                  className={`
                    relative flex-shrink-0 rounded-[16px] md:rounded-[20px] overflow-hidden cursor-pointer
                    w-[180px] h-[320px] md:w-[200px] md:h-[356px] bg-gray-900
                    transition-all duration-[450ms] cubic-bezier(0.22, 1, 0.36, 1)
                    ${
                      isActive
                        ? "scale-[1.15] md:scale-[1.18] border-[2px] border-[#F3066E]/80 z-50 shadow-[0_20px_60px_-15px_rgba(243,5,109,0.45),0_0_0_1px_rgba(243,5,109,0.1)]"
                        : "scale-[0.88] border border-white/10 opacity-50 hover:opacity-70 hover:scale-[0.92]"
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-[16px] md:rounded-[20px] ring-1 ring-inset ring-white/10 z-[60] pointer-events-none" />
                  )}

                  <div className="relative w-full h-full bg-gray-900">
                    {/* Thumbnail (Always Rendered) */}
                    <BufferThumbnail
                      thumbnail={video.thumbnail}
                      youtubeId={video.youtubeId}
                    />

                    {/* 1. PLAY BUTTON UI (Active & Not Playing) */}
                    {isActive && !isPlaying && (
                      <button
                        className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 group"
                        aria-label="Play video"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingVideoId(video.youtubeId);
                        }}
                      >
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-[#F3066E]/80 group-hover:border-[#F3066E]">
                          <svg
                            className="w-7 h-7 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </button>
                    )}

                    {/* 2. PAUSE OVERLAY UI (Active & Playing) */}
                    {isActive && isPlaying && (
                      <div
                        className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-transparent hover:bg-black/30 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingVideoId(null);
                        }}
                      >
                        <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:!opacity-100 transition-opacity duration-200 shadow-lg">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* 3. YOUTUBE IFRAME (Lazy Loaded) */}
                    <VideoPlayerWrapper
                      videoId={video.youtubeId}
                      shouldPlay={isPlaying}
                      onEnd={() => setPlayingVideoId(null)}
                    />

                    {/* Inactive Gradients & Icons */}
                    {!isActive && (
                      <>
                        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
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
                      </>
                    )}

                    {/* Bottom UI Elements (Shorts Label) */}
                    <div className="absolute bottom-3 left-3 right-3 pointer-events-none z-40">
                      <div className="flex items-center gap-1.5 opacity-60">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48,1.73-1.73.47-.13,1.33-.22,2.65-.28 1.3-.07,2.49-.1,3.59-.1L12 5c4.19 0,6.8.16,7.83.44.9.25,1.48.83,1.73 1.73z" />
                        </svg>
                        <span className="text-[9px] text-white/70 font-medium uppercase tracking-widest">
                          Shorts
                        </span>
                      </div>
                    </div>

                    {/* Top UI Elements (Active Only) */}
                    {isActive && (
                      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/40 to-transparent z-40 pointer-events-none" />
                    )}

                    {isActive && isPlaying && (
                      <div className="absolute top-3 left-3 z-40 flex items-center gap-2 pointer-events-none">
                        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/10">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F3066E] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F3066E]"></span>
                          </span>
                          <span className="text-[8px] text-white/90 font-semibold uppercase tracking-wider">
                            Playing
                          </span>
                        </div>
                      </div>
                    )}

                    {isActive && (
                      <div className="absolute top-3 right-3 z-40 pointer-events-none">
                        <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/10">
                          <svg
                            className="w-2.5 h-2.5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48,1.73-1.73.47-.13,1.33-.22,2.65-.28 1.3-.07,2.49-.1,3.59-.1L12 5c4.19 0,6.8.16,7.83.44.9.25,1.48.83,1.73 1.73z" />
                          </svg>
                          <span className="text-[8px] text-white/80 font-semibold uppercase tracking-wider">
                            Shorts
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300/60" />
          <div className="w-8 h-1 bg-gray-300/40 rounded-full" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300/60" />
        </div>
      </div>
    </>
  );
}
