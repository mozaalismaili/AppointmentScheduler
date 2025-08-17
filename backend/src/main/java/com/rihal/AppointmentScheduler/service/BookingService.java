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
}
