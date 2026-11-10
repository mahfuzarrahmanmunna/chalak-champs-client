"use client";

import React, { useState, useEffect, useRef } from "react";
import { pushTrackingEvent } from "@/lib/trackingSettings";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Star,
  Users,
  X,
  LayoutGrid,
  ListChecks,
  HelpCircle,
  UserCheck,
  ChevronDown,
  MessageCircle,
  Home,
  Check,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Award,
  GraduationCap,
  Facebook,
  Linkedin,
  Youtube,
  UserCircle,
  Play,
  PlayCircle,
} from "lucide-react";
import { FaSadCry } from "react-icons/fa";

import { useLanguage } from "@/app/context/LanguageContext";
import Button from "@/app/ui/button/Button";
import { createEnrollment } from "@/app/services/enrollmentService";
import EnrollmentModal from "./EnrollmentModal";

import EnrollmentCard from "../../EnrollmentCard";
import EnrollmentSideSticky from "../../EnrollmentSideSticky";
import axiosInstance from "@/lib/axios";

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */
interface InstructorData {
  title?: string;
  name?: string;
  designation?: string;
  bio?: string;
  experience?: string;
  studentsCount?: number;
  rating?: number;
  specializations?: string[];
  achievements?: string[];
  education?: string;
  image?: string;
  social?: { facebook?: string; linkedin?: string; youtube?: string };
}

interface SingleCourse {
  slug?: string;
  breadcrumbs?: string;
  youtubeVideoUrl?: string;  // ✅ NEW
  hero: { title: string; subtitle: string };
  quickInfo: {
    title: string;
    items: string[];
    offerPrice: string;
    offerText: string;
    cta1: string;
    cta2: string;
    ctaBelow: string;
  };
  overview: { title: string; content: string };
  levels: {
    title: string;
    intro: string;
    level1: { title: string; for: string; intro: string; items: string[] };
    level2: { title: string; for: string; intro: string; items: string[] };
  };
  whoIsThisFor: {
    title: string;
    intro: string;
    items: string[];
    boldStatement: string;
  };
  features: { title: string; cards: Array<{ title: string; body: string }> };
  syllabus: { title: string; content: string };
  finalCta: {
    title: string;
    body: string;
    cta1: string;
    cta2: string;
    cta3: string;
    ctaBelow: string;
  };
  payment: { title: string; description: string };
  instructorsTitle: string;
  instructors: InstructorData[];
  instructor: InstructorData;
  review: { title: string };
  faq: { title: string; items: Array<{ q: string; a: string }> };
  mediaAssets: Array<{ type: "image" | "video"; src: string; poster?: string }>;
}

/* ═══════════════════════════════════════════════════
   DATA FLATTENER
   ═══════════════════════════════════════════════════ */
const getLang = (obj: any, lang: "en" | "bn"): string => {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] || "";
};

const fixUrl = (url: string | undefined): string => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};

const flattenCourseData = (
  apiData: any,
  isBangla: boolean,
): SingleCourse | null => {
  if (!apiData || !apiData.success) return null;

  const course = apiData.data;
  const lang = isBangla ? "bn" : "en";
  const c = course.content || {};

  const buildMediaAssets = (): Array<{
    type: "image" | "video";
    src: string;
    poster?: string;
  }> => {
    const contentAssets = c.mediaAssets || [];
    if (contentAssets.length > 0) {
      return contentAssets.map((a: any) => ({
        type: (a.type as "image" | "video") || "image",
        src: fixUrl(a.src),
        poster: a.poster,
      }));
    }
    const built: Array<{ type: "image" | "video"; src: string; poster?: string }> = [];
    if (course.thumbnail) built.push({ type: "image", src: fixUrl(course.thumbnail) });
    if (course.videoUrl) built.push({ type: "video", src: fixUrl(course.videoUrl) });
    return built;
  };

  const buildOfferPrice = (): string => {
    const quickPrice = getLang(c.quickInfo?.offerPrice, lang);
    if (quickPrice && quickPrice !== "0" && quickPrice.includes(" ")) return quickPrice;
    const orig = course.originalPrice || 0;
    const curr = course.price || 0;
    if (orig > 0 && curr > 0 && orig !== curr) return `৳${orig} ৳${curr}`;
    if (curr > 0) return `৳${curr}`;
    return quickPrice || "0";
  };

  const buildItems = (): string[] => {
    const contentItems = c.quickInfo?.items?.[lang] || [];
    if (contentItems.length > 0) return contentItems;
    return course.quickInfo?.items?.[lang] || [];
  };

  const getCta = (field: any, fallback: string): string => {
    const val = getLang(field, lang);
    return val && val !== "0" ? val : fallback;
  };

  const buildInstructors = (): InstructorData[] => {
    if (c.instructors && c.instructors.length > 0) {
      return c.instructors.map((inst: any) => ({
        title: getLang(inst.title, lang),
        name: inst.name || "",
        designation: getLang(inst.designation, lang),
        bio: getLang(inst.bio, lang),
        experience: getLang(inst.experience, lang),
        studentsCount: inst.studentsCount || 0,
        rating: inst.rating || 0,
        specializations: inst.specializations?.[lang] || [],
        achievements: inst.achievements?.[lang] || [],
        education: getLang(inst.education, lang),
        image: fixUrl(inst.image),
        social: inst.social || {},
      }));
    }
    if (c.instructor) {
      return [{
        title: getLang(c.instructor.title, lang),
        name: c.instructor.name || course.instructorName || "",
        designation: getLang(c.instructor.designation, lang),
        bio: getLang(c.instructor.bio, lang),
        experience: getLang(c.instructor.experience, lang),
        studentsCount: c.instructor.studentsCount || 0,
        rating: c.instructor.rating || 0,
        specializations: c.instructor.specializations?.[lang] || [],
        achievements: c.instructor.achievements?.[lang] || [],
        education: getLang(c.instructor.education, lang),
        image: fixUrl(c.instructor.image),
        social: c.instructor.social || {},
      }];
    }
    if (course.instructorName) return [{ name: course.instructorName }];
    return [];
  };

  const instructors = buildInstructors();

  return {
    slug: course.slug,
    breadcrumbs: getLang(c.breadcrumbs, lang) || getLang(c.breadcrumb, lang),
    youtubeVideoUrl: course.youtubeVideoUrl || "",  // ✅ NEW
    hero: {
      title: getLang(c.hero?.title, lang) || getLang(course.title, lang),
      subtitle: getLang(c.hero?.subtitle, lang) || getLang(course.heroSubtitle, lang),
    },
    quickInfo: {
      title: getLang(c.quickInfo?.title, lang) || getLang(course.quickInfo?.title, lang),
      items: buildItems(),
      offerPrice: buildOfferPrice(),
      offerText: getLang(c.quickInfo?.offerText, lang) || getLang(course.quickInfo?.offerText, lang),
      cta1: getCta(c.quickInfo?.cta1, "Enroll Now"),
      cta2: getCta(c.quickInfo?.cta2, "Book a Free Demo"),
      ctaBelow: getLang(c.quickInfo?.ctaBelow, lang) || getLang(course.quickInfo?.ctaBelow, lang),
    },
    overview: {
      title: getLang(c.overview?.title, lang) || getLang(course.title, lang),
      content: getLang(c.overview?.content, lang) || getLang(course.description, lang),
    },
    levels: {
      title: getLang(c.levels?.title, lang) || getLang(course.levels?.title, lang),
      intro: getLang(c.levels?.intro, lang) || getLang(course.levels?.intro, lang),
      level1: {
        title: getLang(c.levels?.level1?.title, lang) || getLang(course.levels?.level1?.title, lang),
        for: getLang(c.levels?.level1?.for, lang) || getLang(course.levels?.level1?.for, lang),
        intro: getLang(c.levels?.level1?.intro, lang) || getLang(course.levels?.level1?.intro, lang),
        items: c.levels?.level1?.items?.[lang] || course.levels?.level1?.items?.[lang] || [],
      },
      level2: {
        title: getLang(c.levels?.level2?.title, lang) || getLang(course.levels?.level2?.title, lang),
        for: getLang(c.levels?.level2?.for, lang) || getLang(course.levels?.level2?.for, lang),
        intro: getLang(c.levels?.level2?.intro, lang) || getLang(course.levels?.level2?.intro, lang),
        items: c.levels?.level2?.items?.[lang] || course.levels?.level2?.items?.[lang] || [],
      },
    },
    whoIsThisFor: {
      title: getLang(c.whoIsThisFor?.title, lang),
      intro: getLang(c.whoIsThisFor?.intro, lang),
      items: c.whoIsThisFor?.items?.[lang] || [],
      boldStatement: getLang(c.whoIsThisFor?.boldStatement, lang),
    },
    features: {
      title: getLang(c.features?.title, lang) || getLang(course.features?.title, lang),
      cards: (c.features?.cards?.length ? c.features.cards : course.features?.cards || []).map((card: any) => ({
        title: getLang(card?.title, lang),
        body: getLang(card?.body, lang),
      })),
    },
    syllabus: {
      title: getLang(c.syllabus?.title, lang),
      content: getLang(c.syllabus?.content, lang),
    },
    finalCta: {
      title: getLang(c.finalCta?.title, lang),
      body: getLang(c.finalCta?.body, lang),
      cta1: getCta(c.finalCta?.cta1, "Enroll Now"),
      cta2: getCta(c.finalCta?.cta2, "Book a Free Demo"),
      cta3: getLang(c.finalCta?.cta3, lang),
      ctaBelow: getLang(c.finalCta?.ctaBelow, lang),
    },
    payment: {
      title: getLang(c.payment?.title, lang),
      description: getLang(c.payment?.description, lang),
    },
    instructorsTitle: getLang(c.instructorsTitle, lang) || (isBangla ? "কোর্স ইন্সট্রাক্টর" : "Course Instructors"),
    instructors,
    instructor: instructors[0] || {},
    review: { title: getLang(c.review?.title, lang) },
    faq: {
      title: getLang(c.faq?.title, lang) || getLang(course.faqs?.title, lang),
      items: (c.faq?.items?.length ? c.faq.items : course.faqs?.items || []).map((item: any) => ({
        q: getLang(item?.q, lang),
        a: getLang(item?.a, lang),
      })),
    },
    mediaAssets: buildMediaAssets(),
  };
};

/* ═══════════════════════════════════════════════════
   ✅ NEW: YouTube Embed Component
   ═══════════════════════════════════════════════════ */
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&?\/\s]+)/,
    /youtube\.com\/watch\?.*v=([^&]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

function YouTubeEmbed({ url, title, isBangla }: { url: string; title?: string; isBangla?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [thumbSrc, setThumbSrc] = useState<string | null>(null);

  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  const thumbnail = thumbSrc ?? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative rounded-[28px] p-[3px] bg-gradient-to-br from-[#F3056D] via-[#a63bb0] to-[#214187] shadow-xl shadow-[#214187]/10">
      <div className="rounded-[25px] bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 md:px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#F3056D]/10 text-[#F3056D] flex items-center justify-center">
              <PlayCircle className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm md:text-base font-bold text-gray-900 leading-tight">
                {isBangla ? "কোর্স প্রিভিউ" : "Course Preview"}
              </p>
              {title && <p className="text-xs md:text-sm text-gray-500 truncate">{title}</p>}
            </div>
          </div>
          <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-[11px] md:text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
            <Youtube className="w-3.5 h-3.5" /> YouTube
          </span>
        </div>

        {/* Player */}
        <div className="relative w-full aspect-video bg-black">
          {playing ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={title || "Course Preview Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={isBangla ? "ভিডিও চালান" : "Play video"}
              className="group absolute inset-0 w-full h-full cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnail}
                alt={title || "Course preview"}
                loading="lazy"
                onLoad={(e) => {
                  // maxresdefault returns a 120px placeholder when missing
                  if (!thumbSrc && (e.currentTarget as HTMLImageElement).naturalWidth <= 120) {
                    setThumbSrc(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
                  }
                }}
                onError={() => setThumbSrc(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="relative flex items-center justify-center">
                  <span className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#F3056D]/40 animate-ping" />
                  <span className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#F3056D] text-white flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-7 h-7 md:w-9 md:h-9 ml-1" fill="currentColor" />
                  </span>
                </span>
              </span>
              <span className="absolute bottom-3 left-4 right-4 text-left text-white text-sm md:text-base font-semibold drop-shadow">
                {isBangla ? "ভিডিওটি দেখতে ক্লিক করুন" : "Click to watch the preview"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ✅ NEW: Quill HTML Content Renderer
   Renders rich-text HTML from the Quill editor (admin form)
   ═══════════════════════════════════════════════════ */
function QuillContent({ html, className = "" }: { html: string; className?: string }) {
  if (!html || html === "<p><br></p>") return null;
  return (
    <>
      <style jsx global>{`
        .quill-content { color: #374151; line-height: 1.7; font-size: 1.05rem; }
        .quill-content h1 { font-size: 1.75rem; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: #1f2937; }
        .quill-content h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: #1f2937; }
        .quill-content h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.25em; margin-bottom: 0.5em; color: #1f2937; }
        .quill-content p { margin-bottom: 1em; }
        .quill-content ul { list-style: disc; margin-left: 1.5em; margin-bottom: 1em; }
        .quill-content ol { list-style: decimal; margin-left: 1.5em; margin-bottom: 1em; }
        .quill-content li { margin-bottom: 0.5em; }
        .quill-content img { max-width: 100%; border-radius: 0.5rem; margin: 1em 0; }
        .quill-content a { color: #F3056D; text-decoration: underline; font-weight: 500; }
        .quill-content a:hover { color: #d9045c; }
        .quill-content table { width: 100%; border-collapse: collapse; margin: 1em 0; border-radius: 0.5rem; overflow: hidden; }
        .quill-content td, .quill-content th { border: 1px solid #e5e7eb; padding: 10px 12px; text-align: left; }
        .quill-content th { background: #f9fafb; font-weight: 600; }
        .quill-content blockquote { border-left: 4px solid #F3056D; padding: 0.75rem 1rem; margin: 1em 0; font-style: italic; color: #6b7280; background: #fdf2f8; border-radius: 0 0.5rem 0.5rem 0; }
        .quill-content pre { background: #f3f4f6; padding: 1em; border-radius: 0.5rem; overflow-x: auto; font-size: 0.875rem; margin: 1em 0; }
        .quill-content code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.875em; color: #F3056D; }
        .quill-content strong { font-weight: 700; color: #1f2937; }
        .quill-content em { font-style: italic; }
        .quill-content u { text-decoration: underline; }
        .quill-content s { text-decoration: line-through; }
        .quill-content hr { border: none; border-top: 2px solid #e5e7eb; margin: 2em 0; }
        .quill-content .ql-align-center { text-align: center; }
        .quill-content .ql-align-right { text-align: right; }
        .quill-content .ql-align-justify { text-align: justify; }
      `}</style>
      <div className={`quill-content ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SKELETON
   ═══════════════════════════════════════════════════ */
function Sk({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="skel-shine" />
    </div>
  );
}

function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen mt-12 text-gray-900 font-sans bg-[#FAFAFA] skel-root">
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Sk className="h-4 w-10 rounded" delay={0} />
            <Sk className="h-2.5 w-2.5 rounded-full" delay={40} />
            <Sk className="h-4 w-16 rounded" delay={80} />
            <Sk className="h-2.5 w-2.5 rounded-full" delay={120} />
            <Sk className="h-4 w-24 rounded" delay={160} />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-[65%] order-2 lg:order-1 space-y-10">
            <Sk className="w-full aspect-video rounded-[28px]" delay={0} />
            <Sk className="h-5 w-36 rounded" delay={0} />
            <div className="space-y-4">
              <Sk className="h-10 md:h-14 w-full rounded-xl" delay={60} />
              <Sk className="h-10 md:h-14 w-4/5 rounded-xl" delay={100} />
              <Sk className="h-6 w-full rounded-lg" delay={140} />
              <Sk className="h-6 w-5/6 rounded-lg" delay={180} />
            </div>
            <div className="md:hidden">
              <div className="w-full rounded-[30px] border-2 border-gray-200 p-2 pb-5 space-y-4">
                <Sk className="w-full aspect-video rounded-[25px]" delay={0} />
                <Sk className="h-12 w-40 mx-auto rounded-xl" delay={40} />
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/95 p-2 space-y-0">
              <div className="flex gap-2 overflow-hidden">
                <Sk className="h-10 w-28 rounded-xl flex-shrink-0" delay={0} />
                <Sk className="h-10 w-24 rounded-xl flex-shrink-0" delay={60} />
                <Sk className="h-10 w-32 rounded-xl flex-shrink-0" delay={120} />
                <Sk className="h-10 w-20 rounded-xl flex-shrink-0" delay={180} />
                <Sk className="h-10 w-16 rounded-xl flex-shrink-0" delay={240} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Sk className="h-8 w-1 rounded-full" delay={0} />
                <Sk className="h-8 w-48 rounded-lg" delay={40} />
              </div>
              <Sk className="h-44 w-full rounded-2xl" delay={80} />
            </div>
            <div className="w-full bg-gray-300 rounded-2xl p-6 md:p-8 space-y-5">
              <Sk className="h-7 w-48 rounded-lg !bg-gray-400" delay={0} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3 p-4 rounded-xl bg-gray-400/40">
                    <Sk className="h-10 w-10 rounded-xl !bg-gray-500" delay={i * 60} />
                    <Sk className="h-5 w-3/4 rounded !bg-gray-500" delay={i * 60 + 40} />
                    <Sk className="h-4 w-full rounded !bg-gray-500" delay={i * 60 + 80} />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 space-y-5">
              <Sk className="h-8 w-44 rounded-lg" delay={0} />
              <Sk className="h-5 w-full rounded" delay={40} />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Sk className="h-6 w-6 rounded-full flex-shrink-0" delay={i * 50} />
                  <Sk className="h-5 w-full rounded" delay={i * 50 + 30} />
                </div>
              ))}
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Sk className="h-8 w-1 rounded-full" delay={0} />
                <Sk className="h-8 w-52 rounded-lg" delay={40} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 space-y-4">
                  <Sk className="h-7 w-3/4 rounded-lg" delay={0} />
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Sk className="h-4 w-4 rounded flex-shrink-0" delay={i * 50} />
                      <Sk className="h-4 w-full rounded" delay={i * 50 + 30} />
                    </div>
                  ))}
                </div>
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 space-y-4">
                  <Sk className="h-7 w-3/4 rounded-lg" delay={20} />
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Sk className="h-4 w-4 rounded flex-shrink-0" delay={i * 50 + 20} />
                      <Sk className="h-4 w-full rounded" delay={i * 50 + 50} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Sk className="h-8 w-1 rounded-full" delay={0} />
                <Sk className="h-8 w-48 rounded-lg" delay={40} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[0, 1].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
                    <div className="flex items-center gap-4">
                      <Sk className="w-20 h-20 rounded-2xl flex-shrink-0" delay={i * 60} />
                      <div className="flex-1 space-y-2">
                        <Sk className="h-6 w-32 rounded-lg" delay={i * 60 + 20} />
                        <Sk className="h-4 w-24 rounded" delay={i * 60 + 40} />
                        <Sk className="h-4 w-16 rounded" delay={i * 60 + 60} />
                      </div>
                    </div>
                    <Sk className="h-4 w-full rounded" delay={i * 60 + 80} />
                    <Sk className="h-4 w-5/6 rounded" delay={i * 60 + 100} />
                    <div className="flex gap-2">
                      <Sk className="h-6 w-16 rounded-full" delay={i * 60 + 120} />
                      <Sk className="h-6 w-20 rounded-full" delay={i * 60 + 140} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-pink-50/30 p-6 md:p-10 rounded-[32px] border border-white/60 space-y-5">
              <div className="flex items-center gap-3">
                <Sk className="h-10 w-10 rounded-2xl" delay={0} />
                <Sk className="h-7 w-52 rounded-lg" delay={40} />
              </div>
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl border-2 border-gray-100 p-5 space-y-3">
                  <div className="flex items-center gap-4">
                    <Sk className="h-9 w-9 rounded-xl flex-shrink-0" delay={i * 80} />
                    <Sk className="h-5 w-3/4 rounded" delay={i * 80 + 30} />
                  </div>
                  <Sk className="h-4 w-2/3 rounded ml-[52px]" delay={i * 80 + 60} />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-[35%] order-1 mt-0 lg:order-2 space-y-6">
            <div className="hidden md:block">
              <div className="w-full rounded-[30px] border-2 border-gray-200 p-2 pb-5 space-y-4">
                <Sk className="w-full aspect-video rounded-[25px]" delay={0} />
                <div className="px-2 space-y-3">
                  <Sk className="h-7 w-3/4 rounded-lg" delay={40} />
                  <Sk className="h-12 w-full rounded-xl mx-auto" delay={40} />
                  <Sk className="h-10 w-full rounded-xl mx-auto !bg-gray-100" delay={60} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-300 rounded-3xl p-8 md:p-12 space-y-5 text-center">
          <Sk className="h-10 w-72 mx-auto rounded-xl !bg-gray-400" delay={0} />
          <div className="flex justify-center gap-4 pt-2">
            <Sk className="h-14 w-48 rounded-xl !bg-gray-400" delay={60} />
            <Sk className="h-14 w-40 rounded-xl !bg-gray-400" delay={100} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FAQ COMPONENT
   ═══════════════════════════════════════════════════ */
const FAQ = ({ faqs }: { faqs: Array<{ q: string; a: string }> }) => {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const { isBangla } = useLanguage();

  useEffect(() => {
    if (faqs.length > 0 && !activeFaq) setActiveFaq(faqs[0].q);
  }, [faqs]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-pink-50/30 p-6 md:p-10 rounded-[32px] border border-white/60 shadow-lg relative overflow-hidden">
      <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-pink-200/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-blue-200/20 rounded-full blur-2xl pointer-events-none" />
      <div className="relative z-10 flex items-center gap-3 mb-10">
        <div className="bg-white p-3 rounded-2xl shadow-sm text-[#F3056D] border border-pink-100">
          <MessageCircle className="h-6 w-6 fill-pink-50" strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          {isBangla ? "সাধারণ জিজ্ঞাসা" : "Frequently Asked Questions"}
        </h2>
      </div>
      <div className="relative z-10 space-y-4">
        {faqs.length > 0 ? (
          faqs.map((faq, idx) => {
            const isOpen = activeFaq === faq.q;
            return (
              <div key={idx} className={`bg-white rounded-2xl border-2 transition-all duration-300 group hover:shadow-xl ${isOpen ? "border-[#F3056D] shadow-md ring-4 ring-pink-50/50" : "border-gray-100 hover:border-pink-200"}`}>
                <button onClick={() => setActiveFaq(isOpen ? null : faq.q)} className="w-full flex items-center justify-between p-5 text-left focus:outline-none group/btn" aria-expanded={isOpen}>
                  <div className="flex items-center gap-4 flex-1">
                    <span className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm transition-all duration-300 transform group-hover/btn:scale-110 ${isOpen ? "bg-[#F3056D] text-white scale-110 rotate-3" : "bg-gray-100 text-gray-400 group-hover/btn:bg-pink-100 group-hover/btn:text-[#F3056D]"}`}>{idx + 1}</span>
                    <span className={`font-semibold text-base md:text-lg pr-4 leading-tight transition-colors ${isOpen ? "text-[#F3056D]" : "text-gray-700"}`}>{faq.q}</span>
                  </div>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-[#F3056D] text-white rotate-180" : "bg-gray-50 text-gray-400 group-hover/btn:bg-pink-100 group-hover/btn:text-[#F3056D]"}`}>
                    <ChevronDown className="w-5 h-5" strokeWidth={3} />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-0 overflow-hidden">
                    <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                      <div className="mt-4 pl-[52px] border-l-4 border-pink-100 text-gray-600 leading-7 text-base">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 bg-white/50 rounded-3xl border border-dashed border-gray-300 flex items-center justify-center gap-2">
            <p className="text-gray-500 font-medium text-lg">{isBangla ? "কোনো প্রশ্ন পাওয়া যায়নি" : "No Questions Found"}</p>
            <FaSadCry className="text-xl text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   FEATURES COMPONENT
   ═══════════════════════════════════════════════════ */
const CourseDecorate = ({ cards, title }: { cards: Array<{ title: string; body: string }>; title: string }) => (
  <section id="courseDecorator" className="w-full bg-[#214187] border-2 border-[#FF8FCA] rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
    <div className="container mx-auto max-w-6xl relative z-10">
      <div className="mb-6">
        <h2 className="font-bold text-xl md:text-2xl text-white tracking-wide">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {cards.map((feature, index) => (
          <div key={index} className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300">
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#F3056D] shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-200 transition-colors">{feature.title}</h3>
                <p className="text-gray-200 text-sm md:text-base leading-relaxed font-normal">{feature.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════
   MULTI-INSTRUCTOR SECTION
   ═══════════════════════════════════════════════════ */
const INSTRUCTOR_ACCENT_COLORS = [
  { border: "border-l-[#F3056D]", bg: "from-[#F3056D]/5", badge: "bg-[#F3056D]/10 text-[#F3056D]", gradient: "from-[#F3056D] to-[#d9045c]" },
  { border: "border-l-[#214187]", bg: "from-[#214187]/5", badge: "bg-[#214187]/10 text-[#214187]", gradient: "from-[#214187] to-[#1a2f6e]" },
  { border: "border-l-[#10B981]", bg: "from-[#10B981]/5", badge: "bg-[#10B981]/10 text-[#10B981]", gradient: "from-[#10B981] to-[#059669]" },
  { border: "border-l-[#F59E0B]", bg: "from-[#F59E0B]/5", badge: "bg-[#F59E0B]/10 text-[#F59E0B]", gradient: "from-[#F59E0B] to-[#D97706]" },
  { border: "border-l-[#8B5CF6]", bg: "from-[#8B5CF6]/5", badge: "bg-[#8B5CF6]/10 text-[#8B5CF6]", gradient: "from-[#8B5CF6] to-[#7C3AED]" },
  { border: "border-l-[#EC4899]", bg: "from-[#EC4899]/5", badge: "bg-[#EC4899]/10 text-[#EC4899]", gradient: "from-[#EC4899] to-[#DB2777]" },
];

function InstructorCard({ instructor, index, isBangla }: { instructor: InstructorData; index: number; isBangla: boolean }) {
  const colors = INSTRUCTOR_ACCENT_COLORS[index % INSTRUCTOR_ACCENT_COLORS.length];
  const [expanded, setExpanded] = useState(false);

  const hasDetails = instructor.bio || instructor.experience || instructor.education ||
    (instructor.specializations && instructor.specializations.length > 0) ||
    (instructor.achievements && instructor.achievements.length > 0);

  const hasSocial = instructor.social?.facebook || instructor.social?.linkedin || instructor.social?.youtube;

  return (
    <div className={`bg-white rounded-2xl border-2 border-gray-200 border-l-4 ${colors.border} overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group`}>
      <div className={`h-1 bg-gradient-to-r ${colors.gradient}`} />
      <div className="p-5 md:p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white/30 overflow-hidden group-hover:scale-[1.03] transition-transform duration-300`}>
            {instructor.image ? (
              <img src={instructor.image} alt={instructor.name || "Instructor"} className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="h-10 w-10 text-white/60" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate">{instructor.name || (isBangla ? "ইন্সট্রাক্টর" : "Instructor")}</h3>
            {instructor.designation && <p className="text-sm md:text-base text-[#F3056D] font-semibold mt-1">{instructor.designation}</p>}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {instructor.rating > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />{instructor.rating}
                </span>
              )}
              {instructor.studentsCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  <Users className="w-3 h-3" />{instructor.studentsCount.toLocaleString()} {isBangla ? "শিক্ষার্থী" : "students"}
                </span>
              )}
            </div>
          </div>
        </div>
        {instructor.bio && <p className="text-sm md:text-base text-gray-600 leading-relaxed">{instructor.bio}</p>}
        <div className="flex flex-wrap gap-2">
          {instructor.experience && (
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${colors.badge}`}>
              <Award className="w-3.5 h-3.5" />{instructor.experience}
            </span>
          )}
          {instructor.education && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
              <GraduationCap className="w-3.5 h-3.5" />{instructor.education.length > 35 ? instructor.education.substring(0, 35) + "..." : instructor.education}
            </span>
          )}
        </div>
        {hasDetails && (
          <div>
            <button type="button" onClick={() => setExpanded(!expanded)} className="text-xs font-bold text-[#214187] hover:text-[#F3056D] transition-colors flex items-center gap-1">
              {expanded ? (isBangla ? "কম দেখুন" : "Show Less") : (isBangla ? "আরও দেখুন" : "Show More")}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
            </button>
            {expanded && (
              <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
                {instructor.specializations && instructor.specializations.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{isBangla ? "বিশেষজ্ঞতা" : "Specializations"}</p>
                    <div className="flex flex-wrap gap-2">
                      {instructor.specializations.map((s, i) => <span key={i} className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors.badge}`}>{s}</span>)}
                    </div>
                  </div>
                )}
                {instructor.achievements && instructor.achievements.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{isBangla ? "অর্জনসমূহ" : "Achievements"}</p>
                    <ul className="space-y-1.5">
                      {instructor.achievements.map((a, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /><span>{a}</span></li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {hasSocial && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            {instructor.social?.facebook && <a href={instructor.social.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"><Facebook className="w-4 h-4" /></a>}
            {instructor.social?.linkedin && <a href={instructor.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center transition-colors"><Linkedin className="w-4 h-4" /></a>}
            {instructor.social?.youtube && <a href={instructor.social.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"><Youtube className="w-4 h-4" /></a>}
          </div>
        )}
      </div>
    </div>
  );
}

const InstructorsSection = ({ title, instructors }: { title: string; instructors: InstructorData[] }) => {
  const { isBangla } = useLanguage();
  const instructorRef = useRef<HTMLDivElement>(null);
  if (!instructors || instructors.length === 0) return null;
  return (
    <div ref={instructorRef} id="instructors" className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 rounded-full bg-[#F3056D]" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-[#F3056D]/10 text-[#F3056D]">
          <Users className="w-3.5 h-3.5" />{instructors.length} {instructors.length === 1 ? (isBangla ? "জন" : "Instructor") : (isBangla ? "জন" : "Instructors")}
        </span>
      </div>
      {instructors.length === 1 ? (
        <InstructorCard instructor={instructors[0]} index={0} isBangla={isBangla} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {instructors.map((inst, i) => <InstructorCard key={i} instructor={inst} index={i} isBangla={isBangla} />)}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   ERROR / NOT FOUND COMPONENTS
   ═══════════════════════════════════════════════════ */
function CourseNotFound({ isBangla, slug }: { isBangla: boolean; slug: string }) {
  const router = useRouter();
  return (
    <div className="min-h-screen mt-12 flex items-center justify-center bg-[#FAFAFA]">
      <div className="text-center px-6 max-w-lg">
        <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="h-10 w-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{isBangla ? "কোর্স পাওয়া যায়নি" : "Course Not Found"}</h1>
        <p className="text-gray-500 mb-8 text-[15px] leading-relaxed">{isBangla ? `"${slug}" স্লাগটির কোনো কোর্স খুঁজে পাওয়া যায়নি।` : `No course found with slug "${slug}".`}</p>
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 bg-[#214187] text-white font-bold text-[14px] hover:bg-[#1a2f6e] transition-colors shadow-lg">
          <ArrowLeft className="h-4 w-4" />{isBangla ? "ফিরে যান" : "Go Back"}
        </button>
      </div>
    </div>
  );
}

function CourseError({ isBangla, onRetry, isFetching }: { isBangla: boolean; onRetry: () => void; isFetching: boolean }) {
  return (
    <div className="min-h-screen mt-12 flex items-center justify-center bg-[#FAFAFA]">
      <div className="text-center px-6 max-w-lg">
        <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{isBangla ? "কোর্স লোড করতে সমস্যা হয়েছে" : "Failed to Load Course"}</h1>
        <p className="text-gray-500 mb-8 text-[15px] leading-relaxed">{isBangla ? "দুঃখিত, কোর্সের তথ্য লোড করতে সমস্যা হয়েছে।" : "Sorry, something went wrong while loading the course."}</p>
        <button onClick={onRetry} disabled={isFetching} className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 bg-[#214187] text-white font-bold text-[14px] hover:bg-[#1a2f6e] transition-colors shadow-lg disabled:opacity-60">
          {isFetching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}{isBangla ? "আবার চেষ্টা করুন" : "Try Again"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function CoursesDetails({
  slug,
  initialResponse,
}: {
  slug: string;
  // Raw API response fetched at build time (SSG). Rendered instantly, no spinner.
  initialResponse?: any;
}) {
  const router = useRouter();
  const { isBangla, getLink } = useLanguage();

  const { data: courseData, isLoading, isFetching, isError, refetch } = useQuery({
    // Raw API response is cached per slug (not per language), so switching
    // EN <-> BN is instant and never triggers a new network request.
    queryKey: ["course-detail", slug],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/courses/slug/${slug}`, { timeout: 10000 });
      return response.data;
    },
    select: (raw: any) => flattenCourseData(raw, isBangla),
    enabled: !!slug,
    // Build-time (SSG) data renders immediately with no skeleton.
    initialData: initialResponse?.data ? initialResponse : undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 500,
  });

  const data: SingleCourse | null = (courseData as SingleCourse | null | undefined) || null;
  const [activeTab, setActiveTab] = useState("overview");
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [showSideEnrollment, setShowSideEnrollment] = useState(false);

  const featuresRef = useRef<HTMLDivElement>(null);
  const whoIsThisForRef = useRef<HTMLDivElement>(null);
  const syllabusRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const enrollmentCardRef = useRef<HTMLDivElement>(null);
  const trackedCourseView = useRef<string | null>(null);

  useEffect(() => {
    if (!data || trackedCourseView.current === slug) return;
    if (pushTrackingEvent("course_view", { course_id: slug }, "analytics")) {
      trackedCourseView.current = slug;
    }
  }, [data, slug]);

  const sections = [
    { id: "overview", label: isBangla ? "বিবরণ" : "Description", icon: LayoutGrid },
    { id: "features", label: isBangla ? "ফিচার" : "Features", icon: ListChecks },
    { id: "whoIsThisFor", label: isBangla ? "এটি কাদের জন্য?" : "Who is this for?", icon: UserCheck },
    { id: "syllabus", label: isBangla ? "সিলেবাস" : "Syllabus", icon: BookOpen },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ];

  useEffect(() => {
    if (!data) return;
    const handleScroll = () => {
      setShowStickyCta(window.scrollY > 300);
      if (enrollmentCardRef.current) {
        const rect = enrollmentCardRef.current.getBoundingClientRect();
        setShowSideEnrollment(rect.bottom < 100);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data]);

  const scrollToSection = (id: string) => {
    const refs: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      overview: overviewRef, features: featuresRef, whoIsThisFor: whoIsThisForRef, syllabus: syllabusRef, faq: faqRef,
    };
    const ref = refs[id];
    if (ref?.current) ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleEnroll = () => {
    router.push(`/${isBangla ? "bn" : "en"}/checkout?course=${slug}`);
  };

  if (isLoading) return <CourseDetailSkeleton />;
  if (isError) return <CourseError isBangla={isBangla} onRetry={() => refetch()} isFetching={isFetching} />;
  if (!data) return <CourseNotFound isBangla={isBangla} slug={slug} />;

  const priceParts = data.quickInfo.offerPrice.split(" ");
  const displayPrice = priceParts.length > 2 ? `${priceParts[2]} ${priceParts[3]}` : data.quickInfo.offerPrice;
  const originalPrice = priceParts.length > 2 ? `${priceParts[0]} ${priceParts[1]}` : "";

  const breadcrumbItems = [
    { label: isBangla ? "হোম" : "Home", href: isBangla ? "/bn" : "/en", icon: Home },
    { label: isBangla ? "কোর্সসমূহ" : "Courses", href: getLink("/courses"), icon: null },
    { label: data.breadcrumbs || (isBangla ? "বিস্তারিত" : "Details"), href: null, icon: null },
  ];

  return (
    <div className="min-h-screen mt-12 text-gray-900 font-sans relative selection:bg-pink-100 selection:text-pink-900">
      {/* BREADCRUMB */}
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap gap-y-1">
              {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;
                return (
                  <li key={index} className="flex items-center">
                    {item.href ? (
                      <Link href={item.href} className="group flex items-center gap-1.5 text-sm md:text-[15px] font-medium text-gray-400 hover:text-[#F3056D] transition-all duration-200 px-2 py-1 rounded-lg hover:bg-pink-50/60">
                        {item.icon && <item.icon className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#F3056D] transition-colors duration-200" />}
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <span className="text-sm md:text-[15px] font-semibold text-gray-800 px-2 py-1 bg-gradient-to-r from-pink-50/80 to-blue-50/60 rounded-lg">{item.label}</span>
                    )}
                    {!isLast && <ChevronRight className="h-3.5 w-3.5 mx-0.5 text-gray-300/80 flex-shrink-0" strokeWidth={2.5} />}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      {/* HERO + MAIN */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:pt-4 md:pb-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* ── LEFT COLUMN ── */}
            <div className="w-full lg:w-[65%] order-2 lg:order-1">
              {/* ✅ YouTube preview — top of left column, right under the breadcrumb */}
              {data.youtubeVideoUrl && (
                <div className="mb-8 md:mb-10">
                  <YouTubeEmbed url={data.youtubeVideoUrl} title={data.hero.title} isBangla={isBangla} />
                </div>
              )}

              <div className="mb-10">
                <Link href={getLink("/courses")} className="inline-flex items-center text-sm md:text-base font-medium mb-4 text-gray-500 hover:text-[#F3056D] transition-colors group">
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  {isBangla ? "কোর্সে ফিরে যান" : "Back to Courses"}
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight tracking-tight">{data.hero.title}</h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">{data.hero.subtitle}</p>
              </div>

              <div className="md:hidden mb-6 block">
                <EnrollmentCard data={data} onEnroll={handleEnroll} mediaAssets={data.mediaAssets || []} />
              </div>

              {/* Sticky tab bar */}
              <div className="sticky top-28 md:top-18 lg:top-22 rounded-2xl z-30 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm mb-12 overflow-hidden">
                <nav className="flex space-x-1 md:space-x-2 overflow-x-auto no-scrollbar py-2 px-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button key={section.id} onClick={() => scrollToSection(section.id)} className={`py-2.5 px-4 md:px-5 rounded-xl font-medium text-sm md:text-base whitespace-nowrap transition-all duration-200 flex items-center ${activeTab === section.id ? "bg-[#214187] border-2 border-primary text-white shadow-md scale-[1.02]" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}>
                        <Icon className="h-4 w-4 mr-2" />{section.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* ── OVERVIEW ── ✅ QUILL CONTENT */}
              <div ref={overviewRef} id="overview" className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">{data.overview.title}</h2>
                <div className="bg-gray-50/50 p-6 md:p-8 rounded-2xl border border-gray-100">
                  <QuillContent html={data.overview.content} className="text-lg md:text-xl text-gray-700" />
                </div>
              </div>

              {/* ── FEATURES ── */}
              <div ref={featuresRef} id="features" className="scroll-mt-36 md:scroll-mt-40 mb-12">
                <CourseDecorate cards={data.features.cards} title={data.features.title} />
              </div>

              {/* ── WHO IS THIS FOR ── ✅ QUILL CONTENT for intro */}
              <div ref={whoIsThisForRef} id="whoIsThisFor" className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12">
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-6">{data.whoIsThisFor.title}</h3>
                  <QuillContent html={data.whoIsThisFor.intro} className="mb-6 text-lg text-gray-600" />
                  <ul className="space-y-4 mb-8">
                    {data.whoIsThisFor.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-base text-gray-700 group">
                        <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-[#214187]/5 p-4 rounded-xl border-l-4 border-[#F3056D]">
                    <p className="font-bold text-lg text-[#214187]">{data.whoIsThisFor.boldStatement}</p>
                  </div>
                </div>
              </div>

              {/* ── SYLLABUS ── ✅ QUILL CONTENT */}
              <div ref={syllabusRef} id="syllabus" className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">{data.syllabus.title}</h2>
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <QuillContent html={data.syllabus.content} className="text-base md:text-lg text-gray-700" />
                </div>

                {/* LEVELS */}
                <h2 className="text-2xl md:text-3xl font-bold mb-6 mt-12 text-gray-900 border-l-4 pl-4 border-[#F3056D]">{data.levels.title}</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-3xl">{data.levels.intro}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7EAFF] rounded-bl-full -mr-8 -mt-8 opacity-30 group-hover:opacity-50 transition-opacity" />
                    <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-3 relative z-10">{data.levels.level1.title}</h3>
                    <p className="text-base text-[#F3056D] font-semibold mb-4 relative z-10">{data.levels.level1.for}</p>
                    <p className="text-base text-gray-600 mb-6 relative z-10">{data.levels.level1.intro}</p>
                    <ul className="space-y-3 relative z-10">
                      {data.levels.level1.items.map((item, i) => <li key={i} className="flex items-start gap-2 text-base text-gray-700"><ChevronRight className="h-5 w-5 text-[#F3056D] mt-0.5 flex-shrink-0" />{item}</li>)}
                    </ul>
                  </div>
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD6F0] rounded-bl-full -mr-8 -mt-8 opacity-30 group-hover:opacity-50 transition-opacity" />
                    <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-3 relative z-10">{data.levels.level2.title}</h3>
                    <p className="text-base text-[#F3056D] font-semibold mb-4 relative z-10">{data.levels.level2.for}</p>
                    <p className="text-base text-gray-600 mb-6 relative z-10">{data.levels.level2.intro}</p>
                    <ul className="space-y-3 relative z-10">
                      {data.levels.level2.items.map((item, i) => <li key={i} className="flex items-start gap-2 text-base text-gray-700"><ChevronRight className="h-5 w-5 text-[#F3056D] mt-0.5 flex-shrink-0" />{item}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* ✅ INSTRUCTORS SECTION */}
              <InstructorsSection title={data.instructorsTitle} instructors={data.instructors} />

              {/* ── FAQ ── */}
              <div ref={faqRef} id="faq" className="scroll-mt-36 md:scroll-mt-40 mb-12">
                <FAQ faqs={data.faq.items} />
              </div>

              {/* ── PAYMENT ── ✅ QUILL CONTENT */}
              {data.payment.title && (
                <div className="scroll-mt-36 md:scroll-mt-40 mb-12">
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 border-l-4 pl-4 border-[#F3056D]">{data.payment.title}</h2>
                    <QuillContent html={data.payment.description} className="text-lg text-gray-600" />
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="w-full lg:w-[35%] order-1 mt-0 lg:order-2 space-y-6">
              <div className="hidden md:block" ref={enrollmentCardRef}>
                <EnrollmentCard data={data} onEnroll={handleEnroll} mediaAssets={data.mediaAssets || []} />
              </div>

              <div className="hidden md:block sticky top-28 z-30">
                <EnrollmentSideSticky onEnroll={handleEnroll} data={data} isVisible={showSideEnrollment} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-[#214187] to-[#1a2f6e] rounded-3xl p-8 md:p-14 space-y-6 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-[#F3056D]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-40px] left-[-40px] w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">{data.finalCta.title}</h2>
            <p className="text-lg md:text-xl text-blue-100/80 mb-4 max-w-3xl mx-auto leading-relaxed">{data.finalCta.body}</p>
            {data.finalCta.cta3 && <p className="text-base text-white/70 mb-8 flex items-center justify-center gap-2"><span>{data.finalCta.cta3}</span></p>}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <button onClick={handleEnroll} className="px-10 py-4 bg-[#F3056D] hover:bg-[#d9045c] text-white font-bold text-base md:text-lg rounded-xl shadow-lg shadow-[#F3056D]/30 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200">{data.finalCta.cta1 || (isBangla ? "এখনই ভর্তি হন" : "Enroll Now")}</button>
              {data.finalCta.cta2 && <button onClick={handleEnroll} className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-base md:text-lg rounded-xl border-2 border-white/20 hover:border-white/40 transition-all duration-200">{data.finalCta.cta2}</button>}
            </div>
            {data.finalCta.ctaBelow && <p className="text-sm text-white/50 mt-6">{data.finalCta.ctaBelow}</p>}
          </div>
        </div>
      </div>

      {/* ── STICKY BOTTOM CTA (mobile) ── */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-3 md:hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500">{isBangla ? "কোর্সের মূল্য" : "Course Price"}</p>
              <div className="flex items-center gap-2">
                {originalPrice && <span className="text-sm text-gray-400 line-through">{originalPrice}</span>}
                <span className="text-xl font-bold text-gray-900">{displayPrice}</span>
              </div>
            </div>
            <button onClick={handleEnroll} className="px-6 py-3 bg-[#F3056D] hover:bg-[#d9045c] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#F3056D]/20 transition-all active:scale-95">{isBangla ? "ভর্তি হন" : "Enroll Now"}</button>
          </div>
        </div>
      )}
    </div>
  );
}