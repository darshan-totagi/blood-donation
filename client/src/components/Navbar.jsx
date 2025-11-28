import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaHandHoldingHeart,
  FaClipboardList,
  FaUserPlus,
  FaSearch,
  FaPhoneAlt,
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaMapMarkerAlt
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  
  // Hook calls properly placed inside the function component
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleScrollNav = (hash) => {
    navigate("/");
    setTimeout(() => {
      const section = document.querySelector(hash);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 120);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleMobileMenuClick = (action) => {
    setMenuOpen(false);
    if (typeof action === 'function') {
      action();
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-red-600/70 dark:bg-zinc-900/70 backdrop-blur-lg shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-extrabold tracking-wide cursor-pointer flex items-center gap-2 text-white"
        >
          <FaHandHoldingHeart className="text-white" />
          BloodConnect
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-lg items-center text-white">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:text-gray-200 transition"
          >
            <FaHome /> Home
          </button>

          <button
            onClick={() => handleScrollNav("#why-donate")}
            className="flex items-center gap-2 hover:text-gray-200 transition"
          >
            <FaHandHoldingHeart /> Why Donate
          </button>

          <button
            onClick={() => handleScrollNav("#how-it-works")}
            className="flex items-center gap-2 hover:text-gray-200 transition"
          >
            <FaClipboardList /> How It Works
          </button>

          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-2 hover:text-gray-200 transition"
          >
            <FaUserPlus /> Register
          </button>

          <button
            onClick={() => navigate("/search")}
            className="flex items-center gap-2 hover:text-gray-200 transition"
          >
            <FaSearch /> Find Donors
          </button>

          {/* Map View Button */}
          <button
            onClick={() => navigate("/map")}
            className="flex items-center gap-2 hover:text-gray-200 transition"
          >
            <FaMapMarkerAlt /> Map View
          </button>

          <button
            onClick={() => navigate("/contact")}
            className="flex items-center gap-2 hover:text-gray-200 transition"
          >
            <FaPhoneAlt /> Contact
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1 rounded-2xl border border-white/30 hover:bg-white/10 transition"
            title="Toggle theme"
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />} 
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-red-600/85 px-6 py-4 space-y-4 text-lg text-white">
          <button
            onClick={() => handleMobileMenuClick(() => navigate("/"))}
            className="flex items-center gap-3 w-full text-left"
          >
            <FaHome /> Home
          </button>
          <button
            onClick={() => handleMobileMenuClick(() => handleScrollNav("#why-donate"))}
            className="flex items-center gap-3 w-full text-left"
          >
            <FaHandHoldingHeart /> Why Donate
          </button>
          <button
            onClick={() => handleMobileMenuClick(() => handleScrollNav("#how-it-works"))}
            className="flex items-center gap-3 w-full text-left"
          >
            <FaClipboardList /> How It Works
          </button>
          <button
            onClick={() => handleMobileMenuClick(() => navigate("/register"))}
            className="flex items-center gap-3 w-full text-left"
          >
            <FaUserPlus /> Register
          </button>
          <button
            onClick={() => handleMobileMenuClick(() => navigate("/search"))}
            className="flex items-center gap-3 w-full text-left"
          >
            <FaSearch /> Find Donors
          </button>
          
          {/* Map View in Mobile Menu */}
          <button
            onClick={() => handleMobileMenuClick(() => navigate("/map"))}
            className="flex items-center gap-3 w-full text-left"
          >
            <FaMapMarkerAlt /> Map View
          </button>
          
          <button
            onClick={() => handleMobileMenuClick(() => navigate("/contact"))}
            className="flex items-center gap-3 w-full text-left"
          >
            <FaPhoneAlt /> Contact
          </button>
          
          <button
            onClick={() => handleMobileMenuClick(toggleTheme)}
            className="flex items-center gap-3 w-full text-left"
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />} 
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;