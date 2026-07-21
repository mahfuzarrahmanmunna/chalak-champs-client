import axios from "axios";
import { getAuth } from "firebase/auth"; // 1. Import this
import app from "./firebase";
// import { app } from "@/config/firebase"; // 2. Import your initialized firebase app (Check this path!)

const rawApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://apichalakchamps.vercel.app/api";

const apiBaseUrl = rawApiBaseUrl.endsWith("/api")
  ? rawApiBaseUrl.replace(/\/+$/, "")
  : rawApiBaseUrl.replace(/\/+$/, "") + "/api";

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
