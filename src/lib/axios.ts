// src/lib/axios.ts
import axios from "axios";
import { getAuth } from "firebase/auth";
import app from "./firebase";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL,
});

// Request Interceptor: Attach Firebase ID Token or stored token
axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") return config;

    const authInstance = getAuth(app);
    const user = authInstance.currentUser;
    let token: string | null = null;

    if (user) {
      try {
        // Cached token; Firebase refreshes it automatically when it is about to expire.
        token = await user.getIdToken();
      } catch (error) {
        console.error("Error getting Firebase ID token:", error);
      }
    }

    if (!token && typeof window !== "undefined") {
      token = window.localStorage.getItem("token");
    }

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
