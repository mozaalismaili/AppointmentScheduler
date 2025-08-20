import React, { useEffect, useState } from "react";
import { getProviderAppointments } from "../api/appointmentApi";

const ProviderDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  // ⚠️ Replace with logged-in providerId from auth later
  const providerId = "22222222-2222-2222-2222-222222222222";

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getProviderAppointments(providerId);
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching provider appointments:", error);
      }
    };
    fetchAppointments();
  }, [providerId]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Provider Schedule</h2>
      <ul className="space-y-3">
        {appointments.map((appt) => (
          <li key={appt.id} className="border rounded-lg p-3 shadow-sm">
            <p><strong>Customer:</strong> {appt.customerId}</p>
            <p><strong>Date:</strong> {appt.date}</p>
            <p><strong>Time:</strong> {appt.startTime} - {appt.endTime}</p>
            <p><strong>Status:</strong> {appt.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProviderDashboard;
