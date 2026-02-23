// src/app/course-details/[id]/page.jsx

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format } from "date-fns";
import {
  Clock,
  Users,
  Star,
  BookOpen,
  Play,
  CheckCircle,
  MessageCircle,
  ThumbsUp,
  Calendar,
  Award,
  DollarSign,
  User,
  ChevronRight,
  ArrowLeft,
  Heart,
  Share2,
  Download,
  Filter,
  BarChart3,
  Target,
  Zap,
  Globe,
} from "lucide-react";

// TypeScript interfaces
interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  instructor: {
    name: string;
    avatar: string;
    bio: string;
    rating: number;
    studentsCount: number;
    coursesCount: number;
  };
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string; // in hours
  enrolledCount: number;
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice?: number;
  category: string;
  thumbnail: string;
  previewVideo?: string;
  language: string;
  subtitles: string[];
  lastUpdated: string;
  requirements: string[];
  whatYouLearn: string[];
  curriculum: {
    id: string;
    title: string;
    duration: string;
    lessons: {
      id: string;
      title: string;
      duration: string;
      isPreview: boolean;
    }[];
  }[];
  isBestseller?: boolean;
  isNew?: boolean;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
  isHelpful?: boolean;
}

// Mock course data
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Complete English Grammar Course",
    description:
      "Master English grammar from basics to advanced concepts with practical examples and exercises.",
    fullDescription:
      "This comprehensive English grammar course is designed to take you from beginner to advanced level. We'll cover all aspects of English grammar including tenses, parts of speech, sentence structure, punctuation, and more. Each module includes detailed explanations, practical examples, and exercises to reinforce your learning. By the end of this course, you'll have a solid understanding of English grammar and be able to use it confidently in your writing and speaking.",
    instructor: {
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      bio: "Sarah is an experienced English language instructor with over 10 years of teaching experience. She specializes in grammar and writing skills.",
      rating: 4.8,
      studentsCount: 45678,
      coursesCount: 5,
    },
    level: "Beginner",
    duration: "12",
    enrolledCount: 15234,
    rating: 4.7,
    reviewsCount: 3456,
    price: 49.99,
    originalPrice: 89.99,
    category: "Grammar",
    thumbnail:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    previewVideo:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    language: "English",
    subtitles: ["English", "Spanish", "French"],
    lastUpdated: "2023-10-15",
    requirements: [
      "Basic understanding of English",
      "Willingness to learn and practice",
      "Notebook for taking notes",
    ],
    whatYouLearn: [
      "Master all English grammar rules",
      "Improve writing skills",
      "Enhance speaking confidence",
      "Understand complex sentence structures",
      "Use punctuation correctly",
      "Avoid common grammar mistakes",
    ],
    curriculum: [
      {
        id: "1",
        title: "Introduction to Grammar",
        duration: "1h 30m",
        lessons: [
          {
            id: "1.1",
            title: "What is Grammar?",
            duration: "15m",
            isPreview: true,
          },
          {
            id: "1.2",
            title: "Parts of Speech Overview",
            duration: "25m",
            isPreview: false,
          },
          {
            id: "1.3",
            title: "Sentence Structure",
            duration: "30m",
            isPreview: false,
          },
          {
            id: "1.4",
            title: "Basic Punctuation",
            duration: "20m",
            isPreview: false,
          },
        ],
      },
      {
        id: "2",
        title: "Nouns and Pronouns",
        duration: "2h 15m",
        lessons: [
          {
            id: "2.1",
            title: "Types of Nouns",
            duration: "30m",
            isPreview: false,
          },
          {
            id: "2.2",
            title: "Countable and Uncountable Nouns",
            duration: "25m",
            isPreview: false,
          },
          {
            id: "2.3",
            title: "Pronoun Types",
            duration: "35m",
            isPreview: false,
          },
          {
            id: "2.4",
            title: "Pronoun Agreement",
            duration: "25m",
            isPreview: false,
          },
          {
            id: "2.5",
            title: "Possessive Nouns and Pronouns",
            duration: "20m",
            isPreview: false,
          },
        ],
      },
      {
        id: "3",
        title: "Verbs and Tenses",
        duration: "3h 45m",
        lessons: [
          { id: "3.1", title: "Verb Types", duration: "30m", isPreview: false },
          {
            id: "3.2",
            title: "Present Tenses",
            duration: "45m",
            isPreview: false,
          },
          {
            id: "3.3",
            title: "Past Tenses",
            duration: "45m",
            isPreview: false,
          },
          {
            id: "3.4",
            title: "Future Tenses",
            duration: "45m",
            isPreview: false,
          },
          {
            id: "3.5",
            title: "Perfect Tenses",
            duration: "40m",
            isPreview: false,
          },
          {
            id: "3.6",
            title: "Conditional Sentences",
            duration: "20m",
            isPreview: false,
          },
        ],
      },
    ],
    isBestseller: true,
  },
  {
    id: "2",
    title: "Business English Communication",
    description:
      "Develop professional English skills for meetings, presentations, and business correspondence.",
    fullDescription:
      "This course focuses on the specific English language skills needed in a business environment. You'll learn how to communicate effectively in meetings, write professional emails and reports, deliver compelling presentations, and network with confidence. The course includes real-world business scenarios and practical exercises to help you apply what you learn directly to your workplace.",
    instructor: {
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      bio: "Michael is a business communication expert with 15 years of corporate training experience. He has worked with Fortune 500 companies worldwide.",
      rating: 4.6,
      studentsCount: 23456,
      coursesCount: 3,
    },
    level: "Intermediate",
    duration: "8",
    enrolledCount: 8921,
    rating: 4.5,
    reviewsCount: 1234,
    price: 59.99,
    category: "Business",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    language: "English",
    subtitles: ["English", "Chinese", "Japanese"],
    lastUpdated: "2023-09-20",
    requirements: [
      "Intermediate English proficiency",
      "Basic business knowledge",
      "Desire to improve professional communication",
    ],
    whatYouLearn: [
      "Write effective business emails",
      "Deliver engaging presentations",
      "Participate confidently in meetings",
      "Network with professionals",
      "Use appropriate business vocabulary",
      "Understand cross-cultural communication",
    ],
    curriculum: [
      {
        id: "1",
        title: "Business Writing Essentials",
        duration: "2h 30m",
        lessons: [
          {
            id: "1.1",
            title: "Email Etiquette",
            duration: "30m",
            isPreview: true,
          },
          {
            id: "1.2",
            title: "Report Writing",
            duration: "45m",
            isPreview: false,
          },
          {
            id: "1.3",
            title: "Proposals and Memos",
            duration: "35m",
            isPreview: false,
          },
          {
            id: "1.4",
            title: "Professional Tone",
            duration: "20m",
            isPreview: false,
          },
          {
            id: "1.5",
            title: "Editing and Proofreading",
            duration: "20m",
            isPreview: false,
          },
        ],
      },
      {
        id: "2",
        title: "Presentation Skills",
        duration: "3h 15m",
        lessons: [
          {
            id: "2.1",
            title: "Structuring Presentations",
            duration: "30m",
            isPreview: false,
          },
          {
            id: "2.2",
            title: "Visual Aids",
            duration: "25m",
            isPreview: false,
          },
          {
            id: "2.3",
            title: "Body Language",
            duration: "40m",
            isPreview: false,
          },
          {
            id: "2.4",
            title: "Handling Q&A",
            duration: "30m",
            isPreview: false,
          },
          {
            id: "2.5",
            title: "Virtual Presentations",
            duration: "40m",
            isPreview: false,
          },
          {
            id: "2.6",
            title: "Practice Session",
            duration: "20m",
            isPreview: false,
          },
        ],
      },
    ],
  },
];

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Smith",
    userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    comment:
      "This course exceeded my expectations! The instructor explains complex grammar concepts in a very clear and simple way. The exercises are helpful and the examples are practical. I highly recommend this course to anyone struggling with English grammar.",
    date: "2023-10-20",
    helpfulCount: 24,
    isHelpful: false,
  },
  {
    id: "2",
    userId: "user2",
    userName: "Emily Johnson",
    userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
    comment:
      "Great course with comprehensive content. I've learned a lot about English grammar that I never understood in school. The only reason I'm giving 4 stars instead of 5 is that I wish there were more interactive exercises.",
    date: "2023-10-15",
    helpfulCount: 18,
    isHelpful: true,
  },
  {
    id: "3",
    userId: "user3",
    userName: "David Brown",
    userAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
    rating: 5,
    comment:
      "I've tried many grammar courses before, but this one is by far the best. The instructor is engaging and the course structure is logical. I especially appreciate the real-world examples that make the concepts easy to understand and remember.",
    date: "2023-10-10",
    helpfulCount: 32,
    isHelpful: false,
  },
];

// Validation schema for comment form
const commentSchema = yup.object().shape({
  comment: yup
    .string()
    .required("Comment is required")
    .min(10, "Comment must be at least 10 characters"),
  rating: yup
    .number()
    .required("Rating is required")
    .min(1, "Please select a rating")
    .max(5, "Maximum rating is 5"),
});

// Validation schema for enrollment form
const enrollmentSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  paymentMethod: yup.string().required("Payment method is required"),
  cardNumber: yup
    .string()
    .when("paymentMethod", {
      is: "card",
      then: (schema) =>
        schema
          .required("Card number is required")
          .matches(/^[0-9]{16}$/, "Card number must be 16 digits"),
    }),
  expiryDate: yup
    .string()
    .when("paymentMethod", {
      is: "card",
      then: (schema) =>
        schema
          .required("Expiry date is required")
          .matches(
            /^(0[1-9]|1[0-2])\/\d{2}$/,
            "Expiry date must be in MM/YY format",
          ),
    }),
  cvv: yup
    .string()
    .when("paymentMethod", {
      is: "card",
      then: (schema) =>
        schema
          .required("CVV is required")
          .matches(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits"),
    }),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], "You must agree to the terms and conditions"),
});

export default function CourseDetailsPage() {
  const { theme, colors } = useTheme();
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState<string[]>(["1"]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // React Hook Form for comment
  const {
    register: registerComment,
    handleSubmit: handleCommentSubmit,
    formState: { errors: commentErrors },
    reset: resetCommentForm,
    setValue: setCommentValue,
    watch: watchComment,
  } = useForm({
    resolver: yupResolver(commentSchema),
    defaultValues: {
      comment: "",
      rating: 5,
    },
  });

  // React Hook Form for enrollment
  const {
    register: registerEnrollment,
    handleSubmit: handleEnrollmentSubmit,
    formState: { errors: enrollmentErrors },
    reset: resetEnrollmentForm,
    watch: watchEnrollment,
  } = useForm({
    resolver: yupResolver(enrollmentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      paymentMethod: "card",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      agreeToTerms: false,
    },
  });

  // Load course data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundCourse = mockCourses.find((c) => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        // Course not found, redirect to all courses
        router.push("/all-courses");
      }
      setIsLoading(false);
    }, 500);
  }, [courseId, router]);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  // Handle review submission
  const onCommentSubmit: SubmitHandler<any> = (data) => {
    setIsSubmittingReview(true);

    // Simulate API call
    setTimeout(() => {
      const newReview: Review = {
        id: `review-${Date.now()}`,
        userId: "current-user",
        userName: "Current User",
        userAvatar: "https://randomuser.me/api/portraits/lego/1.jpg",
        rating: data.rating,
        comment: data.comment,
        date: new Date().toISOString().split("T")[0],
        helpfulCount: 0,
        isHelpful: false,
      };

      setReviews([newReview, ...reviews]);
      resetCommentForm();
      setIsSubmittingReview(false);
    }, 1000);
  };

  // Handle enrollment submission
  const onEnrollmentSubmit: SubmitHandler<any> = (data) => {
    setIsEnrolling(true);

    // Simulate API call
    setTimeout(() => {
      setIsEnrolled(true);
      setShowEnrollmentModal(false);
      resetEnrollmentForm();
      setIsEnrolling(false);

      // Show success message
      alert("Enrollment successful! You can now access the course.");
    }, 2000);
  };

  // Handle review helpfulness
  const toggleHelpful = (reviewId: string) => {
    setReviews(
      reviews.map((review) => {
        if (review.id === reviewId) {
          return {
            ...review,
            helpfulCount: review.isHelpful
              ? review.helpfulCount - 1
              : review.helpfulCount + 1,
            isHelpful: !review.isHelpful,
          };
        }
        return review;
      }),
    );
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

  if (!course) {
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
            Course Not Found
          </h1>
          <p className="mb-6" style={{ color: "var(--color-foreground)" }}>
            The course you're looking for doesn't exist.
          </p>
          <Link
            href="/all-courses"
            className="px-4 py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Browse All Courses
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
      {/* Course Header */}
      <div className="relative">
        <div className="absolute inset-0">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="mb-4">
                <Link
                  href="/all-courses"
                  className="inline-flex items-center text-sm font-medium mb-4"
                  style={{ color: "var(--color-primary)" }}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Courses
                </Link>

                <div className="flex flex-wrap gap-2 mb-4">
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
                  <span
                    className="px-2 py-1 text-xs font-medium rounded"
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "var(--color-background)",
                    }}
                  >
                    {course.category}
                  </span>
                  <span
                    className="px-2 py-1 text-xs font-medium rounded"
                    style={{
                      backgroundColor: "var(--color-secondary)",
                      color: "white",
                    }}
                  >
                    {course.level}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  {course.title}
                </h1>
                <p className="text-lg text-white mb-6 opacity-90">
                  {course.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-white">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(course.rating) ? "fill-current" : ""}`}
                          style={{
                            color:
                              i < Math.floor(course.rating)
                                ? "#f59e0b"
                                : "rgba(255, 255, 255, 0.5)",
                          }}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{course.rating}</span>
                    <span className="ml-1 opacity-75">
                      ({course.reviewsCount} ratings)
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-1" />
                    <span>
                      {course.enrolledCount.toLocaleString()} students
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-1" />
                    <span>{course.duration} hours</span>
                  </div>

                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-1" />
                    <span>{course.language}</span>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-1" />
                    <span>
                      Updated{" "}
                      {format(new Date(course.lastUpdated), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-96">
              <div
                className="rounded-lg overflow-hidden shadow-lg"
                style={{ backgroundColor: "var(--color-card)" }}
              >
                {course.previewVideo ? (
                  <div className="relative h-48">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                      <button className="p-3 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all">
                        <Play
                          className="h-6 w-6 text-gray-800"
                          fill="currentColor"
                        />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="h-48 flex items-center justify-center"
                    style={{ backgroundColor: "var(--color-background)" }}
                  >
                    <Play
                      className="h-12 w-12"
                      style={{ color: "var(--color-foreground)" }}
                      opacity={0.5}
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {course.originalPrice ? (
                        <>
                          <span
                            className="text-2xl font-bold"
                            style={{ color: "var(--color-primary)" }}
                          >
                            ${course.price}
                          </span>
                          <span
                            className="text-lg ml-2 line-through"
                            style={{
                              color: "var(--color-foreground)",
                              opacity: 0.5,
                            }}
                          >
                            ${course.originalPrice}
                          </span>
                        </>
                      ) : (
                        <span
                          className="text-2xl font-bold"
                          style={{ color: "var(--color-primary)" }}
                        >
                          ${course.price}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className="p-2 rounded-full"
                        style={{ backgroundColor: "var(--color-background)" }}
                      >
                        <Heart
                          className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                          style={{
                            color: isWishlisted
                              ? "#ef4444"
                              : "var(--color-foreground)",
                          }}
                        />
                      </button>
                      <button
                        className="p-2 rounded-full"
                        style={{ backgroundColor: "var(--color-background)" }}
                      >
                        <Share2
                          className="h-5 w-5"
                          style={{ color: "var(--color-foreground)" }}
                        />
                      </button>
                    </div>
                  </div>

                  {isEnrolled ? (
                    <button
                      className="w-full py-3 rounded-md text-white font-medium"
                      style={{ backgroundColor: "#10b981" }}
                    >
                      Go to Course
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowEnrollmentModal(true)}
                      className="w-full py-3 rounded-md text-white font-medium mb-3"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      Enroll Now
                    </button>
                  )}

                  <button
                    className="w-full py-3 rounded-md font-medium border"
                    style={{
                      backgroundColor: "transparent",
                      color: "var(--color-foreground)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    Add to Cart
                  </button>

                  <div className="mt-4 space-y-2">
                    <div
                      className="flex items-center text-sm"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      <span>30-day money back guarantee</span>
                    </div>
                    <div
                      className="flex items-center text-sm"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      <span>Certificate of completion</span>
                    </div>
                    <div
                      className="flex items-center text-sm"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      <span>Lifetime access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {/* Tabs */}
            <div
              className="border-b mb-8"
              style={{ borderColor: "var(--color-border)" }}
            >
              <nav className="-mb-px flex space-x-8">
                {["overview", "curriculum", "instructor", "reviews"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                      style={{
                        borderColor:
                          activeTab === tab
                            ? "var(--color-primary)"
                            : "transparent",
                        color:
                          activeTab === tab
                            ? "var(--color-primary)"
                            : "var(--color-foreground)",
                      }}
                    >
                      {tab}
                    </button>
                  ),
                )}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h2
                    className="text-2xl font-bold mb-4"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    Description
                  </h2>
                  <p style={{ color: "var(--color-foreground)", opacity: 0.8 }}>
                    {course.fullDescription}
                  </p>
                </div>

                <div>
                  <h2
                    className="text-2xl font-bold mb-4"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    What you'll learn
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.whatYouLearn.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                        <span
                          style={{
                            color: "var(--color-foreground)",
                            opacity: 0.8,
                          }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2
                    className="text-2xl font-bold mb-4"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    Requirements
                  </h2>
                  <ul className="space-y-2">
                    {course.requirements.map((requirement, index) => (
                      <li
                        key={index}
                        className="flex items-start"
                        style={{
                          color: "var(--color-foreground)",
                          opacity: 0.8,
                        }}
                      >
                        <span className="mr-2">•</span>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2
                    className="text-2xl font-bold mb-4"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    Course Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className="flex items-center p-4 rounded-lg"
                      style={{ backgroundColor: "var(--color-card)" }}
                    >
                      <Target
                        className="h-8 w-8 mr-3"
                        style={{ color: "var(--color-primary)" }}
                      />
                      <div>
                        <h3
                          className="font-medium"
                          style={{ color: "var(--color-foreground)" }}
                        >
                          Practical Learning
                        </h3>
                        <p
                          className="text-sm"
                          style={{
                            color: "var(--color-foreground)",
                            opacity: 0.7,
                          }}
                        >
                          Hands-on exercises and real-world examples
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-center p-4 rounded-lg"
                      style={{ backgroundColor: "var(--color-card)" }}
                    >
                      <Zap
                        className="h-8 w-8 mr-3"
                        style={{ color: "var(--color-primary)" }}
                      />
                      <div>
                        <h3
                          className="font-medium"
                          style={{ color: "var(--color-foreground)" }}
                        >
                          Self-Paced
                        </h3>
                        <p
                          className="text-sm"
                          style={{
                            color: "var(--color-foreground)",
                            opacity: 0.7,
                          }}
                        >
                          Learn at your own pace with lifetime access
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-center p-4 rounded-lg"
                      style={{ backgroundColor: "var(--color-card)" }}
                    >
                      <Award
                        className="h-8 w-8 mr-3"
                        style={{ color: "var(--color-primary)" }}
                      />
                      <div>
                        <h3
                          className="font-medium"
                          style={{ color: "var(--color-foreground)" }}
                        >
                          Certificate
                        </h3>
                        <p
                          className="text-sm"
                          style={{
                            color: "var(--color-foreground)",
                            opacity: 0.7,
                          }}
                        >
                          Receive a certificate upon completion
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-center p-4 rounded-lg"
                      style={{ backgroundColor: "var(--color-card)" }}
                    >
                      <Download
                        className="h-8 w-8 mr-3"
                        style={{ color: "var(--color-primary)" }}
                      />
                      <div>
                        <h3
                          className="font-medium"
                          style={{ color: "var(--color-foreground)" }}
                        >
                          Resources
                        </h3>
                        <p
                          className="text-sm"
                          style={{
                            color: "var(--color-foreground)",
                            opacity: 0.7,
                          }}
                        >
                          Downloadable resources and exercises
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div>
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Course Content
                </h2>
                <div className="space-y-4">
                  {course.curriculum.map((section) => (
                    <div
                      key={section.id}
                      className="rounded-lg overflow-hidden"
                      style={{ backgroundColor: "var(--color-card)" }}
                    >
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full p-4 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center">
                          <div
                            className="p-2 rounded mr-3"
                            style={{
                              backgroundColor: "var(--color-background)",
                            }}
                          >
                            <BookOpen
                              className="h-5 w-5"
                              style={{ color: "var(--color-primary)" }}
                            />
                          </div>
                          <div>
                            <h3
                              className="font-medium"
                              style={{ color: "var(--color-foreground)" }}
                            >
                              {section.title}
                            </h3>
                            <p
                              className="text-sm"
                              style={{
                                color: "var(--color-foreground)",
                                opacity: 0.7,
                              }}
                            >
                              {section.lessons.length} lessons •{" "}
                              {section.duration}
                            </p>
                          </div>
                        </div>
                        <ChevronRight
                          className={`h-5 w-5 transition-transform ${
                            expandedSections.includes(section.id)
                              ? "transform rotate-90"
                              : ""
                          }`}
                          style={{ color: "var(--color-foreground)" }}
                        />
                      </button>

                      {expandedSections.includes(section.id) && (
                        <div
                          className="border-t"
                          style={{ borderColor: "var(--color-border)" }}
                        >
                          {section.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-4 hover:bg-gray-50"
                              style={{
                                backgroundColor: "var(--color-background)",
                              }}
                            >
                              <div className="flex items-center">
                                {lesson.isPreview ? (
                                  <Play
                                    className="h-4 w-4 mr-3"
                                    style={{ color: "var(--color-primary)" }}
                                  />
                                ) : (
                                  <div
                                    className="h-4 w-4 mr-3 rounded-full border-2"
                                    style={{
                                      borderColor: "var(--color-border)",
                                    }}
                                  ></div>
                                )}
                                <span
                                  style={{ color: "var(--color-foreground)" }}
                                >
                                  {lesson.title}
                                </span>
                                {lesson.isPreview && (
                                  <span
                                    className="ml-2 px-2 py-1 text-xs rounded"
                                    style={{
                                      backgroundColor: "var(--color-accent)",
                                      color: "var(--color-background)",
                                    }}
                                  >
                                    Preview
                                  </span>
                                )}
                              </div>
                              <span
                                className="text-sm"
                                style={{
                                  color: "var(--color-foreground)",
                                  opacity: 0.7,
                                }}
                              >
                                {lesson.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "instructor" && (
              <div>
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Your Instructor
                </h2>
                <div
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: "var(--color-card)" }}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        {course.instructor.name}
                      </h3>
                      <p
                        style={{
                          color: "var(--color-foreground)",
                          opacity: 0.8,
                        }}
                        className="mb-4"
                      >
                        {course.instructor.bio}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center">
                          <div
                            className="p-2 rounded mr-3"
                            style={{
                              backgroundColor: "var(--color-background)",
                            }}
                          >
                            <Star
                              className="h-5 w-5"
                              style={{ color: "#f59e0b" }}
                            />
                          </div>
                          <div>
                            <p
                              className="font-medium"
                              style={{ color: "var(--color-foreground)" }}
                            >
                              {course.instructor.rating} Instructor Rating
                            </p>
                            <p
                              className="text-sm"
                              style={{
                                color: "var(--color-foreground)",
                                opacity: 0.7,
                              }}
                            >
                              {course.reviewsCount} Reviews
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div
                            className="p-2 rounded mr-3"
                            style={{
                              backgroundColor: "var(--color-background)",
                            }}
                          >
                            <Users
                              className="h-5 w-5"
                              style={{ color: "var(--color-primary)" }}
                            />
                          </div>
                          <div>
                            <p
                              className="font-medium"
                              style={{ color: "var(--color-foreground)" }}
                            >
                              {course.instructor.studentsCount.toLocaleString()}{" "}
                              Students
                            </p>
                            <p
                              className="text-sm"
                              style={{
                                color: "var(--color-foreground)",
                                opacity: 0.7,
                              }}
                            >
                              Enrolled
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div
                            className="p-2 rounded mr-3"
                            style={{
                              backgroundColor: "var(--color-background)",
                            }}
                          >
                            <BookOpen
                              className="h-5 w-5"
                              style={{ color: "var(--color-primary)" }}
                            />
                          </div>
                          <div>
                            <p
                              className="font-medium"
                              style={{ color: "var(--color-foreground)" }}
                            >
                              {course.instructor.coursesCount} Courses
                            </p>
                            <p
                              className="text-sm"
                              style={{
                                color: "var(--color-foreground)",
                                opacity: 0.7,
                              }}
                            >
                              Published
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        className="px-4 py-2 rounded-md text-white font-medium"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      >
                        Follow Instructor
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    Student Reviews
                  </h2>
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(course.rating) ? "fill-current" : ""}`}
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
                      className="font-medium"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {course.rating}
                    </span>
                    <span
                      className="ml-1"
                      style={{ color: "var(--color-foreground)", opacity: 0.7 }}
                    >
                      ({course.reviewsCount} reviews)
                    </span>
                  </div>
                </div>

                {/* Review Form */}
                <div
                  className="p-6 rounded-lg mb-8"
                  style={{ backgroundColor: "var(--color-card)" }}
                >
                  <h3
                    className="text-lg font-medium mb-4"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    Write a Review
                  </h3>
                  <form onSubmit={handleCommentSubmit(onCommentSubmit)}>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        Rating
                      </label>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setCommentValue("rating", rating)}
                            className="mr-1"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                rating <= (watchComment("rating") || 0)
                                  ? "fill-current"
                                  : ""
                              }`}
                              style={{
                                color:
                                  rating <= (watchComment("rating") || 0)
                                    ? "#f59e0b"
                                    : "var(--color-border)",
                              }}
                            />
                          </button>
                        ))}
                      </div>
                      {commentErrors.rating && (
                        <p className="mt-1 text-sm text-red-600">
                          {commentErrors.rating.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="comment"
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        Your Review
                      </label>
                      <textarea
                        id="comment"
                        rows={4}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        style={{
                          backgroundColor: "var(--color-background)",
                          borderColor: "var(--color-border)",
                          color: "var(--color-foreground)",
                        }}
                        placeholder="Share your experience with this course..."
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
                      disabled={isSubmittingReview}
                      className="px-4 py-2 rounded-md text-white font-medium disabled:opacity-50"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      {isSubmittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-6 rounded-lg"
                      style={{ backgroundColor: "var(--color-card)" }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                            <img
                              src={review.userAvatar}
                              alt={review.userName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4
                              className="font-medium"
                              style={{ color: "var(--color-foreground)" }}
                            >
                              {review.userName}
                            </h4>
                            <div className="flex items-center">
                              <div className="flex items-center mr-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(review.rating) ? "fill-current" : ""}`}
                                    style={{
                                      color:
                                        i < Math.floor(review.rating)
                                          ? "#f59e0b"
                                          : "var(--color-border)",
                                    }}
                                  />
                                ))}
                              </div>
                              <span
                                className="text-sm"
                                style={{
                                  color: "var(--color-foreground)",
                                  opacity: 0.7,
                                }}
                              >
                                {format(new Date(review.date), "MMM dd, yyyy")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p
                        className="mb-4"
                        style={{
                          color: "var(--color-foreground)",
                          opacity: 0.8,
                        }}
                      >
                        {review.comment}
                      </p>

                      <div className="flex items-center">
                        <button
                          onClick={() => toggleHelpful(review.id)}
                          className={`flex items-center text-sm ${
                            review.isHelpful ? "text-indigo-600" : ""
                          }`}
                          style={{
                            color: review.isHelpful
                              ? "var(--color-primary)"
                              : "var(--color-foreground)",
                            opacity: review.isHelpful ? 1 : 0.7,
                          }}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful ({review.helpfulCount})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <div className="sticky top-6 space-y-6">
              {/* Course Info */}
              <div
                className="p-6 rounded-lg"
                style={{ backgroundColor: "var(--color-card)" }}
              >
                <h3
                  className="text-lg font-medium mb-4"
                  style={{ color: "var(--color-foreground)" }}
                >
                  This course includes:
                </h3>
                <div className="space-y-3">
                  <div
                    className="flex items-center text-sm"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    <Clock
                      className="h-5 w-5 mr-3"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <span>{course.duration} hours of video content</span>
                  </div>
                  <div
                    className="flex items-center text-sm"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    <BookOpen
                      className="h-5 w-5 mr-3"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <span>
                      {course.curriculum.reduce(
                        (acc, section) => acc + section.lessons.length,
                        0,
                      )}{" "}
                      lessons
                    </span>
                  </div>
                  <div
                    className="flex items-center text-sm"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    <Download
                      className="h-5 w-5 mr-3"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <span>Downloadable resources</span>
                  </div>
                  <div
                    className="flex items-center text-sm"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    <Award
                      className="h-5 w-5 mr-3"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <span>Certificate of completion</span>
                  </div>
                  <div
                    className="flex items-center text-sm"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    <Globe
                      className="h-5 w-5 mr-3"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <span>Subtitles: {course.subtitles.join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Related Courses */}
              <div>
                <h3
                  className="text-lg font-medium mb-4"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Related Courses
                </h3>
                <div className="space-y-4">
                  {mockCourses
                    .filter(
                      (c) =>
                        c.id !== course.id && c.category === course.category,
                    )
                    .slice(0, 3)
                    .map((relatedCourse) => (
                      <Link
                        key={relatedCourse.id}
                        href={`/course/${relatedCourse.id}`}
                        className="block p-4 rounded-lg transition-all hover:shadow-md"
                        style={{ backgroundColor: "var(--color-card)" }}
                      >
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={relatedCourse.thumbnail}
                              alt={relatedCourse.title}
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
                              {relatedCourse.title}
                            </h4>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Star
                                  className="h-3 w-3 mr-1"
                                  style={{ color: "#f59e0b" }}
                                />
                                <span
                                  className="text-xs"
                                  style={{
                                    color: "var(--color-foreground)",
                                    opacity: 0.7,
                                  }}
                                >
                                  {relatedCourse.rating}
                                </span>
                              </div>
                              <span
                                className="text-sm font-medium"
                                style={{ color: "var(--color-primary)" }}
                              >
                                ${relatedCourse.price}
                              </span>
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

      {/* Enrollment Modal */}
      {showEnrollmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className="w-full max-w-md rounded-lg overflow-hidden"
            style={{ backgroundColor: "var(--color-card)" }}
          >
            <div
              className="p-6 border-b"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center justify-between">
                <h2
                  className="text-xl font-bold"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Enroll in {course.title}
                </h2>
                <button
                  onClick={() => setShowEnrollmentModal(false)}
                  className="p-1 rounded-full"
                  style={{ backgroundColor: "var(--color-background)" }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: "var(--color-foreground)" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <form
              onSubmit={handleEnrollmentSubmit(onEnrollmentSubmit)}
              className="p-6"
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{
                      backgroundColor: "var(--color-background)",
                      borderColor: enrollmentErrors.firstName
                        ? "#ef4444"
                        : "var(--color-border)",
                      color: "var(--color-foreground)",
                    }}
                    {...registerEnrollment("firstName")}
                  />
                  {enrollmentErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {enrollmentErrors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{
                      backgroundColor: "var(--color-background)",
                      borderColor: enrollmentErrors.lastName
                        ? "#ef4444"
                        : "var(--color-border)",
                      color: "var(--color-foreground)",
                    }}
                    {...registerEnrollment("lastName")}
                  />
                  {enrollmentErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {enrollmentErrors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
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
                    borderColor: enrollmentErrors.email
                      ? "#ef4444"
                      : "var(--color-border)",
                    color: "var(--color-foreground)",
                  }}
                  {...registerEnrollment("email")}
                />
                {enrollmentErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {enrollmentErrors.email.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: enrollmentErrors.phone
                      ? "#ef4444"
                      : "var(--color-border)",
                    color: "var(--color-foreground)",
                  }}
                  {...registerEnrollment("phone")}
                />
                {enrollmentErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {enrollmentErrors.phone.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label
                    className="flex items-center p-3 border rounded-md cursor-pointer"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <input
                      type="radio"
                      value="card"
                      className="mr-3"
                      {...registerEnrollment("paymentMethod")}
                    />
                    <CreditCard
                      className="h-5 w-5 mr-2"
                      style={{ color: "var(--color-foreground)" }}
                    />
                    <span style={{ color: "var(--color-foreground)" }}>
                      Credit/Debit Card
                    </span>
                  </label>

                  <label
                    className="flex items-center p-3 border rounded-md cursor-pointer"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <input
                      type="radio"
                      value="paypal"
                      className="mr-3"
                      {...registerEnrollment("paymentMethod")}
                    />
                    <DollarSign
                      className="h-5 w-5 mr-2"
                      style={{ color: "var(--color-foreground)" }}
                    />
                    <span style={{ color: "var(--color-foreground)" }}>
                      PayPal
                    </span>
                  </label>
                </div>
                {enrollmentErrors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600">
                    {enrollmentErrors.paymentMethod.message}
                  </p>
                )}
              </div>

              {watchEnrollment("paymentMethod") === "card" && (
                <>
                  <div className="mb-4">
                    <label
                      htmlFor="cardNumber"
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      style={{
                        backgroundColor: "var(--color-background)",
                        borderColor: enrollmentErrors.cardNumber
                          ? "#ef4444"
                          : "var(--color-border)",
                        color: "var(--color-foreground)",
                      }}
                      {...registerEnrollment("cardNumber")}
                    />
                    {enrollmentErrors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {enrollmentErrors.cardNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="expiryDate"
                        className="block text-sm font-medium mb-1"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        Expiry Date
                      </label>
                      <input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        style={{
                          backgroundColor: "var(--color-background)",
                          borderColor: enrollmentErrors.expiryDate
                            ? "#ef4444"
                            : "var(--color-border)",
                          color: "var(--color-foreground)",
                        }}
                        {...registerEnrollment("expiryDate")}
                      />
                      {enrollmentErrors.expiryDate && (
                        <p className="mt-1 text-sm text-red-600">
                          {enrollmentErrors.expiryDate.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="cvv"
                        className="block text-sm font-medium mb-1"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        CVV
                      </label>
                      <input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        style={{
                          backgroundColor: "var(--color-background)",
                          borderColor: enrollmentErrors.cvv
                            ? "#ef4444"
                            : "var(--color-border)",
                          color: "var(--color-foreground)",
                        }}
                        {...registerEnrollment("cvv")}
                      />
                      {enrollmentErrors.cvv && (
                        <p className="mt-1 text-sm text-red-600">
                          {enrollmentErrors.cvv.message}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    {...registerEnrollment("agreeToTerms")}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="underline"
                      style={{ color: "var(--color-primary)" }}
                    >
                      Terms and Conditions
                    </a>
                  </span>
                </label>
                {enrollmentErrors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-600">
                    {enrollmentErrors.agreeToTerms.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span
                    className="text-lg font-bold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    ${course.price}
                  </span>
                  {course.originalPrice && (
                    <span
                      className="text-lg ml-2 line-through"
                      style={{ color: "var(--color-foreground)", opacity: 0.5 }}
                    >
                      ${course.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isEnrolling}
                className="w-full py-3 rounded-md text-white font-medium disabled:opacity-50"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {isEnrolling ? "Processing..." : "Complete Enrollment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Add CreditCard icon to lucide-react imports
const CreditCard = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);
