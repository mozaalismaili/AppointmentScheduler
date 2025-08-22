package com.rihal.AppointmentScheduler.service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rihal.AppointmentScheduler.config.AppointmentConfig;
import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.model.Availability;
import com.rihal.AppointmentScheduler.repository.AppointmentRepository;
import com.rihal.AppointmentScheduler.repository.AvailabilityRepository;

@Service
public class SlotService {

    private final AvailabilityRepository availabilityRepository;
    private final AppointmentRepository appointmentRepository;
    private final AppointmentConfig config;

    private static final Duration STEP_DEFAULT = Duration.ofMinutes(30);

    public SlotService(AvailabilityRepository availabilityRepository,
                       AppointmentRepository appointmentRepository,
                       AppointmentConfig config) {
        this.availabilityRepository = availabilityRepository;
        this.appointmentRepository = appointmentRepository;
        this.config = config;
    }

    public List<LocalTime> getSlots(UUID providerId, LocalDate date) {
        // For now, use the default provider since we're in single-provider MVP mode
        // In the future, this should map UUID to actual User ID
        Long providerLong = config.getDefaultProviderNumericId();
        
        List<Availability> availabilities = availabilityRepository
                .findByProviderIdAndDayOfWeek(providerLong, date.getDayOfWeek());

        if (availabilities.isEmpty()) {
            // If no availability is set, return default business hours for demonstration
            // This allows customers to see time slots even before providers set their availability
            return getDefaultSlots(date);
        }

        Availability availability = availabilities.get(0);

        Duration step = Duration.ofMinutes(
                availability.getSlotDurationMinutes() != null ? availability.getSlotDurationMinutes() : (int) STEP_DEFAULT.toMinutes()
        );

        List<LocalTime> allSlots = enumerate(availability.getStartTime(), availability.getEndTime(), step);

        // Use the provided providerId for appointment lookup
        List<Appointment> booked = appointmentRepository
                .findByProviderIdAndDateAndStatus(providerId, date, Appointment.Status.BOOKED);

        Set<LocalTime> taken = booked.stream()
                .map(Appointment::getStartTime)
                .collect(Collectors.toSet());

        return allSlots.stream().filter(t -> !taken.contains(t)).toList();
    }

    private List<LocalTime> enumerate(LocalTime start, LocalTime end, Duration step) {
        List<LocalTime> times = new ArrayList<>();
        for (LocalTime t = start; !t.plus(step).isAfter(end); t = t.plus(step)) {
            times.add(t);
        }
        return times;
    }

    private List<LocalTime> getDefaultSlots(LocalDate date) {
        // Return default business hours: 9 AM to 5 PM with 30-minute slots
        // Only for weekdays (Monday to Friday)
        if (date.getDayOfWeek().getValue() > 5) { // Saturday = 6, Sunday = 7
            return List.of(); // No slots on weekends
        }
        
        LocalTime startTime = LocalTime.of(9, 0); // 9:00 AM
        LocalTime endTime = LocalTime.of(17, 0);  // 5:00 PM
        Duration step = Duration.ofMinutes(30);
        
        return enumerate(startTime, endTime, step);
    }
}
