// my-project/react/src/App.jsx : 

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Added this import
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/sections/Navbar";
import Hero from "./components/sections/Hero";
import ProductGrid from "./components/sections/ProductGrid";
import HowItWorks from "./components/sections/HowItWorks";
import AboutUs from "./components/sections/AboutUs";
import ContactUs from "./components/sections/ContactUs";
import Footer from "./components/sections/Footer";
import ProductsPage from "./pages/ProductsPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import { AuthProvider } from "./pages/auth/AuthContext";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {loading && <LoadingScreen />}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* navbar for all pages and sections */}
            <Navbar />

            {/* Main content routes */}
            <Routes>
              <Route path="/products:id" element={<ProductsPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/"
                element={
                  <>
                    <Hero id="home" />
                    <ProductGrid id="products" />
                    <HowItWorks id="how-it-works" />
                    <AboutUs id="about" />
                    <ContactUs id="contact" />
                    <Footer />
                  </>
                }
              />
            </Routes>
          </motion.div>
        </div>
      </AuthProvider>
    </Router>
  );
}


// main.jsx : 

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// react/src/utils/storage.js 

export const safeGet = (key, fallback = []) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`Error parsing ${key}:`, error);
    return fallback;
  }
};

export const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

const resetStorage = (key) => {
  localStorage.removeItem(key);
  window.location.reload(); // refresh to reset state
};

(on this file, maybe we should change it to TS and make even more better)

// src/pages/auth/AuthContext.jsx 

import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

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
          // Simulate token validation
          await new Promise((resolve) => setTimeout(resolve, 500));
          setUser({ email: "user@example.com", name: "Demo User" });
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "demo@example.com" && password === "password123") {
        const userData = { email, name: "Demo User" };
        localStorage.setItem("token", "demo-token-123");
        setUser(userData);
        setIsAuthenticated(true);
        navigate("/");
        return true;
      }
      throw new Error("Invalid credentials");
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (userData.password !== userData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      localStorage.setItem("token", "demo-token-123");
      setUser({ email: userData.email, name: userData.name });
      setIsAuthenticated(true);
      navigate("/");
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    } catch (err) {
      setError(err.message);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// auth/ForgotPassword.jsx 

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "./AuthContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setError("");
    const success = await resetPassword(email);
    setIsSubmitting(false);

    if (success) {
      setSuccess(true);
    } else {
      setError("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <FiArrowLeft className="mr-1" /> Back
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {success ? "Check Your Email" : "Reset Password"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {success
                ? "We sent a password reset link to your email"
                : "Enter your email to reset your password"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                <FiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  If you don't see the email, check your spam folder.
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          )}

          {!success && (
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// auth/Login.jsx 

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "./AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Invalid email";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const success = await login(formData.email, formData.password);
    setIsSubmitting(false);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <FiArrowLeft className="mr-1" /> Back
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Sign in to your account
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-700"
                  } rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-700"
                  } rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


// auth/Register.jsx : 

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from './AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const success = await register(formData);
    setIsSubmitting(false);
    
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <FiArrowLeft className="mr-1" /> Back
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Join our community today
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// pages/ProductsPage.jsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiShoppingCart } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import useRecentlyViewed from "../hooks/useRecentlyViewed";
import WishlistButton from "../components/WishlistButton";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Track this product as recently viewed
  useRecentlyViewed(product);

  useEffect(() => {
    // Simulate API fetch
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        const mockProducts = [
          {
            id: 1,
            name: "Smart Eco Water Bottle",
            price: 29.99,
            description:
              "Reduces plastic waste by 90%. Made from sustainable materials with smart hydration tracking.",
            longDescription:
              "This innovative water bottle combines eco-friendly materials with smart technology...",
            images: ["/placeholder-bottle.jpg", "/placeholder-bottle-2.jpg"],
            aiTags: { ecoScore: 0.95, techLevel: 0.2 },
            specs: {
              material: "Recycled Stainless Steel",
              capacity: "750ml",
              weight: "350g",
            },
          },
          // Add other products...
        ];

        const foundProduct = mockProducts.find((p) => p.id === parseInt(id));
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading

        setProduct(foundProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          Loading product...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/products"
          className="flex items-center text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 mb-6"
        >
          <FiArrowLeft className="mr-2" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {product.images ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    Product Image
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white dark:bg-gray-800 rounded-md border ${
                    selectedImage === index
                      ? "border-indigo-600 dark:border-indigo-400"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1> 
              <WishlistButton productId={product.id} />
            </div>

            <p className="text-lg font-bold text-gray-900 dark:text-white mt-4">
              ${product.price.toFixed(2)}
            </p>

            <p className="mt-4 text-gray-700 dark:text-gray-300">
              {product.longDescription || product.description}
            </p>

            {/* Specifications */}
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Specifications
              </h3>
              <ul className="mt-2 space-y-2">
                {product.specs &&
                  Object.entries(product.specs).map(([key, value]) => (
                    <li key={key} className="flex">
                      <span className="text-gray-500 dark:text-gray-400 w-32">
                        {key}:
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {value}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            <button className="mt-8 w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              <FiShoppingCart className="mr-2" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Replace with actual related products */}
            <ProductCard
              product={{
                id: 2,
                name: "Wireless Headphones",
                price: 199.99,
                description: "Premium sound quality",
                image: "/placeholder-headphones.jpg",
              }}
              compact
            />
          </div>
        </div>

        {/* see more products button */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/products-more"
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            See more products
          </Link>
        </div>
      </div>
    </div>
  );
}


// src/hooks/useRecentlyViewed.js 

import { useEffect, useState } from "react";

export default function useRecentlyViewed(product = null) {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const isValidProduct = product && typeof product.id !== "undefined";
  if (product && !isValidProduct) {
    console.warn("Invalid product data for recently viewed");
    return;
  }

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentlyViewed");
      // Initialize with empty array if no data exists
      const parsed = stored ? JSON.parse(stored) : [];
      setRecentlyViewed(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Error parsing recently viewed:", error);
      setRecentlyViewed([]);
    }
  }, []);

  useEffect(() => {
    if (product) {
      try {
        setRecentlyViewed((prev) => {
          const filtered = prev.filter((p) => p.id !== product.id);
          const updated = [product, ...filtered].slice(0, 5);
          localStorage.setItem("recentlyViewed", JSON.stringify(updated));
          return updated;
        });
      } catch (error) {
        console.error("Error updating recently viewed:", error);
      }
    }
  }, [product]);

  return recentlyViewed;
}

(maybe change this to TS and better too)

// src/components/LoadingScreen.jsx

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900"
    >
      <div className="text-center">
        {/* Animated AI logo */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="mx-auto mb-6"
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
              stroke="url(#gradient)"
              strokeWidth="2"
            />
            <path d="M12 22V12" stroke="url(#gradient)" strokeWidth="2" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Text with typing animation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-white/80 font-mono"
        >
          Initializing AI...
        </motion.p>
      </div>
    </motion.div>
  );
}


// src/components/ProductCard.jsx 

import { Link } from "react-router-dom";
import WishlistButton from "./WishlistButton";
import useRecentlyViewed from "../hooks/useRecentlyViewed";

export default function ProductCard({ product, compact = false }) {
  // Track this product as recently viewed
  useRecentlyViewed(product);

  return (
    <div className={`group relative ${compact ? "p-2" : "p-4"}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {/* Product Image */}
        <Link
          to={`/products/${product.id}`}
          className="block aspect-square overflow-hidden"
        >
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                Product Image
              </span>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <Link
              to={`/products/${product.id}`}
              className="text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {product.name}
            </Link>
            <WishlistButton productId={product.id} />
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Tags (if available) */}
          {product.aiTags && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {product.aiTags.ecoScore > 0.7 && (
                <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                  Eco-Friendly
                </span>
              )}
              {product.aiTags.techLevel > 0.7 && (
                <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  High-Tech
                </span>
              )}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            <button
              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
              onClick={() => console.log("Add to cart", product.id)} // Replace with your cart function
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// components/sections/ProductFilters.jsx

import { FiFilter } from "react-icons/fi";

export default function ProductFilters({ filters, setFilters }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <FiFilter className="text-gray-400 mr-2" />
        <select
          className="block pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="all">All Categories</option>
          <option value="tech">Tech</option>
          <option value="eco">Eco-Friendly</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">Price:</span>
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.priceRange[1]}
          onChange={(e) =>
            setFilters({ ...filters, priceRange: [0, e.target.value] })
          }
          className="w-24"
        />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </span>
      </div>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={filters.ecoFriendly}
          onChange={(e) =>
            setFilters({ ...filters, ecoFriendly: e.target.checked })
          }
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-800"
        />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Eco-Friendly
        </span>
      </label>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={filters.highTech}
          onChange={(e) =>
            setFilters({ ...filters, highTech: e.target.checked })
          }
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-800"
        />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          High-Tech
        </span>
      </label>
    </div>
  );
}


// components/sections/RecentlyViewed.jsx

import { Link } from "react-router-dom";
import useRecentlyViewed from "../hooks/useRecentlyViewed";
import ProductCard from "./ProductCard";

export default function RecentlyViewed() {
  const recentlyViewed = useRecentlyViewed();

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-4 dark:text-white">
        Recently Viewed
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recentlyViewed.map((product) => (
          <Link
            to={`/products/${product.id}`}
            key={product.id}
            className="hover:scale-[1.02] transition-transform"
          >
            <ProductCard product={product} compact />
          </Link>
        ))}
      </div>
    </section>
  );
}

// components/sections/ReleaseOnScroll.jsx

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ReleaseOnScroll({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale: scaleProgress,
        opacity: opacityProgress,
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}


// components/sections/WishListButton.jsx 

import { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { useAuth } from "../pages/auth/AuthContext";

export default function WishlistButton({ productId }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      // Initialize with empty array if no data exists
      const wishlist = stored ? JSON.parse(stored) : [];
      setIsWishlisted(Array.isArray(wishlist) && wishlist.includes(productId));
    } catch (error) {
      console.error("Error parsing wishlist:", error);
      setIsWishlisted(false);
    }
  }, [productId]);

  const toggleWishlist = () => {
    if (!isAuthenticated) {
      console.log("Please login to use wishlist");
      return;
    }

    try {
      const stored = localStorage.getItem("wishlist");
      const wishlist = stored ? JSON.parse(stored) : [];
      let updatedWishlist;

      if (isWishlisted) {
        updatedWishlist = wishlist.filter((id) => id !== productId);
      } else {
        updatedWishlist = [...wishlist, productId];
      }

      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className={`p-1 rounded-full transition-colors ${
        isWishlisted
          ? "text-red-500 fill-red-500"
          : "text-gray-400 hover:text-red-500 dark:hover:text-red-400"
      }`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <FiHeart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
    </button>
  );
}


// components/sections/About>jsx : 

import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiCpu, FiShield } from "react-icons/fi";
import ReleaseOnScroll from "../ReleaseOnScroll";

const team = [
  {
    name: "Alex Chen",
    role: "AI Engineer",
    bio: "Specializes in reinforcement learning and multi-agent systems. Previously at Google Brain.",
    avatar: "/placeholder-avatar1.jpg", // Replace with real images
    social: { github: "#", linkedin: "#" },
  },
  {
    name: "Samira Khan",
    role: "Full-Stack Developer",
    bio: "Builds the bridge between AI models and user experiences. Loves TypeScript and TensorFlow.js.",
    avatar: "/placeholder-avatar2.jpg",
    social: { github: "#", linkedin: "#" },
  },
  {
    name: "Jordan Smith",
    role: "UX Researcher",
    bio: "Ensures our AI recommendations feel human-centric. PhD in HCI from Stanford.",
    avatar: "/placeholder-avatar3.jpg",
    social: { github: "#", linkedin: "#" },
  },
];

export default function AboutUs() {
  return (
    <ReleaseOnScroll>
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Building the Future of E-Commerce
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-600 mb-8">
                At{" "}
                <span className="font-semibold text-indigo-600">AI-Shop</span>,
                we combine cutting-edge machine learning with human-centered
                design to create shopping experiences that feel magical yet
                trustworthy.
              </p>

              {/* Tech Pillars */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <motion.div
                  whileHover={{ y: -3 }}
                  className="flex items-center px-4 py-2 bg-indigo-50 rounded-full"
                >
                  <FiCpu className="text-indigo-600 mr-2" />
                  <span className="text-sm font-medium">Autonomous Agents</span>
                </motion.div>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="flex items-center px-4 py-2 bg-purple-50 rounded-full"
                >
                  <FiShield className="text-purple-600 mr-2" />
                  <span className="text-sm font-medium">Ethical AI</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                {/* Avatar */}
                <div className="mb-6 relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden border-4 border-white shadow-lg">
                    {/* Replace with actual image */}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                      Avatar
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        index % 2 === 0 ? "bg-green-400" : "bg-amber-400"
                      }`}
                    />
                  </div>
                </div>

                {/* Details */}
                <h3 className="text-xl font-bold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-indigo-600 mb-2">{member.role}</p>
                <p className="text-gray-600 mb-4">{member.bio}</p>

                {/* Social */}
                <div className="flex space-x-3">
                  <a
                    href={member.social.github}
                    className="text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <FiGithub className="w-5 h-5" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <FiLinkedin className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
          >
            <div className="p-6 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-indigo-600">98%</p>
              <p className="text-gray-500">Recommendation Accuracy</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-indigo-600">10M+</p>
              <p className="text-gray-500">Products Analyzed</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-indigo-600">24/7</p>
              <p className="text-gray-500">AI Model Training</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-indigo-600">100%</p>
              <p className="text-gray-500">Privacy Focused</p>
            </div>
          </motion.div>
        </div>
      </section>
    </ReleaseOnScroll>
  );
}


// sections/ContactUs.jsx 

import { motion } from "framer-motion";
import { FiMail, FiMapPin, FiPhone, FiSend } from "react-icons/fi";
import { useState } from "react";
import ReleaseOnScroll from "../ReleaseOnScroll";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.message) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({ name: "", email: "", message: "" });
      }, 1500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <ReleaseOnScroll>
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about our AI technology? We'd love to hear from
              you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100"
            >
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full px-4 py-2 rounded-lg border ${
                          errors.name ? "border-red-300" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full px-4 py-2 rounded-lg border ${
                          errors.email ? "border-red-300" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className={`block w-full px-4 py-2 rounded-lg border ${
                          errors.message ? "border-red-300" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
                        placeholder="Tell us about your project..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                      className={`w-full flex justify-center items-center px-6 py-3 rounded-lg text-white font-medium ${
                        isSubmitting
                          ? "bg-indigo-400"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } transition-colors`}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <FiSend className="mr-2" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Success Message */}
                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200"
                    >
                      Message sent successfully! We'll get back to you soon.
                    </motion.div>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Map Placeholder */}
              <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border border-gray-200 relative flex items-center justify-center">
                <FiMapPin className="w-12 h-12 text-indigo-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                <span className="absolute bottom-4 left-4 text-white font-medium">
                  San Francisco, CA
                </span>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg text-indigo-600">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">contact@aishop.dev</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Typically replies within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg text-purple-600">
                    <FiPhone className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Mon-Fri, 9am-5pm PST
                    </p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Connect With Us
                  </h3>
                  <div className="flex space-x-4">
                    {["Twitter", "LinkedIn", "GitHub"].map((social) => (
                      <motion.a
                        key={social}
                        href="#"
                        whileHover={{ y: -2 }}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        {social}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </ReleaseOnScroll>
  );
}


// Footer.jsx

import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white">AI-Shop</h3>
            <p className="text-gray-400">
              Revolutionizing e-commerce with autonomous AI agents and personalized recommendations.
            </p>
            <div className="flex space-x-4 pt-2">
              {[
                { icon: <FiGithub />, label: 'GitHub' },
                { icon: <FiTwitter />, label: 'Twitter' },
                { icon: <FiLinkedin />, label: 'LinkedIn' }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -3 }}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <span className="sr-only">{social.label}</span>
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {['Products', 'How It Works', 'About Us', 'Testimonials'].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* AI Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              AI Resources
            </h4>
            <ul className="space-y-3">
              {['Research Papers', 'API Docs', 'Model Cards', 'Ethics Policy'].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              AI Insights
            </h4>
            <p className="text-gray-400">
              Subscribe to our newsletter for the latest in AI commerce.
            </p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-700"
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FiMail className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Cookies
            </a>
          </div>
          <div className="text-sm text-gray-500">
            © {currentYear} AI-Shop. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

// Hero.jsx

import { Link } from "react-router-dom";

// Mock promotional products data
const promoProducts = [
  {
    id: 101,
    name: "Summer Special Bundle",
    price: 89.99,
    discount: 30,
    image: "/summer-bundle.jpg",
  },
  {
    id: 102,
    name: "Limited Edition Headphones",
    price: 179.99,
    discount: 20,
    image: "/limited-headphones.jpg",
  },
  {
    id: 103,
    name: "Eco Starter Kit",
    price: 49.99,
    discount: 15,
    image: "/eco-kit.jpg",
  },
];

export default function Hero() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section
        id="home"
        className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white pt-24 pb-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="block">Shop Smarter,</span>
            <span className="block bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover products uniquely matched to your taste with our machine
            learning engine.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg hover:shadow-xl">
              Try AI Recommendations
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition">
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Promotional Products Section */}
      <div className="bg-gradient-to-b from-indigo-600 to-purple-700 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl font-bold text-center mb-8 text-white">
            🔥 Hot Deals This Week
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {promoProducts.map((product) => (
              <Link
                to="/products"
                key={product.id}
                className="bg-white/20 rounded-xl p-4 backdrop-blur-sm border border-white/30 hover:scale-105 transition-transform duration-300"
              >
                <div className="h-40 bg-white/30 rounded-lg mb-3 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-300">Product Image</span>
                  )}
                </div>
                <h4 className="font-semibold text-white">{product.name}</h4>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-300 font-bold">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="ml-2 text-sm text-white/70 line-through">
                    ${product.price}
                  </span>
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-block px-6 py-2 bg-white text-indigo-600 rounded-full font-medium hover:bg-gray-100 transition"
            >
              View All Deals →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


// HowItWorks.jsx

import { motion } from "framer-motion";
import {
  FiCpu,
  FiDatabase,
  FiUser,
  FiShoppingBag,
  FiCode,
  FiChevronRight,
} from "react-icons/fi";
import ReleaseOnScroll from "../ReleaseOnScroll";

const steps = [
  {
    icon: <FiUser className="w-6 h-6" />,
    title: "Learn Your Preferences",
    description:
      "Our AI observes your browsing patterns and purchase history to build a unique taste profile.",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: <FiDatabase className="w-6 h-6" />,
    title: "Analyze Product Catalog",
    description:
      "Every product is processed through computer vision and NLP models to extract key features.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: <FiCpu className="w-6 h-6" />,
    title: "Generate Recommendations",
    description:
      "Reinforcement learning algorithms match products to your profile with 94% accuracy.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: <FiShoppingBag className="w-6 h-6" />,
    title: "Deliver Personalized Results",
    description:
      "You see only products that genuinely match your style and needs.",
    color: "bg-emerald-100 text-emerald-600",
  },
];

const TechPill = ({ children }) => (
  <motion.span
    whileHover={{ y: -2 }}
    className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium mr-2 mb-2"
  >
    {children}
  </motion.span>
);

export default function HowItWorks() {
  return (
    <ReleaseOnScroll>
      <section id="how-it-works" className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Our AI Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A transparent look at the machine learning magic behind your
              personalized shopping experience.
            </p>
          </motion.div>

          {/* Process Steps */}
          <div className="relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-16 left-1/2 h-1 bg-gradient-to-r from-indigo-300 via-purple-300 to-amber-300 w-full -translate-x-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step Icon */}
                  <div
                    className={`mb-4 p-4 rounded-full ${step.color} relative z-10 shadow-sm`}
                  >
                    {step.icon}
                  </div>

                  {/* Step Content */}
                  <div className="px-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>

                  {/* Mobile arrow */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden mt-6">
                      <FiChevronRight className="w-6 h-6 text-gray-300 mx-auto" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tech Stack Visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100 max-w-4xl mx-auto"
          >
            <h4 className="text-center font-medium text-gray-900 mb-4">
              Under the Hood
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              <TechPill>TensorFlow</TechPill>
              <TechPill>Vision Transformers</TechPill>
              <TechPill>NLP</TechPill>
              <TechPill>Reinforcement Learning</TechPill>
              <TechPill>LLMs</TechPill>
              <TechPill>ONNX Runtime</TechPill>
              <TechPill>Hugging Face</TechPill>
            </div>
          </motion.div>

          {/* API Sandbox Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
          >
            <div className="p-4 bg-gray-50 border-b flex items-center">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-sm font-mono text-gray-500">
                api-demo.js
              </span>
              <FiCode className="ml-auto text-gray-400" />
            </div>
            <pre className="p-6 text-sm bg-gray-900 text-gray-100 overflow-x-auto">
              {`// Sample API call to our recommendation engine\n`}
              {`const fetchRecommendations = async () => {\n`}
              {`  try {\n`}
              {`    const response = await fetch('https://api.aishop.dev/v1/recommend', {\n`}
              {`      method: 'POST',\n`}
              {`      headers: { 'Content-Type': 'application/json' },\n`}
              {`      body: JSON.stringify({\n`}
              {`        userId: 'user_${Math.random()
                .toString(36)
                .substring(2, 8)}',\n`}
              {`        preferences: {\n`}
              {`          priceRange: [20, 100],\n`}
              {`          likedCategories: ['tech', 'eco'],\n`}
              {`          dislikedBrands: []\n`}
              {`        },\n`}
              {`        diversity: 0.7 // 0-1 scale\n`}
              {`      })\n`}
              {`    });\n`}
              {`    const data = await response.json();\n`}
              {`    console.log('AI Recommendations:', data.recommendations);\n`}
              {`  } catch (error) {\n`}
              {`    console.error('API Error:', error);\n`}
              {`  }\n`}
              {`};\n\n`}
              {`// Execute the function\n`}
              {`fetchRecommendations();`}
            </pre>
            <div className="p-4 bg-gray-50 border-t text-right">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
              >
                Try in Postman
              </motion.button>
            </div>
          </motion.div>

          {/* Documentation CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <a
              href="#"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium group"
            >
              Read Full API Documentation
              <FiChevronRight className="ml-1 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </section>
    </ReleaseOnScroll>
  );
}


// Navbar.jsx

import { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiMenu,
  FiSun,
  FiMoon,
  FiChevronDown,
  FiLogOut,
  FiSettings,
  FiCreditCard,
} from "react-icons/fi";
import { Menu, Transition } from "@headlessui/react";
import { useAuth } from "../../pages/auth/AuthContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Products", id: "products" },
    { name: "How It Works", id: "how-it-works" },
    { name: "About", id: "about" },
    { name: "Contact", id: "contact" },
  ];

  // Scroll to section function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setMobileMenuOpen(false);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  // Scroll listener for navbar style
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check for saved theme preference
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.documentElement.classList.toggle("dark", savedMode);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 ${
        scrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm"
          : "bg-white/80 dark:bg-gray-900/80"
      } border-b border-gray-100 dark:border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => scrollToSection("home")}
              className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400"
            >
              AI-Shop
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <div key={link.id}>
                  {link.id === "products" ? (
                    <Link
                      to="/products"
                      className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors"
                    >
                      {link.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Elements */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-full leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm transition-all"
                  placeholder="Search products..."
                />
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FiSun className="h-6 w-6" />
              ) : (
                <FiMoon className="h-6 w-6" />
              )}
            </button>

            {/* Cart */}
            <button
              className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              onClick={() => navigate("/cart")}
            >
              <FiShoppingCart className="h-6 w-6" />
            </button>

            {/* User Dropdown */}
            <Menu as="div" className="relative ml-4">
              <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                  {isAuthenticated && user ? (
                    <span className="font-medium">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  ) : (
                    <FiUser className="h-5 w-5" />
                  )}
                </div>
                <FiChevronDown className="ml-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-50 border border-gray-100 dark:border-gray-700">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full`}
                          >
                            <FiUser className="mr-3 h-5 w-5" />
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/settings"
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full`}
                          >
                            <FiSettings className="mr-3 h-5 w-5" />
                            Settings
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/orders"
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full`}
                          >
                            <FiCreditCard className="mr-3 h-5 w-5" />
                            My Orders
                          </Link>
                        )}
                      </Menu.Item>
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full`}
                          >
                            <FiLogOut className="mr-3 h-5 w-5" />
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </>
                  ) : (
                    <>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/login"
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full`}
                          >
                            <FiUser className="mr-3 h-5 w-5" />
                            Sign in
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/register"
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full`}
                          >
                            <FiCreditCard className="mr-3 h-5 w-5" />
                            Register
                          </Link>
                        )}
                      </Menu.Item>
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/forgot-password"
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full`}
                          >
                            <FiSettings className="mr-3 h-5 w-5" />
                            Forgot Password
                          </Link>
                        )}
                      </Menu.Item>
                    </>
                  )}
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile Search */}
                <div className="px-2 mb-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Search..."
                    />
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                  >
                    {link.name}
                  </button>
                ))}

                {/* Mobile Auth Links */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>

                {/* Mobile Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {darkMode ? (
                    <>
                      <FiSun className="mr-2" /> Light Mode
                    </>
                  ) : (
                    <>
                      <FiMoon className="mr-2" /> Dark Mode
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}


// ProductGrid.jsx

import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";

const products = [
  {
    id: 1,
    name: "Smart Eco Water Bottle",
    price: 29.99,
    description: "Reduces plastic waste by 90%",
    aiTags: { ecoScore: 0.95, techLevel: 0.2 },
    image: "/placeholder-bottle.jpg",
  },
  {
    id: 2,
    name: "Wireless Headphones",
    price: 199.99,
    description: "Optimized bass for your music taste",
    aiTags: { ecoScore: 0.3, techLevel: 0.9 },
    image: "/placeholder-headphones.jpg",
  },
  {
    id: 3,
    name: "Yoga Mat (Extra Cushion)",
    price: 49.99,
    description: "Selected for your fitness preferences",
    aiTags: { ecoScore: 0.7, techLevel: 0.1 },
    image: "/placeholder-yogamat.jpg",
  },
];

export default function ProductGrid() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI-Suggested Products
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Selected by our algorithm based on your preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/products"
            className="inline-block text-gray-700 dark:text-gray-300 hover:text-indigo-600 
             dark:hover:text-indigo-400 px-6 py-3 text-xl font-semibold transition-all 
             duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] 
             hover:scale-[1.05] border border-gray-400 dark:border-gray-600 
             rounded-xl hover:border-indigo-500"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    </section>
  );
}


// 
