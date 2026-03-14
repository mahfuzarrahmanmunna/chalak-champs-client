import axios from "axios";
import { getAuth } from "firebase/auth"; // 1. Import this
import app from "./firebase";
// import { app } from "@/config/firebase"; // 2. Import your initialized firebase app (Check this path!)

const api = axios.create({
  // Your backend is at :5000, and your routes start with /api
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    // 3. Make this function async
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;

      if (user) {
        // 4. Get the fresh token from Firebase user
        const token = await user.getIdToken();
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error attaching token:", error);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized - Redirecting to login...");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
