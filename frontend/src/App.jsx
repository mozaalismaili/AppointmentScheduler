// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import BookingPage from "./BookingPage";
import AvailabilityPage from "./AvailabilityPage";
import CustomerDashboard from "./CustomerDashboard";
import ProviderDashboard from "./ProviderDashboard";

export default function App() {
  return (
    <Routes>
      {/* Default → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Customer */}
      <Route path="/customer" element={<CustomerDashboard />} />
      <Route path="/book" element={<BookingPage />} />

      {/* Provider */}
      <Route path="/provider" element={<ProviderDashboard />} />
      <Route path="/availability" element={<AvailabilityPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
