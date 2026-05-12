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
} from "lucide-react";
import { FaSadCry } from "react-icons/fa";

// --- IMPORT CONTEXT ---
import { useLanguage } from "@/app/context/LanguageContext";
import EnrollmentCard from "./EnrollmentCard";
import Button from "@/app/ui/button/Button";
import Enrollment2 from "./Enrollment2";

// --- SUB-COMPONENT: FAQ ---
const FAQ = ({ faqs }: { faqs: Array<{ q: string; a: string }> }) => {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

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
            সাধারণ জিজ্ঞাসা
          </h2>
          <p className="text-sm text-gray-500 font-medium">সবাই যা জানতে চায়</p>
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
                      className={`font-semibold text-lg md:text-xl pr-4 leading-tight transition-colors ${
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
              কোনো প্রশ্ন পাওয়া যায়নি
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
  const { singleCourseData, isBangla, toggleLanguage } = useLanguage();

  const [activeTab, setActiveTab] = useState("features");
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);

  // --- UPDATED STATE for Side Enrollment Animation ---
  const [showSideEnrollment, setShowSideEnrollment] = useState(false);
  const [hasTriggeredScroll, setHasTriggeredScroll] = useState(false); // Prevents restarting timer
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const featuresRef = useRef<HTMLDivElement>(null);
  const whoIsThisForRef = useRef<HTMLDivElement>(null);
  const syllabusRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const sections = [
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
    {
      id: "overview",
      label: isBangla ? "বিবরণ" : "Description",
      icon: LayoutGrid,
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
      { current: featuresRef.current, id: "features" },
      { current: whoIsThisForRef.current, id: "whoIsThisFor" },
      { current: syllabusRef.current, id: "syllabus" },
      { current: overviewRef.current, id: "overview" },
      { current: faqRef.current, id: "faq" },
    ];

    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowStickyCta(scrollY > 300);

      // --- UPDATED LOGIC: Higher Threshold (800px) + 2s Delay ---
      const SCROLL_THRESHOLD = 800;
      const APPEARANCE_DELAY = 2000; // 2 seconds

      if (scrollY > SCROLL_THRESHOLD) {
        if (!hasTriggeredScroll && !showSideEnrollment) {
          setHasTriggeredScroll(true);

          // Start the timer
          if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

          scrollTimeoutRef.current = setTimeout(() => {
            setShowSideEnrollment(true);
          }, APPEARANCE_DELAY);
        }
      } else {
        // If user scrolls back up, reset everything
        if (hasTriggeredScroll || showSideEnrollment) {
          setHasTriggeredScroll(false);
          setShowSideEnrollment(false);
          if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      refs.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [hasTriggeredScroll, showSideEnrollment]); // Dependencies ensure we don't miss updates

  const scrollToSection = (id: string) => {
    const refs: {
      [key: string]: React.RefObject<HTMLDivElement | null>;
    } = {
      features: featuresRef,
      whoIsThisFor: whoIsThisForRef,
      syllabus: syllabusRef,
      overview: overviewRef,
      faq: faqRef,
    };
    const ref = refs[id];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleEnroll = () => {
    setShowEnrollmentModal(true);
  };

  const handleEnrollmentSubmit = () => {
    setIsEnrolling(true);
    setTimeout(() => {
      setIsEnrolling(false);
      setShowEnrollmentModal(false);
      alert(
        isBangla
          ? "ভর্তি সফল হয়েছে! শীঘ্রই যোগাযোগ করা হবে।"
          : "Enrollment Successful! We will contact you shortly.",
      );
    }, 2000);
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
  const breadcrumbParts = data.breadcrumb.split(",");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative selection:bg-pink-100 selection:text-pink-900">
      <div className=" bg-white/90 backdrop-blur-md  py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm md:text-base">
          <div className="flex items-center flex-wrap">
            {breadcrumbParts.map((part, index) => {
              const trimmedPart = part.trim();
              const isLast = index === breadcrumbParts.length - 1;
              let href = "#";
              if (trimmedPart.toLowerCase() === "home") href = "/";
              if (trimmedPart.toLowerCase() === "courses") href = "/courses";
              return (
                <React.Fragment key={index}>
                  {isLast ? (
                    <span className="text-gray-900 font-semibold">
                      {trimmedPart}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className="text-gray-500 hover:text-[#F3056D] font-medium transition-colors"
                    >
                      {trimmedPart}
                    </Link>
                  )}
                  {!isLast && (
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-300" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-[65%] order-2 lg:order-1">
              <div className="mb-10">
                <Link
                  href="/courses"
                  className="inline-flex items-center text-sm md:text-base font-medium mb-4 text-gray-500 hover:text-[#F3056D] transition-colors group"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />{" "}
                  {isBangla ? "কোর্সে ফিরে যান" : "Back to Courses"}
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight tracking-tight">
                  {data.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  {data.hero.subtitle}
                </p>
              </div>

              <div className="sticky top-[60px] md:top-[72px] lg:top-[88px] rounded-2xl z-30 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm mb-12 overflow-hidden">
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

              <div
                ref={faqRef}
                id="faq"
                className="scroll-mt-36 md:scroll-mt-40 mb-12"
              >
                <FAQ faqs={data.faq.items} />
              </div>
            </div>

            <div className="w-full lg:w-[35%] order-1 lg:order-2 space-y-6">
              <div className="">
                <EnrollmentCard
                  data={singleCourseData}
                  onEnroll={handleEnroll}
                  mediaAssets={singleCourseData.mediaAssets || []}
                />
              </div>

              {/* --- UPDATED: Sticky Enrollment Container with Spring Animation & Delay --- */}
              <div className="sticky hidden md:block top-28">
                <Enrollment2
                  data={singleCourseData}
                  onEnroll={handleEnroll}
                  isVisible={showSideEnrollment}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-32">
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

      {showEnrollmentModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setShowEnrollmentModal(false)}
          ></div>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                {data.finalCta.cta2}
              </h2>
              <button
                onClick={() => setShowEnrollmentModal(false)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                  IMG
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1 text-sm md:text-base">
                    {data.hero.title}
                  </h3>
                  <p className="font-bold text-[#F3056D] mt-1">
                    {displayPrice}
                  </p>
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEnrollmentSubmit();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wider">
                    {isBangla ? "নাম" : "Name"}
                  </label>
                  <input
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F3056D] focus:border-transparent outline-none transition-shadow"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wider">
                    {isBangla ? "ফোন" : "Phone"}
                  </label>
                  <input
                    required
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F3056D] focus:border-transparent outline-none transition-shadow"
                    placeholder="017..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isEnrolling}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[#F3056D] hover:bg-[#d9045f]"
                >
                  {isEnrolling ? "Processing..." : data.quickInfo.cta1}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
