"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { Home, BookOpen, User, Sparkles, MessageCircle, X } from "lucide-react";

// --- WhatsApp SVG Icon ---
const WhatsAppIcon = ({ size = 18, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// --- Messenger SVG Icon ---
const MessengerIcon = ({ size = 18, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M.001 11.639C.001 4.949 5.241 0 12.001 0S24 4.95 24 11.639c0 6.689-5.24 11.639-12 11.639-1.21 0-2.38-.16-3.47-.46a.96.96 0 00-.64.05l-2.39 1.05a.96.96 0 01-1.35-.85l-.07-2.14a.97.97 0 00-.32-.68A11.39 11.389 0 01.002 11.64zm8.32-2.19l-3.52 5.6c-.35.53.32 1.139.82.75l3.79-2.87c.26-.2.6-.2.87 0l2.8 2.1c.84.63 2.04.4 2.6-.48l3.52-5.6c.35-.53-.32-1.13-.82-.75l-3.79 2.87c-.25.2-.6.2-.86 0l-2.8-2.1a1.8 1.8 0 00-2.61.48z" />
  </svg>
);

// --- Phone/Call SVG Icon ---
const PhoneCallIcon = ({ size = 18, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
  </svg>
);

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
      path: "/signin",
      icon: <User size={24} />,
    },
    {
      id: "message",
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
    <div className="md:hidden fixed -bottom-4 left-0 right-0 z-40 px-6 pointer-events-none">
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
                <WhatsAppIcon size={18} />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                {labels.whatsapp}
              </span>
            </a>

            {/* Messenger Option */}
            <a
              href="https://m.me/chalakchamps"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-50 transition-colors group"
              onClick={() => setIsMessageMenuOpen(false)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0078FF] group-hover:bg-[#0078FF] group-hover:text-white transition-colors">
                <MessengerIcon size={18} />
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
                <PhoneCallIcon size={18} />
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
