import Button from "@/app/ui/button/Button";
import Image from "next/image";
import React from "react";

const FeatureCourses: React.FC = () => {
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

      {/* 
        Main Card Container:
        - relative z-10 places it above the gradient.
        - max-w-209.5 ensures the container is wide enough for the layout.
      */}
      <div className="bg-linear-to-r from-[#FF8FCA] max-w-250.5 mx-auto to-[#D9D9D9] rounded-[40px] p-0.5">
        <div className="relative z-10 bg-primary  mx-auto p-3 md:p-4 md:pl-10 rounded-[38px] flex flex-col md:flex-row items-center gap-6">
          {/* Left Side: 60% width on desktop */}
          <div className="space-y-4 w-full md:w-[60%]">
            <div>
              <h2 className="text-2xl md:text-3xl leading-[1.3] font-bold text-white">
                কিডস অনর্গল English কোর্সে
              </h2>
              <div className="flex items-center gap-4 mt-4">
                <h2 className="bg-secondary text-xl md:text-2xl font-bold p-2 rounded-xl shadow-lg">
                  30% মূল্য ছাড়
                </h2>
                <p className="text-white/90 text-sm md:text-base">
                  (সীমিত সিট)
                </p>
              </div>
            </div>

            <p className="text-white/90 text-sm md:text-sm leading-relaxed tracking-normal">
              আপনার সন্তানের ইংলিশ বলা শুরু হোক জীবনের প্রথম ধাপেই, আগামীদিনে
              আপনার সন্তান হবে আপনার এবং চালাক Champs এর গর্ব
            </p>

            <div>
              <div className="flex flex-wrap gap-2 bg-[#e91e63] rounded-xl">
                <div className="relative p-0.5 rounded-full">
                  <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-transparent border-b-2 border-b-white/90 border-t-2 border-t-black">
                    <span className="w-3 h-3 bg-white rounded-full"></span>
                    <span className="text-white font-regular text-xs">
                      লাইভ ক্লাস
                    </span>
                  </div>
                </div>
                <div className="relative p-0.5 rounded-full">
                  <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-transparent border-b-2 border-b-white/90 border-t-2 border-t-black">
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
                    <span className="text-white font-regular text-xs">
                      5 মাস সময়ব্যাপি
                    </span>
                  </div>
                </div>
                <div className="relative p-0.5 rounded-full">
                  <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-transparent border-b-2 border-b-white/90 border-t-2 border-t-black">
                    <span className="text-white font-regular text-xs">
                      এক ব্যাচে 15 জন
                    </span>
                  </div>
                </div>
                <div className="relative p-0.5 rounded-full">
                  <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-transparent border-b-2 border-b-white/90 border-t-2 border-t-black">
                    <span className="text-white font-regular text-xs">
                      ফ্রি কোর্স ম্যাটিরিয়ালস
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5">
              {/* <button className="px-8 py-3 cursor-pointer bg-white font-bold rounded-xl text-secondary shadow-[inset_0_3px_0_rgba(0,29,58,0.6)] border-1 border-[rgba(0, 29, 58, 0.6)]">
              ভর্তি হতে ক্লিক করুন
            </button> */}
              <Button
                bgColor="#214187"
                textColor="white"
                className="shadow-[inset_0_4px_0_rgba(255,255,255,0.4)] hover:text-black"
              >
                ভর্তি হতে ক্লিক করুন
              </Button>
            </div>
          </div>

          {/* Right Side: 40% width on desktop */}
          <div className="w-full md:w-[40%] flex  items-center justify-center mt-4 md:mt-0 relative z-10">
            <figure className="relative w-150 bg-linear-to-b from-[#f36ca6]  to-[#FF8FCA] p-0.75 rounded-[27px] h-75 flex items-center justify-center">
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
