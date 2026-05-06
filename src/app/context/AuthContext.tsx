"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
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

// Define User Type (Matches your Backend IUser)
interface AppUser {
  uid: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  role: "student" | "teacher" | "admin";
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  appUser: AppUser | null; // The user from MongoDB
  loading: boolean;
  // Email/Password Flow
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithPhone: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // OTP Flows
  sendOtpEmail: (email: string) => Promise<void>;
  checkOtpEmail: (email: string, code: string) => Promise<void>;
  sendOtpPhone: (phone: string, recaptchaContainer: string) => Promise<void>;
  checkOtpPhone: (phone: string, code: string) => Promise<void>;

  // signInWithEmail: (email: string, password: string) => Promise<void>;
  // signInWithPhone: (phone: string, password: string) => Promise<void>;
  // Final Step
  completeRegistration: (data: {
    firstName: string;
    lastName: string;
    password?: string;
    emailOrPhone?: string;
    method?: "email" | "phone";
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 2. Sync Firebase State with Backend
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // Fetch the full user profile from MongoDB
          // This passes the Firebase Token automatically via axios interceptor
          const res = await getProfile();
          setAppUser(res.user);
        } catch (err) {
          console.log("User not yet registered in backend DB:", err);
          setAppUser(null);
        }
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  console.log("AuthProvider rendered. Current Firebase User:", currentUser);

  // --- Helper: Convert Phone to Email Alias ---
  // This allows "Phone + Password" login to work on Firebase Email/Password Auth
  const normalizePhoneToEmail = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    return `${cleanPhone}@langual-academy.com`;
  };

  // 1. Initialize Recaptcha for Phone Auth
  const setupRecaptcha = (container: string) => {
    if (typeof window === "undefined") return null;
    try {
      return new RecaptchaVerifier(auth, container, {
        size: "invisible",
      });
    } catch (error) {
      console.error("Recaptcha error", error);
      return null;
    }
  };

  // 3. Standard Login (Internal)
  const login = async (email: string, password: string) => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);

    // The useEffect will trigger getProfile() to sync DB automatically
    router.push("/dashboard");
  };

  // 4. Specific Login Functions for SignInPage
  const signInWithEmail = async (email: string, password: string) => {
    await login(email, password);
  };

  const signInWithPhone = async (phone: string, password: string) => {
    // To login with Phone + Password, we treat it as an email alias
    const emailAlias = normalizePhoneToEmail(phone);
    await login(emailAlias, password);
  };

  // 5. Logout
  const logout = async () => {
    await signOut(auth);
    setAppUser(null);
    router.push("/");
  };

  // 6. Email/Password Registration (Direct)
  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Update Firebase Profile
    await updateProfile(cred.user, { displayName: `${firstName} ${lastName}` });

    // Register in MongoDB
    await registerUser({
      uid: cred.user.uid,
      firstName,
      lastName,
      email: cred.user.email || undefined,
      role: "student",
    });

    router.push("/dashboard");
  };

  // 7. Custom OTP: Email Flow
  const sendOtpEmail = async (email: string) => {
    await sendEmailVerificationCode(email);
  };

  const checkOtpEmail = async (email: string, code: string) => {
    await verifyEmailCode(email, code);
    // OTP Verified. Next step is to collect Name/Password and create Firebase User.
  };

  // 8. Custom OTP: Phone Flow
  const confirmationResultRef = React.useRef<ConfirmationResult | null>(null);

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
    // Firebase Phone Auth Successful. User is logged in to Firebase.
    // Next step: Register in MongoDB.
  };

  // 9. Final Registration Step (Called after OTP is verified and Name/Pass is collected)
  const completeRegistration = async (data: {
    firstName: string;
    lastName: string;
    password?: string;
    emailOrPhone?: string;
    method?: "email" | "phone";
  }) => {
    let firebaseUser = auth?.currentUser || currentUser;

    // A. If Email Method, we need to create Firebase User here (since OTP was just validation)
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
    // B. If Phone Method, Firebase User is already signed in via OTP confirmation

    if (firebaseUser) {
      // Register in MongoDB
      await registerUser({
        uid: firebaseUser.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: firebaseUser.email || undefined,
        phoneNumber: firebaseUser.phoneNumber || undefined,
        role: "student",
      });

      router.push("/dashboard");
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
        signUp,
        login,
        // signInWithEmail,
        // signInWithPhone,
        logout,
        sendOtpEmail,
        checkOtpEmail,
        sendOtpPhone,
        checkOtpPhone,
        completeRegistration,
        signInWithEmail,
        signInWithPhone,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // During build time or SSR, return a safe default
    return {
      currentUser: null,
      appUser: null,
      loading: true,
      signUp: async () => {},
      login: async () => {},
      signInWithEmail: async () => {},
      signInWithPhone: async () => {},
      logout: async () => {},
      sendOtpEmail: async () => {},
      checkOtpEmail: async () => {},
      sendOtpPhone: async () => {},
      checkOtpPhone: async () => {},
      completeRegistration: async () => {},
    };
  }
  return context;
};
