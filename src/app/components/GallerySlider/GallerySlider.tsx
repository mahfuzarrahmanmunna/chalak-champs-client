"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectCoverflow } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";

const galleryImages = [
  "/image1.webp",
  "/image1.webp",
  "/image1.webp",
  "/image1.webp",
  "/image1.webp",
];

export default function GallerySlider() {
  return (
    <div className="relative w-full max-w-7xl mx-auto py-20 bg-white overflow-hidden">
      <div className="absolute left-[-100px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#F3066E]/10 blur-[120px] rounded-full -z-10" />

      <Swiper
        modules={[Autoplay, Navigation, EffectCoverflow]}
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: false,
        }}
        breakpoints={{
          320: { slidesPerView: 1.5, spaceBetween: 10 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3.5, spaceBetween: 30 },
        }}
        className="gallery-swiper !overflow-visible"
      >
        {galleryImages.map((src, index) => (
          <SwiperSlide key={index} className="!w-[300px] sm:!w-[400px]">
            {({ isActive }) => (
              <div
                className={`relative transition-all duration-500 rounded-[32px] overflow-hidden shadow-lg
                ${isActive 
                  ? "border-[3px] border-[#F3066E]/30 p-2 scale-110 z-10 bg-white" 
                  : "scale-90 opacity-60"
                }`}
              >
                {/* ইমেজ কন্টেইনার */}
                <div className="relative aspect-[3/4] w-full rounded-[24px] overflow-hidden">
                  <Image
                    src={src}
                    alt="Gallery Image"
                    fill
                    className="object-cover"
                  />
                  
                  {/* প্লে বাটন আইকন (মাঝখানে) */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-md">
                       <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-[#F3066E] border-b-[8px] border-b-transparent ml-1" />
                    </div>
                  </div>
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
      `}</style>
    </div>
  );
}
