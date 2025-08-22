import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocale } from "./context/LocaleContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import AuthForm from "./components/auth/AuthForm";
import CustomerDashboard from "./components/dashboard/CustomerDashboard";
import ProviderDashboard from "./components/dashboard/ProviderDashboard";
import BookingPage from "./pages/BookingPage";
import AvailabilityPage from "./pages/AvailabilityPage";

export default function App() {
  const { locale } = useLocale();
  const { role, token } = useSelector((s) => s.auth);

  useEffect(() => {
    // Set document direction based on locale
    document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  }, [locale, role, token]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingRedirect />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/signup" element={<Navigate to="/auth" replace />} />

        <Route
          path="/customer"
          element={
            <ProtectedRoute allowRoles={["customer"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/book"
          element={
            <ProtectedRoute allowRoles={["customer"]}>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/provider"
          element={
            <ProtectedRoute allowRoles={["provider", "admin"]}>
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/availability"
          element={
            <ProtectedRoute allowRoles={["provider", "admin"]}>
              <AvailabilityPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </>
  );
}

function LandingRedirect() {
  const { role, token } = useSelector((s) => s.auth);
  
  if (token && role) {
    if (role === "provider" || role === "admin") {
      return <Navigate to="/provider" replace />;
    }
    if (role === "customer") {
      return <Navigate to="/customer" replace />;
    }
  }
  
  // If no token or role, go to auth page
  return <Navigate to="/auth" replace />;
}
