// "use client";
// import React from "react";
// import Image from "next/image";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation, EffectCoverflow } from "swiper/modules";

// // @ts-ignore
// import "swiper/css";
// // @ts-ignore
// import "swiper/css/navigation";
// // @ts-ignore
// import "swiper/css/effect-coverflow";

// // Using same image to match the reference design
// const galleryImages = [
//   "/image1.webp",
//   "/image1.webp",
//   "/image1.webp",
//   "/image1.webp",
//   "/image1.webp",
// ];

// export default function GallerySlider() {
//   const [mounted, setMounted] = React.useState(false);

//   React.useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;

//   return (
//     <div className="relative w-full container mx-auto rounded-4xl py-20  bg-white overflow-hidden">
//       {/* Background decorative blob */}
//       <div className="absolute left-[-100px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#F3066E]/10 blur-[120px] rounded-full -z-10" />

//       <Swiper
//         modules={[Autoplay, Navigation, EffectCoverflow]}
//         // effect={"coverflow"}
//         // grabCursor={true}
//         // centeredSlides={true}
//         // slidesPerView={"auto"}
//         // loop={true}
//         // autoplay={{
//         //   delay: 2500,
//         //   disableOnInteraction: false,
//         // }}
//         // coverflowEffect={{
//         //   rotate: 0,
//         //   stretch: 0,
//         //   depth: 0,
//         //   modifier: 1,
//         //   slideShadows: false,
//         // }}
//         // spaceBetween={20}
//         className="gallery-swiper !overflow-visible  "
//       >
//         {galleryImages.map((src, index) => (
//           <SwiperSlide
//             key={index}
//             className="!w-[260px] rounded-4xl transition-all duration-500 "
//             style={{
//               width: "auto",
//             }}
//           >
//             {({ isActive }) => (
//               <div
//                 className={`
//                   relative transition-all duration-500 rounded-[30px] overflow-hidden shadow-xl
//                   ${
//                     isActive
//                       ? // --- MIDDLE IMAGE (BIG) ---
//                         // Width 400px, Scale 115% for height emphasis, Pink Border
//                         "w-[400px] scale-115 border-[6px] border-[#F3066E] z-20 shadow-[0_20px_60px_-15px_rgba(243,6,110,0.6)]"
//                       : // --- SIDE IMAGES (FULL & HALF) ---
//                         // Width 260px, Scale 100% (same height for all sides), Blue Border
//                         "w-[260px] scale-100 border-2 border-blue-400 z-10 opacity-90 hover:opacity-100"
//                   }
//                 `}
//               >
//                 {/* Image Container */}
//                 <div className="relative aspect-[3/4] w-full bg-gray-100">
//                   <Image
//                     src={src}
//                     alt="Gallery Image"
//                     width={800}
//                     height={1066}
//                     className="object-cover w-full h-full"
//                     priority={index < 3}
//                   />
//                 </div>
//               </div>
//             )}
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       <style jsx global>{`
//         /* Ensure swiper flex centers correctly */
//         .gallery-swiper .swiper-slide {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
//       `}</style>
//     </div>
//   );
// }

"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

// Using same image to match the reference design
const galleryImages = [
  "/image1.webp",
  "/image1.webp",
  "/image1.webp",
  "/image1.webp",
  "/image1.webp",
];

export default function GallerySlider() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* header */}
      <div>
        <h2 className="text-2xl md:text-5xl font-bold text-[#00477C] leading-17 tracking-[-5%] text-center">
          কেন আমরাই শিক্ষার্থী ও অভিভাবকদের <br className="md:flex hidden" />
          <span className="relative inline-block px-2 py-3 group">
            <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>
            <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="text-primary"> প্রথম পছন্দ?</span>
          </span>
        </h2>
        <figure className="flex items-center justify-center mt-4.5">
          <Image
          src={'/staricon.webp'}
          width={162}
          height={45}
          alt="star icon"
          className=""
          />
        </figure>
      </div>
      <div className="relative w-full container mx-auto py-16  bg-white overflow-clip">
        {/* Background decorative blob */}
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
            depth: 0, // No depth, purely CSS driven sizing
            modifier: 1,
            slideShadows: false,
          }}
          // Space between is critical to separate the Full and Half images
          spaceBetween={20}
          className="gallery-swiper !overflow-visible"
        >
          {galleryImages.map((src, index) => (
            <SwiperSlide
              key={index}
              // --- WIDTH LOGIC ---
              // Small width (260px) for sides, Large width (400px) for center.
              // The overflow-hidden parent will crop the 260px slides in half on the edges.
              className="!w-[260px] transition-all duration-500"
              style={{
                // Dynamic width for the active slide to make it "Boro"
                width: "auto",
              }}
            >
              {({ isActive }) => (
                <div
                  className={`
                  relative transition-all mx-2 duration-500 rounded-[30px] overflow-hidden shadow-xl
                  ${
                    isActive
                      ? // --- MIDDLE IMAGE (BIG) ---
                        // Width 400px, Scale 115% for height emphasis, Pink Border
                        "w-[400px] scale-115  border-[6px]  isolate fixed  border-[#F3066E] z-20 shadow-[0_20px_60px_-15px_rgba(243,6,110,0.6)]"
                      : // --- SIDE IMAGES (FULL & HALF) ---
                        // Width 260px, Scale 100% (same height for all sides), Blue Border
                        "w-[260px] scale-100 border-2 border-blue-400 z-10 opacity-90 hover:opacity-100"
                  }
                `}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] w-full bg-gray-100">
                    <Image
                      src={src}
                      alt="Gallery Image"
                      width={800}
                      height={1066}
                      className="object-cover w-full h-full"
                      priority={index < 3}
                    />
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx global>{`
          /* Ensure swiper flex centers correctly */
          .gallery-swiper .swiper-slide {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    </>
  );
}