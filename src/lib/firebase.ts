// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, Auth, RecaptchaVerifier, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics"; // Import Analytics type

// Define the Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

// Firebase configuration from environment variables
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// Check if all required config values are present
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "Firebase configuration is incomplete. Check your environment variables.",
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
// Fix: Add type annotation and handle the undefined case
export let analytics: Analytics | undefined = undefined;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Extend the Window interface to include recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

// Setup reCAPTCHA verifier
export const setupRecaptcha = (
  container: string | HTMLElement,
): RecaptchaVerifier | null => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") return null;

  // Clear any existing verifier
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
  }

  try {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, container, {
      size: "invisible",
      callback: (response: string) => {
        console.log("reCAPTCHA solved, can proceed with sign in.");
      },
      "expired-callback": () => {
        console.error("reCAPTCHA expired. Please try again.");
      },
    });

    return window.recaptchaVerifier;
  } catch (error) {
    console.error("Error setting up reCAPTCHA:", error);
    return null;
  }
};

// Export the updateProfile function for use in components
export { updateProfile };

export default app;
