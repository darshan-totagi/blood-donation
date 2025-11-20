import React, { useState, useEffect } from "react";
import { FiMail, FiUser, FiMessageCircle, FiSend, FiPhone, FiMapPin, FiRotateCcw } from "react-icons/fi";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "General",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const draft = localStorage.getItem("contactDraft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData((prev) => ({ ...prev, ...parsed }));
        setToast("Draft restored");
        setTimeout(() => setToast(""), 1500);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("contactDraft", JSON.stringify(formData));
  }, [formData]);

  const clearDraft = () => {
    localStorage.removeItem("contactDraft");
    setToast("Draft cleared");
    setTimeout(() => setToast(""), 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errs = {};
    if (!formData.name || formData.name.trim().length < 2) errs.name = "Please enter your full name";
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(formData.email)) errs.email = "Enter a valid email";
    if (!formData.subject || formData.subject.trim().length < 3) errs.subject = "Add a short subject";
    if (!formData.message || formData.message.trim().length < 10) errs.message = "Message should be at least 10 characters";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setToast("Please fix the highlighted fields");
      setTimeout(() => setToast(""), 2000);
      setLoading(false);
      return;
    }
    try {
      setSubmitted(true);
      setToast("Message sent successfully");
      localStorage.removeItem("contactDraft");
      setFormData({ name: "", email: "", subject: "", message: "", category: "General" });
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
              <div className="flex flex-wrap gap-2">
                {['General','Support','Feedback','Partnership'].map((c) => (
                  <button type="button" key={c} onClick={() => setFormData({ ...formData, category: c })} className={`px-3 py-1 rounded-full border text-sm ${formData.category===c? 'bg-rose-600 text-white border-rose-600':'bg-rose-50 text-rose-700 border-rose-200'}`}>{c}</button>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Autosaves locally</span>
                <button type="button" onClick={clearDraft} className="text-rose-600 hover:underline flex items-center gap-1">
                  <FiRotateCcw className="w-4 h-4" />
                  Clear draft
                </button>
              </div>
              <div className="relative">
                <FiUser className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-rose-300 outline-none ${errors.name? 'border-rose-400':''}`} />
                {errors.name && <div className="mt-1 text-xs text-rose-600">{errors.name}</div>}
              </div>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-rose-300 outline-none ${errors.email? 'border-rose-400':''}`} />
                {errors.email && <div className="mt-1 text-xs text-rose-600">{errors.email}</div>}
              </div>
              <div className="relative">
                <FiMessageCircle className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-rose-300 outline-none ${errors.subject? 'border-rose-400':''}`} />
                {errors.subject && <div className="mt-1 text-xs text-rose-600">{errors.subject}</div>}
              </div>
              <div className="relative">
                <FiMessageCircle className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your message..." rows="4" className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-rose-300 outline-none resize-none ${errors.message? 'border-rose-400':''}`}></textarea>
                {errors.message && <div className="mt-1 text-xs text-rose-600">{errors.message}</div>}
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
