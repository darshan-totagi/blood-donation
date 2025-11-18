import React, { useState } from "react";
import { FiMail, FiUser, FiMessageCircle, FiSend, FiPhone, FiMapPin } from "react-icons/fi";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setSubmitted(true);
      setToast("Message sent successfully");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setToast(""), 1500);
    } catch (err) {
      setToast("Failed to send message");
      setTimeout(() => setToast(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative min-h-screen flex items-center bg-gradient-to-br from-rose-50 via-white to-rose-100 py-20 px-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-rose-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-200 rounded-full blur-3xl opacity-40 animate-ping"></div>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-rose-100">
          <h2 className="text-3xl font-bold text-rose-700 mb-6 text-center">Contact Us</h2>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5 text-gray-700">
              <div className="relative">
                <FiUser className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" className="w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-rose-300 outline-none" />
              </div>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-rose-300 outline-none" />
              </div>
              <div className="relative">
                <FiMessageCircle className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
                <textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Your message..." rows="4" className="w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-rose-300 outline-none resize-none"></textarea>
              </div>
              {toast && <div className="px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">{toast}</div>}
              <button type="submit" disabled={loading} className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-600 text-white font-semibold shadow-lg transition ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-700 hover:scale-[1.01]'}`}>
                <FiSend className="w-5 h-5" /> {loading ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          ) : (
            <div className="text-center text-green-600 font-semibold">✅ Thank you! Your message has been sent.</div>
          )}
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-rose-100 space-y-6">
          <h3 className="text-2xl font-bold text-rose-700">Reach Us</h3>
          <div className="space-y-3 text-zinc-700">
            <div className="flex items-center gap-3"><FiPhone className="w-5 h-5 text-rose-600" /><span>+91 98765 43210</span></div>
            <div className="flex items-center gap-3"><FiMail className="w-5 h-5 text-rose-600" /><span>support@bloodconnect.org</span></div>
            <div className="flex items-center gap-3"><FiMapPin className="w-5 h-5 text-rose-600" /><span>123, Red Cross Street, Bengaluru</span></div>
          </div>
          <div className="rounded-2xl overflow-hidden border">
            <iframe title="BloodConnect HQ" src="https://maps.google.com/maps?q=Bengaluru&z=12&output=embed" className="w-full h-56" />
          </div>
          <div className="text-xs text-zinc-500">Mon–Fri 9:00–18:00 IST</div>
        </div>
      </div>
    </section>
  );
}
