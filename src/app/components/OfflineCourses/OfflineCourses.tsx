"use client";

import Button from "@/app/ui/button/Button";
import Image from "next/image";
import React from "react";
import { useLanguage } from "@/app/context/LanguageContext"; // Adjust path as needed

const OfflineCourses = () => {
  // 1. Get data from context
  const { offlineData } = useLanguage();

  // 2. Safety check
  if (!offlineData) return null;

  // 3. Helper for Icon Rendering based on point index
  const renderIcon = (index: number) => {
    // Point 1 (School Icon)
    if (index === 0) {
      return (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M29.3337 13.3333V21.3333M29.3337 13.3333L16.0003 6.66667L2.66699 13.3333L16.0003 20L29.3337 13.3333Z"
            stroke="#2D2D2D"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 16V22.6667C8 25.3333 10.6667 26.6667 16 26.6667C21.3333 26.6667 24 25.3333 24 22.6667V16"
            stroke="#2D2D2D"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    // Point 2 (Group Icon)
    if (index === 1) {
      return (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_627_2931)">
            <path
              d="M22.6663 28V25.3333C22.6663 23.9188 22.1044 22.5623 21.1042 21.5621C20.1041 20.5619 18.7475 20 17.333 20H6.66634C5.25185 20 3.8953 20.5619 2.89511 21.5621C1.89491 22.5623 1.33301 23.9188 1.33301 25.3333V28"
              stroke="#2D2D2D"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.0003 14.6667C14.9458 14.6667 17.3337 12.2789 17.3337 9.33333C17.3337 6.38781 14.9458 4 12.0003 4C9.05481 4 6.66699 6.38781 6.66699 9.33333C6.66699 12.2789 9.05481 14.6667 12.0003 14.6667Z"
              stroke="#2D2D2D"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M30.667 28V25.3333C30.6661 24.1516 30.2728 23.0037 29.5488 22.0698C28.8248 21.1358 27.8112 20.4688 26.667 20.1733"
              stroke="#2D2D2D"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21.333 4.17334C22.4802 4.46707 23.4971 5.13427 24.2232 6.06975C24.9493 7.00523 25.3435 8.15578 25.3435 9.34001C25.3435 10.5242 24.9493 11.6748 24.2232 12.6103C23.4971 13.5457 22.4802 14.2129 21.333 14.5067"
              stroke="#2D2D2D"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_627_2931">
              <rect width="32" height="32" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    }
    // Point 3 (House Icon)
    if (index === 2) {
      return (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 12L16 2.66666L28 12V26.6667C28 27.3739 27.719 28.0522 27.219 28.5523C26.7189 29.0524 26.0406 29.3333 25.3333 29.3333H6.66667C5.95942 29.3333 5.28115 29.0524 4.78105 28.5523C4.28095 28.0522 4 27.3739 4 26.6667V12Z"
            stroke="#2D2D2D"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 29.3333V16H20V29.3333"
            stroke="#2D2D2D"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    // Point 4 (Layers Icon)
    if (index === 3) {
      return (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.0003 2.66666L2.66699 9.33332L16.0003 16L29.3337 9.33332L16.0003 2.66666Z"
            stroke="#2D2D2D"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.66699 22.6667L16.0003 29.3333L29.3337 22.6667"
            stroke="#2D2D2D"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.66699 16L16.0003 22.6667L29.3337 16"
            stroke="#2D2D2D"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="overflow-hidden bg-linear-to-b mx-auto from-[#FF8FCA] to-[#010D3E]/11 container rounded-[80px] p-0.5">
      <div className="bg-white relative pb-12.5 rounded-[78px] font-semibold leading-10">
        <div className="absolute -rotate-15 z-0 h-110 w-236 bg-[#ff268459] rounded-4xl top-80 -left-160 blur-[135.45px]"></div>

        {/* --- Header Section --- */}
        <div className="px-4">
          <h3 className="text-2xl md:text-5xl font-bold text-center pt-14 leading-14.5 tracking-[0]">
            <span className="text-[#00477C]">{offlineData.header.prefix}</span>{" "}
            <span className="relative inline-block px-2 group">
              <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>
              <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
              <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
              <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
              <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
              <span className="text-primary">
                {offlineData.header.highlight}
              </span>
            </span>
          </h3>
        </div>

        {/* --- Top 3 Cards Grid --- */}
        <div className="z-10 md:px-10.5 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-center  gap-8 md:gap-12">
            {offlineData.cards.map((card) => (
              <div key={card.id} className="w-full mt-6 max-w-72.5">
                <div className="border-3 rounded-3xl border-[#FF8FCA] overflow-hidden">
                  <Image
                    src={card.image}
                    width={290}
                    height={281}
                    alt={card.title}
                    className=" "
                  />
                </div>
                <h4 className="text-[#F3066E] font-bold leading-8 tracking-[0px] text-lg md:text-xl mt-6 mb-3 text-center md:text-left">
                  {card.title}
                </h4>
                <p className="leading-5 md:leading-4 font-normal text-sm text-[#000000]/70 text-center md:text-left">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          {/* --- CTA Button --- */}
          <div className="flex justify-center mt-8 mb-12 md:mb-20">
            <Button className="px-5 py-2">{offlineData.cta}</Button>
          </div>
        </div>

        {/* --- Why Us Section --- */}
        <div className="px-4 md:px-6 md:px-10.5">
          <div>
            <h4 className="text-2xl md:text-5xl text-center font-bold leading-17 tracking-[-5%] text-[#00477C]">
              {offlineData.whyUs.title} <br />
              <span className="relative inline-block px-2 py-0.5 md:px-3 group">
                <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>
                <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
                <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
                <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
                <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
                <span className="text-primary">
                  {offlineData.whyUs.highlight
                    .split("<br/>")
                    .map((text, index) => (
                      <React.Fragment key={index}>
                        {text}
                        {index !==
                          offlineData.whyUs.highlight.split("<br/>").length -
                            1 && <br />}
                      </React.Fragment>
                    ))}
                </span>
              </span>
            </h4>
          </div>

          {/* --- MAIN CARD CONTAINER --- */}
          <div className="relative bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-100 p-6 md:p-10 overflow-hidden mt-8 md:mt-12">
            {/* --- DECORATIVE BACKGROUND GLOW (Soft & Modern) --- */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#F3056D]/5 to-transparent rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            {/* --- TOP RIGHT BUBBLE DESIGN --- */}
            <div className="absolute top-[-12px] right-6 md:right-10 z-20 group">
              <div className="relative">
                {/* Bubble Gradient Background */}
                
                {/* Subtle glow behind bubble */}
                <div className="absolute inset-0 bg-[#214187] blur-xl opacity-30 rounded-full -z-10"></div>
              </div>
            </div>
            {/* --- POINTS LIST (Grid Layout) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10">
              {offlineData.whyUs.points.map((point, index) => {
                return (
                  <div
                    key={point.id}
                    className="group flex items-start gap-4 p-5 rounded-[20px] bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-[#F3056E]/30 hover:shadow-xl hover:shadow-pink-50/50 transition-all duration-300"
                  >
                    {/* Icon Container */}
                    <div className="shrink-0 relative">
                      {/* Icon Glow Effect */}
                      <div className="absolute inset-0 bg-[#F3056D]/20 rounded-xl blur-md group-hover:bg-[#F3056D]/30 transition-colors"></div>

                      {/* Actual Icon Box */}
                      <div className="relative p-2.5 bg-white border border-gray-100 rounded-xl text-[#F3056D] shadow-sm group-hover:scale-110 transition-transform duration-300">
                        {renderIcon(index)}
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 pt-1">
                      <p
                        className={`text-base leading-relaxed ${
                          point.quote
                            ? "text-primary font-bold"
                            : "text-[#1F2937] font-medium"
                        }`}
                      >
                        {point.text || point.quote}
                      </p>
                      {point.desc && (
                        <p className="text-[#1F2937] font-medium leading-relaxed mt-3">{point.desc}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineCourses;
