// src/app/[lang]/admin-dashboard/layout.tsx

"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import {
  ChevronDown,
  Package,
  LayoutGrid,
  List,
  PlusCircle,
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

export interface NavItem {
  name: string;
  href?: string;
  icon: any;
  current: boolean;
  children?: NavItem[];
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
        router.push("/signin");
        return;
      }
      if (appUser && appUser.role !== "admin") {
        router.push("/signin");
      }
    }
  }, [currentUser, appUser, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // ✅ DYNAMIC NAVIGATION — uses getLink() instead of hardcoded /en/
  const navigation: NavItem[] = [
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
        {
          name: t.content || "Content",
          href: getLink("/admin-dashboard/content"),
          icon: GrDocumentText,
          current: pathname === getLink("/admin-dashboard/content"),
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
          href: getLink("/admin-dashboard/products/add-product"),
          icon: PlusCircle,
          current:
            pathname === getLink("/admin-dashboard/products/add-product"),
        },
      ],
    },
    {
      name: "Leads",
      icon: HiPlus,
      current: pathname.includes(getLink("/admin-dashboard/manage-leads")),
      children: [
        {
          name: "Manage Leads",
          href: getLink("/admin-dashboard/manage-leads-modal"),
          icon: HiPlus,
          current: pathname === getLink("/admin-dashboard/manage-leads-modal"),
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
  ];

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
      <div className="w-full">
        {hasChildren ? (
          <div>
            <button
              onClick={() => toggleDropdown(item.name)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isItemActive
                  ? "bg-[#F3056D]/10 text-white shadow-sm"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 ${isItemActive ? "text-[#F3056D]" : ""}`}
                  aria-hidden="true"
                />
                <span>{String(item.name)}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#F3056D]" : ""}`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 mt-1 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="pl-4 py-1 space-y-0.5 border-l border-white/10 ml-2.5">
                {item.children.map((child) => (
                  <Link
                    key={String(child.name)}
                    href={child.href || "#"}
                    onClick={() => {
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                      pathname === child.href ||
                      pathname.startsWith(child.href + "/")
                        ? "text-white bg-[#F3056D]/20 font-medium border-l-2 border-[#F3056D] -ml-[2px]"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <child.icon
                      className="w-4 h-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    {String(child.name)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Link
            href={item.href || "#"}
            onClick={() => {
              if (isMobile) setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              item.current
                ? "bg-[#F3056D] text-white shadow-lg shadow-[#F3056D]/40"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            {String(item.name)}
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className={`fixed inset-y-0 left-0 flex flex-col w-72 bg-[#214187] shadow-2xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F3056D] rounded-lg flex items-center justify-center shadow-lg shadow-[#F3056D]/40">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <h1 className="text-xl font-bold text-white">
                {String(t.adminPanel || "Admin Panel")}
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/60 hover:text-white"
            >
              <FaXmark className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin">
            {navigation.map((item) => (
              <MenuItem key={String(item.name)} item={item} isMobile={true} />
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            >
              <HiArrowRightOnRectangle className="w-5 h-5" />
              {String(t.logout || "Logout")}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0 w-64 bg-[#214187] border-r border-white/10">
        <div className="flex flex-col h-full w-full">
          <div className="flex items-center h-20 px-6 border-b border-white/10">
            <div className="w-9 h-9 bg-[#F3056D] rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-[#F3056D]/40">
              <span className="text-white font-bold text-sm">CC</span>
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              {String(t.adminPanel || "Admin Panel")}
            </h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
              Main Menu
            </p>
            {navigation.slice(0, 4).map((item) => (
              <MenuItem key={String(item.name)} item={item} />
            ))}
            <div className="my-6 border-t border-white/10"></div>
            <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
              Data & Settings
            </p>
            {navigation.slice(4).map((item) => (
              <MenuItem key={String(item.name)} item={item} />
            ))}
          </nav>

          <div className="p-4 m-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#214187] to-[#F3056D] flex items-center justify-center shadow-lg ring-2 ring-white/20">
                <span className="text-sm font-bold text-white">
                  {currentUser?.displayName?.charAt(0) ||
                    currentUser?.email?.charAt(0) ||
                    "A"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {currentUser?.displayName || "Admin User"}
                </p>
                <p className="text-xs text-white/50 truncate">
                  {currentUser?.email || "admin@chalakchamps.com"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white/60 hover:text-red-400 border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            >
              <HiArrowRightOnRectangle className="w-4 h-4" />
              {String(t.logout || "Logout")}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <header className="relative z-10 flex-shrink-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <button
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-[#214187] focus:outline-none transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars className="h-5 w-5" />
            </button>
            <div className="hidden md:block flex-1 max-w-xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
                  type="search"
                  className="block w-full pl-12 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F3056D]/30 focus:bg-white transition-all duration-200"
                  placeholder="Search anything..."
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ffd700] rounded-full ring-2 ring-white"></span>
              </button>
              <div className="lg:hidden flex items-center">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#214187] to-[#F3056D] flex items-center justify-center shadow-md">
                  <span className="text-xs font-bold text-white">
                    {currentUser?.displayName?.charAt(0) || "A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 relative overflow-y-auto">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
