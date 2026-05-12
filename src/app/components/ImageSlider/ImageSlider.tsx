"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// --- CRITICAL: THESE IMPORTS ARE REQUIRED FOR THE SLIDER TO SHOW UP ---
// We use // @ts-ignore to stop the "Cannot find module" error in your editor
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/autoplay";

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
          modules={[Autoplay]}
          spaceBetween={20}
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          loop={true}
          speed={3000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          allowTouchMove={false}
          breakpoints={{
            640: {
              // sm+
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              // md+
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          className="w-full"
        >
          {imageData.map((item) => (
            <SwiperSlide key={item.id} className="!h-auto py-2 rounded-2xl">
              <div
                // Added bg-pink-100 temporarily so you can SEE the slide even if image is broken
                className="relative h-64  w-full rounded-[10px]  overflow-hidden p-0 m-0 shadow-md border-1 border-[#FF8FCA]/15  bg-pink-100"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  // If the image fails to load, this allows the pink background to show through
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
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          loop={true}
          speed={3000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          allowTouchMove={false}
          breakpoints={{
            640: {
              // sm+
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              // md+
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
