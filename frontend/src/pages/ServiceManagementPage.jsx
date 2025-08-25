import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/translations';
import './ServiceManagementPage.css';

export default function ServiceManagementPage() {
    const { name } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const { isDark } = useTheme();

    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingService, setEditingService] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: 30,
        price: 0,
        category: ''
    });

    const durationOptions = [15, 30, 45, 60, 90, 120, 180, 240]; // Minutes
    const categoryOptions = [
        'CONSULTATION',
        'TREATMENT',
        'PROCEDURE',
        'THERAPY',
        'SESSION',
        'CLASS',
        'WORKSHOP',
        'OTHER'
    ];

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setIsLoading(true);

            // TODO: Replace with actual API call when user authentication is implemented
            // For now, fetch all services
            const response = await fetch('/api/services');
            if (response.ok) {
                const servicesData = await response.json();
                setServices(servicesData);
            } else {
                console.error('Failed to fetch services');
                setServices([]);
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching services:', error);
            setServices([]);
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'duration' || name === 'price' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || formData.price <= 0) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setIsSaving(true);

            // TODO: Replace with actual user ID when authentication is implemented
            const providerId = 1; // Temporary fallback

            if (editingService) {
                // Update existing service
                const response = await fetch(
                    `/api/services/${editingService.id}?providerId=${providerId}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    }
                );

                if (response.ok) {
                    // Update local state
                    setServices(prev => prev.map(service =>
                        service.id === editingService.id
                            ? { ...service, ...formData }
                            : service
                    ));
                } else {
                    console.error('Failed to update service');
                }
            } else {
                // Create new service
                const response = await fetch(
                    `/api/services?providerId=${providerId}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    }
                );

                if (response.ok) {
                    const newService = await response.json();
                    setServices(prev => [...prev, newService]);
                } else {
                    console.error('Failed to create service');
                }
            }

            resetForm();
            setShowAddForm(false);
            setIsSaving(false);
        } catch (error) {
            console.error('Error saving service:', error);
            setIsSaving(false);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description || '',
            duration: service.durationMinutes,
            price: service.price,
            category: service.category || ''
        });
        setShowAddForm(true);
    };

    const handleDelete = async (serviceId) => {
        if (!window.confirm('Are you sure you want to delete this service?')) {
            return;
        }

        try {
            // TODO: Replace with actual user ID when authentication is implemented
            const providerId = 1; // Temporary fallback

            const response = await fetch(
                `/api/services/${serviceId}?providerId=${providerId}`,
                {
                    method: 'DELETE'
                }
            );

            if (response.ok) {
                // Remove from local state
                setServices(prev => prev.filter(service => service.id !== serviceId));
            } else {
                console.error('Failed to delete service');
            }
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            duration: 30,
            price: 0,
            category: ''
        });
        setEditingService(null);
    };

    const cancelForm = () => {
        resetForm();
        setShowAddForm(false);
    };

    if (isLoading) {
        return (
            <div className="service-management-page">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>{t('loading', locale)}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="service-management-page">
            <div className="service-management-header">
                <div className="header-content">
                    <h1>Manage Your Services</h1>
                    <p>Create and manage the services you offer to customers</p>
                    {name && <p className="user-greeting">Welcome, {name}!</p>}
                </div>
            </div>

            <div className="service-management-container">
                <div className="services-header">
                    <h2>Your Services</h2>
                    <button
                        className="add-service-btn"
                        onClick={() => setShowAddForm(true)}
                    >
                        + Add New Service
                    </button>
                </div>

                {showAddForm && (
                    <div className="service-form-container">
                        <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                        <form onSubmit={handleSubmit} className="service-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Service Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Consultation, Treatment, etc."
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="category">Category</label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Category</option>
                                        {categoryOptions.map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe what this service includes..."
                                    rows="3"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="duration">Duration (minutes) *</label>
                                    <select
                                        id="duration"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {durationOptions.map(duration => (
                                            <option key={duration} value={duration}>
                                                {duration} minutes
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="price">Price ($) *</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={cancelForm}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : (editingService ? 'Update Service' : 'Add Service')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="services-list">
                    {services.length > 0 ? (
                        services.map(service => (
                            <div key={service.id} className="service-card">
                                <div className="service-info">
                                    <h3>{service.name}</h3>
                                    {service.category && (
                                        <span className="service-category">{service.category}</span>
                                    )}
                                    {service.description && (
                                        <p className="service-description">{service.description}</p>
                                    )}
                                    <div className="service-details">
                                        <span className="service-duration">{service.durationMinutes} minutes</span>
                                        <span className="service-price">${service.price}</span>
                                    </div>
                                </div>
                                <div className="service-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(service)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(service.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-services">
                            <p>No services created yet</p>
                            <p className="empty-services-subtitle">
                                Start by adding your first service to begin accepting bookings
                            </p>
                        </div>
                    )}
                </div>

                <div className="page-actions">
                    <button
                        className="back-btn"
                        onClick={() => navigate('/provider')}
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
