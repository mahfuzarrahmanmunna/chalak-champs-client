"use client";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import api from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { UserGroupIcon, AcademicCapIcon, CurrencyDollarIcon, BookOpenIcon } from "@heroicons/react/outline";

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  totalLessons: number;
  newUsersThisMonth: number;
  activeCourses: number;
}

export default function AdminDashboardContent() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    totalLessons: 0,
    newUsersThisMonth: 0,
    activeCourses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<{ id: number; firstName: string, lastName: string, email: string, role: string }[]>([]);
  const [recentCourses, setRecentCourses] = useState<{id: number, instructor:string, status: string, title: string, thumbnail:string , role: string}[]>([]);

  useEffect(() => {
    // FIX: Only fetch data if the user is actually logged in.
    // This prevents the 401 error because we ensure the token is ready.
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]); // Add 'currentUser' as a dependency

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats (This route EXISTS in your backend code now)
      const statsResponse = await api.get("/admin/dashboard/stats");
      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      // Fetch recent users
      const usersResponse = await api.get("/admin/users?limit=5");
      if (usersResponse.data.success) {
        // Map backend _id to frontend id if necessary, or use as is
        setRecentUsers(usersResponse.data.users);
      }

      // Fetch recent courses
      const coursesResponse = await api.get("/admin/courses?limit=5");
      if (coursesResponse.data.success) {
        setRecentCourses(coursesResponse.data.courses);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: t.totalUsers || "Total Users",
      value: stats.totalUsers,
      change: stats.newUsersThisMonth,
      changeType: "increase" as const,
      icon: UserGroupIcon,
    },
    {
      name: t.totalCourses || "Total Courses",
      value: stats.totalCourses,
      change: stats.activeCourses,
      changeType: "increase" as const,
      icon: AcademicCapIcon,
    },
    {
      name: t.totalRevenue || "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: "+12%",
      changeType: "increase" as const,
      icon: CurrencyDollarIcon,
    },
    {
      name: t.totalLessons || "Total Lessons",
      value: stats.totalLessons,
      change: "+8%",
      changeType: "increase" as const,
      icon: BookOpenIcon,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-foreground)" }}
        >
          {String(t.adminDashboard || "Admin Dashboard")}
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          {String(t.welcomeAdmin || "Welcome to the admin dashboard")}{" "}
          {currentUser?.displayName || "Admin"}!
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((card) => (
          <div
            key={String(card.name)}
            className="bg-white overflow-hidden shadow rounded-lg"
            style={{
              backgroundColor: "var(--color-card)",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <card.icon
                    className="h-6 w-6"
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {String(card.name)}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium">{card.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div
              className="bg-gray-50 px-5 py-3"
              style={{
                backgroundColor: "var(--color-accent)",
              }}
            >
              <div className="text-sm">
                <span
                  className={
                    card.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                  style={{
                    color:
                      card.changeType === "increase"
                        ? "var(--color-success, #10b981)"
                        : "var(--color-destructive, #ef4444)",
                  }}
                >
                  {card.change}
                </span>{" "}
                <span
                  className="text-gray-500"
                  style={{ color: "var(--color-muted-foreground)" }}
                >
                  {String(t.fromLastMonth || "from last month")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <div
          className="bg-white shadow rounded-lg"
          style={{
            backgroundColor: "var(--color-card)",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="px-4 py-5 sm:p-6">
            <h3
              className="text-lg leading-6 font-medium"
              style={{ color: "var(--color-foreground)" }}
            >
              {String(t.recentUsers || "Recent Users")}
            </h3>
            <div className="mt-5">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentUsers.map((user) => (
                    <li key={user.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div
                            className="h-8 w-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "var(--color-primary)" }}
                          >
                            <span
                              className="text-sm font-medium"
                              style={{ color: "var(--color-background)" }}
                            >
                              {user.firstName?.charAt(0) ||
                                user.email?.charAt(0) ||
                                "U"}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium"
                            style={{ color: "var(--color-foreground)" }}
                          >
                            {user.firstName} {user.lastName}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: "var(--color-muted-foreground)" }}
                          >
                            {user.email}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Recent courses */}
        <div
          className="bg-white shadow rounded-lg"
          style={{
            backgroundColor: "var(--color-card)",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="px-4 py-5 sm:p-6">
            <h3
              className="text-lg leading-6 font-medium"
              style={{ color: "var(--color-foreground)" }}
            >
              {String(t.recentCourses || "Recent Courses")}
            </h3>
            <div className="mt-5">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentCourses.map((course) => (
                    <li key={course.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={course.thumbnail || "/placeholder-course.jpg"}
                            alt={course.title}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium"
                            style={{ color: "var(--color-foreground)" }}
                          >
                            {course.title}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: "var(--color-muted-foreground)" }}
                          >
                            {course.instructor}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {course.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}