"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import './testimonial.css'

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

// Sub-component to handle the spotlight effect for individual cards
const SpotlightCard = ({ item }: { item: any }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className="card-flow relative w-full h-full rounded-[35px] overflow-hidden shadow-[inset_2px_4px_16px_rgba(255,255,255,0.2),inset_4px_8px_16px_rgba(255,255,255,0.2)]"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. The Base Gradient Background */}
      <div className={`absolute inset-0 `} />

      {/* 2. The Animated Spotlight/Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 ease-out"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 143, 202, 0.4)
, transparent 40%)`,
        }}
      />

      {/* 3. The Content (Sits on top) */}
      <div className="relative z-20 flex h-full flex-col justify-between p-8 text-white">
        {/* Quote Icon */}
        <div className="mb-4">
          <Quote
            size={40}
            className="rotate-180 fill-yellow-400 text-yellow-400"
          />
        </div>

        {/* Testimonial Text */}
        <p
          className="mb-6 text-lg font-light leading-relaxed"
          dangerouslySetInnerHTML={{ __html: item.text }}
        ></p>

        {/* User Info */}
        <div className="mt-auto flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white/30">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="text-xl font-bold">{item.name}</h4>
            <p className="text-sm text-white/70">{item.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TestimonialSlider() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative w-full container mx-auto">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        onSwiper={(swiper) => {
          if (prevRef.current && nextRef.current) {
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
            {/* Using the new SpotlightCard component here */}
            <div className="h-auto py-4">
              <SpotlightCard item={item} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button
        ref={prevRef}
        className="absolute left-[-20px] top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-800 shadow-lg transition-all hover:bg-gray-100 sm:flex"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        ref={nextRef}
        className="absolute right-[-20px] top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-800 shadow-lg transition-all hover:bg-gray-100 sm:flex"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
