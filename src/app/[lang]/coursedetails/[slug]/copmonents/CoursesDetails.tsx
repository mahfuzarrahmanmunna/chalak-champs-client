"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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
  
  // ✅ FIX: Explicit union type to match EnrollmentCard
  mediaAssets: Array<{ type: "image" | "video"; src: string; poster?: string }>; 
}

/* ═══════════════════════════════════════════════════
   DATA FLATTENER 
   Transforms Backend API {en, bn} objects into flat strings
   ═══════════════════════════════════════════════════ */
const getLang = (obj: any, lang: "en" | "bn"): string => {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] || "";
};

const flattenCourseData = (apiData: any, isBangla: boolean): SingleCourse | null => {
  if (!apiData || !apiData.success) return null;
  
  const course = apiData.data;
  const lang = isBangla ? "bn" : "en";
  const c = course.content || {};

  // ✅ Build mediaAssets from thumbnail + videoUrl if content.mediaAssets is empty
  const buildMediaAssets = (): Array<{ type: "image" | "video"; src: string; poster?: string }> => {
    const contentAssets = c.mediaAssets || [];
    if (contentAssets.length > 0) {
      return contentAssets.map((a: any) => ({
        type: (a.type as "image" | "video") || "image",
        src: a.src.startsWith("http") ? a.src : `https://${a.src}`,
        poster: a.poster,
      }));
    }

    // Fallback: build from root-level thumbnail + videoUrl
    const built: Array<{ type: "image" | "video"; src: string; poster?: string }> = [];
    
    if (course.thumbnail) {
      const thumbSrc = course.thumbnail.startsWith("http") 
        ? course.thumbnail 
        : `https://${course.thumbnail}`;
      built.push({ type: "image", src: thumbSrc });
    }
    
    if (course.videoUrl) {
      built.push({ type: "video", src: course.videoUrl });
    }
    
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

  // ✅ Build items - check both nested and root locations
  const buildItems = (): string[] => {
    const contentItems = c.quickInfo?.items?.[lang] || [];
    if (contentItems.length > 0) return contentItems;
    return course.quickInfo?.items?.[lang] || [];
  };

  // ✅ Helper to skip "0" placeholders
  const getCta = (field: any, fallback: string): string => {
    const val = getLang(field, lang);
    return (val && val !== "0") ? val : fallback;
  };

  // ✅ FIX: The complete return statement that was missing
  return {
    slug: course.slug,
    breadcrumbs: getLang(c.breadcrumbs, lang) || getLang(c.breadcrumb, lang),
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
    instructor: {
      title: getLang(c.instructor?.title, lang),
      name: c.instructor?.name || course.instructorName || "",
      designation: getLang(c.instructor?.designation, lang),
      bio: getLang(c.instructor?.bio, lang),
      experience: getLang(c.instructor?.experience, lang),
      studentsCount: c.instructor?.studentsCount || 0,
      rating: c.instructor?.rating || 0,
      specializations: c.instructor?.specializations?.[lang] || [],
      achievements: c.instructor?.achievements?.[lang] || [],
      education: getLang(c.instructor?.education, lang),
      image: c.instructor?.image ? (c.instructor.image.startsWith("http") ? c.instructor.image : `https://${c.instructor.image}`) : "",
      social: c.instructor?.social || {},
    },
    review: {
      title: getLang(c.review?.title, lang),
    },
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
   SUB-COMPONENTS
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
                      <div className="mt-4 pl-[52px] border-l-4 border-pink-100 text-gray-600 leading-7 text-base">{faq.a}</div>
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

const CourseDecorate = ({ cards, title }: { cards: Array<{ title: string; body: string }>; title: string; }) => (
  <section id="courseDecorator" className="w-full bg-[#214187] border-2 border-[#FF8FCA] rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
    <div className="container mx-auto max-w-6xl relative z-10">
      <div className="mb-6"><h2 className="font-bold text-xl md:text-2xl text-white tracking-wide">{title}</h2></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {cards.map((feature, index) => (
          <div key={index} className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300">
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#F3056D] shadow-lg group-hover:scale-110 transition-transform duration-300"><CheckCircle className="h-6 w-6 text-white" /></div>
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

const InstructorSection = ({ instructor }: { instructor: InstructorData }) => {
  const { isBangla } = useLanguage();
  return (
    <div className="scroll-mt-36 md:scroll-mt-40 mb-12">
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-pink-100/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-blue-100/40 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[14px] font-semibold bg-[#F3056D]/10 text-[#F3056D] border border-[#F3056D]/20 mb-6">
            <Star className="h-3.5 w-3.5 fill-[#F3056D] text-[#F3056D]" />
            {instructor.title}
          </span>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-[#214187] to-[#1e3a8a] flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white/20 overflow-hidden">
              {instructor.image ? (
                <img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover" />
              ) : (
                <Users className="h-10 w-10 text-white/70" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{isBangla ? "বিশেষজ্ঞ প্রশিক্ষক" : "Expert Instructor"}</h3>
              <p className="text-[16px] text-gray-600 leading-relaxed">{instructor.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function CourseNotFound({ isBangla, slug }: { isBangla: boolean; slug: string }) {
  const router = useRouter();
  return (
    <div className="min-h-screen mt-12 flex items-center justify-center bg-[#FAFAFA]">
      <div className="text-center px-6 max-w-lg">
        <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-6"><BookOpen className="h-10 w-10 text-gray-300" /></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{isBangla ? "কোর্স পাওয়া যায়নি" : "Course Not Found"}</h1>
        <p className="text-gray-500 mb-8 text-[15px] leading-relaxed">{isBangla ? `"${slug}" স্লাগটির কোনো কোর্স খুঁজে পাওয়া যায়নি।` : `No course found with slug "${slug}".`}</p>
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 bg-[#214187] text-white font-bold text-[14px] hover:bg-[#1a2f6e] transition-colors shadow-lg">
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

  // ✅ NEW: State for API Data
  const [data, setData] = useState<SingleCourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ NEW: Fetch Data on Mount & Language Change
  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/api/courses/slug/${slug}`);
        const flattenedData = flattenCourseData(response.data, isBangla);
        setData(flattenedData);
      } catch (error) {
        console.error("Failed to fetch course:", error);
        setData(null); // Trigger 404
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchCourse();
    }
  }, [slug, isBangla]);

  const [activeTab, setActiveTab] = useState("overview");
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [showSideEnrollment, setShowSideEnrollment] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  const featuresRef = useRef<HTMLDivElement>(null);
  const whoIsThisForRef = useRef<HTMLDivElement>(null);
  const syllabusRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: "overview", label: isBangla ? "বিবরণ" : "Description", icon: LayoutGrid },
    { id: "features", label: isBangla ? "ফিচার" : "Features", icon: ListChecks },
    { id: "whoIsThisFor", label: isBangla ? "এটি কাদের জন্য?" : "Who is this for?", icon: UserCheck },
    { id: "syllabus", label: isBangla ? "সিলেবাস" : "Syllabus", icon: BookOpen },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ];

  useEffect(() => {
    if (!data) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveTab(entry.target.id); });
    }, { threshold: 0.3 });
    const refs = [
      { current: overviewRef.current, id: "overview" },
      { current: featuresRef.current, id: "features" },
      { current: whoIsThisForRef.current, id: "whoIsThisFor" },
      { current: syllabusRef.current, id: "syllabus" },
      { current: faqRef.current, id: "faq" },
    ];
    refs.forEach((ref) => { if (ref.current) observer.observe(ref.current); });
    const handleScroll = () => {
      setShowStickyCta(window.scrollY > 300);
      setShowSideEnrollment(window.scrollY > 1500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      refs.forEach((ref) => { if (ref.current) observer.unobserve(ref.current); });
      window.removeEventListener("scroll", handleScroll);
    };
  }, [data]);

  const scrollToSection = (id: string) => {
    const refs: { [key: string]: React.RefObject<HTMLDivElement | null> } = { overview: overviewRef, features: featuresRef, whoIsThisFor: whoIsThisForRef, syllabus: syllabusRef, faq: faqRef };
    const ref = refs[id];
    if (ref?.current) ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleEnroll = () => { setEnrollmentSuccess(false); setShowEnrollmentModal(true); };

  const handleEnrollmentSubmit = async (formData: { name: string; phone: string; }) => {
    try {
      const result = await createEnrollment({ name: formData.name, phone: formData.phone, courseId: slug || "unknown", courseTitle: data?.hero?.title || "Course", amount: data?.quickInfo?.offerPrice || "0" });
      if (result.success) { setEnrollmentSuccess(true); setShowEnrollmentModal(false); } else { throw new Error(result.message || "Enrollment failed"); }
    } catch (error: any) { throw error; }
  };

  // ✅ NEW: Loading State UI
  if (isLoading) {
    return (
      <div className="min-h-screen mt-12 flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center"><div className="w-12 h-12 border-4 border-[#F3056D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-500 font-medium">Loading course...</p></div>
      </div>
    );
  }

  if (!data) {
    return <CourseNotFound isBangla={isBangla} slug={slug} />;
  }

  const priceParts = data.quickInfo.offerPrice.split(" ");
  const displayPrice = priceParts.length > 2 ? `${priceParts[2]} ${priceParts[3]}` : data.quickInfo.offerPrice;
  const originalPrice = priceParts.length > 2 ? `${priceParts[0]} ${priceParts[1]}` : "";
  const startDate = "10 Jan, 2025";
  const endDate = "10 Jul, 2025";

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left */}
            <div className="w-full lg:w-[65%] order-2 lg:order-1">
              <div className="mb-10">
                <Link href={getLink("/courses")} className="inline-flex items-center text-sm md:text-base font-medium mb-4 text-gray-500 hover:text-[#F3056D] transition-colors group">
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  {isBangla ? "কোর্সে ফিরে যান" : "Back to Courses"}
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight tracking-tight">{data.hero.title}</h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">{data.hero.subtitle}</p>
              </div>

              <div className="md:hidden mb-6 flex">
                <EnrollmentCard
                  data={data}
                  onEnroll={handleEnroll}
                  mediaAssets={data.mediaAssets || []}
                />
              </div>

              <div className="sticky top-28 md:top-18 lg:top-22 rounded-2xl z-30 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm mb-12 overflow-hidden">
                <nav className="flex space-x-1 md:space-x-2 overflow-x-auto no-scrollbar py-2 px-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button key={section.id} onClick={() => scrollToSection(section.id)} className={`py-2.5 px-4 md:px-5 rounded-xl font-medium text-sm md:text-base whitespace-nowrap transition-all duration-200 flex items-center ${activeTab === section.id ? "bg-[#214187] border-2 border-primary text-white shadow-md scale-[1.02]" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}>
                        <Icon className="h-4 w-4 mr-2" />
                        {section.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* SECTIONS */}
              <div ref={overviewRef} id="overview" className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">{data.overview.title}</h2>
                <div className="bg-gray-50/50 p-6 md:p-8 rounded-2xl border border-gray-100"><p className="text-lg md:text-xl text-gray-700 leading-relaxed">{data.overview.content}</p></div>
              </div>

              <div ref={featuresRef} id="features" className="scroll-mt-36 md:scroll-mt-40 mb-12">
                <CourseDecorate cards={data.features.cards} title={data.features.title} />
              </div>

              <div ref={whoIsThisForRef} id="whoIsThisFor" className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12">
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-6">{data.whoIsThisFor.title}</h3>
                  <p className="mb-6 text-lg text-gray-600 leading-relaxed">{data.whoIsThisFor.intro}</p>
                  <ul className="space-y-4 mb-8">{data.whoIsThisFor.items.map((item, i) => (<li key={i} className="flex items-start gap-3 text-base text-gray-700 group"><div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors"><CheckCircle className="h-4 w-4 text-green-600" /></div><span className="leading-relaxed">{item}</span></li>))}</ul>
                  <div className="bg-[#214187]/5 p-4 rounded-xl border-l-4 border-[#F3056D]"><p className="font-bold text-lg text-[#214187]">{data.whoIsThisFor.boldStatement}</p></div>
                </div>
              </div>

              <div ref={syllabusRef} id="syllabus" className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">{data.levels.title}</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-3xl">{data.levels.intro}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7EAFF] rounded-bl-full -mr-8 -mt-8 opacity-30 group-hover:opacity-50 transition-opacity" />
                    <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-3 relative z-10">{data.levels.level1.title}</h3>
                    <p className="text-base text-[#F3056D] font-semibold mb-4 relative z-10">{data.levels.level1.for}</p>
                    <p className="text-base text-gray-600 mb-6 relative z-10">{data.levels.level1.intro}</p>
                    <ul className="space-y-3 relative z-10">{data.levels.level1.items.map((item, i) => (<li key={i} className="flex items-start gap-2 text-base text-gray-700"><ChevronRight className="h-5 w-5 text-[#F3056D] mt-0.5 flex-shrink-0" />{item}</li>))}</ul>
                  </div>
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD0CD] rounded-bl-full -mr-8 -mt-8 opacity-30 group-hover:opacity-50 transition-opacity" />
                    <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-3 relative z-10">{data.levels.level2.title}</h3>
                    <p className="text-base text-[#214187] font-semibold mb-4 relative z-10">{data.levels.level2.for}</p>
                    <p className="text-base text-gray-600 mb-6 relative z-10">{data.levels.level2.intro}</p>
                    <ul className="space-y-3 relative z-10">{data.levels.level2.items.map((item, i) => (<li key={i} className="flex items-start gap-2 text-base text-gray-700"><ChevronRight className="h-5 w-5 text-[#214187] mt-0.5 flex-shrink-0" />{item}</li>))}</ul>
                  </div>
                </div>
              </div>

              <InstructorSection instructor={data.instructor} />

              <div ref={faqRef} id="faq" className="scroll-mt-36 md:scroll-mt-40 mb-12">
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
              <div className="sticky hidden md:block top-28"><EnrollmentSideSticky data={data} onEnroll={handleEnroll} isVisible={showSideEnrollment} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CTA & MODALS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-[#214187] to-[#1e3a8a] p-8 md:p-12 rounded-3xl shadow-2xl border border-white/10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">{data.finalCta.title}</h2>
            <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">{data.finalCta.body}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={handleEnroll} bgColor="#F3056D" highlightColor="#FF8FCA" darkShadowColor="#C6005F" className="w-full sm:w-auto text-lg py-4" px="px-10">{data.finalCta.cta1}</Button>
              <div className="text-gray-300 font-medium flex items-center gap-2"><span>{data.finalCta.cta3}</span></div>
            </div>
            <p className="mt-6 text-base text-gray-300 font-medium bg-white/10 inline-block px-4 py-1.5 rounded-full">{data.finalCta.ctaBelow}</p>
          </div>
        </div>
      </div>

      {showStickyCta && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-[60] lg:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{isBangla ? "মূল্য" : "Price"}</span>
              <span className="text-2xl font-bold text-gray-900 leading-none mt-1">{displayPrice}</span>
            </div>
            <Button onClick={handleEnroll} className="flex-1 py-3.5 text-lg" px="px-6">{data.quickInfo.cta1}</Button>
          </div>
        </div>
      )}

      <EnrollmentModal isOpen={showEnrollmentModal} onClose={() => setShowEnrollmentModal(false)} courseTitle={data.hero.title} coursePrice={displayPrice} originalPrice={originalPrice || undefined} startDate={startDate} endDate={endDate} onSubmit={handleEnrollmentSubmit} />

      {enrollmentSuccess && (
        <div className="fixed top-6 right-6 z-[80] animate-in slide-in-from-right-full duration-500">
          <div className="bg-white rounded-2xl shadow-2xl border border-green-100 p-5 max-w-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0"><CheckCircle className="h-6 w-6 text-green-600" /></div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base">{isBangla ? "এনরোলমেন্ট সফল!" : "Enrollment Successful!"}</h3>
                <p className="text-sm text-gray-500 mt-1">{isBangla ? "আপনার আবেদনটি গ্রহণ করা হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।" : "Your application has been received. We will contact you soon."}</p>
              </div>
              <button onClick={() => setEnrollmentSuccess(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><X className="h-4 w-4 text-gray-400" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}