import React, { useState } from 'react';
//import './BookingPage.css'; // Reuse CSS if applicable
import "./AvailabilityPage.css";

export default function AvailabilityPage() {
    const [workingDays, setWorkingDays] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [duration, setDuration] = useState('30');

    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleCheckboxChange = (day) => {
        setWorkingDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            workingDays,
            startTime,
            endTime,
            duration: parseInt(duration),
        };

        console.log('Availability Data:', data);

        // TODO: Replace with actual API endpoint when backend is ready
        // fetch('/api/availability', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // })
        // .then(res => res.json())
        // .then(response => console.log('Saved!', response));
    };

    return (
       <div className="availability-container">
    <form className="availability-form" onSubmit={handleSubmit}>
      <div>
        <label>Select Working Days:</label>
        <div className="days-checkboxes">
          {allDays.map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                value={day}
                checked={workingDays.includes(day)}
                onChange={() => handleCheckboxChange(day)}
              />
              {day}
            </label>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Start Time:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Appointment Duration:</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)}>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>
      </div>

      <button type="submit">Save Availability</button>
    </form>
  </div>
    );
}
