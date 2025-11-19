// d:\blood-donation\client\src\components\RequestBoard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiClock, FiMapPin, FiPhone, FiDroplet, FiCheckCircle } from "react-icons/fi";

const API_URL = `${import.meta.env.VITE_API_URL}`;
const bloodGroups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

function RequestBoard() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState({ city: "", bloodGroup: "", status: "open" });
  const [form, setForm] = useState({ patientName: "", bloodGroup: "A+", city: "", hospital: "", units: 1, contactPhone: "", neededBy: "", notes: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_URL}/api/requests`, { params: filter });
      setRequests(res.data);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [filter]);

  const topCities = Object.entries(requests.reduce((acc, r) => { if (r.city) acc[r.city] = (acc[r.city] || 0) + 1; return acc; }, {}))
    .sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name])=>name);

  const timeLeft = (neededBy) => {
    const now = new Date();
    const by = new Date(neededBy);
    const diff = by.getTime() - now.getTime();
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    return diff <= 0 ? "Past due" : `${days}d ${hours}h`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setToast("");
    try {
      const payload = { ...form, contactPhone: String(form.contactPhone).replace(/\D/g, "") };
      await axios.post(`${API_URL}/api/requests`, payload);
      setToast("Request posted");
      setForm({ patientName: "", bloodGroup: "A+", city: "", hospital: "", units: 1, contactPhone: "", neededBy: "", notes: "" });
      fetchRequests();
      setTimeout(() => setToast(""), 1500);
    } catch (e) {
      setToast(e?.response?.data?.error || e.message || "Failed to post request");
      setTimeout(() => setToast(""), 2000);
    } finally {
      setSubmitting(false);
    }
  };

  const markFulfilled = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/api/requests/${id}`, { status: "fulfilled" });
      setRequests((prev) => prev.map((r) => r._id === res.data._id ? res.data : r));
    } catch (e) {
      setToast("Failed to update request");
      setTimeout(() => setToast(""), 1500);
    }
  };

  const final = [...requests].sort((a, b) => new Date(a.neededBy) - new Date(b.neededBy));

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 p-6 pt-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-lg border border-rose-200 p-6 space-y-4">
          <h2 className="text-2xl font-bold text-rose-700">Post a Blood Request</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input className="border rounded-2xl px-4 py-3 w-full" placeholder="Patient name" value={form.patientName} onChange={(e)=>setForm({...form, patientName:e.target.value})} />
            <div className="flex gap-2">
              <select className="border rounded-2xl px-4 py-3" value={form.bloodGroup} onChange={(e)=>setForm({...form,bloodGroup:e.target.value})}>
                {bloodGroups.map(g => <option key={g}>{g}</option>)}
              </select>
              <input className="border rounded-2xl px-4 py-3 flex-1" placeholder="City" value={form.city} onChange={(e)=>setForm({...form, city:e.target.value})} />
            </div>
            <div className="flex gap-2">
              <input className="border rounded-2xl px-4 py-3 flex-1" placeholder="Hospital" value={form.hospital} onChange={(e)=>setForm({...form, hospital:e.target.value})} />
              <input type="number" min="1" className="border rounded-2xl px-4 py-3 w-28" placeholder="Units" value={form.units} onChange={(e)=>setForm({...form, units:Number(e.target.value)})} />
            </div>
            <div className="flex gap-2">
              <input className="border rounded-2xl px-4 py-3 flex-1" placeholder="Contact phone" value={form.contactPhone} onChange={(e)=>setForm({...form, contactPhone:e.target.value})} />
              <input type="datetime-local" className="border rounded-2xl px-4 py-3" value={form.neededBy} onChange={(e)=>setForm({...form, neededBy:e.target.value})} />
            </div>
            <input className="border rounded-2xl px-4 py-3 w-full" placeholder="Notes (optional)" value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} />
            {toast && <div className="px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">{toast}</div>}
            <button type="submit" disabled={submitting} className={`w-full px-5 py-3 rounded-2xl bg-red-600 text-white font-semibold shadow-lg transition ${submitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-700 hover:scale-[1.01]'}`}>
              {submitting ? 'Posting…' : 'Post Request'}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-3xl shadow-lg border border-rose-200 p-6 space-y-3">
            <h2 className="text-2xl font-bold text-rose-700">Urgent Requests</h2>
            <div className="flex flex-wrap gap-2">
              {bloodGroups.map((g) => (
                <button key={g} onClick={()=>setFilter({ ...filter, bloodGroup: g })} className={`px-3 py-1 rounded-full border text-sm ${filter.bloodGroup===g? 'bg-rose-600 text-white border-rose-600':'bg-rose-50 text-rose-700 border-rose-200'}`}>{g}</button>
              ))}
              {topCities.map((c) => (
                <button key={c} onClick={()=>setFilter({ ...filter, city: c })} className={`px-3 py-1 rounded-full border text-sm ${filter.city.toLowerCase()===c.toLowerCase()? 'bg-emerald-600 text-white border-emerald-600':'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{c}</button>
              ))}
              <button onClick={()=>setFilter({ city:"", bloodGroup:"", status: "open" })} className="px-3 py-1 rounded-full border text-sm bg-zinc-50 text-zinc-700 border-zinc-200">Reset</button>
              <div className="ml-auto flex items-center gap-2 text-sm">
                <label>Status</label>
                <select className="border rounded-2xl px-3 py-1" value={filter.status} onChange={(e)=>setFilter({ ...filter, status: e.target.value })}>
                  <option value="open">Open</option>
                  <option value="fulfilled">Fulfilled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-rose-200 p-6">
            {error && <div className="px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700">{error}</div>}
            {loading ? (
              <div className="space-y-3">{[...Array(4)].map((_,i)=>(<div key={i} className="p-5 border rounded-2xl animate-pulse bg-zinc-50" />))}</div>
            ) : requests.length === 0 ? (
              <p className="text-zinc-500 text-sm">No requests found.</p>
            ) : (
              [...requests].sort((a,b)=>new Date(a.neededBy)-new Date(b.neededBy)).map((r) => (
                <div key={r._id} className="group p-5 border rounded-3xl bg-white shadow-sm hover:shadow-xl transition hover:border-rose-300 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiDroplet className="w-5 h-5 text-red-600" />
                      <div className="font-semibold text-lg text-rose-800">{r.bloodGroup}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full border text-xs bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-1">
                      <FiClock className="w-4 h-4" /> {timeLeft(r.neededBy)}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">{r.city}</span>
                    {r.hospital && <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">{r.hospital}</span>}
                    {r.units ? <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">{r.units} unit(s)</span> : null}
                  </div>
                  <div className="mt-2 text-sm text-zinc-700">Patient: {r.patientName}</div>
                  {r.notes && <div className="text-xs text-zinc-500 mt-1">Notes: {r.notes}</div>}
                  <div className="mt-3 flex items-center gap-2">
                    <a href={`tel:${r.contactPhone}`} className="px-3 py-2 rounded-2xl bg-red-500 text-white hover:bg-red-600 text-sm flex items-center gap-2"><FiPhone className="w-4 h-4" /> Call</a>
                    {r.status === "open" ? (
                      <button onClick={()=>markFulfilled(r._id)} className="px-3 py-2 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm flex items-center gap-2">
                        <FiCheckCircle className="w-4 h-4" /> Mark Fulfilled
                      </button>
                    ) : (
                      <span className="px-3 py-2 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm flex items-center gap-2">
                        <FiCheckCircle className="w-4 h-4" /> Fulfilled
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestBoard;