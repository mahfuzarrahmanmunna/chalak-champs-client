"use client";

import React from "react";
import Image from "next/image";
import { Linkedin, Twitter, Mail, Globe } from "lucide-react";

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

const InstructorCardModern: React.FC<InstructorCardProps> = ({
  instructor,
}) => {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center text-center h-full relative overflow-hidden">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F3056D] to-[#214187] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Circular Avatar */}
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#F3056D] to-[#FF8FCA]">
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative">
            <Image
              src={instructor.image}
              alt={instructor.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Name */}
      <h3 className="text-xl font-bold text-gray-900 mb-1">
        {instructor.name}
      </h3>

      {/* Role */}
      <p className="text-sm font-semibold text-[#F3056D] uppercase tracking-wider mb-4">
        {instructor.role}
      </p>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow">
        {instructor.description}
      </p>

      {/* Social Icons */}
      <div className="flex items-center justify-center gap-4 w-full pt-4 border-t border-gray-50">
        <a
          href="#"
          className="text-gray-400 hover:text-[#0077b5] transition-colors"
        >
          <Linkedin size={18} strokeWidth={2} />
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-black transition-colors"
        >
          <Twitter size={18} strokeWidth={2} />
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-[#F3056D] transition-colors"
        >
          <Mail size={18} strokeWidth={2} />
        </a>
      </div>
    </div>
  );
};

export default InstructorCardModern;
