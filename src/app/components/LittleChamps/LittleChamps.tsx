"use client";

import Image from "next/image";
import React from "react";
import HoverGlow from "../HoverGlow/HoverGlow";
import { useLanguage } from "@/app/context/LanguageContext"; // Adjust path

const LittleChamps = () => {
  // 1. Get data from context
  const { littleChampsData } = useLanguage();

  // 2. Destructure title parts
  const { title, cards } = littleChampsData;

  return (
    <div className="max-w-292 mx-auto space-y-16 overflow-clip">
      {/* Header */}
      <div>
        <h3 className="text-2xl leading-auto md:text-5xl font-bold tracking-[-5%] text-center">
          <span className="text-[#00477C]">{title.prefix}</span>{" "}
          <span className="relative inline-block px-2 py-3 group">
            <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>
            <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="text-primary"> {title.highlight} </span>
          </span>{" "}
          <span className="bg-linear-to-r from-[#F3066D] to-[#FC7CB4] bg-clip-text text-transparent">
            {title.suffix}{" "}
          </span>
        </h3>
      </div>

      {/* main contain cards  */}
      <div className="md:flex gap-6 space-y-6 md:space-y-0">
        {/* first column */}
        <div className="flex flex-col gap-6">
          {/* first column first card (Card 1) */}
          <div className="md:w-[400px] flex justify-center items-center h-[184px] gap-6 rounded-[40px] bg-[radial-gradient(circle,#001D3A,#214187)] relative overflow-hidden">
            <div className="absolute -top-3 left-0">
              <Image
                src={"/assets/giftIcon.webp"}
                height={149}
                width={149}
                alt="gift Icon"
              />
            </div>
            <div className="text-center ">
              {/* Render HTML to handle <br /> */}
              <h4
                className="text-3xl font-semibold leading-tight"
                dangerouslySetInnerHTML={{ __html: cards[0].title }}
              />
            </div>
          </div>

          {/* first column second card (Card 2) */}
          <div className="bg-linear-to-b md:w-[400px] h-[389px] from-[#00477C] to-[#FF8FCA]/30 p-1 rounded-[40px]">
            <div className="bg-[radial-gradient(circle,#DD2675,#00477C)] overflow-hidden w-full h-full rounded-[36px] ">
              <div className="w-full mx-auto  relative">
                <div className="">
                  <Image
                    src={"/highquality.png"}
                    height={300}
                    width={400}
                    alt="group Meeting"
                    className="object-cover rounded-[26px]"
                  />
                  {/* <h4
                    className="md:text-2xl text-3xl font-semibold text-center mt-12 leading-tight"
                    dangerouslySetInnerHTML={{ __html: cards[1].title }}
                  /> */}
                </div>

                {/* <div className="absolute -bottom-8">
                  <Image
                    src={"/assets/liveicon.webp"}
                    height={120}
                    width={120}
                    alt="live icon"
                  />
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* second column */}
        <div className="flex flex-col gap-6 ">
          {/* second column first card (Card 3) */}
          <div className="bg-linear-to-b from-[#F3066E] to-[#FFFFFF] md:h-[300px] md:w-[316px] rounded-[40px]  overflow-hidden">
            <div className="flex p-0.5">
              <Image
                src={"/topic.png"}
                width={300}
                height={300}
                alt={cards[2].alt}
                className="w-full rounded-[38px]"
              />
            </div>
          </div>
          {/* second column second card (Card 4) */}
          <div className="bg-[radial-gradient(circle,_#DD2675_0%,_#DD2675_30%,_#371826_100%)] md:h-[268px] md:w-[316px] rounded-[40px] p-0.5 overflow-hidden">
            <div className="flex items-center justify-center flex-col gap2 py-7">
              <Image
                src={"/books.webp"}
                width={148}
                height={148}
                alt="books image"
                className="h-[148px] w-[148px] mx-auto "
              />
              <div className="text-center text-2xl font-semibold mb-3">
                {/* Render HTML for <br /> */}
                <span dangerouslySetInnerHTML={{ __html: cards[3].title }} />
              </div>
            </div>
          </div>
        </div>

        {/* Third card */}
        <div className="flex flex-col gap-6">
          {/* third column first card (Card 5) */}
          <div className="w-full md:w-[400px] h-[330px] bg-gradient-to-br from-[#06F32E] to-[#ffffff] rounded-[40px] p-0.5">
            <div className="flex h-full w-full overflow-hidden relative  bg-[radial-gradient(circle_at_bottom_left,_#084400_0%,_#33C745_100%)] rounded-[39px] p-2 text-white">
              <div className="absolute top-0 right-0">
                <Image
                  src={"/assets/whatsapp.webp"}
                  width={250}
                  height={250}
                  alt="whats app icon"
                  className="h-[248px] w-[248px]"
                />
              </div>
              <div className="flex items-end md:ps-8 ps-2 pb-8">
                <h1
                  className="text-2xl leading-7 font-semibold"
                  dangerouslySetInnerHTML={{ __html: cards[4].title }}
                />
              </div>
            </div>
          </div>
          {/* third column second card (Card 6) */}
          <div className="w-full md:w-[400px] h-[242px] bg-gradient-to-br from-[#F36D06] to-[#ffffff] rounded-[40px] p-0.5">
            <div className="flex h-full w-full overflow-hidden relative  bg-[radial-gradient(circle,_#EDC16B_0%,_#F1AF1B_100%)] rounded-[39px] p-2 text-white">
              <div className="absolute top-0 left-0">
                <Image
                  src={"/assets/image216.webp"}
                  width={250}
                  height={250}
                  alt={cards[5].alt}
                  className="h-[248px] w-[248px]"
                />
              </div>
              <div className="flex text-right justify-end w-full md:pr-8 md:pb-8 pb-3 pr-3 items-end">
                <h1
                  className="text-2xl text-white leading-7 font-semibold"
                  dangerouslySetInnerHTML={{ __html: cards[5].title }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LittleChamps;
