"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules"; // ✅ Added FreeMode

// --- CRITICAL: THESE IMPORTS ARE REQUIRED FOR THE SLIDER TO SHOW UP ---
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/autoplay";
// @ts-ignore
import "swiper/css/free-mode"; // ✅ Required for smooth free-mode dragging

const ImageSlider: React.FC = () => {
  const imageData = [
    { id: 1, src: "/gallary/1st.jpg", alt: "Group 1" },
    { id: 2, src: "/gallary/2nd.png", alt: "Group 2" },
    { id: 3, src: "/gallary/3rd.png", alt: "Group 3" },
    { id: 4, src: "/gallary/4th.png", alt: "Group 4" },
    { id: 5, src: "/gallary/5th.png", alt: "Group 5" },
    { id: 6, src: "/gallary/6th.jpg", alt: "Group 6" },
  ];

  return (
    <div className="flex flex-col gap-8 container mx-auto rounded-4xl overflow-hidden">
      {/* --- ROW 1: LEFT TO RIGHT (Reversed via dir="rtl") --- */}
      <div dir="rtl" className="w-full rounded-4xl">
        <Swiper
          modules={[Autoplay, FreeMode]} // ✅ Added FreeMode module
          spaceBetween={20}
          slidesPerView={2}
          loop={true}
          speed={3000}
          freeMode={true} // ✅ Enables the smooth, non-snapping drag like your example
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          allowTouchMove={true}
          // ✅ Stops auto-scroll instantly when user touches, so it doesn't fight their finger
          onTouchStart={(swiper) => swiper.autoplay.stop()}
          // ✅ Resumes auto-scroll when user lets go
          onTouchEnd={(swiper) => swiper.autoplay.start()}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          className="w-full"
        >
          {imageData.map((item) => (
            <SwiperSlide key={item.id} className="!h-auto py-2 rounded-2xl">
              <div className="relative h-64 w-full rounded-[10px] overflow-hidden p-0 m-0 shadow-md border-1 border-[#FF8FCA]/15 bg-pink-100">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* --- ROW 2: RIGHT TO LEFT (Standard) --- */}
      <div className="w-full">
        <Swiper
          modules={[Autoplay, FreeMode]} // ✅ Added FreeMode module
          spaceBetween={20}
          slidesPerView={2}
          loop={true}
          speed={3000}
          freeMode={true} // ✅ Enables the smooth, non-snapping drag like your example
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          allowTouchMove={true}
          // ✅ Stops auto-scroll instantly when user touches
          onTouchStart={(swiper) => swiper.autoplay.stop()}
          // ✅ Resumes auto-scroll when user lets go
          onTouchEnd={(swiper) => swiper.autoplay.start()}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          className="w-full"
        >
          {imageData.map((item) => (
            <SwiperSlide key={`row2-${item.id}`} className="h-auto">
              <div className="relative h-64 w-full rounded-[10px] overflow-hidden shadow-md border-1 border-[#FF8FCA]/15 bg-pink-100">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ImageSlider;
