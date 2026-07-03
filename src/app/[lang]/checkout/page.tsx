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
  Headphones,
  CircleCheck,
  CircleX,
  Receipt,
  Copy,
  RefreshCw,
} from "lucide-react";

// ===================== TYPES =====================

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

// ===================== FALLBACK DATA =====================

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

const PAYMENT_METHODS = [
  { id: "bkash", label: "bKash", color: "#E2136E" },
  { id: "nagad", label: "Nagad", color: "#F6921E" },
  { id: "rocket", label: "Rocket", color: "#8C3494" },
  { id: "card", label: "Credit/Debit Card", color: "#00477C" },
] as const;

// ===================== COMPONENT =====================

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    currentUser,
    appUser,
    loading: authLoading,
    signInWithEmail,
    signInWithPhone,
    logout,
    sendOtpEmail,
    checkOtpEmail,
    sendOtpPhone,
    checkOtpPhone,
    completeRegistration,
  } = useAuth();

  // =================== TAB STATE ===================
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // =================== DATA STATE ===================
  const [course, setCourse] = useState<Course>(FALLBACK_COURSE);
  const [addons, setAddons] = useState<Addon[]>(FALLBACK_ADDONS);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // =================== AUTH STATE ===================
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

  // =================== PAYMENT STATE ===================
  const [paymentPlan, setPaymentPlan] = useState<"full" | "monthly">("full");
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("bkash");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);

  // =================== PAYMENT FLOW STATE ===================
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // =================== CONFIG ===================
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // =================== STEP 0: Auth Gate ===================
  // Wait for Firebase to resolve, then auto-skip auth if already logged in.
  useEffect(() => {
    if (authLoading) return;

    if (currentUser && appUser) {
      // Already authenticated → skip auth step entirely
      setActiveStep(3);
      setCompletedSteps(new Set([1, 2]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, currentUser, appUser]);

  // --- Fetch Course Data ---
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
            if (data.addons?.length > 0) setAddons(data.addons);
          }
        }
      } catch (error) {
        console.error("Failed to fetch course data, using fallback:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BACKEND_URL]);

  // --- Handle Return From Payment Gateway ---
  useEffect(() => {
    const tranId = searchParams.get("tran_id");
    const status = searchParams.get("status");

    if (tranId && status) {
      setTransactionId(tranId);
      verifyPayment(tranId, status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // --- OTP Timer ---
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

  // =================== HELPERS ===================

  const advanceToPayment = useCallback(() => {
    setActiveStep(3);
    setCompletedSteps((prev) => new Set([...prev, 2]));
  }, []);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // =================== STEP NAVIGATION ===================

  const handleStepChange = (step: 1 | 2 | 3) => {
    if (paymentStatus !== "idle") return;

    if (step > activeStep) {
      if (activeStep === 1 && step === 2) {
        setActiveStep(step);
        setCompletedSteps((prev) => new Set(prev).add(1));
      } else if (activeStep === 2 && step === 3) {
        if (currentUser && appUser) {
          setActiveStep(step);
          setCompletedSteps((prev) => new Set(prev).add(2));
        }
      }
    } else {
      setActiveStep(step);
    }
  };

  // =================== VERIFY PAYMENT ===================

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

  // =================== AUTH: Check User Exists ===================

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

  // =================== AUTH: Resend OTP ===================

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

  // =================== AUTH: Form Submit Router ===================

  const onAuthSubmit = async (data: Record<string, any>) => {
    setAuthError(null);
    setOtpError(null);

    if (authView === "input") await handleInputSubmit(data);
    else if (authView === "password") await handlePasswordSubmit(data);
    else if (authView === "otp") await handleOtpSubmit(data);
    else if (authView === "details") await handleDetailsSubmit(data);
  };

  // =================== AUTH: Step 1 – Input ===================

  const handleInputSubmit = async (data: Record<string, any>) => {
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

  // =================== AUTH: Step 2a – Password (Existing User) ===================

  const handlePasswordSubmit = async (data: Record<string, any>) => {
    setIsLoadingAuth(true);
    const input = watchAuth("emailOrPhone");
    const password = data.password;
    const isEmail = /\S+@\S+\.\S+/.test(input);

    try {
      // ★ KEY CHANGE: redirect: false — stay on checkout
      if (isEmail) {
        await signInWithEmail(input, password, {
          redirect: false,
          onSuccess: advanceToPayment,
        });
      } else {
        await signInWithPhone(input, password, {
          redirect: false,
          onSuccess: advanceToPayment,
        });
      }
    } catch (error: any) {
      setAuthError(
        error?.response?.data?.message ||
          error?.message ||
          "ইমেইল/পাসওয়ার্ড সঠিক নয়।",
      );
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // =================== AUTH: Step 2b – OTP Verify (New User) ===================

  const handleOtpSubmit = async (data: Record<string, any>) => {
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
      setOtpError(error?.response?.data?.message || "ভেরিফিকেশন কোড সঠিক নয়।");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // =================== AUTH: Step 2c – Details (New User Final) ===================

  const handleDetailsSubmit = async (data: Record<string, any>) => {
    setIsLoadingAuth(true);
    const input = watchAuth("emailOrPhone");
    const isEmail = /\S+@\S+\.\S+/.test(input);
    const nameParts = data.name?.trim().split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    try {
      // ★ KEY CHANGE: redirect: false — stay on checkout
      await completeRegistration(
        {
          firstName,
          lastName,
          password: data.password,
          emailOrPhone: input,
          method: isEmail ? "email" : "phone",
        },
        {
          redirect: false,
          onSuccess: advanceToPayment,
        },
      );
    } catch (error: any) {
      setAuthError(error?.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // =================== AUTH: OTP Input Helpers ===================

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

  // =================== AUTH: Logout (from checkout) ===================

  const handleCheckoutLogout = async () => {
    setIsLoadingAuth(true);
    try {
      // ★ KEY CHANGE: redirect: false — stay on checkout
      await logout({ redirect: false });
      setAuthView("input");
      setCompletedSteps((prev) => {
        const next = new Set(prev);
        next.delete(2);
        return next;
      });
      setActiveStep(2);
    } catch {
      // Silent fail — user stays on page
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // =================== PROMO CODE ===================

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
        if (promoCode.toUpperCase() === "DEMO200") {
          setPromoDiscount(200);
          setPromoApplied(true);
        } else {
          alert("ভুল প্রোমো কোড।");
        }
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

  // =================== PAYMENT ===================

  const handlePayment = async () => {
    if (!currentUser) return;

    setPaymentError(null);
    setPaymentStatus("processing");

    try {
      const orderPayload = {
        courseId: course.id,
        userId: currentUser.uid,
        userName: appUser
          ? `${appUser.firstName} ${appUser.lastName}`
          : currentUser.displayName || "",
        userEmail: currentUser.email || "",
        userPhone: currentUser.phoneNumber || "",
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

      const res = await fetch(`${BACKEND_URL}/api/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "অর্ডার তৈরি করতে সমস্যা হয়েছে।");
      }

      const data = await res.json();

      if (data.paymentUrl) {
        setOrderId(data.orderId || data.tran_id);
        window.location.href = data.paymentUrl;
        return;
      }

      if (data.gatewayRedirectUrl) {
        setOrderId(data.orderId);
        window.location.href = data.gatewayRedirectUrl;
        return;
      }

      // Mock / demo mode
      setOrderId(data.orderId || `ORD-${Date.now()}`);
      setTransactionId(data.tran_id || `TXN-${Date.now()}`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPaymentStatus("success");
      setCompletedSteps((prev) => new Set(prev).add(3));
    } catch (error: any) {
      setPaymentStatus("failed");
      setPaymentError(
        error?.message || "পেমেন্ট শুরু করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      );
    }
  };

  const handleRetryPayment = () => {
    setPaymentStatus("idle");
    setPaymentError(null);
    setOrderId(null);
    setTransactionId(null);
  };

  // =================== RENDER: Global Loading ===================
  // Block everything until BOTH data and auth state are resolved

  if (isLoadingData || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-[#F3056D] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">
            {authLoading
              ? "অথেনটিকেশন চেক হচ্ছে..."
              : "কোর্সের তথ্য লোড হচ্ছে..."}
          </p>
        </div>
      </div>
    );
  }

  const stepLabels = ["কোর্স তথ্য", "লগইন / রেজিস্টার", "পেমেন্ট"];

  // =================== RENDER: Payment Processing ===================

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

  // =================== RENDER: Payment Verifying ===================

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

  // =================== RENDER: Payment Success ===================

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 max-w-lg w-full border border-gray-100 overflow-hidden">
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
          <div className="p-6 sm:p-8">
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
                      className="text-gray-400 hover:text-[#00477C] transition-colors"
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
                      className="text-gray-400 hover:text-[#00477C] transition-colors"
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

  // =================== RENDER: Payment Failed ===================

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

  // =================== RENDER: Main Checkout (Steps 1–3) ===================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans">
      {/* Invisible reCAPTCHA anchor for phone OTP */}
      <div
        id="recaptcha-container"
        className="overflow-hidden h-0 w-0 absolute"
      />

      <div className="container mx-auto px-4 max-w-5xl py-8">
        {/* ============ Progress Steps ============ */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative max-w-xl mx-auto">
            {/* Background track */}
            <div className="absolute top-5 left-[calc(12.5%+10px)] right-[calc(12.5%+10px)] h-[2px] bg-gray-200 rounded-full" />
            {/* Filled track */}
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
                    className={`text-xs font-semibold tracking-wide transition-colors ${
                      isActive
                        ? "text-[#F3056D]"
                        : isDone
                          ? "text-[#00477C]"
                          : "text-gray-400"
                    }`}
                  >
                    {stepLabels[step - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============ Main Card ============ */}
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
                        <User className="h-3.5 w-3.5" />
                        <span>{course.instructor}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="h-3.5 w-3.5" />
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

              {/* Addons */}
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
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-[#F3056D] border-[#F3056D]"
                                : "border-gray-300 group-hover:border-gray-400"
                            }`}
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

              {/* Continue */}
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

          {/* ========== TAB 2: AUTH ========== */}
          {activeStep === 2 && (
            <div className="animate-[slideUp_0.4s_ease-out]">
              <div className="flex flex-col lg:flex-row min-h-[520px]">
                {/* Left Visual Panel */}
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

                {/* Right Form Panel */}
                <div className="flex-1 p-6 sm:p-10 flex items-center justify-center">
                  <div className="w-full max-w-md">
                    {/* Already Logged In State */}
                    {currentUser && appUser ? (
                      <div className="text-center py-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-green-100">
                          <BadgeCheck className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          আপনি লগইন আছেন
                        </h2>
                        <p className="text-gray-500 mb-1 text-sm">
                          {currentUser.email || currentUser.phoneNumber}
                        </p>
                        <p className="text-gray-900 font-semibold mb-8">
                          {appUser.firstName} {appUser.lastName}
                        </p>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={handleCheckoutLogout}
                            disabled={isLoadingAuth}
                            className="px-6 py-2.5 border-2 border-red-100 text-red-500 rounded-xl hover:bg-red-50 font-semibold text-sm transition-colors disabled:opacity-50"
                          >
                            {isLoadingAuth ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <LogOut className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                                লগআউট
                              </>
                            )}
                          </button>
                          <button
                            onClick={advanceToPayment}
                            className="px-8 py-2.5 bg-[#00477C] text-white font-bold rounded-xl hover:bg-[#003a66] transition-colors shadow-lg shadow-blue-200/50 text-sm"
                          >
                            পেমেন্ট এ যান{" "}
                            <ChevronRight className="h-4 w-4 inline ml-1 -mt-0.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Auth Form */
                      <form
                        onSubmit={handleSubmitAuth(onAuthSubmit)}
                        className="flex flex-col gap-5"
                      >
                        {/* Mobile Header */}
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

                        {/* Error Banner */}
                        {(authError || otpError) && (
                          <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl flex items-start gap-2 animate-[fadeIn_0.2s_ease-out]">
                            <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{authError || otpError}</span>
                          </div>
                        )}

                        {/* ---- VIEW: Input ---- */}
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
                                {...registerAuth("emailOrPhone", {
                                  required: "এই ফিল্ড পূরণ করুন",
                                })}
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#00477C] focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                              />
                              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                <Smartphone className="h-4 w-4" />
                              </div>
                            </div>
                            <button
                              type="submit"
                              disabled={isLoadingAuth}
                              className="w-full py-3.5 bg-[#00477C] text-white font-bold rounded-xl hover:bg-[#003a66] transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                            >
                              {isLoadingAuth ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "এগিয়ে যান"
                              )}
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        )}

                        {/* ---- VIEW: Password ---- */}
                        {authView === "password" && (
                          <div className="space-y-4">
                            <div className="hidden lg:block">
                              <h2 className="text-2xl font-bold text-[#00477C] mb-1">
                                পাসওয়ার্ড দিন
                              </h2>
                              <p className="text-gray-400 text-sm">
                                আপনার অ্যাকাউন্টের পাসওয়ার্ড লিখুন
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600 flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              {watchAuth("emailOrPhone")}
                              <button
                                type="button"
                                onClick={() => {
                                  setAuthView("input");
                                  setAuthError(null);
                                }}
                                className="ml-auto text-[#F3056D] text-xs font-semibold hover:underline"
                              >
                                পরিবর্তন
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                placeholder="পাসওয়ার্ড লিখুন"
                                {...registerAuth("password", {
                                  required: "পাসওয়ার্ড দিন",
                                })}
                                className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-gray-200 focus:border-[#00477C] focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                              />
                              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                <Lock className="h-4 w-4" />
                              </div>
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
                              className="w-full py-3.5 bg-[#00477C] text-white font-bold rounded-xl hover:bg-[#003a66] transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                            >
                              {isLoadingAuth ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "লগইন করুন"
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAuthView("input");
                                setAuthError(null);
                              }}
                              className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 font-medium"
                            >
                              <ArrowLeft className="h-3.5 w-3.5 inline -mt-0.5 mr-1" />
                              ফিরে যান
                            </button>
                          </div>
                        )}

                        {/* ---- VIEW: OTP ---- */}
                        {authView === "otp" && (
                          <div className="space-y-4">
                            <div className="hidden lg:block">
                              <h2 className="text-2xl font-bold text-[#00477C] mb-1">
                                OTP যাচাই করুন
                              </h2>
                              <p className="text-gray-400 text-sm">
                                {watchAuth("emailOrPhone")} এ পাঠানো কোডটি লিখুন
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600 flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              {watchAuth("emailOrPhone")}
                              <button
                                type="button"
                                onClick={() => {
                                  setAuthView("input");
                                  setAuthError(null);
                                }}
                                className="ml-auto text-[#F3056D] text-xs font-semibold hover:underline"
                              >
                                পরিবর্তন
                              </button>
                            </div>
                            <div className="flex justify-center gap-2.5">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <input
                                  key={i}
                                  id={`otp-${i}`}
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={1}
                                  {...registerAuth(`otp.${i}`, {
                                    required: true,
                                  })}
                                  onChange={(e) => handleOtpChange(e, i)}
                                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                                  onPaste={(e) => handleOtpPaste(e, i)}
                                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200 focus:border-[#00477C] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                />
                              ))}
                            </div>
                            <div className="text-center">
                              {timeLeft > 0 ? (
                                <p className="text-sm text-gray-400">
                                  কোড পুনরায় পাঠাতে{" "}
                                  <span className="font-mono font-bold text-[#00477C]">
                                    {formatTime(timeLeft)}
                                  </span>{" "}
                                  অপেক্ষা করুন
                                </p>
                              ) : (
                                <button
                                  type="button"
                                  onClick={resendOtp}
                                  disabled={isLoadingAuth}
                                  className="text-sm text-[#F3056D] font-semibold hover:underline disabled:opacity-50"
                                >
                                  {isLoadingAuth
                                    ? "পাঠানো হচ্ছে..."
                                    : "আবার কোড পাঠান"}
                                </button>
                              )}
                            </div>
                            <button
                              type="submit"
                              disabled={isLoadingAuth}
                              className="w-full py-3.5 bg-[#00477C] text-white font-bold rounded-xl hover:bg-[#003a66] transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                            >
                              {isLoadingAuth ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "যাচাই করুন"
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAuthView("input");
                                setAuthError(null);
                              }}
                              className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 font-medium"
                            >
                              <ArrowLeft className="h-3.5 w-3.5 inline -mt-0.5 mr-1" />
                              ফিরে যান
                            </button>
                          </div>
                        )}

                        {/* ---- VIEW: Details (Registration) ---- */}
                        {authView === "details" && (
                          <div className="space-y-4">
                            <div className="hidden lg:block">
                              <h2 className="text-2xl font-bold text-[#00477C] mb-1">
                                তথ্য পূরণ করুন
                              </h2>
                              <p className="text-gray-400 text-sm">
                                রেজিস্ট্রেশন সম্পন্ন করতে নিচের তথ্য দিন
                              </p>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="পূর্ণ নাম লিখুন"
                                {...registerAuth("name", {
                                  required: "নাম দিন",
                                })}
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#00477C] focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                              />
                              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                <User className="h-4 w-4" />
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                placeholder="পাসওয়ার্ড তৈরি করুন"
                                {...registerAuth("password", {
                                  required: "পাসওয়ার্ড দিন",
                                  minLength: {
                                    value: 6,
                                    message: "কমপক্ষে ৬ অক্ষর",
                                  },
                                })}
                                className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-gray-200 focus:border-[#00477C] focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                              />
                              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                <Lock className="h-4 w-4" />
                              </div>
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
                                placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                                {...registerAuth("confirmPassword", {
                                  required: "পাসওয়ার্ড নিশ্চিত করুন",
                                  validate: (val) =>
                                    val === watchAuth("password") ||
                                    "পাসওয়ার্ড মিলছে না",
                                })}
                                className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-gray-200 focus:border-[#00477C] focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                              />
                              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                <Lock className="h-4 w-4" />
                              </div>
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
                              <p className="text-red-500 text-xs">
                                {authErrors.confirmPassword.message}
                              </p>
                            )}
                            <button
                              type="submit"
                              disabled={isLoadingAuth}
                              className="w-full py-3.5 bg-[#00477C] text-white font-bold rounded-xl hover:bg-[#003a66] transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                            >
                              {isLoadingAuth ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "রেজিস্ট্রেশন সম্পন্ন করুন"
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAuthView("otp");
                                setAuthError(null);
                              }}
                              className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 font-medium"
                            >
                              <ArrowLeft className="h-3.5 w-3.5 inline -mt-0.5 mr-1" />
                              ফিরে যান
                            </button>
                          </div>
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
            <div className="animate-[fadeIn_0.4s_ease-out]">
              <div className="flex flex-col lg:flex-row">
                {/* Left: Payment Options */}
                <div className="flex-1 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1.5 h-6 bg-[#00477C] rounded-full" />
                    <h2 className="text-xl sm:text-2xl font-bold text-[#00477C]">
                      পেমেন্ট পদ্ধতি নির্বাচন করুন
                    </h2>
                  </div>

                  {/* Payment Methods */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {PAYMENT_METHODS.map((method) => {
                      const isSelected = selectedPaymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setSelectedPaymentMethod(method.id)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                            isSelected
                              ? "border-[#00477C] bg-blue-50/50 shadow-sm"
                              : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                          }`}
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                            style={{
                              background: `${method.color}15`,
                            }}
                          >
                            <CreditCard
                              className="h-5 w-5"
                              style={{ color: method.color }}
                            />
                          </div>
                          <p
                            className={`text-sm font-bold ${
                              isSelected ? "text-[#00477C]" : "text-gray-700"
                            }`}
                          >
                            {method.label}
                          </p>
                          {isSelected && (
                            <div className="mt-2 w-5 h-5 rounded-full bg-[#00477C] flex items-center justify-center">
                              <CheckCircle className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Payment Plan */}
                  <div className="mb-8">
                    <h3 className="font-bold text-gray-900 text-sm mb-3">
                      পেমেন্ট প্ল্যান
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          {
                            id: "full",
                            label: "একবারে পরিশোধ",
                            sublabel: `৳${totals.total.toLocaleString()}`,
                            badge: null,
                          },
                          {
                            id: "monthly",
                            label: "মাসিক কিস্তি",
                            sublabel: `৳${Math.ceil(totals.total / 2).toLocaleString()}/মাস`,
                            badge: "২ মাস",
                          },
                        ] as const
                      ).map((plan) => {
                        const isSelected = paymentPlan === plan.id;
                        return (
                          <button
                            key={plan.id}
                            onClick={() => setPaymentPlan(plan.id)}
                            className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 relative ${
                              isSelected
                                ? "border-[#F3056D] bg-pink-50/50"
                                : "border-gray-100 hover:border-gray-200"
                            }`}
                          >
                            {plan.badge && (
                              <span className="absolute -top-2 right-3 text-[9px] font-bold bg-[#F3056D] text-white px-2 py-0.5 rounded-full">
                                {plan.badge}
                              </span>
                            )}
                            <p
                              className={`text-sm font-bold ${
                                isSelected ? "text-[#F3056D]" : "text-gray-700"
                              }`}
                            >
                              {plan.label}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {plan.sublabel}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-3">
                      প্রোমো কোড
                    </h3>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => {
                            setPromoCode(e.target.value);
                            if (promoApplied) {
                              setPromoApplied(false);
                              setPromoDiscount(0);
                            }
                          }}
                          placeholder="কোড লিখুন"
                          disabled={promoApplied}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#00477C] focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all disabled:bg-gray-50 disabled:text-gray-400"
                        />
                      </div>
                      {promoApplied ? (
                        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm font-semibold flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4" />
                          প্রয়োগ হয়েছে
                        </div>
                      ) : (
                        <button
                          onClick={handleApplyPromo}
                          disabled={isCheckingPromo || !promoCode.trim()}
                          className="px-5 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isCheckingPromo && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          )}
                          প্রয়োগ
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Order Summary */}
                <div className="lg:w-[380px] p-6 sm:p-8 bg-gradient-to-b from-gray-50/80 to-white">
                  <h3 className="font-bold text-gray-900 text-lg mb-5">
                    অর্ডার সামারি
                  </h3>

                  {/* Course */}
                  <div className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 mb-5">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg relative overflow-hidden flex-shrink-0">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 leading-snug line-clamp-2">
                        {course.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {course.dates}
                      </p>
                    </div>
                  </div>

                  {/* Addons */}
                  {selectedAddons.length > 0 && (
                    <div className="mb-5">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">
                        আড-অন সমূহ
                      </p>
                      {selectedAddons.map((id) => {
                        const addon = addons.find((a) => a.id === id);
                        if (!addon) return null;
                        return (
                          <div
                            key={id}
                            className="flex items-center justify-between py-2 text-sm"
                          >
                            <span className="text-gray-600 flex items-center gap-2">
                              <span className="text-gray-400">
                                {addon.icon}
                              </span>
                              {addon.name}
                            </span>
                            <span className="font-semibold text-gray-900">
                              ৳{addon.price}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="space-y-2.5 pt-4 border-t border-gray-100 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">কোর্সের মূল্য</span>
                      <span className="text-gray-600 line-through">
                        ৳{course.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">অফার মূল্য</span>
                      <span className="text-gray-900 font-semibold">
                        ৳{course.offerPrice.toLocaleString()}
                      </span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 font-medium">
                          প্রোমো ডিসকাউন্ট
                        </span>
                        <span className="text-green-600 font-bold">
                          -৳{totals.discount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {savings > 0 && (
                      <div className="flex justify-between text-xs bg-green-50 p-2.5 rounded-lg">
                        <span className="text-green-700 font-medium">
                          মোট সাশ্রয়
                        </span>
                        <span className="text-green-700 font-bold">
                          ৳{savings.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-r from-[#00477C] to-[#002d4d] rounded-2xl p-5 text-white mb-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-blue-200 text-sm">
                        মোট পরিশোধ্য
                      </span>
                      {totals.installments > 1 && (
                        <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full">
                          {totals.installments} কিস্তি
                        </span>
                      )}
                    </div>
                    <p className="text-3xl font-extrabold">
                      ৳{totals.plan.toLocaleString()}
                      {totals.installments > 1 && (
                        <span className="text-base font-medium text-blue-200">
                          /মাস
                        </span>
                      )}
                    </p>
                    {totals.installments > 1 && (
                      <p className="text-xs text-blue-200 mt-1">
                        মোট: ৳{totals.total.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    disabled={!currentUser}
                    className="w-full py-4 bg-[#F3056D] text-white font-bold rounded-xl hover:bg-[#d9045f] transition-all shadow-lg shadow-pink-200/40 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Shield className="h-4 w-4" />
                    {totals.installments > 1
                      ? `৳${totals.plan.toLocaleString()} পেমেন্ট করুন`
                      : `৳${totals.total.toLocaleString()} পেমেন্ট করুন`}
                  </button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" /> SSL Secured
                    </span>
                    <span className="flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Encrypted
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
}
