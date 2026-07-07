"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Star,
  Users,
  LayoutGrid,
  ListChecks,
  HelpCircle,
  UserCheck,
  ChevronDown,
  MessageCircle,
  Home,
  BadgeCheck,
  Award,
  GraduationCap,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { FaSadCry } from "react-icons/fa";

import { useLanguage } from "@/app/context/LanguageContext";
import EnrollmentCard from "./EnrollmentCard";
import Button from "@/app/ui/button/Button";
import EnrollmentSideSticky from "./EnrollmentSideSticky";

// ─── Import the new multi-course JSON ───
import coursesDataBangla from "@/app/data/translations/singlecourse-bangla.json";
import coursesDataEnglish from "@/app/data/translations/singlecourse-english.json";
import EnrollmentModal from "./[slug]/copmonents/EnrollmentModal";

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */
interface InstructorData {
  title?: string;
  name?: string;
  designation?: string;
  bio?: string;
  info?: string;
  experience?: string;
  studentsCount?: number;
  rating?: number;
  specializations?: string[];
  achievements?: string[];
  education?: string;
  image?: string;
  social?: { facebook?: string; linkedin?: string };
}

interface SingleCourse {
  slug?: string;
  breadcrumb?: string;
  breadcrumbs?: string;
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
  instructor: InstructorData;
  review: { title: string };
  faq: { title: string; items: Array<{ q: string; a: string }> };
  mediaAssets: Array<{ type: string; src: string; poster?: string }>;
}

/* ═══════════════════════════════════════════════════
   FIND COURSE BY SLUG
   ═══════════════════════════════════════════════════ */
function findCourseBySlug(
  slug: string,
  isBangla: boolean,
): SingleCourse | null {
  const data = isBangla ? coursesDataBangla : coursesDataEnglish;

  // New format: { courses: [...] }
  if (data && "courses" in data && Array.isArray(data.courses)) {
    return data.courses.find((c: SingleCourse) => c.slug === slug) || null;
  }

  // Fallback: treat whole object as a single course
  if (data && "hero" in data && "quickInfo" in data) {
    return data as unknown as SingleCourse;
  }

  return null;
}

/* ═══════════════════════════════════════════════════
   FAQ
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
              <div
                key={idx}
                className={`bg-white rounded-2xl border-2 transition-all duration-300 group hover:shadow-xl ${
                  isOpen
                    ? "border-[#F3056D] shadow-md ring-4 ring-pink-50/50"
                    : "border-gray-100 hover:border-pink-200"
                }`}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : faq.q)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none group/btn"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span
                      className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm transition-all duration-300 transform group-hover/btn:scale-110 ${
                        isOpen
                          ? "bg-[#F3056D] text-white scale-110 rotate-3"
                          : "bg-gray-100 text-gray-400 group-hover/btn:bg-pink-100 group-hover/btn:text-[#F3056D]"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span
                      className={`font-semibold text-base md:text-lg pr-4 leading-tight transition-colors ${
                        isOpen ? "text-[#F3056D]" : "text-gray-700"
                      }`}
                    >
                      {faq.q}
                    </span>
                  </div>
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-[#F3056D] text-white rotate-180"
                        : "bg-gray-50 text-gray-400 group-hover/btn:bg-pink-100 group-hover/btn:text-[#F3056D]"
                    }`}
                  >
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
            <p className="text-gray-500 font-medium text-lg">
              {isBangla ? "কোনো প্রশ্ন পাওয়া যায়নি" : "No Questions Found"}
            </p>
            <FaSadCry className="text-xl text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   COURSE DECORATE
   ═══════════════════════════════════════════════════ */
const CourseDecorate = ({
  cards,
  title,
}: {
  cards: Array<{ title: string; body: string }>;
  title: string;
}) => (
  <section
    id="courseDecorator"
    className="w-full bg-[#214187] border-2 border-[#FF8FCA] rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl"
  >
    <div className="container mx-auto max-w-6xl relative z-10">
      <div className="mb-6">
        <h2 className="font-bold text-xl md:text-2xl text-white tracking-wide">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {cards.map((feature, index) => (
          <div
            key={index}
            className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
          >
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#F3056D] shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-200 text-sm md:text-base leading-relaxed font-normal">
                  {feature.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════
   INSTRUCTOR SECTION
   ═══════════════════════════════════════════════════ */
const InstructorSection = ({ instructor }: { instructor: InstructorData }) => {
  const { isBangla } = useLanguage();
  const hasDetailedInfo = !!(instructor.name || instructor.designation);

  return (
    <div className="scroll-mt-36 md:scroll-mt-40 mb-12">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-pink-100/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-blue-100/40 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 p-6 md:p-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[14px] font-semibold bg-[#F3056D]/10 text-[#F3056D] border border-[#F3056D]/20 mb-6">
            <Star className="h-3.5 w-3.5 fill-[#F3056D] text-[#F3056D]" />
            {instructor.title ||
              (isBangla ? "কোর্স ইন্সট্রাক্টর" : "Course Instructor")}
          </span>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative shrink-0">
              {instructor.image ? (
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-xl border-2 border-white/20">
                  <Image
                    src={instructor.image}
                    alt={instructor.name || "Instructor"}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-[#214187] to-[#1e3a8a] flex items-center justify-center shadow-xl border-2 border-white/20">
                  <Users className="h-12 w-12 text-white/70" />
                </div>
              )}
              {instructor.rating && (
                <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-white rounded-lg px-2.5 py-1.5 shadow-lg border border-gray-100">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-[13px] font-bold text-gray-900">
                    {instructor.rating}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                {instructor.name ||
                  (isBangla ? "বিশেষজ্ঞ প্রশিক্ষক" : "Expert Instructor")}
              </h3>
              {instructor.designation && (
                <p className="text-[14px] font-semibold text-[#F3056D] mb-3">
                  {instructor.designation}
                </p>
              )}
              <p className="text-[15px] text-gray-600 leading-relaxed mb-5">
                {instructor.bio ||
                  instructor.info ||
                  (isBangla
                    ? "অভিজ্ঞ প্রশিক্ষক দ্বারা ক্লাস পরিচালিত হয়।"
                    : "Classes are conducted by experienced instructors.")}
              </p>

              {hasDetailedInfo && (
                <div className="flex flex-wrap gap-3 mb-5">
                  {instructor.experience && (
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-2">
                      <Briefcase className="h-4 w-4 text-[#214187]" />
                      <div>
                        <p className="text-[11px] text-gray-400 font-medium leading-none">
                          {isBangla ? "অভিজ্ঞতা" : "Experience"}
                        </p>
                        <p className="text-[14px] font-bold text-gray-900 leading-tight mt-0.5">
                          {instructor.experience}
                        </p>
                      </div>
                    </div>
                  )}
                  {instructor.studentsCount && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3.5 py-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-[11px] text-gray-400 font-medium leading-none">
                          {isBangla ? "শিক্ষার্থী" : "Students"}
                        </p>
                        <p className="text-[14px] font-bold text-gray-900 leading-tight mt-0.5">
                          {instructor.studentsCount.toLocaleString()}+
                        </p>
                      </div>
                    </div>
                  )}
                  {instructor.education && (
                    <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-3.5 py-2">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                      <p className="text-[12px] font-semibold text-gray-700 leading-tight">
                        {instructor.education}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {instructor.specializations &&
                instructor.specializations.length > 0 && (
                  <div className="mb-5">
                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {isBangla ? "বিশেষজ্ঞতা" : "Specializations"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {instructor.specializations.map((spec, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] font-medium text-gray-700"
                        >
                          <BadgeCheck className="h-3 w-3 text-[#214187]" />
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {instructor.achievements &&
                instructor.achievements.length > 0 && (
                  <div className="mb-5">
                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                      {isBangla ? "অর্জনসমূহ" : "Achievements"}
                    </p>
                    <div className="space-y-2">
                      {instructor.achievements
                        .slice(0, 3)
                        .map((achievement, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <Award className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-[13px] text-gray-600 leading-relaxed">
                              {achievement}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {instructor.social && (
                <div className="flex items-center gap-3">
                  {instructor.social.facebook && (
                    <a
                      href={instructor.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg px-3 py-2 text-[12px] font-medium text-blue-600 transition-colors"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </a>
                  )}
                  {instructor.social.linkedin && (
                    <a
                      href={instructor.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg px-3 py-2 text-[12px] font-medium text-blue-700 transition-colors"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   404 — COURSE NOT FOUND
   ═══════════════════════════════════════════════════ */
function CourseNotFound({
  isBangla,
  slug,
}: {
  isBangla: boolean;
  slug: string;
}) {
  const router = useRouter();
  const allCourses = isBangla ? coursesDataBangla : coursesDataEnglish;
  const coursesList = "courses" in allCourses ? allCourses.courses : [];

  return (
    <div className="min-h-screen mt-12 flex items-center justify-center bg-[#FAFAFA]">
      <div className="text-center px-6 max-w-lg">
        <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="h-10 w-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {isBangla ? "কোর্স পাওয়া যায়নি" : "Course Not Found"}
        </h1>
        <p className="text-gray-500 mb-8 text-[15px] leading-relaxed">
          {isBangla
            ? `"${slug}" স্লাগটির কোনো কোর্স খুঁজে পাওয়া যায়নি।`
            : `No course found with slug "${slug}".`}
        </p>

        {coursesList.length > 0 && (
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {isBangla ? "উপলব্ধ কোর্সসমূহ" : "Available Courses"}
            </p>
            <div className="space-y-2">
              {coursesList.slice(0, 4).map((c: SingleCourse) => (
                <Link
                  key={c.slug}
                  href={`/${isBangla ? "bn" : "en"}/coursedetails/${c.slug}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-[#F3056D]/30 hover:shadow-md transition-all text-left group"
                >
                  <ChevronRight className="h-4 w-4 text-[#F3056D] rotate-90 group-hover:rotate-90 transition-transform" />
                  <span className="text-[14px] font-medium text-gray-700
                   group-hover:text-[#F3056D] transition-colors line-clamp-1">
                    {c.hero?.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 bg-[#214187] text-white font-bold text-[14px] hover:bg-[#1a2f6e] transition-colors shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          {isBangla ? "ফিরে যান" : "Go Back"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function CoursesDetails({ slug }: { slug: string }) {
  const router = useRouter();
  const { isBangla, getLink } = useLanguage();

  // ─── Find course by slug ───
  const data = useMemo(
    () => findCourseBySlug(slug, isBangla),
    [slug, isBangla],
  );

  const [activeTab, setActiveTab] = useState("overview");
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [showSideEnrollment, setShowSideEnrollment] = useState(false);

  const featuresRef = useRef<HTMLDivElement>(null);
  const whoIsThisForRef = useRef<HTMLDivElement>(null);
  const syllabusRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const sections = [
    {
      id: "overview",
      label: isBangla ? "বিবরণ" : "Description",
      icon: LayoutGrid,
    },
    {
      id: "features",
      label: isBangla ? "ফিচার" : "Features",
      icon: ListChecks,
    },
    {
      id: "whoIsThisFor",
      label: isBangla ? "এটি কাদের জন্য?" : "Who is this for?",
      icon: UserCheck,
    },
    {
      id: "syllabus",
      label: isBangla ? "সিলেবাস" : "Syllabus",
      icon: BookOpen,
    },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ];

  useEffect(() => {
    if (!data) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveTab(entry.target.id);
        });
      },
      { threshold: 0.3 },
    );
    const refs = [
      { current: overviewRef.current, id: "overview" },
      { current: featuresRef.current, id: "features" },
      { current: whoIsThisForRef.current, id: "whoIsThisFor" },
      { current: syllabusRef.current, id: "syllabus" },
      { current: faqRef.current, id: "faq" },
    ];
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    const handleScroll = () => {
      setShowStickyCta(window.scrollY > 300);
      setShowSideEnrollment(window.scrollY > 1500);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      refs.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
      window.removeEventListener("scroll", handleScroll);
    };
  }, [data]);

  const scrollToSection = (id: string) => {
    const refs: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      overview: overviewRef,
      features: featuresRef,
      whoIsThisFor: whoIsThisForRef,
      syllabus: syllabusRef,
      faq: faqRef,
    };
    const ref = refs[id];
    if (ref?.current)
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleEnroll = () => {
    setShowEnrollmentModal(true);
  };

  // ─── 404 ───
  if (!data) {
    return <CourseNotFound isBangla={isBangla} slug={slug} />;
  }

  // ─── Parsed values ───
  const priceParts = data.quickInfo.offerPrice.split(" ");
  const displayPrice =
    priceParts.length > 2
      ? `${priceParts[2]} ${priceParts[3]}`
      : data.quickInfo.offerPrice;

  const breadcrumbItems = [
    {
      label: isBangla ? "হোম" : "Home",
      href: isBangla ? "/bn" : "/en",
      icon: Home,
    },
    {
      label: isBangla ? "কোর্সসমূহ" : "Courses",
      href: getLink("/courses"),
      icon: null,
    },
    {
      label: data.breadcrumbs || (isBangla ? "বিস্তারিত" : "Details"),
      href: null,
      icon: null,
    },
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
                      <Link
                        href={item.href}
                        className="group flex items-center gap-1.5 text-sm md:text-[15px] font-medium text-gray-400 hover:text-[#F3056D] transition-all duration-200 px-2 py-1 rounded-lg hover:bg-pink-50/60"
                      >
                        {item.icon && (
                          <item.icon className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#F3056D] transition-colors duration-200" />
                        )}
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <span className="text-sm md:text-[15px] font-semibold text-gray-800 px-2 py-1 bg-gradient-to-r from-pink-50/80 to-blue-50/60 rounded-lg">
                        {item.label}
                      </span>
                    )}
                    {!isLast && (
                      <ChevronRight
                        className="h-3.5 w-3.5 mx-0.5 text-gray-300/80 flex-shrink-0"
                        strokeWidth={2.5}
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      {/* HERO + MAIN */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left */}
            <div className="w-full lg:w-[65%] order-2 lg:order-1">
              <div className="mb-10">
                <Link
                  href={getLink("/courses")}
                  className="inline-flex items-center text-sm md:text-base font-medium mb-4 text-gray-500 hover:text-[#F3056D] transition-colors group"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  {isBangla ? "কোর্সে ফিরে যান" : "Back to Courses"}
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight tracking-tight">
                  {data.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  {data.hero.subtitle}
                </p>
              </div>

              <div className="md:hidden mb-6 flex">
                <EnrollmentCard
                  data={data}
                  onEnroll={handleEnroll}
                  mediaAssets={data.mediaAssets || []}
                />
              </div>

              {/* Sticky Tabs */}
              <div className="sticky top-28 md:top-18 lg:top-22 rounded-2xl z-30 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm mb-12 overflow-hidden">
                <nav className="flex space-x-1 md:space-x-2 overflow-x-auto no-scrollbar py-2 px-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`py-2.5 px-4 md:px-5 rounded-xl font-medium text-sm md:text-base whitespace-nowrap transition-all duration-200 flex items-center ${
                          activeTab === section.id
                            ? "bg-[#214187] border-2 border-primary text-white shadow-md scale-[1.02]"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {section.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* 1. OVERVIEW */}
              <div
                ref={overviewRef}
                id="overview"
                className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">
                  {data.overview.title}
                </h2>
                <div className="bg-gray-50/50 p-6 md:p-8 rounded-2xl border border-gray-100">
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    {data.overview.content}
                  </p>
                </div>
              </div>

              {/* 2. FEATURES */}
              <div
                ref={featuresRef}
                id="features"
                className="scroll-mt-36 md:scroll-mt-40 mb-12"
              >
                <CourseDecorate
                  cards={data.features.cards}
                  title={data.features.title}
                />
              </div>

              {/* 3. WHO IS THIS FOR */}
              <div
                ref={whoIsThisForRef}
                id="whoIsThisFor"
                className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12"
              >
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-6">
                    {data.whoIsThisFor.title}
                  </h3>
                  <p className="mb-6 text-lg text-gray-600 leading-relaxed">
                    {data.whoIsThisFor.intro}
                  </p>
                  <ul className="space-y-4 mb-8">
                    {data.whoIsThisFor.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-base text-gray-700 group"
                      >
                        <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-[#214187]/5 p-4 rounded-xl border-l-4 border-[#F3056D]">
                    <p className="font-bold text-lg text-[#214187]">
                      {data.whoIsThisFor.boldStatement}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. SYLLABUS */}
              <div
                ref={syllabusRef}
                id="syllabus"
                className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">
                  {data.levels.title}
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-3xl">
                  {data.levels.intro}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7EAFF] rounded-bl-full -mr-8 -mt-8 opacity-30 group-hover:opacity-50 transition-opacity" />
                    <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-3 relative z-10">
                      {data.levels.level1.title}
                    </h3>
                    <p className="text-base text-[#F3056D] font-semibold mb-4 relative z-10">
                      {data.levels.level1.for}
                    </p>
                    <p className="text-base text-gray-600 mb-6 relative z-10">
                      {data.levels.level1.intro}
                    </p>
                    <ul className="space-y-3 relative z-10">
                      {data.levels.level1.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-base text-gray-700"
                        >
                          <ChevronRight className="h-5 w-5 text-[#F3056D] mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD0CD] rounded-bl-full -mr-8 -mt-8 opacity-30 group-hover:opacity-50 transition-opacity" />
                    <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-3 relative z-10">
                      {data.levels.level2.title}
                    </h3>
                    <p className="text-base text-[#214187] font-semibold mb-4 relative z-10">
                      {data.levels.level2.for}
                    </p>
                    <p className="text-base text-gray-600 mb-6 relative z-10">
                      {data.levels.level2.intro}
                    </p>
                    <ul className="space-y-3 relative z-10">
                      {data.levels.level2.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-base text-gray-700"
                        >
                          <ChevronRight className="h-5 w-5 text-[#214187] mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 5. INSTRUCTOR */}
              <InstructorSection instructor={data.instructor} />

              {/* 6. FAQ */}
              <div
                ref={faqRef}
                id="faq"
                className="scroll-mt-36 md:scroll-mt-40 mb-12"
              >
                <FAQ faqs={data.faq.items} />
              </div>
            </div>

            {/* Right */}
            <div className="w-full lg:w-[35%] order-1 mt-0 lg:order-2 space-y-6">
              <div className="hidden md:flex">
                <EnrollmentCard
                  data={data}
                  onEnroll={handleEnroll}
                  mediaAssets={data.mediaAssets || []}
                />
              </div>
              <div className="sticky hidden md:block top-28">
                <EnrollmentSideSticky
                  data={data}
                  onEnroll={handleEnroll}
                  isVisible={showSideEnrollment}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-[#214187] to-[#1e3a8a] p-8 md:p-12 rounded-3xl shadow-2xl border border-white/10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              {data.finalCta.title}
            </h2>
            <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              {data.finalCta.body}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleEnroll}
                bgColor="#F3056D"
                highlightColor="#FF8FCA"
                darkShadowColor="#C6005F"
                className="w-full sm:w-auto text-lg py-4"
                px="px-10"
              >
                {data.finalCta.cta1}
              </Button>
              <div className="text-gray-300 font-medium flex items-center gap-2">
                <span>{data.finalCta.cta3}</span>
              </div>
            </div>
            <p className="mt-6 text-base text-gray-300 font-medium bg-white/10 inline-block px-4 py-1.5 rounded-full">
              {data.finalCta.ctaBelow}
            </p>
          </div>
        </div>
      </div>

      {/* STICKY MOBILE CTA */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-[60] lg:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                {isBangla ? "মূল্য" : "Price"}
              </span>
              <span className="text-2xl font-bold text-gray-900 leading-none mt-1">
                {displayPrice}
              </span>
            </div>
            <Button
              onClick={handleEnroll}
              className="flex-1 py-3.5 text-lg"
              px="px-6"
            >
              {data.quickInfo.cta1}
            </Button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          ENROLLMENT MODAL
          ═══════════════════════════════════════════════════ */}
      <EnrollmentModal
        isOpen={showEnrollmentModal}
        onClose={() => setShowEnrollmentModal(false)}
        slug={slug}
        courseTitle={data.hero.title}
        amount={data.quickInfo.offerPrice}
      />
    </div>
  );
}
