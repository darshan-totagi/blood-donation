// client/src/components/DonorProfile.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiUser, FiPhone, FiDroplet, FiMapPin, FiClock, FiChevronLeft } from "react-icons/fi";

const API_URL = `${import.meta.env.VITE_API_URL}/api/donors`;

function DonorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    location: "",
    notes: "",
  });

  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        setDonor(res.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

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

  const formatTime12 = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    const am = h < 12;
    const hour = ((h + 11) % 12) + 1;
    return `${hour}:${String(m).padStart(2, "0")} ${am ? "AM" : "PM"}`;
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

  const eligibility = donor ? computeEligibility(donor.lastDonatedAt) : null;

  const handleAddDonation = async () => {
    setSaving(true);
    try {
      const payload = {
        date: form.date ? new Date(form.date).toISOString() : undefined,
        location: form.location || undefined,
        notes: form.notes || undefined,
      };
      const res = await axios.post(`${API_URL}/${id}/donations`, payload);
      setDonor(res.data);
      setForm({ date: new Date().toISOString().slice(0, 10), location: "", notes: "" });
    } catch (e) {
      alert("Failed to save donation");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!donor) return <div className="min-h-screen flex items-center justify-center">Not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 p-6 pt-24">
      <div className="max-w-3xl mx-auto space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-rose-700">
          <FiChevronLeft /> Back
        </button>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-rose-200 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-2xl">
            <FiUser className="w-6 h-6 text-rose-600" />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-semibold text-lg text-gray-800">{donor.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
            <FiPhone className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold text-lg text-gray-800">{donor.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl">
            <FiDroplet className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-sm text-gray-500">Blood Group</p>
              <p className="font-semibold text-lg text-gray-800">{donor.bloodGroup}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
            <FiMapPin className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">City</p>
              <p className="font-semibold text-lg text-gray-800">{donor.city}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl">
            <FiClock className="w-6 h-6 text-amber-600" />
            <div>
              <p className="text-sm text-gray-500">Eligibility</p>
              <p className="font-semibold text-lg text-gray-800">
                {eligibility?.eligibleNow ? "Eligible now" : `Eligible in ${eligibility?.daysRemaining} days`}
              </p>
              {!eligibility?.eligibleNow && (
                <p className="text-xs text-gray-500">Next eligible: {eligibility?.nextEligibleDate?.toLocaleDateString()}</p>
              )}
            </div>
          </div>

          {donor.availabilitySlots && donor.availabilitySlots.length > 0 ? (
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl">
              <FiClock className="w-6 h-6 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Availability</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {groupSlots(donor.availabilitySlots).map((g, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800">
                      {g.label} {formatTime12(g.startTime)}–{formatTime12(g.endTime)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
              <FiClock className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Availability</p>
                <p className="font-semibold text-lg text-gray-800">{donor.availability || "Available"}</p>
              </div>
            </div>
          )}

          {donor.notes && (
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-sm text-gray-500 mb-2">Notes</p>
              <p className="text-gray-800">{donor.notes}</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-rose-200 space-y-4">
          <h2 className="text-2xl font-bold text-rose-700">Donation History</h2>
          {donor.donationHistory && donor.donationHistory.length > 0 ? (
            <div className="space-y-2">
              {donor.donationHistory
                .slice()
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((h, i) => (
                  <div key={i} className="p-3 border rounded-2xl">
                    <div className="font-semibold">{new Date(h.date).toLocaleDateString()}</div>
                    <div className="text-sm text-zinc-600">{h.location || "Unknown location"}</div>
                    {h.notes && <div className="text-sm text-zinc-500">{h.notes}</div>}
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">No donations recorded.</p>
          )}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border rounded-xl px-4 py-2 w-full"
            />
            <input
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="border rounded-xl px-4 py-2 w-full"
            />
            <input
              type="text"
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="border rounded-xl px-4 py-2 w-full"
            />
          </div>
          <button
            onClick={handleAddDonation}
            disabled={saving}
            className="bg-red-600 text-white rounded-xl px-4 py-3 font-semibold w-full hover:bg-red-700 transition"
          >
            {saving ? "Saving…" : "Mark Donation"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DonorProfile;