"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
// import { useAuth } from "@/app/hooks/useAuth";
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
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, badge: null },
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

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 dark:bg-gray-950">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: isDarkMode
            ? "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.8) 100%)"
            : "linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)",
          backdropFilter: "blur(20px)",
          borderRight: `1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
        }}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between h-20 px-6">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                LearnPro
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Student Portal
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            Main Menu
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 transition-colors ${
                      isActive
                        ? "text-indigo-500"
                        : "text-slate-400 group-hover:text-indigo-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-white/5">
          <div className="relative p-4 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={
                  currentUser?.photoURL ||
                  "https://randomuser.me/api/portraits/lego/1.jpg"
                }
                alt="User"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {currentUser?.displayName || "Student"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {currentUser?.email || "student@email.com"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header
          className="relative z-30 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8"
          style={{
            background: isDarkMode
              ? "rgba(3, 7, 18, 0.8)"
              : "rgba(248, 250, 252, 0.8)",
            backdropFilter: "blur(10px)",
            borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm"
            >
              <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </button>

            {/* Search Bar */}
            <div className="hidden sm:block relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search for courses, lessons..."
                className="block w-72 lg:w-96 pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <kbd className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden lg:inline-flex items-center px-2 py-0.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 rounded">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button className="relative p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <img
                  src={
                    currentUser?.photoURL ||
                    "https://randomuser.me/api/portraits/lego/1.jpg"
                  }
                  alt="User"
                  className="h-8 w-8 rounded-lg object-cover"
                />
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                  <div className="p-2">
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 p-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Settings className="h-4 w-4" /> Profile Settings
                    </Link>
                    <Link
                      href="/dashboard/help"
                      className="flex items-center gap-2 p-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <HelpCircle className="h-4 w-4" /> Help Center
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 p-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full p-2.5 rounded-lg text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
