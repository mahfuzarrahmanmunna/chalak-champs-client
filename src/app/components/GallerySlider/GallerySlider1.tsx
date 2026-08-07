"use client";
import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { Observer } from "gsap/Observer";
import api from "@/lib/api";

// Register GSAP plugins (client-side only)
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable, Observer);
}

// --- DYNAMIC TYPES ---
interface VideoData {
  youtubeId: string;
  thumbnail: string;
  isActive: boolean;
  order: number;
  _id: string;
}

// --- HELPERS ---
const getThumbnailUrl = (thumbnail: string | undefined, youtubeId: string): string => {
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

    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
  });

  return ytApiPromise;
};

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// --- THUMBNAIL COMPONENT ---
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
        if (src !== fallbackSrc) {
          setSrc(fallbackSrc);
        }
      }}
    />
  );
};

// --- CUSTOM PLAY BUTTON ---
const PlayButton: React.FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="relative z-20 w-16 h-16 md:w-20 md:h-20 rounded-full backdrop-blur-md bg-white/10 border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[#F3066E]/30 shadow-2xl group"
    aria-label="Play Video"
  >
    <span className="absolute inset-0 rounded-full bg-white/10 group-hover:bg-[#F3066E]/20 animate-pulse opacity-75"></span>
    <svg className="relative w-7 h-7 md:w-9 md:h-9 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  </button>
);

// --- YOUTUBE PLAYER COMPONENT ---
interface YouTubePlayerProps {
  videoId: string;
  isPlaying: boolean;
  isPaused: boolean;
  onEnded: () => void;
  onTogglePlayPause: () => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, isPlaying, isPaused, onEnded, onTogglePlayPause }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const onEndedRef = useRef(onEnded);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  // Lazy Initialize Player on Mount (Triggered by user click)
  useEffect(() => {
    if (!containerRef.current) return;
    let isMounted = true;

    loadYouTubeAPI().then(() => {
      if (!isMounted || !containerRef.current || playerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 0, // Do not use autoplay flag
          controls: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            // Play with audio on init
            event.target.unMute();
            event.target.setVolume(100);
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            const YT = window.YT;
            if (event.data === YT.PlayerState.ENDED) {
              onEndedRef.current();
            }
          },
        },
      });
    });

    return () => {
      isMounted = false;
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId]);

  // Control Play/Pause based on state
  useEffect(() => {
    if (!playerRef.current || !isReady) return;

    if (isPlaying) {
      playerRef.current.unMute();
      playerRef.current.setVolume(100);
      playerRef.current.playVideo();
    } else if (isPaused) {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying, isPaused, isReady]);

  return (
    <div className="absolute inset-0 w-full h-full bg-black z-10 overflow-hidden">
      <div 
        ref={containerRef} 
        className="w-full h-full absolute inset-0" 
        style={{ opacity: isReady && isPlaying ? 1 : 0 }} 
      />
      
      {/* Thumbnail & Play Button (Shows when paused or before ready) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <BufferThumbnail thumbnail="" youtubeId={videoId} />
          <PlayButton onClick={(e) => { e.stopPropagation(); onTogglePlayPause(); }} />
        </div>
      )}

      {/* Transparent Click Layer for Play/Pause (Top 80%) 
          Leaves bottom 20% open for native YouTube controls */}
      {isReady && isPlaying && (
        <div 
          className="absolute top-0 left-0 right-0 h-[80%] z-30 cursor-pointer group"
          onClick={(e) => { e.stopPropagation(); onTogglePlayPause(); }}
        >
          {/* Hover Pause Indicator */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- LIGHTWEIGHT SKELETON ---
const SkeletonCard: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div
    className={`absolute rounded-[16px] md:rounded-[20px] overflow-hidden w-[180px] h-[320px] md:w-[200px] md:h-[356px] bg-gray-100 animate-pulse flex-shrink-0 ${
      isActive ? "scale-[1.18] z-50" : "scale-[0.88] opacity-50"
    }`}
  />
);

const VideoGallerySkeleton: React.FC = () => {
  return (
    <div className="text-center mb-10 md:mb-14">
      <div className="flex flex-col items-center gap-3 w-full max-w-xl mx-auto">
        <div className="h-6 md:h-10 w-[85%] bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-6 md:h-10 w-[40%] bg-gray-100 rounded-lg animate-pulse" />
      </div>
      <div className="flex items-center justify-center mt-4">
        <div className="w-[162px] h-[45px] bg-gray-100 rounded-lg animate-pulse" />
      </div>
      <div className="relative w-full container mx-auto py-12 bg-white overflow-hidden mt-10">
        <div className="relative flex items-center justify-center h-[380px] md:h-[420px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} isActive={i === 2} />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN GALLERY COMPONENT ---
export default function VideoGallerySlider1() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Video State (Independent of Carousel State)
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [pausedVideoId, setPausedVideoId] = useState<string | null>(null);

  // Drag tracking refs (No React re-renders during drag)
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);

  // Create infinite array (3 copies)
  const renderItems = useMemo(() => {
    if (videos.length === 0) return [];
    return [...videos, ...videos, ...videos];
  }, [videos]);

  const getSpacing = useCallback(() => {
    if (typeof window === "undefined") return 214;
    return window.innerWidth < 768 ? 194 : 214; // 180+14 | 200+14
  }, []);

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
          // Start at the middle copy
          setActiveIndex(activeVideos.length);
        }
      } catch (error) {
        console.error("Failed to load video gallery:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Ref to track activeIndex inside GSAP callbacks
  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // GSAP Carousel Setup
  useEffect(() => {
    if (!isLoading && videos.length > 0 && containerRef.current && trackRef.current) {
      const track = trackRef.current;
      const spacing = getSpacing();
      
      const getTargetX = (index: number) => 
        -index * spacing + (containerRef.current!.offsetWidth / 2) - (spacing / 2);

      // Set initial position
      gsap.set(track, { x: getTargetX(activeIndex) });

      const updateVisuals = () => {
        if (!containerRef.current) return;
        const trackX = gsap.getProperty(track, "x") as number;
        const containerCenter = containerRef.current.offsetWidth / 2;
        
        slideRefs.current.forEach((el) => {
          if (!el) return;
          const elCenter = el.offsetLeft + trackX + (el.offsetWidth / 2);
          const dist = Math.abs(containerCenter - elCenter);
          
          const scale = dist < 20 ? 1.18 : gsap.utils.mapRange(20, spacing, 1.18, 0.88, dist);
          const opacity = dist < 20 ? 1 : gsap.utils.mapRange(20, spacing * 1.5, 1, 0.4, Math.min(dist, spacing * 1.5));
          const zIndex = Math.floor(1000 - dist);
          
          gsap.to(el, { scale, opacity, zIndex, duration: 0.3, overwrite: "auto" });
        });
      };

      updateVisuals();

      const goToSlide = (index: number) => {
        gsap.to(track, {
          x: getTargetX(index),
          duration: 0.6,
          ease: "power3.out",
          onUpdate: updateVisuals,
          onComplete: () => {
            isDraggingRef.current = false;
            
            // Infinite loop wrap
            if (index < videos.length) {
              gsap.set(track, { x: getTargetX(index + videos.length) });
              setActiveIndex(index + videos.length);
              updateVisuals();
            } else if (index >= videos.length * 2) {
              gsap.set(track, { x: getTargetX(index - videos.length) });
              setActiveIndex(index - videos.length);
              updateVisuals();
            } else {
              setActiveIndex(index);
            }
          }
        });
      };

      // Draggable
      const draggable = Draggable.create(track, {
        type: "x",
        inertia: true,
        dragClickables: true,
        minimumMovement: 10,
        bounds: {
          minX: getTargetX(renderItems.length - 1),
          maxX: getTargetX(0),
        },
        onDragStart: () => { isDraggingRef.current = true; },
        onDrag: updateVisuals,
        onThrowUpdate: updateVisuals,
        onDragEnd: function() {
          const endX = this.x;
          const containerCenter = containerRef.current!.offsetWidth / 2;
          const closestIndex = Math.round(-(endX - containerCenter + spacing / 2) / spacing);
          goToSlide(closestIndex);
        }
      })[0];

      // Observer for Wheel/Trackpad
      const observer = Observer.create({
        target: containerRef.current,
        type: "wheel",
        wheelSpeed: -1,
        onWheel: (self) => {
          if (isDraggingRef.current) return;
          if (Math.abs(self.deltaX) > Math.abs(self.deltaY)) {
            if (self.deltaX < 0) {
              goToSlide(activeIndexRef.current + 1);
            } else {
              goToSlide(activeIndexRef.current - 1);
            }
            isDraggingRef.current = true; // Prevent double trigger
            setTimeout(() => { isDraggingRef.current = false; }, 400);
          }
        }
      });

      // Resize listener
      const handleResize = () => {
        gsap.set(track, { x: getTargetX(activeIndexRef.current) });
        updateVisuals();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        draggable.kill();
        observer.kill();
        window.removeEventListener("resize", handleResize);
        gsap.killTweensOf(track);
      };
    }
  }, [isLoading, videos, getSpacing, renderItems.length]);

  // Clear video state when slide changes
  useEffect(() => {
    setPlayingVideoId(null);
    setPausedVideoId(null);
  }, [activeIndex]);

  // Interaction Handlers (Click vs Drag)
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isDraggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (Math.abs(e.clientX - dragStartX.current) > 10) {
      isDraggingRef.current = true;
    }
  };

  const handleTogglePlayPause = (videoId: string) => {
    if (isDraggingRef.current) return; // Prevent click if it was a drag

    if (playingVideoId === videoId) {
      // Currently playing -> Pause
      setPlayingVideoId(null);
      setPausedVideoId(videoId);
    } else {
      // Currently paused or idle -> Play
      setPausedVideoId(null);
      setPlayingVideoId(videoId);
    }
  };

  const handleVideoEnded = (videoId: string) => {
    // Reset to thumbnail state
    if (playingVideoId === videoId) {
      setPlayingVideoId(null);
      setPausedVideoId(null);
    }
  };

  if (isLoading) {
    return <VideoGallerySkeleton />;
  }

  if (videos.length === 0) return null;

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
        {/* Soft Background Glow */}
        <div className="absolute left-[-100px] top-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#F3066E]/8 blur-[100px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute right-[-80px] top-1/3 w-[250px] h-[250px] bg-[#00477C]/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

        {/* Carousel Container */}
        <div 
          ref={containerRef} 
          className="relative w-full h-[380px] md:h-[420px] overflow-hidden cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          <div ref={trackRef} className="absolute top-1/2 -translate-y-1/2 left-0 flex items-center" style={{ height: "100%" }}>
            {renderItems.map((video, index) => {
              const isActive = index === activeIndex;
              const isPlaying = playingVideoId === video.youtubeId;
              const isPaused = pausedVideoId === video.youtubeId;
              const showPlayer = isActive && (isPlaying || isPaused);

              return (
                <div
                  key={`${video._id}-${index}`}
                  ref={(el) => slideRefs.current[index] = el}
                  className="absolute left-0 top-1/2 -translate-y-1/2 flex-shrink-0"
                  style={{ marginLeft: `${index * getSpacing()}px` }}
                >
                  <div
                    className={`relative rounded-[16px] md:rounded-[20px] overflow-hidden select-none group
                      w-[180px] h-[320px] md:w-[200px] md:h-[356px] bg-gray-900
                      ${isActive ? "border-[2px] border-[#F3066E]/80 shadow-[0_20px_60px_-15px_rgba(243,5,109,0.45),0_0_0_1px_rgba(243,5,109,0.1)]" : "border border-white/10"}
                    `}
                  >
                    {/* Render YouTube Player ONLY if active and user has clicked play/pause */}
                    {showPlayer ? (
                      <YouTubePlayer
                        videoId={video.youtubeId}
                        isPlaying={isPlaying}
                        isPaused={isPaused}
                        onEnded={() => handleVideoEnded(video.youtubeId)}
                        onTogglePlayPause={() => handleTogglePlayPause(video.youtubeId)}
                      />
                    ) : (
                      <div className="absolute inset-0">
                        <BufferThumbnail thumbnail={video.thumbnail} youtubeId={video.youtubeId} />
                        
                        {/* Gradient Overlay for Inactive */}
                        {!isActive && (
                          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
                        )}
                        
                        {/* Center Play Button for Active Thumbnail */}
                        {isActive && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <PlayButton onClick={(e) => { e.stopPropagation(); handleTogglePlayPause(video.youtubeId); }} />
                          </div>
                        )}

                        {/* Small Play Icon Overlay for Inactive */}
                        {!isActive && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/[0.15] flex items-center justify-center shadow-lg">
                              <svg className="w-5 h-5 text-white/80 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Badges (Always visible) */}
                    {isActive && (
                      <>
                        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/40 to-transparent z-50 pointer-events-none" />
                        <div className="absolute top-3 left-3 z-[60] flex items-center gap-2 pointer-events-none">
                          <div className="bg-[#F3066E] text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.15em] shadow-[0_4px_12px_rgba(243,5,109,0.5)] flex items-center gap-1.5">
                            <span className={`w-1 h-1 bg-white rounded-full ${isPlaying ? "animate-ping" : ""}`} />
                            <span className="relative">SHORTS</span>
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 z-[60] pointer-events-none">
                          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/10">
                            <svg className="w-2.5 h-2.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48,1.73-1.73.47-.13,1.33-.22,2.65-.28 1.3-.07,2.49-.1,3.59-.1L12 5c4.19 0,6.8.16,7.83.44.9.25,1.48.83,1.73 1.73z" />
                            </svg>
                            <span className="text-[8px] text-white/80 font-semibold uppercase tracking-wider">
                              WATCH
                            </span>
                          </div>
                        </div>
                      </>
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