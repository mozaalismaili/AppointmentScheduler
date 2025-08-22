import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

export default function CustomerDashboard() {
  const { name, email } = useSelector(state => state.auth);
  const navigate = useNavigate();
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
              service: 'Hair Cut',
              provider: 'John Doe',
              date: '2024-01-15',
              time: '10:00 AM',
              status: 'confirmed'
            },
            {
              id: 2,
              service: 'Manicure',
              provider: 'Jane Smith',
              date: '2024-01-20',
              time: '2:00 PM',
              status: 'confirmed'
            }
          ],
          past: [
            {
              id: 3,
              service: 'Hair Cut',
              provider: 'John Doe',
              date: '2024-01-01',
              time: '11:00 AM',
              status: 'completed'
            }
          ],
          pending: [
            {
              id: 4,
              service: 'Hair Cut',
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
      confirmed: { class: 'status-confirmed', text: 'Confirmed' },
      pending: { class: 'status-pending', text: 'Pending' },
      completed: { class: 'status-completed', text: 'Completed' },
      cancelled: { class: 'status-cancelled', text: 'Cancelled' }
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
          <span className="detail-label">Provider:</span>
          <span className="detail-value">{appointment.provider}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Date:</span>
          <span className="detail-value">{appointment.date}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Time:</span>
          <span className="detail-value">{appointment.time}</span>
        </div>
      </div>
      
      {appointment.status === 'confirmed' && (
        <div className="appointment-actions">
          <button 
            className="action-button cancel-button"
            onClick={() => handleCancelAppointment(appointment.id)}
          >
            Cancel
          </button>
          <button className="action-button reschedule-button">
            Reschedule
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
          <p>Loading your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {name}!</h1>
          <p>Manage your appointments and book new services</p>
        </div>
        
        <button 
          className="book-appointment-btn"
          onClick={handleBookAppointment}
        >
          Book New Appointment
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{appointments.upcoming.length}</div>
          <div className="stat-label">Upcoming</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{appointments.pending.length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{appointments.past.length}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming ({appointments.upcoming.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({appointments.pending.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past ({appointments.past.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'upcoming' && (
            <div className="appointments-grid">
              {appointments.upcoming.length > 0 ? (
                appointments.upcoming.map(renderAppointmentCard)
              ) : (
                <div className="empty-state">
                  <p>No upcoming appointments</p>
                  <button 
                    className="book-appointment-btn secondary"
                    onClick={handleBookAppointment}
                  >
                    Book Your First Appointment
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
                  <p>No pending appointments</p>
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
                  <p>No past appointments</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
