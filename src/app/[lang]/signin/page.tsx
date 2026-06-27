"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Button from "@/app/ui/button/Button";
import { useLanguage } from "@/app/context/LanguageContext";

const AuthPage = () => {
  // Assuming these functions exist in your useAuth context
  const {
    signInWithEmail,
    signInWithPhone,
    sendOtpEmail,
    checkOtpEmail,
    sendOtpPhone,
    checkOtpPhone,
    completeRegistration,
    user, // Assuming user object is available in context with role
  } = useAuth();

  const router = useRouter();
  const { isBangla, currentLang, getLink } = useLanguage();

  // ================= CONFIGURATION =================
  // CHANGE THIS to your Backend URL (e.g., http://localhost:5000)
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  // ===============================================

  // State to manage which view is showing
  const [view, setView] = useState<"input" | "password" | "otp" | "details">(
    "input",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm();

  // --- HELPER: Role-based redirect ---
  const redirectByRole = (role: string = "student") => {
    if (role === "admin") {
      router.push(getLink("/admin-dashboard"));
    } else {
      router.push(getLink("/dashboard"));
    }
  };

  // --- FUNCTION: CHECK IF USER EXISTS (Calls your Backend) ---
  const checkUserStatus = async (input: string): Promise<boolean> => {
    try {
      console.log(
        `Checking user: ${input} at ${BACKEND_URL}/api/auth/check-user`,
      );

      const response = await fetch(`${BACKEND_URL}/api/auth/check-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrPhone: input }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Check User Response:", data);

      // The backend controller we added returns { exists: true/false }
      return data.exists === true;
    } catch (error) {
      console.error("Error checking user status:", error);
      // If API fails, we assume NEW USER (Signup flow) to be safe
      return false;
    }
  };

  // --- EFFECTS ---
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (view === "otp" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (view === "input") {
      setTimeLeft(90);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- HANDLERS ---
  const onSubmit = async (data: any) => {
    if (view === "input") {
      await handleInputSubmit(data);
    } else if (view === "password") {
      await handlePasswordSubmit(data);
    } else if (view === "otp") {
      await handleOtpSubmit(data);
    } else if (view === "details") {
      await handleDetailsSubmit(data);
    }
  };

  const handleInputSubmit = async (data: any) => {
    const input = data.emailOrPhone;
    const isEmail = /\S+@\S+\.\S+/.test(input);
    const isPhone = /^01[3-9]\d{8}$/.test(input);

    if (!isEmail && !isPhone) {
      window.alert("সঠিক মোবাইল নাম্বার অথবা ইমেইল লিখুন");
      return;
    }

    setIsLoading(true);
    try {
      // 1. CALL BACKEND TO CHECK IF USER EXISTS
      const isExistingUser = await checkUserStatus(input);

      if (isExistingUser) {
        // FLOW: LOGIN (User already registered)
        console.log("User exists -> Redirecting to Password View");
        setView("password");
      } else {
        // FLOW: SIGNUP (User is new)
        console.log("User is new -> Redirecting to OTP View");
        if (isEmail) {
          await sendOtpEmail(input);
        } else {
          await sendOtpPhone(input, "recaptcha-container");
        }
        setTimeLeft(90);
        setView("otp");
      }
    } catch (error: any) {
      console.error(error);
      window.alert(error.message || "Error checking user status");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (data: any) => {
    setIsLoading(true);
    const input = watch("emailOrPhone");
    const password = data.password;
    const isEmail = /\S+@\S+\.\S+/.test(input);

    try {
      let authResult;
      if (isEmail) {
        authResult = await signInWithEmail(input, password);
      } else {
        authResult = await signInWithPhone(input, password);
      }

      // Extract role from auth result
      // Adjust these paths based on your actual auth response structure
      const role =
        authResult?.role ||
        authResult?.user?.role ||
        authResult?.data?.role ||
        authResult?.data?.user?.role ||
        user?.role ||
        "student";

      console.log("User Role:", role);

      // Role-based redirect
      redirectByRole(role);
    } catch (error: any) {
      console.error("Login failed:", error);
      window.alert(
        error.response?.data?.message ||
          error.message ||
          "ইমেইল/পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (data: any) => {
    setIsLoading(true);
    const code = `${data.otp[0]}${data.otp[1]}${data.otp[2]}${data.otp[3]}${data.otp[4]}${data.otp[5]}`;
    const input = watch("emailOrPhone");
    const isEmail = /\S+@\S+\.\S+/.test(input);

    try {
      if (isEmail) {
        await checkOtpEmail(input, code);
      } else {
        await checkOtpPhone(input, code);
      }
      setView("details");
    } catch (error: any) {
      window.alert(
        error.response?.data?.message || "Invalid verification code.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailsSubmit = async (data: any) => {
    setIsLoading(true);
    const input = watch("emailOrPhone");
    const isEmail = /\S+@\S+\.\S+/.test(input);

    const nameParts = data.name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    try {
      const registrationResult = await completeRegistration({
        firstName,
        lastName,
        password: data.password,
        emailOrPhone: input,
        method: isEmail ? "email" : "phone",
      });

      console.log("Registration Successful", registrationResult);

      // Extract role from registration result (though new users are typically students)
      const role =
        registrationResult?.role ||
        registrationResult?.user?.role ||
        registrationResult?.data?.role ||
        registrationResult?.data?.user?.role ||
        "student";

      // Role-based redirect
      redirectByRole(role);
    } catch (error: any) {
      window.alert(error.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Helpers
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

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  };

  const handleBack = () => {
    if (view === "password" || view === "otp") {
      setView("input");
    } else if (view === "details") {
      setView("otp");
    } else {
      router.push("/");
    }
  };

  // --- GOOGLE LOGIN HANDLER ---
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Assuming you have a googleSignIn function in your auth context
      // const authResult = await signInWithGoogle();
      // const role = authResult?.user?.role || "student";
      // redirectByRole(role);

      // Placeholder - implement based on your Google auth setup
      console.log("Google login not yet implemented");
      window.alert("Google login coming soon!");
    } catch (error: any) {
      console.error("Google login failed:", error);
      window.alert(error.message || "Google login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white">
      <div id="recaptcha-container" style={{ display: "none" }}></div>

      <div className="flex container mx-auto items-center justify-between h-[calc(100vh-200px)] md:h-[calc(100vh-100px)]">
        {/* LEFT SIDE: Dynamic Content */}
        <div className="w-full flex flex-col justify-center items-center p-6 md:p-12 lg:px-20 relative z-10">
          <div className="w-full max-w-md">
            {/* --- HEADER / BACK BUTTON --- */}
            <div className="mb-5">
              {view === "input" ? (
                <Link href={getLink("/")} className="flex items-center gap-2">
                  <Button
                    icon={
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_627_4045)">
                          <path
                            d="M8.33333 13.3332L8.33333 14.9998C8.33333 15.4419 8.50893 15.8658 8.82149 16.1783C9.13405 16.4909 9.55797 16.6665 10 16.6665L15.8333 16.6665C16.2754 16.6665 16.6993 16.4909 17.0118 16.1783C17.3244 15.8658 17.5 15.4419 17.5 14.9998L17.5 4.99984C17.5 4.55781 17.3244 4.13389 17.0118 3.82133C16.6993 3.50877 16.2754 3.33317 15.8333 3.33317L10 3.33317C9.55797 3.33317 9.13405 3.50877 8.82149 3.82133C8.50893 4.13389 8.33334 4.55781 8.33334 4.99984L8.33334 6.6665"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3.33366 10L14.167 10M14.167 10L11.667 12.5M14.167 10L11.667 7.5"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_627_4045">
                            <rect
                              width="20"
                              height="20"
                              fill="white"
                              transform="translate(20 20) rotate(-180)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    }
                  >
                    ওয়েবসাইটে ফিরে যান
                  </Button>
                </Link>
              ) : (
                <Button
                  icon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.8337 10.0003C15.8337 14.6027 12.1361 18.3337 7.50033 18.3337C2.86455 18.3337 -0.833008 14.6027 -0.833008 10.0003C-0.833008 5.39801 2.86455 1.66699 7.50033 1.66699C12.1361 1.66699 15.8337 5.39801 15.8337 10.0003Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.8337 7.50033L7.50033 10.8337L4.16699 7.50033"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                  onClick={handleBack}
                >
                  পেছনে ফিরে যান
                </Button>
              )}
            </div>

            {/* --- TITLE SECTION --- */}
            <div className="mb-5">
              {/* VIEW 1: Input */}
              {view === "input" && (
                <>
                  <h1 className="text-4xl text-[#00477C] font-bold tracking-[-5%]">
                    চালাক <span className="text-[#F3066D]"> Champs-এ</span>{" "}
                    <span className="relative inline-block px-3 py-2 group">
                      <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>
                      <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
                      <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
                      <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
                      <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
                      <span className="bg-linear-to-r from-primary to-[#FC7CB4] bg-clip-text text-transparent">
                        {" "}
                        স্বাগতম
                      </span>
                    </span>{" "}
                  </h1>
                  <p className="text-lg font-medium text-[#2D2D2D] leading-[1.6]">
                    মোবাইল নাম্বার/ ইমেইল দিয়ে এগিয়ে যান
                  </p>
                </>
              )}

              {/* VIEW 2: Password (Login) */}
              {view === "password" && (
                <>
                  <h1 className="text-4xl text-[#00477C] font-bold tracking-[-5%]">
                    পাসওয়ার্ড <span className="text-[#F3066D]"> দিন</span>
                  </h1>
                  <p className="text-lg font-medium text-[#2D2D2D] leading-[1.6] mt-2">
                    <span className="font-semibold text-[#00477C]">
                      {watch("emailOrPhone")}
                    </span>{" "}
                    এর পাসওয়ার্ড লিখুন
                  </p>
                </>
              )}

              {/* VIEW 2: OTP (Signup) */}
              {view === "otp" && (
                <p className="text-lg font-medium text-[#2D2D2D] leading-6 mb-6">
                  {watch("emailOrPhone")} নাম্বার/ইমেইল পাঠানো 6 সংখ্যার কোডটি
                  লিখুন
                </p>
              )}

              {/* VIEW 3: Details (Signup) */}
              {view === "details" && (
                <h2 className="text-lg font-medium leading-[1.6] text-[#00477C] mb-2">
                  লগইন সম্পূর্ণ করতে আপনার তথ্য দিন
                </h2>
              )}
            </div>

            {/* --- FORM SECTION --- */}
            <div className="w-full">
              <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* VIEW 1: Input Field */}
                {view === "input" && (
                  <>
                    <input
                      type="text"
                      placeholder="মোবাইল নাম্বার/ ইমেইল লিখুন"
                      className="placeholder:text-[#8897AD] p-3.5 shadow-[inset_0_0_0_1px_#D1D5DB] rounded-lg w-full text-black outline-none focus:shadow-[inset_0_0_0_2px_#F3066E] transition-all bg-gray-50"
                      {...register("emailOrPhone", { required: true })}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 w-full py-3 bg-[#2D2D2D] text-[#FFFFFF] rounded-[10px] font-medium transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "প্রসেসিং..." : "এগিয়ে যান"}
                    </button>
                  </>
                )}

                {/* VIEW 2: Password (Login) */}
                {view === "password" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">
                        মোবাইল নাম্বার / ইমেইল
                      </label>
                      <input
                        type="text"
                        disabled
                        placeholder="xxxxxxxxxxx@xxxx"
                        className="placeholder:text-[#8897AD] p-3.5 shadow-[inset_0_0_0_1px_#D1D5DB] rounded-lg w-full text-black outline-none focus:shadow-[inset_0_0_0_2px_#F3066E] transition-all bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed"
                        {...register("emailOrPhone")}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">
                        পাসওয়ার্ড <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="পাসওয়ার্ড লিখুন"
                        disabled={isLoading}
                        className="placeholder:text-[#8897AD] p-3.5 shadow-[inset_0_0_0_1px_#D1D5DB] rounded-lg w-full text-black outline-none focus:shadow-[inset_0_0_0_2px_#F3066E] transition-all bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        {...register("password", {
                          required: "পাসওয়ার্ড আবশ্যক",
                        })}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password.message as string}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Link
                        href={getLink("/forgot-password")}
                        className="text-sm text-[#F3066D] font-medium hover:underline"
                      >
                        পাসওয়ার্ড ভুলে গেছেন?
                      </Link>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 w-full py-3 bg-[#2D2D2D] text-[#FFFFFF] rounded-[10px] font-medium transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "লগইন হচ্ছে..." : "লগইন করুন"}
                    </button>
                  </>
                )}

                {/* VIEW 2: OTP (Signup) */}
                {view === "otp" && (
                  <>
                    <div className="mb-6">
                      <p className="text-center text-sm font-medium text-gray-700 mb-3">
                        6 সংখ্যা চেক করুন
                      </p>
                      <div className="flex justify-center gap-4 mb-2 text-[#545454]">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            disabled={isLoading}
                            {...register(`otp.${index}`, {
                              onChange: (e) => handleOtpChange(e, index),
                              onKeyDown: (e) => handleOtpKeyDown(e, index),
                              required: true,
                            })}
                            className={`w-14 h-14 border-2 rounded-xl flex items-center justify-center text-2xl font-bold text-center outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                              watch(`otp.${index}`)
                                ? "border-[#2D2D2D]"
                                : "border-dashed border-gray-400"
                            } focus:border-[#F3066E]`}
                          />
                        ))}
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-bold text-[#F3066D]">
                          {formatTime(timeLeft)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#2D2D2D] text-white font-bold py-3.5 rounded-[10px] hover:bg-black transition-colors shadow-lg mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "যাচাই করা হচ্ছে..." : "ইনফরমেশন দিন"}
                    </button>
                  </>
                )}

                {/* VIEW 3: Details (Signup) */}
                {view === "details" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">
                        ফোন নাম্বার / ইমেইল
                      </label>
                      <input
                        type="text"
                        disabled
                        placeholder="xxxxxxxxxxx@xxxx"
                        className="placeholder:text-[#8897AD] p-3.5 shadow-[inset_0_0_0_1px_#D1D5DB] rounded-lg w-full text-black outline-none focus:shadow-[inset_0_0_0_2px_#F3066E] transition-all bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed"
                        {...register("emailOrPhone")}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">
                        শেষ নাম / নাম <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="শেষ নাম / নাম লিখুন"
                        disabled={isLoading}
                        className="placeholder:text-[#8897AD] p-3.5 shadow-[inset_0_0_0_1px_#D1D5DB] rounded-lg w-full text-black outline-none focus:shadow-[inset_0_0_0_2px_#F3066E] transition-all bg-gray-50"
                        {...register("name", { required: true })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">
                        পাসওড়া <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="********"
                        disabled={isLoading}
                        className="placeholder:text-[#8897AD] p-3.5 shadow-[inset_0_0_0_1px_#D1D5DB] rounded-lg w-full text-black outline-none focus:shadow-[inset_0_0_0_2px_#F3066E] transition-all bg-gray-50"
                        {...register("password", { required: true })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">
                        পাসওড়া পুনরাবৃত্তি{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="********"
                        disabled={isLoading}
                        className="placeholder:text-[#8897AD] p-3.5 shadow-[inset_0_0_0_1px_#D1D5DB] rounded-lg w-full text-black outline-none focus:shadow-[inset_0_0_0_2px_#F3066E] transition-all bg-gray-50"
                        {...register("confirmPassword", {
                          required: true,
                          validate: (val) => {
                            if (watch("password") != val)
                              return "পাসওয়ার্ড মিলছে না";
                          },
                        })}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.confirmPassword.message as string}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#2D2D2D] text-white font-bold py-3.5 rounded-[10px] hover:bg-black transition-colors shadow-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "প্রসেসিং..." : "ফর্ম পদ্ধতি"}
                    </button>
                  </>
                )}
              </form>

              {/* --- DIVIDER & GOOGLE BUTTON --- */}
              {view !== "details" && (
                <>
                  <div className="relative flex items-center py-6">
                    <div className="flex-grow border-t border-[#D1D5DB]"></div>
                    <span className="flex-shrink mx-4 text-[#8897AD] font-medium text-sm">
                      Or
                    </span>
                    <div className="flex-grow border-t border-[#D1D5DB]"></div>
                  </div>

                  <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="group flex gap-2 relative overflow-hidden rounded-lg bg-[#EFEFEF] py-4 px-16 text-lg font-bold text-[#2D2D2D] w-full justify-center hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span
                      className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/40 to-transparent"
                      style={{
                        transform: "translateX(-100%)",
                        animation: "shimmer 2.5s infinite ease-in-out",
                      }}
                    ></span>
                    <div>
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_740_1963)">
                          <path
                            d="M27.7273 14.3223C27.7273 13.3706 27.6501 12.4138 27.4855 11.4775H14.2803V16.8687H21.8423C21.5285 18.6074 20.5202 20.1456 19.0438 21.123V24.621H23.5553C26.2046 22.1827 27.7273 18.5817 27.7273 14.3223Z"
                            fill="#4285F4"
                          />
                          <path
                            d="M14.2803 28.0009C18.0561 28.0009 21.2404 26.7611 23.5605 24.6211L19.049 21.1231C17.7938 21.977 16.1734 22.4606 14.2854 22.4606C10.633 22.4606 7.5362 19.9965 6.42505 16.6836H1.76953V20.2897C4.14616 25.0172 8.98688 28.0009 14.2803 28.0009Z"
                            fill="#34A853"
                          />
                          <path
                            d="M6.4199 16.6837C5.83346 14.9449 5.83346 13.0621 6.4199 11.3234V7.71729H1.76953C-0.216144 11.6732 -0.216144 16.3339 1.76953 20.2898L6.4199 16.6837Z"
                            fill="#FBBC04"
                          />
                          <path
                            d="M14.2803 5.54127C16.2762 5.51041 18.2053 6.26146 19.6508 7.64012L23.6479 3.64305C21.1169 1.26642 17.7578 -0.0402103 14.2803 0.000943444C8.98687 0.000943444 4.14616 2.98459 1.76953 7.71728L6.41991 11.3234C7.52591 8.00536 10.6279 5.54127 14.2803 5.54127Z"
                            fill="#EA4335"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_740_1963">
                            <rect width="28" height="28" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <span className="relative z-10 transition-transform duration-300 group-hover:translate-y-[-1px] inline-block">
                      Login with Google
                    </span>
                    <style
                      dangerouslySetInnerHTML={{
                        __html: `@keyframes shimmer { 0% { transform: translateX(-100%) skewX(-45deg); } 40%, 100% { transform: translateX(150%) skewX(-45deg); } }`,
                      }}
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Static Image */}
        <div className="w-full hidden md:flex">
          <div>
            <div className="max-w-118 max-h-121 rounded-2xl ">
              <Image
                src="/signup.webp"
                alt="Slide"
                width={500}
                height={500}
                loading="eager"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
