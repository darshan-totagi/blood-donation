import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import DonorRegistration from "./DonorRegistration";
import DonorSearch from "./DonorSearch";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<DonorRegistration />} />
        <Route path="/search" element={<DonorSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
