// src/app/blog/page.tsx

"use client";

import React, { useState, useMemo } from "react";
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
import { blogPosts, categories, BlogPost } from "../../../data/blogData";
// import { blogPosts, categories, BlogPost } from "@/data/blogData";

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
