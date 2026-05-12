"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext"; 
import {
  Home,
  BookOpen,
  Compass,
  User,
  Sparkles,
  Settings,
} from "lucide-react";

const MobileBottomNav = () => {
  const pathname = usePathname();
  const { getLink } = useLanguage(); // Get the link helper

  // Define your menu items with internal paths (without /en/ or /bn/)
  const navItems = [
    {
      id: "home",
      label: "Home",
      path: "/", // getLink will handle /en/ or /bn/
      icon: <Home size={24} />,
    },
    {
      id: "courses",
      label: "Courses",
      path: "/courses",
      icon: <BookOpen size={24} />,
    },
    {
      id: "explore",
      label: "Explore",
      path: "/explore",
      icon: <Compass size={24} />,
    },
    {
      id: "account",
      label: "Account",
      path: "/account",
      icon: <User size={24} />,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-6 pointer-events-none">
      {/* --- Floating Container --- */}
      <div className="pointer-events-auto relative  bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(33,65,135,0.15),0_8px_16px_rgba(243,5,109,0.1)] rounded-[2rem] flex justify-between items-center px-2 py-2 overflow-hidden">
        {/* --- Decorative Gradient Blob (Playful Touch) --- */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* --- Navigation Items --- */}
        {navItems.map((item) => {
          // Generate the full link based on current language (e.g., /en/courses)
          const fullHref = getLink(item.path);

          // Check if active. Use getLink to compare apples to apples (e.g., /en/courses === /en/courses)
          const isActive = pathname === fullHref;

          return (
            <Link
              key={item.id}
              href={fullHref}
              className="relative flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl transition-all duration-300 group"
            >
              {/* Active Background Pill */}
              <div
                className={`absolute inset-0 rounded-2xl transition-all duration-300 ease-out ${
                  isActive
                    ? "bg-[#F3056D] shadow-md scale-100 opacity-100"
                    : "bg-transparent opacity-0 scale-90 group-hover:bg-gray-50 group-hover:opacity-50"
                }`}
              />

              {/* Icon Wrapper */}
              <div
                className={`relative z-10 transition-transform duration-300 ${
                  isActive ? "translate-y-1" : "group-hover:-translate-y-1"
                }`}
              >
                {/* Sparkles effect for active items */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 text-[#FFD700] animate-pulse">
                    <Sparkles size={14} fill="currentColor" />
                  </div>
                )}

                {/* Change icon color based on state */}
                <div
                  className={`${
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-[#F3056D]"
                  }`}
                >
                  {item.icon}
                </div>
              </div>

              {/* Label Text */}
              <span
                className={`relative z-10 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                  isActive
                    ? "text-white/90"
                    : "text-gray-400 group-hover:text-[#214187]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Safe area padding for iPhone home indicator */}
      <div className="h-6 w-full"></div>
    </div>
  );
};

export default MobileBottomNav;
