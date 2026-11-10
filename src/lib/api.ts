import axios from "axios";
import { getAuth } from "firebase/auth";
import app from "./firebase"; // Ensure this path points to your initialized firebase app

// Use environment variable, fallback to localhost for development
const rawApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://chalakchampsbackend.vercel.app";

// Normalize the API prefix so origin-only environment values reach backend routes.
const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");
const apiBaseUrl = /\/api$/i.test(normalizedApiBaseUrl)
  ? normalizedApiBaseUrl
  : `${normalizedApiBaseUrl}/`;

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Public reads should not wait for Firebase auth or trigger an auth preflight.
export const publicApi = axios.create({
  baseURL: apiBaseUrl,
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

      if (token && !config.headers.Authorization) {
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
        const currentPath = window.location.pathname;
        if (!currentPath.endsWith("/signin")) {
          const locale = currentPath.split("/")[1] === "bn" ? "bn" : "en";
          window.location.href = `/${locale}/signin`;
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
