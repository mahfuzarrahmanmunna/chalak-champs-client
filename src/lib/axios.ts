// lib/axios.ts
import axios from "axios";
import { getAuth } from "firebase/auth";
import app from "./firebase";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"; // Adjust URL as needed

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Firebase ID Token
axiosInstance.interceptors.request.use(
  async (config) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user) {
      try {
        const token = await user.getIdToken(true); // Force refresh to ensure token is valid
        config.headers.Authorization = `Bearer ${token}`;
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
      // Optionally trigger a logout here if token is invalid
      console.error("Unauthorized access - logging out");
      // You might want to call a logout function from context here
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
