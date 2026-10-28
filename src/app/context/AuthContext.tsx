"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  getProfile,
  registerUser,
  sendEmailVerificationCode,
  verifyEmailCode,
} from "../services/authService";
import { pushTrackingEvent } from "@/lib/trackingSettings";

// --- Types ---

interface AppUser {
  uid: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
  profileImageUrl?: string;
  role: "student" | "teacher" | "admin";
}

interface AuthOptions {
  redirect?: boolean | string;
  onSuccess?: () => void;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  isAdmin: boolean;

  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    options?: AuthOptions,
  ) => Promise<void>;

  login: (
    email: string,
    password: string,
    options?: AuthOptions,
  ) => Promise<AppUser | null>;

  signInWithEmail: (
    email: string,
    password: string,
    options?: AuthOptions,
  ) => Promise<AppUser | null>;

  signInWithPhone: (
    phone: string,
    password: string,
    options?: AuthOptions,
  ) => Promise<AppUser | null>;

  logout: (options?: AuthOptions) => Promise<void>;

  sendOtpEmail: (email: string) => Promise<void>;
  checkOtpEmail: (email: string, code: string) => Promise<void>;

  completeRegistration: (
    data: {
      firstName: string;
      lastName: string;
      password?: string;
      emailOrPhone?: string;
      method?: "email" | "phone";
    },
    options?: AuthOptions,
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_REDIRECT = "/dashboard";

function resolveRedirect(options?: AuthOptions): string | null {
  if (options?.redirect === false) return null;
  if (typeof options?.redirect === "string") return options.redirect;
  return DEFAULT_REDIRECT;
}

// --- Provider ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- Sync Firebase ↔ Backend ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const res = await getProfile();
          setAppUser(res.user);
        } catch {
          setAppUser(null);
        }
      } else {
        setAppUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // --- Helper: Phone → Email Alias ---
  // Converts 01XXXXXXXXX to 01XXXXXXXXX@chalakchamps.com for Firebase Auth
  const normalizePhoneToEmail = (phone: string) => {
    const clean = phone.replace(/[^0-9]/g, "");
    return `${clean}@chalakchamps.com`;
  };

  const refreshAppUser = useCallback(async (): Promise<AppUser | null> => {
    try {
      const res = await getProfile();
      setAppUser(res.user);
      return res.user;
    } catch {
      setAppUser(null);
      return null;
    }
  }, []);

  // --- Core Login (internal) ---
  const login = async (
    email: string,
    password: string,
    options?: AuthOptions,
  ): Promise<AppUser | null> => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);

    await new Promise((resolve) => setTimeout(resolve, 300));
    const loggedInUser = await refreshAppUser();

    options?.onSuccess?.();

    const destination = resolveRedirect(options);
    if (destination) {
      router.push(destination);
    }

    return loggedInUser;
  };

  // --- Specific Login Wrappers ---
  const signInWithEmail = async (
    email: string,
    password: string,
    options?: AuthOptions,
  ): Promise<AppUser | null> => {
    return await login(email, password, options);
  };

  const signInWithPhone = async (
    phone: string,
    password: string,
    options?: AuthOptions,
  ): Promise<AppUser | null> => {
    const emailAlias = normalizePhoneToEmail(phone);
    return await login(emailAlias, password, options);
  };

  // --- Logout ---
  const logout = async (options?: AuthOptions) => {
    await signOut(auth);
    setAppUser(null);

    options?.onSuccess?.();

    const destination = resolveRedirect(options);
    if (destination) {
      router.push(destination);
    }
  };

  // --- Email/Password Registration (Direct) ---
  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    options?: AuthOptions,
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, {
      displayName: `${firstName} ${lastName}`,
    });

    await registerUser({
      uid: cred.user.uid,
      firstName,
      lastName,
      email: cred.user.email || undefined,
      role: "student",
    });
    pushTrackingEvent("sign_up", { method: "email" });

    await refreshAppUser();

    options?.onSuccess?.();

    const destination = resolveRedirect(options);
    if (destination) {
      router.push(destination);
    }
  };

  // --- Custom OTP: Email Flow ---
  const sendOtpEmail = async (email: string) => {
    await sendEmailVerificationCode(email);
  };

  const checkOtpEmail = async (email: string, code: string) => {
    await verifyEmailCode(email, code);
  };

  // --- Final Registration Step (after OTP verified) ---
  const completeRegistration = async (
    data: {
      firstName: string;
      lastName: string;
      password?: string;
      emailOrPhone?: string;
      method?: "email" | "phone";
    },
    options?: AuthOptions,
  ) => {
    let firebaseUser = auth?.currentUser || currentUser;
    let emailForFirebase = data.emailOrPhone;
    let phoneForDb: string | undefined = undefined;

    // If registering with phone, convert to dummy email for Firebase
    if (data.method === "phone" && data.emailOrPhone) {
      emailForFirebase = normalizePhoneToEmail(data.emailOrPhone);
      phoneForDb = data.emailOrPhone; // Keep real phone for MongoDB
    }

    if (emailForFirebase && data.password) {
      const cred = await createUserWithEmailAndPassword(
        auth!,
        emailForFirebase,
        data.password,
      );
      await updateProfile(cred.user, {
        displayName: `${data.firstName} ${data.lastName}`,
      });
      firebaseUser = cred.user;
    }

    if (firebaseUser) {
      await registerUser({
        uid: firebaseUser.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: emailForFirebase, // Stores dummy email for phone users
        phoneNumber: phoneForDb, // Stores real phone number
        role: "student",
      });
      pushTrackingEvent("sign_up", {
        method: data.method || "email",
      });

      await refreshAppUser();

      options?.onSuccess?.();

      const destination = resolveRedirect(options);
      if (destination) {
        router.push(destination);
      }
    } else {
      throw new Error("Firebase authentication failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        appUser,
        loading,
        isAdmin: Boolean(appUser?.role === "admin"),
        signUp,
        login,
        signInWithEmail,
        signInWithPhone,
        logout,
        sendOtpEmail,
        checkOtpEmail,
        completeRegistration,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    const fallback: AuthContextType = {
      currentUser: null,
      appUser: null,
      loading: true,
      isAdmin: false,
      signUp: async () => {},
      login: async () => null,
      signInWithEmail: async () => null,
      signInWithPhone: async () => null,
      logout: async () => {},
      sendOtpEmail: async () => {},
      checkOtpEmail: async () => {},
      completeRegistration: async () => {},
    };
    return fallback;
  }

  return context;
};