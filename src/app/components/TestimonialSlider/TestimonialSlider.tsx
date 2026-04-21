"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";


const testimonials = [
  {
    id: 1,
    text: "চালাক Champs আমার পড়াশোনায় অনেক সাহায্য করেছে।<br />অভিজ্ঞ শিক্ষকদের দারুণ স্টাডি টিপস আর সহজভাবে পড়ানোর কারণে আমার বার্ষিক পরীক্ষার রেজাল্ট অনেক ভালো হয়েছে। ধন্যবাদ, চালাক Champs!",
    name: "জাহিদ আলম",
    title: "উত্তরা দিয়াবাড়ি, আজমপুর",
    image: "/profile.png",
    gradient: "from-[#1B386B] to-[#C6005F]",
  },
  {
    id: 2,
    text: "চালাক Champs আমার পড়াশোনায় অনেক সাহায্য করেছে।<br />অভিজ্ঞ শিক্ষকদের দারুণ স্টাডি টিপস আর সহজভাবে পড়ানোর কারণে আমার বার্ষিক পরীক্ষার রেজাল্ট অনেক ভালো হয়েছে। ধন্যবাদ, চালাক Champs!",
    name: "জাহিদ আলম",
    title: "উত্তরা দিয়াবাড়ি, আজমপুর",
    image: "/profile.png",
    gradient: "from-[#F3066E] to-[#1B386B]",
  },
  {
    id: 3,
    text: "চালাক Champs আমার পড়াশোনায় অনেক সাহায্য করেছে।<br />অভিজ্ঞ শিক্ষকদের দারুণ স্টাডি টিপস আর সহজভাবে পড়ানোর কারণে আমার বার্ষিক পরীক্ষার রেজাল্ট অনেক ভালো হয়েছে। ধন্যবাদ, চালাক Champs!",
    name: "জাহিদ আলম",
    title: "উত্তরা দিয়াবাড়ি, আজমপুর",
    image: "/profile.png",
    gradient: "from-[#1E3A8A] to-[#C6005F]",
  },
];

export default function TestimonialSlider() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative w-full container mx-auto  ">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        onSwiper={(swiper) => {
          if (prevRef.current && nextRef.current) {
            // FIX: Add 'typeof === "object"' check.
            // This ensures we don't try to set 'prevEl' on a boolean ('true').
            if (
              swiper.params.navigation &&
              typeof swiper.params.navigation === "object"
            ) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }
          }
        }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className=""
      >
        {testimonials.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              className={`relative shadow-[inset_2px_4px_16px_rgba(255,255,255,0.2),inset_4px_8px_16px_rgba(255,255,255,0.2)] p-8 rounded-[35px] flex flex-col justify-between text-white bg-linear-to-br ${item.gradient}`}
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote
                  size={40}
                  className="text-yellow-400 rotate-180 fill-yellow-400"
                />
              </div>

              {/* Testimonial Text */}
              <p
                className="text-lg leading-relaxed font-light mb-6"
                dangerouslySetInnerHTML={{ __html: item.text }}
              ></p>

              {/* User Info */}
              <div className="flex items-center gap-4 mt-auto">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/30">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-xl">{item.name}</h4>
                  <p className="text-sm text-white/70">{item.title}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button
        ref={prevRef}
        className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-gray-800 hover:bg-gray-100 transition-all sm:flex hidden"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        ref={nextRef}
        className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-gray-800 hover:bg-gray-100 transition-all sm:flex hidden"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
