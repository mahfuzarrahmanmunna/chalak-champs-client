"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import {
  Home,
  BookOpen,
  User,
  Sparkles,
  MessageCircle,
  MessageSquare,
  X,
  Phone,
} from "lucide-react";

const MobileBottomNav = () => {
  const pathname = usePathname();
  const { getLink, isBangla } = useLanguage();
  const [isMessageMenuOpen, setIsMessageMenuOpen] = useState(false);

  // Toggle Message Menu
  const toggleMessageMenu = () => {
    setIsMessageMenuOpen((prev) => !prev);
  };

  // --- Bilingual Labels ---
  const labels = {
    home: isBangla ? "হোম" : "Home",
    courses: isBangla ? "কোর্সসমূহ" : "Courses",
    account: isBangla ? "অ্যাকাউন্ট" : "Account",
    message: isBangla ? "বার্তা" : "Message",
    contactUs: isBangla ? "যোগাযোগ করুন" : "Contact Us",
    callUs: isBangla ? "কল করুন" : "Call Us",
    whatsapp: "WhatsApp",
    messenger: "Messenger",
  };

  // Define your menu items (ORDER UPDATED: Home, Courses, Account, Message)
  const navItems = [
    {
      id: "home",
      label: labels.home,
      path: "/",
      icon: <Home size={24} />,
    },
    {
      id: "courses",
      label: labels.courses,
      path: "/courses",
      icon: <BookOpen size={24} />,
    },
    {
      id: "account",
      label: labels.account,
      path: "/signin", // Updated path to /signin
      icon: <User size={24} />,
    },
    {
      id: "message", // Moved to last position
      label: labels.message,
      path: "#",
      icon: <MessageCircle size={24} />,
      isAction: true,
    },
  ];

  // Helper to check active route robustly
  const checkIsActive = (path) => {
    const cleanPathname = pathname.replace(/\/$/, "");
    const cleanLink = getLink(path).replace(/\/$/, "");
    return cleanPathname === cleanLink;
  };

  return (
    <div className="md:hidden fixed -bottom-2 left-0 right-0 z-40 px-6 pointer-events-none">
      {/* --- Floating Container --- */}
      <div className="pointer-events-auto relative bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(33,65,135,0.15),0_8px_16px_rgba(243,5,109,0.1)] rounded-[2rem] flex justify-between items-center px-2 py-2 overflow-visible">
        {/* 
           --- MESSAGE POPUP MENU --- 
        */}
        {isMessageMenuOpen && (
          <div className="absolute bottom-full right-2 mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 w-52 flex flex-col gap-1 animate-in slide-in-from-bottom-4 fade-in duration-200 origin-bottom-right">
            {/* Close Button Header */}
            <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-100 mb-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {labels.contactUs}
              </span>
              <button
                onClick={() => setIsMessageMenuOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* WhatsApp Option */}
            <a
              href="https://wa.me/8801740176774?text=Hello!%20I%20want%20to%20know%20more%20about%20Chalak%20Champs."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-green-50 transition-colors group"
              onClick={() => setIsMessageMenuOpen(false)}
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <MessageSquare size={18} />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                {labels.whatsapp}
              </span>
            </a>

            {/* Messenger Option */}
            <a
              href="https://m.me/chalakchampsbd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-50 transition-colors group"
              onClick={() => setIsMessageMenuOpen(false)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0078FF] group-hover:bg-[#0078FF] group-hover:text-white transition-colors">
                <MessageCircle size={18} />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                {labels.messenger}
              </span>
            </a>

            {/* Call Us Option */}
            <a
              href="tel:01740176774"
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-purple-50 transition-colors group"
              onClick={() => setIsMessageMenuOpen(false)}
            >
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Phone size={18} />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                {labels.callUs}
              </span>
            </a>
          </div>
        )}

        {/* --- Navigation Items --- */}
        {navItems.map((item) => {
          const isActive = !item.isAction && checkIsActive(item.path);

          // Render Button (for Message)
          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={toggleMessageMenu}
                className={`relative flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl transition-all duration-300 group ${
                  isMessageMenuOpen
                    ? "bg-[#F3056D] shadow-md scale-95"
                    : "hover:bg-gray-50"
                }`}
              >
                {isMessageMenuOpen && (
                  <div className="absolute inset-0 rounded-2xl bg-[#F3056D] opacity-100" />
                )}
                <div
                  className={`relative z-10 transition-transform duration-300 ${
                    isMessageMenuOpen
                      ? "text-white"
                      : "text-gray-400 group-hover:text-[#F3056D]"
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`relative z-10 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                    isMessageMenuOpen
                      ? "text-white/90"
                      : "text-gray-400 group-hover:text-[#214187]"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          // Render Link (for Home, Courses, Account)
          const fullHref = getLink(item.path);
          return (
            <Link
              key={item.id}
              href={fullHref}
              className="relative flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl transition-all duration-300 group"
            >
              <div
                className={`absolute inset-0 rounded-2xl transition-all duration-300 ease-out ${
                  isActive
                    ? "bg-[#F3056D] shadow-md scale-100 opacity-100"
                    : "bg-transparent opacity-0 scale-90 group-hover:bg-gray-50 group-hover:opacity-50"
                }`}
              />
              <div
                className={`relative z-10 transition-transform duration-300 ${
                  isActive ? "translate-y-1" : "group-hover:-translate-y-1"
                }`}
              >
                {isActive && (
                  <div className="absolute -top-1 -right-1 text-[#FFD700] animate-pulse">
                    <Sparkles size={14} fill="currentColor" />
                  </div>
                )}
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
