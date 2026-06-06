/// <reference types="vite/client" />
import axios, { type AxiosInstance } from "axios";
import { clearExpiredCache } from "./cacheService";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Clear expired cache on module load
clearExpiredCache();

// ---- Request Interceptor ----
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("trufin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ---- Response Interceptor ----
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED" || !error.response) {
      return Promise.reject(new Error("Network error. Please check your connection."));
    }

    if (error.response.status === 401) {
      localStorage.removeItem("trufin_token");
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      return Promise.reject(new Error("Session expired. Please log in again."));
    }

    if (error.response.status === 403) {
      return Promise.reject(new Error("Access denied. You do not have permission."));
    }

    if (error.response.status >= 500) {
      return Promise.reject(new Error("Server error. Please try again later."));
    }

    const message = error.response.data?.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default api;
