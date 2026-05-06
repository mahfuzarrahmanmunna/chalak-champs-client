"use client";

import React, { useEffect, useState } from "react";
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

  // Access language context safely to avoid crash
  const context = useLanguage();

  // Fallback values in case context is undefined (prevents the specific error you faced)
  const t = context?.t || {};
  const isBangla = context?.isBangla || false;
  const toggleLanguage = context?.toggleLanguage || (() => {});
  const menuData = context?.menuData || {
    courses: [],
    skills: [],
    kids: [],
    more: [],
  };

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

  return (
    <nav
      className={`sticky top-0 z-50 px-2 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          : "bg-white "
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-1">
        <Link href={`/${isBangla ? "bn" : "en"}`}>
          <NavLogo />
        </Link>

        {/* --- DESKTOP MIDDLE SECTION (UNCHANGED CLASSES) --- */}
        <div className="hidden md:flex items-center gap-7">
          <div>
            <button className="cursor-pointer leading-auto tracking-[-2%] relative px-3.75  py-3 w-full rounded-[50px] font-bold text-white transition-all duration-300 bg-[#F3056D] shadow-[inset_0_1.5px_0_0_#FF8FCA,0_1.5px_1.5px_0_rgba(243,6,110,0.3),0_0_0_1.5px_#C6005F,0_3.01px_7.52px_0_rgba(243,6,110,0.3)]  hover:bg-white hover:text-[#F3056D]  hover:shadow-[0_1.5px_1.5px_0_rgba(243,6,110,0.2),0_0_0_1.5px_#F3056D,0_3.01px_7.52px_0_rgba(243,6,110,0.1)]">
              <div className="absolute top-1.75 left-1.5 text-base  transition-colors duration-300">
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
          <div className="group relative">
            <button className="flex items-center leading-auto tracking-[-2%] text-sm gap-2.5 text-[#F3066E] hover:bg-white hover:border hover:border-primary font-semibold bg-[#F3066E]/20 cursor-pointer px-3.5 py-3 rounded-lg">
              <div className="flex gap-1">
                <p>{t?.allCourses || "All Courses"}</p>
                <div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F3066E] absolute"></div>
                </div>
              </div>{" "}
              <DropIcon />
            </button>

            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[600px] hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-gray-100 p-6">
                <div className="grid grid-cols-12 gap-6">
                  {/* Featured Course Card */}
                  <div className="col-span-5 bg-gradient-to-br from-pink-50 to-white rounded-xl p-5 border border-pink-100 flex flex-col justify-center hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-[#F3056D] text-white text-[10px] font-bold uppercase rounded-md">
                        Most Popular
                      </span>
                    </div>
                    <h3 className="text-[#214187] font-bold text-lg mb-1">
                      Spoken English
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                      Master your fluency with industry experts.
                    </p>
                    <Link
                      href="#"
                      className="flex items-center gap-2 text-sm font-bold text-[#F3056D] group-hover/link:translate-x-1 transition-transform"
                    >
                      Explore Course <ArrowRight size={16} />
                    </Link>
                  </div>

                  {/* Course List Grid */}
                  <div className="col-span-7 grid grid-cols-2 gap-3">
                    {menuData.courses.length > 0
                      ? menuData.courses.slice(0, 6).map((item, idx) => (
                          <Link
                            key={idx}
                            href="#"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all group/item border border-transparent hover:border-gray-100"
                          >
                            <div className="w-8 h-8 rounded-lg bg-pink-50 text-[#F3056D] flex items-center justify-center shrink-0 group-hover/item:bg-[#F3056D] group-hover/item:text-white transition-colors">
                              <BookOpen size={16} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-[#214187] text-sm group-hover/item:text-[#F3056D]">
                                {item.title}
                              </h4>
                            </div>
                          </Link>
                        ))
                      : // Placeholder for visual proof
                        [1, 2, 3, 4].map((i) => (
                          <Link
                            key={i}
                            href="#"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all group/item border border-transparent hover:border-gray-100"
                          >
                            <div className="w-8 h-8 rounded-lg bg-pink-50 text-[#F3056D] flex items-center justify-center shrink-0 group-hover/item:bg-[#F3056D] group-hover/item:text-white transition-colors">
                              <BookOpen size={16} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-[#214187] text-sm group-hover/item:text-[#F3056D]">
                                Business English
                              </h4>
                            </div>
                          </Link>
                        ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
                  <Link
                    href="#"
                    className="text-xs font-bold text-[#214187] hover:text-[#F3056D] transition-colors"
                  >
                    {isBangla ? "সব কোর্স দেখুন" : "View All Courses"}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* --- SKILLS MODAL (REDESIGNED) --- */}
          <div className="group relative">
            <button className="flex items-center leading-auto tracking-[-2%] text-sm gap-2.5 text-[#F3066E] cursor-pointer">
              {t?.skills || "Skills"}
            </button>

            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[500px] hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-gray-100 p-6">
                <div className="flex gap-6 h-full">
                  {/* Skill Categories */}
                  <div className="flex-1 space-y-5">
                    <div>
                      <h4 className="text-[#214187] font-bold text-sm mb-3 flex items-center gap-2">
                        <Award size={16} className="text-[#F3056D]" />
                        Communication
                      </h4>
                      <ul className="space-y-2 pl-1">
                        {["Public Speaking", "Business Writing", "Debate"].map(
                          (skill, i) => (
                            <li key={i}>
                              <Link
                                href="#"
                                className="block text-sm text-gray-600 hover:text-[#F3056D] font-medium hover:pl-1 transition-all"
                              >
                                {skill}
                              </Link>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[#214187] font-bold text-sm mb-3 flex items-center gap-2">
                        <GraduationCap size={16} className="text-[#F3056D]" />
                        Professional
                      </h4>
                      <ul className="space-y-2 pl-1">
                        {["Leadership", "Time Management", "Teamwork"].map(
                          (skill, i) => (
                            <li key={i}>
                              <Link
                                href="#"
                                className="block text-sm text-gray-600 hover:text-[#F3056D] font-medium hover:pl-1 transition-all"
                              >
                                {skill}
                              </Link>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Visual CTA Side */}
                  <div className="w-1/3 bg-[#214187] rounded-xl p-4 flex flex-col items-center justify-center text-center text-white">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                      <Star size={20} className="text-yellow-400" />
                    </div>
                    <h5 className="font-bold text-sm mb-1">Free Assessment</h5>
                    <p className="text-[10px] text-gray-300 mb-4 leading-tight">
                      Test your skill level now
                    </p>
                    <Link
                      href="#"
                      className="w-full py-1.5 bg-white text-[#214187] text-[10px] font-bold rounded hover:bg-gray-100"
                    >
                      Take Test
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- KIDS ENGLISH MODAL (REDESIGNED) --- */}
          <div className="group relative">
            <button className="flex text-primary leading-auto tracking-[-2%] text-sm cursor-pointer items-center gap-2">
              <span>{t?.kidsEnglish || "Kids English"}</span>
              <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
            </button>

            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[500px] hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-gray-100 p-6">
                <div className="flex gap-4">
                  {menuData.kids.length > 0
                    ? menuData.kids.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex-1 relative group/card cursor-pointer overflow-hidden rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative p-5 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl mb-3 group-hover/card:scale-110 transition-transform duration-300 shadow-sm">
                              {idx === 0 ? (
                                <Smile size={24} />
                              ) : idx === 1 ? (
                                <Award size={24} />
                              ) : (
                                <Star size={24} />
                              )}
                            </div>
                            <h4 className="font-bold text-[#214187] text-sm mb-2 group-hover/card:text-blue-600">
                              {item.title}
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4">
                              {item.description}
                            </p>
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wide opacity-0 group-hover/card:opacity-100 transform translate-y-2 group-hover/card:translate-y-0 transition-all duration-300">
                              Learn More
                            </span>
                          </div>
                        </div>
                      ))
                    : [1, 2].map((i) => (
                        <div
                          key={i}
                          className="flex-1 relative group/card cursor-pointer overflow-hidden rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative p-5 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl mb-3 group-hover/card:scale-110 transition-transform duration-300 shadow-sm">
                              <Smile size={24} />
                            </div>
                            <h4 className="font-bold text-[#214187] text-sm mb-2 group-hover/card:text-blue-600">
                              Juniors English
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4">
                              Fun learning for ages 6-10.
                            </p>
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wide opacity-0 group-hover/card:opacity-100 transform translate-y-2 group-hover/card:translate-y-0 transition-all duration-300">
                              Learn More
                            </span>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>

          {/* --- MORE MODAL (REDESIGNED) --- */}
          <div className="group relative">
            <button className="flex items-center leading-auto tracking-[-2%] text-sm gap-2.5 text-primary cursor-pointer">
              {t?.more || "More"}
              <DropIcon />
            </button>

            <div className="absolute top-full right-0 pt-4 w-[400px] hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-gray-100 p-6">
                <ul className="space-y-1">
                  {menuData.more?.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        href="#"
                        className="group/item flex items-center justify-between px-4 py-3.5 rounded-lg hover:bg-pink-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-50 group-hover/item:bg-white group-hover/item:shadow-sm flex items-center justify-center text-gray-400 group-hover/item:text-[#F3056D] transition-all">
                            <ChevronRight size={16} />
                          </div>
                          <span className="font-semibold text-[#214187] text-sm group-hover/item:text-[#F3056D] transition-colors">
                            {item.title}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* --- DESKTOP RIGHT SECTION (UNCHANGED) --- */}
        <div className="hidden md:flex items-center gap-4">
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

      {/* --- MOBILE MENU CONTENT (FULL HEIGHT OVERLAY) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bottom-0 z-40 h-[calc(100vh-72px)] w-full bg-white shadow-2xl border-t border-gray-100 overflow-y-auto animate-in slide-in-from-top-2 duration-300">
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
