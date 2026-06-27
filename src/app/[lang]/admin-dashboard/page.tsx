"use client";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import api from "@/lib/api";
import {
  Users,
  GraduationCap,
  DollarSign,
  BookOpen,
  ArrowRight,
  MoreHorizontal,
  TrendingUp,
  UserCheck,
  Activity,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useParams } from "next/navigation";

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  totalLessons: number;
  newUsersThisMonth: number;
  activeCourses: number;
}

// Helper for status badges
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    active: "bg-green-100 text-green-700 border-green-200",
    inactive: "bg-gray-100 text-gray-700 border-gray-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  const normalizedStatus = status?.toLowerCase() || "inactive";
  const style =
    styles[normalizedStatus as keyof typeof styles] || styles.inactive;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${style}`}
    >
      {status}
    </span>
  );
};

// --- PROFESSIONAL SKELETON LOADING UI ---
const DashboardSkeleton = () => (
  <div className="space-y-8">
    {/* Welcome Section Skeleton */}
    <div className="flex flex-col gap-2">
      <div className="h-9 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="h-5 w-96 bg-gray-100 rounded-lg animate-pulse"></div>
    </div>

    {/* Stats Grid Skeleton */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between pb-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-3 w-28 bg-gray-100 rounded mt-3 animate-pulse"></div>
        </div>
      ))}
    </div>

    <div className="grid gap-6 lg:grid-cols-7">
      {/* Recent Users Skeleton (4 columns) */}
      <div className="col-span-4 rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="p-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border-b last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1.5"></div>
                  <div className="h-3 w-44 bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-6 w-14 bg-gray-100 rounded-full animate-pulse"></div>
                <div className="h-5 w-5 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Courses Skeleton (3 columns) */}
      <div className="col-span-3 rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-28 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="p-4 space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-16 w-16 flex-shrink-0 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse"></div>
              </div>
              <div className="flex flex-col items-end justify-center gap-1">
                <div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Analytics Skeleton */}
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b p-6">
        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="flex h-80 items-center justify-center p-12">
        <div className="w-full h-full bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const { currentUser, appUser, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const params = useParams<{ lang?: string }>();
  const lang = params?.lang || "en";

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    totalLessons: 0,
    newUsersThisMonth: 0,
    activeCourses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<
    {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    }[]
  >([]);
  const [recentCourses, setRecentCourses] = useState<
    {
      id: number;
      instructor: string;
      status: string;
      title: string;
      thumbnail: string;
    }[]
  >([]);

  async function fetchDashboardData() {
    try {
      setIsLoading(true);
      const statsResponse = await api.get("/admin/dashboard/stats");
      if (statsResponse.data.success) setStats(statsResponse.data.stats);

      const usersResponse = await api.get("/admin/users?limit=5");
      if (usersResponse.data.success) setRecentUsers(usersResponse.data.users);

      const coursesResponse = await api.get("/admin/courses?limit=5");
      if (coursesResponse.data.success)
        setRecentCourses(coursesResponse.data.courses);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading && currentUser && appUser?.role === "admin") {
      const id = setTimeout(() => {
        fetchDashboardData();
      }, 0);
      return () => clearTimeout(id);
    }
    return;
  }, [currentUser, appUser, authLoading]);

  const statCards = [
    {
      name: t.totalUsers || "Total Users",
      value: stats.totalUsers,
      change: stats.newUsersThisMonth,
      changeText: "New users",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: t.totalCourses || "Total Courses",
      value: stats.totalCourses,
      change: stats.activeCourses,
      changeText: "Active courses",
      icon: GraduationCap,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      name: t.totalRevenue || "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: "+12%",
      changeText: "vs last month",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      name: t.totalLessons || "Total Lessons",
      value: stats.totalLessons,
      change: "+8%",
      changeText: "New lessons",
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  // --- RENDER SKELETON WHILE LOADING ---
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h1
          className="text-3xl font-bold tracking-tight text-foreground"
          style={{ color: "var(--color-foreground)" }}
        >
          {String(t.adminDashboard || "Admin Dashboard")}
        </h1>
        <p
          className="text-muted-foreground"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          {String(t.welcomeAdmin || "Welcome back")}{" "}
          <span className="font-medium text-foreground">
            {currentUser?.displayName || "Admin"}
          </span>
          {!currentUser?.displayName && (
            <span>! Here&lsquo;s what&lsquo;s happening today.</span>
          )}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.name}
            className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p
                className="text-sm font-medium text-muted-foreground"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                {card.name}
              </p>
              <div className={`rounded-lg p-2 ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--color-foreground)" }}
              >
                {card.value}
              </div>
              {card.change && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-600 font-semibold">
                    {card.change}
                  </span>
                  <span className="ml-1">{card.changeText}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Users (Takes up 4 columns) */}
        <div
          className="col-span-4 rounded-xl border bg-card shadow-sm"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
          }}
        >
          <div
            className="flex items-center justify-between border-b p-6"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--color-foreground)" }}
              >
                {String(t.recentUsers || "Recent Users")}
              </h3>
              <p className="text-sm text-muted-foreground">
                Latest members to join the platform.
              </p>
            </div>
            <Link
              href={`/${lang}/admin-dashboard/manage-users`}
              className="text-sm font-medium text-primary hover:underline flex items-center"
              style={{ color: "var(--color-primary)" }}
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="p-0">
            <div
              className="divide-y"
              style={{ borderColor: "var(--color-border)" }}
            >
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                        {user.firstName?.charAt(0) ||
                          user.email?.charAt(0) ||
                          "U"}
                      </div>
                      <div>
                        <p
                          className="text-sm font-medium text-foreground"
                          style={{ color: "var(--color-foreground)" }}
                        >
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-700 ring-purple-600/20"
                            : "bg-gray-50 text-gray-600 ring-gray-500/10"
                        }`}
                      >
                        {user.role}
                      </span>
                      <button className="text-gray-400 hover:text-foreground">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No recent users found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Courses (Takes up 3 columns) */}
        <div
          className="col-span-3 rounded-xl border bg-card shadow-sm"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
          }}
        >
          <div
            className="flex items-center justify-between border-b p-6"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--color-foreground)" }}
              >
                {String(t.recentCourses || "Recent Courses")}
              </h3>
              <p className="text-sm text-muted-foreground">
                Newly added content.
              </p>
            </div>
            <Link
              href={`/${lang}/admin-dashboard/manage-courses`}
              className="text-sm font-medium text-primary hover:underline flex items-center"
              style={{ color: "var(--color-primary)" }}
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="p-4 space-y-4">
            {recentCourses.map((course) => (
              <div key={course.id} className="flex gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    className="h-full w-full object-cover"
                    src={course.thumbnail || "/placeholder-course.jpg"}
                    alt={course.title}
                    fill
                    sizes="64px"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <p
                    className="truncate text-sm font-medium text-foreground"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {course.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {course.instructor}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-center gap-1">
                  <StatusBadge status={course.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div
        className="rounded-xl border bg-card shadow-sm"
        style={{
          backgroundColor: "var(--color-card)",
          borderColor: "var(--color-border)",
        }}
      >
        <div
          className="border-b p-6"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--color-foreground)" }}
          >
            {String(t.userGrowth || "User Growth Analytics")}
          </h3>
        </div>
        <div className="flex h-80 items-center justify-center p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-gray-50 p-4 dark:bg-gray-800">
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h4
                className="text-sm font-medium text-foreground"
                style={{ color: "var(--color-foreground)" }}
              >
                No Chart Data
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {String(
                  t.chartPlaceholder ||
                    "Chart visualization will appear here once data is available.",
                )}
              </p>
              <button
                className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-primary-foreground)",
                }}
              >
                Configure Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
