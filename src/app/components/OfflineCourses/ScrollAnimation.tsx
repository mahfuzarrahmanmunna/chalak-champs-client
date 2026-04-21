"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Your Content Data
const stackData = [
  {
    id: 1,
    title: "আন্তর্জাতিক মানসম্পন্ন",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M29.3337 13.3333V21.3333M29.3337 13.3333L16.0003 6.66667L2.66699 13.3333L16.0003 20L29.3337 13.3333Z"
          stroke="white"
          strokeWidth="2.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 16V22.6667C8 25.3333 10.6667 26.6667 16 26.6667C21.3333 26.6667 24 25.3333 24 22.6667V16"
          stroke="white"
          strokeWidth="2.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    content: (
      <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
        আমাদের প্রতিটি কোর্স{" "}
        <span className="text-white font-semibold">
          আন্তর্জাতিক মানসম্পন্ন ও বৈজ্ঞানিকভাবে প্রমাণিত শিক্ষণ
        </span>{" "}
        পদ্ধতি এবং শিশুদের বয়স অনুযায়ী উপযোগী শেখার কৌশল অনুসরণ করে
        পরিকল্পিতভাবে তৈরি করা হয়েছে।
      </p>
    ),
  },
  {
    id: 2,
    title: "Learning by doing",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_627_2931)">
          <path
            d="M22.6663 28V25.3333C22.6663 23.9188 22.1044 22.5623 21.1042 21.5621C20.1041 20.5619 18.7475 20 17.333 20H6.66634C5.25185 20 3.8953 20.5619 2.89511 21.5621C1.89491 22.5623 1.33301 23.9188 1.33301 25.3333V28"
            stroke="white"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.0003 14.6667C14.9458 14.6667 17.3337 12.2789 17.3337 9.33333C17.3337 6.38781 14.9458 4 12.0003 4C9.05481 4 6.66699 6.38781 6.66699 9.33333C6.66699 12.2789 9.05481 14.6667 12.0003 14.6667Z"
            stroke="white"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M30.667 28V25.3333C30.6661 24.1516 30.2728 23.0037 29.5488 22.0698C28.8248 21.1358 27.8112 20.4688 26.667 20.1733"
            stroke="white"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21.333 4.17334C22.4802 4.46707 23.4971 5.13427 24.2232 6.06975C24.9493 7.00523 25.3435 8.15578 25.3435 9.34001C25.3435 10.5242 24.9493 11.6748 24.2232 12.6103C23.4971 13.5457 22.4802 14.2129 21.333 14.5067"
            stroke="white"
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
    ),
    content: (
      <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
        সমগ্র বিশ্বজুড়ে সমাদৃত এবং পরীক্ষিত সবচেয়ে ইফেক্টিভ শেখার পদ্ধতি হচ্ছে{" "}
        <span className="text-[#FC7CB4] font-semibold">Learning by doing</span>{" "}
        - আমরা শুধু বইভিত্তিক জ্ঞানে সীমাবদ্ধ না রেখে বাচ্চাকে প্রয়োগিক
        শিক্ষায় উদ্বুদ্ধ করি
      </p>
    ),
  },
  {
    id: 3,
    title: "Guardian Counselling",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 12L16 2.66666L28 12V26.6667C28 27.3739 27.719 28.0522 27.219 28.5523C26.7189 29.0524 26.0406 29.3333 25.3333 29.3333H6.66667C5.95942 29.3333 5.28115 29.0524 4.78105 28.5523C4.28095 28.0522 4 27.3739 4 26.6667V12Z"
          stroke="white"
          strokeWidth="2.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 29.3333V16H20V29.3333"
          stroke="white"
          strokeWidth="2.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    content: (
      <div className="flex flex-col items-center text-center gap-6">
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
          সন্তানের অগ্রগতি গভীর থেকে বিস্তারিতভাবে বুঝতে পারা একজন অভিভাবকের
          জন্য খুবই জরুরি। যাতে সঠিক সময়ে সঠিক সিদ্ধান্ত নিতে পারে।
        </p>
        <div className="w-20 h-[1px] bg-gray-600"></div>
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
          আমরা Provide করি{" "}
          <span className="text-[#FC7CB4] font-semibold">
            1-1 Guardian Counselling
          </span>{" "}
          সেশন, যার বাচ্চার সার্বিক উন্নতি, দুর্বলতা এবং শক্তিশালী দিকগুলো
          সম্পর্কে অভিভাবককে বুঝতে সাহায্য করে।
        </p>
      </div>
    ),
    isSpecial: true,
  },
  {
    id: 4,
    title: "আগামীর চ্যাম্প",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.0003 2.66666L2.66699 9.33332L16.0003 16L29.3337 9.33332L16.0003 2.66666Z"
          stroke="white"
          strokeWidth="2.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.66699 22.6667L16.0003 29.3333L29.3337 22.6667"
          stroke="white"
          strokeWidth="2.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.66699 16L16.0003 22.6667L29.3337 16"
          stroke="white"
          strokeWidth="2.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    content: (
      <div className="flex flex-col items-center text-center">
        <h5 className="text-[#FC7CB4] font-semibold text-2xl md:text-3xl leading-10 mb-4">
          &ldquo;আমাদের অভিজ্ঞ মেন্টর বানায় আগামীর চ্যাম্প&ldquo;
        </h5>
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
          আমাদের অভিজ্ঞ শিক্ষকরা শুধু পড়ান না, তারা প্রতিটি শিশুর সুপ্ত মেধাকে
          দক্ষতায় রূপান্তর করেন। সঠিক দিকনির্দেশনা আর নিবিড় পরিচর্যায় আপনার
          সন্তান শিখবে জীবনের প্রতিটি ধাপে এগিয়ে থাকার কৌশল
        </p>
      </div>
    ),
  },
];

// Sub-component for individual cards
const Card = ({ index, total, scrollYProgress, data }) => {
  // 1. Overlapping Scroll Logic:
  // When the user scrolls from item i-1 to item i, we want item i to scale up.
  // Range covers: [Start of previous card, Center of this card, End of next card]
  const inputRange = [(index - 1) / total, index / total, (index + 1) / total];

  // 2. Smooth Animations
  const scale = useSpring(
    useTransform(scrollYProgress, inputRange, [0.85, 1, 0.85]),
    { mass: 0.5, damping: 15, restDelta: 0.001 },
  );

  const opacity = useTransform(scrollYProgress, inputRange, [0.5, 1, 0.5]);

  // Subtle vertical movement for parallax feel
  const y = useTransform(scrollYProgress, inputRange, [100, 0, -100]);

  // Z-index ensures the active card is on top
  // In React 18/19, we can use a style or simple logic, but here we pass it to style
  const zIndex = useTransform(scrollYProgress, inputRange, [0, 1, 0]);

  return (
    <motion.div
      style={{
        scale,
        opacity,
        y,
        zIndex, // Note: zIndex transform works, but sometimes needs integer mapping for perfect layering
      }}
      className="absolute inset-0 flex items-center justify-center p-6 md:p-12"
    >
      {/* The Card Itself */}
      <div
        className={`
          w-full h-full rounded-[40px] p-8 md:p-16 flex flex-col items-center justify-center text-center
          bg-[#1C1C1C] border border-white/10 shadow-2xl
          transition-colors duration-500
          ${data.isSpecial ? "border-[#FC7CB4]/30 shadow-[0_0_30px_rgba(252,124,180,0.2)]" : ""}
        `}
      >
        <div className="mb-8 p-4 rounded-full bg-white/5 backdrop-blur-sm shadow-inner">
          {data.icon}
        </div>
        <div className="max-w-2xl">{data.content}</div>
      </div>
    </motion.div>
  );
};

// Main Component
const ScrollAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative bg-black min-h-screen">
      {/* Tall container to provide scroll space */}
      <div className="h-[400vh]">
        {/* Sticky Wrapper */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="relative w-full h-full max-w-5xl mx-auto px-4 md:px-0">
            {/* We render the cards. 
                Since Framer Motion transforms handle visibility, we render all of them stacked.
                The z-index logic in the Card component handles the stacking order visually, 
                but for HTML stacking context, it's often easier to render them in reverse order 
                OR rely on the visual transform to be enough. 
                In this specific "Stacking Effect" design, standard DOM order is usually fine 
                because opacity handles the "disappearing" of the back layers.
            */}
            {stackData.map((item, index) => (
              <Card
                key={item.id}
                index={index}
                total={stackData.length}
                scrollYProgress={scrollYProgress}
                data={item}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollAnimation;
