import Image from "next/image";
import React from "react";

const FeatureCourses: React.FC = () => {
  return (
    <section
      className="px-4 relative"
      style={{
        backgroundColor: "var(--color-background)",
      }}
    >
      {/* 
        Gradient Div: 
        - Absolute positioning to take it out of flow.
        - top-1/2 -translate-y-1/2 centers it vertically.
        - -right-10 md:-right-32 positions it on the right side.
        - z-0 ensures it stays behind the card.
        - pointer-events-none ensures it doesn't block clicks on the card.
      */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -right-10 md:-right-32 z-0 pointer-events-none"
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
        - max-w-[1200px] ensures the container is wide enough for the layout.
      */}
      <div className="relative z-10 bg-primary max-w-[1200px] mx-auto p-3 md:p-4 md:pl-10 rounded-3xl flex flex-col md:flex-row items-center gap-6">
        {/* Left Side: 60% width on desktop */}
        <div className="space-y-4 w-full md:w-[60%]">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">
              কিডস অনর্গল English কোর্সে
            </h2>
            <div className="flex items-center gap-4 mt-4">
              <h2 className="bg-secondary text-xl md:text-2xl font-bold p-2 rounded-xl shadow-lg">
                30% মূল্য ছাড়
              </h2>
              <p className="text-white/90 text-sm md:text-base">(সীমিত সিট)</p>
            </div>
          </div>

          <p className="text-white/90 text-sm md:text-base leading-relaxed">
            আপনার সন্তানের ইংলিশ বলা শুরু হোক জীবনের প্রথম ধাপেই, আগামীদিনে
            আপনার সন্তান হবে আপনার এবং চালাক Champs এর গর্ব
          </p>

          <div>
            <div className="flex flex-wrap gap-2 bg-[#e91e63] rounded-xl">
              <div className="relative p-0.5 rounded-full">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-transparent border-b-2 border-b-white/90 border-t-2 border-t-black">
                  <span className="w-3 h-3 bg-white rounded-full"></span>
                  <span className="text-white font-medium text-xs md:text-sm">
                    লাইভ ক্লাস
                  </span>
                </div>
              </div>
              <div className="relative p-0.5 rounded-full">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-transparent border-b-2 border-b-white/90 border-t-2 border-t-black">
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
                  <span className="text-white font-medium text-xs md:text-sm">
                    5 মাস সময়ব্যাপি
                  </span>
                </div>
              </div>
              <div className="relative p-0.5 rounded-full">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-transparent border-b-2 border-b-white/90 border-t-2 border-t-black">
                  <span className="text-white font-medium text-xs md:text-sm">
                    এক ব্যাচে 15 জন
                  </span>
                </div>
              </div>
              <div className="relative p-0.5 rounded-full">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-transparent border-b-2 border-b-white/90 border-t-2 border-t-black">
                  <span className="text-white font-medium text-xs md:text-sm">
                    ফ্রি কোর্স ম্যাটিরিয়ালস
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <button
              className="px-8 py-3 cursor-pointer bg-white font-bold rounded-xl text-secondary 
                   shadow-[0_4px_0_0_rgba(0,0,0,0.1)] 
                   hover:shadow-lg hover:-translate-y-1 
                   active:translate-y-0 active:shadow-none 
                   transition-all duration-150 ease-in-out text-sm md:text-base"
            >
              ভর্তি হতে ক্লিক করুন
            </button>
          </div>
        </div>

        {/* Right Side: 40% width on desktop */}
        <div className="w-full md:w-[40%] flex items-center justify-center mt-4 md:mt-0 relative z-10">
          <figure className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full transform scale-90"></div>
            <Image
              src={"/onorgol.png"}
              alt="Onorgol"
              width={400}
              height={400}
              className="rounded-xl relative z-10 w-full h-auto object-contain"
            />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default FeatureCourses;
