"use client";
import Link from "next/link";
import Image from "next/image"; // Fixed: Import from next/image, not lucide-react
import React, { useState } from "react";
import Videoimg from "./Videoimg";
import Freebooking from "../Freebooking/Freebooking";

const Banner = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div>
      <div className="text-center  px-4 py-10 md:max-w-205 mx-auto font-inter">
        <p className="text-lg mb-2 text-gray-600">আমরা বিশ্বাস করি</p>

        <div className="flex flex-col relative items-center justify-center">
          {/* Fixed: Removed the outer <h1> tag to prevent nesting error */}
          <h1
            className="text-3xl md:text-5xl z-10 font-bold flex flex-wrap items-center justify-center gap-2 
             bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00477C] to-[#F3066E]  text-pink-600
             "
          >
            {/* The text inherits transparency from h1 */}
            <span>Every Child Is A</span>

            <span className="relative inline-block px-3 py-2">
              {/* Box Decorations (Ensure these are behind or don't block text) */}
              <span className="absolute inset-0 border-2 border-dashed border-pink-500 pointer-events-none"></span>
              <span className="absolute -top-1 -left-1 w-3 h-3 bg-pink-500"></span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500"></span>
              <span className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-500"></span>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-pink-500"></span>

              {/* The text here will now show the h1's radial gradient */}
              <span>Champ</span>
            </span>
          </h1>

          {/* King Image moved outside the H1 tag for better layout control */}
          <div className="absolute -top-10 right-20 z-0 ">
            <Image src="/king.png" width={50} height={50} alt="King Icon" />
          </div>
        </div>

        <p className="my-6 text-gray-700 tracking-normal leading-5 text-sm md:text-base">
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
          className="group relative overflow-hidden  rounded-lg bg-primary py-4 px-16 text-lg font-bold text-white transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,143,202,0.5)] active:scale-95"
        >
          {/* Shimmering layer - optimized with a smoother gradient and group-hover speed-up */}
          <span
            className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/40 to-transparent"
            style={{
              transform: "translateX(-100%)",
              animation: "shimmer 2.5s infinite ease-in-out",
            }}
          ></span>

          {/* Button Text - added a slight lift effect on hover */}
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
