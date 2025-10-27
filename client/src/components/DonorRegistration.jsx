import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/donors";
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function DonorRegistration() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    bloodGroup: "A+",
    notes: "",
    allowCall: false,
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city) return;

    try {
      await axios.post(API_URL, form);
      alert("Registered successfully!");
      setForm({ name: "", phone: "", city: "", bloodGroup: "A+", notes: "" });
    } catch (err) {
      console.error("Failed to register donor:", err);
      alert("Failed to register donor");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Video */}
      <div className="absolute inset-0">
  <img
    src="https://static.vecteezy.com/system/resources/thumbnails/023/367/236/original/blood-donor-day-3d-vector-animation-of-giving-blood-to-save-lives-hands-donating-blood-video.jpg" // replace with your GIF URL
    alt="Blood donation background"
    className="w-full h-full object-cover"
  />
</div>


      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Form Container */}
      <form
        onSubmit={handleRegister}
        className="relative z-10 bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-5 animate-fadeIn"
      >
        <h2 className="text-2xl font-bold text-red-600 text-center mb-4">
          Register as a Donor
        </h2>

        <input
          placeholder="Full name"
          className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-red-500 outline-none transition"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Phone (e.g. 98765...)"
          className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-red-500 outline-none transition"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          placeholder="City"
          className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-red-500 outline-none transition"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <select
          className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-red-500 outline-none transition"
          value={form.bloodGroup}
          onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
        >
          {bloodGroups.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>

        <textarea
          placeholder="Notes (availability, hospital preference, timings)"
          className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-red-500 outline-none transition resize-none"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.allowCall}
            onChange={(e) =>
              setForm({ ...form, allowCall: e.target.checked })
            }
            className="accent-red-600"
          />
          <label className="text-gray-700 text-sm">
            Allow donors to call me
          </label>
        </div>

        <button
          type="submit"
          className="bg-red-600 text-white rounded-xl px-4 py-3 font-semibold w-full hover:bg-red-700 transition-transform transform hover:scale-105"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default DonorRegistration;
