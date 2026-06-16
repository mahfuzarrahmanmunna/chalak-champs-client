"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAuth } from "@/app/context/AuthContext"; // ADDED IMPORT

// --- React Icons ---
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaFacebookMessenger,
  FaWhatsapp,
} from "react-icons/fa";

// --- Lucide Icons ---
import {
  ArrowRight,
  BookOpen,
  Award,
  ChevronRight,
  Smile,
  Palette,
  Calculator,
  Sparkles,
  Brain,
  Users,
  Megaphone,
  Globe,
  ShoppingBag,
  Video,
  Library,
  Plus,
  Minus,
  X,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";

// --- Your Local Imports ---
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
import { useBooking } from "@/app/providers/BookingProvider";
import Hambar from "./Hambar";
import CloseHamburger from "./CloseHamburger";

// --- Modern Menu Icon Component ---
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
  const { toast, openBooking } = useBooking();

  // State for Mobile Dropdowns
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<
    string | null
  >(null);

  // --- AUTH STATE (ADDED) ---
  const { appUser } = useAuth();

  const context = useLanguage();

  // Fallback values
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

  // Click Outside to Close Desktop Dropdown
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownClick = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleMobileDropdownClick = (name: string) => {
    if (activeMobileDropdown === name) {
      setActiveMobileDropdown(null);
    } else {
      setActiveMobileDropdown(name);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 px-2 transition-all duration-300 border-b-2 border-gray-200/50 h-24 overflow-visible relative
        ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b-2 border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]  "
            : "bg-white/80 border-b-2 border-gray-200/50"
        }`}
    >
      <div className="container mx-auto flex items-center justify-between py-1">
        <div className={`relative  top-1 flex md:z-50`}>
          {" "}
          <Link href={`/${isBangla ? "bn" : "en"}`}>
            <NavLogo />
          </Link>
        </div>

        {/* --- DESKTOP MIDDLE SECTION --- */}
        <div className="hidden md:flex items-center gap-7"></div>

        {/* --- DESKTOP RIGHT SECTION --- */}
        <div className="hidden md:flex items-center gap-6" ref={dropdownRef}>
          <div>
            <button
              onClick={openBooking}
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

          {/* --- UPDATED DESKTOP COURSES DROPDOWN --- */}
          <div className="relative">
            <Link
              href={`/${isBangla ? "bn/courses" : "en/courses"}`}
              className={`flex items-center font-medium flex gap-2 leading-auto tracking-[-2%] text-sm cursor-pointer transition-all ${
                activeDropdown === "courses" ? "text-[#F3056D]" : "text-primary"
              }`}
            >
              <span>{t?.allCourses || "All Courses"}</span>
            </Link>

            {/* Desktop Dropdown Menu */}
            {activeDropdown === "courses" && (
              <div className="hidden absolute top-full left-0 mt-4 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 origin-top">
                <div className="flex flex-col gap-1">
                  {t.menus?.courses?.map((course: any, index: number) => (
                    <Link
                      key={index}
                      href={`/${isBangla ? "bn" : "en"}/courses`}
                      className="group flex flex-col p-3 rounded-xl hover:bg-blue-50/50 transition-all duration-200"
                    >
                      <span className="font-bold text-gray-800 group-hover:text-[#214187] text-sm">
                        {course.title}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5 leading-tight">
                        {course.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* --- KIDS ENGLISH MODAL --- */}
          <div className="relative">
            <Link
              href={`${isBangla ? "/bn/coursedetails" : "/en/coursedetails"}`}
            >
              <button
                className={`flex items-center font-medium flex gap-2 leading-auto tracking-[-2%] text-sm cursor-pointer transition-all ${
                  activeDropdown === "kids" ? "text-[#F3056D]" : "text-primary"
                }`}
              >
                <span>{t?.kidsEnglish || "Kids English"}</span>
                <div
                  className={` transition-transform duration-300 ${
                    activeDropdown === "kids" ? "rotate-180" : ""
                  }`}
                ></div>
              </button>
            </Link>
          </div>

          {/* --- CALL US --- */}
          <div>
            <a href="tel:01740176774">
              <Button px="px-3" hoverTextColor="#214187" icon=<CallIcon />>
                <div className="flex items-center gap-1 ">
                  <span>{t?.callUs || "Call Us"}</span>
                </div>
              </Button>
            </a>
          </div>

          {/* --- LANGUAGE SWITCHER --- */}
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

          {/* --- LOGIN / PROFILE BUTTON (UPDATED) --- */}
          {appUser ? (
            <Link href={`/${isBangla ? "bn" : "en"}/dashboard`}>
              <Button
                bgColor="#F3056D"
                darkShadowColor="#F3066E"
                highlightColor="#FF8FCA"
                hoverTextColor="#F3056D"
                px="px-3.5"
                icon=<UserIcon />
              >
                {isBangla ? "প্রোফাইল" : "Profile"}
              </Button>
            </Link>
          ) : (
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
          )}
        </div>

        {/* --- MOBILE TOGGLE BUTTON --- */}
        <button
          className="md:hidden pr-4 text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            // --- Playful Close Icon (Rounded X) ---
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#214187]"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            // --- Playful Hamburger Icon (Rounded Lines) ---
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#214187]"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* --- PROFESSIONAL MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-white animate-in slide-in-from-top-2 duration-300 flex flex-col h-screen overflow-hidden">
          {/* --- STICKY HEADER (Logo + Close Button) --- */}
          <div className="flex-shrink-0  flex items-center justify-between px-5 py-4 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm z-20">
            <div className="w-24">
              <NavLogo />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-linear-to-r transition-colors"
              aria-label="Close Menu"
            >
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
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* --- SCROLLABLE CONTENT AREA --- */}
          <div className="flex-1 overflow-y-auto relative">
            {/* Decorative Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-[10%] -left-[10%] w-[40rem] h-[40rem] bg-pink-100/40 rounded-full blur-[100px]"></div>
              <div className="absolute top-[40%] -right-[20%] w-[30rem] h-[30rem] bg-blue-100/40 rounded-full blur-[80px]"></div>
            </div>

            <div className="container mx-auto px-5 py-8 relative z-10 flex flex-col min-h-full">
              {/* Call and Bilingual Button */}
              <div className="flex mb-8 gap-3">
                <div className="flex w-full">
                  <a
                    href="tel:01740176774"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      className="w-full"
                      px="px-3"
                      hoverTextColor="#214187"
                      icon=<CallIcon />
                    >
                      <div className="flex w-full items-center gap-1 ">
                        <span>{t?.callUs || "Call Us"}</span>
                      </div>
                    </Button>
                  </a>
                </div>
                <div
                  onClick={() => {
                    toggleLanguage();
                  }}
                  className="cursor-pointer"
                >
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
              </div>

              {/* BOOK FREE CLASS BUTTON */}
              <div className="mb-8">
                <button
                  onClick={() => {
                    openBooking();
                    setIsMobileMenuOpen(false);
                  }}
                  className="cursor-pointer px-5 leading-auto tracking-[-2%] relative py-3 w-full rounded-[50px] font-bold text-white transition-all duration-300 bg-[#F3056D] shadow-[inset_0_1.5px_0_0_#FF8FCA,0_1.5px_1.5px_0_rgba(243,6,110,0.3),0_0_0_1.5px#C6005F,0_3.01px_7.52px_0_rgba(243,6,110,0.3)] hover:bg-white hover:text-[#F3056D] hover:shadow-[0_1.5px_1.5px_0_rgba(243,6,110,0.2),0_0_0_1.5px#F3056D,0_3.01px_7.52px_0_rgba(243,6,110,0.1)]"
                >
                  <div className="absolute top-1.75 left-33 text-base transition-colors duration-300">
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

              {/* --- UPDATED MOBILE COURSES MENU --- */}
              <div className="mb-6">
                <MobileNavDropdown
                  title={t?.allCourses || "Courses"}
                  icon={<BookOpen size={22} />}
                  items={t.menus?.courses || []}
                  isOpen={activeMobileDropdown === "courses"}
                  onToggle={() => handleMobileDropdownClick("courses")}
                />
              </div>

              {/* --- UPDATED: PROFESSIONAL KIDS ENGLISH CARD --- */}
              <div className="mb-8">
                <Link
                  href={`${isBangla ? "/bn/coursedetails" : "/en/coursedetails"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group block w-full"
                >
                  <div className="relative overflow-hidden bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 group-hover:border-[#F3056D]/30 group-hover:shadow-[0_20px_50px_-12px_rgba(243,5,109,0.2)]">
                    {/* Decorative animated blob */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-blue-100 to-pink-100 rounded-full blur-2xl opacity-70 transition-transform duration-500 group-hover:scale-110"></div>

                    <div className="relative z-10 flex items-center gap-5">
                      {/* Icon Container */}
                      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#214187] to-[#163676] text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Smile size={28} className="fill-white/20" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#214187] mb-1">
                          {t?.kidsEnglish || "Kids English"}
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Interactive Learning
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#214187] group-hover:bg-[#F3056D] group-hover:text-white transition-colors">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="flex-grow"></div>

              {/* --- SOCIAL LINKS SECTION --- */}
              <div className="mb-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pl-1">
                  {isBangla ? "সোশ্যাল মিডিয়া" : "Follow Us"}
                </p>
                <div className="flex gap-3 flex-wrap">
                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/chalakchamps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="text-[#1777F2] bg-[#1777F21A] h-10 w-10.5 flex items-center justify-center rounded-lg transition-transform hover:scale-105">
                      <FaFacebookF size={18} />
                    </div>
                  </a>

                  {/* Youtube */}
                  <a
                    href="https://www.youtube.com/@chalakchamps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="text-[#FE0000] bg-[#FE00001A] h-10 w-10.5 flex items-center justify-center rounded-lg transition-transform hover:scale-105">
                      <FaYoutube size={18} />
                    </div>
                  </a>

                  {/* Instagram */}
                  <div className="flex-shrink-0 relative">
                    <svg
                      width="0"
                      height="0"
                      className="absolute pointer-events-none"
                    >
                      <linearGradient
                        id="insta-grad"
                        x1="0%"
                        y1="50%"
                        x2="100%"
                        y2="50%"
                      >
                        <stop offset="0%" stopColor="#FFDD55" />
                        <stop offset="50%" stopColor="#FF543E" />
                        <stop offset="100%" stopColor="#C837AB" />
                      </linearGradient>
                    </svg>
                  </div>

                  {/* Messenger */}
                  <a
                    href="https://m.me/chalakchamps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="text-[#1777F2] bg-[#448AFF1A] h-10 w-10.5 flex items-center justify-center rounded-lg transition-transform hover:scale-105">
                      <FaFacebookMessenger size={18} />
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/8801740176774?text=Hello!%20I%20want%20to%20know%20more%20about%20Chalak%20Champs."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="text-[#25D366] bg-[#25D3661A] h-10 w-10.5 flex items-center justify-center rounded-lg transition-transform hover:scale-105">
                      <FaWhatsapp size={18} />
                    </div>
                  </a>
                </div>
              </div>

              {/* --- BOTTOM UTILITY BAR --- */}
              <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-2 flex items-center justify-between shadow-sm mb-6">
                {/* Language Switcher */}
                <button
                  onClick={() => {
                    toggleLanguage();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Globe size={18} className="text-[#214187]" />
                  {isBangla ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
                </button>

                <div className="w-px h-8 bg-gray-200"></div>

                {/* Login Link / Profile Link (UPDATED) */}
                {appUser ? (
                  <Link
                    href={`/${isBangla ? "bn" : "en"}/dashboard`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-[#214187] hover:bg-blue-50 transition-colors"
                  >
                    <UserIcon />
                    {isBangla ? "প্রোফাইল" : "Profile"}
                  </Link>
                ) : (
                  <Link
                    href={`/${isBangla ? "bn" : "en"}/signin`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-[#214187] hover:bg-blue-50 transition-colors"
                  >
                    <UserIcon />
                    {t?.login || "Login"}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// --- PROFESSIONAL MOBILE DROPDOWN COMPONENT (Used for Courses) ---
const MobileNavDropdown = ({ title, icon, items, isOpen, onToggle }: any) => {
  const context = useLanguage();

  // Fallback values
  const t = context?.t || {};
  const isBangla = context?.isBangla || false;

  return (
    <div className="w-full group">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-300 border relative overflow-hidden ${
          isOpen
            ? "bg-white border-[#214187]/20 shadow-[0_8px_20px_-5px_rgba(33,65,135,0.15)]"
            : "bg-white/80 border-gray-100 hover:border-[#214187]/30 hover:shadow-md"
        }`}
      >
        {/* Background Gradient Accent */}
        <div
          className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#214187]/10 to-transparent rounded-bl-full transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        <div className="flex items-center gap-4 relative z-10">
          <div
            className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm ${
              isOpen
                ? "bg-[#214187] text-white shadow-[#214187]/30"
                : "bg-gray-50 text-[#214187] group-hover:bg-[#214187] group-hover:text-white"
            }`}
          >
            {icon}
          </div>
          <span
            className={`font-bold text-lg tracking-tight transition-colors ${
              isOpen ? "text-[#214187]" : "text-gray-800"
            }`}
          >
            {title}
          </span>
        </div>

        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${
            isOpen
              ? "bg-[#214187] text-white rotate-180"
              : "bg-gray-100 text-gray-500 group-hover:bg-[#214187] group-hover:text-white"
          }`}
        >
          <ChevronRight size={18} strokeWidth={3} />
        </div>
      </button>

      {/* Dropdown Content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pl-4 pr-1 pb-2 space-y-2">
          {items.map((item: any, idx: number) => (
            <Link
              key={idx}
              href={`/${isBangla ? "/bn" : "en"}/courses`}
              onClick={() => {
                /* Add handler to close parent if needed */
              }}
              className="group/link block pl-4 pr-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-[#214187] bg-white hover:bg-[#F0F4FF] border border-transparent hover:border-[#214187]/10 transition-all duration-200 flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-gray-800 block">
                  {item.title}
                </span>
                <span className="text-xs text-gray-500 block mt-1">
                  {item.description}
                </span>
              </div>
              <ArrowRight
                size={14}
                className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavHeader;
