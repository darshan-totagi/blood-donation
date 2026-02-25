import { useState } from "react";
import { FiMail, FiUser, FiMessageCircle, FiSend, FiPhone, FiMapPin } from "react-icons/fi";

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

  const resetForm = () => {
    setFormData({ name: "", email: "", subject: "", message: "", category: "General" });
    setErrors({});
    localStorage.removeItem("contactDraft");
    setToast("Form reset");
    setTimeout(() => setToast(""), 1000);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const [eligAnswers, setEligAnswers] = useState({ age: '', weight: '', lastDonationMonths: '', hemoglobin: '', pregnant: false, hasCold: false });
  const [eligResult, setEligResult] = useState(null);
  const [eligReasons, setEligReasons] = useState([]);
  const checkEligibility = () => {
    const r = [];
    const age = Number(eligAnswers.age);
    const weight = Number(eligAnswers.weight);
    const months = Number(eligAnswers.lastDonationMonths);
    const hb = Number(eligAnswers.hemoglobin);
    if (!age || age < 18 || age > 65) r.push("Age must be between 18 and 65");
    if (!weight || weight < 50) r.push("Weight must be at least 50 kg");
    if (!months || months < 3) r.push("Last donation should be at least 3 months ago");
    if (!hb || hb < 12.5) r.push("Hemoglobin should be at least 12.5 g/dL");
    if (eligAnswers.pregnant) r.push("Cannot donate while pregnant");
    if (eligAnswers.hasCold) r.push("Postpone if currently sick");
    setEligReasons(r);
    setEligResult(r.length === 0);
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
    <section id="contact" className="relative min-h-screen flex items-center bg-gradient-to-br from-rose-50 via-white to-rose-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-black py-20 px-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-rose-200 dark:bg-zinc-700 rounded-full blur-3xl opacity-40 dark:opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-200 dark:bg-zinc-700 rounded-full blur-3xl opacity-40 dark:opacity-10 animate-ping"></div>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-8">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-rose-100 dark:border-zinc-800">
          <h2 className="text-3xl font-bold text-rose-700 dark:text-rose-300 mb-6 text-center">Contact Us</h2>
          {!submitted ? (
            <form id="contactForm" onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-5 text-gray-700 dark:text-zinc-200">
              <div className="flex flex-wrap gap-2">
                {['General','Support','Feedback','Partnership'].map((c) => (
                  <button type="button" key={c} onClick={() => setFormData({ ...formData, category: c })} className={`px-3 py-1 rounded-full border text-sm transition duration-200 ease-out hover:scale-105 ${formData.category===c? 'bg-rose-600 text-white border-rose-600 dark:bg-rose-600 dark:border-rose-600 shadow-md':'bg-rose-50 text-rose-700 border-rose-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 hover:shadow'}`}>{c}</button>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Autosaves locally</span>
                <button type="button" onClick={clearDraft} className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 group">
                  <FiRotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                  Clear draft
                </button>
              </div>
              <div className="relative">
                <FiUser className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-400 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-400 ${errors.name? 'border-rose-400':''}`} />
                {errors.name && <div className="mt-1 text-xs text-rose-600 dark:text-rose-300">{errors.name}</div>}
              </div>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-400 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-400 ${errors.email? 'border-rose-400':''}`} />
                {errors.email && <div className="mt-1 text-xs text-rose-600 dark:text-rose-300">{errors.email}</div>}
              </div>
              <div className="relative">
                <FiMessageCircle className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-400 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-400 ${errors.subject? 'border-rose-400':''}`} />
                {errors.subject && <div className="mt-1 text-xs text-rose-600 dark:text-rose-300">{errors.subject}</div>}
              </div>
              <div className="relative">
                <FiMessageCircle className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your message..." rows="4" maxLength={500} className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-400 outline-none resize-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-400 ${errors.message? 'border-rose-400':''}`}></textarea>
                {errors.message && <div className="mt-1 text-xs text-rose-600 dark:text-rose-300">{errors.message}</div>}
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 text-right">{formData.message.length}/500</div>
              </div>
              {toast && <div className="px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-200">{toast}</div>}
              <button type="submit" disabled={loading} className={`group w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 dark:from-rose-700 dark:to-red-700 text-white font-semibold shadow-lg transition-all duration-300 ease-out hover:brightness-110 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-rose-300 dark:focus:ring-rose-600 disabled:opacity-60 disabled:cursor-not-allowed`}>
                <FiSend className={`w-5 h-5 transition-transform ${loading ? 'animate-spin' : 'group-hover:translate-x-0.5'}`} /> {loading ? 'Sending…' : 'Send Message'}
              </button>
              <button type="button" onClick={resetForm} className="w-full mt-2 px-5 py-3 rounded-2xl border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-700 transition">
                Reset Form
              </button>
            </form>
          ) : (
            <div className="text-center text-green-600 dark:text-green-400 font-semibold">✅ Thank you! Your message has been sent.</div>
          )}
        </div>
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-rose-100 dark:border-zinc-800 space-y-6">
          <h3 className="text-2xl font-bold text-rose-700 dark:text-rose-300">Reach Us</h3>
          <div className="space-y-3 text-zinc-700 dark:text-zinc-300">
            <div className="flex items-center gap-3"><FiPhone className="w-5 h-5 text-rose-600 dark:text-rose-400" /><span>+91 98765 43210</span></div>
            <div className="flex items-center gap-3"><FiMail className="w-5 h-5 text-rose-600 dark:text-rose-400" /><span>support@bloodconnect.org</span></div>
            <div className="flex items-center gap-3"><FiMapPin className="w-5 h-5 text-rose-600 dark:text-rose-400" /><span>123, Red Cross Street, Bengaluru</span></div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-rose-700 dark:text-rose-300">Eligibility Checker</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <input type="number" min="0" placeholder="Age" value={eligAnswers.age} onChange={(e)=>setEligAnswers({...eligAnswers, age: e.target.value})} className="w-full px-3 py-2 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100" />
              <input type="number" min="0" placeholder="Weight (kg)" value={eligAnswers.weight} onChange={(e)=>setEligAnswers({...eligAnswers, weight: e.target.value})} className="w-full px-3 py-2 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100" />
              <input type="number" min="0" placeholder="Months since last donation" value={eligAnswers.lastDonationMonths} onChange={(e)=>setEligAnswers({...eligAnswers, lastDonationMonths: e.target.value})} className="w-full px-3 py-2 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100" />
              <input type="number" min="0" step="0.1" placeholder="Hemoglobin (g/dL)" value={eligAnswers.hemoglobin} onChange={(e)=>setEligAnswers({...eligAnswers, hemoglobin: e.target.value})} className="w-full px-3 py-2 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100" />
            </div>
            <div className="flex items-center gap-6 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={eligAnswers.pregnant} onChange={(e)=>setEligAnswers({...eligAnswers, pregnant: e.target.checked})} /><span className="text-zinc-700 dark:text-zinc-300">Pregnant</span></label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={eligAnswers.hasCold} onChange={(e)=>setEligAnswers({...eligAnswers, hasCold: e.target.checked})} /><span className="text-zinc-700 dark:text-zinc-300">Currently sick</span></label>
            </div>
            <button type="button" onClick={checkEligibility} className="group px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 dark:from-rose-700 dark:to-red-700 text-white font-medium transition-all duration-300 ease-out hover:brightness-110 hover:shadow-lg active:scale-95 w-full md:w-auto">Check Eligibility <span className="transition-transform group-hover:translate-x-0.5">→</span></button>
            {eligResult !== null && (
              <div className={`px-4 py-3 rounded-2xl border ${eligResult? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-200':'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-700 text-rose-700 dark:text-rose-200'}`}>
                <div className="flex items-center gap-2 font-semibold">
                  {eligResult ? <FiCheckCircle className="w-5 h-5" /> : <FiAlertTriangle className="w-5 h-5" />}
                  {eligResult ? 'You appear eligible to donate.' : 'Not eligible right now.'}
                </div>
                {!eligResult && eligReasons.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {eligReasons.map((r,i)=>(<li key={i}>{r}</li>))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl overflow-hidden border dark:border-zinc-800">
            <iframe title="BloodConnect HQ" src="https://maps.google.com/maps?q=Bengaluru&z=12&output=embed" className="w-full h-56" />
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Mon–Fri 9:00–18:00 IST</div>
        </div>
      </div>
    </section>
  );
}
