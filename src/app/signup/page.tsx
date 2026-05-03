"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/button/Button";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const SignUpPage = () => {
  // Import functions from context
  const {
    sendOtpEmail,
    checkOtpEmail,
    sendOtpPhone,
    checkOtpPhone,
    completeRegistration,
  } = useAuth();

  // State to manage which view is showing on the Left Side
  const [view, setView] = useState<"login" | "otp" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds = 1:30

  // Helper function to format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Countdown Effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (view === "otp" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view, timeLeft]);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm();

  // --- HANDLERS (UPDATED WITH FIREBASE/BACKEND LOGIC) ---

  // 1. Login/Initial Submit Handler
  const onLoginSubmit = async (data: any) => {
    setIsLoading(true);
    const input = data.emailOrPhone;

    // Simple check to see if it's an email or phone number
    const isEmail = /\S+@\S+\.\S+/.test(input);

    try {
      if (isEmail) {
        // Call Email OTP Service
        await sendOtpEmail(input);
      } else {
        // Call Phone OTP Service
        // Note: 'recaptcha-container' is needed for invisible recaptcha if using Firebase SDK directly
        await sendOtpPhone(input, "recaptcha-container");
      }

      // --- RESET TIMER ---
      setTimeLeft(90); // Reset to 1:30 when code is sent

      // If successful, move to OTP view
      setView("otp");
    } catch (error: any) {
      // Simple alert to keep design unchanged
      window.alert(
        error.response?.data?.message ||
          "Failed to send code. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 2. OTP Submit Handler
  const onOtpSubmit = async (data: any) => {
    setIsLoading(true);

    // Join: 6 OTP digits
    const code = `${data.otp[0]}${data.otp[1]}${data.otp[2]}${data.otp[3]}${data.otp[4]}${data.otp[5]}`;
    const input = watch("emailOrPhone"); // Retrieve: email/phone from step 1
    const isEmail = /\S+@\S+\.\S+/.test(input);

    try {
      if (isEmail) {
        await checkOtpEmail(input, code);
      } else {
        await checkOtpPhone(input, code);
      }
      // If successful, move to Registration details view
      setView("register");
    } catch (error: any) {
      window.alert(
        error.response?.data?.message || "Invalid verification code.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Register/Final Submit Handler
  const onRegisterSubmit = async (data: any) => {
    setIsLoading(true);

    const input = watch("emailOrPhone");
    const isEmail = /\S+@\S+\.\S+/.test(input);

    // Split name into first/last (Assuming simple space separation, adjust as needed)
    const nameParts = data.name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    try {
      await completeRegistration({
        firstName,
        lastName,
        password: data.password,
        emailOrPhone: input,
        method: isEmail ? "email" : "phone",
      });
      // Context usually handles navigation on success, but we can log here
      console.log("Registration Successful");
    } catch (error: any) {
      window.alert(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- OTP LOGIC (INTEGRATED WITH RHF) ---

  // Handler to update OTP value and move focus
  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      e.preventDefault();
      return;
    }

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  // Handle Backspace to move focus back
  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Recaptcha container (required for Phone Auth - Invisible) */}
      <div id="recaptcha-container" style={{ display: "none" }}></div>

      <div className="flex container mx-auto items-center justify-between min-h-screen">
        {/* LEFT SIDE: Dynamic Content */}
        <div className="w-full flex flex-col justify-center items-center p-6 md:p-12 lg:px-20 relative z-10">
          <div className="w-full max-w-md">
            {/* --- VIEW 1: LOGIN FORM (Initial) --- */}
            {view === "login" && (
              <>
                <div className="mb-5">
                  <Link href="/" className="flex items-center gap-2">
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
                      ওয়েবসাইটে ফিরে যান
                    </Button>
                  </Link>
                </div>

                {/* Header */}
                <div className="mb-5">
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
                </div>

                {/* Form */}
                <div className="w-full">
                  <form
                    className="flex flex-col gap-5"
                    onSubmit={handleSubmit(onLoginSubmit)}
                  >
                    <input
                      type="text"
                      placeholder="মোবাইল নাম্বার/ ইমেইল লেখুন"
                      className="placeholder:text-[#8897AD] p-3.5 shadow-[inset_0_0_0_1px_#D1D5DB] rounded-lg w-full text-black outline-none focus:shadow-[inset_0_0_0_2px_#F3066E] transition-all bg-gray-50"
                      {...register("emailOrPhone", { required: true })}
                      disabled={isLoading}
                    />

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 w-full py-3 bg-[#2D2D2D] text-[#FFFFFF] rounded-[10px] font-medium transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "প্রসেসিং..." : "এগিয়ে যান"}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative flex items-center py-6">
                    <div className="flex-grow border-t border-[#D1D5DB]"></div>
                    <span className="flex-shrink mx-4 text-[#8897AD] font-medium text-sm">
                      Or
                    </span>
                    <div className="flex-grow border-t border-[#D1D5DB]"></div>
                  </div>

                  {/* Google Button */}
                  <button className="group flex gap-2 relative overflow-hidden rounded-lg bg-[#EFEFEF] py-4 px-16 text-lg font-bold text-[#2D2D2D] w-full justify-center hover:bg-gray-200 transition-colors">
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
                        __html: `
                      @keyframes shimmer {
                        0% { transform: translateX(-100%) skewX(-45deg); }
                        40%, 100% { transform: translateX(150%) skewX(-45deg); }
                      }
                    `,
                      }}
                    />
                  </button>
                </div>
              </>
            )}

            {/* --- VIEW 2: OTP / INFO FORM --- */}
            {view === "otp" && (
              <>
                <div className="mb-5">
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
                    onClick={() => setView("login")}
                  >
                    পেছনে ফিরে যান
                  </Button>
                </div>

                {/* 
                   UPDATED SECTION: 
                   Here, {watch("emailOrPhone")} retrieves: input value from: Login step 
                   and displays it dynamically.
                */}
                <p className="text-lg font-medium text-[#2D2D2D] leading-6 mb-6">
                  {watch("emailOrPhone")} নাম্বার/ইমেইল পাঠানো 6 সংখ্যার কোডটি
                  লিখুন
                </p>

                {/* OTP Section */}
                <form onSubmit={handleSubmit(onOtpSubmit)}>
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
                      {/* --- DYNAMIC TIMER --- */}
                      <span className="text-sm font-bold text-[#F3066D]">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button (Navigates to Register) */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#2D2D2D] text-white font-bold py-3.5 rounded-[10px] hover:bg-black transition-colors shadow-lg mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "যাচাই করা হচ্ছে..." : "ইনফরমেশন দিন"}
                  </button>
                </form>

                {/* Divider + Google */}
                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-[#D1D5DB]"></div>
                  <span className="flex-shrink mx-4 text-[#8897AD] font-medium text-sm">
                    Or
                  </span>
                  <div className="flex-grow border-t border-[#D1D5DB]"></div>
                </div>

                <button className="group flex gap-2 relative overflow-hidden rounded-lg bg-[#EFEFEF] py-4 px-16 text-lg font-bold text-[#2D2D2D] w-full justify-center hover:bg-gray-200 transition-colors">
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
                      __html: `
                      @keyframes shimmer {
                        0% { transform: translateX(-100%) skewX(-45deg); }
                        40%, 100% { transform: translateX(150%) skewX(-45deg); }
                      }
                    `,
                    }}
                  />
                </button>
              </>
            )}

            {/* --- VIEW 3: REGISTER FORM --- */}
            {view === "register" && (
              <>
                <div className="mb-5">
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
                    onClick={() => setView("otp")}
                  >
                    পেছনে ফিরে যান
                  </Button>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-medium leading-[1.6] text-[#00477C] mb-2">
                    লগইন সম্পূর্ণ করতে আপনার তথ্য দিন
                  </h2>
                </div>

                {/* Registration Form */}
                <form
                  className="flex flex-col gap-5"
                  onSubmit={handleSubmit(onRegisterSubmit)}
                >
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
                      পাসওড়া <span className="text-red-500">*</span>
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
                      পাসওড়া পুনরাবৃত্তি <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="********"
                      disabled={isLoading}
                      className="placeholder:text-[#8897AD] p-3.5 shadow-[inset_0_0_0_1px_#D1D5DB] rounded-lg w-full text-black outline-none focus:shadow-[inset_0_0_0_2px_#F3066E] transition-all bg-gray-50"
                      {...register("confirmPassword", {
                        required: true,
                        validate: (val) => {
                          if (watch("password") != val) {
                            return "পাসওয়ার্ড মিলছে না";
                          }
                        },
                      })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#2D2D2D] text-white font-bold py-3.5 rounded-[10px] hover:bg-black transition-colors shadow-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "প্রসেসিং..." : "ফর্ম পদ্ধতি"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Static Image (Never Changes) */}
        <div className="w-full hidden md:flex">
          <div>
            <div className="max-w-118 max-h-121 rounded-2xl ">
              <Image
                src="/signup.webp"
                alt="Slide"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
