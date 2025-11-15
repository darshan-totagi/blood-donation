import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPhone, FiX, FiMapPin, FiDroplet, FiUser, FiClock } from "react-icons/fi";

const API_URL = "http://localhost:5000/api/donors";
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function DonorSearch() {
  const [donors, setDonors] = useState([]);
  const [filter, setFilter] = useState({ search: "", city: "", bloodGroup: "" });
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await axios.get(API_URL);
        setDonors(res.data);
      } catch (err) {
        console.error("Failed to fetch donors:", err);
      }
    };
    fetchDonors();
  }, []);

  // Blood group counts
  const counts = bloodGroups.reduce((acc, g) => {
    acc[g] = donors.filter((d) => d.bloodGroup === g).length;
    return acc;
  }, {});

  // Filtered donors
  const filteredDonors = donors.filter(
    (d) =>
      (filter.search === "" ||
        d.name?.toLowerCase().includes(filter.search.toLowerCase()) ||
        d.phone?.includes(filter.search)) &&
      (filter.city === "" ||
        d.city?.toLowerCase().includes(filter.city.toLowerCase())) &&
      (filter.bloodGroup === "" || d.bloodGroup === filter.bloodGroup)
  );

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
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-rose-200 space-y-4">
          <h2 className="text-2xl font-bold text-rose-700">Search Donors</h2>
          <div className="flex flex-wrap gap-3">
            <input
              placeholder="🔍 Search by name or phone"
              className="border rounded-2xl px-5 py-3 flex-1 focus:ring-2 focus:ring-rose-300 outline-none transition"
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
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
              onClick={() => setFilter({ search: "", city: "", bloodGroup: "" })}
              className="px-5 py-3 border border-red-400 text-red-600 rounded-2xl hover:bg-red-50 transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Donor List */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-rose-200 space-y-4">
          {filteredDonors.length === 0 ? (
            <p className="text-zinc-500 text-sm">No donors found matching filters.</p>
          ) : (
            filteredDonors.map((d, i) => (
              <div
                key={i}
                className="p-5 border rounded-2xl shadow-sm hover:shadow-md transition flex items-center justify-between gap-4"
              >
                <div>
                  <h3
                    className="font-semibold text-lg text-rose-700 cursor-pointer hover:text-rose-800 transition"
                    onClick={() => {
                      setSelectedDonor(d);
                      setIsModalOpen(true);
                    }}
                  >
                    {d.name}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    {d.city} • <span className="font-medium">{d.bloodGroup}</span>
                  </p>
                  {d.notes && <p className="text-xs text-zinc-400 mt-1">{d.notes}</p>}
                </div>

                {/* Call button */}
                {d.allowCall && (
                  <a
                    href={`tel:${d.phone}`}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-transform transform hover:scale-110"
                    title="Call Donor"
                  >
                    <FiPhone className="w-6 h-6" />
                  </a>
                )}
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

                  <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl">
                    <FiClock className="w-6 h-6 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Availability</p>
                      {selectedDonor.availabilitySlots && selectedDonor.availabilitySlots.length > 0 ? (
                        <div className="space-y-1">
                          {selectedDonor.availabilitySlots.map((s, i) => (
                            <p key={i} className="text-gray-800">{s.day} {s.startTime} - {s.endTime}</p>
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
