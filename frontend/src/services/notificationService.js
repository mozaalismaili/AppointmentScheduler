// Notification Service for Frontend
// Handles in-app, email, and browser notifications

class NotificationService {
  constructor() {
    this.notifications = [];
    this.isSupported = this.checkSupport();
  }

  // Check if browser supports required APIs
  checkSupport() {
    return {
      notifications: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window,
      email: true, // We'll use SendGrid service
      sms: false   // SMS notifications are disabled
    };
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported.notifications) {
      console.warn('Notifications not supported in this browser');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Send in-app notification
  sendInAppNotification(notification) {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      isRead: false,
      ...notification
    };

    this.notifications.unshift(newNotification);
    
    // Store in localStorage
    this.saveToStorage();
    
    // Emit custom event for components to listen to
    window.dispatchEvent(new CustomEvent('notificationReceived', { 
      detail: newNotification 
    }));

    return newNotification;
  }

  // Send browser notification
  async sendBrowserNotification(title, options = {}) {
    if (!this.isSupported.notifications) {
      console.warn('Browser notifications not supported');
      return false;
    }

    if (Notification.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }

    try {
      const notification = new Notification(title, {
        icon: '/calendar-icon.svg',
        badge: '/calendar-icon.svg',
        ...options
      });

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      return notification;
    } catch (error) {
      console.error('Error sending browser notification:', error);
      return false;
    }
  }

  // Send email notification using SendGrid
  async sendEmailNotification(emailData) {
    try {
      // Using SendGrid with your API key and template
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY);
      
      const msg = {
        to: emailData.to,
        from: import.meta.env.VITE_SENDGRID_FROM_EMAIL,
        templateId: import.meta.env.VITE_SENDGRID_TEMPLATE_ID,
        dynamicTemplateData: {
          to_name: emailData.toName,
          from_name: emailData.fromName,
          subject: emailData.subject,
          message: emailData.message,
          appointment_date: emailData.appointmentDate,
          appointment_time: emailData.appointmentTime
        }
      };

      const response = await sgMail.send(msg);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error sending email notification:', error);
      
      // Fallback: Using a simple mailto link
      const mailtoLink = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.message)}`;
      window.open(mailtoLink);
      
      return { success: true, method: 'mailto' };
    }
  }

  // SMS notifications are not supported in this version
  async sendSMSNotification(smsData) {
    console.log('SMS notifications are disabled. Email notifications are available.');
    
    // Send in-app notification instead
    this.sendInAppNotification({
      type: 'sms_disabled',
      title: 'SMS Notifications Disabled',
      message: 'SMS notifications are not available. Please check your email for updates.',
      notificationType: 'info'
    });

    return { success: true, method: 'disabled', message: 'SMS notifications are disabled' };
  }

  // Send appointment confirmation
  async sendAppointmentConfirmation(appointment, user) {
    const notification = {
      type: 'appointment_confirmation',
      title: 'Appointment Confirmed!',
      message: `Your appointment on ${appointment.date} at ${appointment.time} has been confirmed.`,
      notificationType: 'success',
      appointmentId: appointment.id,
      userId: user.id
    };

    // Send in-app notification
    this.sendInAppNotification(notification);

    // Send browser notification
    await this.sendBrowserNotification(notification.title, {
      body: notification.message,
      tag: `appointment_${appointment.id}`,
      data: { appointmentId: appointment.id }
    });

    // Send email if user has email
    if (user.email) {
      await this.sendEmailNotification({
        to: user.email,
        toName: user.name,
        fromName: 'Appointment Scheduler',
        subject: 'Appointment Confirmation',
        message: `Hi ${user.name},\n\nYour appointment has been confirmed for ${appointment.date} at ${appointment.time}.\n\nThank you!`,
        appointmentDate: appointment.date,
        appointmentTime: appointment.time
      });
    }

    // SMS notifications are disabled - only email notifications are sent
    if (user.phone) {
      console.log('SMS notification skipped - SMS notifications are disabled');
    }

    return notification;
  }

  // Send appointment reminder
  async sendAppointmentReminder(appointment, user) {
    const notification = {
      type: 'appointment_reminder',
      title: 'Appointment Reminder',
      message: `Reminder: You have an appointment tomorrow at ${appointment.time}.`,
      notificationType: 'info',
      appointmentId: appointment.id,
      userId: user.id
    };

    // Send in-app notification
    this.sendInAppNotification(notification);

    // Send browser notification
    await this.sendBrowserNotification(notification.title, {
      body: notification.message,
      tag: `reminder_${appointment.id}`,
      data: { appointmentId: appointment.id }
    });

    // Send email reminder
    if (user.email) {
      await this.sendEmailNotification({
        to: user.email,
        toName: user.name,
        fromName: 'Appointment Scheduler',
        subject: 'Appointment Reminder',
        message: `Hi ${user.name},\n\nThis is a reminder for your appointment tomorrow at ${appointment.time}.\n\nSee you soon!`,
        appointmentDate: appointment.date,
        appointmentTime: appointment.time
      });
    }

    return notification;
  }

  // Send cancellation notification
  async sendCancellationNotification(appointment, user) {
    const notification = {
      type: 'appointment_cancelled',
      title: 'Appointment Cancelled',
      message: `Your appointment on ${appointment.date} at ${appointment.time} has been cancelled.`,
      notificationType: 'warning',
      appointmentId: appointment.id,
      userId: user.id
    };

    // Send in-app notification
    this.sendInAppNotification(notification);

    // Send browser notification
    await this.sendBrowserNotification(notification.title, {
      body: notification.message,
      tag: `cancelled_${appointment.id}`,
      data: { appointmentId: appointment.id }
    });

    // Send email notification
    if (user.email) {
      await this.sendEmailNotification({
        to: user.email,
        toName: user.name,
        fromName: 'Appointment Scheduler',
        subject: 'Appointment Cancelled',
        message: `Hi ${user.name},\n\nYour appointment for ${appointment.date} at ${appointment.time} has been cancelled.\n\nPlease contact us if you have any questions.`,
        appointmentDate: appointment.date,
        appointmentTime: appointment.time
      });
    }

    return notification;
  }

  // Mark notification as read
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.saveToStorage();
      
      // Emit event
      window.dispatchEvent(new CustomEvent('notificationRead', { 
        detail: notification 
      }));
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach(n => n.isRead = true);
    this.saveToStorage();
    
    // Emit event
    window.dispatchEvent(new CustomEvent('allNotificationsRead'));
  }

  // Get unread notifications count
  getUnreadCount() {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // Get notifications by type
  getNotificationsByType(type) {
    return this.notifications.filter(n => n.type === type);
  }

  // Get recent notifications
  getRecentNotifications(limit = 10) {
    return this.notifications.slice(0, limit);
  }

  // Clear old notifications (older than 30 days)
  clearOldNotifications() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    this.notifications = this.notifications.filter(n => 
      new Date(n.timestamp) > thirtyDaysAgo
    );
    
    this.saveToStorage();
  }

  // Save notifications to localStorage
  saveToStorage() {
    try {
      localStorage.setItem('appointmentNotifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  }

  // Load notifications from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('appointmentNotifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        this.notifications.forEach(n => {
          n.timestamp = new Date(n.timestamp);
        });
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
      this.notifications = [];
    }
  }

  // Initialize the service
  init() {
    this.loadFromStorage();
    this.clearOldNotifications();
    
    // Request permission on init
    this.requestPermission();
    
    console.log('Notification service initialized');
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
