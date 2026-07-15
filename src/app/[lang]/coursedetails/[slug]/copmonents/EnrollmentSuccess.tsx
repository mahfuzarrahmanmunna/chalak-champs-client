"use client";

import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import Button from "@/app/ui/button/Button";

interface EnrollmentSuccessProps {
  courseTitle: string;
  onClose: () => void;
}

export default function EnrollmentSuccess({
  courseTitle,
  onClose,
}: EnrollmentSuccessProps) {
  const { isBangla, getLink } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center animate-in zoom-in-95 fade-in duration-500">
      {/* Animated Check Circle */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center animate-in zoom-in-95 duration-500">
          <CheckCircle className="h-14 w-14 text-green-500" strokeWidth={1.5} />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#F3056D]/10 flex items-center justify-center animate-in zoom-in-95 fade-in duration-700">
          <Sparkles className="h-4 w-4 text-[#F3056D]" />
        </div>
        {/* Pulse ring */}
        <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-green-200 animate-ping opacity-30" />
      </div>

      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        {isBangla ? "সফলভাবে সম্পন্ন!" : "Successfully Completed!"}
      </h3>

      <p className="text-gray-500 text-[15px] leading-relaxed max-w-xs mb-2">
        {isBangla
          ? "আপনার এনরোলমেন্ট সফলভাবে জমা হয়েছে।"
          : "Your enrollment has been submitted successfully."}
      </p>

      <div className="bg-gray-50 rounded-xl px-4 py-2.5 mb-8 max-w-xs border border-gray-100">
        <p className="text-xs text-gray-400 font-medium mb-0.5">
          {isBangla ? "কোর্স" : "Course"}
        </p>
        <p className="text-sm font-bold text-gray-800 line-clamp-1">
          {courseTitle}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button
          onClick={onClose}
          bgColor="#214187"
          highlightColor="#3b5ec2"
          darkShadowColor="#1a2f6e"
          className="flex-1 py-3.5 text-[15px] flex items-center justify-center gap-2"
        >
          {isBangla ? "কোর্স দেখুন" : "View Course"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
