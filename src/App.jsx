import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
