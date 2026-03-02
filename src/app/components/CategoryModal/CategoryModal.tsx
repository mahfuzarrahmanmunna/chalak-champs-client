// src/components/CategoryModal/CategoryModal.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import {
  FaLanguage,
  FaBook,
  FaClock,
  FaDollarSign,
  FaArrowLeft,
  FaTimes,
  FaGraduationCap,
  FaBriefcase,
  FaComments,
  FaStar,
  FaUser,
  FaPencilAlt,
} from "react-icons/fa";

// Types
interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  enrolledCount: number;
  rating: number;
  price: number;
  originalPrice?: number;
  category: string;
  thumbnail: string;
  lessons: number;
  isBestseller?: boolean;
  isNew?: boolean;
}

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;
}

// 1. Data from all-courses page
const coursesData: Course[] = [
  {
    id: "1",
    title: "Complete English Grammar Course",
    description:
      "Master English grammar from basics to advanced concepts with practical examples and exercises.",
    instructor: "Sarah Johnson",
    instructorAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
    level: "Beginner",
    duration: "12",
    enrolledCount: 15234,
    rating: 4.7,
    price: 49.99,
    originalPrice: 89.99,
    category: "Grammar",
    thumbnail:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    lessons: 45,
    isBestseller: true,
  },
  {
    id: "2",
    title: "Business English Communication",
    description:
      "Develop professional English skills for meetings, presentations, and business correspondence.",
    instructor: "Michael Chen",
    instructorAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
    level: "Intermediate",
    duration: "8",
    enrolledCount: 8921,
    rating: 4.5,
    price: 59.99,
    category: "Business",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    lessons: 32,
  },
  {
    id: "3",
    title: "IELTS Preparation Masterclass",
    description:
      "Comprehensive preparation for IELTS exam with practice tests and expert guidance.",
    instructor: "Emily Watson",
    instructorAvatar: "https://randomuser.me/api/portraits/women/67.jpg",
    level: "Advanced",
    duration: "15",
    enrolledCount: 12054,
    rating: 4.8,
    price: 79.99,
    originalPrice: 129.99,
    category: "Test Preparation",
    thumbnail:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    lessons: 58,
    isBestseller: true,
  },
  {
    id: "4",
    title: "English Pronunciation Mastery",
    description:
      "Improve your English pronunciation with phonetics, intonation, and accent reduction techniques.",
    instructor: "David Brown",
    instructorAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
    level: "Intermediate",
    duration: "10",
    enrolledCount: 6532,
    rating: 4.6,
    price: 54.99,
    category: "Speaking",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    lessons: 38,
  },
  {
    id: "5",
    title: "Academic Writing Essentials",
    description:
      "Learn to write essays, research papers, and reports with proper structure and academic language.",
    instructor: "Jennifer Lee",
    instructorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    level: "Advanced",
    duration: "12",
    enrolledCount: 4321,
    rating: 4.4,
    price: 64.99,
    category: "Writing",
    thumbnail:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    lessons: 42,
  },
  {
    id: "6",
    title: "Conversational English for Beginners",
    description:
      "Build confidence in everyday English conversations with practical dialogues and scenarios.",
    instructor: "Robert Wilson",
    instructorAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
    level: "Beginner",
    duration: "8",
    enrolledCount: 18765,
    rating: 4.7,
    price: 39.99,
    category: "Speaking",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    lessons: 28,
    isNew: true,
  },
  {
    id: "7",
    title: "English Literature Analysis",
    description:
      "Explore classic and contemporary English literature with critical analysis and interpretation.",
    instructor: "Patricia Moore",
    instructorAvatar: "https://randomuser.me/api/portraits/women/72.jpg",
    level: "Advanced",
    duration: "16",
    enrolledCount: 3210,
    rating: 4.9,
    price: 69.99,
    category: "Literature",
    thumbnail:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    lessons: 52,
  },
  {
    id: "8",
    title: "Vocabulary Building Workshop",
    description:
      "Expand your English vocabulary with effective learning techniques and memory strategies.",
    instructor: "James Taylor",
    instructorAvatar: "https://randomuser.me/api/portraits/men/33.jpg",
    level: "Intermediate",
    duration: "6",
    enrolledCount: 9876,
    rating: 4.5,
    price: 34.99,
    category: "Vocabulary",
    thumbnail:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    lessons: 24,
    isNew: true,
  },
];

// 2. Updated Categories to match course data
const categories: Category[] = [
  { id: 1, name: "Grammar", icon: <FaBook /> },
  { id: 2, name: "Business", icon: <FaBriefcase /> },
  { id: 3, name: "Test Preparation", icon: <FaGraduationCap /> },
  { id: 4, name: "Speaking", icon: <FaComments /> },
  { id: 5, name: "Writing", icon: <FaPencilAlt /> },
  { id: 6, name: "Literature", icon: <FaBook /> },
  { id: 7, name: "Vocabulary", icon: <FaLanguage /> },
];

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { isBangla } = useLanguage();
  const { colors } = useTheme();

  // Filter courses when category changes
  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      // Simulate API call
      const timer = setTimeout(() => {
        const categoryName = categories.find(
          (c) => c.id === selectedCategory,
        )?.name;
        const filtered = coursesData.filter(
          (course) => course.category === categoryName,
        );
        setCourses(filtered);
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setCourses([]);
    }
  }, [selectedCategory]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-start min-h-screen pt-16 px-4 pb-20 text-left">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal Panel */}
        <div
          ref={modalRef}
          className="relative z-50 inline-block w-full max-w-5xl h-auto max-h-[80vh] overflow-hidden rounded-lg text-left shadow-xl transform transition-all"
          style={{ backgroundColor: colors.card }}
        >
          <div className="flex h-full">
            {/* Categories Sidebar */}
            <div
              className="w-1/3 p-4 overflow-y-auto border-r"
              style={{ borderColor: colors.border }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className="text-lg font-medium flex items-center"
                  style={{ color: colors.foreground }}
                >
                  <FaLanguage
                    className="mr-2"
                    style={{ color: colors.primary }}
                  />
                  {isBangla ? "কোর্স বিভাগ" : "Course Categories"}
                </h3>
                <button
                  type="button"
                  className="focus:outline-none"
                  onClick={onClose}
                  style={{ color: colors.muted }}
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="w-full p-3 rounded-lg flex items-center space-x-3 transition-colors"
                    style={{
                      backgroundColor:
                        selectedCategory === category.id
                          ? colors.primary + "15"
                          : "transparent",
                      color:
                        selectedCategory === category.id
                          ? colors.primary
                          : colors.foreground,
                    }}
                  >
                    <div className="text-xl">{category.icon}</div>
                    <div className="text-left">
                      <div className="font-medium">{category.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Courses Content */}
            <div className="w-2/3 p-4 overflow-y-auto">
              {selectedCategory ? (
                <div>
                  <div className="flex items-center mb-4">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="flex items-center mr-4"
                      style={{ color: colors.primary }}
                    >
                      <FaArrowLeft className="mr-1" />
                      {isBangla ? "সব বিভাগ" : "All Categories"}
                    </button>
                    <h3
                      className="text-lg font-medium"
                      style={{ color: colors.foreground }}
                    >
                      {categories.find((c) => c.id === selectedCategory)?.name}
                    </h3>
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2"
                        style={{ borderColor: colors.primary }}
                      ></div>
                    </div>
                  ) : courses.length > 0 ? (
                    <div className="space-y-4">
                      {courses.map((course) => (
                        <Link
                          key={course.id}
                          href={`/course-details/${course.id}`}
                          onClick={onClose}
                          className="block p-4 border rounded-lg transition-colors"
                          style={{
                            borderColor: colors.border,
                            backgroundColor: colors.background,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.card;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              colors.background;
                          }}
                        >
                          <div className="flex">
                            {/* Course Thumbnail */}
                            <div className="flex-shrink-0 mr-4">
                              <Image
                                src={course.thumbnail}
                                alt={course.title}
                                width={80}
                                height={60}
                                className="rounded-md object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4
                                    className="font-medium text-sm"
                                    style={{ color: colors.foreground }}
                                  >
                                    {course.title}
                                  </h4>
                                  <div
                                    className="flex items-center mt-1 text-xs space-x-3"
                                    style={{ color: colors.muted }}
                                  >
                                    <span className="flex items-center">
                                      <FaGraduationCap className="mr-1" />
                                      {course.level}
                                    </span>
                                    <span className="flex items-center">
                                      <FaClock className="mr-1" />
                                      {course.duration}h
                                    </span>
                                    <span className="flex items-center">
                                      <FaDollarSign className="mr-1" />
                                      {course.price}
                                    </span>
                                  </div>
                                  <div
                                    className="flex items-center mt-1 text-xs"
                                    style={{ color: colors.muted }}
                                  >
                                    <div className="flex items-center mr-3">
                                      <FaStar
                                        style={{ color: "#EAB308" }}
                                        className="mr-1"
                                      />
                                      <span>{course.rating}</span>
                                    </div>
                                    <span className="flex items-center">
                                      <FaUser className="mr-1" />{" "}
                                      {course.instructor}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="text-center py-8"
                      style={{ color: colors.muted }}
                    >
                      {isBangla
                        ? "এই বিভাগে কোন কোর্স পাওয়া যায়নি"
                        : "No courses found in this category"}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center h-full"
                  style={{ color: colors.muted }}
                >
                  <FaBook className="text-6xl mb-4" style={{ opacity: 0.3 }} />
                  <p className="text-lg">
                    {isBangla
                      ? "একটি বিভাগ নির্বাচন করুন"
                      : "Select a category to view courses"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
