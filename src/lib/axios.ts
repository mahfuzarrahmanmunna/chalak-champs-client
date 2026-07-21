import axios, { RawAxiosRequestHeaders } from "axios";
import { getAuth } from "firebase/auth";
import app from "./firebase";

// FIX: Remove /api from the end. Point directly to the backend server root.
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apichalakchamps.vercel.app";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
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
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          config.headers = { Authorization: `Bearer ${token}` } as any;
        }
      } catch (error) {
        console.error("Error getting token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle common errors (e.g., 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid, user needs to re-authenticate
      // Note: Actual logout is handled by AuthContext when getProfile fails
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
