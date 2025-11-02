import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full bg-red-500/60 backdrop-blur-md text-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold">BloodConnect</h1>
        <div className="flex gap-6">
          <button onClick={() => navigate("/")} className="hover:text-gray-200">Home</button>
          <button onClick={() => navigate("/#why-donate")} className="hover:text-gray-200">Why Donate</button>
          <button onClick={() => navigate("/#how-it-works")} className="hover:text-gray-200">How It Works</button>
          <button onClick={() => navigate("/register")} className="hover:text-gray-200">Register</button>
          <button onClick={() => navigate("/search")} className="hover:text-gray-200">Find Donors</button>
          <button onClick={() => navigate("/#contact")} className="hover:text-gray-200">Contact</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
