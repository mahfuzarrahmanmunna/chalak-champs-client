// hooks/useAuth.ts
import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    accessToken: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const token = await user.getIdToken();
          setAuthState({
            user,
            loading: false,
            accessToken: token,
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            accessToken: null,
          });
        }
      } catch (error) {
        console.error("Error getting auth token:", error);
        setAuthState({
          user: null,
          loading: false,
          accessToken: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // The onAuthStateChanged listener will handle updating the state
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return {
    ...authState,
    signOut,
  };
};

export default useAuth;
