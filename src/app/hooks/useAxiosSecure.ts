import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { useEffect, useRef } from "react";
import useAuth from "./useAuth";

// Create the Axios instance once
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://chalakchampsbackend.vercel.app/api", // Ensure this matches your backend URL
  withCredentials: true,
  timeout: 10000,
});

// Extend the config to add a custom flag for retries
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  __isRetry?: boolean;
}

const useAxiosSecure = () => {
  const { user, loading, accessToken, signOut } = useAuth();
  const isRefreshing = useRef(false);

  useEffect(() => {
    // 1. Request Interceptor
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        // Attach token to headers if available
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // 2. Response Interceptor
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // --- HANDLE 401 UNAUTHORIZED ---
        // We only retry if:
        // 1. Status is 401
        // 2. There is an original request
        // 3. We are not already refreshing the token
        // 4. This request has not already been retried (__isRetry check prevents infinite loops)
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !isRefreshing.current &&
          !originalRequest.__isRetry
        ) {
          isRefreshing.current = true;

          try {
            // Use Firebase to refresh the token
            if (user) {
              const newToken = await user.getIdToken(true);

              // Update the authorization header with the new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;

              // Mark this request as a retry
              originalRequest.__isRetry = true;

              isRefreshing.current = false;

              // Retry the original request with the new token
              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            isRefreshing.current = false;
            // If refresh fails, sign the user out
            await signOut();
            return Promise.reject(error);
          }
        }

        // --- HANDLE 403 FORBIDDEN ---
        else if (error.response?.status === 403) {
          console.error("Access forbidden:", error);
          await signOut();
          return Promise.reject(error);
        }

        // --- HANDLE NETWORK ERRORS ---
        else if (error.code === "NETWORK_ERROR") {
          console.error("Network error:", error);
          // Do not sign out for network errors (user might just be offline)
          return Promise.reject(error);
        }

        return Promise.reject(error);
      },
    );

    // Cleanup: Remove interceptors when component unmounts
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, user, signOut]); // Dependencies: Re-run if token or user changes

  return axiosInstance;
};

export default useAxiosSecure;
