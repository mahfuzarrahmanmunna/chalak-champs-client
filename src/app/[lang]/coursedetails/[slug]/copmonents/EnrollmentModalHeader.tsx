"use client";

import { X, BookOpen } from "lucide-react";

interface EnrollmentModalHeaderProps {
  courseTitle: string;
  onClose: () => void;
}

export default function EnrollmentModalHeader({
  courseTitle,
  onClose,
}: EnrollmentModalHeaderProps) {
  return (
    <div className="relative bg-gradient-to-br from-[#214187] to-[#1a2f6e] px-6 py-5 text-white overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-pink-500/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-blue-300 mb-1">
              Enrollment
            </p>
            <h2 className="text-base md:text-lg font-bold leading-snug line-clamp-2">
              {courseTitle}
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors flex-shrink-0 group"
          aria-label="Close modal"
        >
          <X className="h-4.5 w-4.5 text-white/80 group-hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  );
}
