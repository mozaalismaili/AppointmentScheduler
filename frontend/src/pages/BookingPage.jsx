import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
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

  const [services] = useState([
    { id: 1, name: t('hairCut', locale), duration: 30, price: 25 },
    { id: 2, name: t('manicure', locale), duration: 45, price: 35 },
    { id: 3, name: t('pedicure', locale), duration: 60, price: 45 },
    { id: 4, name: t('hairColoring', locale), duration: 120, price: 80 }
  ]);

  const [providers] = useState([
    { id: 1, name: 'John Doe', specialty: t('hairStyling', locale), rating: 4.8 },
    { id: 2, name: 'Jane Smith', specialty: t('nailCare', locale), rating: 4.9 },
    { id: 3, name: 'Mike Johnson', specialty: t('hairColoring', locale), rating: 4.7 }
  ]);

  useEffect(() => {
    if (selectedService && selectedProvider && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedService, selectedProvider, selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await getAvailableSlots(selectedProvider, selectedDate);
      // setAvailableSlots(response.data);
      
      // Mock data for now
      setTimeout(() => {
        setAvailableSlots([
          '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching available slots:', error);
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
      // TODO: Replace with actual API call
      // const response = await bookAppointment({
      //   service: selectedService,
      //   provider: selectedProvider,
      //   date: selectedDate,
      //   time: selectedTime
      // });
      
             // Mock success
       setTimeout(() => {
         alert(t('appointmentBooked', locale));
         navigate('/customer');
         setIsLoading(false);
       }, 1000);
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
      <div className="services-grid">
        {services.map(service => (
          <div
            key={service.id}
            className="service-card"
            onClick={() => handleServiceSelect(service)}
          >
            <h3>{service.name}</h3>
            <p className="service-duration">{service.duration} {t('minutes', locale)}</p>
            <p className="service-price">${service.price}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProviderSelection = () => (
    <div className="step-content">
      <h2>{t('whoBookWith', locale)}</h2>
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
