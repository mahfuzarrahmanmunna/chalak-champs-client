// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import Image from "next/image";
// import videojs from "video.js";
// import "video.js/dist/video-js.css";
// import "videojs-youtube";
// import Player from "video.js/dist/types/player";

// const Videoimg = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const playerRef = useRef<Player | null>(null);

//   const videoId = "nYyE2ItjRHE";

//   const handlePlayButtonClick = () => {
//     setIsPlaying(true);
//   };

//   useEffect(() => {
//     // Ensure the player is only initialized once when playing starts
//     if (isPlaying && videoRef.current && !playerRef.current) {
//       const player = videojs(videoRef.current, {
//         controls: true,
//         autoplay: true, // Key: Tell config to autoplay
//         preload: "auto",
//         fluid: true,
//         responsive: true,
//         aspectRatio: "16:9",
//         techOrder: ["youtube"],

//         // Key: Browsers block autoplay unless muted
//         muted: true,

//         sources: [
//           {
//             src: videoId,
//             type: "video/youtube",
//           },
//         ],
//         youtube: {
//           ytControls: 1, // Show controls so user can unmute manually
//           modestbranding: 1,
//           rel: 0,
//         },
//       });

//       playerRef.current = player;
//     }

//     return () => {
//       if (playerRef.current) {
//         playerRef.current.dispose();
//         playerRef.current = null;
//       }
//     };
//   }, [isPlaying, videoId]);

//   return (
//     <div className="relative w-full max-w-6xl mx-auto mt-10 px-6 py-10 pb-24">
//       {/* --- BACKGROUND GRADIENT CIRCLES --- */}
//       <div
//         className="absolute -top-12 -left-12 md:-top-24 md:-left-24 w-48 h-48 md:w-64 md:h-64 rounded-full pointer-events-none z-[-1]"
//         style={{
//           background:
//             "radial-gradient(circle, #F3066E 0%, #F982B61A 50%, #FFFFFF00 100%)",
//         }}
//       ></div>
//       <div
//         className="absolute -top-12 -left-14 w-64 h-64 rounded-full pointer-events-none"
//         style={{
//           background:
//             "radial-gradient(circle, #F3066E 0%, #F982B61A 50%, #FFFFFF00 100%)",
//           zIndex: 0,
//         }}
//       ></div>

//       {/* --- VIDEO CARD CONTAINER --- */}
//       <div className="relative w-full aspect-video rounded-2xl shadow-2xl z-10 bg-linear-to-b from-[#F3066E] to-[#D9D9D9] p-0.5 overflow-hidden">
//         {/* 1. THUMBNAIL VIEW */}
//         {!isPlaying && (
//           <div className="relative w-full h-full group cursor-pointer rounded-2xl overflow-hidden z-20">
//             <Image
//               src="/videoimg.jpg"
//               fill
//               alt="Video Thumbnail"
//               className="object-cover transition-transform duration-500 group-hover:scale-105"
//               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//             />
//             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
//               <button
//                 onClick={handlePlayButtonClick}
//                 className="w-16 h-16 md:w-20 md:h-20 bg-[#F3066E] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   className="w-8 h-8 md:w-10 md:h-10 ml-1"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}

//         {/* 2. VIDEO.JS PLAYER */}
//         {isPlaying && (
//           // FIX: z-50 ensures it sits on top of everything
//           // FIX: Inline styles ensure width/height are 100%
//           <div
//             data-vjs-player
//             className="w-full h-full absolute top-0 left-0 z-50"
//             style={{ width: "100%", height: "100%" }}
//           >
//             <video
//               ref={videoRef}
//               className="video-js vjs-big-play-centered vjs-fluid"
//               // Explicit style to prevent iframe 0x0 size issues
//               style={{ width: "100%", height: "100%" }}
//             />
//           </div>
//         )}
//       </div>

//       {/* --- DECORATIVE IMAGES --- */}
//       <div className="absolute -top-27 -left-4 z-20 pointer-events-none opacity-90">
//         <svg
//           width="289"
//           height="289"
//           viewBox="0 0 289 289"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <g filter="url(#filter0_d_627_2681)">
//             <rect
//               x="112.481"
//               y="89.1875"
//               width="90"
//               height="90"
//               rx="25"
//               transform="rotate(15 112.481 89.1875)"
//               fill="#FF8FCA"
//               fillOpacity="0.2"
//               shapeRendering="crispEdges"
//             />
//             <rect
//               x="113.189"
//               y="90.4122"
//               width="88"
//               height="88"
//               rx="24"
//               transform="rotate(15 113.189 90.4122)"
//               stroke="#F3066E"
//               strokeOpacity="0.2"
//               strokeWidth="2"
//               shapeRendering="crispEdges"
//             />
//             <path
//               d="M141.282 155.57C139.42 153.708 137.101 152.369 134.558 151.688C132.014 151.006 129.336 151.006 126.793 151.688L132.401 130.76C134.944 130.078 137.622 130.078 140.165 130.76C142.709 131.441 145.028 132.78 146.89 134.642M141.282 155.57C143.825 154.889 146.503 154.889 149.046 155.57C151.59 156.252 153.909 157.591 155.771 159.452L161.379 138.524C159.517 136.662 157.198 135.323 154.654 134.642C152.111 133.96 149.433 133.96 146.89 134.642M141.282 155.57L146.89 134.642"
//               stroke="#F3066E"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </g>
//           <defs>
//             <filter
//               id="filter0_d_627_2681"
//               x="-5.6125"
//               y="-5.6125"
//               width="299.828"
//               height="299.827"
//               filterUnits="userSpaceOnUse"
//               colorInterpolationFilters="sRGB"
//             >
//               <feFlood floodOpacity="0" result="BackgroundImageFix" />
//               <feColorMatrix
//                 in="SourceAlpha"
//                 type="matrix"
//                 values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
//                 result="hardAlpha"
//               />
//               <feOffset />
//               <feGaussianBlur stdDeviation="47.4" />
//               <feComposite in2="hardAlpha" operator="out" />
//               <feColorMatrix
//                 type="matrix"
//                 values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
//               />
//               <feBlend
//                 mode="normal"
//                 in2="BackgroundImageFix"
//                 result="effect1_dropShadow_627_2681"
//               />
//               <feBlend
//                 mode="normal"
//                 in="BackgroundImageFix"
//                 in2="effect1_dropShadow_627_2681"
//                 result="BackgroundImageFix"
//               />
//               <feBlend
//                 mode="normal"
//                 in="SourceGraphic"
//                 in2="BackgroundImageFix"
//                 result="shape"
//               />
//             </filter>
//           </defs>
//         </svg>
//       </div>

//       <div className="absolute bottom-16 right-12 md:bottom-20 md:-right-30 z-20 pointer-events-none opacity-90">
//         <svg
//           width="289"
//           height="289"
//           viewBox="0 0 289 289"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <g filter="url(#filter0_d_627_2674)">
//             <rect
//               x="89.1865"
//               y="112.481"
//               width="90"
//               height="90"
//               rx="25"
//               transform="rotate(-15 89.1865 112.481)"
//               fill="#D8E6FF"
//               fillOpacity="0.2"
//               shapeRendering="crispEdges"
//             />
//             <rect
//               x="90.4113"
//               y="113.188"
//               width="88"
//               height="88"
//               rx="24"
//               transform="rotate(-15 90.4113 113.188)"
//               stroke="#ABDBFF"
//               strokeWidth="2"
//               shapeRendering="crispEdges"
//             />
//             <g clipPath="url(#clip0_627_2674)">
//               <path
//                 d="M159.315 134.71L162.172 145.373M145.766 149.769L154.799 139.73L157.925 151.396C158.869 154.919 154.738 159.088 148.697 160.706C142.656 162.325 136.995 160.78 136.05 157.257L132.925 145.591L145.766 149.769ZM145.766 149.769L124.363 142.805L139.417 126.072L160.82 133.036L145.766 149.769Z"
//                 stroke="#00477C"
//                 strokeWidth="2"
//                 strokeLinecap="square"
//               />
//             </g>
//           </g>
//           <defs>
//             <filter
//               id="filter0_d_627_2674"
//               x="-5.61348"
//               y="-5.61299"
//               width="299.827"
//               height="299.827"
//               filterUnits="userSpaceOnUse"
//               colorInterpolationFilters="sRGB"
//             >
//               <feFlood floodOpacity="0" result="BackgroundImageFix" />
//               <feColorMatrix
//                 in="SourceAlpha"
//                 type="matrix"
//                 values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
//                 result="hardAlpha"
//               />
//               <feOffset />
//               <feGaussianBlur stdDeviation="47.4" />
//               <feComposite in2="hardAlpha" operator="out" />
//               <feColorMatrix
//                 type="matrix"
//                 values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
//               />
//               <feBlend
//                 mode="normal"
//                 in2="BackgroundImageFix"
//                 result="effect1_dropShadow_627_2674"
//               />
//               <feBlend
//                 mode="normal"
//                 in="BackgroundImageFix"
//                 in2="effect1_dropShadow_627_2674"
//                 result="BackgroundImageFix"
//               />
//               <feBlend
//                 mode="normal"
//                 in="SourceGraphic"
//                 in2="BackgroundImageFix"
//                 result="shape"
//               />
//             </filter>
//             <clipPath id="clip0_627_2674">
//               <rect
//                 width="45.2914"
//                 height="45.2914"
//                 fill="white"
//                 transform="translate(116.565 128.288) rotate(-15)"
//               />
//             </clipPath>
//           </defs>
//         </svg>
//       </div>
//     </div>
//   );
// };

// export default Videoimg;

"use client";
import React, { useState } from "react";
import Image from "next/image";
// REMOVED: ReactPlayer import to fix library conflicts

const Videoimg = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = "nYyE2ItjRHE";

  // Construct the YouTube Embed URL manually
  const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`;

  const handlePlayButtonClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-10 px-6 py-10 pb-24">
      {/* --- BACKGROUND GRADIENT CIRCLES --- */}
      <div
        className="absolute -top-12 -left-12 md:-top-24 md:-left-24 w-48 h-48 md:w-64 md:h-64 rounded-full pointer-events-none z-[-1]"
        style={{
          background:
            "radial-gradient(circle, #F3066E 0%, #F982B61A 50%, #FFFFFF00 100%)",
        }}
      ></div>
      <div
        className="absolute -top-12 -left-14 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #F3066E 0%, #F982B61A 50%, #FFFFFF00 100%)",
          zIndex: 0,
        }}
      ></div>

      {/* --- VIDEO CARD CONTAINER --- */}
      <div className="relative w-full aspect-video rounded-2xl shadow-2xl z-10 bg-linear-to-b from-[#F3066E] to-[#D9D9D9] p-0.5 overflow-hidden">
        {/* 1. THUMBNAIL VIEW */}
        {!isPlaying && (
          <div className="relative w-full h-full group cursor-pointer rounded-2xl overflow-hidden z-20">
            <Image
              src="/videoimg.jpg"
              fill
              alt="Video Thumbnail"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
              <button
                onClick={handlePlayButtonClick}
                className="w-16 h-16 md:w-20 md:h-20 bg-[#F3066E] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8 md:w-10 md:h-10 ml-1"
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

        {/* 2. NATIVE IFRAME PLAYER (Replaces ReactPlayer) */}
        {isPlaying && (
          <div className="w-full h-full absolute top-0 left-0 z-50 bg-black/50 rounded-[18px]">
            <iframe
              src={videoUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full rounded-[18px]" // Matches container radius
            ></iframe>
          </div>
        )}
      </div>

      {/* --- DECORATIVE IMAGES --- */}
      <div className="absolute -top-27 -left-4 z-20 pointer-events-none opacity-90">
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
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="47.4" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
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

      <div className="absolute bottom-16 right-12 md:bottom-20 md:-right-30 z-20 pointer-events-none opacity-90">
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
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="47.4" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
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
  );
};

export default Videoimg;