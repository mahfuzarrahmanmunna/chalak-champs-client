"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import Freebooking from "../Freebooking/Freebooking";
import { useLanguage } from "@/app/context/LanguageContext";
import AddsCard from "../AddsCard/AddsCard";
import { useBooking } from "@/app/providers/BookingProvider";
import { VideoImg1Component as VideoImg1 } from "./VideoImg1";

const BannerHero = () => {
  const { openBooking } = useBooking();
  const { heroData, currentLang } = useLanguage();

  const fullTitle = heroData?.title || "We Believe Every Child Is A Champ";

  // --- 1. Split Title Logic ---
  // (Keeping this because the Title is still a standard text input, not Quill)
  let introText = "";
  let mainTitleText = "";

  if (currentLang === "bn") {
    const parts = fullTitle.split("আমরা বিশ্বাস করি ");
    introText = "আমরা বিশ্বাস করি";
    mainTitleText = parts[1];
  } else {
    const parts = fullTitle.split("We Believe ");
    introText = "We Believe";
    mainTitleText = parts[1];
  }

  if (!mainTitleText) mainTitleText = "Every Child Is A Champ";

  const titleParts = mainTitleText.split(" Champ");
  const beforeChamp = titleParts[0];

  return (
    <div className="">
      <div className="md:mb-20 mb-15">
        <AddsCard />
      </div>
      <div className="text-center md:max-w-205 mx-auto font-inter">
        <p className="text-2xl text-gray-600 leading-15 tracking-[0px]">{introText}</p>

        <div className="flex flex-col relative items-center justify-center">
          <div className="relative flex flex-wrap items-center justify-center gap-2">
            <h1 className="text-4xl md:text-6xl font-bold text-[#00477C] pointer-events-none tracking-[-3%] md:tracking-[-4px] leading-12 md:leading-18.75">
              {beforeChamp} {" "} <br className="flex md:hidden" />{"  "}
              <span className="ml-3 mr-0 pr-0 text-[#F3066E]">Champ</span>
            </h1>

            <div className="absolute pointer-events-none flex items-center justify-center z-10 right-14 bottom-0.5 w-32.5 h-11.5 md:right-[calc(50%-327px)] md:-bottom-1.5 md:w-57 md:h-19 ">
              <div className="w-full h-full border-2 border-dashed border-[#F3066E] relative z-0">
                <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#F3066E]"></span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F3066E]"></span>
                <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#F3066E]"></span>
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#F3066E]"></span>
              </div>
            </div>
          </div>

          {/* Dynamic King Image & Dynamic Position Class */}
          {/* <div className={heroData?.kingImageClass || "absolute md:-top-8 z-0 right-[62%] -bottom-7 md:right-[calc(50%-355px)]"}>
            <Image
              src={heroData?.kingImage || "/king.png"}
              width={50}
              height={50}
              className="w-[35px] h-[35px] md:w-[50px] md:h-[50px] object-contain"
              alt="King Icon"
            />
          </div> */}
        </div>

        {/* --- QUILL HTML SUBTITLE RENDERER --- */}
        {/* Replaced the old .split() logic with dangerouslySetInnerHTML */}
        {/* Added Tailwind arbitrary variants so Quill images, links, and lists look good automatically */}
        <div 
          className="my-6 mt-12 text-gray-700 tracking-[-2%] leading-5 text-base md:text-base 
                     [&_p]:mb-4 [&_p]:leading-relaxed 
                     [&_a]:text-[#F3066E] [&_a]:font-bold [&_a]:underline hover:[&_a]:opacity-80
                     [&_img]:inline-block [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-2xl [&_img]:my-4 [&_img]:shadow-md
                     [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-left
                     [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:text-left
                     [&_li]:mb-2"
          dangerouslySetInnerHTML={{ __html: heroData?.subtitle || "" }} 
        />

        <button
          onClick={openBooking}
          className="group tracking-[-2%] px-6 mt-10 md:px-24 z-10 text-white transition-transform duration-300 group-hover:translate-y-[-1px] relative overflow-hidden rounded-lg bg-primary py-4 text-lg font-bold hover:shadow-[0_0_20px_rgba(255,143,202,0.5)] active:scale-95"
          style={{ animation: "pulseScale 2.5s infinite ease-in-out" }}
        >
          <span
            className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/40 to-transparent"
            style={{ transform: "translateX(-100%)", animation: "shimmer 2.5s infinite ease-in-out" }}
          ></span>
          <span className=" ">{heroData?.ctaButton}</span>

          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes shimmer { 0% { transform: translateX(-100%) skewX(-45deg); } 40%, 100% { transform: translateX(150%) skewX(-45deg); } }
              @keyframes pulseScale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
            `
          }} />
        </button>

        <p className="text-[#000000]/50 font-medium text-base mt-4 tracking-[-2%]">
          {heroData?.cta2 || ""}{" "}
          <Link className="text-secondary font-bold" href={`${currentLang}/courses`}>
            {heroData?.cta2Btn || ""}
          </Link>
        </p>
      </div>

      {/* Dynamic Video Component */}
      <div>
        <VideoImg1 videoId={heroData?.videoId} />
      </div>
    </div>
  );
};

export default BannerHero;