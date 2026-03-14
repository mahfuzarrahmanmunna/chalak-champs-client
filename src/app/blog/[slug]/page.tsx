// src/app/blog/[slug]/BlogDetails.tsx

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  User,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  ChevronRight,
  ArrowLeft,
  Tag,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Send,
} from "lucide-react";
import {
  blogPosts,
  Comment,
  mockComments,
  BlogPost,
} from "../../../../data/blogData";
// import { blogPosts } from "@/data/blogData";

// Validation schema for comment form
const commentSchema = yup.object().shape({
  comment: yup
    .string()
    .required("Comment is required")
    .min(10, "Comment must be at least 10 characters"),
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

export default function BlogDetailsPage() {
  const { theme, colors } = useTheme();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // React Hook Form for comment
  const {
    register: registerComment,
    handleSubmit: handleCommentSubmit,
    formState: { errors: commentErrors },
    reset: resetCommentForm,
  } = useForm({
    resolver: yupResolver(commentSchema),
    defaultValues: {
      comment: "",
      name: "",
      email: "",
    },
  });

  // Load blog post data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundPost = blogPosts.find((p) => p.slug === slug);
      if (foundPost) {
        setPost(foundPost);
        setIsLiked(foundPost.isLiked);
        setIsBookmarked(foundPost.isBookmarked);

        // Find related posts (same category, different post)
        const related = blogPosts
          .filter(
            (p) => p.category === foundPost.category && p.id !== foundPost.id,
          )
          .slice(0, 3);
        setRelatedPosts(related);
      } else {
        // Post not found, redirect to blog listing
        router.push("/blog");
      }
      setIsLoading(false);
    }, 500);
  }, [slug, router]);

  // Handle comment submission
  const onCommentSubmit: SubmitHandler<any> = (data) => {
    setIsSubmittingComment(true);

    // Simulate API call
    setTimeout(() => {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        userId: "current-user",
        userName: data.name,
        userAvatar: "https://randomuser.me/api/portraits/lego/1.jpg",
        content: data.comment,
        date: new Date().toISOString().split("T")[0],
        likesCount: 0,
        isLiked: false,
      };

      setComments([newComment, ...comments]);
      resetCommentForm();
      setIsSubmittingComment(false);
    }, 1000);
  };

  // Handle like
  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  // Handle bookmark
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Handle share
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post?.title || "";

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${text}&body=${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: "var(--color-primary)" }}
        ></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div className="text-center">
          <h1
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--color-foreground)" }}
          >
            Blog Post Not Found
          </h1>
          <p className="mb-6" style={{ color: "var(--color-foreground)" }}>
            The blog post you are looking for does nt exist.
          </p>
          <Link
            href="/blog"
            className="px-4 py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Featured Image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center text-white">
              <div className="flex items-center mr-6 mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center mr-6 mb-2">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {format(new Date(post.publishDate), "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            {/* Blog Content */}
            <div
              className="prose prose-lg max-w-none"
              style={{ color: "var(--color-foreground)" }}
            >
              {post.content.split("\n").map((paragraph, index) => {
                if (paragraph.startsWith("# ")) {
                  const level = paragraph.split(" ")[0].length;
                  const text = paragraph.substring(level + 1);
                  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
                  return (
                    <Tag
                      key={index}
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {text}
                    </Tag>
                  );
                } else if (paragraph.startsWith("## ")) {
                  const text = paragraph.substring(3);
                  return (
                    <h2
                      key={index}
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {text}
                    </h2>
                  );
                } else if (paragraph.startsWith("### ")) {
                  const text = paragraph.substring(4);
                  return (
                    <h3
                      key={index}
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {text}
                    </h3>
                  );
                } else if (paragraph.startsWith("#### ")) {
                  const text = paragraph.substring(5);
                  return (
                    <h4
                      key={index}
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {text}
                    </h4>
                  );
                } else if (paragraph.startsWith("- ")) {
                  const text = paragraph.substring(2);
                  return (
                    <li
                      key={index}
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {text}
                    </li>
                  );
                } else if (
                  paragraph.startsWith("**") &&
                  paragraph.endsWith("**")
                ) {
                  const text = paragraph.substring(2, paragraph.length - 2);
                  return (
                    <strong
                      key={index}
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {text}
                    </strong>
                  );
                } else if (
                  paragraph.startsWith("*") &&
                  paragraph.endsWith("*")
                ) {
                  const text = paragraph.substring(1, paragraph.length - 1);
                  return (
                    <em
                      key={index}
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {text}
                    </em>
                  );
                } else if (paragraph.trim() === "") {
                  return <br key={index} />;
                } else {
                  return (
                    <p key={index} style={{ color: "var(--color-foreground)" }}>
                      {paragraph}
                    </p>
                  );
                }
              })}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 rounded-full flex items-center"
                  style={{
                    backgroundColor: "var(--color-background)",
                    color: "var(--color-foreground)",
                    border: `1px solid var(--color-border)`,
                  }}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div
              className="flex items-center justify-between mt-8 pt-8 border-t"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className="flex items-center"
                  style={{
                    color: isLiked ? "#ef4444" : "var(--color-foreground)",
                    opacity: isLiked ? 1 : 0.7,
                  }}
                >
                  <Heart
                    className={`h-5 w-5 mr-1 ${isLiked ? "fill-current" : ""}`}
                  />
                  {post.likesCount +
                    (isLiked && !post.isLiked ? 1 : 0) -
                    (!isLiked && post.isLiked ? 1 : 0)}
                </button>
                <div
                  className="flex items-center"
                  style={{ color: "var(--color-foreground)", opacity: 0.7 }}
                >
                  <MessageCircle className="h-5 w-5 mr-1" />
                  {post.commentsCount}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBookmark}
                  className="p-2 rounded-full"
                  style={{
                    color: isBookmarked ? "#f59e0b" : "var(--color-foreground)",
                    opacity: isBookmarked ? 1 : 0.7,
                  }}
                >
                  <Bookmark
                    className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
                  />
                </button>
                <div className="relative">
                  <button
                    className="p-2 rounded-full"
                    style={{ color: "var(--color-foreground)", opacity: 0.7 }}
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10"
                    style={{ backgroundColor: "var(--color-card)" }}
                  >
                    <button
                      onClick={() => handleShare("facebook")}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare("email")}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Bio */}
            <div
              className="mt-12 p-6 rounded-lg"
              style={{ backgroundColor: "var(--color-card)" }}
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {post.author.name}
                  </h3>
                  <p style={{ color: "var(--color-foreground)", opacity: 0.7 }}>
                    {post.author.bio}
                  </p>
                </div>
              </div>
              <button
                className="px-4 py-2 rounded-md text-white font-medium"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Follow Author
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-12">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--color-foreground)" }}
              >
                Comments ({comments.length})
              </h2>

              {/* Comment Form */}
              <div
                className="p-6 rounded-lg mb-8"
                style={{ backgroundColor: "var(--color-card)" }}
              >
                <h3
                  className="text-lg font-medium mb-4"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Leave a Comment
                </h3>
                <form onSubmit={handleCommentSubmit(onCommentSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-1"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        style={{
                          backgroundColor: "var(--color-background)",
                          borderColor: commentErrors.name
                            ? "#ef4444"
                            : "var(--color-border)",
                          color: "var(--color-foreground)",
                        }}
                        {...registerComment("name")}
                      />
                      {commentErrors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {commentErrors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-1"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        style={{
                          backgroundColor: "var(--color-background)",
                          borderColor: commentErrors.email
                            ? "#ef4444"
                            : "var(--color-border)",
                          color: "var(--color-foreground)",
                        }}
                        {...registerComment("email")}
                      />
                      {commentErrors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {commentErrors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      style={{
                        backgroundColor: "var(--color-background)",
                        borderColor: commentErrors.comment
                          ? "#ef4444"
                          : "var(--color-border)",
                        color: "var(--color-foreground)",
                      }}
                      placeholder="Share your thoughts..."
                      {...registerComment("comment")}
                    ></textarea>
                    {commentErrors.comment && (
                      <p className="mt-1 text-sm text-red-600">
                        {commentErrors.comment.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingComment}
                    className="px-4 py-2 rounded-md text-white font-medium disabled:opacity-50 flex items-center"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    {isSubmittingComment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post Comment
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-6 rounded-lg"
                    style={{ backgroundColor: "var(--color-card)" }}
                  >
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={comment.userAvatar}
                          alt={comment.userName}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4
                            className="font-medium mr-2"
                            style={{ color: "var(--color-foreground)" }}
                          >
                            {comment.userName}
                          </h4>
                          <span
                            className="text-sm"
                            style={{
                              color: "var(--color-foreground)",
                              opacity: 0.7,
                            }}
                          >
                            {format(new Date(comment.date), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <p
                          className="mb-3"
                          style={{
                            color: "var(--color-foreground)",
                            opacity: 0.8,
                          }}
                        >
                          {comment.content}
                        </p>
                        <button
                          className="flex items-center text-sm"
                          style={{
                            color: comment.isLiked
                              ? "#ef4444"
                              : "var(--color-foreground)",
                            opacity: comment.isLiked ? 1 : 0.7,
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 mr-1 ${comment.isLiked ? "fill-current" : ""}`}
                          />
                          {comment.likesCount}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <div className="sticky top-6 space-y-8">
              {/* Table of Contents */}
              <div
                className="p-6 rounded-lg"
                style={{ backgroundColor: "var(--color-card)" }}
              >
                <h3
                  className="text-lg font-medium mb-4"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Table of Contents
                </h3>
                <ul className="space-y-2">
                  {post.content
                    .split("\n")
                    .filter((line) => line.startsWith("# "))
                    .map((heading, index) => {
                      const level = heading.split(" ")[0].length;
                      const text = heading.substring(level + 1);
                      return (
                        <li
                          key={index}
                          className={`${level > 1 ? "ml-" + (level - 1) * 4 : ""}`}
                        >
                          <a
                            href={`#${text.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-sm hover:underline"
                            style={{
                              color: "var(--color-foreground)",
                              opacity: 0.8,
                            }}
                          >
                            {text}
                          </a>
                        </li>
                      );
                    })}
                </ul>
              </div>

              {/* Related Posts */}
              <div>
                <h3
                  className="text-lg font-medium mb-4"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Related Posts
                </h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="block p-4 rounded-lg transition-all hover:shadow-md"
                      style={{ backgroundColor: "var(--color-card)" }}
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4
                            className="font-medium text-sm mb-1 line-clamp-2"
                            style={{ color: "var(--color-foreground)" }}
                          >
                            {relatedPost.title}
                          </h4>
                          <div
                            className="flex items-center text-xs"
                            style={{
                              color: "var(--color-foreground)",
                              opacity: 0.7,
                            }}
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(
                              new Date(relatedPost.publishDate),
                              "MMM dd",
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
