"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { ChevronDown } from "lucide-react"; // Imported for dropdown arrow

// Force dynamic rendering for authenticated pages
export const dynamic = "force-dynamic";

// Icons
import { BookOpenIcon, ChartBarIcon, CogIcon, HomeIcon } from "lucide-react";
import { FaUserGroup, FaXmark } from "react-icons/fa6";
import { HiAcademicCap, HiQuestionMarkCircle, HiPlus } from "react-icons/hi";
import { GrDocumentText } from "react-icons/gr";
import { BsCurrencyDollar } from "react-icons/bs";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { FaBars } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";

// --- Types for Navigation ---

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

  // State to track which dropdown is open
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, appUser, loading, logout } = useAuth();
  const { t, isBangla } = useLanguage();

  // Mount effect to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auth redirect effect: wait until auth finishes loading before deciding to redirect.
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

  // Logic to auto-expand dropdown if current path matches a child item
  // (Moved below navigation declaration so `navigation` is defined)

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Helper to toggle dropdown
  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  // --- Updated Navigation Structure with Dropdowns ---
  const navigation: NavItem[] = [
    {
      name: t.dashboard || "Dashboard",
      href: "/en/admin-dashboard",
      icon: HomeIcon,
      current: pathname === "/en/admin-dashboard",
    },
    {
      name: t.users || "Users",
      icon: FaUserGroup,
      current: pathname === "/en/admin-dashboard/manage-users",
      children: [
        {
          name: "All Users",
          href: "/en/admin-dashboard/manage-users",
          icon: FaUserGroup,
          current: pathname === "/en/admin-dashboard/manage-users",
        },
        // You can add "Roles" or "Permissions" here as needed
      ],
    },
    {
      name: t.courses || "Courses",
      icon: HiAcademicCap,
      current: false, // Parent current state is calculated dynamically below if needed
      children: [
        {
          name: "Manage Courses",
          href: "/en/admin-dashboard/courses/manage-courses",
          icon: HiAcademicCap,
          current: pathname === "/en/admin-dashboard/courses/manage-courses",
        },
        {
          name: "Create Course",
          href: "/en/admin-dashboard/courses/create",
          icon: HiPlus,
          current: pathname === "/en/admin-dashboard/courses/create",
        },
        {
          name: t.lessons || "Lessons",
          href: "/en/admin-dashboard/lessons",
          icon: BookOpenIcon,
          current: pathname === "/en/admin-dashboard/lessons",
        },
        {
          name: t.content || "Content",
          href: "/en/admin-dashboard/content",
          icon: GrDocumentText,
          current: pathname === "/en/admin-dashboard/content",
        },
      ],
    },
    {
      name: "Leads", // Grouping Leads related items
      icon: HiPlus, // Using a generic icon or add a specific one
      current: false,
      children: [
        {
          name: "Manage Leads",
          href: "/en/admin-dashboard/manage-leads-modal",
          icon: HiPlus,
          current: pathname === "/en/admin-dashboard/manage-leads-modal",
        },
      ],
    },
    {
      name: t.analytics || "Analytics",
      href: "/en/admin-dashboard/analytics",
      icon: ChartBarIcon,
      current: pathname === "/en/admin-dashboard/analytics",
    },
    {
      name: t.payments || "Payments",
      href: "/en/admin-dashboard/payments",
      icon: BsCurrencyDollar,
      current: pathname === "/en/admin-dashboard/payments",
    },
    {
      name: "System", // Grouping Settings and Help
      icon: CogIcon,
      current: false,
      children: [
        {
          name: t.settings || "Settings",
          href: "/en/admin-dashboard/settings",
          icon: CogIcon,
          current: pathname === "/en/admin-dashboard/settings",
        },
        {
          name: t.help || "Help",
          href: "/en/admin-dashboard/help",
          icon: HiQuestionMarkCircle,
          current: pathname === "/en/admin-dashboard/help",
        },
      ],
    },
  ];

  // Logic to auto-expand dropdown if current path matches a child item
  useEffect(() => {
    // Defer setting state to avoid synchronous setState inside effect
    let id: ReturnType<typeof setTimeout> | null = null;
    for (const item of navigation) {
      const isChildActive = item.children?.some(
        (child) => child.href === pathname,
      );
      if (isChildActive) {
        id = setTimeout(() => setActiveDropdown(item.name), 0);
        break;
      }
    }
    return () => {
      if (id) clearTimeout(id);
    };
  }, [pathname]);

  // Only render layout after client-side hydration
  if (!isMounted) {
    return children;
  }

  console.log("AdminDashboardLayout rendered with user:", currentUser);

  // --- Helper Component for Menu Items to avoid code duplication ---
  const MenuItem = ({
    item,
    isMobile = false,
  }: {
    item: NavItem;
    isMobile?: boolean;
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = activeDropdown === item.name;

    // Determine if this specific item (or its children) are active for styling
    const isItemActive =
      item.current ||
      (hasChildren && item.children.some((child) => child.current));

    return (
      <div className="w-full">
        {hasChildren ? (
          // Parent Item with Dropdown
          <>
            <button
              onClick={() => toggleDropdown(item.name)}
              className={`group w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                isItemActive
                  ? "text-primary-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              style={{
                backgroundColor: isItemActive
                  ? "var(--color-primary)"
                  : "transparent",
                color: isItemActive
                  ? "var(--color-primary-foreground)"
                  : "var(--color-foreground)",
              }}
              onMouseEnter={(e) => {
                if (!isItemActive)
                  e.currentTarget.style.backgroundColor = "var(--color-accent)";
              }}
              onMouseLeave={(e) => {
                if (!isItemActive)
                  e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div className="flex items-center">
                <item.icon
                  className="mr-3 h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                {String(item.name)}
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {/* Sub-menu */}
            {isOpen && (
              <div className="pl-4 mt-1 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={String(child.name)}
                    href={child.href || "#"}
                    onClick={() => {
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      child.current
                        ? "bg-primary/10 text-primary" // Slightly lighter active state for sub-items
                        : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
                    }`}
                    style={{
                      color: child.current
                        ? "var(--color-primary)"
                        : "var(--color-foreground)",
                    }}
                    onMouseEnter={(e) => {
                      if (!child.current)
                        e.currentTarget.style.backgroundColor =
                          "var(--color-accent)";
                    }}
                    onMouseLeave={(e) => {
                      if (!child.current)
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <child.icon
                      className="mr-3 h-4 w-4 flex-shrink-0 opacity-70"
                      aria-hidden="true"
                    />
                    {String(child.name)}
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          // Single Link Item
          <Link
            href={item.href || "#"}
            onClick={() => {
              if (isMobile) setSidebarOpen(false);
            }}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
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
              if (!item.current)
                e.currentTarget.style.backgroundColor = "var(--color-accent)";
            }}
            onMouseLeave={(e) => {
              if (!item.current)
                e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <item.icon
              className="mr-3 h-5 w-5 flex-shrink-0"
              aria-hidden="true"
            />
            {String(item.name)}
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for mobile */}
      <div
        className={`lg:hidden fixed inset-0 z-50 ${sidebarOpen ? "block" : "hidden"}`}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }} // Backdrop
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className="fixed inset-y-0 left-0 flex flex-col h-full w-64 shadow-xl"
          style={{ backgroundColor: "var(--color-card)" }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking sidebar content
        >
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
              style={{ color: "var(--color-foreground)" }}
            >
              <FaXmark className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <MenuItem key={String(item.name)} item={item} isMobile={true} />
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground mt-4 w-full"
              style={{ color: "var(--color-foreground)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--color-accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
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
        style={{ backgroundColor: "var(--color-card)" }}
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
              <MenuItem key={String(item.name)} item={item} />
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground mt-4 w-full"
              style={{ color: "var(--color-foreground)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--color-accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
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
                      {currentUser?.displayName?.charAt(0) ||
                        currentUser?.email?.charAt(0) ||
                        "A"}
                    </span>
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {currentUser?.displayName || "Admin"}
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
