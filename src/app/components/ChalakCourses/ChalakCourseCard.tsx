"use client";

import React from "react";
import Image from "next/image";
import {
  Video,
  Calendar as CalendarIcon,
  Gift,
  Info,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Button from "@/app/ui/button/Button";
import EyeIcon from "./EyeIcon";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";

interface Course {
  _id: string;
  slug?: string;
  title: { en?: string; bn?: string } | string;
  thumbnail?: string;
  category?: string;
  price?: number;
  originalPrice?: number;
  content?: {
    quickInfo?: {
      items?: { en?: string[]; bn?: string[] };
    };
  };
}

interface ChalakCourseCardProps {
  course: Course;
  ctaCardLabel: string;
}

// Helper to fix missing protocol in R2 URLs
const fixImageUrl = (url: string | undefined): string => {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("//")
  ) {
    return url;
  }
  return `https://${url}`;
};

const ChalakCourseCard: React.FC<ChalakCourseCardProps> = ({
  course,
  ctaCardLabel,
}) => {
  const context = useLanguage();
  const isBangla = context?.isBangla || false;

  const title =
    typeof course.title === "string"
      ? course.title
      : course.title?.[isBangla ? "bn" : "en"] || course.title?.en || "";

  const items =
    course.content?.quickInfo?.items?.[isBangla ? "bn" : "en"] ||
    course.content?.quickInfo?.items?.en ||
    [];

  const getBadgeStyle = (text: string) => {
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes("live") ||
      lowerText.includes("লাইভ") ||
      lowerText.includes("recorded") ||
      lowerText.includes("রেকর্ডড")
    ) {
      return {
        icon: <Video size={12} />,
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-200",
      };
    }
    if (
      lowerText.includes("month") ||
      lowerText.includes("মাস") ||
      lowerText.includes("week") ||
      lowerText.includes("সপ্তাহ")
    ) {
      return {
        icon: <CalendarIcon size={12} />,
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
      };
    }
    if (lowerText.includes("free") || lowerText.includes("ফ্রি")) {
      return {
        icon: <Gift size={12} />,
        bg: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
      };
    }
    if (lowerText.includes("limited") || lowerText.includes("সীমিত")) {
      return {
        icon: <Info size={12} />,
        bg: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-200",
      };
    }
    return {
      icon: <CheckCircle size={12} />,
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-200",
    };
  };

  const imageUrl = fixImageUrl(course.thumbnail);

  return (
    <div className="min-w-[300px] w-[300px] md:min-w-[400px] md:w-[340px] snap-center bg-white rounded-[30px] border-2 border-[#FF8FCA] p-2 pb-5 shadow-xl flex flex-col items-center hover:-translate-y-2 transition-transform duration-300">
      {/* Image */}
      <div className="w-full aspect-video rounded-[25px] overflow-hidden relative mb-4 bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover object-bottom rounded-lg"
            unoptimized={true}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Video size={48} />
          </div>
        )}
      </div>

      {/* Highlights/Badges */}
      {items.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-3 w-full px-2">
          {items.slice(0, 4).map((tag, tagIdx) => {
            const style = getBadgeStyle(tag);
            return (
              <span
                key={tagIdx}
                className={`flex items-center gap-1 ${style.bg} ${style.text} text-[14px] px-3 leading-6 rounded-full border ${style.border}`}
              >
                {style.icon}
                {tag}
              </span>
            );
          })}
        </div>
      )}

      {/* Title */}
      <h3 className="text-[#3C4043] tracking-[0%] leading-[140%] font-semibold text-2xl mb-4 text-center px-2 line-clamp-2">
        {title}
      </h3>

      {/* Price Badge */}
      {course.price !== undefined && (
        <div className="flex items-center gap-2 mb-4">
          {course.originalPrice && course.originalPrice > course.price && (
            <span className="text-sm text-gray-400 line-through">
              ৳{course.originalPrice}
            </span>
          )}
          <span className="text-lg font-bold text-[#F3056D]">
            ৳{course.price}
          </span>
        </div>
      )}

      {/* CTA Button */}
      <Link
        href={`/${isBangla ? "bn" : "en"}/coursedetails/${course.slug || course._id}`}
      >
        <Button
          bgColor="#F3056D"
          highlightColor="#FF8FCA"
          darkShadowColor="#F3066E"
          textColor="white"
          hoverTextColor="#F3056D"
          textSize="24px"
          icon={<EyeIcon />}
          iconPosition="right"
          className="justify-center"
        >
          {ctaCardLabel}
        </Button>
      </Link>
    </div>
  );
};

export default ChalakCourseCard;
