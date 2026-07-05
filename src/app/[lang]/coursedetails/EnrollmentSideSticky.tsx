"use client";

import React from "react";
import {
  // --- COLORFUL ICONS ---
  Video,
  Layers,
  Globe,
  GraduationCap,
  Users,
  Clock,
  Calendar,
  FileText,
  Palette,
  Award,
  Mic,
} from "lucide-react";
import Button from "@/app/ui/button/Button";

// --- Props Interface ---
interface EnrollmentSideStickyProps {
  data: any; // Your SingleCourseData
  onEnroll: () => void;
  isVisible: boolean; // Controlled by parent scroll logic
}

const EnrollmentSideSticky = ({
  data,
  onEnroll,
  isVisible,
}: EnrollmentSideStickyProps) => {
  // --- Price Parsing ---
  const parts = data.quickInfo.offerPrice.split(" ");
  const originalPrice = parts.length > 2 ? `${parts[0]} ${parts[1]}` : null;
  const currentPrice =
    parts.length > 2 ? `${parts[2]} ${parts[3]}` : data.quickInfo.offerPrice;

  // --- ICON & COLOR CONFIGURATION ---
  // Maps specific index to a unique icon and a light background color
  const iconConfig = [
    { Icon: Video, color: "text-red-500", bg: "bg-red-50" }, // 64 Classes
    { Icon: Layers, color: "text-blue-500", bg: "bg-blue-50" }, // 2 Levels
    { Icon: Globe, color: "text-green-500", bg: "bg-green-50" }, // Online Batch
    { Icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-50" }, // Class 1-8
    { Icon: Users, color: "text-orange-500", bg: "bg-orange-50" }, // Total Enrolled
    { Icon: Clock, color: "text-cyan-500", bg: "bg-cyan-50" }, // Time Required
    { Icon: Calendar, color: "text-indigo-500", bg: "bg-indigo-50" }, // 3 Days/Week
    { Icon: FileText, color: "text-yellow-600", bg: "bg-yellow-50" }, // PDF
    { Icon: Palette, color: "text-pink-500", bg: "bg-pink-50" }, // Colorful Materials
    { Icon: Award, color: "text-amber-500", bg: "bg-amber-50" }, // Certificate
    { Icon: Mic, color: "text-emerald-500", bg: "bg-emerald-50" }, // EFT Test
  ];

  // Helper to get config with fallback
  const getConfig = (idx: number) => {
    return iconConfig[idx % iconConfig.length];
  };

  return (
    <div
      className={`
        transition-all duration-700 ease-out transform
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"}
      `}
    >
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        {/* --- HEADER / PRICE SECTION --- */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">
              {currentPrice}
            </span>
            {originalPrice && (
              <span className="text-lg text-gray-400 line-through mb-1.5">
                {originalPrice}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {data.quickInfo.offerText}
          </div>
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="p-4 bg-white flex flex-col gap-2 border-b border-gray-100">
          <Button
            onClick={onEnroll}
            bgColor="#F3056D"
            darkShadowColor="#F3066E"
            highlightColor="#FF8FCA"
            hoverTextColor="#F3056D"
            className="w-full py-2.5 rounded-lg text-white font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-95 bg-[#F3056D]"
          >
            {data.quickInfo.cta1}
          </Button>

          <Button
            bgColor="#ffffff"
            darkShadowColor="#F3066E"
            highlightColor="#FF8FCA"
            hoverTextColor="#ffffff"
            textColor="#F3056D"
            hoverBgColor="#F3056D"
            onClick={onEnroll}
            className="text-sm py-2"
          >
            {data.quickInfo.cta2}
          </Button>
        </div>

        {/* --- FULL LIST SECTION (SCROLLABLE) --- */}
        <div className="p-5 max-h-[500px] overflow-y-auto custom-scrollbar">
          <p className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide opacity-80">
            {data.quickInfo.title}
          </p>

          <div className="space-y-0.5">
            {data.quickInfo.items.map((item: string, idx: number) => {
              const { Icon, color, bg } = getConfig(idx);
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  {/* Colorful Icon Container */}
                  <span className="mt-0.5 flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${bg} ${color}`}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </div>
                  </span>
                  <span className="text-sm text-gray-700 leading-relaxed pt-1.5">
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- FOOTER NOTE --- */}
        <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-100">
          <p className="text-xs text-gray-500">{data.quickInfo.ctaBelow}</p>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentSideSticky;
