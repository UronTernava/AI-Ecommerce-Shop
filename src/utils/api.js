import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem("token");
      window.location.href = "/login?session=expired";
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network Error:", error);
      throw new Error("Network error. Please check your connection.");
    }

    // Throw error with message from backend
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(errorMessage);
  }
);

export const authApi = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (email) => {
    try {
      const response = await api.post("/auth/reset-password", { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  validateToken: async () => {
    try {
      const response = await api.get("/auth/validate");
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  },
};

export const userApi = {
  getProfile: async () => {
    try {
      const response = await api.get("/users/profile");
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put("/users/profile", userData);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export default api;
