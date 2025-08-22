import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './AvailabilityPage.css';

export default function AvailabilityPage() {
  const { name } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [availability, setAvailability] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState('monday');

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const timeSlots = [
    '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM'
  ];

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await getProviderAvailability();
      // setAvailability(response.data);
      
      // Mock data for now
      setTimeout(() => {
        const mockAvailability = {};
        daysOfWeek.forEach(day => {
          mockAvailability[day.key] = {
            isAvailable: day.key !== 'sunday',
            startTime: '9:00 AM',
            endTime: '5:00 PM',
            breakStart: '12:00 PM',
            breakEnd: '1:00 PM',
            selectedSlots: timeSlots.filter((_, index) => 
              index >= 2 && index <= 16 && index !== 6 && index !== 7
            )
          };
        });
        setAvailability(mockAvailability);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setIsLoading(false);
    }
  };

  const handleDayToggle = (dayKey) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        isAvailable: !prev[dayKey]?.isAvailable
      }
    }));
  };

  const handleTimeChange = (dayKey, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value
      }
    }));
  };

  const handleSlotToggle = (dayKey, slot) => {
    setAvailability(prev => {
      const currentSlots = prev[dayKey]?.selectedSlots || [];
      const newSlots = currentSlots.includes(slot)
        ? currentSlots.filter(s => s !== slot)
        : [...currentSlots, slot].sort((a, b) => timeSlots.indexOf(a) - timeSlots.indexOf(b));
      
      return {
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          selectedSlots: newSlots
        }
      };
    });
  };

  const handleSaveAvailability = async () => {
    try {
      setIsSaving(true);
      // TODO: Replace with actual API call
      // await updateProviderAvailability(availability);
      
      // Mock success
      setTimeout(() => {
        alert('Availability updated successfully!');
        setIsSaving(false);
        navigate('/provider');
      }, 1000);
    } catch (error) {
      console.error('Error saving availability:', error);
      setIsSaving(false);
    }
  };

  const getDayAvailability = (dayKey) => {
    return availability[dayKey] || {
      isAvailable: false,
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      breakStart: '12:00 PM',
      breakEnd: '1:00 PM',
      selectedSlots: []
    };
  };

  const renderDaySelector = () => (
    <div className="day-selector">
      {daysOfWeek.map(day => (
        <button
          key={day.key}
          className={`day-button ${selectedDay === day.key ? 'active' : ''}`}
          onClick={() => setSelectedDay(day.key)}
        >
          {day.label}
        </button>
      ))}
    </div>
  );

  const renderAvailabilityForm = () => {
    const dayData = getDayAvailability(selectedDay);
    
    return (
      <div className="availability-form">
        <div className="day-header">
          <h2>{daysOfWeek.find(d => d.key === selectedDay)?.label}</h2>
          <label className="availability-toggle">
            <input
              type="checkbox"
              checked={dayData.isAvailable}
              onChange={() => handleDayToggle(selectedDay)}
            />
            <span className="toggle-slider"></span>
            Available
          </label>
        </div>

        {dayData.isAvailable && (
          <>
            <div className="time-range-section">
              <h3>Working Hours</h3>
              <div className="time-inputs">
                <div className="time-input-group">
                  <label>Start Time</label>
                  <select
                    value={dayData.startTime}
                    onChange={(e) => handleTimeChange(selectedDay, 'startTime', e.target.value)}
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                <div className="time-input-group">
                  <label>End Time</label>
                  <select
                    value={dayData.endTime}
                    onChange={(e) => handleTimeChange(selectedDay, 'endTime', e.target.value)}
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="break-time-section">
              <h3>Break Time</h3>
              <div className="time-inputs">
                <div className="time-input-group">
                  <label>Break Start</label>
                  <select
                    value={dayData.breakStart}
                    onChange={(e) => handleTimeChange(selectedDay, 'breakStart', e.target.value)}
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                <div className="time-input-group">
                  <label>Break End</label>
                  <select
                    value={dayData.breakEnd}
                    onChange={(e) => handleTimeChange(selectedDay, 'breakEnd', e.target.value)}
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="time-slots-section">
              <h3>Available Time Slots</h3>
              <p className="section-description">
                Select the specific time slots you want to be available for bookings
              </p>
              <div className="time-slots-grid">
                {timeSlots.map(slot => {
                  const isSelected = dayData.selectedSlots.includes(slot);
                  const isInRange = isSlotInRange(slot, dayData.startTime, dayData.endTime);
                  const isBreakTime = isSlotInRange(slot, dayData.breakStart, dayData.breakEnd);
                  
                  return (
                    <button
                      key={slot}
                      className={`time-slot ${isSelected ? 'selected' : ''} ${!isInRange ? 'disabled' : ''} ${isBreakTime ? 'break-time' : ''}`}
                      onClick={() => isInRange && !isBreakTime && handleSlotToggle(selectedDay, slot)}
                      disabled={!isInRange || isBreakTime}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {!dayData.isAvailable && (
          <div className="unavailable-message">
            <p>You are not available on {daysOfWeek.find(d => d.key === selectedDay)?.label}</p>
          </div>
        )}
      </div>
    );
  };

  const isSlotInRange = (slot, startTime, endTime) => {
    const slotIndex = timeSlots.indexOf(slot);
    const startIndex = timeSlots.indexOf(startTime);
    const endIndex = timeSlots.indexOf(endTime);
    return slotIndex >= startIndex && slotIndex <= endIndex;
  };

  if (isLoading) {
    return (
      <div className="availability-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="availability-page">
      <div className="availability-header">
        <button className="back-button" onClick={() => navigate('/provider')}>
          ← Back to Dashboard
        </button>
        <h1>Manage Your Availability</h1>
        <p>Set your working hours and available time slots for each day</p>
      </div>

      <div className="availability-container">
        {renderDaySelector()}
        
        <div className="availability-content">
          {renderAvailabilityForm()}
        </div>

        <div className="availability-actions">
          <button
            className="save-button"
            onClick={handleSaveAvailability}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Availability'}
          </button>
          <button
            className="cancel-button"
            onClick={() => navigate('/provider')}
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
