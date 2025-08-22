import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { t } from '../locales/translations';
import './AvailabilityPage.css';

export default function AvailabilityPage() {
  const { name } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const { locale } = useLocale();
  
  const [availability, setAvailability] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState('monday');

  const daysOfWeek = [
    { key: 'monday', label: t('monday', locale) },
    { key: 'tuesday', label: t('tuesday', locale) },
    { key: 'wednesday', label: t('wednesday', locale) },
    { key: 'thursday', label: t('thursday', locale) },
    { key: 'friday', label: t('friday', locale) },
    { key: 'saturday', label: t('saturday', locale) },
    { key: 'sunday', label: t('sunday', locale) }
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
      
      // Initialize empty availability for now
      const emptyAvailability = {};
      daysOfWeek.forEach(day => {
        emptyAvailability[day.key] = {
          isAvailable: false,
          startTime: '9:00 AM',
          endTime: '5:00 PM',
          breakStart: '12:00 PM',
          breakEnd: '1:00 PM',
          selectedSlots: []
        };
      });
      setAvailability(emptyAvailability);
      setIsLoading(false);
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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(t('availabilityUpdated', locale));
      setIsSaving(false);
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
            {dayData.isAvailable ? t('available', locale) : t('notAvailable', locale)}
          </label>
        </div>

        {dayData.isAvailable && (
          <>
            <div className="time-range-section">
              <h3>{t('workingHours', locale)}</h3>
              <div className="time-inputs">
                <div className="time-input-group">
                  <label>{t('startTime', locale)}</label>
                  <select
                    value={dayData.startTime}
                    onChange={(e) => handleTimeChange(selectedDay, 'startTime', e.target.value)}
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{t(slot, locale)}</option>
                    ))}
                  </select>
                </div>
                <div className="time-input-group">
                  <label>{t('endTime', locale)}</label>
                  <select
                    value={dayData.endTime}
                    onChange={(e) => handleTimeChange(selectedDay, 'endTime', e.target.value)}
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{t(slot, locale)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="break-time-section">
              <h3>{t('breakTime', locale)}</h3>
              <div className="time-inputs">
                <div className="time-input-group">
                  <label>{t('breakStart', locale)}</label>
                  <select
                    value={dayData.breakStart}
                    onChange={(e) => handleTimeChange(selectedDay, 'breakStart', e.target.value)}
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{t(slot, locale)}</option>
                    ))}
                  </select>
                </div>
                <div className="time-input-group">
                  <label>{t('breakEnd', locale)}</label>
                  <select
                    value={dayData.breakEnd}
                    onChange={(e) => handleTimeChange(selectedDay, 'breakEnd', e.target.value)}
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{t(slot, locale)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="time-slots-section">
              <h3>{t('availableTimeSlots', locale)}</h3>
              <p className="section-description">
                {t('selectTimeSlots', locale)}
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
                      {t(slot, locale)}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {!dayData.isAvailable && (
          <div className="unavailable-message">
            <p>{t('unavailableMessage', locale, { day: daysOfWeek.find(d => d.key === selectedDay)?.label })}</p>
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
          <p>{t('loading', locale)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="availability-page">
      <div className="availability-header">
        <div className="header-content">
          <h1>{t('manageAvailability', locale)}</h1>
          <p>{t('setWorkingHours', locale)}</p>
          {name && <p className="user-greeting">Welcome, {name}!</p>}
        </div>
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
            {isSaving ? t('saving', locale) : t('saveAvailability', locale)}
          </button>
          <button
            className="cancel-button"
            onClick={() => navigate('/provider')}
            disabled={isSaving}
          >
            {t('cancel', locale)}
          </button>
        </div>
      </div>
    </div>
  );
}
