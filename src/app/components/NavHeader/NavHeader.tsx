"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";

// --- Lucide Icons for Modern Modal Design ---
import {
  Star,
  GraduationCap,
  ArrowRight,
  Phone,
  BookOpen,
  Award,
  ChevronRight,
  Smile,
  Palette,
  Calculator,
  Music,
  Puzzle,
  Sparkles,
  Brain,
  Users,
  Megaphone,
  Globe,
  ShoppingBag,
  Video,
  Library,
} from "lucide-react";

// --- Your Local Imports (Kept Same) ---
import Button from "@/app/ui/button/Button";
import NavLogo from "./logo";
import DropIcon from "./DropIcon";
import CallIcon from "../Icon/CallIcon";
import MulStar from "../Icon/MulStar";
import CloseIcon from "../Icon/CloseIcon";
import BnEnLogo from "./BnEnLogo";
import UserIcon from "./UserIcon";
import { FaMicrophone } from "react-icons/fa6";
import Freebooking from "../Freebooking/Freebooking";

// --- Modern Menu Icon Component (Custom SVG) ---
const ModernMenuIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[#214187]"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const NavHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Access language context safely to avoid crash
  const context = useLanguage();

  // Fallback values in case context is undefined
  const t = context?.t || {};
  const isBangla = context?.isBangla || false;
  const toggleLanguage = context?.toggleLanguage || (() => {});
  const menuData = context?.menuData || {
    courses: [],
    skills: [],
    kids: [],
    more: [],
  };

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click Outside to Close Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle Dropdown Logic
  const handleDropdownClick = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 px-2 transition-all duration-300 border-b-2 border-white/5 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          : "bg-white/80 "
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-1">
        <Link href={`/${isBangla ? "bn" : "en"}`}>
          <NavLogo />
        </Link>

        {/* --- DESKTOP MIDDLE SECTION (UNCHANGED CLASSES EXCEPT ACTIVE STATE) --- */}
        <div
          className="hidden md:flex items-center gap-7"
          ref={dropdownRef}
        ></div>

        {/* --- DESKTOP RIGHT SECTION (UNCHANGED) --- */}
        <div className="hidden md:flex items-center gap-4">
          <div>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="cursor-pointer px-5 leading-auto tracking-[-2%] relative   py-3 w-full rounded-[50px] font-bold text-white transition-all duration-300 bg-[#F3056D] shadow-[inset_0_1.5px_0_0_#FF8FCA,0_1.5px_1.5px_0_rgba(243,6,110,0.3),0_0_0_1.5px_#C6005F,0_3.01px_7.52px_0_rgba(243,6,110,0.3)]  hover:bg-white hover:text-[#F3056D]  hover:shadow-[0_1.5px_1.5px_0_rgba(243,6,110,0.2),0_0_0_1.5px_#F3056D,0_3.01px_7.52px_0_rgba(243,6,110,0.1)]"
            >
              <div className="absolute top-1.75 left-3 text-base  transition-colors duration-300">
                <svg
                  width="32"
                  height="33"
                  viewBox="0 0 32 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M-0.000367234 5.24803L2.85291 6.42831C3.61254 6.74311 4.19326 7.3648 4.44321 8.13188L5.381 11.0126L6.593 8.2305C6.91588 7.48989 7.55216 6.924 8.33896 6.68032L11.2934 5.76467L8.44011 4.58439C8.06488 4.42917 7.72852 4.19669 7.45408 3.90288C7.17963 3.60907 6.9736 3.26088 6.85009 2.88217L5.91202 0.000140662L4.7003 2.78356C4.37713 3.52281 3.73975 4.09033 2.95434 4.33374L-0.000367234 5.24803ZM27.3896 6.48784L28.0441 5.88457C28.3406 5.61174 28.6941 5.40467 29.0804 5.27754C29.4667 5.15042 29.8766 5.10625 30.2821 5.14808L31.1772 5.23913L30.5585 4.60101C30.2789 4.31207 30.0666 3.96761 29.9363 3.59125C29.806 3.21488 29.7606 2.8155 29.8033 2.42045L29.8967 1.54772L29.2422 2.15099C28.6434 2.70247 27.8258 2.97191 27.0056 2.88721L26.1105 2.79615L26.7292 3.43427C27.2949 4.01811 27.5712 4.81517 27.4844 5.61484L27.3896 6.48784ZM12.5852 30.4953L14.5839 30.4154C15.4086 30.3824 16.2065 30.7009 16.7689 31.2897L18.133 32.7169L18.0496 30.7685C18.0329 30.3712 18.1044 29.9751 18.2595 29.6074C18.4145 29.2397 18.6493 28.909 18.9477 28.638L20.4102 27.3083L18.4118 27.3896C18.0047 27.406 17.5987 27.3363 17.2218 27.1853C16.8449 27.0344 16.506 26.8057 16.2282 26.5151L14.8641 25.0879L14.9461 27.0365C14.9631 27.4337 14.8917 27.8297 14.7369 28.1974C14.5822 28.5651 14.3476 28.8958 14.0494 29.1668L12.5852 30.4953Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              {t?.bookAFreeClass || "Book A Free Class"}
            </button>
          </div>

          {/* --- ALL COURSES MODAL (REDESIGNED) --- */}
          <div className="relative">
            <button
              onClick={() => handleDropdownClick("courses")}
              className={`flex items-center leading-auto tracking-[-2%] text-sm gap-2.5 cursor-pointer px-3.5 py-3 rounded-lg font-semibold transition-all ${
                activeDropdown === "courses"
                  ? "bg-[#F3066E] text-white"
                  : "text-[#F3066E] hover:bg-white hover:border hover:border-primary bg-[#F3066E]/20"
              }`}
            >
              <div className="flex gap-1 relative">
                <p>{t?.allCourses || "All Courses"}</p>
                <div
                  className={`transition-transform duration-300 ${
                    activeDropdown === "courses" ? "rotate-180" : ""
                  }`}
                >
                  <DropIcon />
                </div>
              </div>
            </button>

            {activeDropdown === "courses" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-5 w-[800px] z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-white/50 overflow-hidden">
                  <div className="flex min-h-[400px]">
                    {/* Left: Featured/Playful Section */}
                    <div className="w-[35%] bg-gradient-to-br from-[#FFF0F7] to-[#E0F2FE] p-8 flex flex-col justify-between relative">
                      {/* Decor Elements */}
                      <div className="absolute top-[-30px] left-[-30px] w-32 h-32 bg-pink-300/20 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-[-20px] right-[-20px] w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"></div>

                      <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase rounded-full mb-4 shadow-sm">
                          <Sparkles size={12} /> Popular Now
                        </div>
                        <h3 className="text-[#214187] font-black text-[26px] leading-tight mb-3">
                          Spoken <br />
                          <span className="text-[#F3056D]">English Fun</span>
                        </h3>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                          {isBangla
                            ? "সোনামণিদের সহজ ও মজার ছলে ইংরেজি শেখার সেরা কোর্স!"
                            : "Interactive sessions designed to boost confidence and fluency!"}
                        </p>

                        <Link
                          href="#"
                          className="inline-flex items-center gap-2 bg-[#214187] text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#F3056D] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                          {isBangla ? "এখনই শুরু করুন" : "Explore Now"}{" "}
                          <ArrowRight size={18} />
                        </Link>
                      </div>
                    </div>

                    {/* Right: Course List Grid */}
                    <div className="w-[65%] p-8 bg-white">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-[#214187] font-extrabold text-xl tracking-tight">
                          {isBangla ? "আমাদের কোর্সসমূহ" : "Browse Categories"}
                        </h4>
                        <div className="h-1.5 w-1.5 rounded-full bg-pink-400"></div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {(menuData.courses.length > 0
                          ? menuData.courses
                          : [
                              {
                                title: "Language Learning",
                                description: "Fluency for everyday life",
                              },
                              {
                                title: "Art & Drawing",
                                description: "Unleash creativity",
                              },
                              {
                                title: "Math Skills",
                                description: "Logic & numbers",
                              },
                              {
                                title: "Brain Development",
                                description: "Cognitive skills",
                              },
                            ]
                        ).map((item, idx) => {
                          // Mapping icons based on index to keep it playful
                          const icons = [
                            {
                              icon: <Globe size={20} />,
                              color: "text-blue-600",
                              bg: "bg-blue-50",
                            },
                            {
                              icon: <Palette size={20} />,
                              color: "text-orange-500",
                              bg: "bg-orange-50",
                            },
                            {
                              icon: <Calculator size={20} />,
                              color: "text-green-500",
                              bg: "bg-green-50",
                            },
                            {
                              icon: <Brain size={20} />,
                              color: "text-purple-500",
                              bg: "bg-purple-50",
                            },
                          ];
                          const iconData = icons[idx % icons.length];

                          return (
                            <Link
                              key={idx}
                              href="#"
                              className="group/item flex items-center gap-4 p-4 rounded-[20px] bg-gray-50/50 border border-gray-100 hover:border-pink-200 hover:bg-white hover:shadow-xl hover:shadow-pink-50/50 transition-all duration-300"
                            >
                              <div
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:-rotate-3 shadow-sm 
                  ${iconData.bg} ${iconData.color}`}
                              >
                                {iconData.icon}
                              </div>

                              <div className="flex-1">
                                <h4 className="font-bold text-[#214187] text-[15px] group-hover/item:text-[#F3056D] transition-colors leading-tight">
                                  {item.title}
                                </h4>
                                {/* <span className="text-[10px] text-gray-400 font-medium group-hover/item:text-pink-300 transition-colors uppercase line-clamp-1">
                                  {item.description}
                                </span> */}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50/80 p-5 border-t border-gray-100 flex justify-center items-center">
                    <Link
                      href="#"
                      className="flex items-center gap-2 text-[13px] font-black text-[#214187] hover:text-[#F3056D] transition-all group/all"
                    >
                      {isBangla
                        ? "সবগুলো কোর্স এক সাথে দেখুন"
                        : "View All Our Fun Courses"}
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm group-hover/all:translate-x-1 transition-transform">
                        <ArrowRight size={14} />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- SKILLS MODAL (REDESIGNED) --- */}
          <div className="relative">
            <button
              onClick={() => handleDropdownClick("skills")}
              className={`flex items-center leading-auto tracking-[-2%] text-sm gap-2.5 cursor-pointer font-medium transition-all text-primary`}
            >
              {t?.skills || "Skills"}
              <div
                className={` transition-transform duration-300 ${
                  activeDropdown === "skills" ? "rotate-180" : ""
                }`}
              >
                <DropIcon />
              </div>
            </button>

            {activeDropdown === "skills" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-5 w-[600px] z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-white/50 p-8">
                  <div className="grid grid-cols-1 gap-4">
                    {(menuData.skills.length > 0
                      ? menuData.skills
                      : [
                          {
                            title: "Public Speaking",
                            description: "Speak to crowds confidently",
                          },
                          {
                            title: "Personality Dev",
                            description: "Build your soft skills",
                          },
                          {
                            title: "Interview Prep",
                            description: "Ace your next job interview",
                          },
                        ]
                    ).map((item, idx) => {
                      const icons = [
                        <FaMicrophone size={20} />,
                        <Users size={20} />,
                        <Award size={20} />,
                      ];
                      const IconComponent = icons[idx % icons.length];

                      return (
                        <Link
                          key={idx}
                          href="#"
                          className="group/skill flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-blue-200 hover:bg-white hover:shadow-md hover:shadow-blue-50/50 transition-all duration-300"
                        >
                          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover/skill:bg-white group-hover/skill:scale-110 transition-all shadow-sm">
                            {IconComponent}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-[#214187] text-sm group-hover/skill:text-blue-600">
                              {item.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {item.description}
                            </p>
                          </div>
                          <ChevronRight
                            size={16}
                            className="text-gray-300 group-hover/skill:text-blue-500"
                          />
                        </Link>
                      );
                    })}
                  </div>

                  {/* Bottom Banner */}
                  <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-500 mb-2">
                      {isBangla
                        ? "আপনার সম্ভাবনার সীমা বাড়ান"
                        : "Unlock your child's full potential"}
                    </p>
                    <Link
                      href="#"
                      className="text-sm font-bold text-[#F3056D] hover:underline"
                    >
                      {isBangla
                        ? "স্কিল ব্রোশার ডাউনলোড করুন"
                        : "Download Skill Brochure"}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- KIDS ENGLISH MODAL (REDESIGNED) --- */}
          <div className="relative">
            <button
              onClick={() => handleDropdownClick("kids")}
              className={`flex items-center leading-auto tracking-[-2%] text-sm cursor-pointer transition-all ${
                activeDropdown === "kids" ? "text-[#F3056D]" : "text-primary"
              }`}
            >
              <span>{t?.kidsEnglish || "Kids English"}</span>
              <div className="h-1.5 w-1.5 bg-primary rounded-full ml-1"></div>
            </button>

            {activeDropdown === "kids" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-5 w-[600px] z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-white/50 overflow-hidden flex">
                  <div className="flex-[3] p-8 pr-4">
                    <h3 className="text-[#214187] font-extrabold text-xl mb-6">
                      {isBangla ? "কোর্স লেভেল" : "English Levels"}
                    </h3>
                    <div className="space-y-4">
                      {(menuData.kids.length > 0
                        ? menuData.kids
                        : [
                            {
                              title: "Online",
                              description: "Fun learning for toddlers",
                            },
                            {
                              title: "Offline",
                              description: "Grammar and vocabulary",
                            },
                          ]
                      ).map((item, idx) => (
                        <Link
                          key={idx}
                          href="#"
                          className="group/kid block p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md hover:bg-blue-50/30 transition-all duration-300 relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 group-hover/kid:scale-110 transition-transform">
                              {idx === 0 ? (
                                <Video size={20} />
                              ) : (
                                <Library size={20} />
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-[#214187] text-sm">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover/kid:opacity-100 transition-opacity duration-300" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar: Assessment CTA */}
                  <div className="flex-2 bg-[#214187] p-6 flex flex-col justify-center items-center text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20">
                      <Brain size={32} className="text-yellow-300" />
                    </div>
                    <h5 className="font-bold text-lg mb-2 relative z-10">
                      {isBangla ? "ফ্রি অ্যাসেসমেন্ট" : "Free Assessment"}
                    </h5>
                    <p className="text-xs text-blue-100 mb-6 leading-relaxed relative z-10 max-w-[140px]">
                      {isBangla
                        ? "সঠিক লেভেল খুঁজুন"
                        : "Find the perfect level for your child."}
                    </p>
                    <Link
                      href="#"
                      className="w-full py-3 bg-white text-[#214187] text-xs font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg relative z-10"
                    >
                      {isBangla ? "টেস্ট নিন" : "Take Test Now"}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- MORE MODAL (REDESIGNED) --- */}
          <div className="relative">
            <button
              onClick={() => handleDropdownClick("more")}
              className={`flex items-center leading-auto tracking-[-2%] text-sm gap-2.5 cursor-pointer transition-all ${
                activeDropdown === "more" ? "text-[#F3056D]" : "text-primary"
              }`}
            >
              {t?.more || "More"}
              <div
                className={`transition-transform duration-300 ${
                  activeDropdown === "more" ? "rotate-180" : ""
                }`}
              >
                <DropIcon />
              </div>
            </button>

            {activeDropdown === "more" && (
              <div className="absolute top-full right-0 pt-5 w-[320px] z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-white/50 p-4 overflow-hidden">
                  <ul className="space-y-1">
                    {(menuData.more.length > 0
                      ? menuData.more
                      : [
                          {
                            title: "Free Courses",
                            description: "Learn our story",
                          },
                          {
                            title: "Live Courses",
                            description: "Join our team",
                          },
                          {
                            title: "Recorded Courses",
                            description: "Latest tips",
                          },
                          { title: "Shop", description: "Get in touch" },
                        ]
                    ).map((item, idx) => {
                      const icons = [
                        <ShoppingBag size={16} />,
                        <Megaphone size={16} />,
                        <Video size={16} />,
                        <Globe size={16} />,
                      ];
                      const Icon = icons[idx % icons.length];

                      return (
                        <li key={idx}>
                          <Link
                            href="#"
                            className="group/item flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-pink-50 transition-all duration-300"
                          >
                            <div className="w-8 h-8 rounded-xl bg-gray-50 group-hover/item:bg-white group-hover/item:shadow-sm flex items-center justify-center text-gray-400 group-hover/item:text-[#F3056D] transition-all duration-300">
                              {Icon}
                            </div>
                            <div className="flex-1">
                              <span className="font-semibold text-[#214187] text-sm group-hover/item:text-[#F3056D] transition-colors block">
                                {item.title}
                              </span>
                              <span className="text-[10px] text-gray-400 group-hover/item:text-pink-300">
                                {item.description}
                              </span>
                            </div>
                            <ChevronRight
                              size={14}
                              className="opacity-0 group-hover/item:opacity-100 transition-all text-[#F3056D]"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div>
            <a href="tel:01740176774">
              <Button px="px-2" hoverTextColor="#214187">
                <div className="flex items-center gap-1 ">
                  <span>{t?.callUs || "Call Us"}</span> <CallIcon />
                </div>
              </Button>
            </a>
          </div>
          <div onClick={toggleLanguage} className="cursor-pointer">
            <Button
              bgColor="#ffffff"
              textColor="#214187"
              highlightColor="#001D3A"
              darkShadowColor="#001D3A"
              hoverBgColor="#214187"
              hoverTextColor="white"
              px="px-3.5"
              icon=<BnEnLogo />
            >
              {isBangla ? "EN" : "BN"}
            </Button>
          </div>
          <div>
            <Link href={`/${isBangla ? "bn" : "en"}/signin`}>
              <Button
                bgColor="#F3056D"
                darkShadowColor="#F3066E"
                highlightColor="#FF8FCA"
                hoverTextColor="#F3056D"
                px="px-3.5"
                icon=<UserIcon />
              >
                {t?.login || "Login"}
              </Button>
            </Link>
          </div>
        </div>

        {/* --- MOBILE TOGGLE BUTTON --- */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <CloseIcon /> : <ModernMenuIcon />}
        </button>
      </div>

      {/* --- MOBILE MENU CONTENT (UNCHANGED) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bottom-0 z-40 min-h-screen w-full bg-white shadow-2xl border-t border-gray-100 overflow-y-auto animate-in slide-in-from-top-2 duration-300">
          <div className="container mx-auto py-8 px-4 flex flex-col gap-8">
            {/* User Greeting/Login Area */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <UserIcon />
                </div>
                <span className="text-[#214187] font-bold">Welcome</span>
              </div>
              <Link
                href={`/${isBangla ? "bn" : "en"}/signin`}
                className="text-sm font-bold text-[#F3056D]"
              >
                Login
              </Link>
            </div>

            {/* Big Book Button */}
            <button className="w-full cursor-pointer relative px-6 py-4 rounded-[50px] font-bold text-white transition-all duration-300 bg-[#F3056D] shadow-[inset_0_1.5px_0_0_#FF8FCA,0_1.5px_1.5px_0_rgba(243,6,110,0.3),0_0_0_1.5px_#C6005F,0_3.01px_7.52px_0_rgba(243,6,110,0.3)] hover:bg-white hover:text-[#F3056D] hover:shadow-[0_1.5px_1.5px_0_rgba(243,6,110,0.2),0_0_0_1.5px_#F3056D,0_3.01px_7.52px_0_rgba(243,6,110,0.1)] flex items-center justify-center gap-3">
              <div className="text-xl text-white transition-colors duration-300">
                <MulStar />
              </div>
              {t?.bookAFreeClass || "Book A Free Class"}
            </button>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-3">
              <MobileMenuItem
                href={`/${isBangla ? "bn" : "en"}/courses`}
                icon={<BookOpen size={20} />}
              >
                {t?.allCourses || "All Courses"}
              </MobileMenuItem>
              <MobileMenuItem href="#" icon={<Award size={20} />}>
                {t?.skills || "Skills"}
              </MobileMenuItem>
              <MobileMenuItem href="#" icon={<Smile size={20} />}>
                {t?.kidsEnglish || "Kids English"}
              </MobileMenuItem>
              <MobileMenuItem href="#" icon={<ChevronRight size={20} />}>
                {t?.more || "More"}
              </MobileMenuItem>
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
              <a href="tel:01740176774">
                <Button
                  icon=<CallIcon />
                  px="px-4"
                  hoverTextColor="#214187"
                  className="w-full h-12 flex items-center justify-center"
                >
                  {t?.callUs || "Call Us"}
                </Button>
              </a>
              <div onClick={toggleLanguage}>
                <Button
                  bgColor="#F3F4F6"
                  textColor="#214187"
                  hoverBgColor="#214187"
                  hoverTextColor="white"
                  px="px-4"
                  icon=<BnEnLogo />
                  className="w-full h-12 flex items-center justify-center"
                >
                  {isBangla ? "English" : "বাংলা"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Freebooking
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </nav>
  );
};

// --- Sub Component for Mobile Menu Item ---
const MobileMenuItem = ({
  children,
  href,
  icon,
}: {
  children: React.ReactNode;
  href: string;
  icon: React.ReactNode;
}) => (
  <Link
    href={href}
    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-[#F3056D]/5 text-[#214187] hover:text-[#F3056D] transition-all group border border-transparent hover:border-[#F3056D]/10"
  >
    <div className="p-2 rounded-lg bg-white shadow-sm text-gray-400 group-hover:text-[#F3056D] group-hover:scale-110 transition-all">
      {icon}
    </div>
    <span className="font-semibold text-lg">{children}</span>
    <div className="ml-auto opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
      <ChevronRight size={20} />
    </div>
  </Link>
);

export default NavHeader;
