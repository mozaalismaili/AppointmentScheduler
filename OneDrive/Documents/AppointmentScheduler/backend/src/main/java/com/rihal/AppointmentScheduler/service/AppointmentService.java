package com.rihal.AppointmentScheduler.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.model.NotificationLog.Channel;
import com.rihal.AppointmentScheduler.repository.AppointmentRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;
    
    // Configurable cancellation limits
    private static final int DEFAULT_CANCELLATION_LIMIT_HOURS = 24;
    private static final int GRACE_PERIOD_MINUTES = 15; // Allow small grace period

    public AppointmentService(AppointmentRepository appointmentRepository,
                              NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.notificationService = notificationService;
    }

    public String cancelAppointment(UUID appointmentId, UUID userId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // 1. Check if appointment belongs to the customer
        if (!appt.getCustomerId().equals(userId)) {
            throw new RuntimeException("You can only cancel your own appointments.");
        }

        // 2. Check if already cancelled
        if (appt.getStatus() == Appointment.Status.CANCELLED) {
            throw new RuntimeException("Appointment is already cancelled.");
        }

        // 3. Enhanced time validation with grace period
        LocalDateTime startDateTime = LocalDateTime.of(appt.getDate(), appt.getStartTime());
        LocalDateTime now = LocalDateTime.now();
        
        // Check if appointment is in the past
        if (startDateTime.isBefore(now)) {
            throw new RuntimeException("Cannot cancel past appointments.");
        }
        
        // Get provider-specific cancellation policy (default to 24 hours)
        int cancellationLimitHours = getProviderCancellationPolicy(appt.getProviderId());
        
        Duration timeUntilStart = Duration.between(now, startDateTime);
        long hoursBefore = timeUntilStart.toHours();
        
        if (hoursBefore < cancellationLimitHours) {
            // Check grace period
            long minutesBefore = timeUntilStart.toMinutes();
            if (minutesBefore < (cancellationLimitHours * 60 + GRACE_PERIOD_MINUTES)) {
                throw new RuntimeException("Cancellations must be made at least " 
                    + cancellationLimitHours + " hours before start time.");
            }
        }

        // 4. Cancel appointment
        appt.setStatus(Appointment.Status.CANCELLED);
        appointmentRepository.save(appt);

        // 5. Log notification for cancellation (DB only; actual sending can be added later)
        String subject = "Appointment Cancelled";
        String content = "Your appointment on " + appt.getDate() + " at " + appt.getStartTime() + " has been cancelled.";
        notificationService.logSent(
                "APPOINTMENT_CANCELLED",
                Channel.IN_APP,
                appt.getCustomerId(),
                appt.getId(),
                subject,
                content,
                null
        );

        return "Appointment cancelled successfully.";
    }
    
    public Appointment getAppointmentById(UUID id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }
    
    public List<Appointment> getAppointmentsByCustomer(UUID customerId) {
        return appointmentRepository.findByCustomerId(customerId);
    }
    
    public List<Appointment> getAppointmentsByProvider(UUID providerId) {
        return appointmentRepository.findByProviderId(providerId);
    }
    
    // Get provider-specific cancellation policy
    private int getProviderCancellationPolicy(UUID providerId) {
        // TODO: Implement provider-specific policies from database
        // For now, return default policy
        return DEFAULT_CANCELLATION_LIMIT_HOURS;
    }
}
