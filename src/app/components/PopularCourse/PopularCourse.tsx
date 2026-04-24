import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FaArrowRight, FaLongArrowAltRight } from "react-icons/fa";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import Button from "@/app/ui/button/Button";

// 1. Fake Data (Array of Objects)
const popularCourses = [
  {
    id: 1,
    title: "Kids Spoken English",
    subtitle: "For KG - Class 5",
    image: "/onorgol.png", // Your original image path
  },
  {
    id: 2,
    title: "Web Development",
    subtitle: "Beginner to Advanced",
    image: "/onorgol.png", // Replace with actual image path
  },
  {
    id: 3,
    title: "Graphic Design",
    subtitle: "Master Creative Skills",
    image: "/onorgol.png", // Replace with actual image path
  },
  {
    id: 4,
    title: "Graphic Design",
    subtitle: "Master Creative Skills",
    image: "/onorgol.png", // Replace with actual image path
  },
];

const PopularCourse = () => {
  return (
    <section className="px-4">
      {/* --- Heading Section --- */}
      <div className="text-center mb-12">
        <h2 className="text-secondary font-bold leading-auto tracking-[-5%] text-xl md:text-5xl">
          সেরা ও জনপ্রিয়{" "}
          <span className="relative inline-block px-3 py-3 group">
            {/* Dashed Border */}
            <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>

            {/* Corner Dots */}
            <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>

            {/* Gradient Text */}
            <span className="relativeChamps এর bg-linear-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent ">
              স্কিল প্রোগ্রামসমূহ
            </span>
          </span>
        </h2>
      </div>

      {/* --- Grid Section (1 Line 3 Cards) --- */}
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8">
          {popularCourses.map((course) => (
            <div
              key={course.id}
              className="relative  rounded-[35px] bg-linear-to-b p-1 from-[#F3066EBF] to-white w-full"
            >
              {/* Inner White Content Area */}
              <div className=" to-[] bg-white rounded-4xl md:p-6 p-3 flex flex-col items-center h-full">
                {/* Image Wrapper with Light Pink Background/Border */}
                <div className="relative shadow-[0_4px_27px_4px_rgba(243,6,110,0.2)] w-full aspect-square md:rounded-2xl rounded-3xl overflow-hidden bg-linear-to-b from-[#F3066E] to-[#FF8FCA]  ">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover p-0.5 rounded-2xl"
                  />
                </div>

                {/* Text Content */}
                <div className="mt-6 text-center">
                  <h3 className="text-[#E91E63] tracking-[-2%] text-base md:text-[20px] font-semibold leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-gray-800 text-sm tracking-[-2%] md:text-sm font-semibold mt-1">
                    {course.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center mt-14">
        {/* <button
          type="button"
          className="px-8 py-3 font-bold text-xl cursor-pointer rounded-xl text-white bg-primary flex items-center gap-2.5 shadow-[inset_0_4px_0_rgba(255,255,255,0.4)]"
        >
          আমাদের সকল স্কিলস
          <HiOutlineArrowLongRight className="w-6 h-6 -rotate-45" />
        </button> */}
        <Button
          bgColor="#F3056D"
          darkShadowColor="#F3066E"
          highlightColor="#FF8FCA"
          hoverTextColor="#F3056D"
          px="px-[46px]"
          py="py-[10px]"
          icon=<svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.3755 2.03125C11.3755 1.92351 11.3327 1.82017 11.2565 1.74399C11.1803 1.6678 11.077 1.625 10.9693 1.625H6.09426C5.98652 1.625 5.88319 1.6678 5.807 1.74399C5.73081 1.82017 5.68801 1.92351 5.68801 2.03125C5.68801 2.13899 5.73081 2.24233 5.807 2.31851C5.88319 2.3947 5.98652 2.4375 6.09426 2.4375H9.98858L1.74414 10.6811C1.70637 10.7189 1.6764 10.7637 1.65596 10.8131C1.63552 10.8624 1.625 10.9153 1.625 10.9687C1.625 11.0222 1.63552 11.0751 1.65596 11.1244C1.6764 11.1738 1.70637 11.2186 1.74414 11.2564C1.78191 11.2941 1.82675 11.3241 1.8761 11.3445C1.92545 11.365 1.97835 11.3755 2.03176 11.3755C2.08518 11.3755 2.13807 11.365 2.18742 11.3445C2.23678 11.3241 2.28162 11.2941 2.31939 11.2564L10.563 3.01194V6.90625C10.563 7.01399 10.6058 7.11733 10.682 7.19351C10.7582 7.2697 10.8615 7.3125 10.9693 7.3125C11.077 7.3125 11.1803 7.2697 11.2565 7.19351C11.3327 7.11733 11.3755 7.01399 11.3755 6.90625V2.03125Z"
              fill="white"
            />
          </svg>
          iconPosition="right"
        >
          আমাদের সকল স্কিলস
        </Button>
      </div>
    </section>
  );
};

export default PopularCourse;
