package com.rihal.AppointmentScheduler.service;

import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class BookingService {

    private final AppointmentRepository appointmentRepository;
    private static final int CANCELLATION_LIMIT_HOURS = 24;

    public BookingService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public void cancel(UUID appointmentId, UUID customerId, boolean isProviderOrAdmin) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appt.getStatus() == Appointment.Status.CANCELLED) {
            throw new RuntimeException("Appointment already cancelled.");
        }

        // ✅ Customer must match
        if (!isProviderOrAdmin && !appt.getCustomerId().equals(customerId)) {
            throw new RuntimeException("You can only cancel your own appointments.");
        }

        // ✅ Time validation (skip if provider/admin)
        LocalDateTime start = LocalDateTime.of(appt.getDate(), appt.getStartTime());
        long hoursBefore = Duration.between(LocalDateTime.now(), start).toHours();

        if (!isProviderOrAdmin && hoursBefore < CANCELLATION_LIMIT_HOURS) {
            throw new RuntimeException("Must cancel at least " + CANCELLATION_LIMIT_HOURS + " hours before start.");
        }

        appt.setStatus(Appointment.Status.CANCELLED);
        appointmentRepository.save(appt);
    }
}
