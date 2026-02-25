import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FiPhone, FiX, FiMapPin, FiDroplet, FiUser, FiClock, FiEdit2, FiCopy, FiTarget, FiCheck, FiAlertCircle, FiMessageCircle, FiDownload, FiSend, FiPrinter } from "react-icons/fi";

const API_URL = `${import.meta.env.VITE_API_URL}/api/donors`;
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function DonorSearch() {
  const [donors, setDonors] = useState([]);
  const [filter, setFilter] = useState({ city: "", bloodGroup: "" });
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingLastDonation, setIsEditingLastDonation] = useState(false);
  const [lastDonationInput, setLastDonationInput] = useState("");
  const [savingLastDonation, setSavingLastDonation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [copyToast, setCopyToast] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [waTemplate, setWaTemplate] = useState("Hi {name}, we urgently need {bloodGroup} in {city}. Are you available to donate?");
  const [radiusKm, setRadiusKm] = useState(25);
  const [exportTitle, setExportTitle] = useState("Donor Roster");
  const [exportFrom, setExportFrom] = useState("");
  const [exportTo, setExportTo] = useState("");
  const [exportPageSize, setExportPageSize] = useState(20);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bg = params.get("bloodGroup");
    const city = params.get("city");
    const sort = params.get("sort");
    if (bg || city) setFilter({ city: city || "", bloodGroup: bg || "" });
    if (sort) setSortByDistance(sort === "distance");
  }, [location.search]);

  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(API_URL);
        setDonors(res.data);
      } catch (err) {
        console.error("Failed to fetch donors:", err);
        setError(err?.response?.data?.error || err.message || "Failed to fetch donors");
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  // Blood group counts
  const counts = bloodGroups.reduce((acc, g) => {
    acc[g] = donors.filter((d) => d.bloodGroup === g).length;
    return acc;
  }, {});
  const cityCounts = donors.reduce((acc, d) => {
    if (d.city) acc[d.city] = (acc[d.city] || 0) + 1;
    return acc;
  }, {});
  const topCities = Object.entries(cityCounts).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name])=>name);

  // Distance helpers and filtered donors
  const cityCoords = {
    ahmedabad: { lat: 23.0225, lng: 72.5714 },
    mumbai: { lat: 19.0760, lng: 72.8777 },
    delhi: { lat: 28.6139, lng: 77.2090 },
    bengaluru: { lat: 12.9716, lng: 77.5946 },
    pune: { lat: 18.5204, lng: 73.8567 },
    chennai: { lat: 13.0827, lng: 80.2707 },
    kolkata: { lat: 22.5726, lng: 88.3639 }
  };
  const haversineKm = (a, b) => {
    if (!a || !b) return null;
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
    return Math.round(R * 2 * Math.asin(Math.min(1, Math.sqrt(h))));
  };
  const cityToCoords = (city) => {
    if (!city) return null;
    const key = city.toLowerCase().trim();
    return cityCoords[key] || null;
  };
  const enhanced = donors.map((d) => {
    const dc = cityToCoords(d.city);
    const distanceKm = userLocation && dc ? haversineKm(userLocation, dc) : null;
    return { ...d, distanceKm };
  });
  const filteredDonors = enhanced.filter(
    (d) =>
      (filter.city === "" ||
        d.city?.toLowerCase().includes(filter.city.toLowerCase())) &&
      (filter.bloodGroup === "" || d.bloodGroup === filter.bloodGroup) &&
      (!userLocation || !radiusKm || (d.distanceKm != null && d.distanceKm <= radiusKm))
  );
  const finalDonors = sortByDistance
    ? [...filteredDonors].sort((a, b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9))
    : filteredDonors;

  const computeEligibility = (lastDonatedAt) => {
    if (!lastDonatedAt) return { eligibleNow: true };
    const last = new Date(lastDonatedAt);
    if (isNaN(last.getTime())) return { eligibleNow: true };
    const next = new Date(last);
    next.setDate(next.getDate() + 90);
    const now = new Date();
    const daysRemaining = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return { eligibleNow: next <= now, nextEligibleDate: next, daysRemaining: Math.max(daysRemaining, 0) };
  };
  const selectedEligibility = selectedDonor ? computeEligibility(selectedDonor.lastDonatedAt) : null;

  const formatTime12 = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    const am = h < 12;
    const hour = ((h + 11) % 12) + 1;
    return `${hour}:${m.toString().padStart(2, "0")} ${am ? "AM" : "PM"}`;
  };

  const toInputDate = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "";
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const handleSaveLastDonation = async () => {
    if (!selectedDonor) return;
    setSavingLastDonation(true);
    try {
      const payload = { lastDonatedAt: lastDonationInput ? new Date(lastDonationInput).toISOString() : null };
      const res = await axios.put(`${API_URL}/${selectedDonor._id}`, payload);
      setSelectedDonor(res.data);
      setDonors((prev) => prev.map((d) => (d._id === res.data._id ? res.data : d)));
      setIsEditingLastDonation(false);
    } catch (err) {
      console.error("Failed to update last donation date:", err);
      alert("Failed to update last donation date");
    } finally {
      setSavingLastDonation(false);
    }
  };

  const dayOrder = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const groupSlots = (slots) => {
    if (!Array.isArray(slots) || slots.length === 0) return [];
    const sorted = [...slots].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
    const groups = [];
    for (const s of sorted) {
      const idx = dayOrder.indexOf(s.day);
      const last = groups[groups.length - 1];
      if (last && last.endIdx + 1 === idx && last.startTime === s.startTime && last.endTime === s.endTime) {
        last.endIdx = idx;
      } else {
        groups.push({ startIdx: idx, endIdx: idx, startTime: s.startTime, endTime: s.endTime });
      }
    }
    return groups.map((g) => ({
      label: g.startIdx === g.endIdx ? dayOrder[g.startIdx] : `${dayOrder[g.startIdx]}–${dayOrder[g.endIdx]}`,
      startTime: g.startTime,
      endTime: g.endTime,
    }));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported"); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      (err) => { setError(err.message || "Failed to get location"); setLocating(false); }
    );
  };

  const selectedDonors = enhanced.filter((d) => selectedIds.has(d._id));
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const renderTemplateForDonor = (d) => waTemplate
    .replace('{name}', d.name || '')
    .replace('{bloodGroup}', d.bloodGroup || '')
    .replace('{city}', d.city || '');
  const handleCopySelectedPhones = () => {
    const phones = selectedDonors.map((d) => d.phone).join(', ');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phones);
      setCopyToast(`Copied ${selectedDonors.length} phone(s)`);
      setTimeout(()=>setCopyToast(''), 1500);
    }
  };
  const handleExportSelectedCSV = () => {
    const header = 'Name,Phone,BloodGroup,City,DistanceKm';
    const rows = selectedDonors.map((d) => [d.name, d.phone, d.bloodGroup, d.city || '', d.distanceKm ?? ''].join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'donors.csv'; a.click();
    URL.revokeObjectURL(url);
  };
  const sendWhatsAppToSelected = () => {
    let i = 0;
    for (const d of selectedDonors) {
      const phone = String(d.phone).replace(/\D/g, '');
      const text = encodeURIComponent(renderTemplateForDonor(d));
      const url = `https://wa.me/${phone}?text=${text}`;
      setTimeout(() => window.open(url, '_blank'), i * 400);
      i++;
    }
    setCopyToast(`Opened WhatsApp for ${selectedDonors.length} donor(s)`);
    setTimeout(()=>setCopyToast(''), 1500);
  };

  const buildPrintableRoster = (items, opts) => {
    const { title, from, to, pageSize } = opts;
    const printDate = new Date().toLocaleString();
    const style = `@page{margin:20mm} body{font-family:system-ui,-apple-system,Segoe UI,Roboto; padding:0; margin:0;} .page{padding:16px 24px; page-break-after:always;} .header{display:flex; align-items:center; gap:12px; margin-bottom:12px;} .logo{width:28px; height:28px} h1{font-size:18px; margin:0} .meta{font-size:12px; color:#6b7280} table{width:100%; border-collapse:collapse} th,td{border:1px solid #e5e7eb; padding:6px 8px; font-size:12px} th{background:#f9fafb; text-align:left} tr:nth-child(even){background:#fafafa} .footer{margin-top:8px; font-size:12px; color:#6b7280; display:flex; justify-content:space-between}`;
    const pages = [];
    for (let i=0;i<items.length;i+=pageSize) pages.push(items.slice(i,i+pageSize));
    const svg = `<svg class='logo' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path fill='#ef4444' d='M12 2c3 4 8 8 8 13a8 8 0 1 1-16 0c0-5 5-9 8-13z'/></svg>`;
    const dateRange = (from||to) ? `Date range: ${from||'—'} to ${to||'—'}` : '';
    const htmlPages = pages.map((page, idx) => {
      const rows = page.map((d) => `<tr><td>${d.name||''}</td><td>${d.phone||''}</td><td>${d.bloodGroup||''}</td><td>${d.city||''}</td><td>${d.distanceKm!=null?d.distanceKm:''}</td></tr>`).join('');
      return `<div class='page'><div class='header'>${svg}<div><h1>${title||'Donor Roster'}</h1><div class='meta'>${dateRange}</div></div></div><table><thead><tr><th>Name</th><th>Phone</th><th>Blood Group</th><th>City</th><th>Distance (km)</th></tr></thead><tbody>${rows}</tbody></table><div class='footer'><span>Printed: ${printDate}</span><span>Page ${idx+1} of ${pages.length}</span></div></div>`;
    }).join('');
    return `<!doctype html><html><head><meta charset='utf-8'><title>${title||'Donor Roster'}</title><style>${style}</style></head><body>${htmlPages}</body></html>`;
  };
  const handleExportSelectedPDF = () => {
    const base = selectedDonors.length ? selectedDonors : finalDonors;
    const filtered = base.filter((d) => {
      if (!exportFrom && !exportTo) return true;
      const dt = d.lastDonatedAt ? new Date(d.lastDonatedAt) : null;
      if (!dt || isNaN(dt.getTime())) return false;
      const fromOk = exportFrom ? new Date(exportFrom) <= dt : true;
      const toOk = exportTo ? dt <= new Date(exportTo) : true;
      return fromOk && toOk;
    });
    const html = buildPrintableRoster(filtered, { title: exportTitle, from: exportFrom, to: exportTo, pageSize: exportPageSize || 20 });
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 p-6 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Blood group availability */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-rose-200">
          <h2 className="text-2xl font-bold text-rose-700 mb-4">Blood Group Availability</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {bloodGroups.map((g) => (
              <div
                key={g}
                className={`p-4 rounded-xl border flex items-center justify-between shadow-sm transition-transform hover:scale-105 ${
                  counts[g] > 0 ? "bg-green-50 border-green-200" : "bg-zinc-50 border-zinc-200"
                }`}
              >
                <div className="font-semibold text-gray-700">{g}</div>
                <div className={`text-sm ${counts[g] ? "text-green-600 font-bold" : "text-zinc-400"}`}>
                  {counts[g]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-rose-200 space-y-4 sticky top-20 z-10 backdrop-blur-sm bg-white/90">
          <h2 className="text-2xl font-bold text-rose-700">Search Donors</h2>
          <div className="flex flex-wrap gap-3">

            <input
              placeholder="🏙️ City"
              className="border rounded-2xl px-5 py-3 w-44 focus:ring-2 focus:ring-rose-300 outline-none transition"
              value={filter.city}
              onChange={(e) => setFilter({ ...filter, city: e.target.value })}
            />
            <select
              className="border rounded-2xl px-5 py-3 focus:ring-2 focus:ring-rose-300 outline-none transition"
              value={filter.bloodGroup}
              onChange={(e) => setFilter({ ...filter, bloodGroup: e.target.value })}
            >
              <option value="">All Blood</option>
              {bloodGroups.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <button
              onClick={() => setFilter({ city: "", bloodGroup: "" })}
              className="px-5 py-3 border border-red-400 text-red-600 rounded-2xl hover:bg-red-50 transition"
            >
              Reset
            </button>
            <div className="w-full flex flex-wrap gap-2">
              {bloodGroups.map((g) => (
                <button
                  key={g}
                  onClick={() => setFilter({ ...filter, bloodGroup: g })}
                  className={`px-3 py-1 rounded-full border text-sm ${filter.bloodGroup===g? 'bg-rose-600 text-white border-rose-600':'bg-rose-50 text-rose-700 border-rose-200'}`}
>
                  {g} ({counts[g] || 0})
                </button>
              ))}
              {topCities.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter({ ...filter, city: c })}
                  className={`px-3 py-1 rounded-full border text-sm ${filter.city.toLowerCase()===c.toLowerCase()? 'bg-emerald-600 text-white border-emerald-600':'bg-emerald-50 text-emerald-700 border-emerald-200'}`}
>
                  {c} ({cityCounts[c] || 0})
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-rose-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-rose-700">Location & Distance</h2>
            <button
              onClick={detectLocation}
              className="px-4 py-2 rounded-2xl border border-rose-300 text-rose-700 hover:bg-rose-50"
            >
              {locating ? 'Detecting…' : 'Use my location'}
            </button>
          </div>
          {userLocation && (
            <div className="rounded-2xl overflow-hidden border">
              <iframe
                title="Your location"
                src={`https://maps.google.com/maps?q=${userLocation.lat},${userLocation.lng}&z=13&output=embed`}
                className="w-full h-64"
              />
            </div>
          )}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Sort by distance</label>
            <input type="checkbox" checked={sortByDistance} onChange={(e)=>setSortByDistance(e.target.checked)} className="accent-rose-600" />
            <span className="text-xs text-zinc-500">Distance shown when city coordinates available</span>
          </div>
        </div>

        {/* Donor List */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-rose-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm text-zinc-600">Select</label>
              <input type="checkbox" checked={selectionMode} onChange={(e)=>{ setSelectionMode(e.target.checked); if(!e.target.checked) setSelectedIds(new Set()); }} className="accent-rose-600" />
              {selectionMode && selectedIds.size > 0 && (
                <span className="text-sm text-zinc-700">{selectedIds.size} selected</span>
              )}
            </div>
            {selectionMode && selectedIds.size > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={waTemplate}
                  onChange={(e)=>setWaTemplate(e.target.value)}
                  placeholder="WhatsApp template. Use {name} {bloodGroup} {city}"
                  className="px-3 py-2 rounded-2xl border border-zinc-300 text-sm w-64"
                />
                <input
                  value={exportTitle}
                  onChange={(e)=>setExportTitle(e.target.value)}
                  placeholder="PDF title"
                  className="px-3 py-2 rounded-2xl border border-zinc-300 text-sm w-40"
                />
                <input type="date" value={exportFrom} onChange={(e)=>setExportFrom(e.target.value)} className="px-3 py-2 rounded-2xl border border-zinc-300 text-sm" />
                <input type="date" value={exportTo} onChange={(e)=>setExportTo(e.target.value)} className="px-3 py-2 rounded-2xl border border-zinc-300 text-sm" />
                <select value={exportPageSize} onChange={(e)=>setExportPageSize(Number(e.target.value))} className="px-3 py-2 rounded-2xl border border-zinc-300 text-sm">
                  <option value={10}>10/pg</option>
                  <option value={20}>20/pg</option>
                  <option value={30}>30/pg</option>
                </select>
                <button onClick={sendWhatsAppToSelected} className="px-3 py-2 rounded-2xl bg-green-500 text-white hover:bg-green-600 text-sm flex items-center gap-2"><FiSend className="w-4 h-4" /> Send WhatsApp</button>
                <button onClick={handleCopySelectedPhones} className="px-3 py-2 rounded-2xl border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-sm">Copy Phones</button>
                <button onClick={handleExportSelectedCSV} className="px-3 py-2 rounded-2xl border border-zinc-300 text-zinc-700 hover:bg-zinc-50 text-sm flex items-center gap-2"><FiDownload className="w-4 h-4" /> Export CSV</button>
                <button onClick={handleExportSelectedPDF} className="px-3 py-2 rounded-2xl border border-zinc-300 text-zinc-700 hover:bg-zinc-50 text-sm flex items-center gap-2"><FiPrinter className="w-4 h-4" /> Export PDF</button>
              </div>
            )}
          </div>
          {copyToast && (
            <div className="px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2"><FiCheck className="w-4 h-4" /> {copyToast}</div>
          )}
          {error && (
            <div className="px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2"><FiAlertCircle className="w-4 h-4" /> {error}</div>
          )}
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-5 border rounded-2xl animate-pulse bg-zinc-50" />
              ))}
            </div>
          ) : finalDonors.length === 0 ? (
            <p className="text-zinc-500 text-sm">No donors found matching filters.</p>
          ) : (
            finalDonors.map((d, i) => (
              <div
                key={i}
                className="p-5 border rounded-3xl border-l-4 border-rose-300 bg-gradient-to-br from-rose-50 via-white to-rose-50 shadow-sm hover:shadow-lg transition flex items-center justify-between gap-4"
              >
                <div>
                  <h3
                    className="font-semibold text-lg text-rose-700 cursor-pointer hover:text-rose-800 transition"
                    onClick={() => navigate(`/donor/${d._id}`)}
                  >
                    {d.name}
                  </h3>
                  <p className="text-sm text-zinc-500 flex items-center gap-2">
                    <span>{d.city} • <span className="font-medium">{d.bloodGroup}</span></span>
                    {d.distanceKm!=null && (
                      <span className="ml-1 px-2 py-0.5 rounded-full border text-xs bg-sky-100 text-sky-700 border-sky-200">{d.distanceKm} km</span>
                    )}
                    {(() => { const e = computeEligibility(d.lastDonatedAt); return (
                      <span className={`ml-1 px-2 py-0.5 rounded-full border text-xs ${e.eligibleNow ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                        {e.eligibleNow ? 'Eligible now' : `In ${e.daysRemaining}d`}
                      </span>
                    ); })()}
                  </p>
                  {d.availabilitySlots && d.availabilitySlots.length > 0 ? (
                    <div className="mt-1 flex items-center gap-2">
                      <FiClock className="w-4 h-4 text-amber-600" />
                      <div className="flex flex-wrap gap-1">
                        {groupSlots(d.availabilitySlots).slice(0, 3).map((g, idx) => (
                          <span key={idx} className="px-2 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-700">
                            {g.label} {formatTime12(g.startTime)}–{formatTime12(g.endTime)}
                          </span>
                        ))}
                        {groupSlots(d.availabilitySlots).length > 3 && (
                          <span className="px-2 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600">+{groupSlots(d.availabilitySlots).length - 3} more</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center gap-2">
                      <FiClock className="w-4 h-4 text-green-600" />
                      <span className="px-2 py-1 rounded-full bg-green-100 border border-green-200 text-green-700">{d.availability || 'Available'}</span>
                    </div>
                  )}
                  {d.notes && <p className="text-xs text-zinc-400 mt-1">{d.notes}</p>}
                </div>

                <div className="flex items-center gap-3">
                  {selectionMode && (
                    <input type="checkbox" checked={selectedIds.has(d._id)} onChange={()=>toggleSelect(d._id)} className="accent-rose-600" />
                  )}
                  {d.allowCall && (
                    <a
                      href={`tel:${d.phone}`}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-transform transform hover:scale-110"
                      title="Call Donor"
                    >
                      <FiPhone className="w-6 h-6" />
                    </a>
                  )}
                  <button
                    onClick={() => { if (navigator.clipboard) { navigator.clipboard.writeText(String(d.phone)); setCopiedId(d._id); setCopyToast('Phone copied'); setTimeout(()=>{ setCopyToast(''); setCopiedId(null); }, 1500); } }}
                    className={`w-12 h-12 flex items-center justify-center rounded-full border transition ${copiedId===d._id ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : 'border-rose-300 text-rose-700 hover:bg-rose-50'}`}
                    title="Copy Phone"
                  >
                    <FiCopy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => { const url = `${window.location.origin}/donor/${d._id}`; if (navigator.clipboard) { navigator.clipboard.writeText(url); setCopyToast('Link copied'); setTimeout(()=> setCopyToast(''), 1500); } }}
                    className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition"
                    title="Copy Profile Link"
                  >
                    <FiShare2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(d._id)}
                    className={`w-12 h-12 flex items-center justify-center rounded-full border transition ${favorites.has(d._id) ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'border-rose-300 text-rose-700 hover:bg-rose-50'}`}
                    title="Favorite"
                  >
                    <FiStar className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Donor Profile Modal */}
        {isModalOpen && selectedDonor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-rose-700">Donor Profile</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Profile Content */}
                <div className="space-y-4">
                  {/* Name */}
                  <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-2xl">
                    <FiUser className="w-6 h-6 text-rose-600" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-semibold text-lg text-gray-800">{selectedDonor.name}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                    <FiPhone className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-semibold text-lg text-gray-800">{selectedDonor.phone}</p>
                    </div>
                  </div>

                  {/* Blood Group */}
                  <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl">
                    <FiDroplet className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-500">Blood Group</p>
                      <p className="font-semibold text-lg text-gray-800">{selectedDonor.bloodGroup}</p>
                    </div>
                  </div>

                  {/* City */}
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
                    <FiMapPin className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-semibold text-lg text-gray-800">{selectedDonor.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
                    <FiDroplet className="w-6 h-6 text-purple-600" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Last Donated</p>
                          <p className="font-semibold text-lg text-gray-800">{selectedDonor.lastDonatedAt ? new Date(selectedDonor.lastDonatedAt).toLocaleDateString() : "Unknown"}</p>
                        </div>
                        {!isEditingLastDonation && (
                          <button
                            onClick={() => { setIsEditingLastDonation(true); setLastDonationInput(toInputDate(selectedDonor.lastDonatedAt)); }}
                            className="px-3 py-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2"
                          >
                            <FiEdit2 className="w-4 h-4" /> Edit
                          </button>
                        )}
                      </div>
                      {isEditingLastDonation && (
                        <div className="mt-3 flex items-center gap-2">
                          <input
                            type="date"
                            value={lastDonationInput}
                            onChange={(e) => setLastDonationInput(e.target.value)}
                            className="border rounded-xl px-3 py-2"
                          />
                          <button
                            onClick={handleSaveLastDonation}
                            disabled={savingLastDonation}
                            className="px-3 py-2 rounded-2xl bg-red-500 text-white hover:bg-red-600"
                          >
                            {savingLastDonation ? 'Saving…' : 'Save'}
                          </button>
                          <button
                            onClick={() => setIsEditingLastDonation(false)}
                            className="px-3 py-2 rounded-2xl bg-gray-200 text-gray-700 hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl">
                    <FiClock className="w-6 h-6 text-amber-600" />
                    <div>
                      <p className="text-sm text-gray-500">Eligibility</p>
                      {selectedEligibility ? (
                        <div>
                          <p className="font-semibold text-lg text-gray-800">
                            {selectedEligibility.eligibleNow ? "Eligible now" : `Eligible in ${selectedEligibility.daysRemaining} days`}
                          </p>
                          {!selectedEligibility.eligibleNow && (
                            <p className="text-xs text-gray-500">Next eligible: {selectedEligibility.nextEligibleDate.toLocaleDateString()}</p>
                          )}
                        </div>
                      ) : (
                        <p className="font-semibold text-lg text-gray-800">Eligible now</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl">
                    <FiClock className="w-6 h-6 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Availability</p>
                      {selectedDonor.availabilitySlots && selectedDonor.availabilitySlots.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {groupSlots(selectedDonor.availabilitySlots).map((g, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800">
                              {g.label} {formatTime12(g.startTime)}–{formatTime12(g.endTime)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="font-semibold text-lg text-gray-800">{selectedDonor.availability}</p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedDonor.notes && (
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-sm text-gray-500 mb-2">Notes</p>
                      <p className="text-gray-800">{selectedDonor.notes}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {selectedDonor.allowCall && (
                    <a
                      href={`tel:${selectedDonor.phone}`}
                      className="flex-1 bg-red-500 text-white py-3 px-4 rounded-2xl font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2"
                    >
                      <FiPhone className="w-5 h-5" />
                      Call Donor
                    </a>
                  )}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-2xl font-semibold hover:bg-gray-300 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default DonorSearch;
