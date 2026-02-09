"use client";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  ConfirmationResult,
  User,
  UserCredential,
  RecaptchaVerifier,
  updateProfile,
  deleteUser,
} from "firebase/auth";
import { auth, setupRecaptcha } from "@/lib/firebase";
import api from "@/lib/api";
import useAxiosSecure from "../hooks/useAxiosSecure";
// import useAxiosSecure from "@/hooks/useAxiosSecure";

// Define interfaces for TypeScript
interface FormData {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  verification?: string;
  registration?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  token?: string;
}

export default function RegisterPage() {
  const [step, setStep] = useState<number>(1);
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("email"); // Default to email
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSendingCode, setIsSendingCode] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isAuthReady && step === 2 && authMethod === "phone") {
      if (!recaptchaContainerRef.current) {
        console.error("reCAPTCHA container element not found.");
        return;
      }

      try {
        const verifier = setupRecaptcha(recaptchaContainerRef.current);
        if (verifier) {
          setRecaptchaVerifier(verifier);
          console.log("reCAPTCHA verifier set up successfully");
        }
      } catch (error) {
        console.error("Error initializing reCAPTCHA:", error);
        setErrors({
          verification:
            "Failed to initialize reCAPTCHA. Please refresh the page.",
        });
      }
    }
  }, [step, authMethod, isAuthReady]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleAuthMethodSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (authMethod === "phone") {
      if (phoneNumber.trim() === "") {
        setErrors({ phone: "Phone number is required" });
        return;
      }
      // Basic phone number validation
      if (!/^\+?[0-9]{10,15}$/.test(phoneNumber.replace(/\s/g, ""))) {
        setErrors({ phone: "Please enter a valid phone number" });
        return;
      }
      setErrors({});
      setStep(2);
    } else {
      if (email.trim() === "") {
        setErrors({ email: "Email is required" });
        return;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setErrors({ email: "Email is invalid" });
        return;
      }
      setErrors({});
      setStep(2);
    }
  };

  const sendVerificationCode = async () => {
    setIsSendingCode(true);
    setErrors({});

    try {
      if (authMethod === "phone") {
        if (!recaptchaVerifier) {
          throw new Error("reCAPTCHA not initialized");
        }

        // Format phone number with country code if not provided
        const formattedPhone = phoneNumber.startsWith("+")
          ? phoneNumber
          : `+880${phoneNumber}`;

        const confirmation = await signInWithPhoneNumber(
          auth,
          formattedPhone,
          recaptchaVerifier,
        );

        setConfirmationResult(confirmation);
        setStep(3);
        setCountdown(60);
      } else {
        const response = await api.post<ApiResponse>(
          "/auth/send-email-verification",
          {
            email,
          },
        );
        if (response.data.success) {
          setStep(3);
          setCountdown(60);
        } else {
          setErrors({
            verification:
              response.data.message || "Failed to send verification code",
          });
        }
      }
    } catch (error: any) {
      console.error("Error sending verification code:", error);
      let errorMessage = "Failed to send verification code";

      if (authMethod === "phone") {
        if (error.code === "auth/invalid-phone-number") {
          errorMessage = "Invalid phone number format";
        } else if (error.code === "auth/too-many-requests") {
          errorMessage = "Too many requests. Please try again later";
        } else if (error.code === "auth/quota-exceeded") {
          errorMessage =
            "SMS quota exceeded. Please try email verification instead";
        } else {
          errorMessage =
            error.message || "Failed to send SMS verification code";
        }
      } else {
        errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to send email verification code";
      }

      setErrors({ verification: errorMessage });
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyCode = async () => {
    setIsVerifying(true);
    setErrors({});

    try {
      if (authMethod === "phone") {
        if (confirmationResult) {
          const result = await confirmationResult.confirm(verificationCode);
          console.log("Phone verification successful", result.user);
          setStep(4);
        } else {
          throw new Error("No confirmation result available");
        }
      } else {
        const response = await api.post<ApiResponse>(
          "/auth/verify-email-code",
          {
            email,
            code: verificationCode,
          },
        );
        if (response.data.success) {
          setStep(4);
        } else {
          setErrors({
            verification: response.data.message || "Invalid verification code",
          });
        }
      }
    } catch (error: any) {
      console.error("Error verifying code:", error);
      let errorMessage = "Invalid verification code";

      if (
        authMethod === "phone" &&
        error.code === "auth/invalid-verification-code"
      ) {
        errorMessage = "Invalid verification code. Please try again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ verification: errorMessage });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // In your handleFinalSubmit function
  const handleFinalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsRegistering(true);
    setErrors({}); // Clear previous errors

    let userCredential: UserCredential | null = null;
    let registrationSuccessful = false;

    try {
      // Step 1: Create user in Firebase
      if (authMethod === "phone") {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error("No authenticated user found");
        }
        userCredential = { user: currentUser } as UserCredential;
      } else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          formData.password,
        );
      }

      // Step 2: Update user profile in Firebase (optional)
      try {
        await updateProfile(userCredential.user, {
          displayName: `${formData.firstName} ${formData.lastName}`,
        });
      } catch (profileError) {
        console.warn("Could not update profile in Firebase:", profileError);
      }

      // Step 3: Get ID token
      const idToken = await userCredential.user.getIdToken();

      // Step 4: Prepare user data for backend
      const userData = {
        uid: userCredential.user.uid,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: authMethod === "email" ? email.toLowerCase().trim() : null,
        phoneNumber: authMethod === "phone" ? phoneNumber.trim() : null,
        role: "student",
      };

      // Step 5: Register user with backend with retry logic
      let response;
      try {
        response = await axiosSecure.post<ApiResponse>(
          "/auth/register",
          userData,
        );
      } catch (error: any) {
        // If it's a network error, try once more
        if (
          error.code === "NETWORK_ERROR" ||
          error.message === "Network Error"
        ) {
          console.log("Network error, retrying...");
          response = await axiosSecure.post<ApiResponse>(
            "/auth/register",
            userData,
          );
        } else {
          throw error;
        }
      }

      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        registrationSuccessful = true;
        router.push("/dashboard");
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Error during registration:", error);

      // If registration failed, clean up the Firebase user
      if (userCredential && !registrationSuccessful) {
        try {
          await deleteUser(userCredential.user);
          console.log("Cleaned up Firebase user due to registration failure");
        } catch (deleteError) {
          console.error("Failed to clean up Firebase user:", deleteError);
        }
      }

      let errorMessage = "Registration failed";

      // Handle specific Firebase errors
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      } else if (error.code === "auth/quota-exceeded") {
        errorMessage = "Too many registration attempts. Please try again later";
      } else if (
        error.response?.status === 400 &&
        error.response?.data?.message
      ) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please try again.";
      } else if (
        error.code === "NETWORK_ERROR" ||
        error.message === "Network Error"
      ) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ registration: errorMessage });
    } finally {
      setIsRegistering(false);
    }
  };

  const resendCode = async () => {
    if (countdown > 0) return;
    await sendVerificationCode();
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80"
          alt="Language learning"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0  bg-gradient-to-r from-[rgb(243,6,110)] to-[rgb(33,65,135)] opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Join Chalak Champs</h1>
            <p className="text-xl max-w-md">
              Start your language learning journey with us today
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-600">
              {step === 1 && "Choose your verification method"}
              {step === 2 && "Verify your contact information"}
              {step === 3 && "Enter the verification code"}
              {step === 4 && "Complete your profile information"}
            </p>

            {/* Progress indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <div
                  className={`w-16 h-1 ${
                    step >= 2 ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <div
                  className={`w-16 h-1 ${
                    step >= 3 ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 3
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  3
                </div>
                <div
                  className={`w-16 h-1 ${
                    step >= 4 ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 4
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  4
                </div>
              </div>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handleAuthMethodSubmit} className="space-y-6">
              <div>
                <div className="flex mb-4">
                  <button
                    type="button"
                    onClick={() => setAuthMethod("phone")}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md ${
                      authMethod === "phone"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Phone Number
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod("email")}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md ${
                      authMethod === "email"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Email
                  </button>
                </div>

                {authMethod === "phone" ? (
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className={`pl-10 block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="+880 1XXX XXXXXX"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Include country code (e.g., +880 for Bangladesh)
                    </p>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
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
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-10 block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Next
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      We will send a verification code to{" "}
                      {authMethod === "phone" ? phoneNumber : email}. Please
                      make sure you have access to this{" "}
                      {authMethod === "phone"
                        ? "phone number"
                        : "email address"}
                      .
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={sendVerificationCode}
                  disabled={isSendingCode}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSendingCode ? (
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
                    "Send Verification Code"
                  )}
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

              {errors.verification && (
                <div className="bg-red-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {errors.verification}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* reCAPTCHA container for phone verification */}
              {authMethod === "phone" && (
                <div
                  id="recaptcha-container"
                  ref={recaptchaContainerRef}
                  className="hidden"
                ></div>
              )}
            </div>
          )}

          {step === 3 && (
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
                    errors.verification ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter 6-digit code"
                />
                {errors.verification && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.verification}
                  </p>
                )}
              </div>

              <div>
                <button
                  onClick={verifyCode}
                  disabled={isVerifying}
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
                  onClick={resendCode}
                  disabled={countdown > 0}
                  className="text-sm text-indigo-600 hover:text-indigo-500 disabled:text-gray-400"
                >
                  {countdown > 0
                    ? `Resend code in ${countdown}s`
                    : "Didn't receive the code? Resend"}
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Only show password fields for email authentication */}
              {authMethod === "email" && (
                <>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="flex items-center">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-500">
                    Terms and Conditions
                  </a>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.agreeToTerms}
                </p>
              )}

              {errors.registration && (
                <div className="bg-red-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {errors.registration}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRegistering ? (
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
                    "Create Account"
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
