// src/app/[lang]/products/[id]/ProductDetailsContent.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Star,
  Users,
  X,
  LayoutGrid,
  ListChecks,
  HelpCircle,
  UserCheck,
  ChevronDown,
  MessageCircle,
  Home,
  CreditCard,
  AlertCircle,
  Check,
  Clock,
  Tag,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { FaSadCry } from "react-icons/fa";
import { useLanguage } from "@/app/context/LanguageContext";
import ProductOrderCard from "./ProductOrderCard";
import Button from "@/app/ui/button/Button";
import { getProducts } from "../productData";
import { Product } from "../types";

// --- SUB-COMPONENT: FAQ (Same as CourseDetails) ---
const FAQ = ({ faqs }: { faqs: Array<{ q: string; a: string }> }) => {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const { isBangla } = useLanguage();

  useEffect(() => {
    if (faqs.length > 0 && !activeFaq) {
      setActiveFaq(faqs[0].q);
    }
  }, [faqs]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-pink-50/30 p-6 md:p-10 rounded-[32px] border border-white/60 shadow-lg relative overflow-hidden">
      <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-pink-200/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-blue-200/20 rounded-full blur-2xl pointer-events-none" />
      <div className="relative z-10 flex items-center gap-3 mb-10">
        <div className="bg-white p-3 rounded-2xl shadow-sm text-[#F3056D] border border-pink-100">
          <MessageCircle className="h-6 w-6 fill-pink-50" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            {isBangla ? "সাধারণ জিজ্ঞাসা" : "Frequently Asked Questions"}
          </h2>
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
                    <span
                      className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm transition-all duration-300 transform group-hover/btn:scale-110 ${
                        isOpen
                          ? "bg-[#F3056D] text-white scale-110 rotate-3"
                          : "bg-gray-100 text-gray-400 group-hover/btn:bg-pink-100 group-hover/btn:text-[#F3056D]"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span
                      className={`font-semibold text-base md:text-lg pr-4 leading-tight transition-colors ${
                        isOpen ? "text-[#F3056D]" : "text-gray-700"
                      }`}
                    >
                      {faq.q}
                    </span>
                  </div>
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-[#F3056D] text-white rotate-180"
                        : "bg-gray-50 text-gray-400 group-hover/btn:bg-pink-100 group-hover/btn:text-[#F3056D]"
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" strokeWidth={3} />
                  </div>
                </button>
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
          <div className="text-center py-10 bg-white/50 rounded-3xl border border-dashed border-gray-300 flex items-center justify-center gap-2">
            <p className="text-gray-500 font-medium text-lg">
              {isBangla ? "কোনো প্রশ্ন পাওয়া যায়নি" : "No Questions Found"}
            </p>
            <FaSadCry className="text-xl text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: FEATURES DECORATE (Same as CourseDetails) ---
const ProductDecorate = ({
  cards,
  title,
}: {
  cards: Array<{ title: string; desc: string; icon?: string }>;
  title: string;
}) => {
  return (
    <section className="w-full bg-[#214187] border-2 border-[#FF8FCA] rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="mb-6">
          <h2 className="font-bold text-xl md:text-2xl text-white tracking-wide">
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {cards.map((feature, index) => (
            <div
              key={index}
              className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
            >
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#F3056D] shadow-lg group-hover:scale-110 transition-transform duration-300 text-2xl">
                  {feature.icon || "✓"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200 text-sm md:text-base leading-relaxed font-normal">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function ProductDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const { isBangla, getLink } = useLanguage();

  const productId = Number(params?.id) || 1;
  const allProducts = getProducts(isBangla);
  const product: Product =
    allProducts.find((p) => p.id === productId) || allProducts[0];

  const isComingSoon =
    product.badge?.toLowerCase().includes("coming") ||
    product.badge?.includes("শীঘ্রই") ||
    product.badge?.includes("আসছে");

  const isBook = product.id === 1;

  const [activeTab, setActiveTab] = useState("overview");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderStep, setOrderStep] = useState<1 | 2 | 3>(1);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [showSideCard, setShowSideCard] = useState(false);

  const overviewRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // Build sections dynamically
  const sections = [
    {
      id: "overview",
      label: isBangla ? "বিবরণ" : "Description",
      icon: LayoutGrid,
    },
  ];
  if (product.features && product.features.length > 0) {
    sections.push({
      id: "features",
      label: isBangla ? "ফিচার" : "Features",
      icon: ListChecks,
    });
  }
  if (product.whyPoints && product.whyPoints.length > 0) {
    sections.push({
      id: "why",
      label: isBangla ? "কেন স্পেশাল?" : "Why Special?",
      icon: UserCheck,
    });
  }
  if (product.specs && product.specs.length > 0) {
    sections.push({
      id: "specs",
      label: isBangla ? "স্পেসিফিকেশন" : "Specifications",
      icon: Tag,
    });
  }
  sections.push({ id: "faq", label: "FAQ", icon: HelpCircle });

  // IntersectionObserver
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

    const refMap: {
      id: string;
      ref: React.RefObject<HTMLDivElement | null>;
    }[] = [
      { id: "overview", ref: overviewRef },
      { id: "features", ref: featuresRef },
      { id: "why", ref: whyRef },
      { id: "specs", ref: specsRef },
      { id: "faq", ref: faqRef },
    ];

    refMap.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    const handleScroll = () => {
      setShowStickyCta(window.scrollY > 300);
      setShowSideCard(window.scrollY > 1500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      refMap.forEach(({ ref }) => {
        if (ref.current) observer.unobserve(ref.current);
      });
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const refMap: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      overview: overviewRef,
      features: featuresRef,
      why: whyRef,
      specs: specsRef,
      faq: faqRef,
    };
    const ref = refMap[id];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleOrder = () => {
    setOrderStep(1);
    setFormData({ name: "", phone: "", address: "" });
    setOrderError(null);
    setShowOrderModal(true);
  };

  const handleOrderSubmit = () => {
    if (orderStep === 1) {
      setOrderStep(2);
      setOrderError(null);
      return;
    }
    if (orderStep === 2) {
      if (!formData.name || !formData.phone || !formData.address) {
        setOrderError(
          isBangla ? "সব ফিল্ড পূরণ করুন" : "Please fill in all fields",
        );
        return;
      }
      setOrderStep(3);
      setOrderError(null);
      return;
    }
  };

  // --- Breadcrumb ---
  const breadcrumbItems = [
    {
      label: isBangla ? "হোম" : "Home",
      href: isBangla ? "/bn" : "/en",
      icon: Home,
    },
    {
      label: isBangla ? "প্রোডাক্টস" : "Products",
      href: isBangla ? "/bn/products" : "/en/products",
      icon: null,
    },
    { label: product.title, href: null, icon: null },
  ];

  // --- FAQ Data ---
  const faqData = isBook
    ? isBangla
      ? [
          {
            q: "বইটি কোন বয়সের শিশুদের জন্য?",
            a: "বইটি মূলত ক্লাস ১ থেকে ক্লাস ৮ পর্যন্ত শিশুদের জন্য তৈরি করা হয়েছে।",
          },
          {
            q: "ই-বুক ভার্সন কিভাবে পাবো?",
            a: "বইটি কেনার পর আপনার ইমেইলে বা ফোন নম্বরে ই-বুক ভার্সনের লিংক পাঠানো হবে।",
          },
          {
            q: "বইটি কি কুরিয়ারে পাওয়া যাবে?",
            a: "হ্যাঁ, সারা বাংলাদেশে কুরিয়ার সার্ভিসের মাধ্যমে বইটি পৌঁছে দেওয়া হয়।",
          },
        ]
      : [
          {
            q: "What age group is this book for?",
            a: "This book is primarily designed for children from Class 1 to Class 8.",
          },
          {
            q: "How will I receive the eBook version?",
            a: "After purchasing, the eBook link will be sent to your email or phone.",
          },
          {
            q: "Can I get the book via courier?",
            a: "Yes, delivered nationwide through courier service across Bangladesh.",
          },
        ]
    : isBangla
      ? [
          {
            q: "কিভাবে অর্ডার করবো?",
            a: "আমাদের কল করুন 01740176774 নম্বরে অথবা ওয়েবসাইট থেকে অর্ডার করুন।",
          },
          {
            q: "ডেলিভারি কতদিনে পাবো?",
            a: "সাধারণত ৩-৫ কার্যদিবসের মধ্যে ডেলিভারি পাবেন।",
          },
        ]
      : [
          {
            q: "How to order?",
            a: "Call us at 01740176774 or order through the website.",
          },
          {
            q: "How long does delivery take?",
            a: "Usually delivered within 3-5 business days.",
          },
        ];

  // ====== COMING SOON PAGE ======
  if (isComingSoon) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans pb-20">
        <div className="py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center flex-wrap gap-y-1">
                {breadcrumbItems.map((item, index) => {
                  const isLast = index === breadcrumbItems.length - 1;
                  return (
                    <li key={index} className="flex items-center">
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="group flex items-center gap-1.5 text-sm md:text-[15px] font-medium text-gray-400 hover:text-[#F3056D] transition-all duration-200 px-2 py-1 rounded-lg hover:bg-pink-50/60"
                        >
                          {item.icon && (
                            <item.icon className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#F3056D] transition-colors duration-200" />
                          )}
                          <span>{item.label}</span>
                        </Link>
                      ) : (
                        <span className="text-sm md:text-[15px] font-semibold text-gray-800 px-2 py-1 bg-gradient-to-r from-pink-50/80 to-blue-50/60 rounded-lg">
                          {item.label}
                        </span>
                      )}
                      {!isLast && (
                        <ChevronRight
                          className="h-3.5 w-3.5 mx-0.5 text-gray-300/80 flex-shrink-0"
                          strokeWidth={2.5}
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="bg-white rounded-[30px] border-2 border-[#FF8FCA] p-10 md:p-16 shadow-xl flex flex-col items-center justify-center w-full max-w-2xl text-center mx-4">
            <div className="bg-pink-50 rounded-full p-8 mb-8 border-2 border-dashed border-pink-300">
              <Clock size={80} className="text-[#D81B60]" />
            </div>
            <h1 className="text-[#D81B60] font-bold text-3xl md:text-5xl mb-4">
              {isBangla ? "শীঘ্রই আসছে" : "Coming Soon"}
            </h1>
            <p className="text-gray-600 text-lg mb-2 font-semibold">
              {product.title}
            </p>
            <p className="text-gray-500 mt-4 max-w-md mx-auto">
              {isBangla
                ? `আমরা "${product.title}" শীঘ্রই নিয়ে আসছি। আপডেট পেতে আমাদের সাথে থাকুন!`
                : `We are bringing "${product.title}" very soon. Stay tuned for updates!`}
            </p>
            <Link
              href={getLink("/products")}
              className="mt-8 inline-flex items-center gap-2 bg-[#F3056D] hover:bg-[#D6005C] text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg"
            >
              {isBangla ? "অন্য প্রোডাক্ট দেখুন" : "View Other Products"}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ====== MAIN DETAILS PAGE ======
  return (
    <div className="min-h-screen mt-12 text-gray-900 font-sans relative selection:bg-pink-100 selection:text-pink-900">
      {/* ===== BREADCRUMB ===== */}
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap gap-y-1">
              {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;
                return (
                  <li key={index} className="flex items-center">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="group flex items-center gap-1.5 text-sm md:text-[15px] font-medium text-gray-400 hover:text-[#F3056D] transition-all duration-200 px-2 py-1 rounded-lg hover:bg-pink-50/60"
                      >
                        {item.icon && (
                          <item.icon className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#F3056D] transition-colors duration-200" />
                        )}
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <span className="text-sm md:text-[15px] font-semibold text-gray-800 px-2 py-1 bg-gradient-to-r from-pink-50/80 to-blue-50/60 rounded-lg">
                        {item.label}
                      </span>
                    )}
                    {!isLast && (
                      <ChevronRight
                        className="h-3.5 w-3.5 mx-0.5 text-gray-300/80 flex-shrink-0"
                        strokeWidth={2.5}
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero + Main Content */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* ===== LEFT COLUMN (65%) ===== */}
            <div className="w-full lg:w-[65%] order-2 lg:order-1">
              {/* Hero */}
              <div className="mb-10">
                <Link
                  href={getLink("/products")}
                  className="inline-flex items-center text-sm md:text-base font-medium mb-4 text-gray-500 hover:text-[#F3056D] transition-colors group"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  {isBangla ? "প্রোডাক্টসে ফিরে যান" : "Back to Products"}
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight tracking-tight">
                  {product.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-2 leading-relaxed">
                  {product.subtitle}
                </p>
                <p className="text-base text-gray-500 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Mobile Order Card */}
              <div className="md:hidden mb-6">
                <ProductOrderCard product={product} onOrder={handleOrder} />
              </div>

              {/* ===== STICKY TAB NAVIGATION ===== */}
              <div className="sticky top-28 md:top-18 lg:top-22 rounded-2xl z-30 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm mb-12 overflow-hidden">
                <nav className="flex space-x-1 md:space-x-2 overflow-x-auto no-scrollbar py-2 px-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`py-2.5 px-4 md:px-5 rounded-xl font-medium text-sm md:text-base whitespace-nowrap transition-all duration-200 flex items-center ${
                          activeTab === section.id
                            ? "bg-[#214187] border-2 border-primary text-white shadow-md scale-[1.02]"
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

              {/* ============ 1. OVERVIEW ============ */}
              <div
                ref={overviewRef}
                id="overview"
                className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">
                  {isBangla ? "বিস্তারিত বিবরণ" : "Product Details"}
                </h2>
                <div className="bg-gray-50/50 p-6 md:p-8 rounded-2xl border border-gray-100 space-y-4">
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
                    {product.fullDescription || product.description}
                  </p>
                  {product.fullDescriptionSecond && (
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
                      {product.fullDescriptionSecond}
                    </p>
                  )}
                </div>
              </div>

              {/* ============ 2. FEATURES ============ */}
              {product.features && product.features.length > 0 && (
                <div
                  ref={featuresRef}
                  id="features"
                  className="scroll-mt-36 md:scroll-mt-40 mb-12"
                >
                  <ProductDecorate
                    cards={product.features.map((f) => ({
                      title: f.title,
                      desc: f.desc,
                      icon: f.icon,
                    }))}
                    title={isBangla ? "বইয়ের বিশেষত্ব" : "Book Features"}
                  />
                </div>
              )}

              {/* ============ 3. WHY THIS IS SPECIAL ============ */}
              {product.whyPoints && product.whyPoints.length > 0 && (
                <div
                  ref={whyRef}
                  id="why"
                  className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12"
                >
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-6">
                      {isBangla
                        ? "কেন এই বইটি স্পেশাল?"
                        : "Why Is This Book Special?"}
                    </h3>
                    <ul className="space-y-4 mb-8">
                      {product.whyPoints.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-base text-gray-700 group"
                        >
                          <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="bg-[#214187]/5 p-4 rounded-xl border-l-4 border-[#F3056D]">
                      <p className="font-bold text-lg text-[#214187]">
                        {isBangla
                          ? "আমাদের লক্ষ্য ইংরেজি শেখাকে সহজ, মজাদার ও কার্যকর করা।"
                          : "Our goal is to make learning English easy, fun, and effective."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ============ 4. SPECS ============ */}
              {product.specs && product.specs.length > 0 && (
                <div
                  ref={specsRef}
                  id="specs"
                  className="scroll-mt-36 md:scroll-mt-40 space-y-6 mb-12"
                >
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 border-l-4 pl-4 border-[#F3056D]">
                    {isBangla ? "স্পেসিফিকেশন" : "Specifications"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.specs.map((spec, index) => (
                      <div
                        key={index}
                        className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow group"
                      >
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">
                          {spec.label}
                        </p>
                        <p className="text-lg font-bold text-gray-900 group-hover:text-[#F3056D] transition-colors">
                          {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============ 5. BOOK INFO (for book only) ============ */}
              {isBook && (
                <div className="scroll-mt-36 md:scroll-mt-40 mb-12">
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-pink-100/40 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-blue-100/40 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative z-10">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[14px] font-semibold bg-[#F3056D]/10 text-[#F3056D] border border-[#F3056D]/20 mb-6">
                        <Star className="h-3.5 w-3.5 fill-[#F3056D] text-[#F3056D]" />
                        {isBangla ? "বই সম্পর্কিত তথ্য" : "Book Information"}
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          {
                            label: isBangla ? "লেখক" : "Author",
                            value: product.author,
                          },
                          {
                            label: isBangla ? "প্রকাশক" : "Publisher",
                            value: product.publisher,
                          },
                          {
                            label: isBangla ? "সংস্করণ" : "Edition",
                            value: product.edition,
                          },
                          {
                            label: isBangla ? "পৃষ্ঠা" : "Pages",
                            value: product.pages,
                          },
                          {
                            label: isBangla ? "দেশ" : "Country",
                            value: product.country,
                          },
                          {
                            label: isBangla ? "ভাষা" : "Language",
                            value: product.language,
                          },
                        ].map((info, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                          >
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-medium">
                              {info.label}
                            </p>
                            <p className="text-sm font-bold text-[#111827]">
                              {info.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============ 6. FAQ ============ */}
              <div
                ref={faqRef}
                id="faq"
                className="scroll-mt-36 md:scroll-mt-40 mb-12"
              >
                <FAQ faqs={faqData} />
              </div>
            </div>

            {/* ===== RIGHT COLUMN (35%) ===== */}
            <div className="w-full lg:w-[35%] order-1 mt-0 lg:order-2 space-y-6">
              <div className="hidden md:block">
                <ProductOrderCard product={product} onOrder={handleOrder} />
              </div>

              {/* Sticky Side Card (appears on scroll) */}
              <div className="sticky hidden md:block top-28">
                <div
                  className={`transition-all duration-500 ${
                    showSideCard
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 pointer-events-none"
                  }`}
                >
                  <div className="bg-[#214187] border-2 border-[#FF8FCA] rounded-2xl p-5 text-white text-center shadow-xl">
                    <p className="text-sm text-blue-200 mb-1">
                      {isBangla ? "মূল্য" : "Price"}
                    </p>
                    <p className="text-3xl font-extrabold mb-4">
                      {product.fee}
                    </p>
                    <Button
                      onClick={handleOrder}
                      bgColor="#F3056D"
                      highlightColor="#FF8FCA"
                      darkShadowColor="#C6005F"
                      className="w-full text-lg py-4"
                      px="px-6"
                    >
                      {isBangla ? "এখনই অর্ডার করুন" : "Order Now"}
                    </Button>
                    <a
                      href="tel:01740176774"
                      className="mt-3 w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl text-sm transition-all border border-white/20"
                    >
                      <Phone className="w-4 h-4" />
                      01740176774
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FINAL CTA SECTION ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-[#214187] to-[#1e3a8a] p-8 md:p-12 rounded-3xl shadow-2xl border border-white/10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              {isBangla ? "আরও কোন জিজ্ঞাসা আছে?" : "Any More Questions?"}
            </h2>
            <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              {isBangla
                ? "আজই অর্ডার করুন এবং আপনার সন্তানের ইংরেজি শেখার যাত্রা শুরু করুন।"
                : "Order today and start your child's English learning journey."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleOrder}
                bgColor="#F3056D"
                highlightColor="#FF8FCA"
                darkShadowColor="#C6005F"
                className="w-full sm:w-auto text-lg py-4"
                px="px-10"
              >
                {isBangla ? "এখনই অর্ডার করুন →" : "Order Now →"}
              </Button>
              <div className="text-gray-300 font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>01740176774</span>
              </div>
            </div>
            <p className="mt-6 text-base text-gray-300 font-medium bg-white/10 inline-block px-4 py-1.5 rounded-full">
              {isBangla
                ? "সারা বাংলাদেশে কুরিয়ার ডেলিভারি"
                : "Nationwide Courier Delivery"}
            </p>
          </div>
        </div>
      </div>

      {/* ===== STICKY MOBILE CTA ===== */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-[60] lg:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                {isBangla ? "মূল্য" : "Price"}
              </span>
              <span className="text-2xl font-bold text-gray-900 leading-none mt-1">
                {product.fee}
              </span>
            </div>
            <Button
              onClick={handleOrder}
              className="flex-1 py-3.5 text-lg"
              px="px-6"
            >
              {isBangla ? "এখনই অর্ডার করুন" : "Order Now"}
            </Button>
          </div>
        </div>
      )}

      {/* ===== ORDER MODAL (3-STEP, same pattern as CourseDetails) ===== */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 md:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => setShowOrderModal(false)}
          />

          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden relative z-10 flex flex-col animate-in zoom-in-95 duration-300">
            {/* --- HEADER --- */}
            {orderStep === 1 ? (
              <div className="relative bg-white p-6 border-b border-gray-100">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#F3056D] text-white flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <span className="text-sm font-bold text-[#F3056D]">
                      Step 1
                    </span>
                  </div>
                  <div className="h-1 w-12 bg-gray-200 rounded" />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <span className="text-sm font-bold text-gray-400">
                      Step 2
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {isBangla ? "আপনার বিলের সারাংশ" : "Order Summary"}
                  </h2>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative bg-gradient-to-br from-[#214187] to-[#1e3a8a] p-6 pt-8 text-white">
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold mb-1">
                      {isBangla ? "তথ্য প্রদান করুন" : "Your Information"}
                    </h2>
                    <p className="text-blue-100 text-sm font-medium">
                      {product.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* --- BODY --- */}
            <div className="p-6 md:p-8 flex-1 overflow-y-auto">
              {/* STEP 1: BILL SUMMARY */}
              {orderStep === 1 && (
                <div className="animate-in fade-in duration-300 space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {product.subtitle}
                      </p>
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">
                          {product.title}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {product.fee}
                        </span>
                      </div>
                    </div>
                    <div className="bg-blue-50/50 rounded-lg p-3 flex justify-between items-center border border-blue-100">
                      <span className="font-bold text-gray-700">
                        {isBangla ? "মোট" : "Total"}
                      </span>
                      <span className="text-xl font-bold text-[#F3056D]">
                        {product.fee}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="py-3.5 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      {isBangla ? "ফেরত যাও" : "Cancel"}
                    </button>
                    <button
                      onClick={handleOrderSubmit}
                      className="py-3.5 bg-[#F3056D] hover:bg-[#d9045f] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      {isBangla ? "উপলব্ধি কর" : "Proceed"}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: USER FORM */}
              {orderStep === 2 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isBangla ? "আপনার নাম" : "Full Name"}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F3056D] focus:border-transparent outline-none transition-all font-medium text-gray-800"
                        placeholder={isBangla ? "নাম লিখুন" : "Enter name"}
                      />
                      <Users className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isBangla ? "মোবাইল নাম্বার" : "Phone Number"}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F3056D] focus:border-transparent outline-none transition-all font-medium text-gray-800"
                        placeholder="017..."
                      />
                      <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isBangla ? "ডেলিভারি ঠিকানা" : "Delivery Address"}
                    </label>
                    <div className="relative">
                      <textarea
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        rows={3}
                        className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F3056D] focus:border-transparent outline-none transition-all font-medium text-gray-800 resize-none"
                        placeholder={
                          isBangla
                            ? "সম্পূর্ণ ঠিকানা লিখুন"
                            : "Enter full address"
                        }
                      />
                    </div>
                  </div>

                  {orderError && (
                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                      <AlertCircle className="h-4 w-4" />
                      {orderError}
                    </div>
                  )}

                  <button
                    onClick={handleOrderSubmit}
                    className="w-full py-3.5 bg-[#214187] hover:bg-[#1a2f6e] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {isBangla ? "অর্ডার কনফার্ম করুন" : "Confirm Order"}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setOrderStep(1)}
                    className="w-full text-sm text-gray-500 hover:text-gray-800 mt-2"
                  >
                    {isBangla ? "ফিরে যান" : "Back"}
                  </button>
                </div>
              )}

              {/* STEP 3: SUCCESS */}
              {orderStep === 3 && (
                <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in-95 duration-300 text-center h-full">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-md">
                    <Check className="h-10 w-10 text-green-600 stroke-[3]" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isBangla
                      ? "সফলভাবে অর্ডার হয়েছে!"
                      : "Order Placed Successfully!"}
                  </h2>
                  <p className="text-gray-500 text-sm max-w-[250px] mb-8">
                    {isBangla
                      ? "আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।"
                      : "We will contact you soon."}
                  </p>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="w-full max-w-xs py-3 bg-[#214187] text-white font-bold rounded-xl hover:bg-[#1a2f6e] transition-colors"
                  >
                    {isBangla ? "বন্ধ করুন" : "Close"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
