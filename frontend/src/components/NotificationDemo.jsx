import React, { useState } from 'react';
import notificationService from '../services/notificationService';
import './NotificationDemo.css';

const NotificationDemo = () => {
    const [testData, setTestData] = useState({
        email: 'test@example.com',
        phone: '+1234567890',
        name: 'John Doe',
        date: '2024-01-15',
        time: '10:00 AM'
    });

    const [results, setResults] = useState([]);

    const addResult = (type, success, message) => {
        setResults(prev => [...prev, { type, success, message, timestamp: new Date() }]);
    };

    const testInAppNotification = () => {
        try {
            const notification = notificationService.sendInAppNotification({
                type: 'test',
                title: 'Test Notification',
                message: 'This is a test in-app notification!',
                notificationType: 'info'
            });
            addResult('In-App', true, 'Notification sent successfully');
        } catch (error) {
            addResult('In-App', false, `Error: ${error.message}`);
        }
    };

    const testBrowserNotification = async () => {
        try {
            const result = await notificationService.sendBrowserNotification(
                'Test Browser Notification',
                {
                    body: 'This is a test browser notification!',
                    icon: '/calendar-icon.svg'
                }
            );
            if (result) {
                addResult('Browser', true, 'Browser notification sent successfully');
            } else {
                addResult('Browser', false, 'Browser notification failed or not supported');
            }
        } catch (error) {
            addResult('Browser', false, `Error: ${error.message}`);
        }
    };

    const testEmailNotification = async () => {
        try {
            const result = await notificationService.sendEmailNotification({
                to: testData.email,
                toName: testData.name,
                fromName: 'Appointment Scheduler',
                subject: 'Test Email Notification',
                message: 'This is a test email notification from the appointment scheduler.',
                appointmentDate: testData.date,
                appointmentTime: testData.time
            });

            if (result.success) {
                addResult('Email', true, `Email sent successfully via ${result.method}`);
            } else {
                addResult('Email', false, `Email failed: ${result.error}`);
            }
        } catch (error) {
            addResult('Email', false, `Error: ${error.message}`);
        }
    };

    const testSMSNotification = async () => {
        try {
            const result = await notificationService.sendSMSNotification({
                to: testData.phone,
                message: 'Test SMS: Your appointment is confirmed for tomorrow at 10:00 AM'
            });

            if (result.success) {
                addResult('SMS', true, `SMS notifications are disabled: ${result.message}`);
            } else {
                addResult('SMS', false, `SMS test failed: ${result.error}`);
            }
        } catch (error) {
            addResult('SMS', false, `Error: ${error.message}`);
        }
    };

    const testAppointmentConfirmation = async () => {
        try {
            const appointment = {
                id: 'test-123',
                date: testData.date,
                time: testData.time
            };

            const user = {
                id: 'user-123',
                name: testData.name,
                email: testData.email,
                phone: testData.phone
            };

            const result = await notificationService.sendAppointmentConfirmation(appointment, user);
            addResult('Appointment Confirmation', true, 'All notifications sent successfully');
        } catch (error) {
            addResult('Appointment Confirmation', false, `Error: ${error.message}`);
        }
    };

    const clearResults = () => {
        setResults([]);
    };

    return (
        <div className="notification-demo">
            <h2>Notification System Demo</h2>

            <div className="demo-section">
                <h3>Test Data</h3>
                <div className="test-data-form">
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={testData.email}
                            onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="test@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone: <span className="disabled-text">(SMS disabled)</span></label>
                        <input
                            type="tel"
                            value={testData.phone}
                            onChange={(e) => setTestData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+1234567890"
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            value={testData.name}
                            onChange={(e) => setTestData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            value={testData.date}
                            onChange={(e) => setTestData(prev => ({ ...prev, date: e.target.value }))}
                        />
                    </div>
                    <div className="form-group">
                        <label>Time:</label>
                        <input
                            type="time"
                            value={testData.time}
                            onChange={(e) => setTestData(prev => ({ ...prev, time: e.target.value }))}
                        />
                    </div>
                </div>
            </div>

            <div className="demo-section">
                <h3>Test Notifications</h3>
                <div className="test-buttons">
                    <button onClick={testInAppNotification} className="test-btn">
                        Test In-App Notification
                    </button>
                    <button onClick={testBrowserNotification} className="test-btn">
                        Test Browser Notification
                    </button>
                    <button onClick={testEmailNotification} className="test-btn">
                        Test Email (SendGrid)
                    </button>
                    <button onClick={testSMSNotification} className="test-btn disabled">
                        Test SMS (Disabled)
                    </button>
                    <button onClick={testAppointmentConfirmation} className="test-btn primary">
                        Test Full Appointment Confirmation
                    </button>
                </div>
            </div>

            <div className="demo-section">
                <div className="results-header">
                    <h3>Test Results</h3>
                    <button onClick={clearResults} className="clear-btn">
                        Clear Results
                    </button>
                </div>
                <div className="results-list">
                    {results.length === 0 ? (
                        <p className="no-results">No test results yet. Run some tests above!</p>
                    ) : (
                        results.map((result, index) => (
                            <div key={index} className={`result-item ${result.success ? 'success' : 'error'}`}>
                                <div className="result-header">
                                    <span className="result-type">{result.type}</span>
                                    <span className="result-status">
                                        {result.success ? '✅ Success' : '❌ Failed'}
                                    </span>
                                    <span className="result-time">
                                        {result.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="result-message">{result.message}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="demo-section">
                <h3>Current Notification Count</h3>
                <p>Unread notifications: {notificationService.getUnreadCount()}</p>
                <p>Total notifications: {notificationService.notifications.length}</p>
            </div>
        </div>
    );
};

export default NotificationDemo;
