import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("trufin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`[API] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED" || !error.response) {
      console.error("[API] Network error – no response from server");
      return Promise.reject(new Error("Network error. Please check your connection."));
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("trufin_token");
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      return Promise.reject(new Error("Session expired. Please log in again."));
    }

    if (error.response?.status === 403) {
      return Promise.reject(new Error("Access denied. You do not have permission."));
    }

    if (error.response?.status >= 500) {
      console.error("[API] Server error:", error.response.status);
      return Promise.reject(new Error("Server error. Please try again later."));
    }

    const message = error.response?.data?.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default api;
