import React from "react";
import { Check, Tag } from "lucide-react";
import Button from "@/app/ui/button/Button";

// --- Props Interface ---
interface Enrollment2Props {
  data: any; // Your SingleCourseData
  onEnroll: () => void;
}

const Enrollment2 = ({ data, onEnroll }: Enrollment2Props) => {
  // --- Price Parsing ---
  const parts = data.quickInfo.offerPrice.split(" ");
  const originalPrice = parts.length > 2 ? `${parts[0]} ${parts[1]}` : null;
  const currentPrice =
    parts.length > 2 ? `${parts[2]} ${parts[3]}` : data.quickInfo.offerPrice;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* --- HEADER / TAG --- */}
      <div className="bg-pink-50/50 px-6 py-3 border-b border-gray-100 flex items-center gap-2">
        <Tag className="h-4 w-4 text-[#F3056D]" />
        <span className="text-sm font-semibold text-gray-700">
          {data.quickInfo.title}
        </span>
      </div>

      {/* --- CARD CONTENT --- */}
      <div className="p-6">
        {/* Price Section */}
        <div className="mb-6">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {currentPrice}
            </span>
            {originalPrice && (
              <span className="text-xl text-gray-400 line-through font-medium">
                {originalPrice}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 inline-block">
            {data.quickInfo.offerText}
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col gap-3 mb-8">
          {/* Primary CTA */}
          <Button
            onClick={onEnroll}
            bgColor="#F3056D"
            darkShadowColor="#F3066E"
            highlightColor="#FF8FCA"
            hoverTextColor="#F3056D"
            className="w-full py-3.5 rounded-lg text-white font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            {data.quickInfo.cta1}
          </Button>

          {/* Secondary CTA */}
          <Button
            bgColor="#ffffff"
            darkShadowColor="#F3066E"
            highlightColor="#FF8FCA"
            hoverTextColor="#ffffff"
            textColor="#F3056D"
            hoverBgColor="#F3056D"
            onClick={onEnroll}
            className="border border-[#F3056D]"
          >
            {data.quickInfo.cta2}
          </Button>
        </div>

        {/* Checklist Section */}
        <div className="space-y-3 text-sm text-gray-700">
          {data.quickInfo.items.map((item: string, idx: number) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="mt-0.5 flex-shrink-0 bg-pink-100 rounded-full p-1">
                <Check size={14} className="text-[#F3056D]" />
              </div>
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Enrollment2;
