import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookingPage from "./BookingPage";
import AvailabilityPage from "./AvailabilityPage";
import LoginSignup from "./components/LoginSignup/LoginSignup";
import ProviderDashboard from "./ProviderDashboard";   
import "./components/LoginSignup/LoginSignup.css";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage → Booking */}
        <Route path="/" element={<BookingPage apiBaseUrl="http://localhost:3001" />} />

        {/* Login/Signup */}
        <Route path="/login" element={<LoginSignup />} />

        {/* Availability */}
        <Route path="/availability" element={<AvailabilityPage />} />

        {/* Provider Dashboard (calendar view) */}
        <Route path="/provider" element={<ProviderDashboard />} /> 
      </Routes>
    </Router>
  );
}
