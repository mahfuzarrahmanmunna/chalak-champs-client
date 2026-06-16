"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
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
  Plus,
  X,
  ChevronRight,
  LogOut,
} from "lucide-react";

// --- MOCK DATA (Replace with dynamic props or API call if needed) ---
const MOCK_COURSE = {
  id: "course_123",
  title: "টিসিএফ A Unit + অন্যান্য সুবিধা (মাস - 2024)",
  image: "/signup.webp", // Replace with actual course image
  dates: "03 Mar, 2024 - 31 Dec, 2024",
  originalPrice: 5000,
  offerPrice: 4000,
};

const ADDONS = [
  { id: 1, name: "Question Bank (PDF)", price: 500 },
  { id: 2, name: "Live Class Access", price: 1000 },
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
  } = useAuth();

  // --- AUTH STATE LOGIC (Adapted from AuthPage) ---
  const [authView, setAuthView] = useState<"input" | "password" | "otp">(
    "input",
  );
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);

  const {
    register: registerAuth,
    handleSubmit: handleSubmitAuth,
    formState: { errors: authErrors },
    watch: watchAuth,
    setValue: setAuthValue,
  } = useForm();

  // --- CHECK USER STATUS (Simulated or API call) ---
  const checkUserStatus = async (input: string): Promise<boolean> => {
    // Replace this with your actual API call logic from AuthPage
    // const response = await fetch(`${BACKEND_URL}/api/auth/check-user`, ...);
    // For now, returning false (New User) to show OTP flow, true to show Password flow
    // Based on your previous code, this determines if we show Password or OTP
    console.log("Checking user:", input);
    return false; // Assuming new user for demo -> OTP flow. Change to true for Login flow.
  };

  // --- TIMER FOR OTP ---
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (authView === "otp" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
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

  // --- AUTH SUBMIT HANDLERS ---
  const onAuthSubmit = async (data: any) => {
    if (authView === "input") {
      await handleAuthInputSubmit(data);
    } else if (authView === "password") {
      await handleAuthPasswordSubmit(data);
    } else if (authView === "otp") {
      await handleAuthOtpSubmit(data);
    }
  };

  const handleAuthInputSubmit = async (data: any) => {
    const input = data.emailOrPhone;
    setIsLoadingAuth(true);
    try {
      const isExistingUser = await checkUserStatus(input);
      if (isExistingUser) {
        setAuthView("password");
      } else {
        // Trigger OTP logic here
        // await sendOtpEmail(input);
        setAuthView("otp");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleAuthPasswordSubmit = async (data: any) => {
    setIsLoadingAuth(true);
    try {
      // Call your actual login function
      // await signInWithEmail(data.emailOrPhone, data.password);
      // On success, the `user` context should update automatically or you reload
      console.log("Logged in with password");
      // Force a simulated login for demo if context not connected
      // location.reload();
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleAuthOtpSubmit = async (data: any) => {
    setIsLoadingAuth(true);
    const code = `${data.otp[0]}${data.otp[1]}${data.otp[2]}${data.otp[3]}${data.otp[4]}${data.otp[5]}`;
    try {
      // await checkOtpEmail(data.emailOrPhone, code);
      console.log("Verified OTP");
      // location.reload();
    } catch (error) {
      console.error("OTP failed", error);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // --- PAYMENT HANDLERS ---
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const handlePayment = async () => {
    if (!user) {
      alert("Please login to continue.");
      return;
    }
    setIsProcessingPayment(true);
    // Simulate Payment API
    setTimeout(() => {
      alert("Payment Successful! Course Enrolled.");
      router.push("/dashboard");
      setIsProcessingPayment(false);
    }, 2000);
  };

  // --- HELPER FOR OTP INPUTS ---
  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-[#00477C]"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Chalak Champs</span>
          </Link>
          <span className="font-bold text-gray-800">পদ্ধতি নির্বাচন</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= SECTION 1 & 2: LEFT COLUMN ================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* --- 1. ORDER CONFIRMATION DETAILS --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex gap-4">
                  <div className="w-32 h-32 bg-gray-200 rounded-xl flex-shrink-0 relative overflow-hidden">
                    <Image
                      src={MOCK_COURSE.image}
                      alt={MOCK_COURSE.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                      {MOCK_COURSE.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{MOCK_COURSE.dates}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-[#F3056D]">
                        ৳ {MOCK_COURSE.offerPrice}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ৳ {MOCK_COURSE.originalPrice}
                      </span>
                      <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        ৳ {MOCK_COURSE.originalPrice - MOCK_COURSE.offerPrice}{" "}
                        OFF
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add-ons Section */}
              <div className="bg-gray-50 p-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Add-ons
                </h3>
                <div className="space-y-3">
                  {ADDONS.map((addon) => (
                    <div
                      key={addon.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                          A
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {addon.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">
                          ৳ {addon.price}
                        </span>
                        <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md font-medium transition-colors">
                          Buy Addon
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* --- 2. LOGIN SECTION (Conditional) --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative">
              {!user ? (
                <>
                  <div className="mb-4 pb-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#00477C]">
                      Login to Continue
                    </h3>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">
                      Required
                    </span>
                  </div>

                  {/* Auth Form (Logic from AuthPage) */}
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmitAuth(onAuthSubmit)}
                  >
                    {/* View: Input */}
                    {authView === "input" && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Email or Phone
                          </label>
                          <input
                            type="text"
                            placeholder="মোবাইল নাম্বার/ ইমেইল লিখুন"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F3066E] outline-none text-sm"
                            {...registerAuth("emailOrPhone", {
                              required: true,
                            })}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isLoadingAuth}
                          className="w-full py-3 bg-[#2D2D2D] text-white rounded-lg font-medium hover:bg-black transition-colors"
                        >
                          {isLoadingAuth ? "Checking..." : "Proceed"}
                        </button>
                      </>
                    )}

                    {/* View: Password */}
                    {authView === "password" && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Account Found
                          </label>
                          <input
                            type="text"
                            disabled
                            value={watchAuth("emailOrPhone")}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm mb-3"
                          />
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Password
                          </label>
                          <input
                            type="password"
                            placeholder="পাসওয়ার্ড লিখুন"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F3066E] outline-none text-sm"
                            {...registerAuth("password", { required: true })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setAuthView("input")}
                            className="flex-1 py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={isLoadingAuth}
                            className="flex-[2] py-3 bg-[#F3056D] text-white rounded-lg font-medium hover:bg-[#d9045f]"
                          >
                            Login
                          </button>
                        </div>
                      </>
                    )}

                    {/* View: OTP */}
                    {authView === "otp" && (
                      <>
                        <p className="text-sm text-gray-600 text-center mb-4">
                          Enter 6-digit code sent to{" "}
                          <span className="font-bold">
                            {watchAuth("emailOrPhone")}
                          </span>
                        </p>
                        <div className="flex justify-center gap-2 mb-4">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <input
                              key={index}
                              id={`otp-${index}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              {...registerAuth(`otp.${index}`, {
                                onChange: (e) => handleOtpChange(e, index),
                                required: true,
                              })}
                              className="w-10 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-bold focus:border-[#F3066E] outline-none"
                            />
                          ))}
                        </div>
                        <div className="text-center text-sm font-bold text-[#F3056D] mb-4">
                          {formatTime(timeLeft)}
                        </div>
                        <button
                          type="submit"
                          disabled={isLoadingAuth}
                          className="w-full py-3 bg-[#2D2D2D] text-white rounded-lg font-medium"
                        >
                          Verify & Register
                        </button>
                      </>
                    )}
                  </form>
                </>
              ) : (
                // Logged In View
                <div className="flex items-center justify-between bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                      {user.email ? user.email[0].toUpperCase() : "U"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-900">
                        Logged in as
                      </p>
                      <p className="text-xs text-green-700">
                        {user.email || user.phone}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-xs text-red-600 font-medium hover:underline flex items-center gap-1"
                  >
                    <LogOut className="h-3 w-3" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ================= SECTION 3: RIGHT COLUMN (PAYMENT) ================= */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-24">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                  বিল সংক্রান্ত তথ্য
                </h3>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">৳ 5,000</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Service Fee</span>
                    <span className="font-medium text-green-600">
                      - ৳ 1,000
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>VAT (0%)</span>
                    <span className="font-medium text-gray-900">৳ 0</span>
                  </div>
                  <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between items-end">
                    <span className="font-bold text-gray-900">সর্বমোট</span>
                    <span className="text-2xl font-bold text-[#F3056D]">
                      ৳ 4,000
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Payment Method
                  </label>
                  <div className="flex gap-3">
                    <button className="flex-1 p-3 border-2 border-[#F3056D] rounded-lg bg-pink-50 flex flex-col items-center gap-1">
                      <CreditCard className="h-5 w-5 text-[#F3056D]" />
                      <span className="text-xs font-bold text-[#F3056D]">
                        Card
                      </span>
                    </button>
                    <button className="flex-1 p-3 border border-gray-200 rounded-lg hover:border-gray-300 flex flex-col items-center gap-1 transition-colors">
                      <span className="text-sm font-bold text-pink-600">
                        bKash
                      </span>
                    </button>
                    <button className="flex-1 p-3 border border-gray-200 rounded-lg hover:border-gray-300 flex flex-col items-center gap-1 transition-colors">
                      <span className="text-sm font-bold text-green-600">
                        Nagad
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      হেড কীট
                      <ChevronRight className="h-5 w-5" />
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  By clicking, you agree to our Terms & Conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
