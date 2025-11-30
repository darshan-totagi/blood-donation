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
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
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

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const API_URL = `${import.meta.env.VITE_API_URL}`;
  const [requestsCount, setRequestsCount] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const fetchCount = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/requests`, { params: { status: 'open' } });
        if (!cancelled) setRequestsCount(Array.isArray(res.data) ? res.data.length : 0);
      } catch {}
    };
    fetchCount();
    const id = setInterval(fetchCount, 60000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const bloodGroups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
  const [quickCity, setQuickCity] = useState("");
  const [quickBG, setQuickBG] = useState("");

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
    <nav className={`fixed top-0 w-full ${scrolled ? 'bg-red-600/80 dark:bg-zinc-900/80 shadow-lg' : 'bg-red-600/50 dark:bg-zinc-900/50 shadow-md'} backdrop-blur-lg z-50 transition-colors`}>
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
          <div className="flex items-center gap-2 ml-2">
            <input
              type="text"
              placeholder="City"
              value={quickCity}
              onChange={(e)=>setQuickCity(e.target.value)}
              className="px-2 py-1 rounded-lg border border-white/30 bg-white/20 text-white placeholder:text-white/70 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"
              style={{width:'150px'}}
            />
            <select
              value={quickBG}
              onChange={(e)=>setQuickBG(e.target.value)}
              className="px-2 py-1 rounded-lg border border-white/30 bg-white/20 text-white dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"
            >
              <option value="">Any BG</option>
              {bloodGroups.map(g=> (<option key={g} value={g}>{g}</option>))}
            </select>
            <button
              onClick={()=>{ const qs = new URLSearchParams(); if (quickCity) qs.set('city', quickCity); if (quickBG) qs.set('bloodGroup', quickBG); navigate(`/search?${qs.toString()}`); }}
              className="px-3 py-1 rounded-xl bg-white/90 text-red-700 dark:bg-zinc-800 dark:text-rose-300 border border-white/30 dark:border-zinc-700 hover:brightness-110 transition"
            >Go</button>
          </div>

          <button
            onClick={() => navigate("/requests")}
            className={`flex items-center gap-2 transition hover:text-gray-200 ${isActive('/requests') ? 'text-white underline decoration-white/40 underline-offset-4' : ''}`}
          >
            <FaBell /> Requests {requestsCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 h-6 rounded-full bg-white/90 text-red-700 dark:bg-zinc-800 dark:text-red-300 text-xs font-bold border border-white/30 dark:border-zinc-700 animate-pulse">{requestsCount}</span>
            )}
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
            className={`flex items-center gap-2 transition hover:text-gray-200 ${isActive('/contact') ? 'text-white underline decoration-white/40 underline-offset-4' : ''}`}
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