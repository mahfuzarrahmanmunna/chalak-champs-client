// src/app/admin-dashboard/layout.tsx
"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { useTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { BookOpenIcon, ChartBarIcon, CogIcon, HomeIcon } from "lucide-react";
import { FaUserGroup, FaXmark } from "react-icons/fa6";
import { HiAcademicCap, HiQuestionMarkCircle } from "react-icons/hi";
import { GrDocumentText } from "react-icons/gr";
import { BsCurrencyDollar } from "react-icons/bs";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { FaBars } from "react-icons/fa";
// import {
//   HomeIcon,
//   UserGroupIcon,
//   AcademicCapIcon,
//   ChartBarIcon,
//   CogIcon,
//   DocumentTextIcon,
//   BookOpenIcon,
//   CurrencyDollarIcon,
//   QuestionMarkCircleIcon,
//   ArrowRightOnRectangleIcon,
//   Bars3Icon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { colors, isDarkMode } = useTheme();
  const { t, isBangla } = useLanguage();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigation = [
    {
      name: t.dashboard || "Dashboard",
      href: "/admin-dashboard",
      icon: HomeIcon,
      current: pathname === "/admin-dashboard",
    },
    {
      name: t.users || "Users",
      href: "/admin-dashboard/manage-users",
      icon: FaUserGroup,
      current: pathname === "/admin-dashboard/manage-users",
    },
    {
      name: t.courses || "Courses",
      href: "/admin-dashboard/courses",
      icon: HiAcademicCap,
      current: pathname === "/admin-dashboard/courses",
    },
    {
      name: t.analytics || "Analytics",
      href: "/admin-dashboard/analytics",
      icon: ChartBarIcon,
      current: pathname === "/admin-dashboard/analytics",
    },
    {
      name: t.content || "Content",
      href: "/admin-dashboard/content",
      icon: GrDocumentText,
      current: pathname === "/admin-dashboard/content",
    },
    {
      name: t.lessons || "Lessons",
      href: "/admin-dashboard/lessons",
      icon: BookOpenIcon,
      current: pathname === "/admin-dashboard/lessons",
    },
    {
      name: t.payments || "Payments",
      href: "/admin-dashboard/payments",
      icon: BsCurrencyDollar,
      current: pathname === "/admin-dashboard/payments",
    },
    {
      name: t.settings || "Settings",
      href: "/admin-dashboard/settings",
      icon: CogIcon,
      current: pathname === "/admin-dashboard/settings",
    },
    {
      name: t.help || "Help",
      href: "/admin-dashboard/help",
      icon: HiQuestionMarkCircle,
      current: pathname === "/admin-dashboard/help",
    },
  ];

  // Check if user is admin
  if (user && user.role !== "admin") {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for mobile */}
      <div
        className={`lg:hidden ${sidebarOpen ? "block" : "hidden"}`}
        style={{
          backgroundColor: "var(--color-card)",
        }}
      >
        <div className="flex flex-col h-full w-64">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              {String(t.adminPanel || "Admin Panel")}
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md"
              style={{
                color: "var(--color-foreground)",
              }}
            >
              <FaXmark className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={String(item.name)}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  item.current
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                style={{
                  backgroundColor: item.current
                    ? "var(--color-primary)"
                    : "transparent",
                  color: item.current
                    ? "var(--color-primary-foreground)"
                    : "var(--color-foreground)",
                }}
                onMouseEnter={(e) => {
                  if (!item.current) {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-accent)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!item.current) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <item.icon
                  className="mr-3 h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                {String(item.name)}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground mt-4"
              style={{
                color: "var(--color-foreground)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <HiArrowRightOnRectangle
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {String(t.logout || "Logout")}
            </button>
          </nav>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div
        className="hidden lg:flex lg:flex-shrink-0"
        style={{
          backgroundColor: "var(--color-card)",
        }}
      >
        <div className="flex flex-col h-full w-64">
          <div className="flex items-center h-16 px-4 border-b">
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              {String(t.adminPanel || "Admin Panel")}
            </h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={String(item.name)}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  item.current
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                style={{
                  backgroundColor: item.current
                    ? "var(--color-primary)"
                    : "transparent",
                  color: item.current
                    ? "var(--color-primary-foreground)"
                    : "var(--color-foreground)",
                }}
                onMouseEnter={(e) => {
                  if (!item.current) {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-accent)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!item.current) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <item.icon
                  className="mr-3 h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                {String(item.name)}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground mt-4"
              style={{
                color: "var(--color-foreground)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <HiArrowRightOnRectangle
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {String(t.logout || "Logout")}
            </button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <div
          className="relative z-10 flex-shrink-0 flex h-16 border-b"
          style={{
            backgroundColor: "var(--color-background)",
            borderColor: "var(--color-border)",
          }}
        >
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-foreground)",
            }}
          >
            <FaBars className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1">
              {/* Search bar could go here */}
              <form className="w-full md:w-96">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-700 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search"
                    type="search"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-card)",
                      color: "var(--color-foreground)",
                    }}
                  />
                </div>
              </form>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown could go here */}
              <div className="relative">
                <div className="flex items-center">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center mr-2"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-background)" }}
                    >
                      {user?.displayName?.charAt(0) ||
                        user?.email?.charAt(0) ||
                        "A"}
                    </span>
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {user?.displayName || "Admin"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
