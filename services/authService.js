import api from "../lib/api";

export const authService = {
  // Signup
  signup: async (userData) => {
    const response = await api.post("/auth/signup", userData);
    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  // Get current user
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put("/auth/profile", profileData);
    if (response.data.success) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put("/auth/change-password", passwordData);
    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token");
    }
    return false;
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === "admin";
  },
};
