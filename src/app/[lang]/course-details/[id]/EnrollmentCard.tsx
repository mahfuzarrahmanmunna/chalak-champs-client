"use client";

import React from "react";
import { Award, AwardIcon, Download, Play, Video } from "lucide-react";
import Image from "next/image";
import Button from "@/app/ui/button/Button"; // Assuming path

interface CourseType {
  title: string;
  thumbnail: string;
  price: number;
  fee : number;
  installment?: string;
  originalPrice?: number;
  duration: string;
}

interface EnrollmentCardProps {
  course: CourseType;
  setShowEnrollmentModal: (value: boolean) => void;
}

const EnrollmentCard = ({
  course,
  setShowEnrollmentModal,
}: EnrollmentCardProps) => {
  console.log(course)
  return (
    <div className="w-full lg:w-[400px] flex-shrink-0">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="relative h-48 bg-gray-900 group cursor-pointer">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover opacity-80 group-hover:opacity-90 transition-opacity"
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all transform hover:scale-110">
              <Play className="h-6 w-6 text-white fill-white" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-end gap-3 mb-6">
            {course.originalPrice ? (
              <>
                <span className="text-3xl font-bold text-gray-900">
                  {course.fee} Tk
                </span>
                <span className="text-xl text-gray-400 line-through mb-1.5">
                  {course.originalPrice.toLocaleString()} Tk
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {course.price.toLocaleString()} Tk
              </span>
            )}
          </div>

          <Button
            className="w-full mb-5"
            onClick={() => setShowEnrollmentModal(true)}
            px="px-12"
            bgColor="#F3056D"
            highlightColor="#FF8FCA"
            darkShadowColor="#C6005F"
            textColor="white"
            hoverTextColor="#F3056D"
          >
            Enroll Now
          </Button>

          <div className="space-y-3 text-sm text-gray-600">
            <p className="font-bold text-gray-900 mb-2">
              This course includes:
            </p>
            {course.installment && (
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <AwardIcon
                  className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="leading-tight">{course.installment} </span>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Video className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <span>{course.duration} duration</span>
            </div>
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <span>Downloadable resources</span>
            </div>
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <span>Certificate of completion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentCard;
