import React, { useEffect, useState } from "react";
import { getCustomerAppointments } from "../api/appointmentApi";

const CustomerDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  // ⚠️ Replace with logged-in customerId from auth later
  const customerId = "11111111-1111-1111-1111-111111111111";

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getCustomerAppointments(customerId);
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching customer appointments:", error);
      }
    };
    fetchAppointments();
  }, [customerId]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Appointments</h2>
      <ul className="space-y-3">
        {appointments.map((appt) => (
          <li key={appt.id} className="border rounded-lg p-3 shadow-sm">
            <p><strong>Date:</strong> {appt.date}</p>
            <p><strong>Time:</strong> {appt.startTime} - {appt.endTime}</p>
            <p><strong>Status:</strong> {appt.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerDashboard;
