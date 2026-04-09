"use client";
import React, { useState } from "react";
import Image from "next/image";

const Videoimg = () => {
  const [isOpen, setIsOpen] = useState(false);
  const videoId = "YOUR_YOUTUBE_VIDEO_ID"; // Replace with actual ID

  return (
    // Main Wrapper: Controls the overall positioning
    <div className="relative w-full max-w-4xl mx-auto mt-10 px-6 py-10 pb-24">
      {/* --- BACKGROUND GRADIENT CIRCLES --- */}
      {/* Z-index -1 ensures they are behind everything */}
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

      {/* --- VIDEO CARD --- */}
      {/* Z-index 10. Overflow-hidden clips the video image rounded corners. */}
      <div className="relative w-full aspect-video group cursor-pointer overflow-hidden rounded-2xl shadow-2xl z-10">
        {/* Side Gradient Borders */}
        <div className="absolute left-0 top-0 w-[2px] h-1/2 bg-gradient-to-t from-transparent via-[#F3066E99] to-[#F3066E] z-20"></div>
        <div className="absolute right-0 top-0 w-[2px] h-1/2 bg-gradient-to-t from-transparent via-[#F3066E99] to-[#F3066E] z-20"></div>

        {/* Main Image */}
        <Image
          src="/videoimg.jpg"
          width={975}
          height={460}
          alt="Video Thumbnail"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Play Button */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center z-10">
          <button
            onClick={() => setIsOpen(true)}
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

      {/* --- DECORATIVE IMAGES --- */}
      {/* 
         These are now OUTSIDE the video-container div.
         Z-index 20 puts them ON TOP of the video card.
         We use negative margins or specific positioning to overlap the edges.
      */}

      {/* Book Image: Top Left Side - Middle Position */}
      <div className="absolute top-8 left-2 md:-top-7 md:left-4 z-20 pointer-events-none opacity-90">
        <Image
          src={"/book.png"}
          width={120}
          height={120}
          alt="Decorative Book"
          className="w-20 h-20 md:w-32 md:h-32 object-contain"
        />
      </div>

      {/* Icon Image: Top Right Side - Upto Main Image */}
      <div className="absolute top-8 right-2 md:-top-16 md:right-4 z-20 pointer-events-none opacity-90">
        <Image
          src={"/icon.png"}
          width={120}
          height={120}
          alt="Decorative Icon"
          className="w-20 h-20 md:w-32 md:h-32 object-contain"
        />
      </div>

      {/* Hat Image: Bottom Right Side - Middle Position */}
      <div className="absolute bottom-16 right-12 md:bottom-20 md:-right-6 z-20 pointer-events-none opacity-90">
        <Image
          src={"/hat.png"}
          width={120}
          height={120}
          alt="Decorative Hat"
          className="w-16 h-16 md:w-24 md:h-24 object-contain"
        />
      </div>

      {/* Video Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/ElaYpYlXZJY?si=ZRihJhulvd8185Qu`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videoimg;
