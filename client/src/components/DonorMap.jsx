import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { FiNavigation, FiPhone, FiMapPin, FiDroplet, FiClock, FiUser, FiFilter } from "react-icons/fi";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom blood group icons
const createBloodGroupIcon = (bloodGroup) => {
  return L.divIcon({
    html: `
      <div class="relative">
        <div class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-white">
          ${bloodGroup}
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-600 rotate-45 border-r border-b border-white"></div>
      </div>
    `,
    className: 'blood-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

const API_URL = `${import.meta.env.VITE_API_URL}/api/donors`;
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// City coordinates (extended)
const cityCoords = {
  ahmedabad: { lat: 23.0225, lng: 72.5714, name: "Ahmedabad" },
  mumbai: { lat: 19.0760, lng: 72.8777, name: "Mumbai" },
  delhi: { lat: 28.6139, lng: 77.2090, name: "Delhi" },
  bengaluru: { lat: 12.9716, lng: 77.5946, name: "Bengaluru" },
  pune: { lat: 18.5204, lng: 73.8567, name: "Pune" },
  chennai: { lat: 13.0827, lng: 80.2707, name: "Chennai" },
  kolkata: { lat: 22.5726, lng: 88.3639, name: "Kolkata" },
  hyderabad: { lat: 17.3850, lng: 78.4867, name: "Hyderabad" },
  jaipur: { lat: 26.9124, lng: 75.7873, name: "Jaipur" },
  lucknow: { lat: 26.8467, lng: 80.9462, name: "Lucknow" }
};

// LocationUpdater component - Fixed to handle map instance properly
function LocationUpdater({ center, onLocationUpdate }) {
  const map = useMap();
  const updateInProgress = useRef(false);
  
  useEffect(() => {
    if (map && center && !updateInProgress.current) {
      updateInProgress.current = true;
      map.setView([center.lat, center.lng], map.getZoom());
      setTimeout(() => {
        updateInProgress.current = false;
      }, 100);
    }
  }, [center, map]);

  useEffect(() => {
    if (!map) return;

    const handleMove = () => {
      const center = map.getCenter();
      onLocationUpdate({ lat: center.lat, lng: center.lng });
    };

    map.on('moveend', handleMove);
    return () => {
      map.off('moveend', handleMove);
    };
  }, [map, onLocationUpdate]);

  return null;
}

// MapWrapper component to ensure proper initialization
function MapWrapper({ center, zoom, children, style, ...props }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div 
        style={style} 
        className="flex items-center justify-center bg-gray-100 rounded-2xl"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      style={style}
      {...props}
    >
      {children}
    </MapContainer>
  );
}

function DonorMap() {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: 28.6139, lng: 77.2090 }); // Default to Delhi
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [filters, setFilters] = useState({
    bloodGroup: "",
    radius: 50, // km
    city: ""
  });
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mapKey, setMapKey] = useState(Date.now()); // Key to force re-render

  // Haversine distance calculation
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Hook calls properly placed inside the function component
  useEffect(() => {
    fetchDonors();
    detectUserLocation();
  }, []);

  useEffect(() => {
    filterDonors();
  }, [donors, filters, userLocation]);

  const fetchDonors = async () => {
    try {
      const res = await axios.get(API_URL);
      const donorsWithCoords = res.data.map(donor => {
        const cityKey = donor.city?.toLowerCase().trim();
        const coords = cityCoords[cityKey] || null;
        return {
          ...donor,
          coordinates: coords ? { lat: coords.lat, lng: coords.lng } : null
        };
      }).filter(donor => donor.coordinates !== null);
      
      setDonors(donorsWithCoords);
    } catch (err) {
      console.error("Failed to fetch donors:", err);
    } finally {
      setLoading(false);
    }
  };

  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setMapCenter({ lat: latitude, lng: longitude });
        setMapKey(Date.now()); // Force map re-render
        setLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocating(false);
        // Fallback to first available city
        const firstCity = Object.values(cityCoords)[0];
        if (firstCity) {
          setUserLocation({ lat: firstCity.lat, lng: firstCity.lng });
          setMapCenter({ lat: firstCity.lat, lng: firstCity.lng });
          setMapKey(Date.now()); // Force map re-render
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const filterDonors = () => {
    let filtered = donors.filter(donor => {
      // Blood group filter
      if (filters.bloodGroup && donor.bloodGroup !== filters.bloodGroup) {
        return false;
      }
      
      // City filter
      if (filters.city && donor.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
      
      // Radius filter
      if (donor.coordinates) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          donor.coordinates.lat,
          donor.coordinates.lng
        );
        donor.distance = Math.round(distance);
        return distance <= filters.radius;
      }
      
      return false;
    });

    // Sort by distance
    filtered.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    setFilteredDonors(filtered);
  };

  const openGoogleMaps = (lat, lng, donorName) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving&dir_action=navigate`;
    window.open(url, '_blank');
  };

  const computeEligibility = (lastDonatedAt) => {
    if (!lastDonatedAt) return { eligibleNow: true };
    const last = new Date(lastDonatedAt);
    if (isNaN(last.getTime())) return { eligibleNow: true };
    const next = new Date(last);
    next.setDate(next.getDate() + 90);
    const now = new Date();
    const daysRemaining = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return { eligibleNow: next <= now, daysRemaining: Math.max(daysRemaining, 0) };
  };

  const getAvailableCities = () => {
    const cities = [...new Set(donors.map(d => d.city).filter(Boolean))];
    return cities.sort();
  };

  const handleCenterUpdate = (newCenter) => {
    setMapCenter(newCenter);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 pt-20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg border border-rose-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-rose-700">Find Donors Near You</h1>
              <p className="text-gray-600 mt-2">
                {filteredDonors.length} donors found within {filters.radius}km
                {filters.bloodGroup && ` with blood group ${filters.bloodGroup}`}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={detectUserLocation}
                disabled={locating}
                className="px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                <FiNavigation className="w-4 h-4" />
                {locating ? 'Locating...' : 'My Location'}
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-rose-600 text-white rounded-2xl hover:bg-rose-700 transition flex items-center gap-2"
              >
                <FiFilter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-4 bg-rose-50 rounded-2xl border border-rose-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Blood Group Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group
                  </label>
                  <select
                    value={filters.bloodGroup}
                    onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
                    className="w-full border rounded-2xl px-4 py-2 focus:ring-2 focus:ring-rose-300 outline-none"
                  >
                    <option value="">All Blood Groups</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    className="w-full border rounded-2xl px-4 py-2 focus:ring-2 focus:ring-rose-300 outline-none"
                  >
                    <option value="">All Cities</option>
                    {getAvailableCities().map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Radius Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Radius: {filters.radius}km
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={filters.radius}
                    onChange={(e) => setFilters({ ...filters, radius: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5km</span>
                    <span>200km</span>
                  </div>
                </div>
              </div>

              {/* Quick Blood Group Filters */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Filters:
                </label>
                <div className="flex flex-wrap gap-2">
                  {bloodGroups.map(group => (
                    <button
                      key={group}
                      onClick={() => setFilters({ ...filters, bloodGroup: group })}
                      className={`px-3 py-1 rounded-full border text-sm transition ${
                        filters.bloodGroup === group
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-red-700 border-red-200 hover:bg-red-50'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                  <button
                    onClick={() => setFilters({ ...filters, bloodGroup: "" })}
                    className="px-3 py-1 rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donors List */}
          <div className="bg-white rounded-3xl shadow-lg border border-rose-200 p-6 lg:max-h-[600px] overflow-y-auto">
            <h2 className="text-xl font-bold text-rose-700 mb-4">Nearby Donors</h2>
            
            {filteredDonors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiUser className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No donors found matching your criteria</p>
                <p className="text-sm mt-2">Try adjusting your filters or search radius</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDonors.map((donor, index) => {
                  const eligibility = computeEligibility(donor.lastDonatedAt);
                  return (
                    <div
                      key={donor._id || index}
                      className="p-4 border rounded-2xl hover:shadow-md transition cursor-pointer"
                      onClick={() => {
                        if (donor.coordinates) {
                          setMapCenter(donor.coordinates);
                          setMapKey(Date.now()); // Force map re-render
                        }
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-800">{donor.name}</h3>
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                          {donor.bloodGroup}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FiMapPin className="w-4 h-4" />
                          <span>{donor.city}</span>
                          {donor.distance && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                              {donor.distance}km away
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <FiClock className="w-4 h-4" />
                          <span className={eligibility.eligibleNow ? 'text-green-600' : 'text-amber-600'}>
                            {eligibility.eligibleNow ? 'Eligible now' : `Eligible in ${eligibility.daysRemaining} days`}
                          </span>
                        </div>

                        {donor.availability && (
                          <div className="flex items-center gap-2">
                            <FiClock className="w-4 h-4" />
                            <span>{donor.availability}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-3">
                        {donor.allowCall && donor.phone && (
                          <a
                            href={`tel:${donor.phone}`}
                            className="flex-1 bg-green-600 text-white py-2 px-3 rounded-xl text-sm text-center hover:bg-green-700 transition flex items-center justify-center gap-1"
                          >
                            <FiPhone className="w-3 h-3" />
                            Call
                          </a>
                        )}
                        
                        {donor.coordinates && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openGoogleMaps(donor.coordinates.lat, donor.coordinates.lng, donor.name);
                            }}
                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-xl text-sm hover:bg-blue-700 transition flex items-center justify-center gap-1"
                          >
                            <FiNavigation className="w-3 h-3" />
                            Navigate
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg border border-rose-200 p-6 h-[600px]">
              <MapWrapper
                key={mapKey}
                center={mapCenter}
                zoom={10}
                style={{ height: '100%', width: '100%', borderRadius: '16px' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                <LocationUpdater 
                  center={mapCenter} 
                  onLocationUpdate={handleCenterUpdate}
                />

                {/* User Location Marker */}
                <Marker 
                  position={[userLocation.lat, userLocation.lng]}
                  icon={L.divIcon({
                    html: `
                      <div class="relative">
                        <div class="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45"></div>
                      </div>
                    `,
                    className: 'user-location-marker',
                    iconSize: [24, 24],
                    iconAnchor: [12, 24]
                  })}
                >
                  <Popup>
                    <div className="text-center">
                      <strong>Your Location</strong>
                    </div>
                  </Popup>
                </Marker>

                {/* Donor Markers */}
                {filteredDonors.map((donor, index) => {
                  if (!donor.coordinates) return null;
                  
                  const eligibility = computeEligibility(donor.lastDonatedAt);
                  return (
                    <Marker
                      key={donor._id || index}
                      position={[donor.coordinates.lat, donor.coordinates.lng]}
                      icon={createBloodGroupIcon(donor.bloodGroup)}
                    >
                      <Popup>
                        <div className="min-w-[200px]">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-800">{donor.name}</h3>
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                              {donor.bloodGroup}
                            </span>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <FiMapPin className="w-3 h-3" />
                              <span>{donor.city}</span>
                            </div>
                            
                            {donor.distance && (
                              <div className="flex items-center gap-2">
                                <FiNavigation className="w-3 h-3" />
                                <span>{donor.distance}km away</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <FiClock className="w-3 h-3" />
                              <span className={eligibility.eligibleNow ? 'text-green-600' : 'text-amber-600'}>
                                {eligibility.eligibleNow ? 'Eligible now' : `Eligible in ${eligibility.daysRemaining} days`}
                              </span>
                            </div>

                            {donor.phone && donor.allowCall && (
                              <div className="flex items-center gap-2">
                                <FiPhone className="w-3 h-3" />
                                <span>{donor.phone}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 mt-3">
                            {donor.allowCall && donor.phone && (
                              <a
                                href={`tel:${donor.phone}`}
                                className="flex-1 bg-green-600 text-white py-1 px-2 rounded text-xs text-center hover:bg-green-700 transition"
                              >
                                Call
                              </a>
                            )}
                            
                            <button
                              onClick={() => openGoogleMaps(donor.coordinates.lat, donor.coordinates.lng, donor.name)}
                              className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-xs hover:bg-blue-700 transition"
                            >
                              Navigate
                            </button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapWrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorMap;