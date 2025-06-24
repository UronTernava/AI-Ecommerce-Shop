import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, userApi } from "../../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authApi.validateToken();
          setUser(response.user);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem("token");
          setError("Session expired. Please login again.");
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authApi.login(email, password);
      localStorage.setItem("token", response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      navigate("/");
      return true;
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authApi.register(userData);
      localStorage.setItem("token", response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      navigate("/");
      return true;
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      await authApi.resetPassword(email);
      return true;
    } catch (err) {
      setError(err.message || "Password reset failed. Please try again.");
      return false;
    }
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await userApi.updateProfile(userData);
      setUser(response.user);
      return true;
    } catch (err) {
      setError(err.message || "Profile update failed. Please try again.");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
