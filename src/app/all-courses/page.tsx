// src/app/all-courses/page.tsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";
import {
  Search,
  Filter,
  Clock,
  Users,
  Star,
  BookOpen,
  ChevronRight,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";

// TypeScript interface for course data
interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string; // in hours
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

// Mock JSON data for courses
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

// Categories for filter
const categories = [
  "All",
  "Grammar",
  "Business",
  "Test Preparation",
  "Speaking",
  "Writing",
  "Literature",
  "Vocabulary",
];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function AllCoursesPage() {
  const { theme, colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular"); // popular, newest, price-low, price-high, rating
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(
    new Set(),
  );
  const [enrollingCourses, setEnrollingCourses] = useState<Set<string>>(
    new Set(),
  );
  const [cartCourses, setCartCourses] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());

  // Filter and sort courses based on search, category, level, and sort criteria
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = coursesData.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;
      const matchesLevel =
        selectedLevel === "All" || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "popular": // default
        default:
          return b.enrolledCount - a.enrolledCount;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedLevel, sortBy]);

  // Handle enrollment
  const handleEnroll = async (courseId: string) => {
    // Add to enrolling state
    setEnrollingCourses((prev) => new Set(prev).add(courseId));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Add to enrolled courses
      setEnrolledCourses((prev) => new Set(prev).add(courseId));

      // Show success message
      alert("Successfully enrolled in the course!");
    } catch (error) {
      console.error("Error enrolling in course:", error);
      alert("Failed to enroll in the course. Please try again.");
    } finally {
      // Remove from enrolling state
      setEnrollingCourses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  // Handle add to cart
  const handleAddToCart = async (courseId: string) => {
    // Add to adding to cart state
    setAddingToCart((prev) => new Set(prev).add(courseId));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add to cart
      setCartCourses((prev) => new Set(prev).add(courseId));

      // Show success message
      alert("Course added to cart!");
    } catch (error) {
      console.error("Error adding course to cart:", error);
      alert("Failed to add course to cart. Please try again.");
    } finally {
      // Remove from adding to cart state
      setAddingToCart((prev) => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Header Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Courses"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0  bg-gradient-to-r from-[rgb(243,6,110)] to-[rgb(33,65,135)] opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">All Courses</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Explore our comprehensive collection of English language courses
              designed to help you achieve fluency
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                className="h-5 w-5"
                style={{ color: "var(--color-foreground)" }}
                opacity={0.5}
              />
            </div>
            <input
              type="text"
              placeholder="Search for courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border rounded-md shadow-sm placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }}
            />
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center px-4 py-3 rounded-md border"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              color: "var(--color-foreground)",
            }}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }}
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronRight
                className="h-5 w-5"
                style={{ color: "var(--color-foreground)" }}
                opacity={0.5}
              />
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div
          className={`${showFilters ? "block" : "hidden"} md:block mb-8 p-4 rounded-lg`}
          style={{ backgroundColor: "var(--color-card)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: "var(--color-foreground)" }}
              >
                Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category ? "text-white" : ""
                    }`}
                    style={{
                      backgroundColor:
                        selectedCategory === category
                          ? "var(--color-primary)"
                          : "var(--color-background)",
                      color:
                        selectedCategory === category
                          ? "white"
                          : "var(--color-foreground)",
                      border: `1px solid ${selectedCategory === category ? "var(--color-primary)" : "var(--color-border)"}`,
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: "var(--color-foreground)" }}
              >
                Level
              </h3>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedLevel === level ? "text-white" : ""
                    }`}
                    style={{
                      backgroundColor:
                        selectedLevel === level
                          ? "var(--color-primary)"
                          : "var(--color-background)",
                      color:
                        selectedLevel === level
                          ? "white"
                          : "var(--color-foreground)",
                      border: `1px solid ${selectedLevel === level ? "var(--color-primary)" : "var(--color-border)"}`,
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm" style={{ color: "var(--color-foreground)" }}>
            Showing{" "}
            <span className="font-medium">
              {filteredAndSortedCourses.length}
            </span>{" "}
            courses
          </p>
        </div>

        {/* Course Grid */}
        {filteredAndSortedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{ backgroundColor: "var(--color-card)" }}
              >
                {/* Course Image */}
                <div className="relative h-48">
                  <Link href={`/course-details/${course.id}`}>
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover cursor-pointer"
                    />
                  </Link>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {course.isBestseller && (
                      <span
                        className="px-2 py-1 text-xs font-medium rounded"
                        style={{ backgroundColor: "#f59e0b", color: "white" }}
                      >
                        Bestseller
                      </span>
                    )}
                    {course.isNew && (
                      <span
                        className="px-2 py-1 text-xs font-medium rounded"
                        style={{ backgroundColor: "#10b981", color: "white" }}
                      >
                        New
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-4">
                  {/* Category and Level */}
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="text-xs font-medium px-2 py-1 rounded"
                      style={{
                        backgroundColor: "var(--color-accent)",
                        color: "var(--color-background)",
                      }}
                    >
                      {course.category}
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      {course.level}
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/course-details/${course.id}`}>
                    <h3
                      className="font-semibold text-lg mb-2 line-clamp-2 cursor-pointer hover:underline"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {course.title}
                    </h3>
                  </Link>

                  {/* Description */}
                  <p
                    className="text-sm mb-3 line-clamp-2"
                    style={{ color: "var(--color-foreground)", opacity: 0.7 }}
                  >
                    {course.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center mb-3">
                    <Image
                      src={course.instructorAvatar}
                      alt={course.instructor}
                      width={24}
                      height={24}
                      className="rounded-full mr-2"
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {course.instructor}
                    </span>
                  </div>

                  {/* Course Stats */}
                  <div
                    className="flex items-center justify-between text-xs mb-3"
                    style={{ color: "var(--color-foreground)", opacity: 0.7 }}
                  >
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {course.duration}h
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {course.lessons} lessons
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {course.enrolledCount.toLocaleString()}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(course.rating) ? "fill-current" : ""}`}
                          style={{
                            color:
                              i < Math.floor(course.rating)
                                ? "#f59e0b"
                                : "var(--color-border)",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="text-sm ml-2"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {course.rating}
                    </span>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span
                        className="text-lg font-bold"
                        style={{ color: "var(--color-primary)" }}
                      >
                        ${course.price}
                      </span>
                      {course.originalPrice && (
                        <span
                          className="text-sm ml-2 line-through"
                          style={{
                            color: "var(--color-foreground)",
                            opacity: 0.5,
                          }}
                        >
                          ${course.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {enrolledCourses.has(course.id) ? (
                      <Link
                        href={`/course-details/${course.id}`}
                        className="flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium text-white"
                        style={{ backgroundColor: "#10b981" }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Go to Course
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrollingCourses.has(course.id)}
                        className="flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium text-white disabled:opacity-50"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      >
                        {enrollingCourses.has(course.id) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Enrolling...
                          </>
                        ) : (
                          "Enroll Now"
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleAddToCart(course.id)}
                      disabled={
                        addingToCart.has(course.id) ||
                        cartCourses.has(course.id) ||
                        enrolledCourses.has(course.id)
                      }
                      className="p-2 rounded-md border disabled:opacity-50"
                      style={{
                        backgroundColor: cartCourses.has(course.id)
                          ? "var(--color-primary)"
                          : "transparent",
                        color: cartCourses.has(course.id)
                          ? "white"
                          : "var(--color-foreground)",
                        borderColor: "var(--color-border)",
                      }}
                      title={
                        cartCourses.has(course.id) ? "In Cart" : "Add to Cart"
                      }
                    >
                      {addingToCart.has(course.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : cartCourses.has(course.id) ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <ShoppingCart className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: "var(--color-foreground)" }}>
              No courses found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedLevel("All");
              }}
              className="mt-4 px-4 py-2 rounded-md text-sm font-medium text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
