"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Button from "@/app/ui/button/Button";
import { useLanguage } from "@/app/context/LanguageContext";

const UnifiedAuthPage = () => {
  const {
    sendOtpEmail,
    checkOtpEmail,
    sendOtpPhone,
    checkOtpPhone,
    completeRegistration,
    signInWithEmail,
    signInWithPhone,
    // IMPORTANT: You need to add this function to your AuthContext
    // It should call your backend to check if the email/phone is already registered
    checkUserExists,
  } = useAuth();

  const router = useRouter();
  const { isBangla } = useLanguage();

  // State manages the 4 steps: login -> password (existing) OR otp -> register (new)
  const [view, setView] = useState<"login" | "password" | "otp" | "register">(
    "login",
  );
  const [isLoading, setIsLoading] = useState(false);

  // Timer State for OTP
  const [timeLeft, setTimeLeft] = useState(90);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (view === "otp" && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view, timeLeft]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm();

  // --- HANDLERS ---

  // 1. Initial Submit: Checks if user exists
  const onLoginSubmit = async (data: any) => {
    setIsLoading(true);
    const input = data.emailOrPhone;
    const isEmail = /\S+@\S+\.\S+/.test(input);
    const isPhone = /^01[3-9]\d{8}$/.test(input);

    if (!isEmail && !isPhone) {
      window.alert("সঠিক মোবাইল নাম্বার অথবা ইমেইল লিখুন");
      setIsLoading(false);
      return;
    }

    try {
      // CHECK IF USER EXISTS
      const userExists = await checkUserExists(input);

      if (userExists) {
        // Existing User -> Go to Password View
        setView("password");
      } else {
        // New User -> Send OTP & Go to OTP View
        if (isEmail) {
          await sendOtpEmail(input);
        } else {
          await sendOtpPhone(input, "recaptcha-container");
        }
        setTimeLeft(90);
        setView("otp");
      }
    } catch (error: any) {
      window.alert(
        error.response?.data?.message || "Failed to proceed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 2A. Existing User: Password Submit
  const onPasswordSubmit = async (data: any) => {
    setIsLoading(true);
    const input = watch("emailOrPhone");
    const password = data.password;
    const isEmail = /\S+@\S+\.\S+/.test(input);

    try {
      if (isEmail) {
        await signInWithEmail(input, password);
      } else {
        await signInWithPhone(input, password);
      }
      router.push("/dashboard");
    } catch (error: any) {
      window.alert(
        error.response?.data?.message || "ইমেইল/পাসওয়ার্ড সঠিক নয়।",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 2B. New User: OTP Submit
  const onOtpSubmit = async (data: any) => {
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
      setView("register");
    } catch (error: any) {
      window.alert(
        error.response?.data?.message || "Invalid verification code.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 3. New User: Final Registration Submit
  const onRegisterSubmit = async (data: any) => {
    setIsLoading(true);
    const input = watch("emailOrPhone");
    const isEmail = /\S+@\S+\.\S+/.test(input);
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
      router.push("/dashboard"); // Redirect after registration
    } catch (error: any) {
      window.alert(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- OTP INPUT LOGIC ---
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

  // --- SHARED UI COMPONENTS (To avoid repetition) ---
  const GoogleButton = () => (
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
          {/* Google SVG Paths */}
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
  );

  return (
    <div className="w-full bg-white">
      <div id="recaptcha-container" style={{ display: "none" }}></div>

      <div className="flex container mx-auto items-center justify-between h-[calc(100vh-200px)] md:h-[calc(100vh-100px)]">
        {/* LEFT SIDE: Dynamic Content */}
        <div className="w-full flex flex-col justify-center items-center p-6 md:p-12 lg:px-20 relative z-10">
          <div className="w-full max-w-md">
            {/* --- VIEW 1: INITIAL LOGIN --- */}
            {view === "login" && (
              <>
                <div className="mb-5">
                  <Link href="/" className="flex items-center gap-2">
                    <Button 
                    // icon={/* Back Arrow SVG */}
                    >
                      ওয়েবসাইটে ফিরে যান
                    </Button>
                  </Link>
                </div>
                <div className="mb-5">
                  <h1 className="text-4xl text-[#00477C] font-bold tracking-[-5%]">
                    চালাক <span className="text-[#F3066D]"> Champs-এ</span>
                    <span className="relative inline-block px-3 py-2 group">
                      <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>
                      <span className="bg-linear-to-r from-primary to-[#FC7CB4] bg-clip-text text-transparent">
                        {" "}
                        স্বাগতম
                      </span>
                    </span>
                  </h1>
                  <p className="text-lg font-medium text-[#2D2D2D] leading-[1.6]">
                    মোবাইল নাম্বার/ ইমেইল দিয়ে এগিয়ে যান
                  </p>
                </div>

                <form
                  className="flex flex-col gap-5"
                  onSubmit={handleSubmit(onLoginSubmit)}
                >
                  <input
                    type="text"
                    placeholder="মোবাইল নাম্বার/ ইমেইল লিখুন"
                    className="placeholder:text-[#8897AD] p-3.5 shadow-[inset_0_0_0_1px_#D1D5DB] rounded-lg w-full text-black outline-none focus:shadow-[inset_0_0_0_2px_#F3066E] transition-all bg-gray-50"
                    {...register("emailOrPhone", { required: true })}
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 w-full py-3 bg-[#2D2D2D] text-[#FFFFFF] rounded-[10px] font-medium transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? "চেক করা হচ্ছে..." : "এগিয়ে যান"}
                  </button>
                </form>

                <div className="relative flex items-center py-6">
                  <div className="flex-grow border-t border-[#D1D5DB]"></div>
                  <span className="flex-shrink mx-4 text-[#8897AD] font-medium text-sm">
                    Or
                  </span>
                  <div className="flex-grow border-t border-[#D1D5DB]"></div>
                </div>
                <GoogleButton />
              </>
            )}

            {/* --- VIEW 2A: PASSWORD (EXISTING USER) --- */}
            {view === "password" && (
              <>
                <div className="mb-5">
                  <Button
                    // icon={/* Back Arrow SVG */}
                    onClick={() => setView("login")}
                  >
                    পেছনে ফিরে যান
                  </Button>
                </div>
                <div className="mb-5">
                  <h1 className="text-4xl text-[#00477C] font-bold tracking-[-5%]">
                    পাসওয়ার্ড <span className="text-[#F3066D]"> দিন</span>
                  </h1>
                  <p className="text-lg font-medium text-[#2D2D2D] leading-[1.6] mt-2">
                    <span className="font-semibold text-[#00477C]">
                      {watch("emailOrPhone")}
                    </span>{" "}
                    এর পাসওয়ার্ড লিখুন
                  </p>
                </div>

                <form
                  className="flex flex-col gap-5"
                  onSubmit={handleSubmit(onPasswordSubmit)}
                >
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">
                      মোবাইল নাম্বার / ইমেইল
                    </label>
                    <input
                      type="text"
                      disabled
                      className="placeholder:text-[#8897AD] p-3.5 shadow-[inset_0_0_0_1px_#D1D5DB] rounded-lg w-full text-black outline-none bg-gray-200 cursor-not-allowed"
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
                      className="placeholder:text-[#8897AD] p-3.5 shadow-[inset_0_0_0_1px_#D1D5DB] rounded-lg w-full text-black outline-none focus:shadow-[inset_0_0_0_2px_#F3066E] transition-all bg-gray-50"
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
                      href="/forgot-password"
                      className="text-sm text-[#F3066D] font-medium hover:underline"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </Link>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 w-full py-3 bg-[#2D2D2D] text-[#FFFFFF] rounded-[10px] font-medium transition-all shadow-lg disabled:opacity-50"
                  >
                    {isLoading ? "লগইন হচ্ছে..." : "লগইন করুন"}
                  </button>
                </form>

                <div className="relative flex items-center py-6">
                  <div className="flex-grow border-t border-[#D1D5DB]"></div>
                  <span className="flex-shrink mx-4 text-[#8897AD] font-medium text-sm">
                    Or
                  </span>
                  <div className="flex-grow border-t border-[#D1D5DB]"></div>
                </div>
                <GoogleButton />
              </>
            )}

            {/* --- VIEW 2B: OTP (NEW USER) --- */}
            {view === "otp" && (
              <>
                <div className="mb-5">
                  <Button
                    // icon={/* Back Arrow SVG */}
                    onClick={() => setView("login")}
                  >
                    পেছনে ফিরে যান
                  </Button>
                </div>
                <p className="text-lg font-medium text-[#2D2D2D] leading-6 mb-6">
                  {watch("emailOrPhone")} নাম্বার/ইমেইল পাঠানো 6 সংখ্যার কোডটি
                  লিখুন
                </p>

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
                          className={`w-14 h-14 border-2 rounded-xl flex items-center justify-center text-2xl font-bold text-center outline-none transition-colors disabled:opacity-50 ${watch(`otp.${index}`) ? "border-[#2D2D2D]" : "border-dashed border-gray-400"} focus:border-[#F3066E]`}
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
                    className="w-full bg-[#2D2D2D] text-white font-bold py-3.5 rounded-[10px] hover:bg-black transition-colors shadow-lg mb-6 disabled:opacity-50"
                  >
                    {isLoading ? "যাচাই করা হচ্ছে..." : "ইনফরমেশন দিন"}
                  </button>
                </form>

                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-[#D1D5DB]"></div>
                  <span className="flex-shrink mx-4 text-[#8897AD] font-medium text-sm">
                    Or
                  </span>
                  <div className="flex-grow border-t border-[#D1D5DB]"></div>
                </div>
                <GoogleButton />
              </>
            )}

            {/* --- VIEW 3: REGISTER (NEW USER FINAL STEP) --- */}
            {view === "register" && (
              <>
                <div className="mb-5">
                  <Button
                    // icon={/* Back Arrow SVG */}
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
                      className="placeholder:text-[#8897AD] p-3.5 shadow-[inset_0_0_0_1px_#D1D5DB] rounded-lg w-full text-black outline-none bg-gray-200 cursor-not-allowed"
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
                      পাসওয়া <span className="text-red-500">*</span>
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
                      পাসওয়া পুনরাবৃত্তি <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="********"
                      disabled={isLoading}
                      className="placeholder:text-[#8897AD] p-3.5 shadow-[inset_0_0_0_1px_#D1D5DB] rounded-lg w-full text-black outline-none focus:shadow-[inset_0_0_0_2px_#F3066E] transition-all bg-gray-50"
                      {...register("confirmPassword", {
                        required: true,
                        validate: (val) =>
                          watch("password") === val || "পাসওয়ার্ড মিলছে না",
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
                    className="w-full bg-[#2D2D2D] text-white font-bold py-3.5 rounded-[10px] hover:bg-black transition-colors shadow-lg mt-2 disabled:opacity-50"
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

export default UnifiedAuthPage;
