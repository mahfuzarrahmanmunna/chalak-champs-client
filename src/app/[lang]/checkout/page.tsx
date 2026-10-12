"use client";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

import React, {
  Suspense,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import {
  User,
  Lock,
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  LogOut,
  Loader2,
  Shield,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  X,
  BadgeCheck,
  CircleCheck,
  Copy,
  AlertCircle,
} from "lucide-react";

// ===================== TYPES =====================

type PaymentStatus = "idle" | "processing" | "success" | "failed";

const PAYMENT_NUMBERS = [
  { id: "bkash", label: "bKash", number: "017XXXXXXX1", color: "#E2136E" },
  { id: "nagad", label: "Nagad", number: "017XXXXXXX2", color: "#F6921E" },
  { id: "rocket", label: "Rocket", number: "017XXXXXXX3", color: "#8C3494" },
];

// ===================== GTM HELPERS =====================

async function sha256Hex(input: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizePhone(rawPhone: string, countryCode: string): string {
  let p = (rawPhone || "").replace(/[\s\-()]/g, "");
  const cc = (countryCode || "").replace("+", "");
  if (p.startsWith("+")) {
    p = p.slice(1);
  } else if (p.startsWith("00")) {
    p = p.slice(2);
  } else if (p.startsWith("0")) {
    p = cc + p.slice(1);
  } else if (!p.startsWith(cc)) {
    p = cc + p;
  }
  return p.toLowerCase();
}

function normalizeName(rawName: string): string {
  return (rawName || "").toLowerCase().trim();
}

// ===================== FORM ERROR HELPER =====================
// Single top-level function — no duplicate inside component.

function getErrorMessage(error: any): string {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (typeof error.message === "string") return error.message;
  if (Array.isArray(error)) {
    for (const item of error) {
      const msg = getErrorMessage(item);
      if (msg) return msg;
    }
  }
  if (typeof error === "object") {
    for (const key of Object.keys(error)) {
      const msg = getErrorMessage(error[key]);
      if (msg) return msg;
    }
  }
  return "";
}

// ===================== COMPONENT =====================

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutPageFallback />}>
      <CheckoutPageContent />
    </Suspense>
  );
}

function CheckoutPageFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 text-[#F3056D] animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">লোড হচ্ছে...</p>
      </div>
    </div>
  );
}

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isBangla } = useLanguage();

  const {
    currentUser,
    appUser,
    loading: authLoading,
    signInWithEmail,
    signInWithPhone,
    logout,
    sendOtpEmail,
    checkOtpEmail,
    completeRegistration,
  } = useAuth();

  // =================== TAB STATE ===================
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // =================== DATA STATE ===================
  const [course, setCourse] = useState<any | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // =================== ENROLLMENT STATE ===================
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [hasPendingPayment, setHasPendingPayment] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(false);

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

  const isNewCustomerRef = useRef(false);

  const {
    register: registerAuth,
    handleSubmit: handleSubmitAuth,
    formState: { errors: authErrors },
    watch: watchAuth,
    setValue: setAuthValue,
  } = useForm({ mode: "onTouched" });

  // =================== MANUAL PAYMENT STATE ===================
  // transactionId removed — no longer needed
  const {
    register: registerPay,
    handleSubmit: handleSubmitPay,
    formState: { errors: payErrors },
    watch: watchPay,
    setValue: setPayValue,
  } = useForm({
    defaultValues: {
      userName: "",
      userPhone: "",
      paymentMethod: "bkash",
      amount: "",
    },
  });

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const selectedMethod = watchPay("paymentMethod");

  // =================== CONFIG ===================
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://apichalakchamps.vercel.app";
  const isPaymentInProgress = paymentStatus === "processing";

  const getLocalizedText = (value: any): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      return isBangla ? value.bn || value.en || "" : value.en || value.bn || "";
    }
    return "";
  };

  // =================== CHECK ENROLLMENT STATUS ===================
  const checkEnrollmentStatus = useCallback(async () => {
    if (!currentUser || !course) return;

    setIsCheckingEnrollment(true);
    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`${BACKEND_URL}/api/enrollments/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          courseId: course._id || course.id,
        }),
      });

      const data = await response.json();
      setIsAlreadyEnrolled(data.isEnrolled === true);
      setHasPendingPayment(data.hasPendingPayment === true);
    } catch (error) {
      console.error("Error checking enrollment status:", error);
    } finally {
      setIsCheckingEnrollment(false);
    }
  }, [currentUser, course, BACKEND_URL]);

  // =================== STEP 0: Auth Gate ===================
  useEffect(() => {
    if (authLoading) return;

    if (currentUser && appUser) {
      isNewCustomerRef.current = false;
      setActiveStep(3);
      setCompletedSteps(new Set([1, 2]));
      setPayValue("userName", `${appUser.firstName} ${appUser.lastName}`);
      setPayValue(
        "userPhone",
        appUser.phoneNumber || currentUser.phoneNumber || "",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, currentUser, appUser]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
    }
  }, []);

  useEffect(() => {
    if (currentUser && appUser && course) {
      checkEnrollmentStatus();
    }
  }, [currentUser, appUser, course, checkEnrollmentStatus]);

  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoadingData(true);
      setDataError(null);
      try {
        const slug = searchParams.get("course") || searchParams.get("slug");
        if (!slug) throw new Error("কোনো কোর্স নির্বাচন করা হয়নি।");

        const response = await fetch(`${BACKEND_URL}/api/courses/slug/${slug}`);
        if (!response.ok)
          throw new Error("কোর্সের তথ্য লোড করতে ব্যর্থ হয়েছে।");

        const rawData = await response.json();
        const courseData =
          rawData.course || rawData.data?.course || rawData.data || rawData;

        if (courseData) {
          setCourse(courseData);
          const price = courseData.offerPrice || courseData.originalPrice || 0;
          setPayValue("amount", price.toString());
        } else {
          throw new Error("কোর্সের তথ্য পাওয়া যায়নি।");
        }
      } catch (error: any) {
        console.error("Failed to fetch course data:", error);
        setDataError(error.message || "তথ্য লোড করতে সমস্যা হয়েছে।");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BACKEND_URL, searchParams]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = (text: string, method: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(method);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const formatImageUrl = (url?: string) => {
    if (!url) return "/default-course.jpg";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  // =================== STEP NAVIGATION ===================

  const handleStepChange = (step: 1 | 2 | 3) => {
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
      else {
        const res = await fetch(
          `${BACKEND_URL}/api/auth/send-phone-verification`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber: input }),
          },
        );
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message);
      }
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
        else {
          const res = await fetch(
            `${BACKEND_URL}/api/auth/send-phone-verification`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phoneNumber: input }),
            },
          );
          const d = await res.json();
          if (!res.ok || !d.success) throw new Error(d.message);
        }
        setTimeLeft(90);
        setAuthView("otp");
      }
    } catch (error: any) {
      setAuthError(error.message || "একটু পরে আবার চেষ্টা করুন।");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handlePasswordSubmit = async (data: Record<string, any>) => {
    setIsLoadingAuth(true);
    isNewCustomerRef.current = false;
    const input = watchAuth("emailOrPhone");
    const password = data.password;
    const isEmail = /\S+@\S+\.\S+/.test(input);

    try {
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

  const handleOtpSubmit = async (data: Record<string, any>) => {
    setIsLoadingAuth(true);
    const otpValues = data.otp;
    const code = Object.values(otpValues).join("");
    const input = watchAuth("emailOrPhone");
    const isEmail = /\S+@\S+\.\S+/.test(input);

    try {
      if (isEmail) await checkOtpEmail(input, code);
      else {
        const res = await fetch(`${BACKEND_URL}/api/auth/verify-phone-code`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber: input, code }),
        });
        const d = await res.json();
        if (!res.ok || !d.success) throw new Error(d.message);
      }
      setAuthView("details");
    } catch (error: any) {
      setOtpError(error?.response?.data?.message || "ভেরিফিকেশন কোড সঠিক নয়।");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleDetailsSubmit = async (data: Record<string, any>) => {
    setIsLoadingAuth(true);
    isNewCustomerRef.current = true;
    const input = watchAuth("emailOrPhone");
    const isEmail = /\S+@\S+\.\S+/.test(input);
    const nameParts = data.name?.trim().split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    try {
      await completeRegistration(
        {
          firstName,
          lastName,
          password: data.password,
          emailOrPhone: input,
          method: isEmail ? "email" : "phone",
        },
        { redirect: false, onSuccess: advanceToPayment },
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

  // =================== AUTH: Logout ===================

  const handleCheckoutLogout = async () => {
    setIsLoadingAuth(true);
    try {
      await logout({ redirect: false });
      setAuthView("input");
      setCompletedSteps((prev) => {
        const next = new Set(prev);
        next.delete(2);
        return next;
      });
      setActiveStep(2);
      setIsAlreadyEnrolled(false);
      setHasPendingPayment(false);
      isNewCustomerRef.current = false;
    } catch {
      // Silent fail
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // ============================================================
  // GTM: Push generate_lead
  // ============================================================
  const pushGenerateLead = async (paymentData: any) => {
    if (typeof window === "undefined") return;
    if (!course) return;

    const courseId = course._id || course.id;
    const sessionStorageKey = `checkout_lead_fired_${courseId}`;

    if (sessionStorage.getItem(sessionStorageKey) === "1") return;

    window.dataLayer = window.dataLayer || [];

    const phoneHash = await sha256Hex(
      normalizePhone(paymentData.userPhone, "+880"),
    );
    const childNameHash = await sha256Hex(
      normalizeName(paymentData.userName),
    );

    window.dataLayer.push({
      event: "generate_lead",
      new_customer: isNewCustomerRef.current,
      form_name: "Course Checkout",
      course_id: courseId,
      course_name: getLocalizedText(course.title) || "",
      class_level: course.level || course.classLevel || "",
      customer: {
        phone_hash: phoneHash,
        child_name_hash: childNameHash,
        country: "BD",
      },
    });

    sessionStorage.setItem(sessionStorageKey, "1");
  };

  // =================== MANUAL PAYMENT SUBMIT ===================
  // transactionId removed — no longer sent to backend

  const onPaymentSubmit = async (data: any) => {
    if (!currentUser || !course) {
      setPaymentError("Please login first to submit the payment.");
      return;
    }

    if (isAlreadyEnrolled) {
      setPaymentError("আপনি ইতিমধ্যে এই কোর্সে এনরোল করেছেন।");
      return;
    }

    if (hasPendingPayment) {
      setPaymentError(
        "আপনার আগের পেমেন্ট রিভিউ হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।",
      );
      return;
    }

    setPaymentError(null);
    setPaymentStatus("processing");

    try {
      const idToken = await currentUser.getIdToken();

      const res = await fetch(`${BACKEND_URL}/api/manual-payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          courseId: course._id || course.id,
          userName: data.userName,
          userPhone: data.userPhone,
          paymentMethod: data.paymentMethod,
          amount: Number(data.amount),
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        if (result.code === "ALREADY_ENROLLED") {
          setIsAlreadyEnrolled(true);
          throw new Error("আপনি ইতিমধ্যে এই কোর্সে এনরোল করেছেন।");
        }
        if (
          result.code === "PENDING_PAYMENT_EXISTS" ||
          result.code === "DUPLICATE_ENTRY"
        ) {
          setHasPendingPayment(true);
          throw new Error(
            "আপনার আগের পেমেন্ট রিভিউ হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।",
          );
        }
        throw new Error(result.message || "Failed to submit payment info.");
      }

      setPaymentStatus("success");
      setCompletedSteps((prev) => new Set(prev).add(3));

      await pushGenerateLead(data);
    } catch (error: any) {
      setPaymentStatus("failed");
      setPaymentError(error.message || "পেমেন্ট তথ্য জমা দিতে সমস্যা হয়েছে।");
    }
  };

  // =================== RENDER: Global Loading ===================

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

  // =================== RENDER: Data Fetch Error ===================

  if (dataError || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 max-w-md w-full border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-red-500 to-rose-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white blur-2xl" />
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                <AlertCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                তথ্য লোড করতে সমস্যা হয়েছে
              </h2>
              <p className="text-red-100 text-sm">দয়া করে আবার চেষ্টা করুন</p>
            </div>
          </div>
          <div className="p-8">
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl mb-6">
              {dataError || "কোর্সের তথ্য পাওয়া যায়নি।"}
            </div>
            <button
              onClick={() => router.push("/")}
              className="w-full py-3.5 bg-[#F3056D] text-white font-bold rounded-xl hover:bg-[#d9045f] transition-all shadow-lg shadow-pink-200/40 flex items-center justify-center gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" /> হোমপেজে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayOfferPrice =
    course.offerPrice && course.offerPrice > 0
      ? course.offerPrice
      : course.originalPrice || 0;
  const stepLabels = ["কোর্স তথ্য", "লগইন / রেজিস্টার", "ম্যানুয়াল পেমেন্ট"];

  // =================== RENDER: Already Enrolled ===================

  if (isAlreadyEnrolled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 max-w-md w-full border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                <BadgeCheck className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                আপনি ইতিমধ্যে এনরোল করেছেন!
              </h2>
              <p className="text-blue-100 text-sm">
                আপনি ইতিমধ্যে এই কোর্সে এনরোল করেছেন
              </p>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-xl relative overflow-hidden flex-shrink-0">
                <Image
                  src={formatImageUrl(course.thumbnail)}
                  alt={getLocalizedText(course.title) || "Course"}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                  {getLocalizedText(course.title)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  আপনি ইতিমধ্যে এই কোর্সে এনরোল করেছেন
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3.5 bg-[#00477C] text-white font-bold rounded-xl hover:bg-[#003a66] transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 text-sm"
              >
                <ChevronRight className="h-4 w-4" /> ড্যাশবোর্ডে যান
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ArrowLeft className="h-4 w-4" /> হোমপেজে যান
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =================== RENDER: Has Pending Payment ===================

  if (hasPendingPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 max-w-md w-full border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white blur-2xl" />
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                পেমেন্ট রিভিউ হচ্ছে
              </h2>
              <p className="text-amber-100 text-sm">
                আপনার আগের পেমেন্ট যাচাই হচ্ছে
              </p>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-xl relative overflow-hidden flex-shrink-0">
                <Image
                  src={formatImageUrl(course.thumbnail)}
                  alt={getLocalizedText(course.title) || "Course"}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                  {getLocalizedText(course.title)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  আপনার পেমেন্ট ভেরিফিকেশন পেন্ডিং আছে
                </p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-xl mb-6">
              অ্যাডমিন আপনার পেমেন্ট যাচাই করছেন। এটি ২৪ ঘণ্টার মধ্যে সম্পন্ন
              হবে। নতুন করে পেমেন্ট জমা দেওয়ার প্রয়োজন নেই।
            </div>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3.5 bg-[#00477C] text-white font-bold rounded-xl hover:bg-[#003a66] transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 text-sm"
              >
                <ChevronRight className="h-4 w-4" /> ড্যাশবোর্ডে যান
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ArrowLeft className="h-4 w-4" /> হোমপেজে যান
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =================== RENDER: Payment Processing ===================

  if (isPaymentInProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 p-10 max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-10 w-10 text-[#00477C] animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            তথ্য জমা হচ্ছে
          </h2>
          <p className="text-gray-500 text-sm">
            আপনার পেমেন্টের তথ্য ভেরিফিকেশনের জন্য জমা দেওয়া হচ্ছে। অনুগ্রহ করে
            অপেক্ষা করুন।
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
                তথ্য সফলভাবে জমা হয়েছে!
              </h2>
              <p className="text-green-100 text-sm">
                অ্যাডমিন যাচাই করার পর আপনার কোর্স এক্টিভ হবে
              </p>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-xl relative overflow-hidden flex-shrink-0">
                <Image
                  src={formatImageUrl(course.thumbnail)}
                  alt={getLocalizedText(course.title) || "Course"}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                  {getLocalizedText(course.title)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ২৪ ঘণ্টার মধ্যে কোর্স এক্টিভ হবে
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3.5 bg-[#00477C] text-white font-bold rounded-xl hover:bg-[#003a66] transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 text-sm"
            >
              <ChevronRight className="h-4 w-4" /> ড্যাশবোর্ডে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =================== RENDER: Main Checkout ===================

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
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 ${isActive ? "bg-[#F3056D] border-[#F3056D] text-white shadow-lg shadow-pink-200 scale-110" : isDone ? "bg-[#00477C] border-[#00477C] text-white shadow-md shadow-blue-100" : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"}`}
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

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100/80 overflow-hidden">
          {/* TAB 1: COURSE INFO */}
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
                      src={formatImageUrl(course.thumbnail)}
                      alt={getLocalizedText(course.title) || "Course"}
                      fill
                      sizes="(max-width: 768px) 100vw, 176px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-snug">
                      {getLocalizedText(course.title)}
                    </h3>
                    <div className="flex items-baseline gap-3 mt-4">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#F3056D]">
                        ৳{(displayOfferPrice || 0).toLocaleString()}
                      </span>
                      {(course.originalPrice || 0) > displayOfferPrice && (
                        <span className="text-base text-gray-400 line-through">
                          ৳{(course.originalPrice || 0).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-8 bg-white border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-gray-400">সাবটোটাল:</span>
                      <span className="font-bold text-gray-900 ml-1.5">
                        ৳{(displayOfferPrice || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStepChange(2)}
                    className="w-full sm:w-auto px-10 py-3.5 bg-[#00477C] text-white font-bold rounded-xl hover:bg-[#003a66] transition-all shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 flex items-center justify-center gap-2 group"
                  >
                    এগিয়ে যান{" "}
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUTH */}
          {activeStep === 2 && (
            <div className="animate-[slideUp_0.4s_ease-out]">
              <div className="flex flex-col lg:flex-row min-h-[520px]">
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
                      পেমেন্ট করার আগে আপনাকে অবশ্যই লগইন বা রেজিস্টার করতে হবে।
                      আপনার তথ্য সম্পূর্ণ নিরাপদ।
                    </p>
                  </div>
                </div>

                <div className="flex-1 p-6 sm:p-10 flex items-center justify-center">
                  <div className="w-full max-w-md">
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

                        {isCheckingEnrollment && (
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>এনরোলমেন্ট স্ট্যাটাস চেক হচ্ছে...</span>
                          </div>
                        )}

                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={handleCheckoutLogout}
                            disabled={isLoadingAuth || isCheckingEnrollment}
                            className="px-6 py-2.5 border-2 border-red-100 text-red-500 rounded-xl hover:bg-red-50 font-semibold text-sm transition-colors disabled:opacity-50"
                          >
                            {isLoadingAuth ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <LogOut className="h-4 w-4 inline mr-1.5 -mt-0.5" />{" "}
                                লগআউট
                              </>
                            )}
                          </button>
                          <button
                            onClick={advanceToPayment}
                            disabled={isCheckingEnrollment}
                            className="px-8 py-2.5 bg-[#00477C] text-white font-bold rounded-xl hover:bg-[#003a66] transition-colors shadow-lg shadow-blue-200/50 text-sm disabled:opacity-50"
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
                            <X className="h-4 w-4 mt-0.5 flex-shrink-0" />{" "}
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
                                {...registerAuth("emailOrPhone", {
                                  required: "এই ফিল্ড পূরণ করুন",
                                })}
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#00477C] focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
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
                              )}{" "}
                              <ChevronRight className="h-4 w-4" />
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
                                আপনার অ্যাকাউন্টের পাসওয়ার্ড লিখুন
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600 flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />{" "}
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
                                className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#00477C] focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
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
                              <ArrowLeft className="h-3.5 w-3.5 inline -mt-0.5 mr-1" />{" "}
                              ফিরে যান
                            </button>
                          </div>
                        )}

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
                              <Mail className="h-4 w-4 text-gray-400" />{" "}
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
                                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-300 text-gray-900 focus:border-[#00477C] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
                              <ArrowLeft className="h-3.5 w-3.5 inline -mt-0.5 mr-1" />{" "}
                              ফিরে যান
                            </button>
                          </div>
                        )}

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
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#00477C] focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
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
                                className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#00477C] focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
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
                                className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#00477C] focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
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
                            {getErrorMessage(authErrors.confirmPassword) && (
                              <p className="text-red-500 text-xs">
                                {getErrorMessage(authErrors.confirmPassword)}
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
                              <ArrowLeft className="h-3.5 w-3.5 inline -mt-0.5 mr-1" />{" "}
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

          {/* TAB 3: MANUAL PAYMENT */}
          {activeStep === 3 && (
            <div className="animate-[fadeIn_0.4s_ease-out]">
              <form
                onSubmit={handleSubmitPay(onPaymentSubmit)}
                className="flex flex-col lg:flex-row"
              >
                <div className="flex-1 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#00477C] text-white flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <h2 className="text-xl font-bold text-[#00477C]">
                      Send Money To
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {PAYMENT_NUMBERS.map((pay) => (
                      <div
                        key={pay.id}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod === pay.id ? "border-[#00477C] bg-blue-50/50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}
                        onClick={() => setPayValue("paymentMethod", pay.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="font-bold text-sm"
                            style={{ color: pay.color }}
                          >
                            {pay.label}
                          </span>
                          {selectedMethod === pay.id && (
                            <CheckCircle className="h-4 w-4 text-[#00477C]" />
                          )}
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <span className="font-mono text-sm text-gray-700 font-medium">
                            {pay.number}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(pay.number, pay.id);
                            }}
                            className="text-gray-400 hover:text-[#00477C] transition-colors"
                          >
                            {copiedNumber === pay.id ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-xl flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      অনুগ্রহ করে উপরের যেকোনো একটি নাম্বারে টাকা পাঠান।
                    </span>
                  </div>
                </div>

                <div className="lg:w-[420px] p-6 sm:p-8 bg-gradient-to-b from-gray-50/80 to-white">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#00477C] text-white flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h2 className="text-xl font-bold text-[#00477C]">
                      Submit Payment Info
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Your Name — required */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...registerPay("userName", {
                          required: "Name is required",
                        })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#00477C] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="Enter your name"
                      />
                      {getErrorMessage(payErrors.userName) && (
                        <p className="text-red-500 text-xs mt-1">
                          {getErrorMessage(payErrors.userName)}
                        </p>
                      )}
                    </div>

                    {/* Phone Number — required */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...registerPay("userPhone", {
                          required: "Phone is required",
                        })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#00477C] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="Enter your phone number"
                      />
                      {getErrorMessage(payErrors.userPhone) && (
                        <p className="text-red-500 text-xs mt-1">
                          {getErrorMessage(payErrors.userPhone)}
                        </p>
                      )}
                    </div>

                    {/* Amount — required, readonly */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Amount (৳) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...registerPay("amount", {
                          required: "Amount is required",
                        })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#00477C] focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50"
                        placeholder="Amount"
                        readOnly
                      />
                    </div>

                    {paymentError && (
                      <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl flex items-start gap-2 animate-[fadeIn_0.2s_ease-out]">
                        <X className="h-4 w-4 mt-0.5 flex-shrink-0" />{" "}
                        <span>{paymentError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isPaymentInProgress}
                      className="w-full py-3.5 bg-[#00477C] text-white font-bold rounded-xl hover:bg-[#003a66] transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                    >
                      {isPaymentInProgress ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> জমা
                          হচ্ছে...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4" /> পেমেন্ট তথ্য জমা দিন
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStepChange(2)}
                      className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center justify-center gap-1"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> ফিরে যান
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}