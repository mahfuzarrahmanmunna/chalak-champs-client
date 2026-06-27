"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  CreditCard,
  User,
  Lock,
  ArrowLeft,
  CheckCircle,
  Calendar,
  Tag,
  ChevronRight,
  LogOut,
  Clock,
  Loader2,
  Shield,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  X,
  Gift,
  Zap,
  BookOpen,
  FileText,
  Video,
  BadgeCheck,
  Sparkles,
  Truck,
  Headphones,
  CircleCheck,
  CircleX,
  Receipt,
  Copy,
  RefreshCw,
} from "lucide-react";

// --- TYPES ---
interface Course {
  id: string;
  title: string;
  image: string;
  dates: string;
  originalPrice: number;
  offerPrice: number;
  description?: string;
  instructor?: string;
  duration?: string;
  totalLectures?: number;
}

interface Addon {
  id: number;
  name: string;
  price: number;
  icon: React.ReactNode;
  description: string;
}

interface PricingResponse {
  course: Course;
  addons: Addon[];
}

type PaymentStatus = "idle" | "processing" | "success" | "failed" | "verifying";

// --- FALLBACK MOCK DATA ---
const FALLBACK_COURSE: Course = {
  id: "course_123",
  title: "টিসিএফ A Unit + অন্যান্য সুবিধা (মাস - 2024)",
  image: "/signup.webp",
  dates: "03 Mar, 2024 - 31 Dec, 2024",
  originalPrice: 5000,
  offerPrice: 4000,
  description:
    "সম্পূর্ণ কোর্স প্রস্তুতি সহ লাইভ ক্লাস, পিডিএফ ম্যাটেরিয়াল এবং মডেল টেস্ট।",
  instructor: "ড. কামরুল হাসান",
  duration: "৬ মাস",
  totalLectures: 120,
};

const FALLBACK_ADDONS: Addon[] = [
  {
    id: 1,
    name: "Question Bank (PDF)",
    price: 500,
    icon: <FileText className="h-5 w-5" />,
    description: "৫০০+ গুরুত্বপূর্ণ প্রশ্ন সহ পিডিএফ কালেকশন",
  },
  {
    id: 2,
    name: "Live Class Access",
    price: 1000,
    icon: <Video className="h-5 w-5" />,
    description: "সরাসরি ইন্টারেক্টিভ লাইভ ক্লাসে অংশগ্রহণ",
  },
  {
    id: 3,
    name: "Model Test Pack",
    price: 300,
    icon: <BookOpen className="h-5 w-5" />,
    description: "১০টি ফুল লেংথ মডেল টেস্ট",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    user,
    signInWithEmail,
    signInWithPhone,
    signOut,
    sendOtpEmail,
    checkOtpEmail,
    sendOtpPhone,
    checkOtpPhone,
    completeRegistration,
  } = useAuth();

  // ================= TAB STATE =================
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // ================= DATA STATE =================
  const [course, setCourse] = useState<Course>(FALLBACK_COURSE);
  const [addons, setAddons] = useState<Addon[]>(FALLBACK_ADDONS);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // ================= AUTH STATE =================
  const [authView, setAuthView] = useState<
    "input" | "password" | "otp" | "details"
  >("input");
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  const {
    register: registerAuth,
    handleSubmit: handleSubmitAuth,
    formState: { errors: authErrors },
    watch: watchAuth,
    setValue: setAuthValue,
  } = useForm({ mode: "onTouched" });

  // ================= PAYMENT STATE =================
  const [paymentPlan, setPaymentPlan] = useState<"full" | "monthly">("full");
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("bkash");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);

  // ================= PAYMENT FLOW STATE =================
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // ================= CONFIGURATION =================
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // --- FETCH REAL DATA ---
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const pathname = window.location.pathname;
        const slugMatch = pathname.match(/checkout\/(.+)/);
        const slug = slugMatch ? slugMatch[1] : null;

        if (slug) {
          const response = await fetch(
            `${BACKEND_URL}/api/courses/${slug}/pricing`,
          );
          if (response.ok) {
            const data: PricingResponse = await response.json();
            setCourse(data.course);
            if (data.addons && data.addons.length > 0) setAddons(data.addons);
          }
        }
      } catch (error) {
        console.error("Failed to fetch course data, using fallback:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchCourseData();
  }, [BACKEND_URL]);

  // --- HANDLE RETURN FROM PAYMENT GATEWAY ---
  useEffect(() => {
    const tranId = searchParams.get("tran_id");
    const status = searchParams.get("status");

    if (tranId && status) {
      setTransactionId(tranId);
      verifyPayment(tranId, status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Auto-advance to step 3 if already logged in (stay on page, no redirect)
  useEffect(() => {
    if (user && activeStep === 2 && paymentStatus === "idle") {
      setActiveStep(3);
      setCompletedSteps((prev) => new Set(prev).add(2));
    }
  }, [user, activeStep, paymentStatus]);

  // --- VERIFY PAYMENT AFTER GATEWAY REDIRECT ---
  const verifyPayment = async (tranId: string, gatewayStatus: string) => {
    setPaymentStatus("verifying");
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tran_id: tranId, status: gatewayStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrderId(data.orderId || tranId);
        setPaymentStatus("success");
        setCompletedSteps((prev) => new Set(prev).add(3));
      } else {
        setPaymentStatus("failed");
        setPaymentError("পেমেন্ট ভেরিফিকেশন ব্যর্থ হয়েছে।");
      }
    } catch {
      // Fallback: trust gateway status
      if (gatewayStatus === "success" || gatewayStatus === "VALID") {
        setOrderId(tranId);
        setPaymentStatus("success");
        setCompletedSteps((prev) => new Set(prev).add(3));
      } else {
        setPaymentStatus("failed");
        setPaymentError("পেমেন্ট সম্পন্ন হয়নি।");
      }
    }
  };

  // --- HELPERS ---
  const calculateTotal = () => {
    let basePrice = course.offerPrice;
    let addonTotal = selectedAddons.reduce((acc, id) => {
      const addon = addons.find((a) => a.id === id);
      return acc + (addon ? addon.price : 0);
    }, 0);

    const subtotal = basePrice + addonTotal;
    const discount = promoApplied ? promoDiscount : 0;
    const total = Math.max(0, subtotal - discount);

    if (paymentPlan === "monthly") {
      const perMonth = Math.ceil(total / 2);
      return { subtotal, discount, total, plan: perMonth, installments: 2 };
    }
    return { subtotal, discount, total, plan: total, installments: 1 };
  };

  const totals = calculateTotal();
  const savings = course.originalPrice - course.offerPrice + totals.discount;

  // --- TAB HANDLING ---
  const handleStepChange = (step: 1 | 2 | 3) => {
    if (paymentStatus !== "idle") return; // Lock steps after payment
    if (step > activeStep) {
      if (activeStep === 1 && step === 2) {
        setActiveStep(step);
        setCompletedSteps((prev) => new Set(prev).add(activeStep));
      } else if (activeStep === 2 && step === 3) {
        if (user) {
          setActiveStep(step);
          setCompletedSteps((prev) => new Set(prev).add(activeStep));
        }
      }
    } else {
      setActiveStep(step);
    }
  };

  // --- AUTH FUNCTIONS ---
  const checkUserStatus = async (input: string): Promise<boolean> => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/check-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: input }),
      });
      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      return data.exists === true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (authView === "otp" && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (authView === "input") {
      setTimeLeft(90);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authView, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const resendOtp = async () => {
    const input = watchAuth("emailOrPhone");
    if (!input) return;
    const isEmail = /\S+@\S+\.\S+/.test(input);
    setIsLoadingAuth(true);
    try {
      if (isEmail) await sendOtpEmail(input);
      else await sendOtpPhone(input, "recaptcha-container");
      setTimeLeft(90);
      setOtpError(null);
    } catch {
      setOtpError("OTP পুনরায় পাঠাতে সমস্যা হয়েছে।");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const onAuthSubmit = async (data: any) => {
    setAuthError(null);
    setOtpError(null);
    if (authView === "input") await handleInputSubmit(data);
    else if (authView === "password") await handlePasswordSubmit(data);
    else if (authView === "otp") await handleOtpSubmit(data);
    else if (authView === "details") await handleDetailsSubmit(data);
  };

  const handleInputSubmit = async (data: any) => {
    const input = data.emailOrPhone?.trim();
    const isEmail = /\S+@\S+\.\S+/.test(input);
    const isPhone = /^01[3-9]\d{8}$/.test(input);
    if (!isEmail && !isPhone) {
      setAuthError("সঠিক মোবাইল নাম্বার (01XXXXXXXXX) অথবা ইমেইল লিখুন");
      return;
    }
    setIsLoadingAuth(true);
    try {
      const isExistingUser = await checkUserStatus(input);
      if (isExistingUser) {
        setAuthView("password");
      } else {
        if (isEmail) await sendOtpEmail(input);
        else await sendOtpPhone(input, "recaptcha-container");
        setTimeLeft(90);
        setAuthView("otp");
      }
    } catch (error: any) {
      setAuthError(error.message || "একটু পরে আবার চেষ্টা করুন।");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handlePasswordSubmit = async (data: any) => {
    setIsLoadingAuth(true);
    const input = watchAuth("emailOrPhone");
    const password = data.password;
    const isEmail = /\S+@\S+\.\S+/.test(input);
    try {
      if (isEmail) await signInWithEmail(input, password);
      else await signInWithPhone(input, password);
      setActiveStep(3);
      setCompletedSteps((prev) => new Set(prev).add(2));
    } catch (error: any) {
      setAuthError(
        error.response?.data?.message ||
          error.message ||
          "ইমেইল/পাসওয়ার্ড সঠিক নয়।",
      );
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleOtpSubmit = async (data: any) => {
    setIsLoadingAuth(true);
    const otpValues = data.otp;
    const code = Object.values(otpValues).join("");
    const input = watchAuth("emailOrPhone");
    const isEmail = /\S+@\S+\.\S+/.test(input);
    try {
      if (isEmail) await checkOtpEmail(input, code);
      else await checkOtpPhone(input, code);
      setAuthView("details");
    } catch (error: any) {
      setOtpError(error.response?.data?.message || "ভেরিফিকেশন কোড সঠিক নয়।");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleDetailsSubmit = async (data: any) => {
    setIsLoadingAuth(true);
    const input = watchAuth("emailOrPhone");
    const isEmail = /\S+@\S+\.\S+/.test(input);
    const nameParts = data.name?.trim().split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    try {
      await completeRegistration({
        firstName,
        lastName,
        password: data.password,
        emailOrPhone: input,
        method: isEmail ? "email" : "phone",
      });
      setActiveStep(3);
      setCompletedSteps((prev) => new Set(prev).add(2));
    } catch (error: any) {
      setAuthError(error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    setOtpError(null);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent, startIndex: number) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    pasted.split("").forEach((char, i) => {
      const idx = startIndex + i;
      if (idx <= 5) setAuthValue(`otp.${idx}`, char);
    });
    if (pasted.length > 0) {
      const focusIdx = Math.min(startIndex + pasted.length, 5);
      const el = document.getElementById(`otp-${focusIdx}`);
      if (el) (el as HTMLInputElement).focus();
    }
  };

  // Promo code
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsCheckingPromo(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/promo/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, courseId: course.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setPromoDiscount(data.discount);
        setPromoApplied(true);
      } else {
        alert("ভুল প্রোমো কোড।");
      }
    } catch {
      if (promoCode.toUpperCase() === "DEMO200") {
        setPromoDiscount(200);
        setPromoApplied(true);
      } else {
        alert("ভুল প্রোমো কোড।");
      }
    } finally {
      setIsCheckingPromo(false);
    }
  };

  // ================= REAL PAYMENT IMPLEMENTATION =================
  const handlePayment = async () => {
    if (!user) return;

    setPaymentError(null);
    setPaymentStatus("processing");

    try {
      // 1. Build order payload
      const orderPayload = {
        courseId: course.id,
        userId: user.uid || user.id,
        userName: user.displayName || "",
        userEmail: user.email || "",
        userPhone: user.phone || "",
        addons: selectedAddons,
        paymentMethod: selectedPaymentMethod,
        paymentPlan,
        promoCode: promoApplied ? promoCode : null,
        subtotal: totals.subtotal,
        discount: totals.discount,
        totalAmount: totals.total,
        currency: "BDT",
        successUrl: `${window.location.origin}${window.location.pathname}`,
        failUrl: `${window.location.origin}${window.location.pathname}`,
        cancelUrl: `${window.location.origin}${window.location.pathname}`,
      };

      // 2. Create order on backend → get SSLCommerz session
      const res = await fetch(`${BACKEND_URL}/api/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If using Firebase Auth token:
          // Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "অর্ডার তৈরি করতে সমস্যা হয়েছে।");
      }

      const data = await res.json();

      // 3. If backend returns a payment gateway URL, redirect to it
      if (data.paymentUrl) {
        // SSLCommerz / Aamarpay / any gateway redirect
        setOrderId(data.orderId || data.tran_id);
        window.location.href = data.paymentUrl;
        return; // Page will unload, gateway handles the rest
      }

      // 4. If backend returns bKash/Nagad specific redirect URL
      if (data.gatewayRedirectUrl) {
        setOrderId(data.orderId);
        window.location.href = data.gatewayRedirectUrl;
        return;
      }

      // 5. If no redirect URL (e.g., demo/mock mode), simulate success
      setOrderId(data.orderId || `ORD-${Date.now()}`);
      setTransactionId(data.tran_id || `TXN-${Date.now()}`);

      // Simulate a short processing delay then mark success
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPaymentStatus("success");
      setCompletedSteps((prev) => new Set(prev).add(3));
    } catch (error: any) {
      setPaymentStatus("failed");
      setPaymentError(
        error.message || "পেমেন্ট শুরু করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      );
    }
  };

  const handleRetryPayment = () => {
    setPaymentStatus("idle");
    setPaymentError(null);
    setOrderId(null);
    setTransactionId(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // --- LOADING STATE ---
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-[#F3056D] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">কোর্সের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const stepLabels = ["কোর্স তথ্য", "লগইন / রেজিস্টার", "পেমেন্ট"];

  // ================= PAYMENT PROCESSING OVERLAY =================
  if (paymentStatus === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 p-10 max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-10 w-10 text-[#00477C] animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            পেমেন্ট প্রক্রিয়াধীন
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            আপনাকে পেমেন্ট গেটওয়েতে রিডাইরেক্ট করা হচ্ছে। অনুগ্রহ করে ব্রাউজার
            বন্ধ করবেন না।
          </p>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">পরিমাণ</span>
              <span className="font-bold text-gray-900">
                ৳{totals.total.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">মাধ্যম</span>
              <span className="font-semibold text-gray-700 capitalize">
                {selectedPaymentMethod}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= PAYMENT VERifying OVERLAY =================
  if (paymentStatus === "verifying") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 p-10 max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-amber-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            পেমেন্ট যাচাই হচ্ছে
          </h2>
          <p className="text-gray-500 text-sm">
            আপনার পেমেন্টের স্ট্যাটাস যাচাই করা হচ্ছে। এটি কয়েক সেকেন্ড সময়
            নিতে পারে...
          </p>
        </div>
      </div>
    );
  }

  // ================= PAYMENT SUCCESS VIEW =================
  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 max-w-lg w-full border border-gray-100 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                <CircleCheck className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                পেমেন্ট সফল হয়েছে!
              </h2>
              <p className="text-green-100 text-sm">
                আপনার কোর্স এক্টিভেট করা হয়েছে
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-6 sm:p-8">
            {/* Course Info */}
            <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-xl relative overflow-hidden flex-shrink-0">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                  {course.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  তারিখ: {course.dates}
                </p>
              </div>
            </div>

            {/* Transaction Info */}
            <div className="space-y-3 mb-6">
              {orderId && (
                <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-500">অর্ডার আইডি</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-semibold text-gray-900">
                      {orderId}
                    </span>
                    <button
                      onClick={() => copyToClipboard(orderId)}
                      className="text-gray-400 hover:text-[#00477C]"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
              {transactionId && (
                <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-500">ট্রানজাকশন আইডি</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-semibold text-gray-900">
                      {transactionId}
                    </span>
                    <button
                      onClick={() => copyToClipboard(transactionId)}
                      className="text-gray-400 hover:text-[#00477C]"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <span className="text-sm text-gray-500">পরিশোধিত পরিমাণ</span>
                <span className="text-lg font-extrabold text-[#F3056D]">
                  ৳{totals.total.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-sm text-gray-500">পেমেন্ট মাধ্যম</span>
                <span className="text-sm font-semibold text-gray-900 capitalize">
                  {selectedPaymentMethod}
                </span>
              </div>
            </div>

            {/* Addons purchased */}
            {selectedAddons.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">
                  সাথে কেনা হয়েছে
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedAddons.map((id) => {
                    const addon = addons.find((a) => a.id === id);
                    return addon ? (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium"
                      >
                        {addon.icon} {addon.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push("/dashboard/courses")}
                className="w-full py-3.5 bg-[#00477C] text-white font-bold rounded-xl hover:bg-[#003a66] transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 text-sm"
              >
                <BookOpen className="h-4 w-4" />
                কোর্সে যান
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm"
              >
                ড্যাশবোর্ডে যান
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= PAYMENT FAILED VIEW =================
  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 max-w-md w-full border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-red-500 to-rose-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white blur-2xl" />
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                <CircleX className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                পেমেন্ট ব্যর্থ হয়েছে
              </h2>
              <p className="text-red-100 text-sm">দয়া করে আবার চেষ্টা করুন</p>
            </div>
          </div>

          <div className="p-8">
            {paymentError && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl mb-6">
                {paymentError}
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">কোর্স</span>
                <span className="font-semibold text-gray-700 text-right max-w-[200px] truncate">
                  {course.title}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">পরিমাণ</span>
                <span className="font-bold text-gray-900">
                  ৳{totals.total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRetryPayment}
                className="w-full py-3.5 bg-[#F3056D] text-white font-bold rounded-xl hover:bg-[#d9045f] transition-all shadow-lg shadow-pink-200/40 flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw className="h-4 w-4" />
                আবার পেমেন্ট করুন
              </button>
              <button
                onClick={() => {
                  setPaymentStatus("idle");
                  setPaymentError(null);
                  router.push("/");
                }}
                className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm"
              >
                হোমপেজে যান
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                সমস্যা থাকলে যোগাযোগ করুন:{" "}
                <span className="font-semibold text-[#00477C]">
                  ০১XXXXXXXXX
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN CHECKOUT (Steps 1-3) =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans">

      <div className="container mx-auto px-4 max-w-5xl py-8">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative max-w-xl mx-auto">
            <div className="absolute top-5 left-[calc(12.5%+10px)] right-[calc(12.5%+10px)] h-[2px] bg-gray-200 rounded-full" />
            <div
              className="absolute top-5 left-[calc(12.5%+10px)] h-[2px] bg-gradient-to-r from-[#F3056D] to-[#00477C] rounded-full transition-all duration-700 ease-out"
              style={{
                width:
                  activeStep === 1
                    ? "0%"
                    : activeStep === 2
                      ? "calc(50% - 20px)"
                      : "calc(100% - 40px)",
              }}
            />
            {[1, 2, 3].map((step) => {
              const isActive = activeStep === step;
              const isDone = completedSteps.has(step);
              return (
                <div
                  key={step}
                  className="flex flex-col items-center gap-3 relative z-10 w-1/3"
                >
                  <button
                    onClick={() => handleStepChange(step as 1 | 2 | 3)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 ${
                      isActive
                        ? "bg-[#F3056D] border-[#F3056D] text-white shadow-lg shadow-pink-200 scale-110"
                        : isDone
                          ? "bg-[#00477C] border-[#00477C] text-white shadow-md shadow-blue-100"
                          : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {isDone ? <CheckCircle className="h-5 w-5" /> : step}
                  </button>
                  <span
                    className={`text-xs font-semibold tracking-wide transition-colors ${isActive ? "text-[#F3056D]" : isDone ? "text-[#00477C]" : "text-gray-400"}`}
                  >
                    {stepLabels[step - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100/80 overflow-hidden">
          {/* ========== TAB 1: COURSE INFO ========== */}
          {activeStep === 1 && (
            <div className="animate-[fadeIn_0.4s_ease-out]">
              <div className="p-6 sm:p-8 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-6 bg-[#F3056D] rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-bold text-[#00477C]">
                    অর্ডার সংক্রান্ত তথ্য
                  </h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 p-4 sm:p-5 bg-gradient-to-r from-blue-50/50 to-pink-50/30 rounded-2xl border border-blue-100/50">
                  <div className="w-full sm:w-44 h-32 sm:h-36 bg-gray-200 rounded-xl relative overflow-hidden flex-shrink-0 ring-1 ring-black/5">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    {course.originalPrice > course.offerPrice && (
                      <div className="absolute top-2 left-2 bg-[#F3056D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {Math.round(
                          ((course.originalPrice - course.offerPrice) /
                            course.originalPrice) *
                            100,
                        )}
                        % OFF
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-snug">
                      {course.title}
                    </h3>
                    {course.instructor && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                        <User className="h-3.5 w-3.5" />{" "}
                        <span>{course.instructor}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="h-3.5 w-3.5" />{" "}
                      <span>{course.dates}</span>
                    </div>
                    {(course.duration || course.totalLectures) && (
                      <div className="flex gap-4 text-xs text-gray-400 mb-3">
                        {course.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {course.duration}
                          </span>
                        )}
                        {course.totalLectures && (
                          <span className="flex items-center gap-1">
                            <Video className="h-3 w-3" /> {course.totalLectures}{" "}
                            লেকচার
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#F3056D]">
                        ৳{course.offerPrice.toLocaleString()}
                      </span>
                      {course.originalPrice > course.offerPrice && (
                        <span className="text-base text-gray-400 line-through">
                          ৳{course.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-gradient-to-b from-gray-50/80 to-white">
                <div className="flex items-center gap-2 mb-5">
                  <Gift className="h-5 w-5 text-[#F3056D]" />
                  <h3 className="font-bold text-gray-900 text-lg">
                    আড-অন সার্ভিস সমূহ
                  </h3>
                  <span className="text-xs text-gray-400 font-medium">
                    (ঐচ্ছিক)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {addons.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 group ${
                          isSelected
                            ? "border-[#F3056D] bg-pink-50/60 shadow-sm shadow-pink-100"
                            : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                        }`}
                      >
                        <div className="mt-0.5">
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? "bg-[#F3056D] border-[#F3056D]" : "border-gray-300 group-hover:border-gray-400"}`}
                          >
                            {isSelected && (
                              <CheckCircle className="h-3.5 w-3.5 text-white" />
                            )}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked)
                              setSelectedAddons([...selectedAddons, addon.id]);
                            else
                              setSelectedAddons(
                                selectedAddons.filter((id) => id !== addon.id),
                              );
                          }}
                        />
                        <div
                          className={`flex-1 min-w-0 ${isSelected ? "text-gray-900" : "text-gray-600"}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={
                                isSelected ? "text-[#F3056D]" : "text-gray-400"
                              }
                            >
                              {addon.icon}
                            </span>
                            <span className="font-semibold text-sm">
                              {addon.name}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {addon.description}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="font-bold text-sm text-gray-900">
                            ৳{addon.price}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-white border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-gray-400">সাবটোটাল:</span>
                      <span className="font-bold text-gray-900 ml-1.5">
                        ৳{totals.subtotal.toLocaleString()}
                      </span>
                    </div>
                    {selectedAddons.length > 0 && (
                      <div className="text-gray-400">
                        + {selectedAddons.length}টি আড-অন
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleStepChange(2)}
                    className="w-full sm:w-auto px-10 py-3.5 bg-[#00477C] text-white font-bold rounded-xl hover:bg-[#003a66] transition-all shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 flex items-center justify-center gap-2 group"
                  >
                    এগিয়ে যান
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========== TAB 2: LOGIN / SIGNUP ========== */}
          {activeStep === 2 && (
            <div className="animate-[slideUp_0.4s_ease-out]">
              <div className="flex flex-col lg:flex-row min-h-[520px]">
                {/* Left Visual */}
                <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#00477C] to-[#002d4d] p-10 flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-[#F3056D] blur-3xl" />
                    <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full bg-blue-400 blur-3xl" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                      আপনার অ্যাকাউন্টে <br />
                      <span className="text-[#F3056D]">প্রবেশ করুন</span>
                    </h2>
                    <p className="text-blue-200/70 text-sm leading-relaxed max-w-xs">
                      কোর্স কেনার জন্য লগইন বা রেজিস্টার করতে হবে। আপনার তথ্য
                      সম্পূর্ণ নিরাপদ।
                    </p>
                  </div>
                  <div className="relative z-10 space-y-3">
                    {[
                      {
                        icon: <Shield className="h-4 w-4" />,
                        text: "১০০% সুরক্ষিত ডেটা",
                      },
                      {
                        icon: <Zap className="h-4 w-4" />,
                        text: "দ্রুত ভেরিফিকেশন",
                      },
                      {
                        icon: <Headphones className="h-4 w-4" />,
                        text: "২৪/৭ সাপোর্ট",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-blue-200/80 text-sm"
                      >
                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                          {item.icon}
                        </div>
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Form */}
                <div className="flex-1 p-6 sm:p-10 flex items-center justify-center">
                  <div className="w-full max-w-md">
                    {user ? (
                      <div className="text-center py-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-green-100">
                          <BadgeCheck className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          আপনি লগইন আছেন
                        </h2>
                        <p className="text-gray-500 mb-1 text-sm">
                          {user.email || user.phone}
                        </p>
                        {user.displayName && (
                          <p className="text-gray-900 font-semibold mb-8">
                            {user.displayName}
                          </p>
                        )}
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => signOut()}
                            className="px-6 py-2.5 border-2 border-red-100 text-red-500 rounded-xl hover:bg-red-50 font-semibold text-sm transition-colors"
                          >
                            <LogOut className="h-4 w-4 inline mr-1.5 -mt-0.5" />{" "}
                            লগআউট
                          </button>
                          <button
                            onClick={() => handleStepChange(3)}
                            className="px-8 py-2.5 bg-[#00477C] text-white font-bold rounded-xl hover:bg-[#003a66] transition-colors shadow-lg shadow-blue-200/50 text-sm"
                          >
                            পেমেন্ট এ যান{" "}
                            <ChevronRight className="h-4 w-4 inline ml-1 -mt-0.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleSubmitAuth(onAuthSubmit)}
                        className="flex flex-col gap-5"
                      >
                        <div className="lg:hidden text-center mb-2">
                          <div className="w-12 h-12 bg-[#00477C] rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Lock className="h-5 w-5 text-white" />
                          </div>
                          <h2 className="text-xl font-bold text-[#00477C]">
                            {authView === "input"
                              ? "লগইন করুন"
                              : authView === "password"
                                ? "পাসওয়ার্ড দিন"
                                : authView === "otp"
                                  ? "OTP যাচাই করুন"
                                  : "তথ্য পূরণ করুন"}
                          </h2>
                        </div>

                        {(authError || otpError) && (
                          <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl flex items-start gap-2 animate-[fadeIn_0.2s_ease-out]">
                            <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{authError || otpError}</span>
                          </div>
                        )}

                        {authView === "input" && (
                          <div className="space-y-4">
                            <div className="hidden lg:block">
                              <h2 className="text-2xl font-bold text-[#00477C] mb-1">
                                লগইন করুন
                              </h2>
                              <p className="text-gray-400 text-sm">
                                মোবাইল নাম্বার অথবা ইমেইল দিন
                              </p>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="মোবাইল নাম্বার / ইমেইল লিখুন"
                                className="w-full p-4 placeholder:text-gray-600 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none bg-gray-50/50 transition-all text-sm"
                                {...registerAuth("emailOrPhone", {
                                  required: "এই ফিল্ড আবশ্যক",
                                })}
                                onChange={() => setAuthError(null)}
                              />
                              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                <Smartphone className="h-4 w-4" />
                              </div>
                            </div>
                            {authErrors.emailOrPhone && (
                              <p className="text-red-500 text-xs -mt-2">
                                {authErrors.emailOrPhone.message as string}
                              </p>
                            )}
                            <button
                              type="submit"
                              disabled={isLoadingAuth}
                              className="w-full py-3.5 bg-[#2D2D2D] text-white rounded-xl font-semibold hover:bg-black transition-all shadow-lg shadow-gray-300/30 disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                            >
                              {isLoadingAuth ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "এগিয়ে যান"
                              )}
                              {!isLoadingAuth && (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        )}

                        {authView === "password" && (
                          <div className="space-y-4">
                            <div className="hidden lg:block">
                              <h2 className="text-2xl font-bold text-[#00477C] mb-1">
                                পাসওয়ার্ড দিন
                              </h2>
                              <p className="text-gray-400 text-sm">
                                আপনার অ্যাকাউন্টের পাসওয়ার্ড
                              </p>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600 font-medium">
                                {watchAuth("emailOrPhone")}
                              </span>
                            </div>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                placeholder="পাসওয়ার্ড লিখুন"
                                className="w-full p-4 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none bg-gray-50/50 transition-all text-sm"
                                {...registerAuth("password", {
                                  required: "পাসওয়ার্ড দিন",
                                })}
                                onChange={() => setAuthError(null)}
                              />
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            <button
                              type="submit"
                              disabled={isLoadingAuth}
                              className="w-full py-3.5 bg-[#F3056D] text-white rounded-xl font-semibold hover:bg-[#d9045f] transition-all shadow-lg shadow-pink-200/40 disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                            >
                              {isLoadingAuth ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "লগইন করুন"
                              )}
                            </button>
                          </div>
                        )}

                        {authView === "otp" && (
                          <div className="space-y-5">
                            <div className="hidden lg:block">
                              <h2 className="text-2xl font-bold text-[#00477C] mb-1">
                                ভেরিফিকেশন কোড
                              </h2>
                              <p className="text-gray-400 text-sm">
                                কোড পাঠানো হয়েছে{" "}
                                <span className="font-semibold text-gray-600">
                                  {watchAuth("emailOrPhone")}
                                </span>
                              </p>
                            </div>
                            <p className="lg:hidden text-center text-sm text-gray-500">
                              কোড পাঠানো হয়েছে{" "}
                              <span className="font-semibold">
                                {watchAuth("emailOrPhone")}
                              </span>
                            </p>
                            <div
                              className="flex justify-center gap-2.5"
                              onPaste={(e) => handleOtpPaste(e, 0)}
                            >
                              {[0, 1, 2, 3, 4, 5].map((i) => (
                                <input
                                  key={i}
                                  id={`otp-${i}`}
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={1}
                                  {...registerAuth(`otp.${i}`, {
                                    onChange: (e) => handleOtpChange(e, i),
                                    onKeyDown: (e) => handleOtpKeyDown(e, i),
                                    required: true,
                                  })}
                                  className={`w-11 border-2 rounded-xl text-center text-xl font-bold focus:outline-none transition-all ${otpError ? "border-red-300 focus:border-red-400 bg-red-50/50" : "border-gray-200 focus:border-[#F3056D] bg-gray-50/50 focus:bg-white"}`}
                                  style={{ height: "52px" }}
                                />
                              ))}
                            </div>
                            <div className="text-center">
                              {timeLeft > 0 ? (
                                <span className="text-sm font-bold text-[#F3056D] flex items-center justify-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5" />
                                  {formatTime(timeLeft)}
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={resendOtp}
                                  disabled={isLoadingAuth}
                                  className="text-sm font-semibold text-[#00477C] hover:underline"
                                >
                                  কোড আবার পাঠান
                                </button>
                              )}
                            </div>
                            <button
                              type="submit"
                              disabled={isLoadingAuth}
                              className="w-full py-3.5 bg-[#2D2D2D] text-white rounded-xl font-semibold hover:bg-black transition-all shadow-lg shadow-gray-300/30 disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                            >
                              {isLoadingAuth ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "ভেরিফাই করুন"
                              )}
                            </button>
                          </div>
                        )}

                        {authView === "details" && (
                          <div className="space-y-4">
                            <div className="hidden lg:block">
                              <h2 className="text-2xl font-bold text-[#00477C] mb-1">
                                অ্যাকাউন্ট তৈরি করুন
                              </h2>
                              <p className="text-gray-400 text-sm">
                                কিছু বেসিক তথ্য দিন
                              </p>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600 font-medium">
                                {watchAuth("emailOrPhone")}
                              </span>
                              <BadgeCheck className="h-4 w-4 text-green-500 ml-auto" />
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="আপনার পূর্ণ নাম"
                                className="w-full p-4 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none bg-gray-50/50 transition-all text-sm"
                                {...registerAuth("name", {
                                  required: "নাম দিন",
                                })}
                              />
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                placeholder="পাসওয়ার্ড সেট করুন"
                                className="w-full p-4 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none bg-gray-50/50 transition-all text-sm"
                                {...registerAuth("password", {
                                  required: "পাসওয়ার্ড দিন",
                                  minLength: {
                                    value: 6,
                                    message: "কমপক্ষে ৬ অক্ষর",
                                  },
                                })}
                              />
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="পাসওয়ার্ড কনফার্ম করুন"
                                className="w-full p-4 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none bg-gray-50/50 transition-all text-sm"
                                {...registerAuth("confirmPassword", {
                                  validate: (val) =>
                                    val === watchAuth("password") ||
                                    "পাসওয়ার্ড মিলছে না",
                                })}
                              />
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            {authErrors.confirmPassword && (
                              <p className="text-red-500 text-xs -mt-2">
                                {authErrors.confirmPassword.message as string}
                              </p>
                            )}
                            {authErrors.password &&
                              authErrors.password.type === "minLength" && (
                                <p className="text-red-500 text-xs -mt-2">
                                  {authErrors.password.message as string}
                                </p>
                              )}
                            <button
                              type="submit"
                              disabled={isLoadingAuth}
                              className="w-full py-3.5 bg-[#F3056D] text-white rounded-xl font-semibold hover:bg-[#d9045f] transition-all shadow-lg shadow-pink-200/40 disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                            >
                              {isLoadingAuth ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "রেজিস্টার করুন ও এগিয়ে যান"
                              )}
                            </button>
                          </div>
                        )}

                        {authView !== "input" && (
                          <button
                            type="button"
                            onClick={() => {
                              setAuthView("input");
                              setAuthError(null);
                              setOtpError(null);
                            }}
                            className="text-sm text-gray-400 hover:text-[#F3056D] transition-colors text-center mt-1"
                          >
                            ← নম্বর/ইমেইল পরিবর্তন করুন
                          </button>
                        )}
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========== TAB 3: PAYMENT ========== */}
          {activeStep === 3 && (
            <div className="animate-[fadeIn_0.4s_ease-out] flex flex-col lg:flex-row">
              {/* Left: Form */}
              <div className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-10 border-r border-gray-100">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-1.5 h-6 bg-[#F3056D] rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-bold text-[#00477C]">
                    পেমেন্ট পদ্ধতি
                  </h2>
                </div>

                {/* Plan Toggle */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    {
                      id: "full" as const,
                      label: "একবারে পরিশোধ",
                      sub: "সেরা মূল্য",
                      icon: <Zap className="h-4 w-4" />,
                    },
                    {
                      id: "monthly" as const,
                      label: "কিস্তিতে পরিশোধ",
                      sub: "২টি কিস্তি",
                      icon: <Clock className="h-4 w-4" />,
                    },
                  ].map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setPaymentPlan(plan.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 group ${paymentPlan === plan.id ? "border-[#F3056D] bg-pink-50/60 shadow-sm shadow-pink-100" : "border-gray-100 hover:border-gray-200 bg-white"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={
                            paymentPlan === plan.id
                              ? "text-[#F3056D]"
                              : "text-gray-400"
                          }
                        >
                          {plan.icon}
                        </span>
                        <span className="font-bold text-sm text-gray-900">
                          {plan.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{plan.sub}</span>
                    </button>
                  ))}
                </div>

                {/* Payment Methods */}
                <h3 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wider">
                  পেমেন্ট মাধ্যম নির্বাচন করুন
                </h3>
                <div className="space-y-2.5 mb-8">
                  {[
                    {
                      id: "bkash",
                      label: "bKash",
                      sub: "মোবাইল ব্যাংকিং",
                      color: "text-pink-600",
                      bg: "bg-pink-50",
                    },
                    {
                      id: "nagad",
                      label: "Nagad",
                      sub: "মোবাইল ব্যাংকিং",
                      color: "text-orange-600",
                      bg: "bg-orange-50",
                    },
                    {
                      id: "card",
                      label: "ক্রেডিট / ডেবিট কার্ড",
                      sub: "ভিসা, মাস্টারকার্ড",
                      color: "text-blue-600",
                      bg: "bg-blue-50",
                      icon: <CreditCard className="h-4 w-4" />,
                    },
                    {
                      id: "rocket",
                      label: "Rocket",
                      sub: "মোবাইল ব্যাংকিং",
                      color: "text-purple-600",
                      bg: "bg-purple-50",
                    },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedPaymentMethod === method.id ? "border-[#00477C] bg-blue-50/40 shadow-sm" : "border-gray-100 hover:border-gray-200 bg-white"}`}
                    >
                      <input
                        name="payment_method"
                        type="radio"
                        className="w-4 h-4 accent-[#00477C]"
                        checked={selectedPaymentMethod === method.id}
                        onChange={() => setSelectedPaymentMethod(method.id)}
                      />
                      <div
                        className={`w-9 h-9 rounded-lg ${method.bg} flex items-center justify-center ${method.color} font-bold text-xs`}
                      >
                        {method.icon || method.label.slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-sm text-gray-900">
                          {method.label}
                        </span>
                        <p className="text-xs text-gray-400">{method.sub}</p>
                      </div>
                      {selectedPaymentMethod === method.id && (
                        <CheckCircle className="h-4 w-4 text-[#00477C]" />
                      )}
                    </label>
                  ))}
                </div>

                {/* Promo */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold text-sm text-gray-900">
                      প্রোমো কোড
                    </span>
                    {promoApplied && (
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        প্রয়োগ হয়েছে
                      </span>
                    )}
                  </div>
                  {promoApplied ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          {promoCode} — ৳{promoDiscount} ছাড়
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setPromoApplied(false);
                          setPromoCode("");
                          setPromoDiscount(0);
                        }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        সরান
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="কোড লিখুন"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 p-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-[#00477C] outline-none bg-white"
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleApplyPromo()
                        }
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={isCheckingPromo || !promoCode.trim()}
                        className="px-5 py-2.5 bg-[#2D2D2D] text-white rounded-lg text-sm font-semibold hover:bg-black disabled:opacity-50 transition-colors"
                      >
                        {isCheckingPromo ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "প্রয়োগ"
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Billing */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-transparent rounded-xl border border-blue-100/50">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">
                    বিলিং তথ্য
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#00477C] flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.displayName || "ইউজার"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {user?.email || user?.phone}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveStep(2);
                        setCompletedSteps((prev) => {
                          const s = new Set(prev);
                          s.delete(3);
                          return s;
                        });
                      }}
                      className="text-xs text-[#F3056D] hover:underline font-medium"
                    >
                      পরিবর্তন
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Summary */}
              <div className="w-full lg:w-2/5 bg-gradient-to-b from-gray-50 to-white p-6 sm:p-8 lg:p-10 flex flex-col">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-[#00477C] rounded-full" />
                  অর্ডার সারাংশ
                </h3>

                <div className="flex gap-3 mb-5 pb-5 border-b border-gray-200">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl relative overflow-hidden flex-shrink-0">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">কোর্স ফি</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                    ৳{course.offerPrice.toLocaleString()}
                  </p>
                </div>

                {selectedAddons.map((id) => {
                  const addon = addons.find((a) => a.id === id);
                  if (!addon) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">{addon.icon}</span>
                        <span className="text-sm text-gray-600">
                          {addon.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        ৳{addon.price}
                      </span>
                    </div>
                  );
                })}

                <div className="mt-auto pt-6 border-t border-gray-200 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">সাবটোটাল</span>
                    <span className="font-medium text-gray-700">
                      ৳{totals.subtotal.toLocaleString()}
                    </span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">প্রোমো ছাড়</span>
                      <span className="font-medium text-green-600">
                        -৳{totals.discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {savings > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-600">মোট সাশ্রয়</span>
                      <span className="font-medium text-amber-600">
                        ৳{savings.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-3 border-t border-gray-200">
                    <span className="font-bold text-gray-900">সর্বমোট</span>
                    <div className="text-right">
                      {paymentPlan === "monthly" && (
                        <p className="text-[11px] text-gray-400 mb-0.5">
                          ২ কিস্তিতে ৳
                          {Math.ceil(totals.total / 2).toLocaleString()} করে
                        </p>
                      )}
                      <span className="text-3xl font-extrabold text-[#F3056D]">
                        ৳{totals.plan.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={!user}
                  className="w-full py-4 mt-6 bg-gradient-to-r from-[#F3056D] to-[#d9045f] hover:from-[#d9045f] hover:to-[#c0035a] text-white font-bold rounded-2xl shadow-lg shadow-pink-200/50 hover:shadow-xl hover:shadow-pink-300/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                >
                  {paymentPlan === "full"
                    ? "পেমেন্ট করুন"
                    : "প্রথম কিস্তি পরিশোধ করুন"}
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div className="flex items-center justify-center gap-4 mt-5 text-[11px] text-gray-400">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" /> SSL সুরক্ষিত
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="h-3 w-3" /> তাৎক্ষণিক অ্যাক্সেস
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-green-500" />
              <span>১০০% সুরক্ষিত পেমেন্ট</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Headphones className="h-3.5 w-3.5 text-blue-500" />
              <span>সাপোর্ট: ০১XXXXXXXXX</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5 text-amber-500" />
              <span>মানি ব্যাক গ্যারান্টি</span>
            </div>
          </div>
        </div>
      </div>

      <div id="recaptcha-container" style={{ display: "none" }}></div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
