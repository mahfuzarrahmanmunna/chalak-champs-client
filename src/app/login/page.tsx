"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import api from "@/lib/api";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState<string>(""); // email or phone
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [step, setStep] = useState<number>(1); // 1: enter credentials, 2: verify OTP
  const [verificationCode, setVerificationCode] = useState<string>("");
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    return /^\+?[0-9]{10,15}$/.test(phone);
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!identifier) {
      setError("Please enter your email address or phone number");
      return;
    }

    const isEmail = validateEmail(identifier);
    const isPhone = validatePhoneNumber(identifier);

    if (!isEmail && !isPhone) {
      setError("Please enter a valid email address or phone number");
      return;
    }

    if (isEmail && !password) {
      setError("Please enter your password");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const isEmail = validateEmail(identifier);
      const isPhone = validatePhoneNumber(identifier);

      if (isEmail) {
        // Email login with Firebase
        const userCredential = await signInWithEmailAndPassword(
          auth,
          identifier,
          password,
        );

        // Get ID token
        const idToken = await userCredential.user.getIdToken();

        // Store the token directly
        localStorage.setItem("token", idToken);

        // Redirect to dashboard
        router.push("/dashboard");
      } else if (isPhone) {
        // Phone login - send verification code
        const response = await api.post("/auth/send-phone-verification", {
          phoneNumber: identifier,
        });

        if (response.data.success) {
          setStep(2);
        } else {
          setError(response.data.message || "Failed to send verification code");
        }
      }
    } catch (error: any) {
      console.error("Login failed:", error);

      if (error.code === "auth/user-not-found") {
        setError("User not found. Please check your credentials.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed login attempts. Please try again later.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhoneCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/verify-phone-code", {
        phoneNumber: identifier,
        code: verificationCode,
      });

      if (response.data.success && response.data.token) {
        // Store the token from the response
        localStorage.setItem("token", response.data.token);
        router.push("/dashboard");
      } else {
        setError(response.data.message || "Invalid verification code");
      }
    } catch (error: unknown) {
      console.error("Verification failed:", error);
      setError(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/send-phone-verification", {
        phoneNumber: identifier,
      });

      if (!response.data.success) {
        setError(response.data.message || "Failed to resend verification code");
      }
    } catch (error: unknown) {
      console.error("Failed to resend code:", error);
      setError(
        error instanceof Error ? error.message : "Failed to resend code",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
          alt="Language learning"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgb(243,6,110)] to-[rgb(33,65,135)] opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Chalak Champs
            </h1>
            <p className="text-xl max-w-md">
              Learn new languages with expert instructors from around the world
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="mt-2 text-gray-600">
              {step === 1
                ? "Enter your email or phone number to continue"
                : "Enter the verification code sent to your phone"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="identifier"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email address or phone number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      id="identifier"
                      name="identifier"
                      type="text"
                      autoComplete="email"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className={`pl-10 block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="you@example.com or +8801XXXXXXX"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    You can sign in using either your email address or your
                    phone number (include country code, e.g., +880).
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password (for email login)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
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
                    "Sign In"
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Do not have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
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
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={`block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter 6-digit code"
                />
              </div>

              <div>
                <button
                  onClick={verifyPhoneCode}
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
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
                    "Verify"
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendCode}
                  disabled={isLoading}
                  className="text-sm text-indigo-600 hover:text-indigo-500 disabled:text-gray-400"
                >
                  Didn&apos;t receive the code? Resend
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
