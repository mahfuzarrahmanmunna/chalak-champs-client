"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image"; // Added for thumbnail
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-youtube";

const Videoimg = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = "RG5Q6yVGyBE";

  // Refs
  const videoNode = useRef(null);
  const playerRef = useRef(null);

  // Initialize Video.js only when isPlaying is true
  useEffect(() => {
    if (isPlaying && videoNode.current && !playerRef.current) {
      // Initialize Video.js
      const player = videojs(videoNode.current, {
        controls: true,
        autoplay: true,
        muted: false, // ⚠️ Changed to false because user clicked button
        preload: "auto",
        fluid: false,
        fill: true,
        sources: [
          {
            src: `https://www.youtube.com/watch?v=${videoId}`,
            type: "video/youtube",
          },
        ],
        youtube: {
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
        },
        techOrder: ["youtube"],
      });

      playerRef.current = player;

      // 🔊 Try to ensure sound is on and video plays
      player.ready(() => {
        player
          .play()
          .catch((e) => console.log("Autoplay blocked by browser:", e));
      });

      // Cleanup
      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      };
    }
  }, [isPlaying, videoId]);

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-10 select-none">
      {/* --- BACKGROUND GRADIENT CIRCLES --- */}
      <div
        className="absolute -top-8 -left-8 md:-top-24 md:-left-24 w-32 h-32 md:w-64 md:h-64 rounded-full pointer-events-none z-[-1]"
        style={{
          background:
            "radial-gradient(circle, #F3066E 20%, rgba(249, 130, 97, 0.6) 50%, rgba(255, 255, 255, 0) 80%)",
        }}
      ></div>
      <div
        className="absolute -top-10 -left-10 w-[250px] h-[250px] md:w-[444px] md:h-[444px] pointer-events-none blur-[40px] opacity-60"
        style={{
          background:
            "radial-gradient(circle, #F3066E 0%, rgba(249, 130, 182, 0.1) 72%, rgba(255, 255, 255, 0) 100%)",
          zIndex: 0,
        }}
      ></div>

      {/* --- VIDEO CARD CONTAINER --- */}
      <div className="relative w-full aspect-video rounded-[30px] md:rounded-[65px] shadow-2xl z-10 bg-gradient-to-b from-[#F3066E] to-[#D9D9D9] p-1 overflow-hidden">
        {/* 1. INITIAL STATE: YouTube Thumbnail + Play Button */}
        {!isPlaying && (
          <div
            className="relative w-full h-full bg-black rounded-[28px] md:rounded-[61px] overflow-hidden group cursor-pointer"
            onClick={() => setIsPlaying(true)}
          >
            {/* ✅ FIXED: Using YouTube Thumbnail instead of black background */}
            <Image
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt="Video Thumbnail"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized={true} // Important for external images
            />

            {/* Overlay to darken image slightly so button pops */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button className="relative z-10 w-20 h-20 md:w-24 md:h-24 bg-[#F3066E] text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(243,5,109,0.6)] group-hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-10 h-10 md:w-12 md:h-12 ml-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* 2. PLAYING STATE: Video.js Player */}
        {isPlaying && (
          <div className="relative w-full h-full rounded-[36px] md:rounded-[59px] overflow-hidden bg-black">
            <div data-vjs-player className="w-full h-full">
              <video
                ref={videoNode}
                className="video-js vjs-theme-city vjs-big-play-centered w-full h-full"
                playsInline
              />
            </div>
          </div>
        )}
      </div>

      {/* --- DECORATIVE IMAGE LEFT (Pink) --- */}
      <div className="absolute -top-20 -left-4 md:-top-36 md:-left-4 z-20 pointer-events-none scale-40 md:scale-100 opacity-90">
        <svg
          width="289"
          height="289"
          viewBox="0 0 289 289"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_627_2681)">
            <rect
              x="112.481"
              y="89.1875"
              width="90"
              height="90"
              rx="25"
              transform="rotate(15 112.481 89.1875)"
              fill="#FF8FCA"
              fillOpacity="0.2"
              shapeRendering="crispEdges"
            />
            <rect
              x="113.189"
              y="90.4122"
              width="88"
              height="88"
              rx="24"
              transform="rotate(15 113.189 90.4122)"
              stroke="#F3066E"
              strokeOpacity="0.2"
              strokeWidth="2"
              shapeRendering="crispEdges"
            />
            <path
              d="M141.282 155.57C139.42 153.708 137.101 152.369 134.558 151.688C132.014 151.006 129.336 151.006 126.793 151.688L132.401 130.76C134.944 130.078 137.622 130.078 140.165 130.76C142.709 131.441 145.028 132.78 146.89 134.642M141.282 155.57C143.825 154.889 146.503 154.889 149.046 155.57C151.59 156.252 153.909 157.591 155.771 159.452L161.379 138.524C159.517 136.662 157.198 135.323 154.654 134.642C152.111 133.96 149.433 133.96 146.89 134.642M141.282 155.57L146.89 134.642"
              stroke="#F3066E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_627_2681"
              x="-5.6125"
              y="-5.6125"
              width="299.828"
              height="299.827"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="47.4" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_627_2681"
              />
              <feBlend
                mode="normal"
                in="BackgroundImageFix"
                in2="effect1_dropShadow_627_2681"
                result="BackgroundImageFix"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>

      {/* --- DECORATIVE IMAGE RIGHT (Blue) --- */}
      <div className="absolute  -bottom-10 -right-16 md:bottom-20 md:-right-36 z-20 pointer-events-none scale-40 md:scale-100 opacity-90">
        <div className="">
          <svg
            width="289"
            height="289"
            viewBox="0 0 289 289"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_627_2674)">
              <rect
                x="89.1865"
                y="112.481"
                width="90"
                height="90"
                rx="25"
                transform="rotate(-15 89.1865 112.481)"
                fill="#D8E6FF"
                fillOpacity="0.2"
                shapeRendering="crispEdges"
              />
              <rect
                x="90.4113"
                y="113.188"
                width="88"
                height="88"
                rx="24"
                transform="rotate(-15 90.4113 113.188)"
                stroke="#ABDBFF"
                strokeWidth="2"
                shapeRendering="crispEdges"
              />
              <g clipPath="url(#clip0_627_2674)">
                <path
                  d="M159.315 134.71L162.172 145.373M145.766 149.769L154.799 139.73L157.925 151.396C158.869 154.919 154.738 159.088 148.697 160.706C142.656 162.325 136.995 160.78 136.05 157.257L132.925 145.591L145.766 149.769ZM145.766 149.769L124.363 142.805L139.417 126.072L160.82 133.036L145.766 149.769Z"
                  stroke="#00477C"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </g>
            </g>
            <defs>
              <filter
                id="filter0_d_627_2674"
                x="-5.61348"
                y="-5.61299"
                width="299.827"
                height="299.827"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="47.4" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_627_2674"
                />
                <feBlend
                  mode="normal"
                  in="BackgroundImageFix"
                  in2="effect1_dropShadow_627_2674"
                  result="BackgroundImageFix"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
              </filter>
              <clipPath id="clip0_627_2674">
                <rect
                  width="45.2914"
                  height="45.2914"
                  fill="white"
                  transform="translate(116.565 128.288) rotate(-15)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Videoimg;
