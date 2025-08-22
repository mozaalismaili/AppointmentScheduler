import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import { t } from '../../locales/translations';
import './CustomerDashboard.css';

export default function CustomerDashboard() {
  const { name, email } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState({
    upcoming: [],
    past: [],
    pending: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch appointments data
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await getCustomerAppointments();
      // setAppointments(response.data);
      
      // Mock data for now
      setTimeout(() => {
                 setAppointments({
           upcoming: [
             {
               id: 1,
               service: t('hairCut', locale),
               provider: 'John Doe',
               date: '2024-01-15',
               time: '10:00 AM',
               status: 'confirmed'
             },
             {
               id: 2,
               service: t('manicure', locale),
               provider: 'Jane Smith',
               date: '2024-01-20',
               time: '2:00 PM',
               status: 'confirmed'
             }
           ],
           past: [
             {
               id: 3,
               service: t('hairCut', locale),
               provider: 'John Doe',
               date: '2024-01-01',
               time: '11:00 AM',
               status: 'completed'
             }
           ],
           pending: [
             {
               id: 4,
               service: t('hairCut', locale),
               provider: 'John Doe',
               date: '2024-01-25',
               time: '3:00 PM',
               status: 'pending'
             }
           ]
         });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setIsLoading(false);
    }
  };

  const handleBookAppointment = () => {
    navigate('/book');
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      // TODO: Replace with actual API call
      // await cancelAppointment(appointmentId);
      console.log('Cancelling appointment:', appointmentId);
      
      // Update local state
      setAppointments(prev => ({
        ...prev,
        upcoming: prev.upcoming.filter(apt => apt.id !== appointmentId),
        past: [...prev.past, prev.upcoming.find(apt => apt.id === appointmentId)]
      }));
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { class: 'status-confirmed', text: t('confirmed', locale) },
      pending: { class: 'status-pending', text: t('pending', locale) },
      completed: { class: 'status-completed', text: t('completed', locale) },
      cancelled: { class: 'status-cancelled', text: t('cancelled', locale) }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const renderAppointmentCard = (appointment) => (
    <div key={appointment.id} className="appointment-card">
      <div className="appointment-header">
        <h3 className="service-name">{appointment.service}</h3>
        {getStatusBadge(appointment.status)}
      </div>
      
             <div className="appointment-details">
         <div className="detail-item">
           <span className="detail-label">{t('providerLabel', locale)}:</span>
           <span className="detail-value">{appointment.provider}</span>
         </div>
         <div className="detail-item">
           <span className="detail-label">{t('dateLabel', locale)}:</span>
           <span className="detail-value">{appointment.date}</span>
         </div>
         <div className="detail-item">
           <span className="detail-label">{t('timeLabel', locale)}:</span>
           <span className="detail-value">{appointment.time}</span>
         </div>
       </div>
      
             {appointment.status === 'confirmed' && (
         <div className="appointment-actions">
           <button 
             className="action-button cancel-button"
             onClick={() => handleCancelAppointment(appointment.id)}
           >
             {t('cancel', locale)}
           </button>
           <button className="action-button reschedule-button">
             {t('reschedule', locale)}
           </button>
         </div>
       )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{t('loadingAppointments', locale)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>{t('welcomeBack', locale, { name })}</h1>
          <p>{t('manageAppointments', locale)}</p>
        </div>
        
        <button 
          className="book-appointment-btn"
          onClick={handleBookAppointment}
        >
          {t('bookNewAppointment', locale)}
        </button>
      </div>

             <div className="dashboard-stats">
         <div className="stat-card">
           <div className="stat-number">{appointments.upcoming.length}</div>
           <div className="stat-label">{t('upcoming', locale)}</div>
         </div>
         <div className="stat-card">
           <div className="stat-number">{appointments.pending.length}</div>
           <div className="stat-label">{t('pending', locale)}</div>
         </div>
         <div className="stat-card">
           <div className="stat-number">{appointments.past.length}</div>
           <div className="stat-label">{t('completed', locale)}</div>
         </div>
       </div>

      <div className="dashboard-content">
                 <div className="tab-navigation">
           <button 
             className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
             onClick={() => setActiveTab('upcoming')}
           >
             {t('upcoming', locale)} ({appointments.upcoming.length})
           </button>
           <button 
             className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
             onClick={() => setActiveTab('pending')}
           >
             {t('pending', locale)} ({appointments.pending.length})
           </button>
           <button 
             className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
             onClick={() => setActiveTab('past')}
           >
             {t('past', locale)} ({appointments.past.length})
           </button>
         </div>

        <div className="tab-content">
          {activeTab === 'upcoming' && (
            <div className="appointments-grid">
                             {appointments.upcoming.length > 0 ? (
                 appointments.upcoming.map(renderAppointmentCard)
               ) : (
                 <div className="empty-state">
                   <p>{t('noUpcomingAppointments', locale)}</p>
                   <button 
                     className="book-appointment-btn secondary"
                     onClick={handleBookAppointment}
                   >
                     {t('bookFirstAppointment', locale)}
                   </button>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="appointments-grid">
                             {appointments.pending.length > 0 ? (
                 appointments.pending.map(renderAppointmentCard)
               ) : (
                 <div className="empty-state">
                   <p>{t('noPendingAppointments', locale)}</p>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'past' && (
            <div className="appointments-grid">
                             {appointments.past.length > 0 ? (
                 appointments.past.map(renderAppointmentCard)
               ) : (
                 <div className="empty-state">
                   <p>{t('noPastAppointments', locale)}</p>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
