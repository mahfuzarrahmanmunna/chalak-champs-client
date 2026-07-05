"use client";

import React from "react";
import Image from "next/image";
import { GraduationCap, Award } from "lucide-react";
import Button from "@/app/ui/button/Button";
import { useLanguage } from "@/app/context/LanguageContext";

// Define interface for Instructor Data
interface Instructor {
  id: string | number;
  image: string;
  name: string;
  role: string;
  description: string;
}

interface InstructorCardProps {
  instructor: Instructor;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor }) => {
  const { isBangla } = useLanguage();

  return (
    <div className="min-w-[300px] w-[300px] md:min-w-[400px] md:w-[340px] snap-center bg-white rounded-[30px] border-2 border-[#FF8FCA] p-2 pb-5 shadow-xl flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 h-full">
      {/* Image */}
      <div className="w-full aspect-square rounded-[25px] overflow-hidden relative mb-4 bg-gray-50">
        <Image
          src={instructor.image}
          alt={instructor.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Role Badge (Replacing Highlights) */}
      <div className="flex flex-wrap justify-center gap-2 mb-3 w-full px-2">
        <span className="flex items-center gap-1 bg-blue-50 text-blue-600 text-[14px] px-3 leading-6 rounded-full border border-blue-200">
          <GraduationCap size={12} />
          {instructor.role}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-[#3C4043] tracking-[0%] leading-[140%] font-bold text-2xl mb-4 text-center px-2">
        {instructor.name}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6 px-4 text-center line-clamp-4 flex-grow">
        {instructor.description}
      </p>

      {/* CTA Button */}
      {/* Note: Linking to # as there is no individual profile page requested yet */}
      <Button
        bgColor="#F3056D"
        highlightColor="#FF8FCA"
        darkShadowColor="#F3066E"
        textColor="white"
        hoverTextColor="#F3056D"
        textSize="24px"
        icon={<Award size={20} />}
        iconPosition="right"
        className="justify-center w-full"
      >
        {isBangla ? "বিস্তারিত" : "View Profile"}
      </Button>
    </div>
  );
};

export default InstructorCard;
