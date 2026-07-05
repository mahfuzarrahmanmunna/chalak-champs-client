"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  Users,
  Play,
  Calendar,
  Star,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Course } from "./types";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl hover:border-[#F3056D]/30 transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Section with Play Button Overlay */}
      <div className="relative h-56 bg-gray-100 w-full overflow-hidden">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-400">CC</span>
          </div>
        )}

        {course.installment && (
          <span
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm text-primary`}
          >
           {course.installment}
          </span>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
          <button className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 transition-colors transform hover:scale-110">
            <Play className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Header */}
        <div className="mb-4">
          <p className="text-sm font-medium text-[#00477C] mb-1 uppercase tracking-wide opacity-80">
            {course.subtitle}
          </p>
          <h3 className="text-xl font-bold text-[#111827] leading-tight group-hover:text-[#F3056D] transition-colors">
            {course.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 flex-grow">
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <Calendar className="w-4 h-4 text-[#00477C] flex-shrink-0 mt-0.5" />
            <span className="font-medium text-[#111827]">সময়কাল:</span>{" "}
            <span className="font-semibold">{course.duration}</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <Users className="w-4 h-4 text-[#00477C] flex-shrink-0 mt-0.5" />
            <span className="font-medium text-[#111827]">বয়স:</span>{" "}
            <span className="font-semibold">{course.age}</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <Clock className="w-4 h-4 text-[#00477C] flex-shrink-0 mt-0.5" />
            <span className="font-medium text-[#111827]">রুটিন:</span>{" "}
            <span className="font-semibold">{course.schedule}</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <Star className="w-4 h-4 text-[#00477C] flex-shrink-0 mt-0.5" />
            <span className="font-medium text-[#111827]">মোড:</span>{" "}
            <span className="font-semibold">{course.mode}</span>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 block">কোর্স ফি</span>
            <div className="text-lg font-bold text-[#111827]">{course.fee}</div>
            {/* {course.installment && (
              <span className="text-xs text-[#F3056D] block font-medium bg-[#F3056D]/10 px-2 py-0.5 rounded inline-block mt-1">
                {course.installment}
              </span>
            )} */}
          </div>

          <Link
            href={`/course-details/${course.id}`}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-lg 
            ${
              course.buttonText === "Demo Class" ||
              course.buttonText === "Start Free"
                ? "bg-white border border-[#F3056D] text-[#F3056D] hover:bg-[#F3056D] hover:text-white"
                : "bg-[#F3056D] text-white hover:bg-[#D6005C]"
            }`}
          >
            {course.buttonText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
