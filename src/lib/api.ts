import axios from "axios";
import { getAuth } from "firebase/auth";
import app from "./firebase"; // Ensure this path points to your initialized firebase app

// Use environment variable, fallback to localhost for development
const rawApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// Clean up trailing slashes to prevent // in URLs
const apiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const auth = getAuth(app);
      let token: string | null = null;
      const user = auth.currentUser;

      if (user) {
        token = await user.getIdToken();
      } else if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }

      if (token) {
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
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
