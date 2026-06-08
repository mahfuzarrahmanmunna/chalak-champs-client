"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import { useAuth } from "@/app/hooks/useAuth";
import {
  Home,
  BookOpen,
  Calendar,
  BarChart3,
  MessageCircle,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Sparkles,
  Zap,
} from "lucide-react";
import gsap from "gsap";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    badge: "2 New", // Dynamic badge logic simulation
  },
  {
    name: "My Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
    badge: "3 Active",
  },
  {
    name: "Schedule",
    href: "/dashboard/schedule",
    icon: Calendar,
    badge: null,
  },
  {
    name: "Grades",
    href: "/dashboard/grades",
    icon: BarChart3,
    badge: null,
  },
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: MessageCircle,
    badge: "2 New",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    badge: null,
  },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { colors, isDarkMode } = useTheme();
  const { currentUser, logout } = useAuth();
  const navRef = useRef<HTMLElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/signin";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // --- GSAP ANIMATIONS ---
  useEffect(() => {
    // Ensure we only animate when sidebar is OPEN and ready
    if (navRef.current && sidebarOpen) {
      // Wrap in RAF to ensure layout is calculated correctly
      const ctx = gsap.context();
      requestAnimationFrame(() => {
        if (navRef.current && navRef.current.children.length > 0) {
          gsap.fromTo(navRef.current.children, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
          });

          // Animate Logo Floating
          gsap.fromTo(".logo-icon-container", {
            rotation: 0,
            scale: 1,
            duration: 0.5,
            repeat: -1,
            repeatDelay: 2,
            yoyo: true,
            ease: "elastic.out(1, 0.3)",
          });
        }
      });
    }
  }, [sidebarOpen]); // Re-run animation every time sidebar state changes
  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Playful & Professional Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-500 ease-[cubic-bezier(0.19, 1, 0.22, 1)] border-r border-white/20 dark:border-white/10 backdrop-blur-xl flex flex-col justify-between shadow-2xl bg-white/60 dark:bg-[#1e1b2e] ${
          sidebarOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full shadow-none opacity-80"
        }`}
      >
        {/* Logo Area with Sparkles */}
        <div className="flex items-center justify-between h-24 px-6 relative">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            {/* Animated Logo Container */}
            <div className="relative logo-icon-container">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 group-hover:opacity-100 transition-all duration-500 rounded-full"></div>
              <div className="relative w-14 h-14 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg border-2 border-white dark:border-indigo-400/50">
                <Sparkles className="h-7 w-7 text-white drop-shadow-md fill-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black dark:text-white tracking-tight font-extrabold leading-none">
                Learn<span className="text-purple-600">Pro</span>
              </h1>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest mt-0.5">
                Student Portal
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </button>
        </div>

        {/* Navigation with Staggered Animations */}
        <nav
          className="flex-1 px-4 py-6 space-y-2 overflow-y-auto"
          ref={navRef}
        >
          <p className="px-4 text-xs font-bold text-indigo-400 dark:text-indigo-300 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Zap size={14} /> Menu
          </p>
          {navigation.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="nav-item group relative overflow-hidden"
              >
                {/* Background Blob Effect on Hover */}
                <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl scale-x-0 group-hover:scale-100 origin-left transition-transform duration-300 ease-out"></div>

                <div className="relative flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white dark:group-hover:bg-[#2e374f]">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl shadow-sm transition-colors duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-purple-200/50 scale-110"
                          : "bg-white dark:bg-gray-800 text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-400 shadow-gray-100 dark:shadow-none"
                      }`}
                    >
                      {isActive && <Zap size={20} className="animate-spin" />}
                      {!isActive && <item.icon />}
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">
                      {item.name}
                    </span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold text-white bg-rose-500 rounded-full shadow-md px-2 py-0.5 animate-bounce">
                      {item.badge}
                    </span>
                  )}
                  {/* Arrow Indicator */}
                  <ChevronDown className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Playful Profile Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-white/10 mt-auto">
          <div className="relative p-4 rounded-3xl bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 to-gray-900 shadow-inner">
            {/* Shiny animated border-top */}
            <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-indigo-300 via-purple-300 to-transparent"></div>

            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 blur-md opacity-20"></div>
                <img
                  src={
                    currentUser?.photoURL ||
                    "https://randomuser.me/api/portraits/lego/1.jpg"
                  }
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover ring-4 ring-white dark:ring-indigo-500/30"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                  {currentUser?.displayName || "Student"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {currentUser?.email || "student@email.com"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-indigo-600 bg-white hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-400 dark:bg-indigo-600 dark:text-white dark:border-indigo-400 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header with Grasp Animations */}
        <header
          className="relative z-30 h-24 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center gap-4">
            {/* Playful Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 active:scale-95 transition-transform duration-300"
            >
              <Menu className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </button>

            {/* Magic Search Bar */}
            <div className="hidden sm:block relative w-96">
              {/* Search Label */}
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200 text-gray-400 text-xs font-bold uppercase tracking-wider pointer-events-none`}
              >
                Search...
              </div>
              <input
                type="text"
                placeholder="Find courses or lessons..."
                className="block w-full pl-10 pr-4 py-3 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-transparent focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all text-sm"
              />
              <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-md pointer-events-none">
                ⌘K
              </kbd>
            </div>

            {/* Notification Bell with Animation */}
            <div className="relative">
              <button className="relative p-3 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300">
                <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-900"></span>
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 p-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 blur-md opacity-20"></div>
                  <img
                    src={
                      currentUser?.photoURL ||
                      "https://randomuser.me/api/portraits/lego/1.jpg"
                    }
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover ring-4 ring-white dark:ring-indigo-500/30"
                  />
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-300" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-4 w-64 rounded-2xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-2">
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 p-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <Link
                      href="/dashboard/help"
                      className="flex items-center gap-2 p-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Help
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 p-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full p-2.5 rounded-lg text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto relative">
          {/* Decorative Background Elements for Kids Theme */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200 rounded-full blur-2xl opacity-50 dark:bg-yellow-900/20"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-50 dark:bg-purple-900/20"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
