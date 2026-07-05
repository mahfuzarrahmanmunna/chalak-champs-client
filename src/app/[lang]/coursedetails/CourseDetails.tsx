"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  CreditCard,
  AlertCircle,
  Check,
  Calendar,
  Clock,
  Tag,
} from "lucide-react";
import { FaSadCry } from "react-icons/fa";

// --- IMPORT CONTEXT ---
import { useLanguage } from "@/app/context/LanguageContext";
import EnrollmentCard from "./EnrollmentCard";
import Button from "@/app/ui/button/Button";
import EnrollmentSideSticky from "./EnrollmentSideSticky";
import { createEnrollment } from "@/app/services/enrollmentService";

// --- SUB-COMPONENT: FAQ ---
const FAQ = ({ faqs }: { faqs: Array<{ q: string; a: string }> }) => {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const { isBangla } = useLanguage();

  useEffect(() => {
    if (faqs.length > 0 && !activeFaq) {
      setActiveFaq(faqs[0].q);
    }
  }, [faqs]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-pink-50/30 p-6 md:p-10 rounded-[32px] border border-white/60 shadow-lg relative overflow-hidden">
      <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-pink-200/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-blue-200/20 rounded-full blur-2xl pointer-events-none" />
      <div className="relative z-10 flex items-center gap-3 mb-10">
        <div className="bg-white p-3 rounded-2xl shadow-sm text-[#F3056D] border border-pink-100">
          <MessageCircle className="h-6 w-6 fill-pink-50" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            {isBangla ? "সাধারণ জিজ্ঞাসা" : "Frequently Asked Questions"}
          </h2>
        </div>
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
              {isBangla ? "কোনো প্রশ্ন পাওয়া যায়নি" : "No Questions Found"}
            </p>
            <FaSadCry className="text-xl text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: COURSE DECORATE (FEATURES) ---
const CourseDecorate = ({
  cards,
  title,
}: {
  cards: Array<{ title: string; body: string }>;
  title: string;
}) => {
  return (
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
          {cards.map((feature, index) => {
            return (
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function CourseDetails() {
  const router = useRouter();
  const { singleCourseData, isBangla } = useLanguage();

  const [activeTab, setActiveTab] = useState("overview");
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  // --- NEW STATE FOR 4-STEP MODAL ---
  // Step 1: Bill Summary (Screenshot Style)
  // Step 2: User Form (Name/Phone)
  // Step 3: Checkout & Payment Selection
  // Step 4: Success
  const [enrollmentStep, setEnrollmentStep] = useState<1 | 2 | 3 | 4>(1);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  // ---------------------------------------

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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
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
      const scrollY = window.scrollY;
      setShowStickyCta(scrollY > 300);
      const SCROLL_THRESHOLD = 1500;
      if (scrollY > SCROLL_THRESHOLD) {
        setShowSideEnrollment(true);
      } else {
        setShowSideEnrollment(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      refs.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const refs: {
      [key: string]: React.RefObject<HTMLDivElement | null>;
    } = {
      overview: overviewRef,
      features: featuresRef,
      whoIsThisFor: whoIsThisForRef,
      syllabus: syllabusRef,
      faq: faqRef,
    };
    const ref = refs[id];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleEnroll = () => {
    setEnrollmentStep(1);
    setFormData({ name: "", phone: "" });
    setEnrollmentError(null);
    setShowEnrollmentModal(true);
  };

  // --- UPDATED SUBMIT LOGIC WITH REDIRECT ---
  const handleEnrollmentSubmit = async () => {
    // Step 1 (Summary): Redirect to Checkout Page
    if (enrollmentStep === 1) {
      // CHANGE: Redirect to checkout page instead of moving to Step 2
      router.push(`/${isBangla ? "bn": "en"}/checkout`);
      return;
    }

    // Step 2 (Form): Validate and Move to Step 3 (Checkout)
    if (enrollmentStep === 2) {
      if (!formData.name || !formData.phone) {
        setEnrollmentError("Please fill in all fields");
        return;
      }
      setEnrollmentStep(3);
      setEnrollmentError(null);
      return;
    }

    // Step 3 (Checkout): Call API
    setEnrollmentLoading(true);
    setEnrollmentError(null);

    try {
      const result = await createEnrollment({
        name: formData.name,
        phone: formData.phone,
        courseId: singleCourseData?.hero?.id || "unknown",
        courseTitle: singleCourseData?.hero?.title || "Course",
        amount: singleCourseData?.quickInfo?.offerPrice || "0",
      });

      if (result.success) {
        setEnrollmentStep(4);
      } else {
        throw new Error(result.message || "Enrollment failed");
      }
    } catch (error: any) {
      console.error("Enrollment Error:", error);
      setEnrollmentError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setEnrollmentLoading(false);
    }
  };

  if (!singleCourseData || Object.keys(singleCourseData).length === 0) {
    return (
      <div className="p-10 text-center bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-500 font-medium">
          Loading Course Details...
        </div>
      </div>
    );
  }

  const data = singleCourseData;
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
      href: isBangla ? "/bn/courses" : "/en/courses",
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
      {/* ===== BREADCRUMB ===== */}
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

      {/* Hero + Main Content */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  md:py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column */}
            <div className="w-full lg:w-[65%] order-2 lg:order-1">
              {/* Hero */}
              <div>
                <div className="mb-10">
                  <Link
                    href={isBangla ? "/bn/courses" : "/en/courses"}
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
                    data={singleCourseData}
                    onEnroll={handleEnroll}
                    mediaAssets={singleCourseData.mediaAssets || []}
                  />
                </div>
              </div>

              {/* Sticky Tab Navigation */}
              <div className="sticky top-28 md:top-18 lg:top-22 rounded-2xl z-30 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm mb-12 overflow-hidden">
                <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0">
                  <nav className="flex space-x-1 md:space-x-2 overflow-x-auto no-scrollbar py-2 px-2">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`py-2.5 px-4 md:px-5 rounded-xl font-medium text-sm md:text-base whitespace-nowrap transition-all duration-200 flex items-center ${
                            activeTab === section.id
                              ? `bg-[#214187] border-2 border-primary text-white shadow-md scale-[1.02]`
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
              </div>

              {/* ============ 1. DESCRIPTION / OVERVIEW ============ */}
              <div
                ref={overviewRef}
                id="overview"
                className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">
                  {data.overview.title}
                </h2>
                <div className="bg-gray-50/50 p-6 md:p-8 rounded-2xl border border-gray-100">
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
                    {data.overview.content}
                  </p>
                </div>
              </div>

              {/* ============ 2. FEATURES ============ */}
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

              {/* ============ 3. WHO IS THIS FOR ============ */}
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

              {/* ============ 4. SYLLABUS ============ */}
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
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7EAFF] rounded-bl-full -mr-8 -mt-8 opacity-30 group-hover:opacity-50 transition-opacity"></div>
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
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD0CD] rounded-bl-full -mr-8 -mt-8 opacity-30 group-hover:opacity-50 transition-opacity"></div>
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

              {/* ============ 5. TEACHER / INSTRUCTOR ============ */}
              <div className="scroll-mt-36 md:scroll-mt-40 mb-12">
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-pink-100/40 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-blue-100/40 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[14px] font-semibold bg-[#F3056D]/10 text-[#F3056D] border border-[#F3056D]/20 mb-6">
                      <Star className="h-3.5 w-3.5 fill-[#F3056D] text-[#F3056D]" />
                      {data.instructor.title}
                    </span>

                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-[#214187] to-[#1e3a8a] flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white/20">
                        <Users className="h-10 w-10 text-white/70" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                          {isBangla
                            ? "বিশেষজ্ঞ প্রশিক্ষক"
                            : "Expert Instructor"}
                        </h3>
                        <p className="text-[16px] text-gray-600 leading-relaxed">
                          {data.instructor.info}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============ 6. FAQ ============ */}
              <div
                ref={faqRef}
                id="faq"
                className="scroll-mt-36 md:scroll-mt-40 mb-12"
              >
                <FAQ faqs={data.faq.items} />
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-[35%] order-1 mt-0 lg:order-2 space-y-6">
              <div className="hidden md:flex">
                <EnrollmentCard
                  data={singleCourseData}
                  onEnroll={handleEnroll}
                  mediaAssets={singleCourseData.mediaAssets || []}
                />
              </div>

              <div className="sticky hidden md:block top-28">
                <EnrollmentSideSticky
                  data={singleCourseData}
                  onEnroll={handleEnroll}
                  isVisible={showSideEnrollment}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="bg-gradient-to-r from-[#214187] to-[#1e3a8a] p-8 md:p-12 rounded-3xl shadow-2xl border border-white/10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
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

      {/* Sticky Mobile CTA */}
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

      {/* ========================================= */}
      {/* ===== UPDATED PROFESSIONAL MODAL ========== */}
      {/* ========================================= */}
      {showEnrollmentModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 md:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => setShowEnrollmentModal(false)}
          ></div>

          {/* Modal Card */}
          <div
            className={`bg-white w-full rounded-[32px] shadow-2xl overflow-hidden relative z-10 flex flex-col animate-in zoom-in-95 duration-300 ${
              enrollmentStep === 3 ? "max-w-5xl h-[90vh] md:h-auto" : "max-w-md"
            }`}
          >
            {/* --- HEADER --- */}
            {/* Step 1 uses a clean header, others use the gradient header */}
            {enrollmentStep === 1 ? (
              <div className="relative bg-white p-6 border-b border-gray-100">
                {/* Progress Bar */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#F3056D] text-white flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <span className="text-sm font-bold text-[#F3056D]">
                      Step 1
                    </span>
                  </div>
                  <div className="h-1 w-12 bg-gray-200 rounded"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <span className="text-sm font-bold text-gray-400">
                      Step 2
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    আপনার বিলের সারাংশ
                  </h2>
                  <button
                    onClick={() => setShowEnrollmentModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative bg-gradient-to-br from-[#214187] to-[#1e3a8a] p-6 pt-8 text-white">
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold mb-1">
                      {enrollmentStep === 2
                        ? isBangla
                          ? "তথ্য প্রদান করুন"
                          : "Student Info"
                        : isBangla
                          ? "চেকআউট"
                          : "Checkout"}
                    </h2>
                    <p className="text-blue-100 text-sm font-medium">
                      {data.hero.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEnrollmentModal(false)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* --- BODY --- */}
            <div className="p-6 md:p-8 flex-1 overflow-y-auto">
              {/* --- STEP 1: BILL SUMMARY (REAL DATA) --- */}
              {enrollmentStep === 1 && (
                <div className="animate-in fade-in duration-300 space-y-6">
                  {/* Course Info Card */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {data.hero.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{data.hero.subtitle}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">
                          {data.hero.title}
                        </span>
                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-900">
                            {displayPrice}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50/50 rounded-lg p-3 flex justify-between items-center border border-blue-100">
                      <span className="font-bold text-gray-700">মোট</span>
                      <span className="text-xl font-bold text-[#F3056D]">
                        {displayPrice}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <button
                      onClick={() => setShowEnrollmentModal(false)}
                      className="py-3.5 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      ফেরত যাও
                    </button>
                    <button
                      onClick={handleEnrollmentSubmit}
                      className="py-3.5 bg-[#F3056D] hover:bg-[#d9045f] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      উপলব্ধি কর
                    </button>
                  </div>
                </div>
              )}

              {/* --- STEP 2: USER FORM --- */}
              {enrollmentStep === 2 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isBangla ? "আপনার নাম" : "Full Name"}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F3056D] focus:border-transparent outline-none transition-all font-medium text-gray-800"
                        placeholder={isBangla ? "নাম লিখুন" : "Enter name"}
                      />
                      <Users className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isBangla ? "মোবাইল নাম্বার" : "Phone Number"}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F3056D] focus:border-transparent outline-none transition-all font-medium text-gray-800"
                        placeholder="017..."
                      />
                      <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {enrollmentError && (
                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                      <AlertCircle className="h-4 w-4" />
                      {enrollmentError}
                    </div>
                  )}

                  <button
                    onClick={handleEnrollmentSubmit}
                    className="w-full py-3.5 bg-[#214187] hover:bg-[#1a2f6e] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {isBangla ? "এগিয়ে যান" : "Proceed"}
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setEnrollmentStep(1)}
                    className="w-full text-sm text-gray-500 hover:text-gray-800 mt-2"
                  >
                    {isBangla ? "ফিরে যান" : "Back"}
                  </button>
                </div>
              )}

              {/* --- STEP 3: CHECKOUT / PAYMENT (REAL DATA) --- */}
              {enrollmentStep === 3 && (
                <div className="animate-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    {/* Left: Course Details Recap */}
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {isBangla ? "পেমেন্ট তথ্য" : "Payment Details"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {isBangla
                            ? "নিচের তথ্যগুলো যাচাই করুন"
                            : "Verify the details below"}
                        </p>
                      </div>

                      <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center text-center justify-center h-64 md:h-80 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
                        <BookOpen className="h-12 w-12 text-[#214187] mb-4" />
                        <h4 className="font-bold text-gray-900 text-lg">
                          {data.hero.title}
                        </h4>
                        <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-600 shadow-sm border border-gray-100">
                          <Clock className="h-3 w-3" />
                          Lifetime Access
                        </div>
                      </div>

                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>{isBangla ? "নাম" : "Name"}:</span>
                          <span className="font-medium text-gray-900">
                            {formData.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>{isBangla ? "ফোন" : "Phone"}:</span>
                          <span className="font-medium text-gray-900">
                            {formData.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Bill Info & Action */}
                    <div className="flex flex-col">
                      <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                            {isBangla ? "বিল সংক্রান্ত তথ্য" : "Bill Info"}
                          </h3>

                          <div className="space-y-4">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>
                                {isBangla ? "পণ্যের নাম" : "Item Name"}
                              </span>
                              <span className="font-medium text-gray-900 max-w-[150px] text-right truncate">
                                {data.hero.title}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>{isBangla ? "ফি" : "Fee"}</span>
                              <span className="font-medium text-gray-900">
                                {displayPrice}
                              </span>
                            </div>
                            <div className="border-t border-gray-200 my-2 pt-2"></div>
                            <div className="flex justify-between items-end">
                              <span className="text-sm font-bold text-gray-900">
                                {isBangla ? "সর্বমোট" : "Grand Total"}
                              </span>
                              <span className="text-2xl font-bold text-[#F3056D]">
                                {displayPrice}
                              </span>
                            </div>
                          </div>
                        </div>

                        {enrollmentError && (
                          <div className="my-4 flex items-center gap-2 text-red-500 text-xs bg-red-50 p-2 rounded border border-red-100">
                            <AlertCircle className="h-3 w-3" />
                            {enrollmentError}
                          </div>
                        )}

                        <div className="mt-6 pt-4">
                          <button
                            onClick={handleEnrollmentSubmit}
                            disabled={enrollmentLoading}
                            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {enrollmentLoading ? (
                              <span className="animate-pulse">
                                {isBangla ? "প্রসেসিং..." : "Processing..."}
                              </span>
                            ) : (
                              <>
                                {isBangla ? "পদ্ধতি নির্বাচন" : "Select Method"}
                                <CreditCard className="h-4 w-4" />
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setEnrollmentStep(1)}
                            className="w-full mt-3 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                          >
                            {isBangla ? "ফিরে যান" : "Go Back"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- STEP 4: SUCCESS --- */}
              {enrollmentStep === 4 && (
                <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in-95 duration-300 text-center h-full">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-md">
                    <Check className="h-10 w-10 text-green-600 stroke-[3]" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isBangla
                      ? "সফলভাবে ভর্তি হয়েছে!"
                      : "Enrollment Successful!"}
                  </h2>
                  <p className="text-gray-500 text-sm max-w-[250px] mb-8">
                    {isBangla
                      ? "আপনার ইমেইলে বিস্তারিত পাঠানো হবে।"
                      : "We have sent you a confirmation message."}
                  </p>
                  <button
                    onClick={() => setShowEnrollmentModal(false)}
                    className="w-full max-w-xs py-3 bg-[#214187] text-white font-bold rounded-xl hover:bg-[#1a2f6e] transition-colors"
                  >
                    {isBangla ? "বন্ধ করুন" : "Close"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
