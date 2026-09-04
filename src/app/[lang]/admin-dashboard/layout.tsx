"use client";
import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import {
  ChevronDown,
  Package,
  LayoutGrid,
  List,
  PlusCircle,
  Search,
  Bell,
  LogOut,
  Shield,
  Sparkles,
  FileText,
  MessageSquare,
  Info,
  Contact,
} from "lucide-react";

export const dynamic = "force-dynamic";

import {
  BookOpenIcon,
  ChartBarIcon,
  CogIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { FaUserGroup, FaXmark } from "react-icons/fa6";
import { HiAcademicCap, HiQuestionMarkCircle, HiPlus } from "react-icons/hi";
import { GrDocumentText } from "react-icons/gr";
import { BsCurrencyDollar } from "react-icons/bs";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { FaBars } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";

export interface NavItem {
  name: string;
  href?: string;
  icon: any;
  current: boolean;
  children?: NavItem[];
  isLabel?: boolean; // NEW: For dropdown section headers like "Home Page", "About Page"
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, appUser, loading, logout } = useAuth();
  const { t, isBangla, getLink } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push("/en/signin");
        return;
      }
      if (appUser && appUser.role !== "admin") {
        router.push("/en/signin");
      }
    }
  }, [currentUser, appUser, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/en/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // ✅ DYNAMIC NAVIGATION — wrapped in useMemo to fix exhaustive-deps warning
  const navigation: NavItem[] = useMemo(
    () => [
      {
        name: t.dashboard || "Dashboard",
        href: getLink("/admin-dashboard"),
        icon: HomeIcon,
        current: pathname === getLink("/admin-dashboard"),
      },
      {
        name: t.users || "Users",
        icon: FaUserGroup,
        current: pathname.includes(getLink("/admin-dashboard/manage-users")),
        children: [
          {
            name: "All Users",
            href: getLink("/admin-dashboard/manage-users"),
            icon: FaUserGroup,
            current: pathname === getLink("/admin-dashboard/manage-users"),
          },
        ],
      },
      {
        name: t.courses || "Courses",
        icon: HiAcademicCap,
        current: pathname.includes(getLink("/admin-dashboard/courses")),
        children: [
          {
            name: "Manage Courses",
            href: getLink("/admin-dashboard/courses/manage-courses"),
            icon: HiAcademicCap,
            current:
              pathname === getLink("/admin-dashboard/courses/manage-courses"),
          },
          {
            name: "Create Course",
            href: getLink("/admin-dashboard/courses/create"),
            icon: HiPlus,
            current: pathname === getLink("/admin-dashboard/courses/create"),
          },
          {
            name: t.lessons || "Lessons",
            href: getLink("/admin-dashboard/courses/manage-lessons"),
            icon: BookOpenIcon,
            current:
              pathname === getLink("/admin-dashboard/courses/manage-lessons"),
          },
        ],
      },
      {
        name: "Products",
        icon: Package,
        current: pathname.includes(getLink("/admin-dashboard/products")),
        children: [
          {
            name: "All Products",
            href: getLink("/admin-dashboard/products"),
            icon: LayoutGrid,
            current: pathname === getLink("/admin-dashboard/products"),
          },
          {
            name: "Manage Products",
            href: getLink("/admin-dashboard/products/manage-products"),
            icon: List,
            current:
              pathname === getLink("/admin-dashboard/products/manage-products"),
          },
          {
            name: "Add Product",
            href: getLink("/admin-dashboard/products/create"),
            icon: PlusCircle,
            current: pathname === getLink("/admin-dashboard/products/create"),
          },
        ],
      },
      {
        name: "Content",
        icon: FileText,
        current: pathname.includes(getLink("/admin-dashboard/content")),
        children: [
          {
            name: "Home Page",
            isLabel: true,
            href: undefined,
            icon: null,
            current: false,
          },
          {
            name: "Hero Section",
            href: getLink("/admin-dashboard/content/home/manage-hero-banner"),
            icon: Sparkles,
            current:
              pathname ===
              getLink("/admin-dashboard/content/home/manage-hero-banner"),
          },
          {
            name: "Video Gallery",
            href: getLink("/admin-dashboard/content/home/manage-video-gallery"),
            icon: Sparkles,
            current:
              pathname ===
              getLink("/admin-dashboard/content/home/manage-video-gallery"),
          },
          {
            name: "CTA Section",
            href: getLink("/admin-dashboard/content/home/manage-cta-section"),
            icon: MessageSquare,
            current:
              pathname ===
              getLink("/admin-dashboard/content/home/manage-cta-section"),
          },
          {
            name: "About Page",
            isLabel: true,
            href: undefined,
            icon: null,
            current: false,
          },
          {
            name: "About Content",
            href: getLink("/admin-dashboard/content/about/manage-about"),
            icon: Info,
            current:
              pathname ===
              getLink("/admin-dashboard/content/about/manage-about"),
          },
          {
            name: "Course Page",
            isLabel: true,
            href: undefined,
            icon: null,
            current: false,
          },
          {
            name: "Course Content",
            href: getLink(
              "/admin-dashboard/content/courses/manage-courses-page",
            ),
            icon: HiAcademicCap,
            current:
              pathname ===
              getLink("/admin-dashboard/content/courses/manage-courses-page"),
          },
        ],
      },
      {
        name: "Leads",
        icon: GrDocumentText,
        current:
          pathname.includes(
            getLink("/admin-dashboard/leads/manage-leads-modal"),
          ) ||
          pathname.includes(
            getLink("/admin-dashboard/leads/manage-courses-details-leads"),
          ),
        children: [
          {
            name: "Free Booking Leads",
            href: getLink("/admin-dashboard/leads/manage-leads-modal"),
            icon: GrDocumentText,
            current:
              pathname === getLink("/admin-dashboard/leads/manage-leads-modal"),
          },
          {
            name: "Course Enrollments",
            href: getLink(
              "/admin-dashboard/leads/manage-courses-details-leads",
            ),
            icon: HiAcademicCap,
            current:
              pathname ===
              getLink("/admin-dashboard/leads/manage-courses-details-leads"),
          },
          {
            name: "Contact Page",
            href: getLink("/admin-dashboard/leads/manage-contact-info"),
            icon: Contact,
            current:
              pathname ===
              getLink("/admin-dashboard/leads/manage-contact-info"),
          },
        ],
      },
      {
        name: t.analytics || "Analytics",
        href: getLink("/admin-dashboard/analytics"),
        icon: ChartBarIcon,
        current: pathname === getLink("/admin-dashboard/analytics"),
      },
      {
        name: t.payments || "Payments",
        href: getLink("/admin-dashboard/payments"),
        icon: BsCurrencyDollar,
        current: pathname === getLink("/admin-dashboard/payments"),
      },
      {
        name: "System",
        icon: CogIcon,
        current:
          pathname.includes(getLink("/admin-dashboard/settings")) ||
          pathname.includes(getLink("/admin-dashboard/help")),
        children: [
          {
            name: t.settings || "Settings",
            href: getLink("/admin-dashboard/settings"),
            icon: CogIcon,
            current: pathname === getLink("/admin-dashboard/settings"),
          },
          {
            name: t.help || "Help",
            href: getLink("/admin-dashboard/help"),
            icon: HiQuestionMarkCircle,
            current: pathname === getLink("/admin-dashboard/help"),
          },
        ],
      },
    ],
    [t, getLink, pathname],
  );

  // Auto-expand dropdown if current path matches a child item
  useEffect(() => {
    let id: ReturnType<typeof setTimeout> | null = null;
    for (const item of navigation) {
      if (
        item.children?.some((child) => pathname.startsWith(child.href || ""))
      ) {
        id = setTimeout(() => setActiveDropdown(item.name), 0);
        break;
      }
    }
    return () => {
      if (id) clearTimeout(id);
    };
  }, [pathname, navigation]);

  if (!isMounted) return children;

  const MenuItem = ({
    item,
    isMobile = false,
  }: {
    item: NavItem;
    isMobile?: boolean;
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = activeDropdown === item.name;
    const isItemActive =
      item.current ||
      (hasChildren &&
        item.children.some((child) => pathname.startsWith(child.href || "")));

    return (
      <div className="w-full group">
        {hasChildren ? (
          <div>
            <button
              onClick={() => toggleDropdown(item.name)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 ease-out ${
                isItemActive
                  ? "bg-gradient-to-r from-[#F3056D]/15 to-[#F3056D]/5 text-white shadow-sm shadow-[#F3056D]/10 border border-[#F3056D]/20"
                  : "text-white/50 hover:bg-white/[0.06] hover:text-white/90 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-lg transition-all duration-300 ${
                    isItemActive
                      ? "bg-[#F3056D]/20"
                      : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors duration-300 ${
                      isItemActive
                        ? "text-[#F3056D]"
                        : "text-white/40 group-hover:text-white/70"
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <span className="tracking-wide">{String(item.name)}</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-all duration-500 ${
                  isOpen ? "rotate-180 text-[#F3056D]" : "text-white/30"
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isOpen ? "max-h-[600px] mt-2 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pl-5 py-1 space-y-0.5 relative">
                <div className="absolute left-[22px] top-2 bottom-2 w-px bg-gradient-to-b from-[#F3056D]/40 via-white/10 to-transparent" />
                {item.children.map((child, index) => {
                  // ✅ CHECK IF IT'S A SECTION LABEL (e.g., "Home Page", "About Page")
                  if (child.isLabel) {
                    return (
                      <div
                        key={`label-${String(child.name)}`}
                        className={`pl-3 pt-4 pb-1 ${index === 0 ? "pt-0" : ""}`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
                          {String(child.name)}
                        </span>
                      </div>
                    );
                  }

                  // ✅ RENDER NORMAL LINK
                  return (
                    <Link
                      key={String(child.name)}
                      href={child.href || "#"}
                      onClick={() => {
                        if (isMobile) setSidebarOpen(false);
                      }}
                      className={`relative flex items-center gap-3 px-3 py-2 text-[12.5px] rounded-lg transition-all duration-300 ${
                        pathname === child.href ||
                        pathname.startsWith(child.href + "/")
                          ? "text-white bg-[#F3056D]/15 font-semibold shadow-sm"
                          : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
                      }`}
                    >
                      {(pathname === child.href ||
                        pathname.startsWith(child.href + "/")) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#F3056D] rounded-r-full shadow-sm shadow-[#F3056D]/50" />
                      )}
                      <child.icon
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          pathname === child.href ||
                          pathname.startsWith(child.href + "/")
                            ? "text-[#F3056D]"
                            : "text-white/30"
                        }`}
                        aria-hidden="true"
                      />
                      <span className="tracking-wide">
                        {String(child.name)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <Link
            href={item.href || "#"}
            onClick={() => {
              if (isMobile) setSidebarOpen(false);
            }}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 ease-out overflow-hidden ${
              item.current
                ? "bg-gradient-to-r from-[#F3056D] to-[#d4045e] text-white shadow-lg shadow-[#F3056D]/30 border border-[#F3056D]/50"
                : "text-white/50 hover:bg-white/[0.06] hover:text-white/90 border border-transparent"
            }`}
          >
            {item.current && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
            )}
            <div
              className={`p-1.5 rounded-lg transition-all duration-300 relative z-10 ${
                item.current
                  ? "bg-white/20"
                  : "bg-white/[0.04] group-hover:bg-white/[0.08]"
              }`}
            >
              <item.icon
                className={`w-4 h-4 flex-shrink-0 transition-colors duration-300 ${
                  item.current
                    ? "text-white"
                    : "text-white/40 group-hover:text-white/70"
                }`}
                aria-hidden="true"
              />
            </div>
            <span className="relative z-10 tracking-wide">
              {String(item.name)}
            </span>
            {item.current && (
              <div className="ml-auto relative z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-sm" />
              </div>
            )}
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#f8f9fc]">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[100] transition-all duration-500 ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className={`fixed inset-y-0 left-0 flex flex-col w-[280px] bg-gradient-to-b from-[#1a2f5e] via-[#1e3872] to-[#152350] shadow-2xl shadow-black/40 transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-[72px] px-5 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-[#F3056D] to-[#ff4d94] rounded-xl flex items-center justify-center shadow-lg shadow-[#F3056D]/40">
                  {/* <Sparkles className="w-4 h-4 text-white" /> */}
                  <Image
                  src="/chalak-logo.jpg"
                  alt="Chalak Champs Logo"
                  width={20}
                  height={20}
                  className="rounded-md"
                  />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#1a2f5e]" />
              </div>
              <div>
                <h1 className="text-[15px] font-bold text-white tracking-tight">
                  {String(t.adminPanel || "Admin Panel")}
                </h1>
                <p className="text-[10px] text-white/30 font-medium tracking-wider uppercase">
                  Management System
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              <FaXmark className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Nav */}
          <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto scrollbar-thin">
            <p className="px-3 mb-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/25">
              Main Menu
            </p>
            {navigation.slice(0, 4).map((item) => (
              <MenuItem key={String(item.name)} item={item} isMobile={true} />
            ))}
            <div className="my-5 mx-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <p className="px-3 mb-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/25">
              Data & Settings
            </p>
            {navigation.slice(4).map((item) => (
              <MenuItem key={String(item.name)} item={item} isMobile={true} />
            ))}
          </nav>

          {/* Mobile Footer */}
          <div className="p-4 border-t border-white/[0.08]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              {String(t.logout || "Logout")}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0 w-[260px] bg-gradient-to-b from-[#1a2f5e] via-[#1e3872] to-[#152350]">
        <div className="flex flex-col h-full w-full">
          {/* Logo */}
          <div className="flex items-center h-[80px] px-5 border-b border-white/[0.08]">
            <div className="relative">
              <div className="w-10 h-10  rounded-xl flex items-center justify-center shadow-lg shadow-[#F3056D]/30  hover:rotate-0 transition-transform duration-500">
                 <Image
                  src="/chalak-logo.jpg"
                  alt="Chalak Champs Logo"
                  width={40}
                  height={40}
                  className="rounded-md"
                  />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#1a2f5e] shadow-sm shadow-emerald-400/50" />
            </div>
            <div className="ml-3.5">
              <h1 className="text-[15px] font-bold text-white tracking-tight">
                {String(t.adminPanel || "Admin Panel")}
              </h1>
              <p className="text-[10px] text-white/25 font-semibold tracking-[0.2em] uppercase">
                Management
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin">
            <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/25">
              Main Menu
            </p>
            {navigation.slice(0, 4).map((item) => (
              <MenuItem key={String(item.name)} item={item} />
            ))}
            <div className="my-5 mx-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/25">
              Data & Settings
            </p>
            {navigation.slice(4).map((item) => (
              <MenuItem key={String(item.name)} item={item} />
            ))}
          </nav>

          {/* User Profile Card */}
          <div className="p-3 m-3 mb-4">
            <div className="relative p-4 bg-white/[0.04] rounded-2xl border border-white/[0.08] backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#F3056D]/10 to-transparent rounded-bl-full" />
              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F3056D] to-[#6366f1] flex items-center justify-center shadow-lg shadow-[#F3056D]/20">
                    <span className="text-sm font-bold text-white">
                      {currentUser?.displayName?.charAt(0) ||
                        currentUser?.email?.charAt(0) ||
                        "A"}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#1a2f5e]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white truncate">
                    {currentUser?.displayName || "Admin User"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Shield className="w-3 h-3 text-[#F3056D]" />
                    <p className="text-[11px] text-white/35 font-medium truncate">
                      Administrator
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full mt-3.5 flex items-center justify-center gap-2 px-3 py-2 text-[11.5px] font-semibold text-white/40 hover:text-red-400 border border-white/[0.08] hover:border-red-500/30 hover:bg-red-500/[0.06] rounded-xl transition-all duration-300 uppercase tracking-wider"
              >
                <LogOut className="w-3.5 h-3.5" />
                {String(t.logout || "Logout")}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <header className="relative z-10 flex-shrink-0 h-[72px] bg-white/90 backdrop-blur-xl border-b border-gray-200/60">
          <div className="h-full px-5 sm:px-8 lg:px-10 flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2.5 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none transition-all duration-300 active:scale-95"
                onClick={() => setSidebarOpen(true)}
              >
                <FaBars className="h-[18px] w-[18px]" />
              </button>

              {/* Breadcrumb */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[12px] font-medium text-gray-400">
                  {String(t.adminPanel || "Admin")}
                </span>
                <span className="text-[12px] text-gray-300">/</span>
                <span className="text-[12px] font-semibold text-gray-700">
                  {navigation.find((item) => item.current)?.name ||
                    navigation.find((item) =>
                      item.children?.some(
                        (child) =>
                          pathname === child.href ||
                          pathname.startsWith(child.href + "/"),
                      ),
                    )?.name ||
                    "Dashboard"}
                </span>
              </div>
            </div>

            {/* Center - Search */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative group">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
                    searchFocused ? "text-[#F3056D]" : "text-gray-400"
                  }`}
                >
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="search"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`block w-full pl-11 pr-4 py-2.5 bg-gray-50 border rounded-xl text-[13px] text-gray-700 placeholder-gray-400 transition-all duration-300 ${
                    searchFocused
                      ? "border-[#F3056D]/30 bg-white ring-4 ring-[#F3056D]/[0.06] shadow-sm"
                      : "border-transparent hover:border-gray-200 hover:bg-white"
                  } focus:outline-none`}
                  placeholder="Search anything..."
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100 rounded-md border border-gray-200">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <button className="relative p-2.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-xl transition-all duration-300 group">
                <Bell className="w-[18px] h-[18px] group-hover:animate-[swing_0.5s_ease-in-out]" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#F3056D] rounded-full ring-2 ring-white shadow-sm shadow-[#F3056D]/50">
                  <span className="absolute inset-0 rounded-full bg-[#F3056D] animate-ping opacity-75" />
                </span>
              </button>

              {/* Divider */}
              <div className="hidden lg:block h-8 w-px bg-gray-200 mx-1" />

              {/* User Avatar (Desktop) */}
              <div className="hidden lg:flex items-center gap-3 pl-2">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a2f5e] to-[#F3056D] flex items-center justify-center shadow-md cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <span className="text-xs font-bold text-white">
                      {currentUser?.displayName?.charAt(0) ||
                        currentUser?.email?.charAt(0) ||
                        "A"}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                </div>
                <div className="hidden xl:block">
                  <p className="text-[13px] font-semibold text-gray-700 leading-tight">
                    {currentUser?.displayName || "Admin User"}
                  </p>
                  <p className="text-[11px] text-gray-400 leading-tight">
                    {currentUser?.email || "admin@example.com"}
                  </p>
                </div>
              </div>

              {/* User Avatar (Mobile) */}
              <div className="lg:hidden flex items-center">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a2f5e] to-[#F3056D] flex items-center justify-center shadow-md">
                  <span className="text-xs font-bold text-white">
                    {currentUser?.displayName?.charAt(0) || "A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto">
          {/* Subtle gradient overlay at top */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/50 to-transparent pointer-events-none z-10" />
          <div className="relative py-8">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
