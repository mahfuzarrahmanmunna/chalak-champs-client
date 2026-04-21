"use client";
import Link from "next/link";
import Image from "next/image"; // Fixed: Import from next/image, not lucide-react
import React, { useState } from "react";
import Videoimg from "./Videoimg";
import Freebooking from "../Freebooking/Freebooking";

const Banner = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="">
      <div className="text-center py-10 md:max-w-205 mx-auto font-inter">
        <p className="text-lg mb-2 text-gray-600">আমরা বিশ্বাস করি</p>

        <div className="flex flex-col relative items-center justify-center">
          <div className="relative flex flex-wrap items-center justify-center gap-2">
            <h1
              className="text-3xl md:text-6xl font-bold bg-[radial-gradient(circle_at_top,_#00477C_0%,_#F3066E_100%)] 
                 text-transparent bg-clip-text leading-relaxed pointer-events-none"
            >
              Every Child Is A <br className="flex md:hidden" />{" "}
              <span className="ml-2">Champ</span>
            </h1>

            <div
              className="absolute pointer-events-none flex items-center justify-center
             right-10 bottom-0.5 w-32.5 h-11.5 
             md:right-[calc(50%-360px)] md:bottom-2.25 md:w-57.5 md:h-17.5 "
            >
              <div className="w-full h-full border-2 border-dashed border-[#F3066E] relative z-0">
                <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#F3066E]"></span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F3066E]"></span>
                <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#F3066E]"></span>
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#F3066E]"></span>
              </div>
            </div>
          </div>

          {/* King Image moved outside the H1 tag for better layout control */}
          <div
            className="absolute md:-top-5 z-10 
             right-[60%]  -bottom-6
             md:right-[calc(50%-390px)]"
          >
            <Image
              src="/king.png"
              width={50}
              height={50}
              className="w-[35px] z-10 h-[35px] md:w-[50px] md:h-[50px]"
              alt="King Icon"
            />
          </div>
        </div>

        <p className="my-6 text-gray-700 tracking-normal leading-5 text-base md:text-base">
          <span className="text-secondary font-bold">Chalak</span>{" "}
          <span className="text-primary font-bold"> Champs</span> একটি আনন্দময়
          ও আধুনিক Skill-Based EdTech Platform, যেখানে ৩–১৫ বছর বয়সী শিশুদের
          জন্য Spoken English, Abacus Mind Math, Programming, Olympiad
          Preparation, Drawing, Quran Learning সহ বিভিন্ন কোর্সের মাধ্যমে
          শিশুদের সার্বিকভাবে বিকশিত করা হয়। Learning by Doing পদ্ধতিতে শেখার
          ফলে শিশুরা আত্মবিশ্বাসী, দক্ষ ও বাস্তব জীবনের জন্য প্রস্তুত হয়ে ওঠে।
        </p>

        <button
          onClick={() => setIsBookingOpen(true)}
          className="group relative overflow-hidden rounded-lg bg-primary py-4 px-16 text-lg font-bold text-white transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,143,202,0.5)] active:scale-95"
          style={{ animation: "pulseScale 4s infinite ease-in-out" }}
        >
          {/* Shimmering layer */}
          <span
            className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/40 to-transparent"
            style={{
              transform: "translateX(-100%)",
              animation: "shimmer 2.5s infinite ease-in-out",
            }}
          ></span>

          {/* Button Text */}
          <span className="relative z-10 text-white transition-transform duration-300 group-hover:translate-y-[-1px] inline-block">
            ১ ফ্রি ক্লাস বুক করুন
          </span>

          {/* Keyframes */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
    @keyframes shimmer {
      0% { transform: translateX(-100%) skewX(-45deg); }
      40%, 100% { transform: translateX(150%) skewX(-45deg); }
    }
    
    @keyframes pulseScale {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); } 
    }
  `,
            }}
          />
        </button>

        <p className="text-gray-600 text-sm mt-4">
          Booked a Class already?{" "}
          <Link className="text-secondary font-bold underline" href={"/signup"}>
            Join now
          </Link>
        </p>
      </div>

      <div>
        <Videoimg />
      </div>

      <Freebooking
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};

export default Banner;
