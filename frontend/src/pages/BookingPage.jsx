import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/translations';
import './BookingPage.css';

export default function BookingPage() {
  const { name } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { locale } = useLocale();
  const [selectedService, setSelectedService] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchServicesAndProviders();
  }, []);

  useEffect(() => {
    if (selectedService && selectedProvider && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedService, selectedProvider, selectedDate]);

  const fetchServicesAndProviders = async () => {
    try {
      setIsLoading(true);

      // Fetch services from backend
      const servicesResponse = await fetch('/api/services');
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData);
      } else {
        console.error('Failed to fetch services');
        setServices([]);
      }

      // TODO: Replace with actual providers API call when backend endpoint is ready
      // For now, show empty array until backend endpoints are implemented
      setProviders([]);

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching services and providers:', error);
      setServices([]);
      setProviders([]);
      setIsLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      setIsLoading(true);

      // Fetch available slots from backend
      const dateParam = encodeURIComponent(selectedDate);
      const providerId = selectedProvider.id || 1; // Fallback to 1 if no ID
      const serviceDuration = selectedService.durationMinutes || 30;

      const response = await fetch(
        `/api/timeslots/available?date=${dateParam}&providerId=${providerId}&serviceDurationMinutes=${serviceDuration}`
      );

      if (response.ok) {
        const slotsData = await response.json();
        setAvailableSlots(slotsData);
      } else {
        console.error('Failed to fetch available slots');
        setAvailableSlots([]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots([]);
      setIsLoading(false);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setStep(3);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setStep(4);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(5);
  };

  const handleBooking = async () => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call when backend endpoint is ready
      // const response = await createBooking({
      //   service: selectedService,
      //   provider: selectedProvider,
      //   date: selectedDate,
      //   time: selectedTime
      // });

      // For now, show success message and redirect
      alert(t('appointmentBooked', locale));
      navigate('/customer');
      setIsLoading(false);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/customer');
    }
  };

  const getCurrentStepTitle = () => {
    switch (step) {
      case 1: return t('selectService', locale);
      case 2: return t('chooseProvider', locale);
      case 3: return t('pickDate', locale);
      case 4: return t('selectTime', locale);
      case 5: return t('confirmBooking', locale);
      default: return t('bookAppointment', locale);
    }
  };

  const renderServiceSelection = () => (
    <div className="step-content">
      <h2>{t('whatService', locale)}</h2>
      {services.length > 0 ? (
        <div className="services-grid">
          {services.map(service => (
            <div
              key={service.id}
              className="service-card"
              onClick={() => handleServiceSelect(service)}
            >
              <h3>{service.name}</h3>
              <p className="service-duration">{service.durationMinutes} {t('minutes', locale)}</p>
              <p className="service-price">${service.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-services">
          <p>{t('noServicesAvailable', locale)}</p>
          <p className="empty-services-subtitle">{t('contactProvider', locale)}</p>
        </div>
      )}
    </div>
  );

  const renderProviderSelection = () => (
    <div className="step-content">
      <h2>{t('whoBookWith', locale)}</h2>
      {providers.length > 0 ? (
        <div className="providers-grid">
          {providers.map(provider => (
            <div
              key={provider.id}
              className="provider-card"
              onClick={() => handleProviderSelect(provider)}
            >
              <h3>{provider.name}</h3>
              <p className="provider-specialty">{t('specialty', locale)}: {provider.specialty}</p>
              <div className="provider-rating">
                <span className="stars">★★★★★</span>
                <span className="rating-text">{t('rating', locale)}: {provider.rating}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-providers">
          <p>{t('noProvidersAvailable', locale)}</p>
          <p className="empty-providers-subtitle">{t('contactAdmin', locale)}</p>
        </div>
      )}
    </div>
  );

  const renderDateSelection = () => (
    <div className="step-content">
      <h2>{t('whenBook', locale)}</h2>
      <div className="date-picker">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="date-input"
        />
      </div>
    </div>
  );

  const renderTimeSelection = () => (
    <div className="step-content">
      <h2>{t('whatTime', locale)}</h2>
      {isLoading ? (
        <div className="loading-slots">
          <div className="spinner"></div>
          <p>{t('loadingTimes', locale)}</p>
        </div>
      ) : (
        <div className="time-slots-grid">
          {availableSlots.map((slot, index) => (
            <button
              key={index}
              className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
              onClick={() => handleTimeSelect(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderConfirmation = () => (
    <div className="step-content">
      <h2>{t('confirmYourBooking', locale)}</h2>
      <div className="booking-summary">
        <div className="summary-item">
          <span className="summary-label">{t('service', locale)}:</span>
          <span className="summary-value">{selectedService.name}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">{t('provider', locale)}:</span>
          <span className="summary-value">{selectedProvider.name}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">{t('date', locale)}:</span>
          <span className="summary-value">{selectedDate}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">{t('time', locale)}:</span>
          <span className="summary-value">{selectedTime}</span>
        </div>
        <div className="summary-item total">
          <span className="summary-label">{t('total', locale)}:</span>
          <span className="summary-value">${selectedService.price}</span>
        </div>
      </div>

      <button
        className="confirm-booking-btn"
        onClick={handleBooking}
        disabled={isLoading}
      >
        {isLoading ? t('booking', locale) : t('confirmBookingBtn', locale)}
      </button>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1: return renderServiceSelection();
      case 2: return renderProviderSelection();
      case 3: return renderDateSelection();
      case 4: return renderTimeSelection();
      case 5: return renderConfirmation();
      default: return renderServiceSelection();
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <button className="back-button" onClick={goBack}>
          ← {t('back', locale)}
        </button>
        <h1>{getCurrentStepTitle()}</h1>
        <div className="progress-bar">
          {[1, 2, 3, 4, 5].map(stepNumber => (
            <div
              key={stepNumber}
              className={`progress-step ${stepNumber <= step ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="booking-container">
        {renderStepContent()}
      </div>
    </div>
  );
}
