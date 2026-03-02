"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/app/context/ThemeContext";
import {
  BookOpen,
  Clock,
  Calendar,
  Award,
  Play,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  FileText,
  Users,
  Zap,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";

// Mock Data
const ongoingCourses = [
  {
    id: "1",
    title: "Advanced React Patterns",
    instructor: "Sarah Johnson",
    progress: 65,
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    nextLesson: "Context API Deep Dive",
    color: "indigo",
  },
  {
    id: "2",
    title: "UI/UX Fundamentals",
    instructor: "Michael Chen",
    progress: 30,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    nextLesson: "Color Theory Basics",
    color: "emerald",
  },
];

const upcomingSchedule = [
  {
    id: 1,
    title: "Live Q&A: React Hooks",
    time: "Today, 4:00 PM",
    type: "live",
    color: "bg-indigo-500",
  },
  {
    id: 2,
    title: "Assignment Due: UI Project",
    time: "Tomorrow, 11:59 PM",
    type: "deadline",
    color: "bg-amber-500",
  },
  {
    id: 3,
    title: "Workshop: Portfolio Building",
    time: "Fri, 2:00 PM",
    type: "event",
    color: "bg-rose-500",
  },
];

export default function StudentDashboardPage() {
  const { colors, isDarkMode } = useTheme();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Modern Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-2xl shadow-indigo-500/20">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-4 backdrop-blur-sm">
              <Zap className="h-3 w-3" />
              <span>12 Lessons Completed This Week</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              Welcome back, Alex! 👋
            </h1>
            <p className="text-white/80 max-w-md mb-6 text-sm md:text-base">
              You <a href="mailto:"></a>re making great progress. Continue your
              learning streak and unlock the Advanced Developer badge!
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <Play className="h-4 w-4" />
              Continue Learning
            </button>
          </div>
          <div className="hidden md:flex justify-end items-center relative h-40">
            {/* Floating UI Elements for visual interest */}
            <div className="absolute w-48 h-32 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/10 flex flex-col justify-center items-center text-white shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <TrendingUp className="h-6 w-6 mb-1" />
              <span className="text-xs font-bold">Weekly Progress</span>
              <span className="text-2xl font-bold">+15%</span>
            </div>
            <div className="absolute w-36 h-24 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/10 flex flex-col justify-center items-center text-white shadow-xl transform rotate-6 translate-x-10 translate-y-4 hover:rotate-0 transition-transform duration-500">
              <Award className="h-5 w-5 mb-1" />
              <span className="text-xs font-bold">Streak</span>
              <span className="text-xl font-bold">5 Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column: My Courses (Takes 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Enrolled Courses",
                value: "05",
                icon: BookOpen,
                trend: "+2 this month",
                color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10",
              },
              {
                label: "Completed Lessons",
                value: "42",
                icon: CheckCircle,
                trend: "On track",
                color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
              },
              {
                label: "Certificates",
                value: "02",
                icon: Award,
                trend: "New this week",
                color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
              },
              {
                label: "Hours Spent",
                value: "86h",
                icon: Clock,
                trend: "+5h this week",
                color: "text-rose-500 bg-rose-50 dark:bg-rose-500/10",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2.5 rounded-xl ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full">
                    {stat.trend}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Continue Learning Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Continue Learning
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Pick up where you left off
                </p>
              </div>
              <Link
                href="/dashboard/courses"
                className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {ongoingCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                >
                  <div className="relative w-full sm:w-40 h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Play className="h-5 w-5 text-indigo-600 ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          course.color === "indigo"
                            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                            : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        }`}
                      >
                        {course.color === "indigo" ? "Development" : "Design"}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                      {course.instructor}
                    </p>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${course.color === "indigo" ? "bg-indigo-500" : "bg-emerald-500"}`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Widgets (Takes 1 col) */}
        <div className="space-y-6">
          {/* Upcoming Schedule */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Upcoming
                </h2>
                <Calendar className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            <div className="p-4 space-y-3">
              {upcomingSchedule.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-1.5 h-12 rounded-full ${item.color}`}
                  ></div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
              <button className="w-full mt-2 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors">
                View Full Calendar
              </button>
            </div>
          </div>

          {/* Achievement Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative">
              <div className="flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm">
                <Award className="h-7 w-7 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold mb-1">Achievement Unlocked!</h3>
              <p className="text-sm text-slate-400 mb-4">
                You have completed your first week streak.
              </p>
              <button className="flex items-center gap-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                View Badge
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-500/10">
                <Zap className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  Need Help?
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  Get instant answers from our AI assistant.
                </p>
                <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                  Chat with Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
