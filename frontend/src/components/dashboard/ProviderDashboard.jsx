import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../locales/translations';
import Calendar from '../Calendar';
import NotificationDemo from '../NotificationDemo';
import './ProviderDashboard.css';

export default function ProviderDashboard() {
  const { name, email } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    todayBookings: [],
    upcomingBookings: [],
    availability: [],
    stats: {
      totalBookings: 0,
      completedToday: 0,
      pendingApproval: 0,
      revenue: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call when backend endpoints are ready
      // const response = await getProviderDashboardData();
      // setDashboardData(response.data);

      // For now, show empty data until backend endpoints are implemented
      setDashboardData({
        todayBookings: [],
        upcomingBookings: [],
        availability: [],
        stats: {
          totalBookings: 0,
          completedToday: 0,
          pendingApproval: 0,
          revenue: 0
        }
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({
        todayBookings: [],
        upcomingBookings: [],
        availability: [],
        stats: {
          totalBookings: 0,
          completedToday: 0,
          pendingApproval: 0,
          revenue: 0
        }
      });
      setIsLoading(false);
    }
  };

  const handleManageAvailability = () => {
    navigate('/availability');
  };

  const handleViewAllBookings = () => {
    setActiveTab('bookings');
  };

  const handleCalendarPrev = () => {
    setCalendarDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleCalendarNext = () => {
    setCalendarDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleCalendarToday = () => {
    setCalendarDate(new Date());
  };

  const handleCalendarDateSelect = (dateKey) => {
    // TODO: Handle date selection for detailed view
    console.log('Selected date:', dateKey);
  };

  const addNotification = (message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep last 5 notifications

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
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

  const renderBookingCard = (booking) => (
    <div key={booking.id} className="booking-card">
      <div className="booking-header">
        <h3 className="customer-name">{booking.customerName}</h3>
        {getStatusBadge(booking.status)}
      </div>

      <div className="booking-details">
        <div className="detail-item">
          <span className="detail-label">{t('serviceLabel', locale)}:</span>
          <span className="detail-value">{booking.service}</span>
        </div>
        {booking.date && (
          <div className="detail-item">
            <span className="detail-label">{t('dateLabel', locale)}:</span>
            <span className="detail-value">{booking.date}</span>
          </div>
        )}
        <div className="detail-item">
          <span className="detail-label">{t('timeLabel', locale)}:</span>
          <span className="detail-value">{booking.time}</span>
        </div>
      </div>

      <div className="booking-actions">
        <button className="action-button view-button">
          {t('viewDetails', locale)}
        </button>
        {booking.status === 'confirmed' && (
          <button className="action-button complete-button">
            {t('markComplete', locale)}
          </button>
        )}
      </div>
    </div>
  );

  const renderAvailabilityCard = (day) => (
    <div key={day.day} className="availability-card">
      <h3 className="day-name">{day.day}</h3>
      <div className="time-slots">
        {day.slots.map((slot, index) => (
          <span key={index} className="time-slot">
            {slot}
          </span>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{t('loadingDashboard', locale)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>{t('welcomeBack', locale, { name })}</h1>
          <p>{t('manageSchedule', locale)}</p>
        </div>

        <div className="header-actions">
          <button
            className="manage-availability-btn"
            onClick={handleManageAvailability}
          >
            {t('manageAvailability', locale)}
          </button>
          <button
            className="manage-services-btn"
            onClick={() => navigate('/services')}
          >
            Manage Services
          </button>
          <button
            className="view-bookings-btn"
            onClick={handleViewAllBookings}
          >
            {t('viewAllBookings', locale)}
          </button>
          <button
            className="test-notifications-btn"
            onClick={() => setActiveTab('notifications')}
          >
            Test Notifications
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications-container">
          {notifications.map(notification => (
            <div key={notification.id} className={`notification notification-${notification.type}`}>
              <span className="notification-message">{notification.message}</span>
              <button
                className="notification-close"
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{dashboardData.stats.totalBookings}</div>
          <div className="stat-label">{t('totalBookings', locale)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{dashboardData.stats.completedToday}</div>
          <div className="stat-label">{t('completedToday', locale)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{dashboardData.stats.pendingApproval}</div>
          <div className="stat-label">{t('pendingApproval', locale)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">${dashboardData.stats.revenue}</div>
          <div className="stat-label">{t('revenue', locale)}</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            {t('overview', locale)}
          </button>
          <button
            className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            {t('bookings', locale)}
          </button>
          <button
            className={`tab-button ${activeTab === 'availability' ? 'active' : ''}`}
            onClick={() => setActiveTab('availability')}
          >
            {t('availability', locale)}
          </button>
          <button
            className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Test Notifications
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="overview-section">
                <h2>{t('todaysBookings', locale)}</h2>
                <div className="bookings-grid">
                  {dashboardData.todayBookings.length > 0 ? (
                    dashboardData.todayBookings.map(renderBookingCard)
                  ) : (
                    <div className="empty-state">
                      <p>{t('noBookingsToday', locale)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="overview-section">
                <h2>{t('quickActions', locale)}</h2>
                <div className="quick-actions">
                  <button
                    className="quick-action-btn"
                    onClick={handleManageAvailability}
                  >
                    {t('updateAvailability', locale)}
                  </button>
                  <button className="quick-action-btn">
                    {t('viewCalendar', locale)}
                  </button>
                  <button className="quick-action-btn">
                    {t('generateReport', locale)}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-content">
              <div className="bookings-header">
                <h2>{t('allBookings', locale)}</h2>
                <div className="bookings-filters">
                  <select className="filter-select">
                    <option value="all">{t('allStatus', locale)}</option>
                    <option value="confirmed">{t('confirmed', locale)}</option>
                    <option value="pending">{t('pending', locale)}</option>
                    <option value="completed">{t('completed', locale)}</option>
                  </select>
                </div>
              </div>

              <div className="bookings-grid">
                {[...dashboardData.todayBookings, ...dashboardData.upcomingBookings].map(renderBookingCard)}
              </div>
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="availability-content">
              <div className="availability-header">
                <h2>{t('yourAvailability', locale)}</h2>
                <button
                  className="edit-availability-btn"
                  onClick={handleManageAvailability}
                >
                  {t('editAvailability', locale)}
                </button>
              </div>

              <div className="calendar-section">
                <h3>Monthly Calendar View</h3>
                <Calendar
                  year={calendarDate.getFullYear()}
                  month={calendarDate.getMonth()}
                  events={calendarEvents}
                  onPrev={handleCalendarPrev}
                  onNext={handleCalendarNext}
                  onToday={handleCalendarToday}
                  onSelectDate={handleCalendarDateSelect}
                />
              </div>

              <div className="availability-grid">
                {dashboardData.availability.map(renderAvailabilityCard)}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="notifications-content">
              <NotificationDemo />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
