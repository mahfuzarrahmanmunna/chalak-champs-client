// src/app/blog/page.tsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  ChevronRight,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  Tag,
} from "lucide-react";

// TypeScript interfaces
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishDate: string;
  readTime: number; // in minutes
  category: string;
  tags: string[];
  featuredImage: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

// Mock blog data
const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "effective-english-learning-strategies",
    title: "10 Effective Strategies for Learning English Faster",
    excerpt:
      "Discover proven techniques and methods that can significantly accelerate your English learning journey. From immersive practice to spaced repetition, these strategies will help you achieve fluency more efficiently.",
    content:
      "Learning English effectively requires a combination of proven strategies and consistent practice. In this comprehensive guide, we'll explore ten powerful techniques that can dramatically accelerate your language acquisition process...",
    author: {
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      bio: "Sarah is an experienced English language instructor with over 10 years of teaching experience.",
    },
    publishDate: "2023-10-25",
    readTime: 8,
    category: "Learning Tips",
    tags: ["learning", "strategies", "fluency", "practice"],
    featuredImage:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likesCount: 342,
    commentsCount: 28,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "2",
    slug: "common-grammar-mistakes",
    title: "Common Grammar Mistakes and How to Avoid Them",
    excerpt:
      "Even advanced English speakers make these common grammar mistakes. Learn what they are and how to avoid them in your writing and speaking to sound more professional and confident.",
    content:
      "Grammar mistakes can undermine your credibility and make your English sound less professional. In this article, we'll identify the most common grammar errors that even advanced learners make and provide clear explanations on how to avoid them...",
    author: {
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      bio: "Michael is a grammar expert with a passion for helping students improve their English accuracy.",
    },
    publishDate: "2023-10-20",
    readTime: 6,
    category: "Grammar",
    tags: ["grammar", "mistakes", "writing", "accuracy"],
    featuredImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likesCount: 287,
    commentsCount: 42,
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: "3",
    slug: "business-english-vocabulary",
    title: "Essential Business English Vocabulary for Professionals",
    excerpt:
      "Expand your professional vocabulary with these essential business English terms and phrases. Perfect for meetings, presentations, and workplace communication.",
    content:
      "In today's global business environment, having a strong command of business English vocabulary is crucial for professional success. This comprehensive guide covers the most important terms and phrases used in business contexts...",
    author: {
      name: "Emily Watson",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
      bio: "Emily is a business communication specialist with experience in corporate training.",
    },
    publishDate: "2023-10-15",
    readTime: 10,
    category: "Business English",
    tags: ["business", "vocabulary", "professional", "workplace"],
    featuredImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likesCount: 198,
    commentsCount: 15,
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: "4",
    slug: "pronunciation-tips",
    title: "5 Pronunciation Tips to Sound More Like a Native Speaker",
    excerpt:
      "Improve your English pronunciation with these expert tips. Learn about stress patterns, intonation, and common pronunciation challenges that many English learners face.",
    content:
      "Achieving native-like pronunciation is one of the most challenging aspects of learning English. However, with the right techniques and consistent practice, you can significantly improve your pronunciation and sound more natural...",
    author: {
      name: "David Brown",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      bio: "David is a pronunciation coach with expertise in phonetics and accent reduction.",
    },
    publishDate: "2023-10-10",
    readTime: 7,
    category: "Speaking",
    tags: ["pronunciation", "accent", "speaking", "native"],
    featuredImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likesCount: 423,
    commentsCount: 31,
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: "5",
    slug: "ielts-writing-task-2",
    title: "Mastering IELTS Writing Task 2: A Step-by-Step Guide",
    excerpt:
      "Learn how to structure your essay, develop ideas, and use appropriate vocabulary to achieve a high score in IELTS Writing Task 2. Includes sample essays and examiner feedback.",
    content:
      "IELTS Writing Task 2 can be challenging, but with the right approach, you can achieve a high score. This comprehensive guide breaks down the essay writing process into manageable steps, from understanding the question to proofreading your final draft...",
    author: {
      name: "Jennifer Lee",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "Jennifer is an IELTS examiner with over 15 years of experience in test preparation.",
    },
    publishDate: "2023-10-05",
    readTime: 12,
    category: "Test Preparation",
    tags: ["IELTS", "writing", "essay", "test"],
    featuredImage:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likesCount: 567,
    commentsCount: 89,
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: "6",
    slug: "english-idioms-expressions",
    title: "20 Common English Idioms and How to Use Them",
    excerpt:
      "Idioms add color and personality to your English. Learn 20 common English idioms, their meanings, and how to use them correctly in everyday conversation.",
    content:
      "English idioms can be confusing for language learners because their meanings often can't be guessed from the individual words. In this article, we'll explore 20 common English idioms, explain their meanings, and provide examples of how to use them in context...",
    author: {
      name: "Robert Wilson",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      bio: "Robert is a linguist specializing in English idioms and expressions.",
    },
    publishDate: "2023-09-28",
    readTime: 9,
    category: "Vocabulary",
    tags: ["idioms", "expressions", "vocabulary", "phrases"],
    featuredImage:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likesCount: 234,
    commentsCount: 17,
    isLiked: false,
    isBookmarked: false,
  },
];

// Categories for filter
const categories = [
  "All",
  "Learning Tips",
  "Grammar",
  "Business English",
  "Speaking",
  "Test Preparation",
  "Vocabulary",
];

export default function BlogPage() {
  const { theme, colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recent"); // recent, popular, alphabetical
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(
    new Set(),
  );

  // Filter and sort blog posts based on search, category, and sort criteria
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = blogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.likesCount - a.likesCount;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "recent": // default
        default:
          return (
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime()
          );
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredAndSortedPosts.slice(
    indexOfFirstPost,
    indexOfLastPost,
  );
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);

  // Handle like
  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // Handle bookmark
  const handleBookmark = (postId: string) => {
    setBookmarkedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Header Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Blog"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0  bg-gradient-to-r from-[rgb(243,6,110)] to-[rgb(33,65,135)] opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Chalak Champs Blog
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Tips, resources, and insights to help you master the English
              language
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
                style={{ color: "var(--color-foreground)", opacity: 0.5 }}
              />
            </div>
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronRight
                className="h-5 w-5"
                style={{ color: "var(--color-foreground)", opacity: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div
          className={`${showFilters ? "block" : "hidden"} md:block mb-8 p-4 rounded-lg`}
          style={{ backgroundColor: "var(--color-card)" }}
        >
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

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm" style={{ color: "var(--color-foreground)" }}>
            Showing{" "}
            <span className="font-medium">{filteredAndSortedPosts.length}</span>{" "}
            blog posts
          </p>
        </div>

        {/* Blog Posts Grid */}
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{ backgroundColor: "var(--color-card)" }}
              >
                {/* Featured Image */}
                <div className="relative h-48">
                  <Link href={`/blog/${post.slug}`}>
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover cursor-pointer"
                    />
                  </Link>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  {/* Category */}
                  <div className="mb-2">
                    <span
                      className="text-xs font-medium px-2 py-1 rounded"
                      style={{
                        backgroundColor: "var(--color-accent)",
                        color: "var(--color-background)",
                      }}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/blog/${post.slug}`}>
                    <h3
                      className="font-bold text-xl mb-2 line-clamp-2 cursor-pointer hover:underline"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {post.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p
                    className="text-sm mb-4 line-clamp-3"
                    style={{ color: "var(--color-foreground)", opacity: 0.7 }}
                  >
                    {post.excerpt}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--color-foreground)" }}
                        >
                          {post.author.name}
                        </p>
                        <div
                          className="flex items-center text-xs"
                          style={{
                            color: "var(--color-foreground)",
                            opacity: 0.7,
                          }}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(post.publishDate), "MMM dd, yyyy")}
                          <span className="mx-1">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          {post.readTime} min read
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: "var(--color-background)",
                          color: "var(--color-foreground)",
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center text-sm"
                        style={{
                          color: likedPosts.has(post.id)
                            ? "#ef4444"
                            : "var(--color-foreground)",
                          opacity: likedPosts.has(post.id) ? 1 : 0.7,
                        }}
                      >
                        <Heart
                          className={`h-4 w-4 mr-1 ${likedPosts.has(post.id) ? "fill-current" : ""}`}
                        />
                        {post.likesCount +
                          (likedPosts.has(post.id) && !post.isLiked ? 1 : 0) -
                          (!likedPosts.has(post.id) && post.isLiked ? 1 : 0)}
                      </button>
                      <div
                        className="flex items-center text-sm"
                        style={{
                          color: "var(--color-foreground)",
                          opacity: 0.7,
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.commentsCount}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleBookmark(post.id)}
                        className="p-1 rounded"
                        style={{
                          color: bookmarkedPosts.has(post.id)
                            ? "#f59e0b"
                            : "var(--color-foreground)",
                          opacity: bookmarkedPosts.has(post.id) ? 1 : 0.7,
                        }}
                      >
                        <Bookmark
                          className={`h-4 w-4 ${bookmarkedPosts.has(post.id) ? "fill-current" : ""}`}
                        />
                      </button>
                      <button
                        className="p-1 rounded"
                        style={{
                          color: "var(--color-foreground)",
                          opacity: 0.7,
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: "var(--color-foreground)" }}>
              No blog posts found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-4 py-2 rounded-md text-sm font-medium text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md disabled:opacity-50"
                style={{
                  backgroundColor:
                    currentPage === 1 ? "transparent" : "var(--color-card)",
                  color: "var(--color-foreground)",
                  border:
                    currentPage === 1
                      ? "1px solid var(--color-border)"
                      : "none",
                }}
              >
                Previous
              </button>

              {[...Array(totalPages)]
                .map((_, i) => i + 1)
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === page ? "text-white" : ""
                    }`}
                    style={{
                      backgroundColor:
                        currentPage === page
                          ? "var(--color-primary)"
                          : "var(--color-card)",
                      color:
                        currentPage === page
                          ? "white"
                          : "var(--color-foreground)",
                    }}
                  >
                    {page}
                  </button>
                ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md disabled:opacity-50"
                style={{
                  backgroundColor:
                    currentPage === totalPages
                      ? "transparent"
                      : "var(--color-card)",
                  color: "var(--color-foreground)",
                  border:
                    currentPage === totalPages
                      ? "1px solid var(--color-border)"
                      : "none",
                }}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
