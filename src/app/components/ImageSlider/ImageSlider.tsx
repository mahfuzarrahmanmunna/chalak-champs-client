// "use client";

// import React from "react";
// import Image from "next/image";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, FreeMode } from "swiper/modules";

// // --- CSS IMPORTS ---
// // @ts-ignore
// import "swiper/css";
// // @ts-ignore
// import "swiper/css/autoplay";
// // @ts-ignore
// import "swiper/css/free-mode";

// const ImageSlider: React.FC = () => {
//   // --- ARRAY 1: FOR THE FIRST SLIDER (Left to Right) ---
//   const firstRowImages = [
//     { id: 1, src: "/gallary/chalakchampsfirst.JPG", alt: "Group 1" },
//     { id: 2, src: "/gallary/chalakchamps1st.JPG", alt: "Group 1" },
//     { id: 3, src: "/gallary/chalakchamps2nd.png", alt: "Group 2" },
//     { id: 4, src: "/gallary/chalakchamps3rd.png", alt: "Group 3" },
//     { id: 5, src: "/gallary/chalakchamps4th.png", alt: "Group 4" },
//     { id: 6, src: "/gallary/chalakchamps5th.png", alt: "Group 5" },
//     { id: 7, src: "/gallary/chalakchamps6th.JPG", alt: "Group 6" },
//     { id: 8, src: "/gallary/chalakchamps7.JPG", alt: "Group 7" },
//     { id: 9, src: "/gallary/chalakchamps8.JPG", alt: "Group 8" },
//     { id: 10, src: "/gallary/chalakchamps9.JPG", alt: "Group 9" },
//     { id: 11, src: "/gallary/chalakchamps10.JPG", alt: "Group 10" },
//   ];

//   // --- ARRAY 2: FOR THE SECOND SLIDER (Right to Left) ---
//   // TODO: Update the 'src' paths below with your actual second row images
//   const secondRowImages = [
//     { id: 11, src: "/gallary/chalakchampsdownfirst.JPG", alt: "Second Row Group 1" },
//     { id: 12, src: "/gallary/chalakchamps29.JPG", alt: "Second Row Group 2" },
//     { id: 13, src: "/gallary/chalakchamps28.JPG", alt: "Second Row Group 3" },
//     { id: 14, src: "/gallary/chalakchamps27.JPG", alt: "Second Row Group 4" },
//     { id: 15, src: "/gallary/chalakchamps26.JPG", alt: "Second Row Group 5" },
//     { id: 17, src: "/gallary/chalakchamps25.JPG", alt: "Second Row Group 6" },
//     { id: 18, src: "/gallary/chalakchamps24.JPG", alt: "Second Row Group 6" },
//     { id: 19, src: "/gallary/chalakchamps23.JPG", alt: "Second Row Group 6" },
//     { id: 20, src: "/gallary/chalakchamps22.JPG", alt: "Second Row Group 7" },
//     { id: 21, src: "/gallary/chalakchamps21.JPG", alt: "Second Row Group 7" },
//   ];

//   return (
//     <div className="flex flex-col gap-8 container mx-auto rounded-4xl overflow-hidden">
//       {/* --- ROW 1: LEFT TO RIGHT (Reversed via dir="rtl") --- */}
//       <div dir="rtl" className="w-full rounded-4xl">
//         <Swiper
//           modules={[Autoplay, FreeMode]}
//           spaceBetween={20}
//           slidesPerView={2}
//           loop={true}
//           speed={3000}
//           freeMode={true}
//           autoplay={{
//             delay: 0,
//             disableOnInteraction: false,
//             pauseOnMouseEnter: true,
//           }}
//           allowTouchMove={true}
//           onTouchStart={(swiper) => swiper.autoplay.stop()}
//           onTouchEnd={(swiper) => swiper.autoplay.start()}
//           breakpoints={{
//             640: { slidesPerView: 2, spaceBetween: 20 },
//             768: { slidesPerView: 3, spaceBetween: 20 },
//           }}
//           className="w-full"
//         >
//           {firstRowImages.map((item) => (
//             <SwiperSlide key={item.id} className="!h-auto py-2 rounded-2xl">
//               <div className="relative h-64 w-full rounded-[10px] overflow-hidden p-0 m-0 shadow-md border-1 border-[#FF8FCA]/15 bg-pink-100">
//                 <Image
//                   src={item.src}
//                   alt={item.alt}
//                   fill
//                   className="object-cover"
//                   onError={(e) => (e.currentTarget.style.display = "none")}
//                 />
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* --- ROW 2: RIGHT TO LEFT (Standard) --- */}
//       <div className="w-full">
//         <Swiper
//           modules={[Autoplay, FreeMode]}
//           spaceBetween={20}
//           slidesPerView={2}
//           loop={true}
//           speed={3000}
//           freeMode={true}
//           autoplay={{
//             delay: 0,
//             disableOnInteraction: false,
//             pauseOnMouseEnter: true,
//           }}
//           allowTouchMove={true}
//           onTouchStart={(swiper) => swiper.autoplay.stop()}
//           onTouchEnd={(swiper) => swiper.autoplay.start()}
//           breakpoints={{
//             640: { slidesPerView: 2, spaceBetween: 20 },
//             768: { slidesPerView: 3, spaceBetween: 20 },
//           }}
//           className="w-full"
//         >
//           {secondRowImages.map((item) => (
//             <SwiperSlide key={item.id} className="h-auto">
//               <div className="relative h-64 w-full rounded-[10px] overflow-hidden shadow-md border-1 border-[#FF8FCA]/15 bg-pink-100">
//                 <Image
//                   src={item.src}
//                   alt={item.alt}
//                   fill
//                   className="object-cover"
//                   onError={(e) => (e.currentTarget.style.display = "none")}
//                 />
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default ImageSlider;










"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import api from "@/lib/api";
import { normalizeImageUrl } from "@/lib/normalizeImageUrl";

// --- CSS IMPORTS ---
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/autoplay";
// @ts-ignore
import "swiper/css/free-mode";

interface GalleryImage {
  url: string;
  alt: string;
}

const configuredApiBaseUrl = (
  process.env.NEXT_PUBLIC_API_BASE_URL || ""
).replace(/\/+$/, "");
const galleryEndpoint = /\/api$/i.test(configuredApiBaseUrl)
  ? "/gallery"
  : "/api/gallery";

const ImageSlider: React.FC = () => {
  const [rowOneImages, setRowOneImages] = useState<GalleryImage[]>([]);
  const [rowTwoImages, setRowTwoImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get(galleryEndpoint);
        const data = res.data;
        if (data.success && data.data) {
          setRowOneImages(data.data.rowOneImages || []);
          setRowTwoImages(data.data.rowTwoImages || []);
        } else {
          throw new Error(data.message || "Invalid gallery response");
        }
      } catch (error) {
        console.error("Failed to fetch gallery images", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-[#F3066E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (rowOneImages.length === 0 && rowTwoImages.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8 container mx-auto rounded-4xl overflow-hidden">
      {rowOneImages.length > 0 && (
        <div dir="rtl" className="w-full rounded-4xl">
          <Swiper
            modules={[Autoplay, FreeMode]}
            spaceBetween={20}
            slidesPerView={2}
            loop={true}
            speed={3000}
            freeMode={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            allowTouchMove={true}
            onTouchStart={(swiper) => swiper.autoplay.stop()}
            onTouchEnd={(swiper) => swiper.autoplay.start()}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 20 },
            }}
            className="w-full"
          >
            {rowOneImages.map((item, index) => (
              <SwiperSlide key={`r1-${index}`} className="!h-auto py-2 rounded-2xl">
                <div className="relative h-64 w-full rounded-[10px] overflow-hidden p-0 m-0 shadow-md border-1 border-[#FF8FCA]/15 bg-pink-100">
                  <Image
                    src={normalizeImageUrl(item.url)}
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
      )}

      {rowTwoImages.length > 0 && (
        <div className="w-full">
          <Swiper
            modules={[Autoplay, FreeMode]}
            spaceBetween={20}
            slidesPerView={2}
            loop={true}
            speed={3000}
            freeMode={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            allowTouchMove={true}
            onTouchStart={(swiper) => swiper.autoplay.stop()}
            onTouchEnd={(swiper) => swiper.autoplay.start()}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 20 },
            }}
            className="w-full"
          >
            {rowTwoImages.map((item, index) => (
              <SwiperSlide key={`r2-${index}`} className="h-auto">
                <div className="relative h-64 w-full rounded-[10px] overflow-hidden shadow-md border-1 border-[#FF8FCA]/15 bg-pink-100">
                  <Image
                    src={normalizeImageUrl(item.url)}
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
      )}
    </div>
  );
};

export default ImageSlider;