import React, { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';
import NotificationCenter from './NotificationCenter';
import './NotificationBell.css';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  useEffect(() => {
    // Initialize notification service
    notificationService.init();
    
    // Load initial unread count
    updateUnreadCount();
    
    // Listen for new notifications
    const handleNewNotification = () => {
      updateUnreadCount();
    };

    // Listen for notification read events
    const handleNotificationRead = () => {
      updateUnreadCount();
    };

    const handleAllNotificationsRead = () => {
      setUnreadCount(0);
    };

    window.addEventListener('notificationReceived', handleNewNotification);
    window.addEventListener('notificationRead', handleNotificationRead);
    window.addEventListener('allNotificationsRead', handleAllNotificationsRead);

    return () => {
      window.removeEventListener('notificationReceived', handleNewNotification);
      window.removeEventListener('notificationRead', handleNotificationRead);
      window.removeEventListener('allNotificationsRead', handleAllNotificationsRead);
    };
  }, []);

  const updateUnreadCount = () => {
    const count = notificationService.getUnreadCount();
    setUnreadCount(count);
  };

  const handleBellClick = () => {
    setIsNotificationCenterOpen(true);
  };

  const handleCloseNotificationCenter = () => {
    setIsNotificationCenterOpen(false);
  };

  const handleNotificationClick = (notification) => {
    // Handle notification click - you can navigate to specific pages or show details
    console.log('Notification clicked:', notification);
    
    // Example: Navigate to appointment details if it's an appointment notification
    if (notification.appointmentId) {
      // You could navigate to appointment details page here
      console.log('Navigate to appointment:', notification.appointmentId);
    }
  };

  return (
    <>
      <div className="notification-bell" onClick={handleBellClick}>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>

      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={handleCloseNotificationCenter}
        onNotificationClick={handleNotificationClick}
      />
    </>
  );
};

export default NotificationBell;
