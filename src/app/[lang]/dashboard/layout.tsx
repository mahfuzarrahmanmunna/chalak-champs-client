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
  ChevronRight,
  ChevronDown,
  Star,
  Trophy,
  Gamepad2,
  GraduationCap,
  Palette,
  Music,
  Code2,
  Microscope,
  Pencil,
  Flame,
  Target,
  Crown,
  Sparkles,
  ArrowRight,
  PlayCircle,
  Lock,
  CheckCircle2,
  Clock,
  TrendingUp,
  Zap,
} from "lucide-react";
import gsap from "gsap";

const navigation = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
    color: "#F3056D",
    badge: null,
  },
  {
    name: "My Courses",
    href: "/dashboard/mycourses",
    icon: BookOpen,
    color: "#214187",
    badge: "5",
  },
  {
    name: "Schedule",
    href: "/dashboard/schedule",
    icon: Calendar,
    color: "#ffd700",
    badge: null,
  },
  {
    name: "Results",
    href: "/dashboard/grades",
    icon: BarChart3,
    color: "#F3056D",
    badge: null,
  },
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: MessageCircle,
    color: "#214187",
    badge: "2",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    color: "#ffd700",
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
  const sidebarRef = useRef<HTMLElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/signin";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-profile-dropdown]")) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // GSAP sidebar entrance
  useEffect(() => {
    if (navRef.current && sidebarOpen) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          navRef.current!.children,
          { x: -30, opacity: 0, scale: 0.95 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.06,
            ease: "back.out(1.7)",
          },
        );
      });
      return () => ctx.revert();
    }
  }, [sidebarOpen]);

  // GSAP initial page load
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".header-animate",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{
        background: isDarkMode
          ? "linear-gradient(135deg, #0f0d1a 0%, #1a1035 50%, #0d1a2d 100%)"
          : "linear-gradient(135deg, #fef7f9 0%, #f0f4ff 40%, #fffdf0 100%)",
      }}
    >
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ==================== SIDEBAR ==================== */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-[280px] transform transition-all duration-500 ease-[cubic-bezier(0.34, 1.56, 0.64, 1)] flex flex-col lg:relative lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0 lg:opacity-100"
        }`}
        style={{
          background: isDarkMode
            ? "linear-gradient(180deg, #1a1035 0%, #12102a 100%)"
            : "linear-gradient(180deg, #214187 0%, #1a3470 60%, #152d5e 100%)",
          borderRight: isDarkMode ? "1px solid rgba(255,255,255,0.05)" : "none",
          boxShadow: sidebarOpen ? "8px 0 40px rgba(33,65,135,0.3)" : "none",
        }}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between h-20 px-5 relative overflow-hidden">
          {/* Decorative circles */}
          <div
            className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10"
            style={{ background: "#F3056D" }}
          />
          <div
            className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-10"
            style={{ background: "#ffd700" }}
          />

          <Link
            href="/dashboard"
            className="flex items-center gap-3 relative z-10"
          >
            <div className="relative">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #F3056D 0%, #ff3d8f 100%)",
                  boxShadow: "0 4px 15px rgba(243,5,109,0.4)",
                }}
              >
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: "#ffd700" }}
              >
                <Star className="h-2.5 w-2.5 text-[#214187]" fill="#214187" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-none">
                KidLearn
              </h1>
              <p
                className="text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5"
                style={{ color: "#ffd700" }}
              >
                Fun Learning Hub
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Streak Banner */}
        <div
          className="mx-4 mb-4 p-3 rounded-2xl relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(243,5,109,0.2) 0%, rgba(255,215,0,0.15) 100%)",
            border: "1px solid rgba(255,215,0,0.2)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,215,0,0.2)" }}
              >
                <Flame className="h-5 w-5" style={{ color: "#ffd700" }} />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-white">5 Day Streak!</p>
              <p className="text-[10px] text-white/60">Keep going, champion!</p>
            </div>
            <div className="ml-auto flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-4 rounded-full"
                  style={{
                    background: i <= 5 ? "#ffd700" : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-hide"
          ref={navRef}
        >
          <p className="px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">
            Menu
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group relative block"
                onClick={() => setSidebarOpen(false)}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                    style={{ background: "#F3056D" }}
                  />
                )}

                <div
                  className="flex items-center justify-between mx-1 px-4 py-3 rounded-2xl transition-all duration-300"
                  style={{
                    background: isActive
                      ? "rgba(243,5,109,0.15)"
                      : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-xl transition-all duration-300"
                      style={{
                        background: isActive
                          ? item.color
                          : "rgba(255,255,255,0.08)",
                        boxShadow: isActive
                          ? `0 4px 12px ${item.color}40`
                          : "none",
                        transform: isActive ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      <item.icon
                        className="h-[18px] w-[18px] transition-colors duration-300"
                        style={{
                          color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                        }}
                      />
                    </div>
                    <span
                      className="font-semibold text-sm transition-colors duration-300"
                      style={{
                        color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                  {item.badge && (
                    <span
                      className="text-[10px] font-bold text-white rounded-full px-2 py-0.5 min-w-[24px] text-center"
                      style={{
                        background: isActive
                          ? "rgba(255,255,255,0.2)"
                          : "#F3056D",
                        boxShadow: isActive
                          ? "none"
                          : "0 2px 8px rgba(243,5,109,0.3)",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-white/30" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer - Profile */}
        <div className="p-4">
          <div
            className="p-4 rounded-2xl relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Shiny top line */}
            <div
              className="absolute top-0 left-4 right-4 h-[2px] rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, #F3056D, #ffd700, transparent)",
              }}
            />

            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div
                  className="w-11 h-11 rounded-full p-[2px]"
                  style={{
                    background: "linear-gradient(135deg, #F3056D, #ffd700)",
                  }}
                >
                  <img
                    src={
                      currentUser?.photoURL ||
                      "https://api.dicebear.com/7.x/fun-emoji/svg?seed=kid1"
                    }
                    alt="User"
                    className="w-full h-full rounded-full object-cover border-2"
                    style={{
                      borderColor: isDarkMode ? "#1a1035" : "#214187",
                    }}
                  />
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2"
                  style={{
                    background: "#4ade80",
                    borderColor: isDarkMode ? "#1a1035" : "#214187",
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {currentUser?.displayName || "Little Learner"}
                </p>
                <p className="text-[11px] text-white/40 truncate">
                  {currentUser?.email || "kid@kidlearn.com"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-300"
              style={{
                color: "rgba(255,255,255,0.6)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(243,5,109,0.2)";
                e.currentTarget.style.color = "#F3056D";
                e.currentTarget.style.borderColor = "rgba(243,5,109,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ==================== MAIN AREA ==================== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header
          className="header-animate relative z-30 h-[72px] flex items-center justify-between px-4 sm:px-6 lg:px-8"
          style={{
            background: isDarkMode
              ? "rgba(15,13,26,0.8)"
              : "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            borderBottom: isDarkMode
              ? "1px solid rgba(255,255,255,0.05)"
              : "1px solid rgba(33,65,135,0.08)",
          }}
        >
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: isDarkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(33,65,135,0.05)",
                border: isDarkMode
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(33,65,135,0.1)",
              }}
            >
              <Menu
                className="h-5 w-5"
                style={{ color: isDarkMode ? "#fff" : "#214187" }}
              />
            </button>

            {/* Search Bar */}
            <div className="hidden sm:block relative w-80 lg:w-96">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{
                  color: isDarkMode
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(33,65,135,0.4)",
                }}
              />
              <input
                type="text"
                placeholder="Search courses, lessons, quizzes..."
                className="block w-full pl-11 pr-12 py-2.5 rounded-2xl text-sm transition-all duration-300 focus:outline-none"
                style={{
                  background: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(33,65,135,0.04)",
                  border: isDarkMode
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(33,65,135,0.1)",
                  color: isDarkMode ? "#fff" : "#214187",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#F3056D";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(243,5,109,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(33,65,135,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <kbd
                className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center px-2 py-0.5 text-[10px] font-bold rounded-lg pointer-events-none"
                style={{
                  background: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(33,65,135,0.06)",
                  color: isDarkMode
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(33,65,135,0.4)",
                  border: isDarkMode
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(33,65,135,0.1)",
                }}
              >
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Coins Display */}
            <div
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl"
              style={{
                background: isDarkMode
                  ? "rgba(255,215,0,0.08)"
                  : "rgba(255,215,0,0.08)",
                border: isDarkMode
                  ? "1px solid rgba(255,215,0,0.15)"
                  : "1px solid rgba(255,215,0,0.2)",
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "#ffd700" }}
              >
                <Star className="h-3.5 w-3.5 text-[#214187]" fill="#214187" />
              </div>
              <span className="text-sm font-black" style={{ color: "#ffd700" }}>
                1,250
              </span>
            </div>

            {/* Notification Bell */}
            <button
              className="relative p-2.5 rounded-2xl transition-all duration-300 hover:scale-105"
              style={{
                background: isDarkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(33,65,135,0.04)",
                border: isDarkMode
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(33,65,135,0.1)",
              }}
            >
              <Bell
                className="h-5 w-5"
                style={{
                  color: isDarkMode ? "rgba(255,255,255,0.6)" : "#214187",
                }}
              />
              <span
                className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2"
                style={{
                  background: "#F3056D",
                  borderColor: isDarkMode ? "#0f0d1a" : "#fff",
                }}
              />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" data-profile-dropdown>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl transition-all duration-300 hover:scale-105"
                style={{
                  background: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(33,65,135,0.04)",
                  border: isDarkMode
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(33,65,135,0.1)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl p-[1.5px]"
                  style={{
                    background: "linear-gradient(135deg, #F3056D, #ffd700)",
                  }}
                >
                  <img
                    src={
                      currentUser?.photoURL ||
                      "https://api.dicebear.com/7.x/fun-emoji/svg?seed=kid1"
                    }
                    alt="User"
                    className="w-full h-full rounded-[10px] object-cover"
                    style={{
                      border: isDarkMode
                        ? "2px solid #0f0d1a"
                        : "2px solid #fff",
                    }}
                  />
                </div>
                <span
                  className="hidden md:block text-sm font-semibold"
                  style={{ color: isDarkMode ? "#fff" : "#214187" }}
                >
                  {currentUser?.displayName?.split(" ")[0] || "Kid"}
                </span>
                <ChevronDown
                  className="h-3.5 w-3.5 hidden md:block transition-transform duration-300"
                  style={{
                    color: isDarkMode
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(33,65,135,0.4)",
                    transform: profileDropdownOpen
                      ? "rotate(180deg)"
                      : "rotate(0)",
                  }}
                />
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-3 w-56 rounded-2xl overflow-hidden z-50 shadow-xl"
                  style={{
                    background: isDarkMode ? "#1a1035" : "#fff",
                    border: isDarkMode
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(33,65,135,0.08)",
                    boxShadow: isDarkMode
                      ? "0 20px 60px rgba(0,0,0,0.5)"
                      : "0 20px 60px rgba(33,65,135,0.12)",
                  }}
                >
                  {/* Profile header */}
                  <div
                    className="p-4"
                    style={{
                      background: isDarkMode
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(33,65,135,0.02)",
                      borderBottom: isDarkMode
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "1px solid rgba(33,65,135,0.06)",
                    }}
                  >
                    <p
                      className="text-sm font-bold"
                      style={{ color: isDarkMode ? "#fff" : "#214187" }}
                    >
                      {currentUser?.displayName || "Little Learner"}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{
                        color: isDarkMode
                          ? "rgba(255,255,255,0.4)"
                          : "rgba(33,65,135,0.5)",
                      }}
                    >
                      {currentUser?.email || "kid@kidlearn.com"}
                    </p>
                  </div>
                  <div className="p-2">
                    {[
                      { icon: Crown, label: "My Profile", href: "/dashboard" },
                      {
                        icon: Settings,
                        label: "Settings",
                        href: "/dashboard/settings",
                      },
                      {
                        icon: HelpCircle,
                        label: "Help Center",
                        href: "/dashboard/help",
                      },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 p-2.5 rounded-xl text-sm transition-colors duration-200"
                        style={{
                          color: isDarkMode
                            ? "rgba(255,255,255,0.6)"
                            : "#214187",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = isDarkMode
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(33,65,135,0.04)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div
                    className="p-2"
                    style={{
                      borderTop: isDarkMode
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "1px solid rgba(33,65,135,0.06)",
                    }}
                  >
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full p-2.5 rounded-xl text-sm font-medium transition-colors duration-200"
                      style={{ color: "#F3056D" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(243,5,109,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto relative">
          {/* Decorative Background Blobs */}
          <div
            className="absolute top-20 left-10 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ background: "#F3056D" }}
          />
          <div
            className="absolute bottom-20 right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: "#ffd700" }}
          />
          <div
            className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ background: "#214187" }}
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
