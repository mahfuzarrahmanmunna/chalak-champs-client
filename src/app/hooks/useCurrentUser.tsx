// src/app/hooks/useCurrentUser.ts
import { useState, useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  User as FirebaseUser,
  getIdToken,
} from "firebase/auth";
// import { auth } from "@/lib/firebase";
import axios from "axios";
import { auth } from "@/lib/firebase";

interface CurrentUser {
  uid: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  role: string;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseCurrentUserReturn {
  currentUser: CurrentUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshToken: () => Promise<string>;
  updateProfile: (data: Partial<CurrentUser>) => Promise<CurrentUser>;
}

export const useCurrentUser = (): UseCurrentUserReturn => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data from backend
  const fetchUserData = useCallback(async (user: FirebaseUser) => {
    try {
      const token = await getIdToken(user);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setCurrentUser(response.data.user);
        setError(null);
      } else {
        throw new Error(response.data.message || "Failed to fetch user data");
      }
    } catch (err: unknown) {
      console.error("Error fetching user data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch user data",
      );
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh token
  const refreshToken = useCallback(async (): Promise<string> => {
    if (!firebaseUser) {
      throw new Error("No user logged in");
    }

    try {
      const token = await getIdToken(firebaseUser, true); // Force refresh
      return token;
    } catch (err: unknown) {
      console.error("Error refreshing token:", err);
      throw new Error("Failed to refresh token");
    }
  }, [firebaseUser]);

  // Update profile
  const updateProfile = useCallback(
    async (data: Partial<CurrentUser>): Promise<CurrentUser> => {
      if (!firebaseUser) {
        throw new Error("No user logged in");
      }

      try {
        const token = await getIdToken(firebaseUser);

        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.success) {
          setCurrentUser(response.data.user);
          console.log(response.data.user);
          return response.data.user;
        } else {
          throw new Error(response.data.message || "Failed to update profile");
        }
      } catch (err: unknown) {
        console.error("Error updating profile:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update profile",
        );
        throw err;
      }
    },
    [firebaseUser],
  );

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setFirebaseUser(user);

        if (user) {
          // User is authenticated
          await fetchUserData(user);
        } else {
          // User is not authenticated
          setCurrentUser(null);
          setError(null);
          setLoading(false);
        }
      },
      (authError) => {
        console.error("Auth state error:", authError);
        setError(authError.message);
        setFirebaseUser(null);
        setCurrentUser(null);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [fetchUserData]);

  return {
    currentUser,
    firebaseUser,
    loading,
    error,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === "admin",
    refreshToken,
    updateProfile,
  };
};
