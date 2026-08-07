// src/lib/axios.ts

import axios from "axios";
import { getAuth } from "firebase/auth";
import app from "./firebase";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apichalakchamps.vercel.app";

const axiosInstance = axios.create({
  baseURL,
  // ✅ FIX: REMOVED global Content-Type header.
  // Axios is smart enough to set "application/json" automatically
  // when you pass a plain object, and it will leave FormData alone
  // so the browser can set the multipart boundary correctly.
});

// Request Interceptor: Attach Firebase ID Token
axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") return config;

    const authInstance = getAuth(app);
    const user = authInstance.currentUser;

    if (user) {
      try {
        const token = await user.getIdToken(true);
        config.headers.set("Authorization", `Bearer ${token}`);
      } catch (error) {
        console.error("Error getting token:", error);
      }
    }

    // ✅ EXTRA SAFETY: If we are sending FormData, forcefully delete
    // any Content-Type header so the browser sets the boundary correctly.
    if (config.data instanceof FormData) {
      config.headers.delete("Content-Type");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handled by AuthContext
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
