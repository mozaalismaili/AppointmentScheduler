import React, { useEffect, useState } from "react";
import { fetchProviderAppointments } from "../api";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchProviderAppointments().then(setAppointments);
  }, []);

  return (
    <div>
      <h3>My Appointments</h3>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <ul>
          {appointments.map((a) => (
            <li key={a.id}>
              {a.customerName} - {a.date} - {a.time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
