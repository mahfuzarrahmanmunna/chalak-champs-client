import axiosInstance from "@/lib/axios";

// --- TYPES ---

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  role: string;
}

export interface RegisterData {
  uid: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
}

// --- SERVICES ---

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

// 5. Register User
export const registerUser = async (data: RegisterData) => {
  console.log("[AuthService] Registering user with data:", data);

  // Payload Construction with Safety Checks
  const payload: any = {
    uid: data.uid,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role || "student",
  };

  // Handle Email: Convert empty string to undefined to prevent empty key error
  if (data.email && data.email.trim().length > 0) {
    payload.email = data.email.trim();
  } else {
    payload.email = undefined;
  }

  // Handle Phone: Convert empty string to undefined to prevent empty key error
  if (data.phoneNumber && data.phoneNumber.trim().length > 0) {
    payload.phoneNumber = data.phoneNumber.trim();
  } else {
    payload.phoneNumber = undefined;
  }

  console.log("[AuthService] Final Payload:", JSON.stringify(payload));

  const response = await axiosInstance.post("/auth/register", payload);
  return response.data;
};

// 6. Login User
export const loginUser = async (data: { email: string; password: string }) => {
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
