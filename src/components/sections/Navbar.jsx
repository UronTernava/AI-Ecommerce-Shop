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
        <div className="flex justify-between h-14 sm:h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => scrollToSection("home")}
              className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400"
            >
              AI-Shop
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-6 lg:space-x-8">
              {navLinks.map((link) => (
                <div key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 sm:px-3 py-2 text-sm font-medium transition-colors"
                  >
                    {link.name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Elements */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-8 sm:pl-10 pr-3 py-1.5 sm:py-2 border border-gray-200 dark:border-gray-700 rounded-full leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-xs sm:text-sm transition-all"
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
                <FiSun className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <FiMoon className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>

            {/* Cart */}
            <button
              className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              onClick={() => navigate("/cart")}
            >
              <FiShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* User Dropdown */}
            <Menu as="div" className="relative ml-2 sm:ml-4">
              <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center ${
                  isAuthenticated && user 
                    ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300" 
                    : "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300"
                }`}>
                  {isAuthenticated && user ? (
                    <span className="font-medium text-sm sm:text-base">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  ) : (
                    <FiUser className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </div>
                <FiChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500" />
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
                      <button
                        onClick={() => {
                          scrollToSection("home");
                          setMobileMenuOpen(false);
                        }}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                      >
                        Home
                      </button>
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
                      <button
                        onClick={() => {
                          scrollToSection("home");
                          setMobileMenuOpen(false);
                        }}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                      >
                        Home
                      </button>
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
