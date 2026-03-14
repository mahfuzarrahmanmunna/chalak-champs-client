// src/app/course-details/[id]/CourseDetails.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ChevronRight,
  ArrowLeft,
  Heart,
  Share2,
  Download,
  Target,
  Zap,
  Globe,
  CreditCard,
} from "lucide-react";
import {
  coursesData,
  Course,
  Review,
  mockReviews,
} from "../../../../data/coursesData";
// import { coursesData, Course, Review, mockReviews } from "@/data/coursesData";

// Validation schemas
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

const enrollmentSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  paymentMethod: yup.string().required("Payment method is required"),
  cardNumber: yup.string().when("paymentMethod", {
    is: "card",
    then: (schema) =>
      schema
        .required("Card number is required")
        .matches(/^[0-9]{16}$/, "Card number must be 16 digits"),
  }),
  expiryDate: yup.string().when("paymentMethod", {
    is: "card",
    then: (schema) =>
      schema
        .required("Expiry date is required")
        .matches(
          /^(0[1-9]|1[0-2])\/\d{2}$/,
          "Expiry date must be in MM/YY format",
        ),
  }),
  cvv: yup.string().when("paymentMethod", {
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
  const [expandedSections, setExpandedSections] = useState<string[]>(["1"]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "curriculum", label: "Curriculum" },
    { id: "instructor", label: "Instructor" },
    { id: "reviews", label: "Reviews" },
  ];

  const overviewRef = useRef<HTMLDivElement>(null);
  const curriculumRef = useRef<HTMLDivElement>(null);
  const instructorRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const {
    register: registerComment,
    handleSubmit: handleCommentSubmit,
    formState: { errors: commentErrors },
    reset: resetCommentForm,
    setValue: setCommentValue,
    watch: watchComment,
  } = useForm({
    resolver: yupResolver(commentSchema),
    defaultValues: { comment: "", rating: 5 },
  });

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

  useEffect(() => {
    setTimeout(() => {
      const foundCourse = coursesData.find((c) => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        router.push("/courses");
      }
      setIsLoading(false);
    }, 500);
  }, [courseId, router]);

  const scrollToSection = (id: string) => {
    const refs: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      overview: overviewRef,
      curriculum: curriculumRef,
      instructor: instructorRef,
      reviews: reviewsRef,
    };
    const ref = refs[id];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const onCommentSubmit: SubmitHandler<any> = (data) => {
    setIsSubmittingReview(true);
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

  const onEnrollmentSubmit: SubmitHandler<any> = (data) => {
    setIsEnrolling(true);
    setTimeout(() => {
      setIsEnrolled(true);
      setShowEnrollmentModal(false);
      resetEnrollmentForm();
      setIsEnrolling(false);
      alert("Enrollment successful! You can now access the course.");
    }, 2000);
  };

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
          <Link
            href="/courses"
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
                  href="/courses"
                  className="inline-flex items-center text-sm font-medium mb-4 text-white hover:underline"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back to Courses
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
                  {course.language && (
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 mr-1" />
                      <span>{course.language}</span>
                    </div>
                  )}
                  {course.lastUpdated && (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-1" />
                      <span>
                        Updated{" "}
                        {format(new Date(course.lastUpdated), "MMM dd, yyyy")}
                      </span>
                    </div>
                  )}
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
            <div
              className="sticky top-16 z-30 border-b mb-8"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-background)",
              }}
            >
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="py-4 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap transition-colors"
                    style={{
                      borderColor: "transparent",
                      color: "var(--color-foreground)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--color-primary)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-foreground)")
                    }
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Overview */}
            <div ref={overviewRef} id="overview" className="space-y-8 mb-16">
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
              {course.whatYouLearn && (
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
              )}
              {course.requirements && (
                <div>
                  <h2
                    className="text-2xl font-bold mb-4"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    Requirements
                  </h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, i) => (
                      <li
                        key={i}
                        className="flex items-start"
                        style={{
                          color: "var(--color-foreground)",
                          opacity: 0.8,
                        }}
                      >
                        <span className="mr-2">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
                        Hands-on exercises
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
                        Learn at your own pace
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum */}
            {course.curriculum && (
              <div
                ref={curriculumRef}
                id="curriculum"
                className="mb-16 scroll-mt-32"
              >
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
                          className={`h-5 w-5 transition-transform ${expandedSections.includes(section.id) ? "transform rotate-90" : ""}`}
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
                              className="flex items-center justify-between p-4"
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

            {/* Instructor */}
            <div
              ref={instructorRef}
              id="instructor"
              className="mb-16 scroll-mt-32"
            >
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
                      style={{ color: "var(--color-foreground)", opacity: 0.8 }}
                      className="mb-4"
                    >
                      {course.instructor.bio}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center">
                        <div
                          className="p-2 rounded mr-3"
                          style={{ backgroundColor: "var(--color-background)" }}
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
                            {course.instructor.rating} Rating
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
                          style={{ backgroundColor: "var(--color-background)" }}
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div ref={reviewsRef} id="reviews" className="scroll-mt-32">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--color-foreground)" }}
              >
                Student Reviews
              </h2>
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
                            className={`h-6 w-6 ${rating <= (watchComment("rating") || 0) ? "fill-current" : ""}`}
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
                  </div>
                  <div className="mb-4">
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md"
                      style={{
                        backgroundColor: "var(--color-background)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-foreground)",
                      }}
                      placeholder="Share your experience..."
                      {...registerComment("comment")}
                    ></textarea>
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
                      style={{ color: "var(--color-foreground)", opacity: 0.8 }}
                    >
                      {review.comment}
                    </p>
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleHelpful(review.id)}
                        className="flex items-center text-sm"
                        style={{
                          color: review.isHelpful
                            ? "var(--color-primary)"
                            : "var(--color-foreground)",
                          opacity: review.isHelpful ? 1 : 0.7,
                        }}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" /> Helpful (
                        {review.helpfulCount})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className="w-full max-w-md rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: "var(--color-card)" }}
          >
            <div
              className="p-6 border-b sticky top-0 z-10"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-card)",
              }}
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
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    style={{
                      backgroundColor: "var(--color-background)",
                      borderColor: enrollmentErrors.firstName
                        ? "#ef4444"
                        : "var(--color-border)",
                      color: "var(--color-foreground)",
                    }}
                    {...registerEnrollment("firstName")}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    style={{
                      backgroundColor: "var(--color-background)",
                      borderColor: enrollmentErrors.lastName
                        ? "#ef4444"
                        : "var(--color-border)",
                      color: "var(--color-foreground)",
                    }}
                    {...registerEnrollment("lastName")}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-md"
                  style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: enrollmentErrors.email
                      ? "#ef4444"
                      : "var(--color-border)",
                    color: "var(--color-foreground)",
                  }}
                  {...registerEnrollment("email")}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border rounded-md"
                  style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: enrollmentErrors.phone
                      ? "#ef4444"
                      : "var(--color-border)",
                    color: "var(--color-foreground)",
                  }}
                  {...registerEnrollment("phone")}
                />
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
                </div>
              </div>
              {watchEnrollment("paymentMethod") === "card" && (
                <>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border rounded-md"
                      style={{
                        backgroundColor: "var(--color-background)",
                        borderColor: enrollmentErrors.cardNumber
                          ? "#ef4444"
                          : "var(--color-border)",
                        color: "var(--color-foreground)",
                      }}
                      {...registerEnrollment("cardNumber")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border rounded-md"
                        style={{
                          backgroundColor: "var(--color-background)",
                          borderColor: enrollmentErrors.expiryDate
                            ? "#ef4444"
                            : "var(--color-border)",
                          color: "var(--color-foreground)",
                        }}
                        {...registerEnrollment("expiryDate")}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border rounded-md"
                        style={{
                          backgroundColor: "var(--color-background)",
                          borderColor: enrollmentErrors.cvv
                            ? "#ef4444"
                            : "var(--color-border)",
                          color: "var(--color-foreground)",
                        }}
                        {...registerEnrollment("cvv")}
                      />
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
                    I agree to the Terms and Conditions
                  </span>
                </label>
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
