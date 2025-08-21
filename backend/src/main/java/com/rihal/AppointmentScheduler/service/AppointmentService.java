package com.rihal.AppointmentScheduler.service;

import com.rihal.AppointmentScheduler.dto.BookingRequest;
import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.model.AppointmentStatus;
import com.rihal.AppointmentScheduler.model.NotificationLog.Channel;
import com.rihal.AppointmentScheduler.repository.AppointmentRepository;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

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

    // --- DTO-based retrieval methods ---
    public Page<AppointmentDTO> getForCustomer(Long customerId, AppointmentStatus status,
                                               LocalDateTime from, LocalDateTime to,
                                               Pageable pageable) {
        return appointmentRepository.searchCustomer(customerId, status, from, to, pageable)
                                    .map(AppointmentDTO::from);
    }

    public Page<AppointmentDTO> getForProvider(Long providerId, AppointmentStatus status,
                                               LocalDateTime from, LocalDateTime to,
                                               Pageable pageable) {
        return appointmentRepository.searchProvider(providerId, status, from, to, pageable)
                                    .map(AppointmentDTO::from);
    }

    // --- Appointment cancellation logic ---
    public String cancelAppointment(UUID appointmentId, UUID userId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appt.getCustomerId().equals(userId)) {
            throw new RuntimeException("You can only cancel your own appointments.");
        }

        if (appt.getStatus() == Appointment.Status.CANCELLED) {
            throw new RuntimeException("Appointment is already cancelled.");
        }

        LocalDateTime startDateTime = LocalDateTime.of(appt.getDate(), appt.getStartTime());
        LocalDateTime now = LocalDateTime.now();

        if (startDateTime.isBefore(now)) {
            throw new RuntimeException("Cannot cancel past appointments.");
        }

        int cancellationLimitHours = getProviderCancellationPolicy(appt.getProviderId());
        Duration timeUntilStart = Duration.between(now, startDateTime);
        long hoursBefore = timeUntilStart.toHours();

        if (hoursBefore < cancellationLimitHours) {
            long minutesBefore = timeUntilStart.toMinutes();
            if (minutesBefore < (cancellationLimitHours * 60 + GRACE_PERIOD_MINUTES)) {
                throw new RuntimeException("Cancellations must be made at least " 
                    + cancellationLimitHours + " hours before start time.");
            }
        }

        appt.setStatus(Appointment.Status.CANCELLED);
        appointmentRepository.save(appt);

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

    // --- Helper & retrieval methods ---
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

    private int getProviderCancellationPolicy(UUID providerId) {
        // TODO: Implement provider-specific policies from database
        return DEFAULT_CANCELLATION_LIMIT_HOURS;
    }
}
