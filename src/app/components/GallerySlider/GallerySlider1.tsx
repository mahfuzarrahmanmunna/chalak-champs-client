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

// ─── DATA TYPES ───────────────────────────────────────────────
interface VideoData {
  youtubeId: string;
  thumbnail: string;
  isActive: boolean;
  order: number;
  _id: string;
}

// ─── YOUTUBE TYPE DEFINITIONS ─────────────────────────────────
interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
}

interface YTPlayerEvent {
  target: YTPlayerInstance;
  data: number;
}

interface YTPlayerOptions {
  width?: string | number;
  height?: string | number;
  videoId?: string;
  playerVars?: Record<string, unknown>;
  events?: {
    onReady?: (event: { target: YTPlayerInstance }) => void;
    onStateChange?: (event: YTPlayerEvent) => void;
    onError?: (event: YTPlayerEvent) => void;
  };
}

interface YTNamespace {
  Player: new (element: HTMLElement, options: YTPlayerOptions) => YTPlayerInstance;
  PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

// ─── HELPERS ──────────────────────────────────────────────────
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

const isValidYouTubeId = (id: string): boolean => {
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
};

// ─── YOUTUBE API SINGLETON LOADER ─────────────────────────────
declare global {
  interface Window {
    YT: YTNamespace | undefined;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

let ytApiPromise: Promise<YTNamespace> | null = null;

const loadYouTubeAPI = (): Promise<YTNamespace> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("SSR environment"));
  }

  // Already fully loaded
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }

  // Already loading — return shared promise
  if (ytApiPromise) {
    return ytApiPromise;
  }

  const API_URL = "https://www.youtube.com/iframe_api";
  const TIMEOUT_MS = 15000;

  ytApiPromise = new Promise<YTNamespace>((resolve, reject) => {
    let settled = false;

    // Preserve any existing callback so other code is not broken
    const prevCallback = window.onYouTubeIframeAPIReady;

    // Timeout: if the API does not become available, reject so callers can recover
    const timeoutId = setTimeout(() => {
      if (settled) return;
      settled = true;
      ytApiPromise = null;
      reject(new Error("YouTube API load timed out"));
    }, TIMEOUT_MS);

    window.onYouTubeIframeAPIReady = () => {
      if (settled) {
        // Promise already settled (e.g., timed out). Still honor preserved callback.
        if (prevCallback) {
          try { prevCallback(); } catch { /* ignore */ }
        }
        return;
      }
      settled = true;
      clearTimeout(timeoutId);

      // Call preserved callback chain
      if (prevCallback) {
        try { prevCallback(); } catch { /* ignore */ }
      }

      if (window.YT && window.YT.Player) {
        resolve(window.YT);
      } else {
        ytApiPromise = null;
        reject(new Error("YouTube API loaded but Player unavailable"));
      }
    };

    // Reuse existing script if present (prevents duplicate injection during HMR)
    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${API_URL}"]`
    );

    if (!script) {
      script = document.createElement("script");
      script.src = API_URL;
      script.async = true;
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
      } else {
        document.head.appendChild(script);
      }
    }
  });

  return ytApiPromise;
};

// ─── THUMBNAIL COMPONENT ──────────────────────────────────────
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

// ─── CUSTOM PLAY BUTTON ───────────────────────────────────────
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

// ─── PLAYER STATUS TYPE ───────────────────────────────────────
type PlayerStatus = "loading" | "buffering" | "playing" | "paused" | "error";

// ─── YOUTUBE PLAYER COMPONENT ─────────────────────────────────
interface YouTubePlayerProps {
  videoId: string;
  thumbnail: string;
  isPlaying: boolean;
  isPaused: boolean;
  onEnded: () => void;
  onTogglePlayPause: () => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  thumbnail,
  isPlaying,
  isPaused,
  onEnded,
  onTogglePlayPause,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const playerReadyRef = useRef(false);
  const isMountedRef = useRef(true);
  const statusRef = useRef<PlayerStatus>("loading");
  const onEndedRef = useRef(onEnded);

  const initTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [status, setStatus] = useState<PlayerStatus>("loading");
  const [isReady, setIsReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Keep refs in sync with latest prop/state values to avoid stale closures
  useEffect(() => { onEndedRef.current = onEnded; }, [onEnded]);
  useEffect(() => { statusRef.current = status; }, [status]);

  const clearTimeouts = useCallback(() => {
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = null;
    }
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
  }, []);

  // ── Player initialization (runs on mount and retry) ──
  useEffect(() => {
    isMountedRef.current = true;
    playerReadyRef.current = false;
    setStatus("loading");
    statusRef.current = "loading";

    const host = containerRef.current;
    if (!host) return;

    let cancelled = false;

    // Init timeout: if player doesn't become ready in 10s, show error
    initTimeoutRef.current = setTimeout(() => {
      if (cancelled || !isMountedRef.current) return;
      if (!playerReadyRef.current) {
        setStatus("error");
        statusRef.current = "error";
      }
    }, 10000);

    loadYouTubeAPI()
      .then((YT) => {
        if (cancelled || !isMountedRef.current || !host || playerRef.current) return;

        // Create a CHILD div for the player — never pass the container directly
        // so that React Strict Mode remounts and HMR don't corrupt the DOM
        const playerDiv = document.createElement("div");
        playerDiv.style.width = "100%";
        playerDiv.style.height = "100%";
        host.appendChild(playerDiv);

        playerRef.current = new YT.Player(playerDiv, {
          width: "100%",
          height: "100%",
          videoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            iv_load_policy: 3,
            cc_load_policy: 0,
          },
          events: {
            onReady: () => {
              if (cancelled || !isMountedRef.current) return;

              // Clear init timeout — player is ready
              if (initTimeoutRef.current) {
                clearTimeout(initTimeoutRef.current);
                initTimeoutRef.current = null;
              }

              playerReadyRef.current = true;
              setIsReady(true);
              // play/pause effect (triggered by isReady change) will call playVideo()
            },
            onStateChange: (event: YTPlayerEvent) => {
              if (cancelled || !isMountedRef.current) return;

              const PS = YT.PlayerState;

              if (event.data === PS.PLAYING) {
                // Playback confirmed — clear timeout
                if (playbackTimeoutRef.current) {
                  clearTimeout(playbackTimeoutRef.current);
                  playbackTimeoutRef.current = null;
                }
                setStatus("playing");
                statusRef.current = "playing";
              } else if (event.data === PS.BUFFERING) {
                setStatus("buffering");
                statusRef.current = "buffering";
              } else if (event.data === PS.PAUSED) {
                setStatus("paused");
                statusRef.current = "paused";
              } else if (event.data === PS.ENDED) {
                if (playbackTimeoutRef.current) {
                  clearTimeout(playbackTimeoutRef.current);
                  playbackTimeoutRef.current = null;
                }
                onEndedRef.current();
              }
            },
            onError: () => {
              if (cancelled || !isMountedRef.current) return;
              clearTimeouts();
              setStatus("error");
              statusRef.current = "error";
            },
          },
        });
      })
      .catch(() => {
        if (cancelled || !isMountedRef.current) return;
        clearTimeouts();
        setStatus("error");
        statusRef.current = "error";
      });

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      clearTimeouts();
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch { /* ignore */ }
        playerRef.current = null;
      }
      // Clean up any DOM remnants (iframe or child divs)
      if (host) {
        host.innerHTML = "";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, retryCount]);

  // ── Play / Pause control ──
  useEffect(() => {
    if (!playerRef.current || !playerReadyRef.current) return;

    if (isPlaying) {
      // Only set status + timeout if not already playing
      if (statusRef.current !== "playing") {
        if (statusRef.current === "error") {
          setStatus("loading");
          statusRef.current = "loading";
        } else {
          setStatus("buffering");
          statusRef.current = "buffering";
        }

        // Playback-start timeout: if video doesn't reach PLAYING in 12s, show error
        if (playbackTimeoutRef.current) {
          clearTimeout(playbackTimeoutRef.current);
        }
        playbackTimeoutRef.current = setTimeout(() => {
          if (!isMountedRef.current) return;
          if (statusRef.current !== "playing") {
            setStatus("error");
            statusRef.current = "error";
          }
        }, 12000);
      }

      playerRef.current.unMute();
      playerRef.current.setVolume(100);
      playerRef.current.playVideo();
    } else if (isPaused) {
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
        playbackTimeoutRef.current = null;
      }
      playerRef.current.pauseVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isPaused, isReady]);

  const handleRetry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  const youtubeWatchUrl = isValidYouTubeId(videoId)
    ? `https://www.youtube.com/watch?v=${videoId}`
    : null;

  return (
    <div className="absolute inset-0 w-full h-full bg-black z-10 overflow-hidden">
      {/* YouTube iframe container — opacity tied to actual playback */}
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0"
        style={{
          opacity: status === "playing" ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Thumbnail layer — stays visible until playback confirmed */}
      {status !== "playing" && (
        <div className="absolute inset-0 z-[5]">
          <BufferThumbnail thumbnail={thumbnail} youtubeId={videoId} />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Loading spinner — shows during initialization and buffering */}
      {(status === "loading" || status === "buffering") && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-12 h-12 border-4 border-white/20 border-t-[#F3066E] rounded-full animate-spin" />
        </div>
      )}

      {/* Play button — visible when paused */}
      {status === "paused" && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <PlayButton
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlayPause();
            }}
          />
        </div>
      )}

      {/* Error state — retry + open on YouTube */}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 p-4 text-center z-20 bg-black/50">
          <svg
            className="w-10 h-10 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <p className="text-white/70 text-xs max-w-[130px]">
            Video unavailable
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRetry();
            }}
            className="px-4 py-1.5 bg-[#F3066E] hover:bg-[#F3066E]/80 text-white text-xs font-semibold rounded-full transition-colors"
          >
            Retry
          </button>
          {youtubeWatchUrl && (
            <a
              href={youtubeWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-white/50 hover:text-white/80 text-[10px] underline mt-0.5"
            >
              Open on YouTube
            </a>
          )}
        </div>
      )}

      {/* Transparent click layer for pause (top 80%) — only when playing */}
      {status === "playing" && (
        <div
          className="absolute top-0 left-0 right-0 h-[80%] z-30 cursor-pointer group"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlayPause();
          }}
        >
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

// ─── LIGHTWEIGHT SKELETON ─────────────────────────────────────
const SkeletonCard: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div
    className={`absolute rounded-[16px] md:rounded-[20px] overflow-hidden w-[180px] h-[320px] md:w-[200px] md:h-[356px] bg-gray-100 animate-pulse flex-shrink-0 ${
      isActive ? "scale-[1.12] z-50" : "scale-[0.90] opacity-50"
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

// ─── MAIN GALLERY COMPONENT ───────────────────────────────────
export default function VideoGallerySlider1() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const goToSlideRef = useRef<(index: number) => void>(() => {});

  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Video state
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [pausedVideoId, setPausedVideoId] = useState<string | null>(null);

  // Interaction tracking refs
  const dragStartX = useRef(0);
  const isPointerDragging = useRef(false);
  const isAnimating = useRef(false);

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
        const res = await api.get("/api/video-gallery");
        if (res.data.success && res.data.data?.videos) {
          const activeVideos = res.data.data.videos
            .filter((v: VideoData) => v.isActive)
            .sort((a: VideoData, b: VideoData) => a.order - b.order);
          setVideos(activeVideos);
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

  // Clear video state when slide changes — stops previous video playback
  useEffect(() => {
    setPlayingVideoId(null);
    setPausedVideoId(null);
  }, [activeIndex]);

  // GSAP Carousel Setup
  useEffect(() => {
    if (!isLoading && videos.length > 0 && containerRef.current && trackRef.current) {
      const track = trackRef.current;
      const spacing = getSpacing();

      const getTargetX = (index: number) =>
        -index * spacing + (containerRef.current!.offsetWidth / 2) - (spacing / 2);

      gsap.set(track, { x: getTargetX(activeIndexRef.current) });

      const updateVisuals = () => {
        if (!containerRef.current) return;
        const trackX = gsap.getProperty(track, "x") as number;
        const containerCenter = containerRef.current.offsetWidth / 2;

        let closestIndex = activeIndexRef.current;
        let minDist = Infinity;

        slideRefs.current.forEach((el, i) => {
          if (!el) return;
          const elCenter = el.offsetLeft + trackX + (el.offsetWidth / 2);
          const dist = Math.abs(containerCenter - elCenter);
          if (dist < minDist) {
            minDist = dist;
            closestIndex = i;
          }
        });

        slideRefs.current.forEach((el, i) => {
          if (!el) return;
          const isActiveVisual = i === closestIndex;
          const scale = isActiveVisual ? 1.12 : 0.90;
          const opacity = isActiveVisual ? 1 : 0.5;
          const zIndex = isActiveVisual ? 50 : 0;

          gsap.to(el, { scale, opacity, zIndex, duration: 0.3, overwrite: "auto" });
        });
      };

      updateVisuals();

      const goToSlide = (index: number) => {
        if (isAnimating.current) return;
        isAnimating.current = true;

        gsap.to(track, {
          x: getTargetX(index),
          duration: 0.6,
          ease: "power3.out",
          onUpdate: updateVisuals,
          onComplete: () => {
            isAnimating.current = false;

            let newIndex = index;
            // Infinite loop wrap
            if (index < videos.length) {
              newIndex = index + videos.length;
              gsap.set(track, { x: getTargetX(newIndex) });
            } else if (index >= videos.length * 2) {
              newIndex = index - videos.length;
              gsap.set(track, { x: getTargetX(newIndex) });
            }

            setActiveIndex(newIndex);
            updateVisuals();
          }
        });
      };

      goToSlideRef.current = goToSlide;

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
        onDragStart: () => { isPointerDragging.current = true; },
        onDrag: updateVisuals,
        onThrowUpdate: updateVisuals,
        onDragEnd: function () {
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
          if (isAnimating.current) return;
          if (Math.abs(self.deltaX) > Math.abs(self.deltaY)) {
            if (self.deltaX < 0) {
              goToSlide(activeIndexRef.current + 1);
            } else {
              goToSlide(activeIndexRef.current - 1);
            }
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

  // Interaction Handlers (Click vs Drag)
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isPointerDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (Math.abs(e.clientX - dragStartX.current) > 10) {
      isPointerDragging.current = true;
    }
  };

  const handleTogglePlayPause = (videoId: string) => {
    if (isPointerDragging.current || isAnimating.current) return;

    if (playingVideoId === videoId) {
      setPlayingVideoId(null);
      setPausedVideoId(videoId);
    } else {
      setPausedVideoId(null);
      setPlayingVideoId(videoId);
    }
  };

  const handleVideoEnded = (videoId: string) => {
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
          onPointerUp={() => {
            setTimeout(() => { isPointerDragging.current = false; }, 50);
          }}
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
                  ref={(el) => { slideRefs.current[index] = el; }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 flex-shrink-0"
                  style={{ marginLeft: `${index * getSpacing()}px` }}
                >
                  <div
                    className={`relative rounded-[16px] md:rounded-[20px] overflow-hidden select-none group
                      w-[180px] h-[320px] md:w-[200px] md:h-[356px] bg-gray-900
                      ${isActive ? "border-[2px] border-[#F3066E]/80 shadow-[0_20px_60px_-15px_rgba(243,5,109,0.45),0_0_0_1px_rgba(243,5,109,0.1)]" : "border border-white/10 cursor-pointer"}
                    `}
                    onClick={() => {
                      if (!isActive && !isPointerDragging.current && !isAnimating.current) {
                        goToSlideRef.current(index);
                      }
                    }}
                  >
                    {/* Render YouTube Player ONLY if active and user has clicked play/pause */}
                    {showPlayer ? (
                      <YouTubePlayer
                        videoId={video.youtubeId}
                        thumbnail={video.thumbnail}
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
                              <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
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