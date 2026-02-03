// lib/api.ts
import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Create a typed axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  // Use the more specific InternalAxiosRequestConfig type
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        // The 'headers' property is guaranteed to exist on InternalAxiosRequestConfig
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return config;
  },
  // Type the error as AxiosError and the return as a rejected promise
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  // Type the error as AxiosError and the return as a rejected promise
  (error: AxiosError): Promise<never> => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Use window.location.replace for a more robust redirect
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
