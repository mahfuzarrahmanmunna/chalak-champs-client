// app/verify/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/FirebaseProvider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import api from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    } else if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendVerificationCode = async () => {
    if (!user) return;

    setIsSendingCode(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/auth/send-email-verification", {
        email: user.email,
      });

      if (response.data.success) {
        setMessage("Verification code sent to your email");
        setCountdown(60);
      } else {
        setError(response.data.message || "Failed to send verification code");
      }
    } catch (error: any) {
      console.error("Error sending verification code:", error);
      setError(error.message || "Failed to send verification code");
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyCode = async () => {
    if (!user) return;

    setIsVerifying(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/auth/verify-email-code", {
        email: user.email,
        code: verificationCode,
      });

      if (response.data.success) {
        setMessage("Email verified successfully!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setError(response.data.message || "Invalid verification code");
      }
    } catch (error: any) {
      console.error("Error verifying code:", error);
      setError(error.message || "Invalid verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80"
          alt="Email verification"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0  bg-gradient-to-r from-[rgb(243,6,110)] to-[rgb(33,65,135)] opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Verify Your Email</h1>
            <p className="text-xl max-w-md">
              Complete your registration by verifying your email address
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Verification Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Verify Your Email
            </h2>
            <p className="mt-2 text-gray-600">
              We have sent a verification code to your email
            </p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                readOnly
                className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700"
              />
            </div>

            <div>
              <label
                htmlFor="verificationCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Verification Code
              </label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter 6-digit code"
              />
            </div>

            <div>
              <button
                onClick={verifyCode}
                disabled={isVerifying || !verificationCode}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isVerifying ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Verify Code"
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={sendVerificationCode}
                disabled={countdown > 0 || isSendingCode}
                className="text-sm text-indigo-600 hover:text-indigo-500 disabled:text-gray-400"
              >
                {countdown > 0
                  ? `Resend code in ${countdown}s`
                  : isSendingCode
                    ? "Sending..."
                    : "Didn't receive the code? Resend"}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-gray-500"
              >
                Sign out
              </button>
              <Link
                href="/dashboard"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Skip for now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
