"use client";
import React from "react";

const CourseDecorate = () => {
  const features = [
    {
      title: "Expert Teachers",
      description:
        "কোর্সজুড়ে থাকবেন অভিজ্ঞ এক্সপার্ট টিচার যারা লাইভ Zoom সেশনে মজার পরিবেশে ইংরেজি শেখাবেন এবং প্রতিটি স্টুডেন্টকে Speaking-এ আত্মবিশ্বাসী করে তুলবেন।",
      color: "blue", // Custom prop to alternate colors
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Interactive Live Zoom Classes",
      description:
        "এখানে থাকছে মোট ৮টি লাইভ Zoom ক্লাস যেখানে Boring লেকচার নয় বরং মজার Interactive Learning এর মাধ্যমে স্টুডেন্টরা টিচারের সাথে সরাসরি কথা বলে ইংরেজি শিখবে!",
      color: "pink",
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23 7L16 12V7C16 6.46957 15.7893 5.96086 15.4142 5.58579C15.0391 5.21071 14.5304 5 14 5H2C1.46957 5 0.960859 5.21071 0.585786 5.58579C0.210714 5.96086 0 6.46957 0 7V17C0 17.5304 0.210714 18.0391 0.585786 18.4142C0.960859 18.7893 1.46957 19 2 19H14C14.5304 19 15.0391 18.7893 15.4142 18.4142C15.7893 18.0391 16 17.5304 16 17V12L23 17V7Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Fun Activities and Games",
      description:
        "এই Live কোর্সের ১৬টি মজার Activities এবং Games গুলোর মাধ্যমে স্টুডেন্টরা খেলতে খেলতে ইংরেজি শিখবে।",
      color: "blue",
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 12H18M12 6V18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      title: "Practice Videos",
      description:
        "৮টি Practice Video এর মাধ্যমে স্টুডেন্টরা নিজেরা Speaking Practice করবে, ছোট ছোট Dialogue বলবে এবং Real-life Conversations শিখবে।",
      color: "pink",
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="5 3 19 12 5 21 5 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 3H5V21H2C1.46957 21 0.960859 20.7893 0.585786 20.4142C0.210714 20.0391 0 19.5304 0 19V5C0 4.46957 0.210714 3.96086 0.585786 3.58579C0.960859 3.21071 1.46957 3 2 3V3Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      title: "Speaking Video Creation",
      description:
        "স্টুডেন্টরা নিজেদের Speaking Video তৈরি করবে এবং ইন্সট্রাক্টরের কাছ থেকে Personalized Video Feedback পাবে, এতে তাদের ভুল শুধরে আরও ভালো হওয়ার সুযোগ।",
      color: "blue",
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      title: "Real-Life Conversations",
      description:
        "শুধু বই পড়ে নয়, বরং বাস্তব জীবনের বিভিন্ন পরিস্থিতি যেমন নিজের পরিচয় দেওয়া, বন্ধুদের সাথে কথা বলা এসব বিষয়ে Practice করবে।",
      color: "pink",
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 9H16M8 13H13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: "Certificate of Completion",
      description:
        "কোর্স সফলভাবে শেষ করলে পাবে Certificate যা তোমার ইংরেজি দক্ষতার প্রমাণ হিসেবে কাজ করবে এবং ভবিষ্যতে তোমার CV-তে যুক্ত করতে পারবে।",
      color: "blue",
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 10V6C22 5.46957 21.7893 4.96086 21.4142 4.58579C21.0391 4.21071 20.5304 4 20 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V14C2 14.5304 2.21071 15.0391 2.58579 15.4142C2.96086 15.7893 3.46957 16 4 16H14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 21L22 17L18 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 17H22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="courseDecorator" className="w-full bg-primary border-2 border-[#FF8FCA] rounded-xl p-6  relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="">
          <h2 className="font-bold text-lg text-white">
            কোর্সটি যেভাবে সাজানো হয়েছে
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-3">
          {features.map((feature, index) => {
            // Alternate between Blue and Pink accents
            const isBlue = feature.color === "blue";
            const accentColor = isBlue ? "#00477C" : "#F3066D";
            const shadowColor = isBlue
              ? "rgba(0, 71, 124, 0.4)"
              : "rgba(243, 6, 109, 0.4)";

            return (
              <div
                key={index}
                className="group relative p-3  transition-all duration-300 "
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Icon Container */}
                  <div
                    className=" w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      border: `1px solid ${accentColor}30`,
                    }}
                  >
                    <div
                      className="transition-transform duration-300 group-hover:scale-110"
                      style={{ color: accentColor }}
                    >
                      {feature.icon}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h3 className="text-md font-bold text-white mb-2 transition-colors duration-300 group-hover:text-gray-100">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-[15px] leading-relaxed font-normal">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CourseDecorate;
