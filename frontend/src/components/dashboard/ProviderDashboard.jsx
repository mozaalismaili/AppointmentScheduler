import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './ProviderDashboard.css';

export default function ProviderDashboard() {
  const { name, email } = useSelector(state => state.auth);
  const navigate = useNavigate();
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await getProviderDashboardData();
      // setDashboardData(response.data);
      
      // Mock data for now
      setTimeout(() => {
        setDashboardData({
          todayBookings: [
            {
              id: 1,
              customerName: 'Alice Johnson',
              service: 'Hair Cut',
              time: '10:00 AM',
              status: 'confirmed'
            },
            {
              id: 2,
              customerName: 'Bob Smith',
              service: 'Manicure',
              time: '2:00 PM',
              status: 'confirmed'
            }
          ],
          upcomingBookings: [
            {
              id: 3,
              customerName: 'Carol Davis',
              service: 'Hair Cut',
              date: '2024-01-16',
              time: '11:00 AM',
              status: 'confirmed'
            }
          ],
          availability: [
            {
              day: 'Monday',
              slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM']
            },
            {
              day: 'Tuesday',
              slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM']
            }
          ],
          stats: {
            totalBookings: 25,
            completedToday: 2,
            pendingApproval: 3,
            revenue: 1250
          }
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
  };

  const handleManageAvailability = () => {
    navigate('/availability');
  };

  const handleViewAllBookings = () => {
    setActiveTab('bookings');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { class: 'status-confirmed', text: 'Confirmed' },
      pending: { class: 'status-pending', text: 'Pending' },
      completed: { class: 'status-completed', text: 'Completed' },
      cancelled: { class: 'status-cancelled', text: 'Cancelled' }
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
          <span className="detail-label">Service:</span>
          <span className="detail-value">{booking.service}</span>
        </div>
        {booking.date && (
          <div className="detail-item">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{booking.date}</span>
          </div>
        )}
        <div className="detail-item">
          <span className="detail-label">Time:</span>
          <span className="detail-value">{booking.time}</span>
        </div>
      </div>
      
      <div className="booking-actions">
        <button className="action-button view-button">
          View Details
        </button>
        {booking.status === 'confirmed' && (
          <button className="action-button complete-button">
            Mark Complete
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
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {name}!</h1>
          <p>Manage your schedule, view bookings, and update availability</p>
        </div>
        
        <div className="header-actions">
          <button 
            className="manage-availability-btn"
            onClick={handleManageAvailability}
          >
            Manage Availability
          </button>
          <button 
            className="view-bookings-btn"
            onClick={handleViewAllBookings}
          >
            View All Bookings
          </button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{dashboardData.stats.totalBookings}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{dashboardData.stats.completedToday}</div>
          <div className="stat-label">Completed Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{dashboardData.stats.pendingApproval}</div>
          <div className="stat-label">Pending Approval</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">${dashboardData.stats.revenue}</div>
          <div className="stat-label">Revenue</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
          <button 
            className={`tab-button ${activeTab === 'availability' ? 'active' : ''}`}
            onClick={() => setActiveTab('availability')}
          >
            Availability
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="overview-section">
                <h2>Today's Bookings</h2>
                <div className="bookings-grid">
                  {dashboardData.todayBookings.length > 0 ? (
                    dashboardData.todayBookings.map(renderBookingCard)
                  ) : (
                    <div className="empty-state">
                      <p>No bookings for today</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="overview-section">
                <h2>Quick Actions</h2>
                <div className="quick-actions">
                  <button 
                    className="quick-action-btn"
                    onClick={handleManageAvailability}
                  >
                    Update Availability
                  </button>
                  <button className="quick-action-btn">
                    View Calendar
                  </button>
                  <button className="quick-action-btn">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-content">
              <div className="bookings-header">
                <h2>All Bookings</h2>
                <div className="bookings-filters">
                  <select className="filter-select">
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
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
                <h2>Your Availability</h2>
                <button 
                  className="edit-availability-btn"
                  onClick={handleManageAvailability}
                >
                  Edit Availability
                </button>
              </div>
              
              <div className="availability-grid">
                {dashboardData.availability.map(renderAvailabilityCard)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
