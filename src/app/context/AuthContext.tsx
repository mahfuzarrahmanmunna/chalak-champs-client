"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  onAuthStateChanged,
  User as FirebaseUser,
  ConfirmationResult,
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

// --- Types ---

interface AppUser {
  uid: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
  role: "student" | "teacher" | "admin";
}

/**
 * Controls post-authentication navigation behavior.
 *
 * - `redirect: true`  (default) → navigate to /dashboard
 * - `redirect: false`             → stay on current page, do nothing
 * - `redirect: "/custom-path"`   → navigate to that specific path
 * - `onSuccess`                  → callback fired after auth + DB sync complete
 */
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
  sendOtpPhone: (phone: string, recaptchaContainer: string) => Promise<void>;
  checkOtpPhone: (phone: string, code: string) => Promise<void>;

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

// --- Centralized Redirect Handler ---
// NOTE: This default is a plain path. Components that need language-prefixed
// paths (like AuthPage) should pass `redirect: false` and handle routing themselves
// using `getLink()` from LanguageContext.
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
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

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
  const normalizePhoneToEmail = (phone: string) => {
    const clean = phone.replace(/[^0-9]/g, "");
    return `${clean}@langual-academy.com`;
  };

  // --- Helper: Setup Recaptcha ---
  const setupRecaptcha = (container: string) => {
    if (typeof window === "undefined") return null;
    try {
      return new RecaptchaVerifier(auth, container, { size: "invisible" });
    } catch (error) {
      console.error("Recaptcha error", error);
      return null;
    }
  };

  // --- Helper: Fetch profile after auth state change ---
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

    // Wait a short period then refresh the app user from backend and return it
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

  // --- Custom OTP: Phone Flow ---
  const sendOtpPhone = async (phone: string, container: string) => {
    const recaptchaVerifier = setupRecaptcha(container);
    if (!recaptchaVerifier) throw new Error("Recaptcha failed");

    confirmationResultRef.current = await signInWithPhoneNumber(
      auth,
      phone,
      recaptchaVerifier,
    );
  };

  const checkOtpPhone = async (phone: string, code: string) => {
    if (!confirmationResultRef.current) {
      throw new Error("No confirmation result available");
    }
    await confirmationResultRef.current.confirm(code);
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

    if (data.method === "email" && data.emailOrPhone && data.password) {
      const cred = await createUserWithEmailAndPassword(
        auth!,
        data.emailOrPhone,
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
        email: firebaseUser.email || undefined,
        phoneNumber: firebaseUser.phoneNumber || undefined,
        role: "student",
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
        sendOtpPhone,
        checkOtpPhone,
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
      sendOtpPhone: async () => {},
      checkOtpPhone: async () => {},
      completeRegistration: async () => {},
    };
    return fallback;
  }

  return context;
};
