//import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import LandingPage from "./LandingPage";
import DonorRegistration from "./DonorRegistration";
import DonorSearch from "./DonorSearch";
import Contact from "./Contact";
import RequestBoard from "./RequestBoard";
import DonorProfile from "./DonorProfile";
import DonorMap from "./DonorMap";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<DonorRegistration />} />
        <Route path="/search" element={<DonorSearch />} />
        <Route path="/map" element={<DonorMap />} />
        <Route path="/donor/:id" element={<DonorProfile />} />
        <Route path="/requests" element={<RequestBoard />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
