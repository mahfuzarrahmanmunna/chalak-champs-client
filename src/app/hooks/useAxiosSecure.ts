// hooks/useAxiosSecure.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import { useEffect, useRef } from "react";
import useAuth from "./useAuth";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000, // Add timeout to prevent hanging requests
});

const useAxiosSecure = () => {
  const { user, loading, accessToken, signOut } = useAuth();
  const isRefreshing = useRef(false);

  useEffect(() => {
    // Request interceptor to add auth token
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor to handle auth errors
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !isRefreshing.current
        ) {
          isRefreshing.current = true;

          try {
            // Try to refresh the token
            if (user) {
              const newToken = await user.getIdToken(true);
              // Update the authorization header with the new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              isRefreshing.current = false;
              // Retry the original request with the new token
              return axiosInstance.request(originalRequest);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            isRefreshing.current = false;
            await signOut();
            return Promise.reject(error);
          }
        }
        // Handle 403 Forbidden errors
        else if (error.response?.status === 403) {
          console.error("Access forbidden:", error);
          await signOut();
        }
        // Handle network errors
        else if (error.code === "NETWORK_ERROR") {
          console.error("Network error:", error);
          // Don't sign out for network errors, just reject
          return Promise.reject(error);
        }

        return Promise.reject(error);
      },
    );

    // Cleanup function to remove interceptors when component unmounts
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, user, signOut]);

  return axiosInstance;
};

export default useAxiosSecure;
