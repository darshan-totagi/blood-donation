import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  FaBell,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScrollNav = (hash) => {
    navigate("/");
    setTimeout(() => {
      const section = document.querySelector(hash);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 120);
  };

  return (
    <nav className={`fixed top-0 w-full ${scrolled ? 'bg-red-600/80 dark:bg-zinc-900/80 shadow-lg' : 'bg-red-600/50 dark:bg-zinc-900/50 shadow-md'} backdrop-blur-lg z-50 transition-colors`}>
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-extrabold tracking-wide cursor-pointer flex items-center gap-2"
        >
          <FaHandHoldingHeart className="text-white" />
          BloodConnect
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-lg items-center">
          <button
            onClick={() => navigate("/")}
            className={`flex items-center gap-2 transition hover:text-gray-200 ${isActive('/') ? 'text-white underline decoration-white/40 underline-offset-4' : ''}`}
          >
            <FaHome /> Home
          </button>

          <button
            onClick={() => handleScrollNav("#why-donate")}
            className="flex items-center gap-2 transition hover:text-gray-200"
          >
            <FaHandHoldingHeart /> Why Donate
          </button>

          <button
            onClick={() => handleScrollNav("#how-it-works")}
            className="flex items-center gap-2 transition hover:text-gray-200"
          >
            <FaClipboardList /> How It Works
          </button>

          <button
            onClick={() => navigate("/register")}
            className={`flex items-center gap-2 transition hover:text-gray-200 ${isActive('/register') ? 'text-white underline decoration-white/40 underline-offset-4' : ''}`}
          >
            <FaUserPlus /> Register
          </button>

          <button
            onClick={() => navigate("/search")}
            className={`flex items-center gap-2 transition hover:text-gray-200 ${isActive('/search') ? 'text-white underline decoration-white/40 underline-offset-4' : ''}`}
          >
            <FaSearch /> Find Donors
          </button>

          <button
            onClick={() => navigate("/requests")}
            className={`flex items-center gap-2 transition hover:text-gray-200 ${isActive('/requests') ? 'text-white underline decoration-white/40 underline-offset-4' : ''}`}
          >
            <FaBell /> Requests
          </button>

          <button
            onClick={() => navigate("/contact")}
            className={`flex items-center gap-2 transition hover:text-gray-200 ${isActive('/contact') ? 'text-white underline decoration-white/40 underline-offset-4' : ''}`}
          >
            <FaPhoneAlt /> Contact
          </button>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-2 px-3 py-1 rounded-2xl border border-white/30 hover:bg-white/10 transition"
            title="Toggle theme"
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />} {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-red-600/85 px-6 py-4 space-y-4 text-lg">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <FaHome /> Home
          </button>
          <button
            onClick={() => handleScrollNav("#why-donate")}
            className="flex items-center gap-3"
          >
            <FaHandHoldingHeart /> Why Donate
          </button>
          <button
            onClick={() => handleScrollNav("#how-it-works")}
            className="flex items-center gap-3"
          >
            <FaClipboardList /> How It Works
          </button>
          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-3"
          >
            <FaUserPlus /> Register
          </button>
          <button
            onClick={() => navigate("/search")}
            className="flex items-center gap-3"
          >
            <FaSearch /> Find Donors
          </button>
          <button
            onClick={() => navigate("/requests")}
            className="flex items-center gap-3"
          >
            <FaBell /> Requests
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="flex items-center gap-3"
          >
            <FaPhoneAlt /> Contact
          </button>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-3 px-3 py-2 rounded-xl border border-white/30 hover:bg-white/10 transition"
            title="Toggle theme"
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />} {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
