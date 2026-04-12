import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FaArrowRight, FaLongArrowAltRight } from "react-icons/fa";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

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
];

const PopularCourse = () => {
  return (
    <section
      style={{ backgroundColor: "var(--color-background)" }}
      className="px-4"
    >
      {/* --- Heading Section --- */}
      <div className="text-center mb-12">
        <h2 className="text-secondary font-bold text-xl md:text-3xl">
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
            <span className="relative font-bold bg-linear-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent ">
              স্কিল প্রোগ্রামসমূহ
            </span>
          </span>
        </h2>
      </div>

      {/* --- Grid Section (1 Line 3 Cards) --- */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularCourses.map((course) => (
            <div
              key={course.id}
              className="relative  rounded-[35px] bg-linear-to-b p-1 from-[#F3066EBF] to-white w-full"
            >
              {/* Inner White Content Area */}
              <div className=" to-[] bg-white rounded-4xl p-6 flex flex-col items-center h-full">
                {/* Image Wrapper with Light Pink Background/Border */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-linear-to-b from-[#F3066E] to-[#FF8FCA]  ">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover p-0.5 rounded-2xl"
                  />
                </div>

                {/* Text Content */}
                <div className="mt-6 text-center">
                  <h3 className="text-[#E91E63] text-[26px] font-extrabold leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-gray-800 text-lg font-semibold mt-1">
                    {course.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center mt-14">
        <button
          type="button"
          className="px-8 py-3 font-bold text-xl cursor-pointer rounded-xl text-white bg-primary flex items-center gap-2.5 shadow-[inset_0_4px_0_rgba(255,255,255,0.4)]"
        >
          আমাদের সকল স্কিলস
          <HiOutlineArrowLongRight className="w-6 h-6 -rotate-45" />
        </button>
      </div>
    </section>
  );
};

export default PopularCourse;
