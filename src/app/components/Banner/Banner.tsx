"use client";
import Link from "next/link";
import Image from "next/image"; // Fixed: Import from next/image, not lucide-react
import React, { useState } from "react";
import Videoimg from "./Videoimg";
import Freebooking from "../Freebooking/Freebooking";

const Banner = () => {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div
      
    >
      <div className="text-center  px-4 py-10 md:max-w-[820px] mx-auto font-inter">
        <p className="text-lg mb-2 text-gray-600">আমরা বিশ্বাস করি</p>

        <div className="flex flex-col relative items-center justify-center">
          {/* Fixed: Removed the outer <h1> tag to prevent nesting error */}
          <h1 className="text-3xl  md:text-4xl font-bold flex flex-wrap items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Every Child Is A
              <span className="relative  inline-block px-6 py-2 ml-2 text-pink-500">
                <span className="absolute inset-0 border-2 border-dashed border-pink-500 pointer-events-none"></span>
                <span className="absolute -top-1 -left-1 w-3 h-3 bg-pink-500"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500"></span>
                <span className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-500"></span>
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-pink-500 text-transparent"></span>
                Champ
              </span>
            </span>
          </h1>

          {/* King Image moved outside the H1 tag for better layout control */}
          <div className="absolute -top-10 right-32">
            <Image src="/king.png" width={50} height={50} alt="King Icon" />
          </div>
        </div>

        <p className="my-6 text-gray-700 leading-relaxed text-sm md:text-base">
          <span className="text-secondary font-bold">Chalak</span>{" "}
          <span className="text-primary font-bold"> Champs</span> একটি আনন্দময়
          ও আধুনিক Skill-Based EdTech Platform, যেখানে ৩–১৫ বছর বয়সী শিশুদের
          জন্য Spoken English, Abacus Mind Math, Programming, Olympiad
          Preparation, Drawing, Quran Learning সহ বিভিন্ন কোর্সের মাধ্যমে
          শিশুদের সার্বিকভাবে বিকশিত করা হয়। Learning by Doing পদ্ধতিতে শেখার
          ফলে শিশুরা আত্মবিশ্বাসী, দক্ষ ও বাস্তব জীবনের জন্য প্রস্তুত হয়ে ওঠে।
        </p>

        <button
          className="relative text-lg font-bold text-white cursor-pointer rounded-lg bg-primary hover:bg-white py-4 px-16 overflow-hidden transition-all duration-300 bg-[linear-gradient(120deg,transparent_75%,#FF8FCA_100%)]"
          onClick={() => setIsBookingOpen(true)}
        >
          ১ ফ্রি ক্লাস বুক করুন
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
