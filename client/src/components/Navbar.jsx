import React, { useState } from "react";
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
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
    <nav className="fixed top-0 w-full bg-red-600/70 backdrop-blur-lg shadow-md z-50">
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

          <button
            onClick={() => navigate("/contact")}
            className="flex items-center gap-2 hover:text-gray-200 transition"
          >
            <FaPhoneAlt /> Contact
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
            onClick={() => navigate("/contact")}
            className="flex items-center gap-3"
          >
            <FaPhoneAlt /> Contact
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
