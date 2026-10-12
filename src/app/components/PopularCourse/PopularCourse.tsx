"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import Button from "@/app/ui/button/Button";

const PopularCourse = () => {
  // 1. Get bilingual data from context
  const { featuresData } = useLanguage();
  const context = useLanguage();

  // Fallback values in case context is undefined
  const t = context?.t || {};
  const isBangla = context?.isBangla || false;

  // 2. Destructure specific fields for cleaner code
  const { titlePrefix, titleSuffix, cta } = featuresData;

  const displayCourses = featuresData.cards;

  return (
    <section className="px-4">
      {/* --- Heading Section --- */}
      <div className="text-center mb-12">
        <h2 className="text-secondary font-bold leading-auto tracking-[-5%] text-2xl md:text-5xl">
          {titlePrefix}{" "}
          <span className="relative inline-block px-3 md:py-3 py-1 group">
            {/* Dashed Border */}
            <span className="absolute inset-0 border-2 md:border-[3px] border-dashed border-pink-500"></span>

            {/* Corner Dots */}
            <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>

            <span className="text-primary ">{titleSuffix}</span>
          </span>
        </h2>
        <p className="text-[#3C4043] text-base leading-5 tracking-[-2%] mt-2">
          {featuresData.shortDescription}
        </p>
      </div>

      {/* --- Grid Section (Centered & Max 4 Cards) --- */}
      <div className="container mx-auto">
        {/* Flex wrapper to center the grid horizontally */}
        <div className="flex justify-center w-full">
          {/* Inline-grid allows the container to shrink to fit the content (1, 2, 3, or 4 cards) */}
          <div className="flex grid-cols-2 col-span-1-span-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8 ">
            {displayCourses.map((course) => {
              const linkHref = `${isBangla ? "/bn" : "/en"}/coursedetails`;

              return (
                <Link key={course.id} href={linkHref}>
                  <div className="relative w-77.75 h-88.75 rounded-[35px] bg-linear-to-b p-1 from-[#F3066EBF] to-white ">
                    {/* Inner White Content Area */}
                    <div className="bg-white rounded-4xl md:p-6 p-3 flex flex-col items-center h-full">
                      {/* Image Wrapper with Light Pink Background/Border */}
                      <div className="relative w-60.5 h-60.5 shadow-[0_4px_27px_4px_rgba(243,6,110,0.2)] aspect-square md:rounded-2xl rounded-3xl overflow-hidden bg-linear-to-b from-[#F3066E] to-[#FF8FCA] mt-5 md:mt-0">
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          className="object-cover w-60.5 h-60.5 p-0.5 rounded-[22px] md:rounded-2xl"
                        />
                      </div>

                      {/* Text Content */}
                      <div className="mt-6 text-center">
                        <h3 className="text-[#E91E63] tracking-[-2%] text-base md:text-[20px] font-semibold leading-tight">
                          {course.title}
                        </h3>
                        <p
                          className="text-gray-800 text-sm tracking-[-2%] md:text-sm font-semibold mt-1"
                          dangerouslySetInnerHTML={{ __html: course.subtitle }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mt-14">
        <Link href={`${isBangla ? "/bn/courses" : "/en/courses"}`}>
          <Button
            bgColor="#F3056D"
            darkShadowColor="#F3066E"
            highlightColor="#FF8FCA"
            hoverTextColor="#F3056D"
            px="px-[46px]"
            py="py-[10px]"
            iconPosition="right"
          >
            {cta}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default PopularCourse;