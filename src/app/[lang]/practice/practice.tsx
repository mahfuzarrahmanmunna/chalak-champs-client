"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Play,
  Star,
  Users,
  X,
  Phone,
  LayoutGrid,
  ListChecks,
  HelpCircle,
  PlayCircle,
} from "lucide-react";

// --- IMPORT CONTEXT ---
import { useLanguage, SingleCourseData } from "@/app/context/LanguageContext";
// import EnrollmentCard from "./EnrollmentCard";

// --- SUB-COMPONENT: BUTTON ---
const Button = ({
  children,
  onClick,
  className = "",
  bgColor = "#F3056D",
  highlightColor = "#FF8FCA",
  darkShadowColor = "#C6005F",
  textColor = "white",
  hoverTextColor = "#F3056D",
  textSize = "base",
  px = "px-6",
  icon,
  iconPosition = "left",
}: any) => {
  return (
    <button
      onClick={onClick}
      className={`${px} py-2 rounded-lg text-${textColor} font-bold text-${textSize} shadow-[inset_0_4px_0_${highlightColor}] active:shadow-none active:translate-y-[4px] transition-all bg-[${bgColor}] hover:bg-[${highlightColor}] hover:text-[${hoverTextColor}] ${className} flex items-center justify-center`}
      style={{
        backgroundColor: bgColor,
        boxShadow: `inset 0 4px 0 ${highlightColor}, 0 4px 6px -1px ${darkShadowColor}40`,
      }}
    >
      {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </button>
  );
};

// --- SUB-COMPONENT: ENROLLMENT CARD ---
// const EnrollmentCard = () => {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//       <h3 className="font-bold text-lg mb-4 text-gray-900">Enroll Now</h3>
//       <p className="text-gray-600 mb-4">
//         Get instant access to all course materials and start learning today!
//       </p>
//       <Button>Enroll Now</Button>
//     </div>
//   );
// };

// --- SUB-COMPONENT: INCLUDES CARD ---
const IncludesCard = ({ items }: { items: string[] }) => {
  const displayItems = items.slice(0, 5);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-bold text-lg mb-4 text-gray-900">
        This course includes:
      </h3>
      <div className="space-y-3">
        {displayItems.map((item, index) => (
          <div key={index} className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-5 w-5 mr-3 text-[#F3056D]" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: NEED CALL ---
const NeedCall = ({ text }: { text: string }) => {
  const phoneMatch = text.match(/01740176774/);
  const displayPhone = phoneMatch ? phoneMatch[0] : "01740176774";

  return (
    <div className="z-10">
      <div className="bg-gradient-to-r mb-5 from-[#FFFFFF] to-[#C7EAFF] rounded-[30px]">
        <div className="flex justify-between">
          <div className="">
            <div className="p-5">
              <h4 className="text-[#F3066E] text-3xl font-semibold leading-7 tracking-normal mt-1.5">
                যেকোনো প্রয়োজনে কল করো <br className="hidden md:block" /> এখনই
              </h4>
              <p className="text-[#2D2D2D] text-sm leading-3.5 mt-2">
                চালাক Champs এর যেকোনো কোর্স বা স্কিল প্রোগ্রাম কিংবা
                ব্যাচ/ক্লাস সহ <br className="hidden " /> যেকোনো তথ্যের জন্য
                আমরা 24/7 আপনার পাশে
              </p>
              <div className="flex">
                <div className="flex flex-col">
                  <a href={`tel:${displayPhone}`}>
                    <button
                      className="bg-primary cursor-pointer text-white text-xs px-1.25 py-1 md:text-xl font-medium flex items-center md:px-6 md:py-3.5 rounded mt-4 md:rounded-xl md:mt-8"
                      style={{ backgroundColor: "#F3056D" }}
                    >
                      <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      {displayPhone}
                    </button>
                  </a>
                  <div>
                    <p className="text-[#2D2D2D]/50 leading-4 mt-2 text-sm">
                      * যেকোনো নাম্বার থেকে আমাদের কল করুন
                    </p>
                  </div>
                </div>
                <div className="rounded-xl bottom-0 md:hidden flex">
                  {/* Placeholder for girls image if not present */}
                  <div className="w-[240px] h-[225px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                    IMG
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-5 flex-col z-10 md:mt-9 space-y-6 md:space-y-0">
        <div className="bg-gradient-to-r p-3 pb-5 from-[#FFD0CD] to-[#FFC9C9] md:px-5 pt-5 rounded-2xl">
          <div className="flex z-10 justify-between">
            <div>
              <h4
                className="text-secondary font-semibold text-lg leading-8"
                style={{ color: "#214187" }}
              >
                ফ্রি ভিডিও লাইব্রেরি
              </h4>
              <div className="mt-5.5">
                <a href="https://www.youtube.com/@chalakchamps" target="_blank">
                  <Button textSize="sm" px="px-6">
                    ভিডিও দেখো
                  </Button>
                </a>
              </div>
            </div>
            {/* YT Placeholder */}
            <div className="">
              <Image
                src={"/youtubeicon.png"}
                alt="YouTube Icon"
                width={100}
                height={24}
              />
            </div>
          </div>
        </div>
        <div className="z-10 bg-gradient-to-r from-[#C8E4FF] to-[#C9DBFF] rounded-3xl p-5">
          <div className=" z-10 justify-between">
            <div>
              <div className="flex gap-3 items-center justify-between">
                <h5 className="text-lg font-semibold leading-8 text-[#232C6A]">
                  চালাক Champs ফেসবুক{" "}
                </h5>
                {/* FB Placeholder */}
                <div className="">
                  <Image
                    src={"/Facebookicon.webp"}
                    alt="Facebook Icon"
                    width={80}
                    height={16}
                  />
                </div>
              </div>
              <div className="">
                <a
                  href="https://www.facebook.com/chalakchampsbd"
                  target="_blank"
                >
                  <Button
                    bgColor="#F3056D"
                    highlightColor="#FF8FCA"
                    darkShadowColor="#F3066E"
                    hoverTextColor="#F3056D"
                    hoverBgColor="#ffffff"
                  >
                    লাইভ দেখো
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: FAQ ---
const FAQ = ({ faqs }: { faqs: Array<{ q: string; a: string }> }) => {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  return (
    <div className="bg-[#214187]/5 p-6 rounded-xl border border-[#214187]/20 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="h-5 w-5" />
        <h3 className="font-bold text-lg text-gray-900">সাধারণ জিজ্ঞাসা</h3>
      </div>

      <div className="space-y-3">
        {faqs.length > 0 ? (
          faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === faq.q ? null : faq.q)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none overflow-hidden"
              >
                <span className="font-medium text-gray-800 text-sm md:text-base pr-4">
                  {faq.q}
                </span>
                <div className="flex-shrink-0 overflow-hidden relative">
                  <div
                    className={`w-4 h-4 rounded-full overflow-hidden border-2 transition-colors flex items-center justify-center ${
                      activeFaq === faq.q
                        ? "border-[#F3056D]"
                        : "border-gray-500"
                    }`}
                  >
                    {/* Line 1 */}
                    <div
                      className={`absolute w-full h-0.5 bg-current transform transition-transform ${
                        activeFaq === faq.q ? "rotate-45" : "rotate-0"
                      }`}
                    ></div>

                    {/* Line 2 */}
                    <div
                      className={`absolute w-full h-0.5 bg-current transform transition-transform ${
                        activeFaq === faq.q ? "-rotate-45" : "rotate-90"
                      }`}
                    ></div>
                  </div>
                </div>
              </button>
              {activeFaq === faq.q && (
                <div className="px-4 pb-4 pt-0 text-sm text-gray-600 border-t border-gray-100 mt-2">
                  <div className="pt-3 leading-relaxed">{faq.a}</div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm py-4">কোনো প্রশ্ন পাওয়া যায়নি।</p>
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
      className="w-full bg-[#214187] border-2 border-[#FF8FCA] rounded-xl p-6 relative overflow-hidden"
    >
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="">
          <h2 className="font-bold text-lg text-white">{title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-3 mt-4">
          {cards.map((feature, index) => {
            const isBlue = index % 2 === 0;
            const accentColor = isBlue ? "#00477C" : "#F3066D";

            return (
              <div
                key={index}
                className="group relative p-3 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-primary/12 border border-primary/30"
                  >
                    <div
                      className="transition-transform duration-300 group-hover:scale-110 text-primary"
                    >
                      <CheckCircle className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-md font-bold text-white mb-2 transition-colors duration-300 group-hover:text-gray-100">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-[15px] leading-relaxed font-normal">
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

  // State for Tabs
  const [activeTab, setActiveTab] = useState("overview");

  // State for Enrollment Modal
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Refs for Scroll Spy
  const overviewRef = useRef<HTMLDivElement>(null);
  const curriculumRef = useRef<HTMLDivElement>(null);
  const instructorRef = useRef<HTMLDivElement>(null);
  const courseDecoratorRef = useRef<HTMLDivElement>(null);

  const sections = [
    {
      id: "overview",
      label: isBangla ? "ওভারভিউ" : "Overview",
      icon: LayoutGrid,
    },
    {
      id: "curriculum",
      label: isBangla ? "সিলেবাস" : "Curriculum",
      icon: BookOpen,
    },
    {
      id: "instructor",
      label: isBangla ? "ইন্সট্রাক্টর" : "Instructor",
      icon: Users,
    },
    {
      id: "courseDecorator",
      label: isBangla ? "ফিচার" : "Features",
      icon: ListChecks,
    },
  ];

  // Scroll Spy Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { threshold: 0.5 },
    );

    const refs = [
      { current: overviewRef.current, id: "overview" },
      { current: curriculumRef.current, id: "curriculum" },
      { current: instructorRef.current, id: "instructor" },
      { current: courseDecoratorRef.current, id: "courseDecorator" },
    ];

    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  // Handlers
  const scrollToSection = (id: string) => {
    const refs: {
      [key: string]: React.RefObject<HTMLDivElement | null>;
    } = {
      overview: overviewRef,
      curriculum: curriculumRef,
      instructor: instructorRef,
      courseDecorator: courseDecoratorRef,
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

  // If data is not loaded (safety check)
  if (!singleCourseData || Object.keys(singleCourseData).length === 0) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  const data = singleCourseData;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20 relative">
      {/* Language Switcher (Floating) */}
      {/* --- BREADCRUMB --- */}
      <div className="bg-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-600">
          <span>{data.breadcrumb}</span>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Content */}
            <div className="w-[65%]">
              <div className="mb-6">
                <Link
                  href="/courses"
                  className="inline-flex items-center text-sm font-medium mb-4 text-gray-500 hover:opacity-70 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />{" "}
                  {isBangla ? "কোর্সে ফিরে যান" : "Back to Courses"}
                </Link>

                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 leading-tight">
                  {data.hero.title}
                </h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {data.hero.subtitle}
                </p>
              </div>
              <div className="lg:col-span-2 space-y-8">
                {/* --- NAVIGATION BAR --- */}
                <div className="sticky top-24 rounded-2xl z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
                    <nav className="flex space-x-8 overflow-x-auto no-scrollbar py-4">
                      {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                          <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`py-2 px-5 rounded-xl border-b-2 font-medium text-base whitespace-nowrap transition-colors flex items-center ${
                              activeTab === section.id
                                ? `text-[#214187] border-b-[#F3056D]`
                                : "text-gray-500 border-transparent "
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

                {/* 1. OVERVIEW */}
                <div
                  ref={overviewRef}
                  id="overview"
                  className="scroll-mt-24 space-y-6"
                >
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">
                    {data.overview.title}
                  </h2>
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-700 leading-relaxed">
                      {data.overview.content}
                    </p>
                  </div>

                  {/* Who Is This For Section */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">
                      {data.whoIsThisFor.title}
                    </h3>
                    <p className="mb-4 text-gray-600">
                      {data.whoIsThisFor.intro}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {data.whoIsThisFor.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <CheckCircle className="h-4 w-4 text-[#F3056D] mt-1 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="font-bold text-[#214187]">
                      {data.whoIsThisFor.boldStatement}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* 2. CURRICULUM (Levels) */}
                <div
                  ref={curriculumRef}
                  id="curriculum"
                  className="scroll-mt-24 space-y-6"
                >
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">
                    {data.levels.title}
                  </h2>
                  <p className="text-gray-600 mb-6">{data.levels.intro}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Level 1 */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#C7EAFF] rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {data.levels.level1.title}
                      </h3>
                      <p className="text-sm text-[#F3056D] font-semibold mb-4">
                        {data.levels.level1.for}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        {data.levels.level1.intro}
                      </p>
                      <ul className="space-y-2">
                        {data.levels.level1.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Level 2 */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#FFD0CD] rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {data.levels.level2.title}
                      </h3>
                      <p className="text-sm text-[#214187] font-semibold mb-4">
                        {data.levels.level2.for}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        {data.levels.level2.intro}
                      </p>
                      <ul className="space-y-2">
                        {data.levels.level2.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* 3. INSTRUCTOR */}
                <div
                  ref={instructorRef}
                  id="instructor"
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">
                    {data.instructor.title}
                  </h2>
                  <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-400 text-2xl font-bold">
                      TC
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Chalak Champs Team
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {data.instructor.info}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
                        <div className="flex items-center justify-center gap-2">
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                          <div className="text-sm">
                            <span className="font-bold text-gray-900">4.9</span>
                            <span className="text-gray-500 ml-1">
                              {isBangla
                                ? "ইন্সট্রাক্টর রেটিং"
                                : "Instructor Rating"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Users className="h-5 w-5 text-[#214187]" />
                          <div className="text-sm">
                            <span className="font-bold text-gray-900">
                              5000+
                            </span>
                            <span className="text-gray-500 ml-1">
                              {isBangla ? "স্টুডেন্ট" : "Students"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* 4. FEATURES (Course Decorator) */}
                <div
                  ref={courseDecoratorRef}
                  id="courseDecorator"
                  className="scroll-mt-24"
                >
                  <CourseDecorate
                    cards={data.features.cards}
                    title={data.features.title}
                  />
                </div>
              </div>
            </div>

            {/* Right Enrollment Card */}
            <div className="space-y-6 w-[35%] hidden lg:block">
              <EnrollmentCard
                data={singleCourseData}
                onEnroll={handleEnroll}
                // mediaAssets={singleCourseData.mediaAssets}
              />
              <div className="sticky top-24 space-y-6">
                <IncludesCard items={data.quickInfo.items} />
                <NeedCall text={data.quickInfo.ctaBelow} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Content) */}

        {/* Right Sidebar */}
        <div className="lg:col-span-1 lg:w-[400px]"></div>
      </div>

      {/* FAQ Section at bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <FAQ faqs={data.faq.items} />
      </div>

      {/* Final CTA / Payment Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-16">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {data.finalCta.title}
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {data.finalCta.body}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleEnroll}
              bgColor="#F3056D"
              highlightColor="#FF8FCA"
              darkShadowColor="#C6005F"
            >
              {data.finalCta.cta1}
            </Button>
            <div className="text-gray-500 font-medium">
              {data.finalCta.cta3}
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 font-semibold">
            {data.finalCta.ctaBelow}
          </p>
        </div>
      </div>

      {/* <EnrollmentCard
        data={singleCourseData}
        onEnroll={handleEnroll}
        mediaAssets={singleCourseData.mediaAssets}
      /> */}
      {/* Enrollment Modal */}
      {showEnrollmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEnrollmentModal(false)}
          ></div>
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">
                {data.finalCta.cta2}
              </h2>
              <button
                onClick={() => setShowEnrollmentModal(false)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                  IMG
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1">
                    {data.hero.title}
                  </h3>
                  <p className="font-bold text-[#F3056D]">
                    {/* Extracting last price again for display */}
                    {data.quickInfo.offerPrice.split(" ").pop()}
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
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    {isBangla ? "নাম" : "Name"}
                  </label>
                  <input
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F3056D] outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    {isBangla ? "ফোন" : "Phone"}
                  </label>
                  <input
                    required
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F3056D] outline-none"
                    placeholder="017..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isEnrolling}
                  className="w-full py-3.5 rounded-lg text-white font-bold text-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#F3056D" }}
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
