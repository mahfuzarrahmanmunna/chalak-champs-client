// src/app/courses/page.tsx

"use client";

import React, { useState, useMemo } from "react";
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
import {
  coursesData,
  categories,
  levels,
  Course,
} from "../../../data/coursesData";
// import { coursesData, categories, levels, Course } from "@/data/coursesData";

export default function CoursesContent() {
  const { theme, colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(
    new Set(),
  );
  const [enrollingCourses, setEnrollingCourses] = useState<Set<string>>(
    new Set(),
  );
  const [cartCourses, setCartCourses] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = coursesData.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;
      const matchesLevel =
        selectedLevel === "All" || course.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });

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
        case "popular":
        default:
          return b.enrolledCount - a.enrolledCount;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedLevel, sortBy]);

  const handleEnroll = async (courseId: string) => {
    setEnrollingCourses((prev) => new Set(prev).add(courseId));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEnrolledCourses((prev) => new Set(prev).add(courseId));
      alert("Successfully enrolled in the course!");
    } catch (error) {
      alert("Failed to enroll in the course.");
    } finally {
      setEnrollingCourses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const handleAddToCart = async (courseId: string) => {
    setAddingToCart((prev) => new Set(prev).add(courseId));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCartCourses((prev) => new Set(prev).add(courseId));
      alert("Course added to cart!");
    } catch (error) {
      alert("Failed to add course to cart.");
    } finally {
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
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Courses"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgb(243,6,110)] to-[rgb(33,65,135)] opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">All Courses</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Explore our comprehensive collection of English language courses
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
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
              className="block w-full pl-10 pr-3 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }}
            />
          </div>
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
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 rounded-md border focus:outline-none focus:ring-2"
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
        <div
          className={`${showFilters ? "block" : "hidden"} md:block mb-8 p-4 rounded-lg`}
          style={{ backgroundColor: "var(--color-card)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCategory === category ? "text-white" : ""}`}
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
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedLevel === level ? "text-white" : ""}`}
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
        <div className="mb-6">
          <p className="text-sm" style={{ color: "var(--color-foreground)" }}>
            Showing{" "}
            <span className="font-medium">
              {filteredAndSortedCourses.length}
            </span>{" "}
            courses
          </p>
        </div>
        {filteredAndSortedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{ backgroundColor: "var(--color-card)" }}
              >
                <div className="relative h-48">
                  <Link href={`/course-details/${course.id}`}>
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover cursor-pointer"
                    />
                  </Link>
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
                <div className="p-4">
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
                  <Link href={`/course-details/${course.id}`}>
                    <h3
                      className="font-semibold text-lg mb-2 line-clamp-2 cursor-pointer hover:underline"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {course.title}
                    </h3>
                  </Link>
                  <p
                    className="text-sm mb-3 line-clamp-2"
                    style={{ color: "var(--color-foreground)", opacity: 0.7 }}
                  >
                    {course.description}
                  </p>
                  <div className="flex items-center mb-3">
                    <Image
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      width={24}
                      height={24}
                      className="rounded-full mr-2"
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {course.instructor.name}
                    </span>
                  </div>
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
