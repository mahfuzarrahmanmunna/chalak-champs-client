// src/app/[lang]/bookdetails/page.tsx

"use client";

import React, { useState, useEffect, useRef } from "react"; // FIXED: Added useRef import
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  FileText,
  User,
  LayoutGrid,
  ListChecks,
  HelpCircle,
  Star,
  Layers,
  Tag,
  X,
} from "lucide-react";
// Import Language Context (Assuming this path based on your snippet)
import { useLanguage } from "@/app/context/LanguageContext";

// --- INTERFACES ---
interface LibraryItem {
  id: number;
  image: string;
  badge: string;
  badge2?: string;
  title: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  author: {
    name: string;
    bio: string;
    avatar: string;
    rating: number;
    studentsCount: number;
  };
  tableOfContents: string[];
  faqs: Array<{ q: string; a: string }>; // FAQ items with questions and answers
  googleDriveUrl?: string; // Added for Google Drive support
  pdfUrl?: string;
}

interface BookDetailsProps {
  item: LibraryItem;
  onBack?: () => void;
}

// --- SUB-COMPONENT: FAQ ---
const FAQ = ({ faqs }: { faqs: Array<{ q: string; a: string }> }) => {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  // Safe Bilingual Hook
  const langContext = useLanguage();
  const isBangla = langContext?.isBangla ?? false;

  useEffect(() => {
    if (faqs.length > 0 && !activeFaq) {
      setActiveFaq(faqs[0].q);
    }
  }, [faqs]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-pink-50/30 p-6 md:p-10 rounded-[32px] border border-white/60 shadow-lg relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-pink-200/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-blue-200/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 mb-10">
        <div className="bg-white p-3 rounded-2xl shadow-sm text-[#F3056D] border border-pink-100">
          <HelpCircle className="h-6 w-6 fill-pink-50" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            {isBangla
              ? "সাধারণ জিজ্ঞাসা (FAQ)"
              : "Frequently Asked Questions (FAQ)"}
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            {isBangla ? "বিস্তারিত জানতে চান" : "Need Answers?"}
          </p>
        </div>
      </div>

      <div className="relative z-10 space-y-4">
        {faqs.length > 0 ? (
          faqs.map((faq, idx) => {
            const isOpen = activeFaq === faq.q;

            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border-2 transition-all duration-300 group hover:shadow-xl ${
                  isOpen
                    ? "border-[#F3056D] shadow-md ring-4 ring-pink-50/50"
                    : "border-gray-100 hover:border-pink-200"
                }`}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : faq.q)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none group/btn"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Number Badge */}
                    <span
                      className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm transition-all duration-300 transform group-hover/btn:scale-110 ${
                        isOpen
                          ? "bg-[#F3056D] text-white scale-110 rotate-3"
                          : "bg-gray-100 text-gray-400 group-hover/btn:bg-pink-100 group-hover/btn:text-[#F3056D]"
                      }`}
                    >
                      {idx + 1}
                    </span>

                    {/* Question Text */}
                    <span
                      className={`font-semibold text-lg md:text-xl pr-4 leading-tight transition-colors ${
                        isOpen ? "text-[#F3056D]" : "text-gray-700"
                      }`}
                    >
                      {faq.q}
                    </span>
                  </div>

                  {/* Chevron Icon Container */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-[#F3056D] text-white rotate-180"
                        : "bg-gray-50 text-gray-400 group-hover/btn:bg-pink-100 group-hover/btn:text-[#F3056D]"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" strokeWidth={3} />
                  </div>
                </button>

                {/* Answer Content with Animation */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-0 overflow-hidden">
                    <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                      <div className="mt-4 pl-[52px] border-l-4 border-pink-100 text-gray-600 leading-7 text-base">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 bg-white/50 rounded-3xl border border-dashed border-gray-300 flex items-center justify-center">
            <p className="text-gray-500 font-medium text-lg">
              {isBangla
                ? "কোনো প্রশ্ন পাওয়া যায়নি"
                : "No Questions Available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: HIGHLIGHTS (Similar to Course Decorate) ---
const Highlights = ({
  cards,
  title,
}: {
  cards: Array<{ title: string; body: string }>;
  title: string;
}) => {
  // Safe Bilingual Hook
  const langContext = useLanguage();
  const isBangla = langContext?.isBangla ?? false;

  return (
    <section
      id="highlights"
      className="w-full bg-[#214187] border-2 border-[#FF8FCA] rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl"
    >
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="mb-6">
          <h2 className="font-bold text-xl md:text-2xl text-white tracking-wide">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {cards.map((feature, index) => {
            return (
              <div
                key={index}
                className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
              >
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#F3056D] shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-200 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-200 text-sm md:text-base leading-relaxed font-normal">
                      {feature.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function BookDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // --- BILINGUAL SUPPORT ---
  const langContext = useLanguage();
  const isBangla = langContext?.isBangla ?? false;

  // Safe helper for links
  const getLink = (p: string) => {
    const cleanPath = p.startsWith("/") ? p : `/${p}`;
    return `/${isBangla ? "bn" : "en"}${cleanPath}`;
  };

  // Refs for Scroll Spy (Matching Course Page Pattern)
  const highlightsRef = useRef<HTMLDivElement>(null);
  const contentsRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // Mock Data (Replace with fetch logic based on params.id)
  const bookData: LibraryItem = {
    id: 1,
    image: "/kidsbook.png",
    badge: isBangla ? "প্রিন্টেড কলরফুল বুক" : "Printed Colorful Book",
    badge2: isBangla ? "৩৫% ছাড়" : "35% OFF",
    title: "Kids' অনর্গল English বুক",
    subtitle: isBangla
      ? "চালাক Champs Best Seller"
      : "Chalak Champs Best Seller",
    price: 550,
    originalPrice: 850,
    description: isBangla
      ? "এই বই টি শিশিশুদের জন্য সেরা পথেকা অত্যন্ত গুরুত্বপূর্ণ অভিজ্ঞাস এবং উপস্থাপন প্রদান করে। রঙিন সচিত্র এবং আকর্ষণমুখ স্টোরিটেলিং দ্বারা শিশিশুদের মনোযগ আকর্ষণ করতে সাহায্য করে।"
      : "This book is designed to spark imagination and encourage early learning. With colorful illustrations and engaging stories, your child will fall in love with reading.",
    features: [
      isBangla ? "প্রিন্টেড কোয়ালিটি - উচ্চ মানের রঙিন প্রিন্টেড" : "Printed Sheets - High Quality Print",
      isBangla ? "মজবুত বাঁধাই - নিরাপত্ত ও টেকসই উপকরণ" : "Durable Cover - Protective Design",
      isBangla ? "বড়দের জন্য - বাবা-মায়ের সাথে পড়ানো সহজ" : "Vibrant Art - Colorful Illustrations",
      isBangla ? "পেজ কাউন্টিং - ১০০+ পেজ পূর্ণ বই" : "Interactive - 100+ Pages",
    ],
    author: {
      name: isBangla ? "শিক্ষা বিশেষক দল" : "Team Chalak Champs",
      bio: isBangla
        ? "আমরা শিশিশুদের সার্বিক বিকাশাস এবং সৃজনশীলতার জন্য গুণিতমান সামগ্রিক তৈরি তৈরি করি।"
        : "Expert educators dedicated to developing your child's full potential.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.8,
      studentsCount: 1250,
    },
    tableOfContents: [
      isBangla ? "অধ্যায় ১: ইংরেজি শেখার শুরু" : "Chapter 1: Introduction",
      isBangla ? "অধ্যায় ২: কালার ও ফর্ম" : "Chapter 2: Colors & Shapes",
      isBangla ? "অধ্যায় ৩: গল্প ও কাউন্টিং" : "Chapter 3: Counting",
      isBangla ? "অধ্যায় ৪: ফ্ল্যাশ কার্ড" : "Chapter 4: Letters",
      isBangla ? "অধ্যায় ৫: রিভিউ ও কুইজ" : "Chapter 5: Review",
    ],
    // --- GOOGLE DRIVE SUPPORT ---
    // Mock Standard PDF URL
    pdfUrl: isBangla
      ? "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy_bn.pdf"
      : "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy_en.pdf",
    // Mock Google Drive URL (Embed URL format)
    googleDriveUrl: isBangla
      ? "https://drive.google.com/file/d/1oqu8SmpC5WmAOy4kT4ETViYJCq02Oojm/view?usp=sharing"
      : "https://drive.google.com/file/d/1oqu8SmpC5WmAOy4kT4ETViYJCq02Oojm/view?usp=sharing",
    faqs: [
      {
        q: isBangla ? "এই বইটির বয়স কত?" : "Is this a physical book?",
        a: isBangla
          ? "এই বইটি ৪-৮ পেজ পূর্ণ বই।"
          : "This book consists of 48 pages.",
      },
      {
        q: isBangla ? "ডেলিভারি খরচ করা যাবে?" : "Is delivery available?",
        a: isBangla
          ? "সাধারণ ৭-১ দিনের মধ্যে ডেলিভারি খরচ করা যাবে।"
          : "We offer digital download only.",
      },
      {
        q: isBangla ? "কিভাবে পেমেন্ট করতে পারবেন?" : "Can I print it?",
        a: isBangla
          ? "হ্যাঁ, এই প্রিন্ট বইটি আপনি নিচের পেমেন্ট করতে পারবেন।"
          : "Yes, you can print it at home.",
      },
    ],
  };

  // --- NAVIGATION SECTIONS (Mirroring Course Page Pattern) ---
  const sections = [
    {
      id: "highlights",
      label: isBangla ? "বিশেষণত্ব বৈশিষ্ট্য" : "Highlights",
      icon: LayoutGrid,
    },
    {
      id: "contents",
      label: isBangla ? "সূচিপত্র" : "Contents",
      icon: BookOpen,
    },
    {
      id: "author",
      label: isBangla ? "লেখক" : "Author",
      icon: User,
    },
    {
      id: "overview",
      label: isBangla ? "বিবরণ" : "Description",
      icon: FileText,
    },
    {
      id: "faq",
      label: "FAQ",
      icon: HelpCircle,
    },
  ];

  // --- SCROLL SPY LOGIC ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { threshold: 0.3 },
    );

    const refs = [
      { current: highlightsRef.current, id: "highlights" },
      { current: contentsRef.current, id: "contents" },
      { current: authorRef.current, id: "author" },
      { current: overviewRef.current, id: "overview" },
      { current: faqRef.current, id: "faq" },
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

  const scrollToSection = (id: string) => {
    const refs: {
      [key: string]: React.RefObject<HTMLDivElement | null>;
    } = {
      highlights: highlightsRef,
      contents: contentsRef,
      author: authorRef,
      overview: overviewRef,
      faq: faqRef,
    };
    const ref = refs[id];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBuy = () => {
    setShowPurchaseModal(true);
  };

  const handlePurchaseSubmit = (data: any) => {
    setIsBuying(true);
    setTimeout(() => {
      setIsBuying(false);
      setShowPurchaseModal(false);
      alert(
        isBangla
          ? "ধন্যবাছাছি! শীঘ্রইযোগাযোগ করা হবে।"
          : "Order Successful! We will contact you.",
      );
    }, 2000);
  };

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      // Determine which link to use based on availability
      const linkToOpen = bookData.googleDriveUrl || bookData.pdfUrl;
      window.open(linkToOpen, "_blank");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative selection:bg-pink-100 selection:text-pink-900">
      {/* --- BREADCRUMB (Sticky Professional) --- */}
      <div className="bg-white/90 backdrop-blur-md py-3 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm md:text-base">
          <div className="flex items-center flex-wrap">
            {[
              isBangla ? "Home" : "Home",
              isBangla ? "Books" : "Books",
              isBangla ? "Book Details" : "Details",
            ].map((part, index) => {
              const isLast = index === 2;
              let href = "#";
              if (part.toLowerCase().includes("home")) href = "/";
              if (part.toLowerCase().includes("books"))
                href = getLink("/books");

              return (
                <React.Fragment key={index}>
                  {isLast ? (
                    <span className="text-gray-900 font-semibold">{part}</span>
                  ) : (
                    <Link
                      href={href}
                      className="text-gray-500 hover:text-[#F3056D] font-medium transition-colors"
                    >
                      {part}
                    </Link>
                  )}
                  {!isLast && (
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-300" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- MAIN CONTAINER --- */}
      <div className="relative bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* --- LEFT COLUMN (Content: Title, Tabs, Sections) --- */}
            <div className="w-full lg:w-[65%] order-2 lg:order-1">
              <div className="mb-10">
                <Link
                  href={getLink("/books")}
                  className="inline-flex items-center text-sm md:text-base font-medium mb-4 text-gray-500 hover:text-[#214187] transition-colors group"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />{" "}
                  {isBangla ? "বইটের তালিকায় ফিরুন" : "Back to Shop"}
                </Link>

                <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight tracking-tight">
                  {bookData.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  {bookData.subtitle}
                </p>
              </div>

              {/* --- NAVIGATION BAR (Sticky below breadcrumb) --- */}
              <div className="sticky top-[60px] md:top-[72px] lg:top-[88px] rounded-2xl z-30 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm mb-12 overflow-hidden">
                <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0">
                  <nav className="flex space-x-1 md:space-x-2 overflow-x-auto no-scrollbar py-2 px-2">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`py-2.5 px-4 md:px-5 rounded-xl font-medium text-sm md:text-base whitespace-nowrap transition-all duration-200 flex items-center ${
                            activeTab === section.id
                              ? `bg-[#214187] border-2 border-primary text-white shadow-md scale-[1.02]`
                              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
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

              {/* --- SECTIONS REORDERED --- */}

              {/* 1. HIGHLIGHTS */}
              <div
                ref={highlightsRef}
                id="highlights"
                className="scroll-mt-36 md:scroll-mt-40 mb-12"
              >
                <Highlights
                  cards={bookData.features}
                  title={isBangla ? "এই বইটিতে মোট" : "Why Choose This Book?"}
                />
              </div>

              {/* 2. TABLE OF CONTENTS */}
              <div
                ref={contentsRef}
                id="contents"
                className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">
                  {sections[1].label}
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-3xl">
                  {isBangla
                    ? "এই বইটির ভেতর পেজ ও কালার সুন্দর ও কালি শিশিশুদের ইংরেজি শেখার যাত্রায় গুরুত্বপূর্ণ।"
                    : "Explore the contents of this comprehensive learning book."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {bookData.tableOfContents.map((item, i) => (
                    <div
                      key={i}
                      className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7EAFF] rounded-bl-full -mr-8 -mt-8 opacity-30 group-hover:opacity-50 transition-opacity"></div>
                      <div className="flex items-center gap-2 mb-3 relative z-10">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#214187] text-white font-bold">
                          {i + 1}
                        </div>
                        <h3 className="font-bold text-lg md:text-xl text-gray-900">
                          {item}
                        </h3>
                      </div>
                      <div className="flex gap-2 relative z-10">
                        <div className="flex items-start gap-2 text-base text-gray-700">
                          <ChevronRight className="h-5 w-5 text-[#F3056D] mt-0.5 flex-shrink-0" />
                          <span>
                            {isBangla ? "বিস্তারিত শুরু পড়ুন" : "Read Chapter"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. AUTHOR */}
              <div
                ref={authorRef}
                id="author"
                className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">
                  {sections[2].label}
                </h2>
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-6">
                    <Image
                      src={bookData.author.avatar}
                      alt={bookData.author.name}
                      width={100}
                      height={100}
                      className="rounded-full border-4 border-white shadow-lg"
                    />
                    <div>
                      <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-2">
                        {bookData.author.name}
                      </h3>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-5 w-5 fill-current mr-1.5" />
                          <span className="text-gray-900 font-bold mr-1">
                            {bookData.author.rating}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <User className="h-5 w-5 mr-2" />
                            <span>
                              {bookData.author.studentsCount.toLocaleString()}{" "}
                              {isBangla ? "শিক্ষার্থী" : "Students"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {bookData.author.bio}
                  </p>
                </div>
              </div>

              {/* 4. OVERVIEW (Description) */}
              <div
                ref={overviewRef}
                id="overview"
                className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">
                  {sections[3].label}
                </h2>
                <div className="bg-gray-50/50 p-6 md:p-8 rounded-2xl border border-gray-100">
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
                    {bookData.description}
                  </p>
                </div>
              </div>

              {/* 5. FAQ */}
              <div
                ref={faqRef}
                id="faq"
                className="scroll-mt-36 md:scroll-mt-40 mb-12"
              >
                <FAQ faqs={bookData.faqs} />
              </div>
            </div>

            {/* --- RIGHT COLUMN (Sidebar) --- */}
            <div className="w-full lg:w-[35%] order-1 lg:order-2 space-y-6">
              {/* --- BOOK PURCHASE CARD --- */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-26">
                <div className="relative h-[250px] bg-gray-100 group">
                  <Image
                    src={bookData.image}
                    alt={bookData.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 flex gap-2">
                    <span className="bg-[#214187] text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                      NEW
                    </span>
                    <span className="bg-[#F3056D] text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                      BEST
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  {/* Badges */}
                  <div className="flex gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase text-gray-500">
                      {isBangla ? "স্ট্যাটাস:" : "Status:"}
                    </span>
                    <div className="flex items-center gap-1.5 text-[#214187] text-xs bg-[#1B386B26] rounded-full px-2.5 py-1.5 shadow-sm border border-white/50">
                      <Layers size={12} className="text-[#1B386B]" />
                      {bookData.badge}
                    </div>
                    <div className="flex items-center gap-1.5 text-[#F3056D] text-xs bg-[#FCE7F3] rounded-full px-2.5 py-1.5 shadow-sm border border-white/50">
                      <Tag size={12} />
                      {bookData.badge2}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-end gap-3 mb-6">
                    <span className="text-4xl font-extrabold text-gray-900">
                      ৳{bookData.price}
                    </span>
                    {bookData.originalPrice && (
                      <span className="text-xl text-gray-400 line-through mb-1.5 decoration-pink-500">
                        ৳{bookData.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 text-base text-gray-700">
                      <Clock className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>
                        {isBangla ? "ডেলিভারি: ১৪ দিন" : "Delivery: Instant"}
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-base text-gray-700">
                      <Download className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>
                        {isBangla ? "ফরম্যাট: পিডিএফ" : "Format: PDF"}
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-base text-gray-700">
                      <BookOpen className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>{isBangla ? "পেজ: ১০+" : "Pages: 100+"}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleBuy}
                      className="w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-95 bg-[#F3056D] hover:bg-[#d9045f] border border-[#F3056D]"
                    >
                      {isBangla ? "কিনতে নিন" : "Buy Now"}
                    </button>
                    <button
                      onClick={() => setShowPdfModal(true)}
                      className="w-full py-3.5 rounded-xl text-[#F3056D] font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-95 bg-white border border-[#F3056D] hover:bg-pink-50 flex items-center justify-center gap-2"
                    >
                      <FileText size={18} />
                      {isBangla ? "পড়ানো দেখুন" : "Read Sample"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PURCHASE MODAL (Same Design Pattern) --- */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setShowPurchaseModal(false)}
          ></div>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                {isBangla ? "চেকাউট" : "Checkout"}
              </h2>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <Image
                  src={bookData.image}
                  alt={bookData.title}
                  width={80}
                  height={80}
                  className="rounded-lg object-contain bg-white"
                />
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1 text-sm md:text-base">
                    {bookData.title}
                  </h3>
                  <p className="font-bold text-[#F3056D] mt-1">
                    ৳{bookData.price}
                  </p>
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePurchaseSubmit({ name: "dummy" });
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wider">
                      {isBangla ? "নাম" : "Name"}
                    </label>
                    <input
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F3056D] focus:border-transparent outline-none transition-shadow"
                      placeholder="Your NameDoe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wider">
                      {isBangla ? "ফোন" : "Phone"}
                    </label>
                    <input
                      required
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F3056D] focus:border-transparent outline-none transition-shadow"
                      placeholder="017..."
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isBuying}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[#F3056D] hover:bg-[#d9045f]"
                >
                  {isBuying
                    ? isBangla
                      ? "প্রসেসিং হচ্ছে..."
                      : "Processing..."
                    : isBangla
                      ? "নিশ্চিশাল করুন"
                      : "Confirm Purchase"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- PRO PDF MODAL (New Professional Design) --- */}
      {showPdfModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity"
            onClick={() => setShowPdfModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="bg-white w-full max-w-6xl h-[85vh] rounded-[30px] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header (Dark Blue Theme) */}
            <div className="bg-[#214187] px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3 text-white">
                <FileText className="w-6 h-6 text-pink-300" />
                <h3 className="font-bold text-lg tracking-wide">
                  {isBangla ? "বই প্রিভিউ করছেন" : "Viewing Book Preview"}
                </h3>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20"
              >
                <X size={24} />
              </button>
            </div>

            {/* Toolbar / Actions */}
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">
                  {isBangla ? "উৎস:" : "Source:"}
                </span>
                {/* Source Toggle */}
                <button
                  onClick={() => window.open(bookData.pdfUrl, "_blank")}
                  className="px-3 py-1.5 rounded text-xs font-bold bg-[#214187] text-white hover:bg-[#1a2e5a] transition-colors"
                >
                  {isBangla ? "পিডিএফ" : "PDF"}
                </button>
                {bookData.googleDriveUrl && (
                  <button
                    onClick={() =>
                      window.open(bookData.googleDriveUrl, "_blank")
                    }
                    className="px-3 py-1.5 rounded text-xs font-bold bg-white text-[#214187] border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    {isBangla ? "গুগল ড্রাইভ" : "Drive"}
                  </button>
                )}
              </div>
              <span className="text-xs text-gray-400">
                ({isBangla ? "নিরাপত্ত ও টেকস্টচার" : "Standard View"})
              </span>
            </div>
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-[#214187] hover:bg-[#1a2e5a] text-white text-sm font-bold px-4 py-2 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>{isBangla ? "ডাউনলোড হচ্ছে..." : "Downloading..."}</>
              ) : (
                <>
                  <Download size={16} />
                  {isBangla ? "ফুল পিডিএফ ডাউনলোড" : "Download Full PDF"}
                </>
              )}
            </button>

            {/* PDF Iframe Container */}
            <div className="flex-1 w-full bg-gray-200 relative p-4">
              {/* Use Google Drive Embed link if available, else fallback to standard PDF */}
              <iframe
                src={bookData.googleDriveUrl || bookData.pdfUrl}
                className="w-full h-full rounded-lg shadow-inner border-0"
                title="PDF Viewer"
              />
            </div>

            {/* Modal Footer */}
            <div className="bg-white px-6 py-4 border-t border-gray-100 flex justify-between items-center shrink-0">
              <p className="text-sm text-gray-400">
                {isBangla
                  ? "উচ্চ গুণিতমান সামগ্রিক তৈরি তৈরি করি"
                  : "High quality preview"}
              </p>
              <button
                onClick={() => setShowPdfModal(false)}
                className="font-semibold text-gray-500 hover:text-[#F3056D] transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                {isBangla ? "প্রিভিউ বন্ধ করুন" : "Close Preview"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
