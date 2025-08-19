package com.rihal.AppointmentScheduler.service;

import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final AppointmentRepository appointmentRepository;
    private static final Duration DEFAULT_DURATION = Duration.ofMinutes(30);

    public BookingService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Appointment book(UUID customerId, UUID providerId, LocalDate date, LocalTime startTime) {
        List<Appointment> sameDay =
                appointmentRepository.findByProviderIdAndDateAndStatus(providerId, date, "BOOKED");

        boolean taken = sameDay.stream().anyMatch(a -> a.getStartTime().equals(startTime));
        if (taken) throw new IllegalStateException("Slot already booked.");

        Appointment appt = new Appointment();
        appt.setCustomerId(customerId);
        appt.setProviderId(providerId);
        appt.setDate(date);
        appt.setStartTime(startTime);
        appt.setEndTime(startTime.plus(DEFAULT_DURATION));
        appt.setStatus("BOOKED");
        return appointmentRepository.save(appt);
    }

    /** Cancel an existing appointment by ID (marks status = CANCELLED). */
    public Appointment cancel(UUID appointmentId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found: " + appointmentId));
        if (!"CANCELLED".equalsIgnoreCase(appt.getStatus())) {
            appt.setStatus("CANCELLED");
            appt = appointmentRepository.save(appt);
        }
        return appt;
    }

    /** reschedule appointment. */
    public Appointment rescheduleAppointment(UUID appointmentId, UUID requesterId, boolean isProviderOrAdmin, RescheduleRequest req) {
    Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));

    // Check authorization
    if (!appointment.getCustomer().getId().equals(requesterId) && !isProviderOrAdmin) {
        throw new RuntimeException("Unauthorized reschedule attempt");
    }

    // Check overlap
    boolean overlap = appointmentRepository.existsOverlap(
            appointment.getProvider().getId(),
            req.getNewDate(),
            req.getNewStartTime(),
            req.getNewEndTime(),
            appointment.getId()
    );
    if (overlap) {
        throw new RuntimeException("Selected slot is already booked");
    }

    // Apply new values
    appointment.setDate(req.getNewDate());
    appointment.setStartTime(req.getNewStartTime());
    appointment.setEndTime(req.getNewEndTime());

    return appointmentRepository.save(appointment);
}

}
