"use client";
import Button from "@/app/ui/button/Button";
import Image from "next/image";
import React from "react";
import { useLanguage } from "@/app/context/LanguageContext";

const FeatureCourses: React.FC = () => {
  // FIX: Access featureCourses directly from context (not t.featureCourses)
  const { featureCourses } = useLanguage();
  const data = featureCourses;

  // Helper to render Contact Info
  const renderContactInfo = () => {
    if (!data?.contact) return null;

    const parts = data.contact.split(/(Call us:|কল করুন:)/);
    const textPart = parts[0].trim();
    const numberPart = parts[1]?.trim() || "";

    return (
      <p className="text-white/90 text-xs md:text-base mt-4">
        {textPart}
        {numberPart && (
          <a href={`tel:${numberPart}`} className="font-bold">
            {numberPart}
          </a>
        )}
      </p>
    );
  };

  return (
    <section className="px-4 relative container mx-auto">
      <div
        className="absolute md:top-1/2  md:-translate-y-1/2 md:-right-16 z-0 pointer-events-none"
        style={{
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #F3066E 0%, #F982B633 40%, #ffffff 70%)",
        }}
      />

      {/* Main Card Container */}
      <div className="bg-linear-to-r from-[#FF8FCA] max-w-250.5 mx-auto to-[#D9D9D9] rounded-[40px] p-0.5">
        <div className="relative z-10 bg-primary  mx-auto p-3 md:p-4 md:pl-10 rounded-[38px] flex flex-col md:flex-row items-center gap-6">
          {/* Left Side: 60% width on desktop */}
          <div className="space-y-4 w-full md:w-[60%]">
            <div className="leading-[130%] tracking-[-4%]">
              {/* Dynamic Title */}
              <h2 className="text-2xl md:text-4xl leading-[1.3] font-bold text-white">
                {data?.title} {data?.suffix}
              </h2>
              <div className="flex relative items-center gap-4 mt-1">
                {/* Dynamic Discount Badge */}
                <h2 className="bg-secondary  text-xl md:text-4xl font-bold p-2 rounded-xl shadow-lg">
                  {data?.discount}
                </h2>
                {/* Dynamic Discount Note */}
                <p className="text-white/90 absolute right-62 bottom-2 text-sm md:text-base">
                  {data?.discountNote}
                </p>
              </div>
            </div>

            {/* Dynamic Description */}
            <p className="text-white/90 text-sm md:text-sm leading-auto tracking-[0px]">
              {data?.subtitle}
            </p>

            {/* Dynamic Points List */}
            <div>
              <div className="flex flex-wrap gap-2 bg-[#e91e63] rounded-xl">
                {data?.points?.map((point, index) => (
                  <div key={index} className="relative p-0.5 rounded-full">
                    <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-transparent border-b-2 border-b-white/90 border-t-2 border-t-black">
                      {/* Icons kept exactly as in original code */}
                      {index === 0 && (
                        <span className="w-3 h-3 bg-white rounded-full"></span>
                      )}
                      {index === 1 && (
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      )}
                      <span className="text-white font-regular text-xs">
                        {point}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <Button
                bgColor="#214187"
                textColor="white"
                className="shadow-[inset_0_4px_0_rgba(255,255,255,0.4)] hover:text-black"
              >
                {/* Dynamic CTA */}
                {data?.cta}
              </Button>

              {/* Dynamic Contact Info Added Here */}
              {renderContactInfo()}
            </div>
          </div>

          {/* Right Side: 40% width on desktop */}
          <div className="w-full md:w-[40%] flex  items-center justify-center mt-4 md:mt-0 relative z-10">
            <figure className="relative w-150 bg-linear-to-b from-[#f36ca6] to-[#FF8FCA] p-0.75 rounded-[27px] h-75 flex items-center justify-center">
              <Image
                src={"/onorgol.png"}
                alt="Onorgol"
                width={400}
                height={250}
                className="rounded-[25px] relative z-10 w-full h-full  object-cover object-top"
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCourses;
