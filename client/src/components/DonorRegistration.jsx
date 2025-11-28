import { useState } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/donors`;
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function DonorRegistration() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    bloodGroup: "A+",
    notes: "",
    allowCall: false,
    lastDonatedAt: "",
    availabilityType: "always",
    availabilitySlots: [],
  });
  const [slot, setSlot] = useState({ day: "Mon", startTime: "09:00", endTime: "17:00" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city) return;
    const phoneDigits = String(form.phone).replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      alert("Please enter a valid phone number");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form, phone: phoneDigits };
      if (form.availabilityType === "always") {
        payload.availability = "Available";
        payload.availabilitySlots = [];
      } else {
        payload.availability = "Scheduled";
      }
      await axios.post(API_URL, payload);
      setMessage("Registered successfully!");
      setMessageType("success");
      setForm({ name: "", phone: "", city: "", bloodGroup: "A+", notes: "", allowCall: false, lastDonatedAt: "", availabilityType: "always", availabilitySlots: [] });
    } catch (err) {
      console.error("Failed to register donor:", err);
      setMessage(err?.response?.data?.error || err.message || "Failed to register donor");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20">
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
        {message && (
          <div className={`mb-4 px-4 py-3 rounded-2xl border ${messageType === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
            {message}
          </div>
        )}

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

        <div className="space-y-2">
          <label className="text-sm text-gray-700">Last donated date (optional)</label>
          <input
            type="date"
            className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-red-500 outline-none transition"
            value={form.lastDonatedAt}
            onChange={(e) => setForm({ ...form, lastDonatedAt: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="availabilityType"
                value="always"
                checked={form.availabilityType === "always"}
                onChange={(e) => setForm({ ...form, availabilityType: e.target.value })}
              />
              Always available
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="availabilityType"
                value="custom"
                checked={form.availabilityType === "custom"}
                onChange={(e) => setForm({ ...form, availabilityType: e.target.value })}
              />
              Custom schedule
            </label>
          </div>

          {form.availabilityType === "custom" && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  className="border rounded-xl px-4 py-2"
                  value={slot.day}
                  onChange={(e) => setSlot({ ...slot, day: e.target.value })}
                >
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <input
                  type="time"
                  className="border rounded-xl px-4 py-2"
                  value={slot.startTime}
                  onChange={(e) => setSlot({ ...slot, startTime: e.target.value })}
                />
                <input
                  type="time"
                  className="border rounded-xl px-4 py-2"
                  value={slot.endTime}
                  onChange={(e) => setSlot({ ...slot, endTime: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, availabilitySlots: [...form.availabilitySlots, slot] })}
                  className="bg-red-600 text-white rounded-xl px-4"
                >
                  Add Slot
                </button>
              </div>

              {form.availabilitySlots.length > 0 && (
                <div className="space-y-1">
                  {form.availabilitySlots.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between border rounded-xl px-3 py-2">
                      <span className="text-sm">{s.day} {s.startTime} - {s.endTime}</span>
                      <button
                        type="button"
                        className="text-red-600"
                        onClick={() => setForm({ ...form, availabilitySlots: form.availabilitySlots.filter((_, i) => i !== idx) })}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

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
          disabled={submitting}
          className={`bg-red-600 text-white rounded-xl px-4 py-3 font-semibold w-full transition-transform transform ${submitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-700 hover:scale-105'}`}
        >
          {submitting ? 'Submitting…' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default DonorRegistration;
