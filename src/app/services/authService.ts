import axiosInstance from "@/lib/axios";
import { User, UserCredential } from "firebase/auth";

// --- INTERFACES ---

export interface RegisterData {
  uid: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  role: string;
}

// --- AUTH SERVICES ---

// 1. Send Email Verification Code
export const sendEmailVerificationCode = async (email: string) => {
  const response = await axiosInstance.post("/auth/send-email-verification", {
    email,
  });
  return response.data;
};

// 2. Verify Email Code
export const verifyEmailCode = async (email: string, code: string) => {
  const response = await axiosInstance.post("/auth/verify-email-code", {
    email,
    code,
  });
  return response.data;
};

// 3. Send Phone Verification Code
export const sendPhoneVerificationCode = async (phoneNumber: string) => {
  const response = await axiosInstance.post("/auth/send-phone-verification", {
    phoneNumber,
  });
  return response.data;
};

// 4. Verify Phone Code
export const verifyPhoneCode = async (phoneNumber: string, code: string) => {
  const response = await axiosInstance.post("/auth/verify-phone-code", {
    phoneNumber,
    code,
  });
  return response.data;
};

// 5. Register User (After OTP verification or Firebase User creation)
export const registerUser = async (data: RegisterData) => {
  const response = await axiosInstance.post("/auth/register", {
    uid: data.uid, // Important: Required by backend
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    role: data.role || "student",
  });
  return response.data;
};

// 6. Login User (Backend/Password Flow)
export const loginUser = async (data: LoginData) => {
  const response = await axiosInstance.post("/auth/login", {
    email: data.email,
    password: data.password,
  });
  return response.data;
};

// 7. Get Current User Profile
export const getProfile = async () => {
  const response = await axiosInstance.get("/auth/profile");
  return response.data;
};

// 8. Verify Token (Sync with Backend)
export const verifyToken = async () => {
  const response = await axiosInstance.post("/auth/verify", {});
  return response.data;
};
