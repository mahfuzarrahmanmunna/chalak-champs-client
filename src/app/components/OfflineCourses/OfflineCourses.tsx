"use client";

import Button from "@/app/ui/button/Button";
import Image from "next/image";
import React from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { useBooking } from "@/app/providers/BookingProvider";

const OfflineCourses = () => {
  const { toast, openBooking } = useBooking();
  // 1. Get data from context
  const { offlineData } = useLanguage();

  // 2. Safety check
  if (!offlineData) return null;

  // 3. Helper for Colorful Icon Rendering
  const renderIcon = (index: number) => {
    // Point 1 (Rocket for International Standards/Growth)
    if (index === 0) {
      return (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Rocket Body */}
          <path
            d="M16 2L19 13L28 16L19 19L16 30L13 19L4 16L13 13L16 2Z"
            fill="#F3056D"
          />
          {/* Window */}
          <circle cx="16" cy="16" r="3" fill="#FFD700" />
          {/* Left Wing */}
          <path
            d="M13 19L9 26"
            stroke="#214187"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Right Wing */}
          <path
            d="M19 19L23 26"
            stroke="#214187"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );
    }
    // Point 2 (UPDATED: White Square with Cross & Pink Circle)
    if (index === 1) {
      return (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background: White Rounded Square with subtle border for visibility */}
          <rect
            x="1"
            y="1"
            width="30"
            height="30"
            rx="8"
            fill="white"
            stroke="#E5E7EB"
            strokeWidth="2"
          />

          {/* Dark Blue Cross */}
          <path d="M14 4H18V14H28V18H18V28H14V18H4V14H14V4Z" fill="#214187" />

          {/* Pink Circle in Center */}
          <circle cx="16" cy="16" r="3.5" fill="#F3056D" />
        </svg>
      );
    }
    // Point 3 (Heart Shield for Counselling/Care)
    if (index === 2) {
      return (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield Background */}
          <path
            d="M16 4L28 10V15C28 21 23 26 16 28C9 26 4 21 4 15V10L16 4Z"
            fill="#E0E7FF"
            stroke="#214187"
            strokeWidth="2"
          />
          {/* Heart */}
          <path
            d="M16 11C16 11 19 13 19 15.5C19 17.5 17 19 16 19C15 19 13 17.5 13 15.5C13 13 16 11 16 11Z"
            fill="#F3056D"
          />
        </svg>
      );
    }
    // Point 4 (Trophy for Mentor/Champ)
    if (index === 3) {
      return (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cup */}
          <path
            d="M6 8H26V14C26 18.4 22.4 22 18 22H14C9.6 22 6 18.4 6 14V8Z"
            fill="#FFD700"
          />
          {/* Handles */}
          <path d="M6 12H2V14C2 16.2 3.8 18 6 18V12Z" fill="#F59E0B" />
          <path d="M26 12H30V14C30 16.2 28.2 18 26 18V12Z" fill="#F59E0B" />
          {/* Base */}
          <path d="M14 22H18V26H14V22Z" fill="#214187" />
          <path d="M10 26H22V28H10V26Z" fill="#214187" />
          {/* Star Detail */}
          <path
            d="M16 12V16M13 14H19"
            stroke="#B45309"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="overflow-hidden bg-linear-to-b mx-auto from-[#FF8FCA] to-[#010D3E]/11 container rounded-[36px] md:rounded-[80px] p-0.5">
      <div className="bg-white relative pb-12.5 rounded-[34px] md:rounded-[78px] font-semibold leading-10">
        {/* --- Header Section --- */}
        <div className="px-4">
          <h3 className="text-2xl md:text-5xl font-bold text-center pt-14 md:leading-14.5 tracking-[0]">
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
        <div className="z-20 md:px-10.5 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {offlineData.cards.map((card) => (
              <div key={card.id} className="w-full mt-6 max-w-72.5">
                <div className="border-3 rounded-3xl border-[#FF8FCA] overflow-hidden">
                  <Image
                    src={card.image}
                    width={290}
                    height={281}
                    alt={card.title}
                    className=""
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
            <Button onClick={openBooking} className="px-5 py-2">
              {offlineData.cta}
            </Button>
          </div>
        </div>

        {/* --- Why Us Section --- */}
        <div className="px-4 md:px-6 md:px-10.5">
          <div>
            <h4 className="text-2xl md:text-5xl text-center font-bold md:leading-17 tracking-[-5%] text-[#00477C]">
              {offlineData.whyUs.title} <br />
              <span className="relative inline-block px-2 md:py-0.5 md:px-3 group">
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
                        <p className="text-[#1F2937] font-medium leading-relaxed mt-3">
                          {point.desc}
                        </p>
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
