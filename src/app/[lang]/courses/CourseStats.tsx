"use client";

import { GraduationCap, Users, BookOpen, Zap } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

interface CourseStatsProps {
  totalCourses: number;
  studentsCount: number;
}

export default function CourseStats({
  totalCourses,
  studentsCount,
}: CourseStatsProps) {
  // UseInView to detect if the section is visible on screen
  // triggerOnce: false ensures it triggers EVERY TIME you scroll to it
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1, // Trigger when 10% of the component is visible
  });

  return (
    <section ref={ref} className="py-10 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* 1. Total Courses */}
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-3 bg-[#F3056D]/10 rounded-full mb-3 mx-auto w-fit">
              <GraduationCap className="w-6 h-6 text-[#F3056D]" />
            </div>
            <div className="text-center">
              {/* Added min-h-[2rem] to prevent layout shift when number is hidden */}
              <div className="text-2xl font-bold text-[#111827] min-h-[2rem]">
                {inView ? (
                  <CountUp end={totalCourses} duration={2} />
                ) : (
                  <span className="opacity-0">0</span>
                )}
                +
              </div>
              <div className="text-xs text-gray-500">কোর্সস</div>
            </div>
          </div>

          {/* 2. Total Students */}
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-3 bg-[#00477C]/10 rounded-full mb-3 mx-auto w-fit">
              <Users className="w-6 h-6 text-[#00477C]" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#111827] min-h-[2rem]">
                {inView ? (
                  <CountUp end={studentsCount} duration={2.5} />
                ) : (
                  <span className="opacity-0">0</span>
                )}
                +
              </div>
              <div className="text-xs text-gray-500">স্টুডেন্ট</div>
            </div>
          </div>

          {/* 3. 100% Satisfaction */}
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-3 bg-[#F3056D]/10 rounded-full mb-3 mx-auto w-fit">
              <Zap className="w-6 h-6 text-[#F3056D]" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#111827] min-h-[2rem]">
                {inView ? (
                  <CountUp end={100} duration={1.5} suffix="%" />
                ) : (
                  <span className="opacity-0">0</span>
                )}
              </div>
              <div className="text-xs text-gray-500">সন্তুষ্টি</div>
            </div>
          </div>

          {/* 4. Expert Teachers */}
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-3 bg-[#F3056D]/10 rounded-full mb-3 mx-auto w-fit">
              <BookOpen className="w-6 h-6 text-[#F3056D]" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#111827]">Expert</div>
              <span className="text-xs text-gray-500">টিম</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
