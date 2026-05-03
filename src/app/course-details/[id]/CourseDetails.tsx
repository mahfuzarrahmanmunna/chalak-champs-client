"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format } from "date-fns";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Globe,
  Heart,
  Play,
  Star,
  Target,
  ThumbsUp,
  Users,
  Video,
  Award,
  X,
  Phone,
  CreditCard,
  LayoutGrid,
  ListChecks,
  HelpCircle,
  LayoutList,
  Calendar,
  Plus,
  Minus,
} from "lucide-react";

import NeedCall from "./NeedCall";
import IncludesCard from "./IncludesCard";
import EnrollmentCard from "./EnrollmentCard";
import FAQ from "./FAQ";
import CourseDecorate from "./CourseDecorate";

// --- TYPES & INTERFACES ---

interface CourseData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeColor: string;
  image: string;
  age: string;
  duration: string;
  schedule: string;
  faqs: string;
  mode: string;
  features: string[];
  syllabus?: string[];
  fee: string;
  installment?: string;
  contact: string;
  buttonText: string;
}

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  schedule: string;
  fullDescription: string;
  isBestseller: boolean;
  isNew: boolean;
  syllabus?: string[];
  category: string;
  level: string;
  rating: number;
  mode: string;
  faqs: string;
  reviewsCount: number;
  enrolledCount: number;
  duration: string;
  language: string;
  lastUpdated: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  previewVideo: string;
  whatYouLearn: string[];
  requirements: string[];
  curriculum: Section[];
  instructor: Instructor;
  fee: string;
  installment?: string;
}

interface Section {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  isPreview: boolean;
}

interface Instructor {
  name: string;
  bio: string;
  avatar: string;
  rating: number;
  studentsCount: number;
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
  isHelpful: boolean;
}

// --- THEME & COLORS ---
const colors = {
  primary: "#F3056D",
  secondary: "#214187",
  background: "#ffffff",
  foreground: "#1f2937",
  card: "#f9fafb",
  border: "#e5e7eb",
  accent: "#fbbf24",
};

// --- MAIN COMPONENT ---

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = (params.id as string) || "1";

  // State for FAQ Accordion
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const [course, setCourse] = useState<Course | null>(null);

  // Updated Tabs with Icons
  const [activeTab, setActiveTab] = useState("overview");

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      userId: "u1",
      userName: "Rahim Uddin",
      userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      comment: "My child loves this course! Very interactive and helpful.",
      date: "2023-11-01",
      helpfulCount: 24,
      isHelpful: false,
    },
  ]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["1"]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Sections configuration with Icons
  const sections = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "curriculum", label: "Curriculum", icon: BookOpen },
    { id: "instructor", label: "Instructor", icon: Users },
    { id: "courseDecorator", label: "Course Decorator", icon: Users },
  ];

  // Refs
  const overviewRef = useRef<HTMLDivElement>(null);
  const curriculumRef = useRef<HTMLDivElement>(null);
  const instructorRef = useRef<HTMLDivElement>(null);
  const courseDecoratorRef = useRef<HTMLDivElement>(null);
  // Removed reviewsRef as requested

  // --- Form Hooks ---
  const {
    register: registerComment,
    handleSubmit: handleCommentSubmit,
    formState: { errors: commentErrors },
    reset: resetCommentForm,
    setValue: setCommentValue,
    watch: watchComment,
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        comment: yup
          .string()
          .required("Comment is required")
          .min(10, "Comment must be at least 10 characters"),
        rating: yup.number().required("Rating is required").min(1).max(5),
      }),
    ),
    defaultValues: { comment: "", rating: 5 },
  });

  const {
    register: registerEnrollment,
    handleSubmit: handleEnrollmentSubmit,
    formState: { errors: enrollmentErrors },
    reset: resetEnrollmentForm,
    watch: watchEnrollment,
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        firstName: yup.string().required("First name is required"),
        lastName: yup.string().required("Last name is required"),
        email: yup
          .string()
          .email("Invalid email")
          .required("Email is required"),
        phone: yup.string().required("Phone number is required"),
        agreeToTerms: yup
          .boolean()
          .oneOf([true], "You must agree to terms and conditions"),
      }),
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      agreeToTerms: false,
    },
  });

  // --- Scroll Spy (Active Tab Logic) ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { threshold: 0.5 },
    );

    const refs = [
      { current: overviewRef.current, id: "overview" },
      { current: curriculumRef.current, id: "curriculum" },
      { current: instructorRef.current, id: "instructor" },
    ];

    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch("/courses.json");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: CourseData[] = await res.json();
        const foundRaw = data.find((c) => c.id.toString() === courseId);

        if (foundRaw) {
          // --- DATA TRANSFORMATION ---
          const transformedCourse: Course = {
            id: foundRaw.id.toString(),
            title: foundRaw.title,
            subtitle: foundRaw.subtitle,
            description: foundRaw.description,
            fullDescription: foundRaw.description,
            isBestseller: foundRaw.badge.toLowerCase().includes("best"),
            isNew: foundRaw.badge.toLowerCase().includes("new"),
            category: foundRaw.subtitle || "Kids Education",
            level: foundRaw.age.includes("-") ? "Beginner" : "Intermediate",
            rating: 4.8,
            reviewsCount: 120,
            enrolledCount: 450,
            duration: foundRaw.duration,
            language: "Bengali / English",
            lastUpdated: new Date().toISOString(),
            price: parseInt(foundRaw.fee.replace(/[^0-9]/g, "")),
            faqs: foundRaw.faqs || [],
            originalPrice: foundRaw.fee.includes("(")
              ? parseInt(
                  foundRaw.fee
                    .match(/\(([^)]+)\)/)?.[1]
                    ?.replace(/[^0-9]/g, "") || "",
                )
              : undefined,
            thumbnail: foundRaw.image.startsWith("http")
              ? foundRaw.image
              : `https://placehold.co/600x400/${colors.primary.slice(1)}/FFF?text=${foundRaw.title}`,
            previewVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
            whatYouLearn: foundRaw.features,
            requirements: [
              `Age: ${foundRaw.age}`,
              `Schedule: ${foundRaw.schedule}`,
              "A computer or mobile device with internet connection",
            ],
            curriculum: (foundRaw.syllabus || []).map((item, idx) => ({
              id: `section-${idx}`,
              title: item,
              duration: "2 hrs",
              lessons: [
                {
                  id: `l1-${idx}`,
                  title: "Introduction",
                  duration: "10 min",
                  isPreview: idx === 0,
                },
                {
                  id: `l2-${idx}`,
                  title: "Core Concepts",
                  duration: "30 min",
                  isPreview: false,
                },
                {
                  id: `l3-${idx}`,
                  title: "Practice & Quiz",
                  duration: "20 min",
                  isPreview: false,
                },
              ],
            })),
            instructor: {
              name: "Chalak Champs Team",
              bio: "Expert educators dedicated to developing your child's full potential.",
              avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
              rating: 4.9,
              studentsCount: 5000,
            },
            fee: foundRaw.fee,
            installment: foundRaw.installment,
          };
          setCourse(transformedCourse);
        } else {
          router.push("/courses");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        router.push("/courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, router]);

  // --- Handlers ---
  const scrollToSection = (id: string) => {
    const refs: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      overview: overviewRef,
      curriculum: curriculumRef,
      instructor: instructorRef,
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
        userName: "You",
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
      alert(
        `Enrollment successful for ${course?.title}! We will contact you at ${data.phone}.`,
      );
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Course Not Found
          </h1>
          <Link
            href="/courses"
            className="px-6 py-3 rounded-md text-white font-medium hover:opacity-90 transition"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      {/* --- HERO SECTION --- */}
      <div className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Content */}
            <div className="flex-1">
              <div className="mb-6">
                <Link
                  href="/courses"
                  className="inline-flex items-center text-sm font-medium mb-4 text-gray-500 hover:opacity-70 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
                </Link>

                <div className="flex flex-wrap gap-2 mb-6">
                  {course.isBestseller && (
                    <span className="px-3 py-1 text-xs font-bold tracking-wide uppercase rounded-full bg-[#F3056D]/10 text-[#F3056D] border border-[#F3056D]">
                      Bestseller
                    </span>
                  )}
                  <span className="px-3 py-1 text-xs font-bold tracking-wide uppercase rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                    {course.category}
                  </span>
                  <span className="px-3 py-1 text-xs font-bold tracking-wide uppercase rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {course.level}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 leading-tight">
                  {course.title}
                </h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {course.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-600 mb-6 border-t border-b border-gray-100 py-4">
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-5 w-5 fill-current mr-1.5" />
                    <span className="text-gray-900 font-bold mr-1">
                      {course.rating}
                    </span>
                    <span className="text-gray-500">
                      ({course.reviewsCount} ratings)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-1.5 text-gray-400" />
                    <span>
                      {course.enrolledCount.toLocaleString()} students
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-1.5 text-gray-400" />
                    <span>{course.language}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-1.5 text-gray-400" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Created by{" "}
                  <span className="font-semibold hover:underline cursor-pointer">
                    {course.instructor.name}
                  </span>
                  <span className="mx-2">•</span>
                  Last updated{" "}
                  {format(new Date(course.lastUpdated), "MMM dd, yyyy")}
                </div>
              </div>
            </div>

            {/* Right Enrollment Card */}
            <EnrollmentCard
              course={course}
              setShowEnrollmentModal={setShowEnrollmentModal}
            />
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-8">
            {/* --- NAVIGATION BAR --- */}
            <div className="sticky top-24 rounded-2xl z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex space-x-8 overflow-x-auto no-scrollbar py-4">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`py-2 px-5 rounded-xl border-b-2 font-medium bg-primary text-white text-base whitespace-nowrap transition-colors flex items-center ${
                          activeTab === section.id
                            ? `text-bg-secondary border border-primary text-white`
                            : "text-gray-500 border-transparent "
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {section.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* 1. OVERVIEW (With Bengali Sections) */}
            <div
              ref={overviewRef}
              id="overview"
              className="scroll-mt-24 space-y-6"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 border-l-4 pl-4">
                Overview
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {/* Card 1: কোর্স যেভাবে সাজানো হয়েছে */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <LayoutGrid className="h-5 w-5" />
                    <h3 className="font-bold text-lg text-gray-900">
                      কোর্স যেভাবে সাজানো হয়েছে
                    </h3>
                  </div>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{course.mode}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{console.log(course)}</span>
                    </div>
                  </div>
                </div>

                {/* 2. CURRICULUM (Course Content Section) - Now separate for scroll spy */}
                {course.curriculum && (
                  <div
                    ref={curriculumRef}
                    id="curriculum"
                    className="scroll-mt-24 space-y-6"
                  >
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 border-l-4 pl-4">
                      Course Content
                    </h2>
                    <div className="space-y-3">
                      {course.curriculum.map((section) => (
                        <div
                          key={section.id}
                          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                        >
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center">
                              <div className="p-2 bg-gray-100 rounded-lg mr-4 text-gray-600">
                                <BookOpen className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900">
                                  {section.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {section.lessons.length} lessons •{" "}
                                  {section.duration}
                                </p>
                              </div>
                            </div>
                            <ChevronDown
                              className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedSections.includes(section.id) ? "rotate-180" : ""}`}
                            />
                          </button>

                          {expandedSections.includes(section.id) && (
                            <div className="border-t border-gray-100 bg-gray-50/50">
                              {section.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-white/60 transition-colors"
                                >
                                  <div className="flex items-center">
                                    <div
                                      className={`p-1.5 rounded-full mr-3 ${lesson.isPreview ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"}`}
                                    >
                                      {lesson.isPreview ? (
                                        <Play className="h-3 w-3 fill-current" />
                                      ) : (
                                        <div className="h-3 w-3 rounded-full border-2 border-gray-400" />
                                      )}
                                    </div>
                                    <span className="font-medium text-gray-700">
                                      {lesson.title}
                                    </span>
                                    {lesson.isPreview && (
                                      <span className="ml-3 px-2 py-0.5 text-xs font-bold rounded bg-blue-100 text-blue-700 uppercase tracking-wide">
                                        Preview
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-sm text-gray-400 font-mono">
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

                {/* Card 2: কোর্স সিলেবাস */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5" />
                    <h3 className="font-bold text-lg text-gray-900">
                      কোর্স সিলেবাস
                    </h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {(course.syllabus || []).slice(0, 4).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card 3: */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <ListChecks className="h-5 w-5" />
                    <h3 className="font-bold text-lg text-gray-900">
                      ক্লাস করার জন্য প্রয়োজন হবে
                    </h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {course.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ArrowLeft className="h-4 w-4 mr-2 mt-0.5 text-gray-400 rotate-180" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card 4: যেভাবে পেমেন্ট করবেন */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5" />
                    <h3 className="font-bold text-lg text-gray-900">
                      যেভাবে পেমেন্ট করবেন
                    </h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 rounded border border-gray-100">
                      <span className="text-gray-600">কোর্স ফি:</span>
                      <span className="font-bold text-gray-900">
                        {course.fee}
                      </span>
                    </div>
                    {course.installment && (
                      <div className="flex justify-between p-2 bg-gray-50 rounded border border-gray-100">
                        <span className="text-gray-600">ইনস্টলমেন্ট:</span>
                        <span className="font-bold text-gray-900">
                          {course.installment}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card 5: সাধারণ জিজ্ঞাসা */}
                <FAQ faqs={course.faqs} />

                <CourseDecorate/>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            <div className="border-t border-gray-200"></div>

            {/* 3. INSTRUCTOR */}
            <div ref={instructorRef} id="instructor" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 border-l-4 pl-4">
                Instructor
              </h2>
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.instructor.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{course.instructor.bio}</p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
                    <div className="flex items-center justify-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <div className="text-sm">
                        <span className="font-bold text-gray-900">
                          {course.instructor.rating}
                        </span>
                        <span className="text-gray-500 ml-1">
                          Instructor Rating
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Users className="h-5 w-5 text-[#214187]" />
                      <div className="text-sm">
                        <span className="font-bold text-gray-900">
                          {course.instructor.studentsCount.toLocaleString()}
                        </span>
                        <span className="text-gray-500 ml-1">Students</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 lg:w-[400px]">
            <div className="sticky top-24 space-y-6">
              <IncludesCard />
              <NeedCall />
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEnrollmentModal(false)}
          ></div>
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
              <button
                onClick={() => setShowEnrollmentModal(false)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  width={80}
                  height={60}
                  className="rounded object-cover"
                  unoptimized
                />
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="font-bold">
                    {course.price.toLocaleString()} Tk
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleEnrollmentSubmit(onEnrollmentSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                      First Name
                    </label>
                    <input
                      {...registerEnrollment("firstName")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                      Last Name
                    </label>
                    <input
                      {...registerEnrollment("lastName")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...registerEnrollment("email")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    {...registerEnrollment("phone")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <label className="flex items-start gap-2 text-sm text-gray-600 mt-4">
                  <input
                    type="checkbox"
                    {...registerEnrollment("agreeToTerms")}
                    className="mt-1 focus:ring-primary"
                  />
                  <span>
                    I accept{" "}
                    <span className="font-bold underline cursor-pointer">
                      Terms & Conditions
                    </span>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isEnrolling}
                  className="w-full py-3.5 rounded-lg text-white font-bold text-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEnrolling ? "Processing..." : `Enroll Now`}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
